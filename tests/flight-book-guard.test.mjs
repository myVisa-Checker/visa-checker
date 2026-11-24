// Garde de /flight/book : interrupteur d'urgence et contrôle Turnstile (inactif sans secret). Aucun réseau : fetch simulé. Lancé par tests/run.mjs.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../worker/visa-flight-worker.js", import.meta.url), "utf8");
const w = (await import("data:text/javascript;base64," + Buffer.from(src, "utf8").toString("base64"))).default;
const ORIGIN = "https://checkmyvisa.org";
const duffel = [];
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.includes("challenges.cloudflare.com")) return new Response(JSON.stringify({ success: String(init.body?.get?.("response") || "").startsWith("ok") }), { status: 200 });
  duffel.push(u);
  return new Response(JSON.stringify({ data: {} }), { status: 200 });
};
const call = (env, body) => w.fetch(new Request("https://w.example/flight/book", { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json" }, body: JSON.stringify(body) }), env);
const status = async (r) => [r.status, (await r.json().catch(() => ({}))).code];

// 1) interrupteur d'urgence
let [s, c] = await status(await call({ DUFFEL_API_KEY: "duffel_test_x", BOOK_DISABLED: "1" }, { offer_id: "off_abc" }));
assert.equal(s, 503); assert.equal(c, "disabled");

// 2) Turnstile actif : sans jeton -> 403, avec mauvais jeton -> 403, aucune requête Duffel
[s, c] = await status(await call({ DUFFEL_API_KEY: "duffel_test_x", TURNSTILE_SECRET: "sec" }, { offer_id: "off_abc" }));
assert.equal(s, 403); assert.equal(c, "captcha");
[s, c] = await status(await call({ DUFFEL_API_KEY: "duffel_test_x", TURNSTILE_SECRET: "sec" }, { offer_id: "off_abc", turnstile: "bad" }));
assert.equal(s, 403);
assert.equal(duffel.length, 0);

// 3) Turnstile inactif (pas de secret) : on passe la garde et on tombe sur la validation suivante (offre/passager), pas sur 403
[s, c] = await status(await call({ DUFFEL_API_KEY: "duffel_test_x" }, { offer_id: "pas-une-offre" }));
assert.equal(s, 422); assert.equal(c, "offer");

// 4) Turnstile actif avec bon jeton : la garde est franchie
[s, c] = await status(await call({ DUFFEL_API_KEY: "duffel_test_x", TURNSTILE_SECRET: "sec" }, { offer_id: "pas-une-offre", turnstile: "ok-token" }));
assert.equal(s, 422); assert.equal(c, "offer");
console.log("flight-book-guard : ok");
