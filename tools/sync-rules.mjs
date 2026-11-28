#!/usr/bin/env node
/* Source unique des règles d'éligibilité : worker/visa-rules-worker.js.
   Ce script recopie ses données (VERSION, COUNTRIES, DESTINATIONS) dans la copie du Worker visa-proxy
   (RL_VERSION, RL_COUNTRIES, RL_DESTINATIONS), qui doit rester un fichier unique collé dans Cloudflare « Edit code ».
   Usage : node tools/sync-rules.mjs          -> met à jour worker/visa-proxy-worker.js
           node tools/sync-rules.mjs --check  -> code de sortie 1 si les deux copies divergent (utilisé par les tests) */
import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(root, "worker/visa-rules-worker.js"), DST = path.join(root, "worker/visa-proxy-worker.js");

export function rulesBlock(src) {
  const a = src.indexOf("const VERSION = "), b = src.indexOf("const corsHeaders");
  if (a < 0 || b < a) throw new Error("bloc de règles introuvable dans visa-rules-worker.js");
  return src.slice(a, b).trimEnd()
    .replace(/\bconst VERSION\b/, "const RL_VERSION")
    .replace(/\bconst COUNTRIES\b/, "const RL_COUNTRIES")
    .replace(/\bconst DESTINATIONS\b/, "const RL_DESTINATIONS");
}
export function proxyBlockRange(dst) {
  const a = dst.indexOf("const RL_VERSION = "), b = dst.indexOf("function rlDate");
  if (a < 0 || b < a) throw new Error("bloc de règles introuvable dans visa-proxy-worker.js");
  return [a, b];
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const src = readFileSync(SRC, "utf8"), dst = readFileSync(DST, "utf8");
  const [a, b] = proxyBlockRange(dst), want = rulesBlock(src), have = dst.slice(a, b).trimEnd();
  if (process.argv.includes("--check")) {
    if (want !== have) { console.error("Règles divergentes : lancer « node tools/sync-rules.mjs »"); process.exit(1); }
    console.log("Règles d'éligibilité identiques");
  } else if (want === have) console.log("Déjà à jour");
  else { writeFileSync(DST, dst.slice(0, a) + want + "\n" + dst.slice(b)); console.log("visa-proxy-worker.js mis à jour"); }
}
