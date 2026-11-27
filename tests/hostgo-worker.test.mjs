// Tests du Worker Host & Go (offres : publication, consultation, signalement, modération, accès). KV simulé en mémoire.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../worker/hostgo-worker.js", import.meta.url), "utf8");
const { default: worker, TYPE_TO_CAT, CATS } = await import("data:text/javascript;base64," + Buffer.from(source, "utf8").toString("base64"));

const ORIGIN = "https://checkmyvisa.org";
function fakeKV() {
  const m = new Map();
  return { m,
    async get(k, type) { if (!m.has(k)) return null; const v = m.get(k).v; return type === "arrayBuffer" ? (v instanceof Uint8Array ? v.slice().buffer : new TextEncoder().encode(v).buffer) : (v instanceof Uint8Array ? new TextDecoder().decode(v) : v); },
    async put(k, v, o = {}) { m.set(k, { v: v instanceof Uint8Array ? v.slice() : String(v), metadata: o.metadata, ttl: o.expirationTtl }); },
    async delete(k) { m.delete(k); },
    async list({ prefix = "", limit = 1000 } = {}) { const keys = [...m.entries()].filter(([k]) => k.startsWith(prefix)).slice(0, limit).map(([name, e]) => ({ name, metadata: e.metadata })); return { keys, list_complete: true }; } };
}
const mkEnv = () => ({ KV: fakeKV(), SECRET: "secret-test-phrase", ADMIN_KEY: "admin-test-key" });
let ipN = 0;
async function call(env, path, { method = "GET", body, headers = {}, ip, rawBody } = {}) {
  const res = await worker.fetch(new Request("https://hg.test" + path, { method, headers: { Origin: ORIGIN, "CF-Connecting-IP": ip || "198.51.100." + ((ipN++ % 250) + 1), ...headers, ...(body === undefined || rawBody ? {} : { "Content-Type": "application/json" }), ...headers }, body: rawBody ? rawBody : body === undefined ? undefined : JSON.stringify(body) }), env);
  let data = null; try { data = await res.json(); } catch (e) { /* corps vide */ }
  return { status: res.status, data, headers: res.headers };
}
const T = (s) => (s + " — texte suffisamment long pour être valide.").slice(0, 600);
const sidN = (n) => "hg-" + String(n).padStart(16, "0").replace(/\d/g, (d) => "0123456789"[d]).slice(-16);
const offer = (n, extra = {}) => ({ sid: sidN(n), consent: true, email: `hote${n}@example.com`, firstName: "Sami", city: "Béja", country: "tn", addr: "12 rue des Oliviers", zip: "9000", pv: "note privée", cats: ["farm"], hours: 1, days: 2, stay: 2, langs: [[0, 3], [2, 1]], amen: [0, 1], trav: [1], cal: { 2026: { 3: 3 } }, texts: { place: T("Ferme"), stay: T("Chambre"), help: T("Aide"), culture: T("Culture"), intro: T("Présentation") }, ...extra });
const ADMIN = { "X-Admin-Key": "admin-test-key" };
async function publish(env, n, extra) { const r = await call(env, "/hg/offers", { method: "POST", body: offer(n, extra) }); assert.equal(r.status, 201, JSON.stringify(r.data)); return r.data; }
async function approve(env, id) { const r = await call(env, `/hg/admin/offers/${id}/approve`, { method: "POST", headers: ADMIN, body: {} }); assert.equal(r.status, 200); }

let n = 0; const t = async (name, fn) => { await fn(); n++; console.log("  ok   " + name); };
console.log("Worker Host & Go");

await t("les 12 types d'aide du formulaire correspondent aux 6 catégories validées", () => { assert.equal(TYPE_TO_CAT.length, 12); assert.ok(TYPE_TO_CAT.every((c) => CATS.includes(c))); assert.equal(CATS.length, 6); assert.deepEqual(new Set(TYPE_TO_CAT), new Set(CATS)); });

await t("publication : offre créée en attente, jeton de gestion affiché une seule fois, rien de public", async () => {
  const env = mkEnv(); const r = await publish(env, 1);
  assert.equal(r.status, "pending"); assert.match(r.editToken, /^[0-9a-f]{48}$/); assert.match(r.id, /^[0-9a-f]{20}$/);
  assert.ok(!JSON.stringify([...env.KV.m.values()]).includes(r.editToken), "le jeton ne doit pas être stocké en clair");
  assert.equal((await call(env, "/hg/offers")).data.items.length, 0);
  assert.equal((await call(env, "/hg/offers/" + r.id)).status, 404);
});

await t("publication : le type d'aide du formulaire donne la catégorie", async () => {
  const env = mkEnv(); const r = await call(env, "/hg/offers", { method: "POST", body: offer(2, { cats: undefined, types: [2, 11, 0] }) });
  assert.equal(r.status, 201); await approve(env, r.data.id);
  const d = (await call(env, "/hg/offers/" + r.data.id)).data.offer; assert.deepEqual(d.cats.sort(), ["garden", "pets"]);
});

await t("anti-doublon : même identifiant de demande = même offre et même jeton (réponse perdue) ; même e-mail ailleurs = refus", async () => {
  const env = mkEnv(); const a = await publish(env, 3);
  const again = await call(env, "/hg/offers", { method: "POST", body: offer(3) });
  assert.equal(again.status, 200); assert.equal(again.data.id, a.id); assert.equal(again.data.duplicate, true); assert.equal(again.data.editToken, a.editToken);
  const other = await call(env, "/hg/offers", { method: "POST", body: offer(4, { email: "HOTE3@example.com" }) });
  assert.equal(other.status, 409); assert.equal(other.data.error, "already_registered");
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("o:")).length, 1);
});

await t("anti-doublon : le même identifiant avec un autre e-mail ne révèle pas le jeton", async () => {
  const env = mkEnv(); await publish(env, 3);
  const r = await call(env, "/hg/offers", { method: "POST", body: offer(3, { email: "intrus@example.com" }) });
  assert.equal(r.status, 409); assert.equal(r.data.error, "sid_used"); assert.equal(r.data.editToken, undefined);
  const r2 = await call(env, "/hg/offers", { method: "POST", body: { ...offer(3), email: undefined } }); assert.equal(r2.status, 409); assert.equal(r2.data.editToken, undefined);
});

await t("anti-doublon : 8 envois simultanés du même identifiant ne créent qu'une offre, jamais écrasée après approbation", async () => {
  const env = mkEnv(); const rs = await Promise.all(Array.from({ length: 8 }, (_, i) => call(env, "/hg/offers", { method: "POST", ip: "198.51.100." + (100 + i), body: offer(200) })));
  assert.ok(rs.every((r) => r.status === 201 || r.status === 200)); assert.equal(new Set(rs.map((r) => r.data.id)).size, 1);
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("o:")).length, 1);
  await approve(env, rs[0].data.id); const late = await call(env, "/hg/offers", { method: "POST", body: offer(200) });
  assert.equal(late.data.status, "approved"); assert.equal(late.data.duplicate, true);
  assert.equal((await call(env, "/hg/offers")).data.items.length, 1);
});

await t("anti-doublon : un identifiant d'offre retirée ne peut pas être réutilisé", async () => {
  const env = mkEnv(); const a = await publish(env, 3); await call(env, "/hg/offers/" + a.id, { method: "DELETE", headers: { "X-Edit-Token": a.editToken } });
  const r = await call(env, "/hg/offers", { method: "POST", body: offer(3) }); assert.equal(r.status, 409); assert.equal(r.data.error, "sid_used");
});

await t("validation : champs obligatoires, consentement, pays, textes, bornes", async () => {
  const env = mkEnv();
  const bad = async (extra, err, k = 10) => { const r = await call(env, "/hg/offers", { method: "POST", body: offer(k, extra) }); assert.equal(r.status, 400, err); assert.equal(r.data.error, err); };
  await bad({ consent: false }, "consent_required"); await bad({ sid: "x" }, "bad_sid"); await bad({ email: "pas-un-mail" }, "bad_email");
  await bad({ country: "xx" }, "bad_country"); await bad({ cats: ["castle"], types: undefined }, "bad_categories"); await bad({ firstName: "  " }, "bad_name");
  await bad({ addr: "ab" }, "bad_address"); await bad({ stay: 9 }, "bad_stay"); await bad({ texts: { ...offer(1).texts, place: "court" } }, "bad_text_place");
  const r = await call(env, "/hg/offers", { method: "POST", body: [] }); assert.equal(r.status, 400);
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("o:")).length, 0);
});

await t("validation : champs inconnus ignorés, textes tronqués, aucune injection de statut", async () => {
  const env = mkEnv(); const r = await publish(env, 5, { status: "approved", id: "ffffffffffffffffffff", role: "admin", texts: { ...offer(5).texts, place: "<img src=x onerror=1>" + "a".repeat(2000) } });
  const q = await call(env, "/hg/admin/queue", { headers: ADMIN }); const it = q.data.items[0];
  assert.equal(it.status, "pending"); assert.notEqual(it.id, "ffffffffffffffffffff"); assert.equal(it.role, undefined); assert.equal(it.texts.place.length, 700);
  assert.equal(r.status, "pending");
});

await t("leurre anti-robot : champ caché rempli => succès factice, rien d'enregistré", async () => {
  const env = mkEnv(); const r = await call(env, "/hg/offers", { method: "POST", body: offer(6, { hp: "http://spam" }) });
  assert.equal(r.status, 200); assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("o:")).length, 0);
});

await t("modération : file, approbation, puis consultation publique sans coordonnées", async () => {
  const env = mkEnv(); const a = await publish(env, 7);
  assert.equal((await call(env, "/hg/admin/queue")).status, 401); assert.equal((await call(env, "/hg/admin/queue", { headers: { "X-Admin-Key": "faux" } })).status, 401);
  const q = await call(env, "/hg/admin/queue", { headers: ADMIN }); assert.equal(q.data.items.length, 1); assert.equal(q.data.items[0].email, "hote7@example.com"); assert.equal(q.data.items[0].tk, undefined);
  await approve(env, a.id);
  const list = (await call(env, "/hg/offers")).data; assert.equal(list.items.length, 1);
  const pub = JSON.stringify([list.items[0], (await call(env, "/hg/offers/" + a.id)).data]);
  for (const secret of ["hote7@example.com", "Oliviers", "9000", "note privée", "tk", "emailHash"]) assert.ok(!pub.includes(secret), "fuite : " + secret);
  assert.equal(JSON.parse(pub)[1].offer.texts.place.startsWith("Ferme"), true);
});

await t("modération : refus et retrait ; le retrait efface les données personnelles et libère l'e-mail", async () => {
  const env = mkEnv(); const a = await publish(env, 8); await approve(env, a.id);
  const rm = await call(env, `/hg/admin/offers/${a.id}/remove`, { method: "POST", headers: ADMIN, body: { note: "contenu inapproprié" } }); assert.equal(rm.status, 200);
  const raw = env.KV.m.get("o:" + a.id).v; for (const s of ["hote8@example.com", "Oliviers", "Sami", "note privée"]) assert.ok(!raw.includes(s), s);
  assert.equal((await call(env, "/hg/offers")).data.items.length, 0);
  assert.equal((await call(env, "/hg/offers", { method: "POST", body: offer(9, { email: "hote8@example.com" }) })).status, 201);
  assert.equal((await call(env, `/hg/admin/offers/${"0".repeat(20)}/approve`, { method: "POST", headers: ADMIN, body: {} })).status, 404);
});

await t("consultation : filtres pays, catégorie, séjour, langue, voyageurs ; pagination ; valeurs invalides refusées", async () => {
  const env = mkEnv();
  const defs = [{ country: "tn", cats: ["farm"], stay: 1, langs: [[0, 3]], trav: [0] }, { country: "fr", cats: ["pets", "garden"], stay: 4, langs: [[1, 2]], trav: [1, 2] }, { country: "tn", cats: ["family"], stay: 3, langs: [[2, 3]], trav: [2] }];
  const ids = []; for (let i = 0; i < defs.length; i++) { const r = await publish(env, 20 + i, defs[i]); ids.push(r.id); await approve(env, r.id); }
  const q = async (s) => (await call(env, "/hg/offers?" + s)).data.items.length;
  assert.equal(await q(""), 3); assert.equal(await q("country=tn"), 2); assert.equal(await q("country=fr&cat=pets"), 1); assert.equal(await q("cat=family"), 1);
  assert.equal(await q("maxStay=3"), 2); assert.equal(await q("lang=2"), 1); assert.equal(await q("trav=2"), 2); assert.equal(await q("country=tn&maxStay=1"), 1); assert.equal(await q("country=dz"), 0);
  for (const bad of ["country=zz", "cat=castle", "maxStay=99", "lang=x", "trav=9"]) assert.equal((await call(env, "/hg/offers?" + bad)).status, 400, bad);
  for (let i = 0; i < 25; i++) { const r = await publish(env, 100 + i, { country: "es" }); await approve(env, r.id); }
  const p0 = (await call(env, "/hg/offers?country=es")).data, p1 = (await call(env, "/hg/offers?country=es&page=1")).data;
  assert.equal(p0.items.length, 20); assert.equal(p1.items.length, 5); assert.equal(p0.total, 25);
  assert.equal(new Set([...p0.items, ...p1.items].map((x) => x.id)).size, 25);
});

await t("gestion par l'hôte : jeton requis, modification => nouvelle modération, e-mail non modifiable, suppression", async () => {
  const env = mkEnv(); const a = await publish(env, 30); await approve(env, a.id);
  const H = { "X-Edit-Token": a.editToken };
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "PATCH", body: { city: "Tunis" } })).status, 404);
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: { "X-Edit-Token": "0".repeat(48) }, body: { city: "Tunis" } })).status, 404);
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: H, body: { email: "x@y.fr" } })).data.error, "immutable_field");
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: H, body: { stay: 9 } })).status, 400);
  const ok = await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: H, body: { city: "Tunis", stay: 1 } }); assert.equal(ok.data.status, "pending");
  assert.equal((await call(env, "/hg/offers")).data.items.length, 0);
  await approve(env, a.id); assert.equal((await call(env, "/hg/offers/" + a.id)).data.offer.city, "Tunis");
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "DELETE", headers: H })).data.status, "removed");
  assert.equal((await call(env, "/hg/offers/" + a.id)).status, 404);
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "DELETE", headers: H })).status, 404);
});

await t("signalement : un même appareil ne compte qu'une fois ; 3 signalements distincts masquent l'offre", async () => {
  const env = mkEnv(); const a = await publish(env, 40); await approve(env, a.id);
  const rep = (ip, reason = "scam") => call(env, `/hg/offers/${a.id}/report`, { method: "POST", ip, body: { reason, note: "n" } });
  assert.equal((await rep("203.0.113.1")).data.hidden, false); assert.equal((await rep("203.0.113.1")).data.duplicate, true);
  assert.equal((await rep("203.0.113.2")).data.hidden, false); assert.equal((await call(env, "/hg/offers")).data.items.length, 1);
  assert.equal((await rep("203.0.113.3")).data.hidden, true); assert.equal((await call(env, "/hg/offers")).data.items.length, 0);
  assert.equal((await call(env, "/hg/offers/" + a.id)).status, 404);
  const hid = await call(env, "/hg/admin/queue?status=hidden", { headers: ADMIN }); assert.equal(hid.data.items[0].reports.length, 3);
  await approve(env, a.id); assert.equal((await call(env, "/hg/offers")).data.items.length, 1);
  assert.equal((await call(env, `/hg/offers/${a.id}/report`, { method: "POST", body: { reason: "bof" } })).status, 400);
  assert.equal((await call(env, `/hg/offers/${"1".repeat(20)}/report`, { method: "POST", body: { reason: "spam" } })).status, 404);
});

await t("accès : 3 coordonnées gratuites, la même offre ne consomme qu'une fois, puis déblocage requis", async () => {
  const env = mkEnv(); const ids = [];
  for (let i = 0; i < 5; i++) { const r = await publish(env, 50 + i); await approve(env, r.id); ids.push(r.id); }
  const s = (await call(env, "/hg/session", { method: "POST" })).data; assert.match(s.token, /^[0-9a-f]{48}$/); assert.equal(s.freeContacts, 3);
  const B = { Authorization: "Bearer " + s.token }, ct = (id) => call(env, `/hg/offers/${id}/contact`, { method: "POST", headers: B });
  assert.equal((await call(env, `/hg/offers/${ids[0]}/contact`, { method: "POST" })).status, 401);
  assert.equal((await call(env, `/hg/offers/${ids[0]}/contact`, { method: "POST", headers: { Authorization: "Bearer " + "0".repeat(48) } })).status, 401);
  const c0 = await ct(ids[0]); assert.equal(c0.data.contact.email, "hote50@example.com"); assert.equal(c0.data.freeContacts, 2);
  assert.equal((await ct(ids[0])).data.freeContacts, 2, "même offre : pas de nouveau décompte");
  assert.equal((await ct(ids[1])).data.freeContacts, 1); assert.equal((await ct(ids[2])).data.freeContacts, 0);
  const blocked = await ct(ids[3]); assert.equal(blocked.status, 402); assert.equal(blocked.data.error, "unlock_required"); assert.equal(blocked.data.contact, undefined);
  assert.equal((await ct(ids[0])).status, 200, "déjà débloquée : reste accessible");
  assert.ok(!JSON.stringify([...env.KV.m.entries()].filter(([k]) => k.startsWith("v:"))).includes(s.token));
});

await t("déblocage : code à usage unique fabriqué par l'administrateur, accès illimité pour la durée", async () => {
  const env = mkEnv(); const ids = []; for (let i = 0; i < 5; i++) { const r = await publish(env, 60 + i); await approve(env, r.id); ids.push(r.id); }
  const s = (await call(env, "/hg/session", { method: "POST" })).data, B = { Authorization: "Bearer " + s.token };
  for (let i = 0; i < 3; i++) await call(env, `/hg/offers/${ids[i]}/contact`, { method: "POST", headers: B });
  assert.equal((await call(env, `/hg/offers/${ids[3]}/contact`, { method: "POST", headers: B })).status, 402);
  assert.equal((await call(env, "/hg/admin/codes", { method: "POST", body: { n: 1, days: 30 } })).status, 401);
  assert.equal((await call(env, "/hg/admin/codes", { method: "POST", headers: ADMIN, body: { n: 0, days: 30 } })).status, 400);
  const { codes } = (await call(env, "/hg/admin/codes", { method: "POST", headers: ADMIN, body: { n: 2, days: 30 } })).data; assert.equal(codes.length, 2);
  assert.ok(![...env.KV.m.keys()].some((k) => codes.some((c) => k.includes(c))), "codes jamais stockés en clair");
  assert.equal((await call(env, "/hg/unlock", { method: "POST", headers: B, body: { code: "ABCDEF123456" } })).status, 404);
  assert.equal((await call(env, "/hg/unlock", { method: "POST", headers: B, body: { code: "zz" } })).status, 400);
  assert.equal((await call(env, "/hg/unlock", { method: "POST", body: { code: codes[0] } })).status, 401);
  const u = await call(env, "/hg/unlock", { method: "POST", headers: B, body: { code: codes[0].toLowerCase() } }); assert.equal(u.status, 200); assert.ok(new Date(u.data.until) > new Date(Date.now() + 29 * 86400000));
  assert.equal((await call(env, "/hg/unlock", { method: "POST", headers: B, body: { code: codes[0] } })).status, 404, "usage unique");
  for (const id of ids.slice(3)) assert.equal((await call(env, `/hg/offers/${id}/contact`, { method: "POST", headers: B })).status, 200);
  const s2 = (await call(env, "/hg/session", { method: "POST" })).data;
  assert.equal((await call(env, "/hg/unlock", { method: "POST", headers: { Authorization: "Bearer " + s2.token }, body: { code: codes[0] } })).status, 404);
});

await t("sécurité : origine non autorisée, CORS, méthodes, corps trop gros, JSON invalide, limites de débit", async () => {
  const env = mkEnv();
  const evil = await worker.fetch(new Request("https://hg.test/hg/offers", { method: "POST", headers: { Origin: "https://evil.example", "Content-Type": "application/json" }, body: JSON.stringify(offer(70)) }), env);
  assert.equal(evil.status, 403);
  const ok = await call(env, "/hg/health"); assert.equal(ok.headers.get("Access-Control-Allow-Origin"), ORIGIN); assert.equal(ok.headers.get("X-Content-Type-Options"), "nosniff");
  const pre = await worker.fetch(new Request("https://hg.test/hg/offers", { method: "OPTIONS", headers: { Origin: "https://evil.example" } }), env); assert.equal(pre.headers.get("Access-Control-Allow-Origin"), null);
  assert.equal((await call(env, "/hg/inconnu")).status, 404); assert.equal((await call(env, "/autre")).status, 404);
  const big = await worker.fetch(new Request("https://hg.test/hg/offers", { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json" }, body: "x".repeat(25000) }), env); assert.equal(big.status, 413);
  const bad = await worker.fetch(new Request("https://hg.test/hg/offers", { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json" }, body: "{" }), env); assert.equal(bad.status, 400);
  const e2 = mkEnv(); let last; for (let i = 0; i < 6; i++) last = await call(e2, "/hg/offers", { method: "POST", ip: "192.0.2.9", body: offer(80 + i) }); assert.equal(last.status, 429);
  const e3 = mkEnv(); let r3; for (let i = 0; i < 6; i++) r3 = await call(e3, "/hg/session", { method: "POST", ip: "192.0.2.10" }); assert.equal(r3.status, 429);
  const e4 = { KV: fakeKV(), SECRET: "s" }; assert.equal((await call(e4, "/hg/admin/queue", { headers: { "X-Admin-Key": "x" } })).status, 401, "sans ADMIN_KEY configurée, l'administration est fermée");
  const e5 = { KV: { get() { throw new Error("KV en panne"); } }, SECRET: "s" }; assert.equal((await call(e5, "/hg/offers")).status, 500);
});

await t("aucune route de lecture publique ne renvoie d'offre non approuvée ni d'identifiant interne", async () => {
  const env = mkEnv(); const a = await publish(env, 90); const b = await publish(env, 91); await approve(env, b.id);
  await call(env, `/hg/admin/offers/${b.id}/reject`, { method: "POST", headers: ADMIN, body: { note: "photos manquantes" } });
  for (const x of [a.id, b.id]) assert.equal((await call(env, "/hg/offers/" + x)).status, 404);
  assert.equal((await call(env, "/hg/offers")).data.items.length, 0);
});

/* ---------- Images synthétiques (structure réelle, contenu minimal) ---------- */
const enc = new TextEncoder(), cat = (...a) => { const o = new Uint8Array(a.reduce((n, x) => n + x.length, 0)); let i = 0; for (const x of a) { o.set(x, i); i += x.length; } return o; };
const be16 = (n) => Uint8Array.of(n >> 8, n & 255), be32 = (n) => Uint8Array.of(n >>> 24, (n >> 16) & 255, (n >> 8) & 255, n & 255), le32 = (n) => Uint8Array.of(n & 255, (n >> 8) & 255, (n >> 16) & 255, (n >>> 24) & 255);
const seg = (mk, body) => cat(Uint8Array.of(0xFF, mk), be16(body.length + 2), body);
const jpeg = ({ w = 640, h = 480, exif = true, fill = 8, seed = 1 } = {}) => cat(Uint8Array.of(0xFF, 0xD8), seg(0xE0, enc.encode("JFIF\0\x01\x01\0\0\x01\0\x01\0\0")), exif ? seg(0xE1, enc.encode("Exif\0\0GPS 36.8065N 10.1815E")) : new Uint8Array(0), seg(0xFE, enc.encode("commentaire privé")), seg(0xC0, cat(Uint8Array.of(8), be16(h), be16(w), Uint8Array.of(1, 1, 0x11, 0))), seg(0xDA, Uint8Array.of(1, 1, 0, 0, 0x3F, 0)), Uint8Array.from({ length: fill }, (_, i) => (i * 7 + seed) % 200), Uint8Array.of(0xFF, 0xD9));
const chunk = (type, data) => cat(be32(data.length), enc.encode(type), data, new Uint8Array(4));
const png = ({ w = 8, h = 8, text = true, iend = true, seed = 1 } = {}) => cat(Uint8Array.of(0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A), chunk("IHDR", cat(be32(w), be32(h), Uint8Array.of(8, 2, 0, 0, 0))), text ? chunk("tEXt", enc.encode("Location\0Tunis rue des Oliviers")) : new Uint8Array(0), chunk("IDAT", Uint8Array.of(1, 2, 3, seed)), iend ? chunk("IEND", new Uint8Array(0)) : new Uint8Array(0));
const wchunk = (t, d) => cat(enc.encode(t), le32(d.length), d, d.length & 1 ? Uint8Array.of(0) : new Uint8Array(0));
const webp = ({ exif = true, seed = 1 } = {}) => { const vp8x = wchunk("VP8X", cat(Uint8Array.of(exif ? 0x08 : 0, 0, 0, 0), Uint8Array.of(63, 0, 0), Uint8Array.of(63, 0, 0))), img = wchunk("VP8 ", cat(Uint8Array.of(0, 0, 0, 0x9D, 0x01, 0x2A, 64, 0, 64, 0), Uint8Array.of(seed, 2))), ex = exif ? wchunk("EXIF", enc.encode("GPS 36.8N")) : new Uint8Array(0); const body = cat(enc.encode("WEBP"), vp8x, img, ex); return cat(enc.encode("RIFF"), le32(body.length), body); };
const has = (b, s) => Buffer.from(b).includes(s);
async function upload(env, id, token, bytes, { type = "image/jpeg", cat: c, headers = {}, len = true } = {}) {
  return call(env, `/hg/offers/${id}/photos${c !== undefined ? "?cat=" + c : ""}`, { method: "POST", headers: { "X-Edit-Token": token || "", "Content-Type": type, ...(len ? { "Content-Length": String(bytes.length) } : {}), ...headers }, rawBody: bytes });
}
const rawOf = (env, id, n) => env.KV.m.get(`p:${id}:${n}`).v;

await t("photos : JPEG, PNG et WebP acceptés ; EXIF/GPS, commentaires et métadonnées retirés avant stockage", async () => {
  const env = mkEnv(); const a = await publish(env, 300);
  const j = await upload(env, a.id, a.editToken, jpeg(), { cat: 2 }); assert.equal(j.status, 201); assert.equal(j.data.n, 0);
  const p = await upload(env, a.id, a.editToken, png(), { type: "image/png" }); assert.equal(p.status, 201);
  const w = await upload(env, a.id, a.editToken, webp(), { type: "image/webp" }); assert.equal(w.status, 201); assert.equal(w.data.photos, 3);
  const J = rawOf(env, a.id, 0), P = rawOf(env, a.id, 1), W = rawOf(env, a.id, 2);
  assert.ok(has(J, "JFIF") && !has(J, "Exif") && !has(J, "GPS") && !has(J, "privé"), "JPEG : métadonnées restantes");
  assert.ok(!has(P, "tEXt") && !has(P, "Oliviers") && has(P, "IDAT") && has(P, "IEND"), "PNG : métadonnées restantes");
  assert.ok(!has(W, "EXIF") && !has(W, "GPS") && has(W, "VP8 "), "WebP : métadonnées restantes");
  assert.equal(W[20] & 0x0C, 0, "drapeaux EXIF/XMP du VP8X remis à zéro"); assert.equal(W[4] | (W[5] << 8) | (W[6] << 16), W.length - 8, "taille RIFF cohérente");
  assert.equal(J[0], 0xFF); assert.equal(J[J.length - 1], 0xD9);
});

await t("photos : le type réel prime sur le nom, l'en-tête et l'extension (texte, HTML, SVG, GIF, PDF, exécutable refusés)", async () => {
  const env = mkEnv(); const a = await publish(env, 301);
  const bad = [["texte", enc.encode("ceci n'est pas une image du tout"), "image/jpeg"], ["html", enc.encode("<html><script>alert(1)</script></html>"), "image/png"], ["svg", enc.encode('<svg xmlns="http://www.w3.org/2000/svg" onload="alert(1)"/>'), "image/webp"],
    ["gif", enc.encode("GIF89a\x01\0\x01\0\x80\0\0\0\0\0\xFF\xFF\xFF!\xF9\x04\x01\0\0\0\0,\0\0\0\0\x01\0\x01\0\0\x02\x02D\x01\0;"), "image/jpeg"], ["pdf", enc.encode("%PDF-1.4 ..."), "image/jpeg"], ["exe", cat(enc.encode("MZ"), new Uint8Array(200)), "image/png"]];
  for (const [name, bytes, type] of bad) { const r = await upload(env, a.id, a.editToken, bytes, { type }); assert.equal(r.status, 415, name); assert.equal(r.data.error, "unsupported_type", name); }
  assert.equal((await upload(env, a.id, a.editToken, png(), { type: "image/jpeg" })).data.error, "type_mismatch");
  assert.equal((await upload(env, a.id, a.editToken, jpeg(), { type: "text/html" })).data.error, "type_mismatch");
  assert.equal((await upload(env, a.id, a.editToken, jpeg(), { type: "application/octet-stream" })).data.error, "type_mismatch");
  assert.equal(JSON.parse(await (await call(env, "/hg/admin/queue", { headers: ADMIN })).data.items[0].photos.length), 0);
});

await t("photos : fichiers corrompus, tronqués ou polyglottes refusés", async () => {
  const env = mkEnv(); const a = await publish(env, 302); const bad = async (bytes, type, err, st = 400) => { const r = await upload(env, a.id, a.editToken, bytes, { type }); assert.equal(r.status, st, err); assert.equal(r.data.error, err); };
  const J = jpeg();
  await bad(cat(J, enc.encode("<?php system($_GET[0]); ?>")), "image/jpeg", "corrupt_image");              /* données après la fin d'image */
  await bad(J.subarray(0, J.length - 6), "image/jpeg", "corrupt_image");                                   /* tronqué */
  await bad(cat(Uint8Array.of(0xFF, 0xD8, 0xFF, 0xD9)), "image/jpeg", "corrupt_image");
  await bad(png({ iend: false }), "image/png", "corrupt_image"); await bad(cat(png(), enc.encode("x")), "image/png", "corrupt_image"); await bad(png().subarray(0, 30), "image/png", "corrupt_image");
  const W = webp(); await bad(W.subarray(0, W.length - 3), "image/webp", "corrupt_image"); await bad(cat(enc.encode("RIFF"), le32(4), enc.encode("WEBP")), "image/webp", "corrupt_image");
  await bad(jpeg({ w: 30000, h: 30000 }), "image/jpeg", "image_too_large", 413); await bad(png({ w: 20000, h: 20000 }), "image/png", "image_too_large", 413);
  assert.equal((await upload(env, a.id, a.editToken, new Uint8Array(0), {})).status, 400);
});

await t("photos : taille d'un fichier, taille totale, nombre maximum, longueur obligatoire", async () => {
  const env = mkEnv(); const a = await publish(env, 303);
  assert.equal((await upload(env, a.id, a.editToken, jpeg({ fill: 2 * 1024 * 1024 }))).status, 413);
  assert.equal((await upload(env, a.id, a.editToken, jpeg(), { len: false })).status, 411);
  assert.equal((await upload(env, a.id, a.editToken, jpeg(), { headers: { "Content-Length": String(3 * 1024 * 1024) } })).status, 413, "longueur annoncée trop grande refusée avant lecture");
  for (let i = 0; i < 5; i++) assert.equal((await upload(env, a.id, a.editToken, jpeg({ fill: 1_900_000, seed: i + 1 }))).status, 201, "photo " + i);
  const big = await upload(env, a.id, a.editToken, jpeg({ fill: 1_900_000, seed: 77 })); assert.equal(big.status, 413); assert.equal(big.data.error, "photos_total_too_large");
  const env2 = mkEnv(); const b = await publish(env2, 304);
  for (let i = 0; i < 10; i++) assert.equal((await upload(env2, b.id, b.editToken, jpeg({ seed: i + 1, fill: 20 + i }))).status, 201, "photo " + i);
  const eleventh = await upload(env2, b.id, b.editToken, jpeg({ seed: 99, fill: 99 })); assert.equal(eleventh.status, 409); assert.equal(eleventh.data.error, "too_many_photos");
});

await t("photos : même photo envoyée deux fois = une seule (nouvel essai sans doublon) ; suppression libère la place", async () => {
  const env = mkEnv(); const a = await publish(env, 305);
  const r1 = await upload(env, a.id, a.editToken, jpeg()), r2 = await upload(env, a.id, a.editToken, jpeg({ exif: false }));
  assert.equal(r1.status, 201); assert.equal(r2.status, 200); assert.equal(r2.data.duplicate, true); assert.equal(r2.data.photos, 1);
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("p:")).length, 1);
  assert.equal((await call(env, `/hg/offers/${a.id}/photos/0`, { method: "DELETE", headers: { "X-Edit-Token": a.editToken } })).data.photos, 0);
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("p:")).length, 0);
  assert.equal((await call(env, `/hg/offers/${a.id}/photos/0`, { method: "DELETE", headers: { "X-Edit-Token": a.editToken } })).status, 404);
});

await t("photos : invisibles tant que l'offre n'est pas approuvée ; servies en sécurité ensuite ; modération voit tout", async () => {
  const env = mkEnv(); const a = await publish(env, 306); await upload(env, a.id, a.editToken, jpeg(), { cat: 1 });
  assert.equal((await call(env, `/hg/offers/${a.id}/photos/0`)).status, 404, "offre en attente : photo non publique");
  assert.equal((await call(env, `/hg/admin/offers/${a.id}/photos/0`)).status, 401);
  const adm = await worker.fetch(new Request(`https://hg.test/hg/admin/offers/${a.id}/photos/0`, { headers: { Origin: ORIGIN, ...ADMIN, "CF-Connecting-IP": "1.2.3.4" } }), env); assert.equal(adm.status, 200); assert.equal(adm.headers.get("Content-Type"), "image/jpeg");
  await approve(env, a.id);
  const pub = await worker.fetch(new Request(`https://hg.test/hg/offers/${a.id}/photos/0`, { headers: { "CF-Connecting-IP": "1.2.3.5" } }), env);
  assert.equal(pub.status, 200); assert.equal(pub.headers.get("Content-Type"), "image/jpeg"); assert.equal(pub.headers.get("X-Content-Type-Options"), "nosniff"); assert.match(pub.headers.get("Content-Security-Policy"), /sandbox/); assert.equal((await pub.arrayBuffer()).byteLength, rawOf(env, a.id, 0).length);
  const d = (await call(env, "/hg/offers/" + a.id)).data.offer; assert.deepEqual(d.photos, [{ n: 0, c: 1 }]); assert.equal((await call(env, "/hg/offers")).data.items[0].cover, 0);
  assert.equal((await call(env, `/hg/offers/${a.id}/photos/5`)).status, 404); assert.equal((await call(env, `/hg/offers/${a.id}/photos/x`)).status, 404);
  const raw = JSON.stringify([d, (await call(env, "/hg/offers")).data]); assert.ok(!raw.includes('"h":') && !raw.includes('"s":'), "pas d'empreinte ni de taille interne");
});

await t("photos : modifier les photos d'une offre approuvée la renvoie en modération ; retrait de l'offre efface les photos", async () => {
  const env = mkEnv(); const a = await publish(env, 307); await upload(env, a.id, a.editToken, jpeg()); await approve(env, a.id);
  assert.equal((await call(env, "/hg/offers")).data.items.length, 1);
  await upload(env, a.id, a.editToken, jpeg({ seed: 9, fill: 30 })); assert.equal((await call(env, "/hg/offers")).data.items.length, 0, "nouvelle photo => modération");
  await approve(env, a.id); await call(env, `/hg/admin/offers/${a.id}/remove`, { method: "POST", headers: ADMIN, body: {} });
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("p:")).length, 0); assert.equal((await upload(env, a.id, a.editToken, jpeg())).status, 404);
});

await t("accès non autorisés : photos, gestion et administration refusées sans le bon jeton, y compris entre offres et entre rôles", async () => {
  const env = mkEnv(); const a = await publish(env, 308), b = await publish(env, 309); await approve(env, a.id); await approve(env, b.id);
  const sess = (await call(env, "/hg/session", { method: "POST" })).data.token;
  for (const tok of [undefined, "", "0".repeat(48), sess, b.editToken, "x"]) { assert.equal((await upload(env, a.id, tok, jpeg())).status, 404, "upload " + tok); assert.equal((await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: { "X-Edit-Token": tok || "" }, body: { city: "X" } })).status, 404); assert.equal((await call(env, "/hg/offers/" + a.id, { method: "DELETE", headers: { "X-Edit-Token": tok || "" } })).status, 404); }
  assert.equal((await call(env, `/hg/offers/${a.id}/contact`, { method: "POST", headers: { Authorization: "Bearer " + a.editToken } })).status, 401, "jeton d'hôte inutilisable comme jeton visiteur");
  assert.equal((await call(env, "/hg/admin/queue", { headers: { "X-Admin-Key": a.editToken } })).status, 401); assert.equal((await call(env, "/hg/admin/queue", { headers: { "X-Admin-Key": sess } })).status, 401);
  assert.equal((await call(env, "/hg/unlock", { method: "POST", headers: { Authorization: "Bearer " + a.editToken }, body: { code: "ABCDEF123456" } })).status, 401);
  assert.equal((await call(env, `/hg/admin/offers/${a.id}/approve`, { method: "POST", headers: { "X-Edit-Token": a.editToken }, body: {} })).status, 401, "un hôte ne peut pas approuver");
  assert.equal((await call(env, "/hg/admin/codes", { method: "POST", headers: { Authorization: "Bearer " + sess }, body: { n: 1, days: 1 } })).status, 401);
  const raw = JSON.stringify([...env.KV.m.entries()]); assert.ok(!raw.includes(a.editToken) && !raw.includes(sess), "aucun jeton en clair dans le KV");
});

await t("publication : seul le serveur décide ; ni le client ni l'hôte ne peuvent s'approuver", async () => {
  const env = mkEnv(); const a = await publish(env, 310, { status: "approved", approved: true, role: "admin", photos: [{ n: 0 }], reports: [1, 2, 3], tk: "x" });
  assert.equal((await call(env, "/hg/offers/" + a.id)).status, 404); const q = (await call(env, "/hg/admin/queue", { headers: ADMIN })).data.items[0];
  assert.equal(q.status, "pending"); assert.deepEqual(q.photos, []); assert.deepEqual(q.reports, []);
  const p = await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: { "X-Edit-Token": a.editToken }, body: { status: "approved", city: "Tunis" } }); assert.equal(p.data.status, "pending");
  assert.equal((await call(env, "/hg/offers/" + a.id)).status, 404); await approve(env, a.id); assert.equal((await call(env, "/hg/offers/" + a.id)).status, 200);
});

await t("séparation hôtes / voyageurs : un e-mail est l'un ou l'autre, dans les deux sens, côté serveur", async () => {
  const env = mkEnv(); const reg = (email, extra = {}) => call(env, "/hg/travellers", { method: "POST", body: { email, consent: true, ...extra } });
  assert.equal((await reg("Voyageur@Example.com")).status, 200); assert.equal((await reg("voyageur@example.com")).status, 200, "idempotent");
  const h = await call(env, "/hg/offers", { method: "POST", body: offer(320, { email: "VOYAGEUR@example.com" }) }); assert.equal(h.status, 409); assert.equal(h.data.error, "role_conflict");
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("o:")).length, 0);
  const host = await publish(env, 321); assert.equal((await reg("hote321@example.com")).data.error, "role_conflict");
  assert.equal((await call(env, `/hg/offers/${host.id}`, { method: "DELETE", headers: { "X-Edit-Token": host.editToken } })).status, 200);
  assert.equal((await reg("hote321@example.com")).status, 200, "après retrait de l'offre, l'e-mail est libre");
  assert.equal((await reg("pas-un-mail")).data.error, "bad_email"); assert.equal((await call(env, "/hg/travellers", { method: "POST", body: { email: "a@b.fr" } })).data.error, "consent_required");
  assert.equal((await reg("robot@example.com", { hp: "x" })).status, 200); assert.ok(![...env.KV.m.keys()].some((k) => k.startsWith("t:") && false));
  const raw = JSON.stringify([...env.KV.m.keys()]); assert.ok(!raw.toLowerCase().includes("example.com"), "pas d'e-mail dans les clés");
  const e2 = mkEnv(); let last; for (let i = 0; i < 11; i++) last = await call(e2, "/hg/travellers", { method: "POST", ip: "192.0.2.50", body: { email: `v${i}@example.com`, consent: true } }); assert.equal(last.status, 429);
});


await t("jeton de gestion : valable 30 jours, refusé ensuite (photos et gestion) ; une relance après expiration ne le redonne pas", async () => {
  const env = mkEnv(); const a = await publish(env, 400);
  const k = "o:" + a.id, off = JSON.parse(env.KV.m.get(k).v); off.createdAt -= 31 * 86400000; env.KV.m.set(k, { v: JSON.stringify(off), metadata: env.KV.m.get(k).metadata });
  assert.equal((await upload(env, a.id, a.editToken, jpeg())).status, 404);
  assert.equal((await call(env, "/hg/offers/" + a.id, { method: "PATCH", headers: { "X-Edit-Token": a.editToken }, body: { city: "Tunis" } })).status, 404);
  const again = await call(env, "/hg/offers", { method: "POST", body: offer(400) }); assert.equal(again.status, 200); assert.equal(again.data.editToken, undefined);
});

await t("administration : verrouillage après 10 clés fausses, même avec la bonne clé ensuite", async () => {
  const env = mkEnv(); const ip = "203.0.113.200";
  for (let i = 0; i < 10; i++) assert.equal((await call(env, "/hg/admin/queue", { headers: { "X-Admin-Key": "faux" + i }, ip })).status, 401);
  assert.equal((await call(env, "/hg/admin/queue", { headers: ADMIN, ip })).status, 429);
  assert.equal((await call(env, "/hg/admin/queue", { headers: ADMIN, ip: "203.0.113.201" })).status, 200);
});

await t("administration : toutes les routes refusent sans clé ; liste « signalées » et compteurs ; un retrait est définitif", async () => {
  const env = mkEnv(); const a = await publish(env, 410), b = await publish(env, 411); await approve(env, a.id); await approve(env, b.id);
  for (const [m, pth] of [["GET", "/hg/admin/queue"], ["GET", `/hg/admin/offers/${a.id}/photos/0`], ["POST", `/hg/admin/offers/${a.id}/approve`], ["POST", `/hg/admin/offers/${a.id}/remove`], ["POST", "/hg/admin/codes"]]) assert.equal((await call(env, pth, { method: m, body: m === "POST" ? {} : undefined })).status, 401, pth);
  await call(env, `/hg/offers/${a.id}/report`, { method: "POST", body: { reason: "spam", note: "x" }, ip: "192.0.2.1" });
  const rep = await call(env, "/hg/admin/queue?status=reported", { headers: ADMIN }); assert.equal(rep.data.items.length, 1); assert.equal(rep.data.items[0].id, a.id); assert.equal(rep.data.items[0].reports[0].reason, "spam");
  assert.equal(rep.data.counts.approved, 2); assert.equal(rep.data.counts.reported, 1); assert.ok(!JSON.stringify(rep.data).includes('"tk"') && !JSON.stringify(rep.data).includes("emailHash"));
  assert.equal((await call(env, `/hg/admin/offers/${a.id}/remove`, { method: "POST", headers: ADMIN, body: {} })).status, 200);
  assert.equal((await call(env, `/hg/admin/offers/${a.id}/approve`, { method: "POST", headers: ADMIN, body: {} })).data.error, "already_removed");
  assert.equal((await call(env, "/hg/offers/" + a.id)).status, 404);
});

await t("photos : R2 utilisé quand le binding PHOTOS existe (rien dans KV), lecture publique après approbation, effacement au retrait", async () => {
  const env = mkEnv(), store = new Map();
  env.PHOTOS = { async put(k, v) { store.set(k, new Uint8Array(v)); }, async get(k) { const v = store.get(k); return v ? { arrayBuffer: async () => v.slice().buffer } : null; }, async delete(k) { store.delete(k); } };
  const a = await publish(env, 420); const u = await upload(env, a.id, a.editToken, jpeg()); assert.equal(u.status, 201);
  assert.equal(store.size, 1); assert.ok(![...env.KV.m.keys()].some((k) => k.startsWith("p:")));
  assert.equal((await call(env, `/hg/offers/${a.id}/photos/0`)).status, 404);
  await approve(env, a.id); const g = await call(env, `/hg/offers/${a.id}/photos/0`); assert.equal(g.status, 200); assert.equal(g.headers.get("content-type"), "image/jpeg"); assert.equal(g.headers.get("x-content-type-options"), "nosniff");
  await call(env, `/hg/admin/offers/${a.id}/remove`, { method: "POST", headers: ADMIN, body: {} }); assert.equal(store.size, 0);
});

await t("parcours complet côté serveur : publier → en attente → approuver → visible → détail avec photo → coordonnées protégées → signalements → masquage", async () => {
  const env = mkEnv(); const a = await publish(env, 430); await upload(env, a.id, a.editToken, jpeg());
  assert.equal((await call(env, "/hg/offers")).data.total, 0);
  await approve(env, a.id); const list = await call(env, "/hg/offers"); assert.equal(list.data.items.length, 1); assert.equal(list.data.items[0].cover, 0);
  const det = await call(env, "/hg/offers/" + a.id); assert.equal(det.data.offer.photos.length, 1); assert.ok(!JSON.stringify(det.data).includes("hote430@example.com") && !JSON.stringify(det.data).includes("Oliviers"));
  assert.equal((await call(env, `/hg/offers/${a.id}/contact`, { method: "POST", body: {} })).status, 401);
  const ses = await call(env, "/hg/session", { method: "POST", body: {} }); const ct = await call(env, `/hg/offers/${a.id}/contact`, { method: "POST", headers: { Authorization: "Bearer " + ses.data.token }, body: {} });
  assert.equal(ct.data.contact.email, "hote430@example.com");
  for (let i = 0; i < 3; i++) await call(env, `/hg/offers/${a.id}/report`, { method: "POST", body: { reason: "fake" }, ip: "192.0.2." + (10 + i) });
  assert.equal((await call(env, "/hg/offers")).data.items.length, 0);
  assert.equal((await call(env, "/hg/admin/queue?status=hidden", { headers: ADMIN })).data.items.length, 1);
});

console.log("\n" + n + " tests du Worker Host & Go réussis");
