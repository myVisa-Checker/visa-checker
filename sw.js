/* Visa Checker : Service Worker
   - Précache de la « coquille » de l'appli (HTML, manifeste, icônes).
   - Pages (navigation) : réseau d'abord, repli sur le cache, puis sur la page d'accueil hors-ligne.
   - Fichiers locaux (dont partners/reviews/deals/rdv.json) : réseau d'abord (HTTP no-cache), repli sur le cache.
   - version.json : toujours le réseau, jamais mis en cache (sert à détecter un déploiement).
   - Polices : cache d'abord, rafraîchi en arrière-plan.
   - Jamais de cache pour les requêtes POST ni pour les API (Make, déblocage) : elles passent directement.
   VERSION est estampillée par bump-version.mjs à chaque déploiement : les anciens caches sont supprimés à l'activation. */
const VERSION = "2026.10.31.1710"; /*@version*/
const SHELL = "vc-shell-" + VERSION;
const RUNTIME = "vc-runtime-" + VERSION;
const NET_TIMEOUT = 4000; // au-delà, on sert le cache (réseau lent = « hors-ligne » pour l'utilisateur)

const PRECACHE = [
  "./",
  "manifest.json",
  "partners.json",
  "rdv.json",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(SHELL)
      // addAll échoue si UNE ressource échoue : on tolère les absences ; cache:"reload" ignore le cache HTTP
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(new Request(u, { cache: "reload" })).catch(() => null))))
  );
  // pas de skipWaiting automatique : la nouvelle version attend un clic « Mettre à jour » (voir message SKIP_WAITING)
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keep = [SHELL, RUNTIME];
      for (const k of await caches.keys()) if (k.startsWith("vc-") && !keep.includes(k)) await caches.delete(k);
      if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

function networkFirst(req, cacheName, preload) {
  return new Promise((resolve) => {
    let settled = false;
    const fromCache = async () => (await caches.match(req, { ignoreSearch: true })) || (await caches.match("./"));
    const timer = setTimeout(async () => {
      const hit = await fromCache();
      if (hit && !settled) { settled = true; resolve(hit); }
    }, NET_TIMEOUT);
    (preload ? Promise.resolve(preload).then((r) => r || fetch(req, { cache: "no-cache" })) : fetch(req, { cache: "no-cache" }))
      .then(async (res) => {
        clearTimeout(timer);
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(cacheName).then((c) => c.put(req, copy));
        }
        if (!settled) { settled = true; resolve(res); }
      })
      .catch(async () => {
        clearTimeout(timer);
        if (settled) return;
        settled = true;
        resolve((await fromCache()) || new Response("Hors-ligne", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } }));
      });
  });
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(RUNTIME);
  const hit = await cache.match(req);
  const refresh = fetch(req)
    .then((res) => { if (res && (res.ok || res.type === "opaque")) cache.put(req, res.clone()); return res; })
    .catch(() => null);
  return hit || (await refresh) || Response.error();
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                    // POST (Make, déblocage) : jamais interceptés
  const url = new URL(req.url);

  if (url.origin === self.location.origin && url.pathname.endsWith("/version.json")) {
    e.respondWith(fetch(req, { cache: "no-store" }));  // détection de déploiement : jamais de cache
    return;
  }
  if (req.mode === "navigate") {                       // pages : réseau d'abord
    e.respondWith(networkFirst(req, SHELL, e.preloadResponse));
    return;
  }
  if (url.origin === self.location.origin) {           // icônes, manifeste, listes JSON, scripts locaux
    e.respondWith(networkFirst(req, RUNTIME));
    return;
  }
  if (url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com") {
    e.respondWith(staleWhileRevalidate(req));          // polices : cache d'abord
  }
  // tout le reste (Make, API, logos externes) : réseau direct, sans cache
});
