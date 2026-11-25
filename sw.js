/* CheckMyVisa – cache limité au shell et aux assets statiques.
   Aucune API, donnée utilisateur ou requête POST n'est mise en cache. */
const VERSION = "2026.11.25.0900"; /*@version*/
const SHELL = "vc-shell-" + VERSION;
const PRECACHE = [
  "./",
  "index.html",
  "view-dossier.html",
  "view-joury.html",
  "view-recours.html",
  "view-entretien.html",
  "vc-shared.js",
  "view-dossier-app.js",
  "view-joury-app.js",
  "view-entretien-app.js",
  "i18n/view-common.js",
  "i18n/view-dossier.js",
  "i18n/view-joury.js",
  "i18n/view-entretien.js",
  "vc.css",
  "visa-app.js",
  "flight-hold.js",
  "turnstile.js",
  "flight-hold.css",
  "vols.html",
  "vols.js",
  "vols.css",
  "images/hero-vols.jpg",
  "hotels.html",
  "hotels.js",
  "hotels.css",
  "images/hero-hotels.jpg",
  "visa-pwa.js",
  "avatar3d.js",
  "pay.js",
  "joury.html",
  "aicha.html",
  "images/aicha-avatar.webp",
  "images/joury-avatar.webp",
  "images/saden-avatar.webp",
  "images/ausbildung-card-480.webp",
  "images/ausbildung-card-800.webp",
  "joury.css",
  "joury.js",
  "redact.js",
  "nav.css",
  "site.css",
  "contact.js",
  "manifest.json",
  "partenaires.html",
  "guide-visa.html",
  "guide-besoin-visa.html",
  "guide-refus-visa.html",
  "guide-arnaques-visa.html",
  "guide-moyens-financiers.html",
  "guide-assurance-voyage.html",
  "guide-entretien-consulaire.html",
  "guide-reservation-vol-hotel.html",
  "guide-photo-biometrique.html",
  "guide-quand-deposer.html",
  "guide-lettre-motivation.html",
  "guide-lettre-invitation.html",
  "guide-justificatifs-professionnels.html",
  "guide-visa-etudiant.html",
  "guide-ausbildung.html",
  "guide-visite-familiale.html",
  "guide-visa-affaires.html",
  "guide-traduction-legalisation.html",
  "guide-passeport.html",
  "guide-visa-transit.html",
  "guide-voyage-enfants.html",
  "a-propos.html",
  "faq.html",
  "contact.html",
  "conditions.html",
  "mentions-legales.html",
  "cookies.html",
  "hostgo.html",
  "hostgo.js",
  "hostgo.css",
  "hostgo-hote.html",
  "hostgo-hote.css",
  "hostgo-hote.js",
  "hostgo-voyageur.html",
  "hostgo-voyageur.css",
  "hostgo-voyageur.js",
  "hostgo-teaser.css",
  "images/hostgo/hero.webp",
  "images/hostgo/voyageur.webp",
  "images/hostgo/hote.webp",
  "images/hostgo/hote-hero.webp",
  "images/hostgo/theme-famille.webp",
  "images/hostgo/theme-ferme.webp",
  "images/hostgo/theme-jardin.webp",
  "images/hostgo/theme-hotes.webp",
  "images/hostgo/theme-echange.webp",
  "images/hostgo/theme-animaux.webp",
  "ausbildung/",
  "ausbildung/ausbildung.css",
  "ausbildung/career-matcher.js",
  "ausbildung/app.js",
  "ausbildung/data/occupations.json",
  "confidentialite.html",
  "partner-form.css",
  "partner-form.js",
  "partner-i18n.js",
  "site-i18n.js",
  "i18n/common.js",
  "i18n/a-propos.js",
  "i18n/faq.js",
  "i18n/guide-visa.js",
  "i18n/guide-besoin-visa.js",
  "i18n/guide-refus-visa.js",
  "i18n/guide-arnaques-visa.js",
  "i18n/guide-moyens-financiers.js",
  "i18n/guide-assurance-voyage.js",
  "i18n/guide-entretien-consulaire.js",
  "i18n/guide-reservation-vol-hotel.js",
  "i18n/guide-photo-biometrique.js",
  "i18n/guide-quand-deposer.js",
  "i18n/guide-lettre-motivation.js",
  "i18n/guide-lettre-invitation.js",
  "i18n/guide-justificatifs-professionnels.js",
  "i18n/guide-visa-etudiant.js",
  "i18n/guide-visite-familiale.js",
  "i18n/guide-visa-affaires.js",
  "i18n/guide-traduction-legalisation.js",
  "i18n/guide-passeport.js",
  "i18n/guide-visa-transit.js",
  "i18n/guide-voyage-enfants.js",
  "i18n/contact.js",
  "i18n/mentions-legales.js",
  "i18n/cookies.js",
  "i18n/conditions.js",
  "i18n/confidentialite.js",
  "i18n/404.js",
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
  // Catalogue des métiers Ausbildung : donnée statique publique (aucune donnée utilisateur), disponible hors ligne.
  const isAusbildungData = /\/ausbildung\/data\/[a-z0-9_-]+\.json$/i.test(path);
  const isShellPage = isNavigation || isAusbildungData || /\.(?:html|css|js|mjs|png|jpe?g|webp|svg|ico|woff2?|ttf|otf|manifest)$/i.test(path);
  if (!isShellPage) return;
  event.respondWith(isNavigation ? networkFirst(request) : staleWhileRevalidate(request, event));
});
