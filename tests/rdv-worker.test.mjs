// Tests des routes « rendez-vous en direct » du Worker visa-proxy. KV factice avec list(). Lancé par tests/run.mjs.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
const src = await readFile(new URL("../worker/visa-proxy-worker.js", import.meta.url), "utf8");
const w = (await import("data:text/javascript;base64," + Buffer.from(src, "utf8").toString("base64"))).default;
const kv = () => { const m = new Map(); return { m, get: async (k) => (m.has(k) ? m.get(k) : null), put: async (k, v) => { m.set(k, String(v)); }, list: async ({ prefix }) => ({ keys: [...m.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })) }) }; };
const env = { KV: kv(), SECRET: "s".repeat(32) };
const O = "https://checkmyvisa.org";
const call = (path, { method = "POST", body, ip = "1.1.1.1", origin = O } = {}) =>
  w.fetch(new Request("https://w.test" + path, { method, headers: { Origin: origin, "CF-Connecting-IP": ip, "Content-Type": "application/json" }, body: method === "GET" ? undefined : JSON.stringify(body) }), env);
const live = async () => (await call("/rdv/live", { method: "GET" })).json();

assert.equal((await call("/rdv/report", { body: { country: "fr", city: "tunis" }, origin: "https://evil.test" })).status, 403, "origine refusée");
assert.equal((await call("/rdv/report", { body: { country: "us", city: "tunis" } })).status, 400, "pays hors liste");
assert.equal((await call("/rdv/report", { body: { country: "fr", city: "paris" } })).status, 400, "centre hors liste");
assert.equal((await live()).centers.length, 0, "vide au départ");

// 2 appareils : pas confirmé ; un doublon du même appareil ne compte pas
await call("/rdv/report", { body: { country: "fr", city: "tunis", kind: "open" }, ip: "1.1.1.1" });
const dup = await (await call("/rdv/report", { body: { country: "fr", city: "tunis", kind: "open" }, ip: "1.1.1.1" })).json();
assert.equal(dup.duplicate, true, "doublon même appareil");
await call("/rdv/report", { body: { country: "fr", city: "tunis", kind: "open" }, ip: "2.2.2.2" });
let c = (await live()).centers[0];
assert.equal(c.recent, 2); assert.equal(c.status, "calm", "2 appareils : pas de vague");
await call("/rdv/report", { body: { country: "fr", city: "tunis", kind: "open" }, ip: "3.3.3.3" });
c = (await live()).centers[0];
assert.equal(c.status, "wave", "3 appareils : vague confirmée");

// « aucun créneau » sur un autre centre : 3 appareils → bloqué
for (const ip of ["4.4.4.4", "5.5.5.5", "6.6.6.6"]) await call("/rdv/report", { body: { country: "it", city: "sfax", kind: "none" }, ip });
const sf = (await live()).centers.find((x) => x.city === "sfax");
assert.equal(sf.status, "blocked", "3 appareils : bloqué");

// délais : visibles seulement à partir de 5 déclarations
assert.equal((await call("/rdv/delay", { body: { country: "es", city: "sousse", days: 0 } })).status, 400, "délai 0 refusé");
assert.equal((await call("/rdv/delay", { body: { country: "es", city: "sousse", days: 500 } })).status, 400, "délai 500 refusé");
for (let i = 1; i <= 4; i++) await call("/rdv/delay", { body: { country: "es", city: "sousse", days: 10 + i }, ip: "9.9.9." + i });
assert.equal((await live()).delays.length, 0, "4 déclarations : rien d'affiché");
await call("/rdv/delay", { body: { country: "es", city: "sousse", days: 20 }, ip: "9.9.9.5" });
const d = (await live()).delays[0];
assert.equal(d.n, 5); assert.equal(d.median, 13, "médiane de 11,12,13,14,20");

// limite horaire par appareil
let last; for (let i = 0; i < 14; i++) last = await call("/rdv/report", { body: { country: "fr", city: "sousse", kind: "open" }, ip: "7.7.7.7" });
assert.equal(last.status, 429, "limite horaire");
// pas de donnée personnelle dans le KV (aucune adresse IP en clair)
for (const k of env.KV.m.keys()) assert.ok(!/\d+\.\d+\.\d+\.\d+/.test(k), "IP en clair dans la clé " + k);
console.log("rdv-worker : signalements, confirmation, délais, limites vérifiés.");
