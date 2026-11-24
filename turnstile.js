/* CheckMyVisa : contrôle anti-robot Cloudflare Turnstile (invisible la plupart du temps).
   Inactif tant que SITEKEY est vide : token() renvoie alors "" et le site fonctionne comme avant.
   Pour l'activer : coller ici la clé PUBLIQUE du widget (Cloudflare > Turnstile), puis créer le secret TURNSTILE_SECRET sur le Worker concerné. */
(function () {
  "use strict";
  var SITEKEY = "0x4AAAAAAGRTIznFtJln3rit";
  var API = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  var loading = null, wid = null, box = null, pending = null;

  function load() {
    if (window.turnstile) return Promise.resolve();
    if (loading) return loading;
    loading = new Promise(function (ok, ko) {
      var s = document.createElement("script");
      s.src = API; s.async = true; s.onload = function () { ok(); }; s.onerror = function () { loading = null; ko(new Error("captcha")); };
      document.head.appendChild(s);
    });
    return loading;
  }

  function token() {
    if (!SITEKEY) return Promise.resolve("");
    return load().then(function () {
      return new Promise(function (ok, ko) {
        var timer = setTimeout(function () { pending = null; ko(new Error("captcha")); }, 25000);
        pending = { ok: function (t) { clearTimeout(timer); pending = null; ok(t); }, ko: function (e) { clearTimeout(timer); pending = null; ko(e); } };
        if (wid === null) {
          box = document.createElement("div"); box.setAttribute("aria-hidden", "true");
          document.body.appendChild(box);
          wid = window.turnstile.render(box, {
            sitekey: SITEKEY, execution: "execute", appearance: "interaction-only",
            callback: function (t) { if (pending) pending.ok(t); },
            "error-callback": function () { if (pending) pending.ko(new Error("captcha")); },
            "timeout-callback": function () { if (pending) pending.ko(new Error("captcha")); }
          });
        } else { window.turnstile.reset(wid); }
        window.turnstile.execute(wid);
      });
    });
  }

  /* fetch qui ajoute l'en-tête X-Turnstile (le Worker le vérifie quand TURNSTILE_SECRET existe). Sans clé : fetch normal. */
  function guardedFetch(url, opts) {
    return token().then(function (tk) {
      if (!tk) return fetch(url, opts);
      var o = Object.assign({}, opts || {});
      var h = new Headers(o.headers || {}); h.set("X-Turnstile", tk); o.headers = h;
      return fetch(url, o);
    });
  }

  window.CMV_TS = { enabled: function () { return !!SITEKEY; }, token: token, fetch: guardedFetch };
})();
