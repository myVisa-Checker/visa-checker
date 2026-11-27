/* Host & Go : Worker « visa-hostgo » — offres d'accueil (publication, consultation filtrée, signalement, modération, accès gratuit / déblocage).
   NON DÉPLOYÉ : le formulaire hôte ne l'appelle que si HG_CONFIG.apiEnabled est vrai (faux par défaut). Configuration : worker/wrangler.hostgo.toml (liaison KV « KV » dédiée).

   Réglages (Cloudflare > Worker > Settings) :
     SECRET          (Secret)  longue phrase au hasard : hache les adresses IP, les jetons et les e-mails
     ADMIN_KEY       (Secret)  clé de modération et de fabrication des codes de déblocage
     ALLOWED_ORIGIN  (Texte, optionnel)  adresses autorisées séparées par des virgules ; défaut : checkmyvisa.org et www
   Liaison KV : nom de variable  KV

   Routes (préfixe /hg) :
     GET  /hg/health
     POST /hg/offers                     publier une offre (en attente de modération) -> {id, editToken, status}. Identifiant de demande `sid` obligatoire :
                                         l'offre et le jeton en sont dérivés (nouvel essai après coupure = même offre, jamais de doublon)
     POST /hg/travellers                 inscrire un voyageur {email, consent} : un e-mail est hôte OU voyageur, jamais les deux (409 role_conflict)
     POST|DELETE /hg/offers/:id/photos[/:n]   (X-Edit-Token) photos : corps binaire jpeg/png/webp, vérifié par signature et structure, métadonnées retirées
     GET  /hg/offers/:id/photos/:n       photo d'une offre approuvée
     GET  /hg/offers?country=&cat=&maxStay=&lang=&trav=&page=   offres approuvées (résumés, sans coordonnées)
     GET  /hg/offers/:id                 détail public d'une offre approuvée (sans e-mail, adresse ni note privée)
     PATCH|DELETE /hg/offers/:id         gérer son offre (en-tête X-Edit-Token) ; toute modification repasse en modération
     POST /hg/offers/:id/report          signaler une offre {reason, note} (3 signalements distincts => masquée)
     POST /hg/session                    jeton visiteur (3 coordonnées gratuites)
     POST /hg/offers/:id/contact         (Bearer) coordonnées de l'hôte : gratuites dans le quota, sinon 402 « unlock_required »
     POST /hg/unlock {code}              (Bearer) active l'accès illimité avec un code à usage unique
     GET  /hg/admin/queue?status=        (X-Admin-Key) file de modération
     POST /hg/admin/offers/:id/(approve|reject|hide|remove)   (X-Admin-Key) {note}
     POST /hg/admin/codes {n, days}      (X-Admin-Key) fabrique des codes de déblocage (affichés une seule fois)
   Le paiement en ligne (Konnect / Flouci) n'est PAS branché : un futur paiement créera simplement des codes ou activera l'accès. */

const DEFAULT_ORIGINS = "https://checkmyvisa.org,https://www.checkmyvisa.org";
const COUNTRIES = ["tn", "ma", "dz", "fr", "de", "it", "es", "pt", "be", "nl", "ie", "other"];
const CATS = ["family", "farm", "garden", "guesthouse", "exchange", "pets"];
/* Les 12 types d'aide du formulaire -> les 6 catégories validées */
const TYPE_TO_CAT = ["garden", "farm", "pets", "family", "family", "exchange", "guesthouse", "family", "exchange", "family", "family", "pets"];
const REASONS = ["spam", "fake", "unsafe", "inappropriate", "scam", "other"];
const STATUSES = ["pending", "approved", "rejected", "hidden", "removed"];
const MAX_PHOTO = 2 * 1024 * 1024, MAX_PHOTOS = 10, MAX_PHOTOS_TOTAL = 10 * 1024 * 1024, MAX_PIXELS = 40e6, MAX_BODY = 20000, PAGE_SIZE = 20, SCAN_MAX = 5, REPORT_HIDE_AT = 3, FREE_CONTACTS = 3;
const LIM = { sid: /^hg-[0-9a-f]{16}$/, name: 60, city: 80, addr: 160, zip: 12, pv: 300, email: 254, long: 700, mid: 500, note: 300 };
const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((x) => x.toString(16).padStart(2, "0")).join("");
const sha256 = async (t) => hex(await crypto.subtle.digest("SHA-256", enc.encode(t)));
const rnd = (n) => hex(crypto.getRandomValues(new Uint8Array(n)));
const now = () => Date.now();

function origins(env) { return String(env.ALLOWED_ORIGIN || DEFAULT_ORIGINS).split(",").map((s) => s.trim()).filter(Boolean); }
function cors(req, env) {
  const o = req.headers.get("Origin"), h = { "Vary": "Origin", "X-Content-Type-Options": "nosniff", "Cache-Control": "no-store" };
  if (o && origins(env).includes(o)) { h["Access-Control-Allow-Origin"] = o; h["Access-Control-Allow-Headers"] = "Content-Type, Authorization, X-Edit-Token, X-Admin-Key"; h["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"; h["Access-Control-Max-Age"] = "600"; }
  return h;
}
const json = (req, env, data, status = 200, extra = {}) => new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...cors(req, env), ...extra } });
const fail = (req, env, status, error) => json(req, env, { ok: false, error }, status);

/* ---------- Validation : tout est borné, typé et filtré ; rien n'est copié tel quel ---------- */
const str = (v, max) => (typeof v === "string" ? v.replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "").trim().slice(0, max) : "");
const int = (v, min, max) => (Number.isInteger(v) && v >= min && v <= max ? v : null);
const intList = (a, max, len) => { const o = []; if (Array.isArray(a)) for (const x of a) { const n = int(x, 0, max); if (n !== null && !o.includes(n) && o.length < len) o.push(n); } return o.sort((p, q) => p - q); };
const emailOk = (e) => e.length <= LIM.email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
function cleanCal(c) {
  const out = {}; if (!c || typeof c !== "object") return out;
  for (const y of Object.keys(c)) { const yy = int(+y, 2000, 2200); if (yy === null || !c[y] || typeof c[y] !== "object") continue; for (const m of Object.keys(c[y])) { const mm = int(+m, 0, 11), st = int(c[y][m], 1, 3); if (mm !== null && st !== null) (out[yy] = out[yy] || {})[mm] = st; } }
  return out;
}
/* Corps d'une offre -> { offer } ou { error }. partial = vrai pour PATCH (seuls les champs présents sont contrôlés). */
function readOffer(b, partial) {
  if (!b || typeof b !== "object" || Array.isArray(b)) return { error: "bad_body" };
  const o = {}, has = (k) => b[k] !== undefined;
  if (!partial || has("email")) { o.email = str(b.email, LIM.email).toLowerCase(); if (!emailOk(o.email)) return { error: "bad_email" }; }
  if (!partial || has("firstName")) { o.firstName = str(b.firstName, LIM.name); if (!o.firstName) return { error: "bad_name" }; }
  if (!partial || has("city")) { o.city = str(b.city, LIM.city); if (!o.city) return { error: "bad_city" }; }
  if (!partial || has("country")) { o.country = String(b.country || "").toLowerCase(); if (!COUNTRIES.includes(o.country)) return { error: "bad_country" }; }
  if (!partial || has("addr")) { o.addr = str(b.addr, LIM.addr); if (o.addr.length < 5) return { error: "bad_address" }; }
  if (has("zip")) o.zip = str(b.zip, LIM.zip);
  if (has("pv")) o.pv = str(b.pv, LIM.pv);
  if (!partial || has("cats") || has("types")) {
    let cats = Array.isArray(b.cats) ? [...new Set(b.cats.filter((c) => CATS.includes(c)))] : [];
    if (!cats.length && Array.isArray(b.types)) cats = [...new Set(intList(b.types, 11, 12).map((i) => TYPE_TO_CAT[i]))];
    if (!cats.length) return { error: "bad_categories" }; o.cats = cats;
  }
  if (has("types")) o.types = intList(b.types, 11, 12);
  for (const [k, max] of [["hours", 2], ["days", 2], ["stay", 5]]) if (!partial || has(k)) { const n = b[k] === undefined ? 0 : int(b[k], 0, max); if (n === null) return { error: "bad_" + k }; o[k] = n; }
  if (has("langs")) o.langs = (Array.isArray(b.langs) ? b.langs.slice(0, 10) : []).map((r) => (Array.isArray(r) && int(r[0], 0, 9) !== null && int(r[1], 0, 3) !== null ? [r[0], r[1]] : null)).filter(Boolean);
  if (has("lxOn")) o.lxOn = b.lxOn === true;
  if (has("amen")) o.amen = intList(b.amen, 3, 4);
  if (has("trav")) o.trav = intList(b.trav, 3, 4);
  if (has("cal")) o.cal = cleanCal(b.cal);
  if (!partial || has("texts")) {
    const t = b.texts && typeof b.texts === "object" ? b.texts : {}; o.texts = {};
    for (const [k, max, req] of [["place", LIM.long, 1], ["stay", LIM.mid, 1], ["help", LIM.long, 1], ["culture", LIM.mid, 1], ["intro", LIM.long, 1], ["info", LIM.mid, 0]]) {
      const v = str(t[k], max); if (req && v.length < 20) return { error: "bad_text_" + k }; if (v) o.texts[k] = v;
    }
  }
  return { offer: o };
}
/* ---------- Photos : le type réel est lu dans le fichier (signature + structure), jamais déduit de l'extension ni de l'en-tête ---------- */
const cat8 = (parts) => { let n = 0; for (const p of parts) n += p.length; const o = new Uint8Array(n); let i = 0; for (const p of parts) { o.set(p, i); i += p.length; } return o; };
const u32 = (b, i) => ((b[i] << 24) | (b[i + 1] << 16) | (b[i + 2] << 8) | b[i + 3]) >>> 0;
const ascii = (b, i, n) => String.fromCharCode(...b.subarray(i, i + n));
const JPEG_DROP = new Set([0xE1, 0xE3, 0xE4, 0xE5, 0xE6, 0xE7, 0xE8, 0xE9, 0xEA, 0xEB, 0xEC, 0xED, 0xEF, 0xFE]);   /* EXIF/XMP, IPTC, commentaires… ; on garde JFIF (E0), profil ICC (E2) et Adobe (EE) */
function parseJpeg(b) {
  if (b.length < 4 || b[0] !== 0xFF || b[1] !== 0xD8 || b[2] !== 0xFF) return null;
  const out = [b.subarray(0, 2)]; let i = 2, w = 0, h = 0, sof = false;
  while (i < b.length) {
    if (b[i] !== 0xFF) return null; while (i < b.length && b[i] === 0xFF) i++; const mk = b[i++];
    if (mk === 0xD9) return null;                                   /* fin d'image avant les données : fichier invalide */
    if (mk === 0x01 || (mk >= 0xD0 && mk <= 0xD7)) { out.push(Uint8Array.of(0xFF, mk)); continue; }
    if (i + 2 > b.length) return null; const len = (b[i] << 8) | b[i + 1]; if (len < 2 || i + len > b.length) return null;
    if (mk >= 0xC0 && mk <= 0xCF && mk !== 0xC4 && mk !== 0xC8 && mk !== 0xCC) { if (len < 8) return null; h = (b[i + 3] << 8) | b[i + 4]; w = (b[i + 5] << 8) | b[i + 6]; sof = true; }
    if (mk === 0xDA) {                                              /* début des données : le reste doit finir par EOI (rien après : pas de fichier « polyglotte ») */
      const rest = b.subarray(i - 2); if (!sof || rest[rest.length - 2] !== 0xFF || rest[rest.length - 1] !== 0xD9) return null;
      out.push(rest); return { w, h, bytes: cat8(out) };
    }
    if (!JPEG_DROP.has(mk)) out.push(b.subarray(i - 2, i + len)); i += len;
  }
  return null;
}
const PNG_DROP = new Set(["tEXt", "iTXt", "zTXt", "eXIf", "tIME"]);
function parsePng(b) {
  const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]; if (b.length < 45 || sig.some((v, k) => b[k] !== v)) return null;
  const out = [b.subarray(0, 8)]; let i = 8, w = 0, h = 0, idat = false, iend = false, first = true;
  while (i + 12 <= b.length) {
    const len = u32(b, i), type = ascii(b, i + 4, 4); if (len > b.length || i + 12 + len > b.length || !/^[A-Za-z]{4}$/.test(type)) return null;
    if (first) { if (type !== "IHDR" || len !== 13) return null; w = u32(b, i + 8); h = u32(b, i + 12); first = false; }
    if (type === "IDAT") idat = true;
    if (!PNG_DROP.has(type)) out.push(b.subarray(i, i + 12 + len));
    i += 12 + len; if (type === "IEND") { iend = true; break; }
  }
  if (!iend || !idat || i !== b.length || !w || !h) return null; return { w, h, bytes: cat8(out) };
}
function parseWebp(b) {
  if (b.length < 20 || ascii(b, 0, 4) !== "RIFF" || ascii(b, 8, 4) !== "WEBP") return null;
  const size = (b[4] | (b[5] << 8) | (b[6] << 16) | (b[7] << 24)) >>> 0; if (size + 8 !== b.length && size + 9 !== b.length) return null;
  const le = (i) => b[i] | (b[i + 1] << 8) | (b[i + 2] << 16) | ((b[i + 3] << 24) >>> 0); const out = []; let i = 12, w = 0, h = 0, first = true;
  while (i + 8 <= b.length) {
    const t = ascii(b, i, 4), len = le(i + 4) >>> 0, end = i + 8 + len; if (end > b.length) return null;
    if (first) {
      if (!["VP8 ", "VP8L", "VP8X"].includes(t)) return null; first = false;
      if (t === "VP8X") { if (len < 10) return null; w = 1 + (b[i + 12] | (b[i + 13] << 8) | (b[i + 14] << 16)); h = 1 + (b[i + 15] | (b[i + 16] << 8) | (b[i + 17] << 16)); }
      else if (t === "VP8L") { if (len < 5 || b[i + 8] !== 0x2F) return null; w = 1 + (b[i + 9] | ((b[i + 10] & 0x3F) << 8)); h = 1 + ((b[i + 10] >> 6) | (b[i + 11] << 2) | ((b[i + 12] & 0x0F) << 10)); }
      else { if (len < 10 || b[i + 11] !== 0x9D || b[i + 12] !== 0x01 || b[i + 13] !== 0x2A) return null; w = (b[i + 14] | (b[i + 15] << 8)) & 0x3FFF; h = (b[i + 16] | (b[i + 17] << 8)) & 0x3FFF; }
    }
    if (t !== "EXIF" && t !== "XMP ") { const c = b.slice(i, Math.min(end + (len & 1), b.length)); if (t === "VP8X") c[8] &= ~0x0C; out.push(c); }
    i = end + (len & 1);
  }
  if (first || !w || !h) return null; const body = cat8(out), res = new Uint8Array(12 + body.length); res.set(b.subarray(0, 4), 0);
  const total = 4 + body.length; res[4] = total & 255; res[5] = (total >> 8) & 255; res[6] = (total >> 16) & 255; res[7] = (total >>> 24) & 255; res.set(b.subarray(8, 12), 8); res.set(body, 12);
  return { w, h, bytes: res };
}
/* -> { type, mime, w, h, bytes } (métadonnées retirées) ou { error } */
function inspectImage(b) {
  let type = null, r = null;
  if (b.length >= 3 && b[0] === 0xFF && b[1] === 0xD8) { type = "jpeg"; r = parseJpeg(b); }
  else if (b.length >= 8 && b[0] === 0x89 && ascii(b, 1, 3) === "PNG") { type = "png"; r = parsePng(b); }
  else if (b.length >= 12 && ascii(b, 0, 4) === "RIFF" && ascii(b, 8, 4) === "WEBP") { type = "webp"; r = parseWebp(b); }
  if (!type) return { error: "unsupported_type" };
  if (!r) return { error: "corrupt_image" };
  if (r.w * r.h > MAX_PIXELS) return { error: "image_too_large" };
  return { type, mime: "image/" + type, w: r.w, h: r.h, bytes: r.bytes };
}

function publicView(o, full) {
  const v = { id: o.id, country: o.country, city: o.city, cats: o.cats, hours: o.hours, days: o.days, stay: o.stay, langs: o.langs || [], lxOn: !!o.lxOn, amen: o.amen || [], trav: o.trav || [], firstName: o.firstName, date: new Date(o.createdAt).toISOString().slice(0, 10) };
  const ph = o.photos || []; v.photoCount = ph.length;
  if (full) { v.cal = o.cal || {}; v.texts = o.texts; v.photos = ph.map((p) => ({ n: p.n, c: p.c })); } else { v.excerpt = (o.texts && o.texts.place || "").slice(0, 140); v.cover = ph.length ? ph[0].n : null; }
  return v;
}
const meta = (o) => ({ s: o.status, c: o.country, k: o.cats, st: o.stay, l: (o.langs || []).map((r) => r[0]), tv: o.trav || [], ts: o.createdAt });
const saveOffer = (env, o) => env.KV.put("o:" + o.id, JSON.stringify(o), { metadata: meta(o) });
async function loadOffer(env, id) { if (!/^[0-9a-f]{20}$/.test(id)) return null; const raw = await env.KV.get("o:" + id); try { return raw ? JSON.parse(raw) : null; } catch (e) { return null; } }

/* ---------- Limites, identité, accès ---------- */
const emailHashOf = async (env, email) => sha256("e|" + email + (env.SECRET || ""));
const ipOf = async (req, env) => (await sha256((req.headers.get("CF-Connecting-IP") || "0") + "|" + (env.SECRET || ""))).slice(0, 16);
async function limit(env, key, max, windowSec) {
  const k = "rl:" + key, n = parseInt((await env.KV.get(k)) || "0", 10) || 0;
  if (n >= max) return false; await env.KV.put(k, String(n + 1), { expirationTtl: Math.max(60, windowSec) }); return true;
}
async function readJson(req) {
  const len = parseInt(req.headers.get("Content-Length") || "0", 10); if (len > MAX_BODY) return { tooBig: true };
  const text = await req.text(); if (text.length > MAX_BODY) return { tooBig: true };
  try { return { body: JSON.parse(text || "{}") }; } catch (e) { return { bad: true }; }
}
async function isAdmin(req, env) {
  const key = req.headers.get("X-Admin-Key") || ""; if (!env.ADMIN_KEY || !key) return false;
  return (await sha256("a|" + key)) === (await sha256("a|" + env.ADMIN_KEY));
}
const bearer = (req) => { const m = /^Bearer ([0-9a-f]{48})$/.exec(req.headers.get("Authorization") || ""); return m ? m[1] : ""; };
const visitorKey = async (env, token) => "v:" + (await sha256(token + (env.SECRET || ""))).slice(0, 64);

async function handle(req, env) {
  const url = new URL(req.url), path = url.pathname.replace(/\/+$/, ""), m = req.method;
  if (m === "OPTIONS") return new Response(null, { status: 204, headers: cors(req, env) });
  const o = req.headers.get("Origin"); if (o && m !== "GET" && !origins(env).includes(o)) return fail(req, env, 403, "origin");
  if (!path.startsWith("/hg")) return fail(req, env, 404, "not_found");
  if (path === "/hg/health" && m === "GET") return json(req, env, { ok: true, service: "visa-hostgo" });
  const ip = await ipOf(req, env);
  let r;

  /* ----- Administration ----- */
  if (path.startsWith("/hg/admin/")) {
    if (!(await limit(env, "adm:" + ip, 60, 900))) return fail(req, env, 429, "rate");
    if (!(await isAdmin(req, env))) { await limit(env, "admbad:" + ip, 10, 900) ; return fail(req, env, 401, "admin"); }
    if (path === "/hg/admin/queue" && m === "GET") {
      const st = url.searchParams.get("status") || "pending"; if (!STATUSES.includes(st)) return fail(req, env, 400, "bad_status");
      const all = await scan(env), ids = all.filter((k) => k.metadata && k.metadata.s === st).sort((a, b) => a.metadata.ts - b.metadata.ts).slice(0, 50);
      const items = []; for (const k of ids) { const x = await loadOffer(env, k.name.slice(2)); if (x) { const { tk, emailHash, ...rest } = x; items.push(rest); } }
      return json(req, env, { ok: true, items });
    }
    if (path === "/hg/admin/codes" && m === "POST") {
      r = await readJson(req); if (!r.body) return fail(req, env, 400, "bad_body");
      const n = int(r.body.n, 1, 50), days = int(r.body.days, 1, 365); if (n === null || days === null) return fail(req, env, 400, "bad_params");
      const codes = []; for (let i = 0; i < n; i++) { const c = rnd(6).toUpperCase(); codes.push(c); await env.KV.put("c:" + (await sha256(c + (env.SECRET || ""))), JSON.stringify({ days, createdAt: now() })); }
      return json(req, env, { ok: true, codes, days });
    }
    const ap = /^\/hg\/admin\/offers\/([0-9a-f]{20})\/photos\/([0-9])$/.exec(path);
    if (ap && m === "GET") { const off = await loadOffer(env, ap[1]); if (!off) return fail(req, env, 404, "not_found"); return photoResponse(req, env, off, +ap[2], "private, no-store"); }
    const a = /^\/hg\/admin\/offers\/([0-9a-f]{20})\/(approve|reject|hide|remove)$/.exec(path);
    if (a && m === "POST") {
      const off = await loadOffer(env, a[1]); if (!off) return fail(req, env, 404, "not_found");
      r = await readJson(req); const note = str(r.body && r.body.note, LIM.note);
      off.status = { approve: "approved", reject: "rejected", hide: "hidden", remove: "removed" }[a[2]]; off.updatedAt = now();
      (off.notes = off.notes || []).push({ ts: now(), action: a[2], note }); off.notes = off.notes.slice(-20);
      if (a[2] === "approve") { off.reports = []; }
      if (a[2] === "remove") { await purgePhotos(env, off); scrub(off); }
      await saveOffer(env, off); if (a[2] === "remove") await env.KV.delete("e:" + off.emailHash);
      return json(req, env, { ok: true, id: off.id, status: off.status });
    }
    return fail(req, env, 404, "not_found");
  }

  /* ----- Publication ----- */
  if (path === "/hg/offers" && m === "POST") {
    if (!(await limit(env, "pub:" + ip, 5, 3600))) return fail(req, env, 429, "rate");
    r = await readJson(req); if (r.tooBig) return fail(req, env, 413, "too_big"); if (!r.body) return fail(req, env, 400, "bad_body");
    const b = r.body; if (b.hp) return json(req, env, { ok: true, id: "0".repeat(20), status: "pending" });   /* leurre anti-robot : succès factice, rien n'est enregistré */
    if (!LIM.sid.test(String(b.sid || ""))) return fail(req, env, 400, "bad_sid");
    if (b.consent !== true) return fail(req, env, 400, "consent_required");
    const id = (await sha256("o|" + b.sid + (env.SECRET || ""))).slice(0, 20), token = (await sha256("tk|" + b.sid + (env.SECRET || ""))).slice(0, 48);
    const ex = await loadOffer(env, id);
    if (ex) {                                                       /* nouvel essai (réponse perdue, double envoi) : on renvoie la même offre, sans rien écrire */
      if (ex.status === "removed") return fail(req, env, 409, "sid_used");
      const em = str(b.email, LIM.email).toLowerCase();
      if (!em || (await emailHashOf(env, em)) !== ex.emailHash) return fail(req, env, 409, "sid_used");
      return json(req, env, { ok: true, id, editToken: token, status: ex.status, duplicate: true });
    }
    const parsed = readOffer(b, false); if (parsed.error) return fail(req, env, 400, parsed.error);
    const emailHash = await emailHashOf(env, parsed.offer.email);
    if (await env.KV.get("t:" + emailHash)) return fail(req, env, 409, "role_conflict");
    const taken = await env.KV.get("e:" + emailHash); if (taken && taken !== id) return fail(req, env, 409, "already_registered");
    const off = { ...parsed.offer, id, sid: b.sid, emailHash, tk: await sha256(token + (env.SECRET || "")), status: "pending", createdAt: now(), updatedAt: now(), reports: [], photos: [], lang: ["fr", "en", "ar"].includes(b.lang) ? b.lang : "fr" };
    off.hours = off.hours || 0; off.days = off.days || 0; off.stay = off.stay || 0;
    await env.KV.put("e:" + emailHash, id); await saveOffer(env, off);
    return json(req, env, { ok: true, id, editToken: token, status: "pending" }, 201);
  }

  /* ----- Consultation ----- */
  if (path === "/hg/offers" && m === "GET") {
    const q = url.searchParams, f = {
      country: q.get("country"), cat: q.get("cat"), maxStay: q.get("maxStay") === null || q.get("maxStay") === "" ? null : +q.get("maxStay"),
      lang: q.get("lang") === null || q.get("lang") === "" ? null : +q.get("lang"), trav: q.get("trav") === null || q.get("trav") === "" ? null : +q.get("trav"), page: Math.max(0, parseInt(q.get("page") || "0", 10) || 0)
    };
    if (f.country && !COUNTRIES.includes(f.country)) return fail(req, env, 400, "bad_country");
    if (f.cat && !CATS.includes(f.cat)) return fail(req, env, 400, "bad_cat");
    if ((f.maxStay !== null && int(f.maxStay, 0, 5) === null) || (f.lang !== null && int(f.lang, 0, 9) === null) || (f.trav !== null && int(f.trav, 0, 3) === null)) return fail(req, env, 400, "bad_filter");
    const rows = (await scan(env)).filter((k) => { const d = k.metadata; return d && d.s === "approved" && (!f.country || d.c === f.country) && (!f.cat || (d.k || []).includes(f.cat)) && (f.maxStay === null || d.st <= f.maxStay) && (f.lang === null || (d.l || []).includes(f.lang)) && (f.trav === null || (d.tv || []).includes(f.trav)); })
      .sort((a, b) => b.metadata.ts - a.metadata.ts);
    const slice = rows.slice(f.page * PAGE_SIZE, f.page * PAGE_SIZE + PAGE_SIZE), items = [];
    for (const k of slice) { const x = await loadOffer(env, k.name.slice(2)); if (x && x.status === "approved") items.push(publicView(x, false)); }
    return json(req, env, { ok: true, items, total: rows.length, page: f.page, pageSize: PAGE_SIZE }, 200, { "Cache-Control": "public, max-age=60" });
  }
  let a = /^\/hg\/offers\/([0-9a-f]{20})$/.exec(path);
  if (a && m === "GET") { const off = await loadOffer(env, a[1]); if (!off || off.status !== "approved") return fail(req, env, 404, "not_found"); return json(req, env, { ok: true, offer: publicView(off, true) }, 200, { "Cache-Control": "public, max-age=60" }); }

  /* ----- Inscription voyageur : un e-mail ne peut pas être à la fois hôte et voyageur ----- */
  if (path === "/hg/travellers" && m === "POST") {
    if (!(await limit(env, "trv:" + ip, 10, 3600))) return fail(req, env, 429, "rate");
    r = await readJson(req); if (r.tooBig) return fail(req, env, 413, "too_big"); if (!r.body || typeof r.body !== "object") return fail(req, env, 400, "bad_body");
    if (r.body.hp) return json(req, env, { ok: true });
    const em = str(r.body.email, LIM.email).toLowerCase(); if (!emailOk(em)) return fail(req, env, 400, "bad_email"); if (r.body.consent !== true) return fail(req, env, 400, "consent_required");
    const h = await emailHashOf(env, em); if (await env.KV.get("e:" + h)) return fail(req, env, 409, "role_conflict");
    await env.KV.put("t:" + h, String(now())); return json(req, env, { ok: true });
  }

  /* ----- Photos ----- */
  let pa = /^\/hg\/offers\/([0-9a-f]{20})\/photos(?:\/([0-9]))?$/.exec(path);
  if (pa && m === "GET" && pa[2] !== undefined) {
    const off = await loadOffer(env, pa[1]); if (!off || off.status !== "approved") return fail(req, env, 404, "not_found");
    return photoResponse(req, env, off, +pa[2], "public, max-age=300");
  }
  if (pa && (m === "POST" || m === "DELETE")) {
    if (!(await limit(env, "ph:" + ip, 120, 3600))) return fail(req, env, 429, "rate");
    const off = await loadOffer(env, pa[1]), tok = req.headers.get("X-Edit-Token") || "";
    if (!off || off.status === "removed" || off.status === "rejected" || !/^[0-9a-f]{48}$/.test(tok) || (await sha256(tok + (env.SECRET || ""))) !== off.tk) return fail(req, env, 404, "not_found");
    off.photos = off.photos || [];
    if (m === "DELETE") {
      if (pa[2] === undefined) return fail(req, env, 400, "bad_photo"); const n = +pa[2], k = off.photos.findIndex((p) => p.n === n); if (k < 0) return fail(req, env, 404, "not_found");
      off.photos.splice(k, 1); await env.KV.delete("p:" + off.id + ":" + n); if (off.status !== "pending") off.status = "pending"; off.updatedAt = now(); await saveOffer(env, off); return json(req, env, { ok: true, photos: off.photos.length });
    }
    if (pa[2] !== undefined) return fail(req, env, 404, "not_found");
    const len = parseInt(req.headers.get("Content-Length") || "", 10);
    if (!Number.isFinite(len)) return fail(req, env, 411, "length_required"); if (len > MAX_PHOTO) return fail(req, env, 413, "photo_too_large"); if (len < 1) return fail(req, env, 400, "empty_photo");
    const buf = new Uint8Array(await req.arrayBuffer()); if (buf.length > MAX_PHOTO) return fail(req, env, 413, "photo_too_large");
    const info = inspectImage(buf); if (info.error) return fail(req, env, info.error === "image_too_large" ? 413 : info.error === "unsupported_type" ? 415 : 400, info.error);
    const declared = (req.headers.get("Content-Type") || "").split(";")[0].trim().toLowerCase(); if (declared !== info.mime) return fail(req, env, 415, "type_mismatch");
    const hash = hex(await crypto.subtle.digest("SHA-256", info.bytes)).slice(0, 32);
    const dup = off.photos.find((p) => p.h === hash); if (dup) return json(req, env, { ok: true, n: dup.n, duplicate: true, photos: off.photos.length });
    if (off.photos.length >= MAX_PHOTOS) return fail(req, env, 409, "too_many_photos");
    if (off.photos.reduce((t, p) => t + p.s, 0) + info.bytes.length > MAX_PHOTOS_TOTAL) return fail(req, env, 413, "photos_total_too_large");
    let n = 0; while (off.photos.some((p) => p.n === n)) n++;
    const c = Math.max(0, Math.min(9, parseInt(url.searchParams.get("cat") || "0", 10) || 0));
    await env.KV.put("p:" + off.id + ":" + n, info.bytes, { metadata: { t: info.type, s: info.bytes.length } });
    off.photos.push({ n, t: info.type, s: info.bytes.length, c, h: hash }); off.photos.sort((x, y) => x.n - y.n);
    if (off.status !== "pending") off.status = "pending"; off.updatedAt = now(); await saveOffer(env, off);
    return json(req, env, { ok: true, n, photos: off.photos.length }, 201);
  }

  /* ----- Gestion par l'hôte ----- */
  if (a && (m === "PATCH" || m === "DELETE")) {
    if (!(await limit(env, "own:" + ip, 30, 3600))) return fail(req, env, 429, "rate");
    const off = await loadOffer(env, a[1]), tok = req.headers.get("X-Edit-Token") || "";
    if (!off || off.status === "removed" || !/^[0-9a-f]{48}$/.test(tok) || (await sha256(tok + (env.SECRET || ""))) !== off.tk) return fail(req, env, 404, "not_found");
    if (m === "DELETE") { off.status = "removed"; off.updatedAt = now(); await purgePhotos(env, off); scrub(off); await saveOffer(env, off); await env.KV.delete("e:" + off.emailHash); return json(req, env, { ok: true, status: "removed" }); }
    r = await readJson(req); if (r.tooBig) return fail(req, env, 413, "too_big"); if (!r.body) return fail(req, env, 400, "bad_body");
    if (r.body.email !== undefined || r.body.sid !== undefined) return fail(req, env, 400, "immutable_field");
    const parsed = readOffer(r.body, true); if (parsed.error) return fail(req, env, 400, parsed.error);
    Object.assign(off, parsed.offer); off.status = "pending"; off.updatedAt = now(); await saveOffer(env, off);
    return json(req, env, { ok: true, status: "pending" });
  }

  /* ----- Signalement ----- */
  a = /^\/hg\/offers\/([0-9a-f]{20})\/report$/.exec(path);
  if (a && m === "POST") {
    if (!(await limit(env, "rep:" + ip, 10, 3600))) return fail(req, env, 429, "rate");
    r = await readJson(req); if (!r.body) return fail(req, env, 400, "bad_body");
    const reason = String(r.body.reason || ""); if (!REASONS.includes(reason)) return fail(req, env, 400, "bad_reason");
    const off = await loadOffer(env, a[1]); if (!off || off.status === "removed" || off.status === "rejected") return fail(req, env, 404, "not_found");
    const dk = "rd:" + off.id + ":" + ip; if (await env.KV.get(dk)) return json(req, env, { ok: true, duplicate: true });
    await env.KV.put(dk, "1", { expirationTtl: 30 * 86400 });
    off.reports = (off.reports || []).slice(-19); off.reports.push({ ts: now(), reason, note: str(r.body.note, LIM.note) });
    let hidden = false; if (off.status === "approved" && off.reports.length >= REPORT_HIDE_AT) { off.status = "hidden"; hidden = true; }
    off.updatedAt = now(); await saveOffer(env, off);
    return json(req, env, { ok: true, hidden });
  }

  /* ----- Accès : session gratuite, coordonnées, déblocage ----- */
  if (path === "/hg/session" && m === "POST") {
    if (!(await limit(env, "ses:" + ip, 5, 86400))) return fail(req, env, 429, "rate");
    const token = rnd(24); await env.KV.put(await visitorKey(env, token), JSON.stringify({ free: FREE_CONTACTS, revealed: [], until: 0, createdAt: now() }), { expirationTtl: 400 * 86400 });
    return json(req, env, { ok: true, token, freeContacts: FREE_CONTACTS });
  }
  if (path === "/hg/unlock" && m === "POST") {
    const token = bearer(req); if (!token) return fail(req, env, 401, "session");
    if (!(await limit(env, "unl:" + ip, 10, 3600))) return fail(req, env, 429, "rate");
    const vk = await visitorKey(env, token), raw = await env.KV.get(vk); if (!raw) return fail(req, env, 401, "session");
    r = await readJson(req); const code = String((r.body && r.body.code) || "").toUpperCase(); if (!/^[0-9A-F]{12}$/.test(code)) return fail(req, env, 400, "bad_code");
    const ck = "c:" + (await sha256(code + (env.SECRET || ""))), c = await env.KV.get(ck); if (!c) return fail(req, env, 404, "invalid_code");
    const info = JSON.parse(c), v = JSON.parse(raw); await env.KV.delete(ck);
    v.until = Math.max(v.until || 0, now()) + info.days * 86400000; await env.KV.put(vk, JSON.stringify(v), { expirationTtl: 400 * 86400 });
    return json(req, env, { ok: true, until: new Date(v.until).toISOString() });
  }
  a = /^\/hg\/offers\/([0-9a-f]{20})\/contact$/.exec(path);
  if (a && m === "POST") {
    const token = bearer(req); if (!token) return fail(req, env, 401, "session");
    if (!(await limit(env, "ct:" + ip, 60, 3600))) return fail(req, env, 429, "rate");
    const vk = await visitorKey(env, token), raw = await env.KV.get(vk); if (!raw) return fail(req, env, 401, "session");
    const off = await loadOffer(env, a[1]); if (!off || off.status !== "approved") return fail(req, env, 404, "not_found");
    const v = JSON.parse(raw), unlocked = (v.until || 0) > now(), already = v.revealed.includes(off.id);
    if (!unlocked && !already) {
      if (v.free <= 0) return json(req, env, { ok: false, error: "unlock_required", freeContacts: 0 }, 402);
      v.free -= 1; v.revealed.push(off.id); await env.KV.put(vk, JSON.stringify(v), { expirationTtl: 400 * 86400 });
    }
    return json(req, env, { ok: true, contact: { firstName: off.firstName, email: off.email }, freeContacts: unlocked ? null : v.free });
  }
  return fail(req, env, 404, "not_found");
}

async function photoResponse(req, env, off, n, cache) {
  const p = (off.photos || []).find((x) => x.n === n); if (!p) return fail(req, env, 404, "not_found");
  const data = await env.KV.get("p:" + off.id + ":" + n, "arrayBuffer"); if (!data) return fail(req, env, 404, "not_found");
  return new Response(data, { status: 200, headers: { ...cors(req, env), "Content-Type": "image/" + p.t, "Cache-Control": cache, "Content-Disposition": "inline", "Content-Security-Policy": "default-src 'none'; sandbox", "Cross-Origin-Resource-Policy": "cross-origin" } });
}

/* Liste toutes les offres (clé + métadonnées) : suffisant pour quelques milliers d'offres ; au-delà, passer à D1. */
async function scan(env) {
  const out = []; let cursor;
  for (let i = 0; i < SCAN_MAX; i++) { const r = await env.KV.list({ prefix: "o:", cursor, limit: 1000 }); out.push(...r.keys); if (r.list_complete || !r.cursor) break; cursor = r.cursor; }
  return out;
}
/* Retrait : les données personnelles sont effacées, seule la trace de modération reste. */
function scrub(o) { for (const k of ["email", "addr", "zip", "pv"]) delete o[k]; o.firstName = ""; o.texts = {}; o.photos = []; }
async function purgePhotos(env, o) { for (const p of o.photos || []) await env.KV.delete("p:" + o.id + ":" + p.n); }

export default {
  async fetch(req, env) {
    try { return await handle(req, env); } catch (e) { return new Response(JSON.stringify({ ok: false, error: "server" }), { status: 500, headers: { "Content-Type": "application/json", ...cors(req, env) } }); }
  }
};
export { COUNTRIES, CATS, TYPE_TO_CAT, inspectImage };
