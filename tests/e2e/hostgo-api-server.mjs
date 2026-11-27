// Serveur local pour les tests navigateur : exécute le VRAI Worker Host & Go avec un KV en mémoire et trois offres approuvées.
// Usage : node tests/e2e/hostgo-api-server.mjs  -> écrit « PORT <n> » puis attend. Clé administrateur : e2e-admin.
import http from "node:http";
import { readFile } from "node:fs/promises";
const src = await readFile(new URL("../../worker/hostgo-worker.js", import.meta.url), "utf8");
const { default: worker } = await import("data:text/javascript;base64," + Buffer.from(src).toString("base64"));
const m = new Map();
const KV = { async get(k, type) { if (!m.has(k)) return null; const v = m.get(k).v; return type === "arrayBuffer" ? (v instanceof Uint8Array ? v.slice().buffer : new TextEncoder().encode(v).buffer) : (v instanceof Uint8Array ? new TextDecoder().decode(v) : v); },
  async put(k, v, o = {}) { m.set(k, { v: v instanceof Uint8Array ? v.slice() : v instanceof ArrayBuffer ? new Uint8Array(v) : String(v), metadata: o.metadata }); }, async delete(k) { m.delete(k); },
  async list({ prefix = "" } = {}) { return { keys: [...m.entries()].filter(([k]) => k.startsWith(prefix)).map(([name, e]) => ({ name, metadata: e.metadata })), list_complete: true }; } };
const env = { KV, SECRET: "e2e-secret", ADMIN_KEY: "e2e-admin" };
const ORIGIN = "https://checkmyvisa.org";
const call = (path, method = "GET", body, headers = {}, ip = "198.51.100.77") => worker.fetch(new Request("https://hg.test" + path, { method, headers: { Origin: ORIGIN, "CF-Connecting-IP": ip, "Content-Type": "application/json", ...headers }, body: body ? JSON.stringify(body) : undefined }), env);
const T = (s) => s + " — texte suffisamment long pour être valide.";
const seeds = [
  { country: "tn", city: "Béja", cats: ["farm"], stay: 2, langs: [[0, 3], [1, 2]], trav: [1], firstName: "Sami", cal: { 2026: { 3: 1, 4: 2 } }, texts: { place: T("Ferme d'oliviers <b>test</b>"), stay: T("Chambre"), help: T("Aide"), culture: T("Culture"), intro: T("Présentation") } },
  { country: "fr", city: "Lyon", cats: ["pets", "garden"], stay: 4, langs: [[1, 3]], trav: [2], firstName: "Claire", texts: { place: T("Maison avec jardin"), stay: T("Studio"), help: T("Chiens"), culture: T("Culture"), intro: T("Présentation") } },
  { country: "tn", city: "Tunis", cats: ["family"], stay: 1, langs: [[2, 3]], trav: [0], firstName: "Amel", texts: { place: T("Appartement familial"), stay: T("Chambre"), help: T("Enfants"), culture: T("Culture"), intro: T("Présentation") } },
  { country: "ma", city: "Fès", cats: ["guesthouse"], stay: 0, langs: [[0, 3]], trav: [1], firstName: "Youssef", texts: { place: T("Riad"), stay: T("Chambre"), help: T("Accueil"), culture: T("Culture"), intro: T("Présentation") } },
  { country: "es", city: "Séville", cats: ["exchange"], stay: 3, langs: [[5, 3]], trav: [0], firstName: "Lucia", texts: { place: T("Échange"), stay: T("Chambre"), help: T("Langues"), culture: T("Culture"), intro: T("Présentation") } }
];
let i = 0;
for (const s of seeds) {
  i++; const r = await (await call("/hg/offers", "POST", { sid: "hg-" + String(i).padStart(16, "0"), consent: true, email: `seed${i}@example.com`, addr: "1 rue du Test", hours: 1, days: 1, ...s }, {}, "203.0.113." + i)).json();
  await call(`/hg/admin/offers/${r.id}/approve`, "POST", {}, { "X-Admin-Key": "e2e-admin" }, "203.0.113." + i);
}
http.createServer(async (req, res) => {
  const chunks = []; for await (const c of req) chunks.push(c);
  const r = await worker.fetch(new Request("https://hg.test" + req.url, { method: req.method, headers: { ...req.headers, host: undefined }, body: ["GET", "HEAD"].includes(req.method) ? undefined : Buffer.concat(chunks) }), env);
  res.writeHead(r.status, Object.fromEntries(r.headers)); res.end(Buffer.from(await r.arrayBuffer()));
}).listen(0, "127.0.0.1", function () { console.log("PORT " + this.address().port); });
