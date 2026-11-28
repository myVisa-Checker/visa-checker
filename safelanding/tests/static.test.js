import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { execFileSync } from 'node:child_process';
import { ALL_PACKS, BASE_RULES } from '../web/src/index.js';
import { start } from '../tools/serve.mjs';

const WEB = new URL('../web/', import.meta.url).pathname;
const walk = (d) => readdirSync(d).flatMap((f) => (statSync(join(d, f)).isDirectory() ? walk(join(d, f)) : [join(d, f)]));
const files = walk(WEB), read = (f) => readFileSync(join(WEB, f), 'utf8');

test('hors connexion : le service worker précache TOUS les fichiers de l’application', () => {
  const list = [...read('sw.js').matchAll(/'([^']+)'/g)].map((m) => m[1]).filter((x) => /\.(js|html|css|svg|webmanifest)$/.test(x) || x === './');
  const real = files.map((f) => relative(WEB, f)).filter((f) => f !== 'sw.js');
  for (const f of real) assert.ok(list.includes(f), `non précaché : ${f}`);
  for (const f of list.filter((x) => x !== './')) assert.ok(existsSync(join(WEB, f)), `précaché mais absent : ${f}`);
});
test('sécurité : CSP stricte, pas d’innerHTML/eval/handlers inline/style inline', () => {
  const html = read('index.html');
  assert.match(html, /Content-Security-Policy[^>]*script-src 'self'/); assert.doesNotMatch(html, /unsafe-inline|unsafe-eval/);
  assert.doesNotMatch(html, /\son[a-z]+\s*=|\sstyle\s*=|<script(?![^>]*\bsrc=)/i);
  for (const f of files.filter((x) => x.endsWith('.js'))) {
    const src = readFileSync(f, 'utf8');
    assert.doesNotMatch(src, /innerHTML|outerHTML|insertAdjacentHTML|document\.write|\beval\(|new Function/, relative(WEB, f));
  }
});
test('sécurité : le moteur et le service worker n’émettent aucune requête réseau vers l’extérieur', () => {
  for (const f of files.filter((x) => /src[\\/]/.test(x))) assert.doesNotMatch(readFileSync(f, 'utf8'), /\bfetch\(|XMLHttpRequest|WebSocket|sendBeacon/);
  assert.match(read('sw.js'), /u\.origin !== location\.origin\) return/);
});
test('sécurité : aucun champ de numéro de passeport dans le formulaire', () => {
  assert.doesNotMatch(read('index.html'), /name="[^"]*(number|numero|mrz)[^"]*"/i);
});
test('manifest valide et JS syntaxiquement correct', () => {
  const m = JSON.parse(read('manifest.webmanifest')); assert.equal(m.display, 'standalone'); assert.ok(m.icons.length);
  for (const f of files.filter((x) => x.endsWith('.js'))) execFileSync(process.execPath, ['--check', f]);
});
test('app.js : tous les éléments référencés par id existent dans index.html', () => {
  const html = read('index.html'), ids = new Set([...read('app.js').matchAll(/\$\('([\w-]+)'\)/g)].map((m) => m[1]));
  for (const id of ids) assert.match(html, new RegExp(`id="${id}"`), `id manquant : ${id}`);
  const names = new Set([...read('app.js').matchAll(/elements\.(\w+)/g)].map((m) => m[1]));
  for (const n of names) assert.match(html, new RegExp(`name="${n}"`), `champ manquant : ${n}`);
});
test('règles livrées : aucune déclarée « verified » sans date, URL https, jamais de règle inventée vérifiée', () => {
  const all = [...BASE_RULES, ...ALL_PACKS.flatMap((p) => p.rules)];
  for (const r of all) {
    const v = r.verification; assert.ok(v && v.source && v.source.name, r.id);
    assert.equal(v.status, 'unverified', `${r.id} livrée sans validation humaine`); assert.equal(v.lastVerified, null);
    if (v.source.url) assert.match(v.source.url, /^https:\/\//);
  }
  assert.ok(ALL_PACKS.every((p) => p.countries.every((c) => /^[A-Z]{2}$/.test(c))));
});
test('serveur local : sert l’application, bloque la traversée de répertoire', async () => {
  const s = await start(0), port = s.address().port;
  try {
    for (const p of ['/', '/app.js', '/src/index.js', '/sw.js', '/manifest.webmanifest']) assert.equal((await fetch(`http://127.0.0.1:${port}${p}`)).status, 200, p);
    assert.equal((await fetch(`http://127.0.0.1:${port}/..%2f..%2fpackage.json`)).status === 200, false);
    assert.equal((await fetch(`http://127.0.0.1:${port}/inexistant`)).status, 404);
  } finally { s.closeAllConnections(); s.close(); }
});
