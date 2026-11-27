#!/usr/bin/env node
/* Chaîne de validation locale complète : une commande, aucun workflow distant.
   1. Tests unitaires Ausbildung (moteur, i18n, données)
   2. Suite d'intégration du dépôt (tests/run.mjs)
   3. Tests E2E navigateur (Playwright) servis par un serveur statique local éphémère
   Aucun test n'est ignoré : si Playwright est absent, l'étape E2E ÉCHOUE (sauf --no-e2e explicite, signalé dans le résumé).
   Usage : node tests/all.mjs [--no-e2e] */
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const skipE2E = process.argv.includes("--no-e2e");
const steps = [];
const run = (name, args) => {
  const t = Date.now();
  const r = spawnSync(process.execPath, args, { cwd: root, encoding: "utf8", timeout: 240000 });
  const ok = r.status === 0;
  steps.push({ name, ok, ms: Date.now() - t });
  if (!ok) process.stdout.write(`\n--- ÉCHEC : ${name} ---\n${(r.stdout || "").split("\n").slice(-15).join("\n")}\n${r.stderr || ""}\n`);
  return ok;
};

const unit = ["matcher", "i18n", "data"];
for (const u of unit) run(`unitaire ausbildung/${u}`, [`ausbildung/tests/${u}.test.js`]);
run("intégration tests/run.mjs", ["tests/run.mjs"]);

if (skipE2E) {
  steps.push({ name: "E2E navigateur", ok: false, skipped: true, ms: 0 });
} else {
  const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".png": "image/png", ".webmanifest": "application/manifest+json" };
  const server = createServer(async (req, res) => {
    try {
      let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
      if (p.endsWith("/")) p += "index.html";
      const file = path.join(root, path.normalize(p));
      if (!file.startsWith(root)) throw new Error("hors racine");
      const body = await readFile(file);
      res.writeHead(200, { "content-type": types[path.extname(file)] || "application/octet-stream" }); res.end(body);
    } catch { res.writeHead(404); res.end("404"); }
  });
  await new Promise((r) => server.listen(0, "127.0.0.1", r));
  const url = `http://127.0.0.1:${server.address().port}`;
  for (const e of ["flow", "chosen"]) {
    const t = Date.now();
    const r = await new Promise((resolve) => {
      import("node:child_process").then(({ spawn }) => {
        const c = spawn(process.execPath, [`ausbildung/tests/${e}.e2e.cjs`, url], { cwd: root });
        let out = "", timer = setTimeout(() => c.kill(), 240000);
        c.stdout.on("data", (d) => out += d); c.stderr.on("data", (d) => out += d);
        c.on("close", (code) => { clearTimeout(timer); resolve({ code, out }); });
      });
    });
    steps.push({ name: `E2E ausbildung/${e}`, ok: r.code === 0, ms: Date.now() - t });
    if (r.code !== 0) process.stdout.write(`\n--- ÉCHEC : E2E ${e} ---\n${r.out.split("\n").slice(-15).join("\n")}\n`);
  }
  server.close();
}

console.log("\nRésumé");
for (const s of steps) console.log(`  ${s.skipped ? "IGNORÉ" : s.ok ? "OK    " : "ÉCHEC "} ${s.name}${s.ms ? ` (${(s.ms / 1000).toFixed(1)} s)` : ""}`);
const failed = steps.filter((s) => !s.ok);
console.log(failed.length ? `\n${failed.length} étape(s) en échec ou ignorée(s).` : "\nTout est vert.");
process.exit(failed.length ? 1 : 0);
