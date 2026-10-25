#!/usr/bin/env node
// Usage : node bump-version.mjs [version]   (défaut : AAAA.MM.JJ.HHMM)
// Estampille la même version dans index.html, sw.js et version.json. À lancer avant chaque déploiement.
import { readFileSync, writeFileSync } from "node:fs";
const d = new Date(), p = (n) => String(n).padStart(2, "0");
const v = process.argv[2] || `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}.${p(d.getHours())}${p(d.getMinutes())}`;
const stamp = (f, fn) => { const a = readFileSync(f, "utf8"), b = fn(a); if (a === b && !a.includes(v)) throw new Error("Rien à estampiller dans " + f); writeFileSync(f, b); };
stamp("index.html", (s) => s
  .replace(/(window\.APP_VERSION=")[^"]*(";\s*\/\*@version\*\/)/, `$1${v}$2`)
  .replace(/((?:manifest\.json|apple-touch-icon\.png|icon-192\.png)\?v=)[^"]*/g, `$1${v}`));
stamp("sw.js", (s) => s.replace(/(const VERSION = ")[^"]*(";\s*\/\*@version\*\/)/, `$1${v}$2`));
writeFileSync("version.json", JSON.stringify({ version: v }) + "\n");
console.log("Version estampillée :", v);
