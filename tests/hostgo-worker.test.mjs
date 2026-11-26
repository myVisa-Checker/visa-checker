// Tests du Worker Host & Go (offres : publication, consultation, signalement, modération, accès). KV simulé en mémoire.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../worker/hostgo-worker.js", import.meta.url), "utf8");
const { default: worker, TYPE_TO_CAT, CATS } = await import("data:text/javascript;base64," + Buffer.from(source, "utf8").toString("base64"));

const ORIGIN = "https://checkmyvisa.org";
function fakeKV() {
  const m = new Map();
  return { m,
    async get(k) { return m.has(k) ? m.get(k).v : null; },
    async put(k, v, o = {}) { m.set(k, { v: String(v), metadata: o.metadata, ttl: o.expirationTtl }); },
    async delete(k) { m.delete(k); },
    async list({ prefix = "", limit = 1000 } = {}) { const keys = [...m.entries()].filter(([k]) => k.startsWith(prefix)).slice(0, limit).map(([name, e]) => ({ name, metadata: e.metadata })); return { keys, list_complete: true }; } };
}
const mkEnv = () => ({ KV: fakeKV(), SECRET: "secret-test-phrase", ADMIN_KEY: "admin-test-key" });
let ipN = 0;
async function call(env, path, { method = "GET", body, headers = {}, ip } = {}) {
  const res = await worker.fetch(new Request("https://hg.test" + path, { method, headers: { Origin: ORIGIN, "CF-Connecting-IP": ip || "198.51.100." + ((ipN++ % 250) + 1), ...headers, ...(body === undefined ? {} : { "Content-Type": "application/json" }) }, body: body === undefined ? undefined : JSON.stringify(body) }), env);
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

await t("anti-doublon : même identifiant de demande = même offre ; même e-mail = refus", async () => {
  const env = mkEnv(); const a = await publish(env, 3);
  const again = await call(env, "/hg/offers", { method: "POST", body: offer(3) });
  assert.equal(again.status, 200); assert.equal(again.data.id, a.id); assert.equal(again.data.duplicate, true); assert.equal(again.data.editToken, undefined);
  const other = await call(env, "/hg/offers", { method: "POST", body: offer(4, { email: "HOTE3@example.com" }) });
  assert.equal(other.status, 409); assert.equal(other.data.error, "already_registered");
  assert.equal([...env.KV.m.keys()].filter((k) => k.startsWith("o:")).length, 1);
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

console.log("\n" + n + " tests du Worker Host & Go réussis");
