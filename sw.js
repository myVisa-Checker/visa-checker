/* CheckMyVisa – cache limité au shell et aux assets statiques.
   Aucune API, donnée utilisateur ou requête POST n'est mise en cache. */
const VERSION = "2026.11.14.1950"; /*@version*/
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
  "pay.js",
  "joury.html",
  "aicha.html",
  "images/aicha-avatar.webp",
  "images/joury-avatar.webp",
  "images/saden-avatar.webp",
  "joury.css",
  "joury.js",
  "redact.js",
  "nav.css",
  "site.css",
  "contact.js",
  "manifest.json",
  "partenaires.html",
  "guide-visa.html",
  "a-propos.html",
  "faq.html",
  "contact.html",
  "conditions.html",
  "confidentialite.html",
  "partner-form.css",
  "partner-form.js",
  "partner-i18n.js",
  "brand.css",
  "404.html",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/maskable-512.png",
  "icons/apple-touch-icon.png"
];

/* Fichiers sans lesquels l'application ne démarre pas : si l'un manque, l'installation échoue
   et l'ancienne version reste en place (au lieu d'installer un cache incomplet). */
const CRITICAL = ["index.html", "vc.css", "visa-app.js", "visa-pwa.js", "vc-shared.js", "manifest.json"];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    const ok = await Promise.all(PRECACHE.map((asset) =>
      cache.add(new Request(asset, { cache: "reload" })).then(() => true, () => false)
    ));
    const missing = PRECACHE.filter((asset, i) => !ok[i] && CRITICAL.includes(asset));
    if (missing.length) throw new Error("Précache critique manquant : " + missing.join(", "));
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
    : new Response("CheckMyVisa est hors ligne. Reconnectez-vous puis réessayez.", {
        status: 503, headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" }
      });
}

/* Pages : réseau d'abord (le visiteur voit toujours la dernière version),
   copie en cache seulement si le réseau échoue (hors ligne). */
async function networkFirst(request) {
  const cache = await caches.open(SHELL);
  try {
    const response = await fetch(request, { cache: "no-cache" });
    if (response && response.ok && response.type !== "opaque") {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request, { ignoreSearch: true });
    if (cached) return cached;
    const home = await cache.match("./") || await cache.match("index.html");
    if (home) return home;
    return offlineResponse(false);
  }
}

/* Fichiers statiques : réponse immédiate depuis le cache, mise à jour en arrière-plan.
   Un oubli d'incrément de VERSION ne bloque donc plus les visiteurs sur d'anciens fichiers. */
async function staleWhileRevalidate(request, event) {
  const cache = await caches.open(SHELL);
  const cached = await cache.match(request);
  const update = fetch(request, { cache: "no-cache" }).then(async (response) => {
    if (response && response.ok && response.type !== "opaque") {
      await cache.put(request, response.clone());
    }
    return response;
  }).catch(() => null);
  if (cached) {
    event.waitUntil(update);
    return cached;
  }
  return (await update) || offlineResponse(false);
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
  event.respondWith(isNavigation ? networkFirst(request) : staleWhileRevalidate(request, event));
});
