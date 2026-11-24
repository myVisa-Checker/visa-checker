// Garde Turnstile du Worker visa-chat (assistants IA, /partner, /contact) : inactive sans secret, bloquante avec. Aucun réseau. Lancé par tests/run.mjs.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../worker/visa-chat-worker.js", import.meta.url), "utf8");
const w = (await import("data:text/javascript;base64," + Buffer.from(src, "utf8").toString("base64"))).default;
const ORIGIN = "https://checkmyvisa.org";
const external = [];
globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u.includes("challenges.cloudflare.com")) return new Response(JSON.stringify({ success: String(init.body?.get?.("response") || "").startsWith("ok") }), { status: 200 });
  external.push(u);
  return new Response(JSON.stringify({}), { status: 200 });
};
const call = (path, env, headers = {}) => w.fetch(new Request("https://w.example" + path, { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json", ...headers }, body: "{}" }), env);
const code = async (r) => [r.status, (await r.json().catch(() => ({}))).error];

for (const path of ["/", "/contact", "/partner", "/api/analyze-refusal", "/api/interview-feedback"]) {
  // secret présent, pas de jeton -> 403 captcha, rien d'envoyé à Gemini/Make
  let [s, e] = await code(await call(path, { TURNSTILE_SECRET: "sec", GEMINI_API_KEY: "k" }));
  assert.equal(s, 403, path); assert.equal(e, "captcha", path);
  // mauvais jeton -> 403
  [s, e] = await code(await call(path, { TURNSTILE_SECRET: "sec", GEMINI_API_KEY: "k" }, { "X-Turnstile": "bad" }));
  assert.equal(e, "captcha", path);
  // bon jeton -> la garde est franchie (autre réponse que captcha)
  [s, e] = await code(await call(path, { TURNSTILE_SECRET: "sec", GEMINI_API_KEY: "k" }, { "X-Turnstile": "ok-1" }));
  assert.notEqual(e, "captcha", path);
  // pas de secret -> comportement inchangé (pas de captcha)
  [s, e] = await code(await call(path, { GEMINI_API_KEY: "k" }));
  assert.notEqual(e, "captcha", path);
}
// en-tête autorisé par CORS
const pre = await w.fetch(new Request("https://w.example/", { method: "OPTIONS", headers: { Origin: ORIGIN } }), {});
assert.match(pre.headers.get("Access-Control-Allow-Headers") || "", /X-Turnstile/);
console.log("chat-worker-guard : ok");
