/* Enregistre le Service Worker du site dès une première visite directe sur /ausbildung/ (sans passer par l'accueil),
   pour que le module fonctionne ensuite hors ligne. Le sw.js est à la racine : portée « / ». */
(function () {
  "use strict";
  if (!("serviceWorker" in navigator) || !/^https?:$/.test(location.protocol)) return;
  window.addEventListener("load", function () {
    navigator.serviceWorker.register(new URL("../sw.js", location.href).pathname).catch(function () {});
  });
})();
