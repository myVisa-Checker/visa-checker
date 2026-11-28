const CACHE = 'safelanding-v2';
const PRECACHE = [
  './', 'index.html', 'app.js', 'style.css', 'icon.svg', 'manifest.webmanifest',
  'src/index.js', 'src/core/constants.js', 'src/core/dates.js', 'src/core/profile.js', 'src/core/registry.js',
  'src/core/engine.js', 'src/core/alerts.js', 'src/core/state.js', 'src/core/changes.js', 'src/core/explain.js',
  'src/core/airports.js', 'src/core/arrival.js', 'src/core/destinations.js', 'src/rules/base.js', 'src/rules/packs.js', 'src/rules/arrival-base.js', 'src/rules/airports.js',
];
self.addEventListener('install', (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== location.origin) return; // jamais d'interception cross-origin
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => {
    if (r.ok) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(e.request, copy)); }
    return r;
  }).catch(() => caches.match('index.html'))));
});
