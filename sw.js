/* Visa Checker – cache limité au shell et aux assets statiques.
   Aucune API, donnée utilisateur ou requête POST n'est mise en cache. */
const VERSION = "2026.11.11.2125";
const SHELL = "vc-shell-" + VERSION;
const PRECACHE = [
  "./",
  "index.html",
  "view-dossier.html",
  "view-joury.html",
  "view-recours.html",
  "view-entretien.html",
  "vc-shared.js",
  "vc.css",
  "visa-app.js",
  "visa-pwa.js",
  "avatar3d.js",
  "joury.html",
  "aicha.html",
  "images/aicha-avatar.webp",
  "images/joury-avatar.webp",
  "joury.css",
  "joury.js",
  "redact.js",
  "nav.css",
  "site.css",
  "manifest.json",
  "partenaires.html",
  "a-propos.html",
  "contact.html",
  "conditions.html",
  "confidentialite.html",
  "partner-form.css",
  "partner-form.js",
  "brand.css",
  "hero-voyage.jpg",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    await Promise.all(PRECACHE.map((asset) =>
      cache.add(new Request(asset, { cache: "reload" })).catch(() => null)
    ));
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith("vc-shell-") && key !== SHELL) await caches.delete(key);
      if (key.startsWith("vc-runtime-")) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") self.skipWaiting();
});

function offlineResponse(json) {
  return json
    ? new Response(JSON.stringify({ error: "offline", message: "Service indisponible hors ligne." }), {
        status: 503, headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }
      })
    : new Response("Visa Checker est hors ligne. Reconnectez-vous puis réessayez.", {
        status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
      });
}

async function cacheFirst(request, isNavigation) {
  const cache = await caches.open(SHELL);
  const cached = await cache.match(request, { ignoreSearch: isNavigation });
  if (cached) return cached;
  try {
    const response = await fetch(request, { cache: "no-store" });
    if (response && response.ok && response.type !== "opaque") {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    if (isNavigation) {
      const home = await cache.match("./") || await cache.match("index.html");
      if (home) return home;
    }
    return offlineResponse(false);
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Les POST ne sont jamais interceptés. Les API sont toujours réseau direct et no-store.
  if (request.method !== "GET") return;
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(request, { cache: "no-store" }).catch(() => offlineResponse(true)));
    return;
  }
  if (url.origin !== self.location.origin) return;
  if (url.pathname.endsWith("/version.json")) {
    event.respondWith(fetch(request, { cache: "no-store" }).catch(() => offlineResponse(false)));
    return;
  }

  const isNavigation = request.mode === "navigate";
  const path = url.pathname;
  const isShellPage = isNavigation || /\.(?:html|css|js|mjs|png|jpe?g|webp|svg|ico|woff2?|ttf|otf|manifest)$/i.test(path);
  if (!isShellPage) return;
  event.respondWith(cacheFirst(request, isNavigation));
});
