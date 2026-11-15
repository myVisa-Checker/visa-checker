// Tests d'exécution des durcissements des Workers visa-proxy et visa-chat (audit du 2026-11-15).
// Aucun réseau : KV factice en mémoire, fetch simulé. Lancé par tests/run.mjs.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

async function load(file) {
  const src = await readFile(new URL("../worker/" + file, import.meta.url), "utf8");
  return (await import("data:text/javascript;base64," + Buffer.from(src, "utf8").toString("base64"))).default;
}
const kv = () => {
  const m = new Map();
  return { m, get: async (k, t) => (m.has(k) ? (t === "json" ? JSON.parse(m.get(k)) : m.get(k)) : null), put: async (k, v) => { m.set(k, String(v)); } };
};
const ORIGIN = "https://checkmyvisa.org";
let makeCalls = 0;
globalThis.fetch = async (url) => {
  if (String(url).startsWith("https://make.test")) { makeCalls++; return new Response("ok", { status: 200 }); }
  return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: "ok" }] } }] }), { status: 200 });
};

/* ---------------- visa-proxy ---------------- */
const proxy = await load("visa-proxy-worker.js");
const penv = () => ({ KV: kv(), SECRET: "s".repeat(32), MAKE_URL: "https://make.test/hook", ADMIN_KEY: "admin-key-123", GEMINI_API_KEY: "x" });
const call = (w, env, path, { method = "POST", body, headers = {}, raw } = {}) =>
  w.fetch(new Request("https://w.test" + path, { method, headers: { Origin: ORIGIN, "CF-Connecting-IP": "1.2.3.4", "Content-Type": "application/json", ...headers }, body: raw !== undefined ? raw : body === undefined ? undefined : JSON.stringify(body) }), env);
const order = (over = {}) => ({
  requestId: "REQ12345678", service: "hotel", destination: "Paris", lastName: "Ben Ali", firstName: "Sami", date1: "2027-03-01", date2: "2027-03-05",
  city: "Paris", phone: "+216 58 000 000", telegram: "", email: "sami@example.com", channel: "email", lang: "fr", sentAt: new Date().toISOString(),
  agency: { id: "a1", name: "Agence", email: "a@example.com" }, message: "Ligne 1\nLigne 2", ...over
});

// /admin/code : verrou après 5 clés fausses, même avec la bonne clé ensuite
{
  const env = penv();
  const H = (k) => ({ "X-Admin-Key": k });
  for (let i = 0; i < 5; i++) assert.equal((await call(proxy, env, "/admin/code", { method: "GET", headers: H("wrong") })).status, 403);
  assert.equal((await call(proxy, env, "/admin/code", { method: "GET", headers: H("admin-key-123") })).status, 429, "verrou admin");
  const env2 = penv();
  const ok = await call(proxy, env2, "/admin/code?n=1", { method: "GET", headers: H("admin-key-123") });
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).codes.length, 1);
  // la clé dans l'adresse n'est plus acceptée ; GET sans clé = formulaire, POST du formulaire = codes
  assert.equal((await call(proxy, env2, "/admin/code?key=admin-key-123&n=1", { method: "GET" })).status, 200, "GET sans en-tête = formulaire");
  const page = await (await call(proxy, env2, "/admin/code?key=admin-key-123&n=1", { method: "GET" })).text();
  assert.ok(page.includes("<form") && !page.includes("Codes fabriqués") && !page.includes("\"codes\""), "la clé de l'adresse est ignorée");
  const form = await call(proxy, env2, "/admin/code", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, raw: "key=admin-key-123&kind=pack&n=2&max=3&days=30" });
  assert.equal(form.status, 200);
  assert.ok((await form.text()).includes("Codes fabriqués"));
}
// corps « null » ou tableau → 400, jamais 500
for (const raw of ["null", "[]", "42"]) {
  const env = penv();
  assert.equal((await call(proxy, env, "/", { raw })).status, 400, "POST / " + raw);
}
// champs invalides → 400
{
  const env = penv();
  assert.equal((await call(proxy, env, "/", { body: order({ service: "ho tel;x" }) })).status, 400);
  assert.equal((await call(proxy, env, "/", { body: order({ channel: "WhatsApp!" }) })).status, 400);
  assert.equal((await call(proxy, env, "/", { body: order({ date1: "9999-99-99" }) })).status, 400);
  assert.equal(makeCalls, 0, "rien n'est envoyé à Make quand la demande est invalide");
}
// demande valide : envoyée, puis limite de débit (5 par 10 min) comptée avant l'envoi
{
  const env = penv(); makeCalls = 0;
  const r = await call(proxy, env, "/", { body: order() });
  assert.equal(r.status, 200); assert.equal((await r.json()).ok, true); assert.equal(makeCalls, 1);
  assert.equal(r.headers.get("X-Content-Type-Options"), "nosniff");
  for (let i = 1; i < 5; i++) assert.equal((await call(proxy, env, "/", { body: order({ requestId: "REQ1234567" + i }) })).status, 200);
  assert.equal((await call(proxy, env, "/", { body: order({ requestId: "REQ12345679" }) })).status, 429);
}
// les dates ne se modifient plus après « J'ai payé »
{
  const env = penv();
  await call(proxy, env, "/", { body: order() });
  const rec = JSON.parse(env.KV.m.get("ord:REQ12345678"));
  const u = new URL((await (async () => {
    // reconstruit le lien client : même calcul que le Worker (HMAC « ord.<id>.c »)
    const k = await crypto.subtle.importKey("raw", new TextEncoder().encode(env.SECRET), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
    const sig = [...new Uint8Array(await crypto.subtle.sign("HMAC", k, new TextEncoder().encode("ord.REQ12345678.c")))].map((x) => x.toString(16).padStart(2, "0")).join("").slice(0, 32);
    return "https://x.test/?k=" + sig;
  })())).searchParams.get("k");
  const future = new Date(Date.now() + 40 * 864e5).toISOString().slice(0, 10), future2 = new Date(Date.now() + 44 * 864e5).toISOString().slice(0, 10);
  const edit = (b) => call(proxy, env, "/order/edit", { body: { id: "REQ12345678", k: u, date1: future, date2: future2, ...b } });
  assert.equal((await edit()).status, 200, "modification avant paiement");
  assert.equal((await call(proxy, env, "/order/claim", { body: { id: "REQ12345678", k: u } })).status, 200);
  assert.equal((await edit()).status, 409, "modification refusée après « J'ai payé »");
  const get = await call(proxy, env, "/order?id=REQ12345678&k=" + u, { method: "GET" });
  assert.equal((await get.json()).order.canEdit, false);
  assert.ok(rec.status === "new");
}
// /pack et /admin/pack : les lettres vivent dans le KV, enregistrées par le formulaire protégé par ADMIN_KEY
{
  const env = penv();
  const unlock = async () => {
    const code = (await (await call(proxy, env, "/admin/code?n=1", { method: "GET", headers: { "X-Admin-Key": "admin-key-123" } })).json()).codes[0];
    const t = await (await call(proxy, env, "/unlock", { body: { code } })).json(); assert.equal(t.ok, true); return t.token;
  };
  const tok = await unlock(), auth = { Authorization: "Bearer " + tok };
  assert.equal((await call(proxy, env, "/pack", { method: "GET", headers: auth })).status, 503, "pas de lettres enregistrées = 503, plus de copie publique");
  // formulaire : page HTML sans script, CSP stricte
  const page = await call(proxy, env, "/admin/pack", { method: "GET" });
  assert.equal(page.status, 200);
  const html = await page.text();
  assert.ok(html.includes('name="pack"') && html.includes('type="password"') && !/<script/i.test(html), "formulaire sans script");
  assert.match(page.headers.get("Content-Security-Policy"), /default-src 'none'/);
  const send = (key, pack, ip) => call(proxy, env, "/admin/pack", { raw: new URLSearchParams({ key, pack }).toString(), headers: { "Content-Type": "application/x-www-form-urlencoded", ...(ip ? { "CF-Connecting-IP": ip } : {}) } });
  const good = [{ id: "recours", t: { fr: "Recours", en: "Appeal", ar: "طعن" }, body: "Texte [à compléter]" }];
  assert.equal((await send("mauvaise", JSON.stringify(good))).status, 403, "mauvaise clé refusée");
  assert.equal((await send("admin-key-123", "pas du json")).status, 400);
  assert.equal((await send("admin-key-123", JSON.stringify([{ id: "X Y", t: {}, body: "" }]))).status, 400, "forme invalide refusée");
  assert.equal(env.KV.m.has("pack"), false, "rien n'est enregistré quand le texte est invalide");
  const saved = await send("admin-key-123", JSON.stringify([{ ...good[0], extra: "ignoré" }]));
  assert.equal(saved.status, 200);
  assert.match(await saved.text(), /1 lettres : recours/);
  assert.deepEqual(JSON.parse(env.KV.m.get("pack")), good, "seuls id, t et body sont gardés");
  const b = await (await call(proxy, env, "/pack", { method: "GET", headers: auth })).json();
  assert.equal(b.pack[0].id, "recours");
  // verrou : 5 clés fausses puis refus même avec la bonne clé
  for (let i = 0; i < 5; i++) assert.equal((await send("faux", JSON.stringify(good), "5.5.5.5")).status, 403);
  assert.equal((await send("admin-key-123", JSON.stringify(good), "5.5.5.5")).status, 429, "verrou du formulaire");
}

/* ---------------- API d'éligibilité intégrée au proxy = visa-rules ---------------- */
{
  const rules = await load("visa-rules-worker.js"), env = penv();
  const A = await (await call(proxy, env, "/v1/rules", { method: "GET" })).json();
  const B = await (await rules.fetch(new Request("https://r.test/v1/rules", { headers: { Origin: ORIGIN } }), { ALLOWED_ORIGIN: ORIGIN })).json();
  assert.deepEqual(A, B, "mêmes règles que visa-rules");
  const payload = { nationality: "TN", destination: "FR", departureDate: "2027-05-01", returnDate: "2027-05-15", passportIssueDate: "2023-01-10", passportExpiry: "2030-01-10", blankPages: "4" };
  const pa = await call(proxy, env, "/v1/check", { body: payload });
  assert.equal(pa.status, 200);
  const rb = await rules.fetch(new Request("https://r.test/v1/check", { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json" }, body: JSON.stringify(payload) }), { ALLOWED_ORIGIN: ORIGIN });
  assert.deepEqual(await pa.json(), await rb.json(), "même verdict que visa-rules");
  // validations : chaîne vide ou texte non numérique = pages vides invalides ; origine étrangère refusée ; mauvaise méthode
  const bad = await (await call(proxy, env, "/v1/check", { body: { ...payload, blankPages: "" } })).json();
  assert.ok(bad.issues.includes("blank_pages_missing_or_invalid"));
  assert.equal((await call(proxy, env, "/v1/check", { body: payload, headers: { Origin: "https://evil.example" } })).status, 403);
  assert.equal((await call(proxy, env, "/v1/rules", { body: {} })).status, 405);
  assert.equal((await call(proxy, env, "/v1/check", { raw: "null" })).status, 400);
  assert.equal((await call(proxy, env, "/v1/check", { raw: "x".repeat(13000) })).status, 413);
}

/* ---------------- visa-chat ---------------- */
const chat = await load("visa-chat-worker.js");
const cenv = (over = {}) => ({ GEMINI_API_KEY: "x", INTERVIEW_CODES: "GOODCODE1", USAGE: kv(), ...over });
const chatCall = (env, body, { path = "/", ip = "9.9.9.9", raw } = {}) =>
  chat.fetch(new Request("https://c.test" + path, { method: "POST", headers: { Origin: ORIGIN, "CF-Connecting-IP": ip, "Content-Type": "application/json" }, body: raw !== undefined ? raw : JSON.stringify(body) }), env);

assert.equal((await chatCall(cenv(), null, { raw: "null" })).status, 400, "chat : corps null");
assert.equal((await chatCall(cenv(), null, { raw: "{oops" })).status, 400, "chat : JSON invalide");
assert.equal((await chatCall(cenv(), { messages: "pas un tableau" })).status, 400, "chat : messages non tableau → vide, jamais 500");
assert.equal((await chatCall(cenv(), { messages: [null, 3, { role: "user", text: "Bonjour" }] })).status, 200, "chat : éléments invalides ignorés");
assert.equal((await chatCall(cenv(), {}, { path: "/inconnu" })).status, 404, "chat : route inconnue");
// entraînement : code mal formé refusé, et les essais de codes sont limités (20 / 10 min / IP) avant toute vérification
assert.equal((await chatCall(cenv(), { mode: "interview", code: "x".repeat(600) })).status, 403);
{
  const env = cenv(); let last = 0;
  for (let i = 0; i < 25; i++) last = (await chatCall(env, { mode: "interview", code: "WRONG-" + i }, { ip: "7.7.7.7" })).status;
  assert.equal(last, 429, "essais de codes limités");
  const good = await chatCall(env, { mode: "interview", code: "GOODCODE1", check: true }, { ip: "8.8.8.8" });
  assert.equal(good.status, 200);
  assert.equal(good.headers.get("X-Content-Type-Options"), "nosniff");
}
console.log("Workers visa-proxy et visa-chat : durcissements vérifiés.");
