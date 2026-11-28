// Serveur statique local de développement (aucun déploiement). Usage : node tools/serve.mjs [port]
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(fileURLToPath(new URL('../web', import.meta.url)));
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json' };
export function start(port = 8080) {
  return new Promise((ok) => {
    const s = createServer(async (req, res) => {
      const path = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
      const file = resolve(join(root, path === '/' || path === '.' ? 'index.html' : path));
      if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
      let body;
      try { body = await readFile(file); } catch { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream', 'x-content-type-options': 'nosniff' });
      res.end(body);
    }).listen(port, '127.0.0.1', () => ok(s));
  });
}
if (import.meta.url === `file://${process.argv[1]}`) { const p = Number(process.argv[2]) || 8080; await start(p); console.log(`http://127.0.0.1:${p}`); }
