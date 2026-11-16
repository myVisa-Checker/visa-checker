/* Traduction des pages de contenu (À propos, Guide, FAQ, Contact, Conditions, Confidentialité, 404).
   Langue : ?lang=, sinon celle choisie dans le site (enregistrée dans le navigateur), sinon celle du navigateur.
   Le français est la langue source : le texte français d'un bloc sert de clé. Les dictionnaires sont dans /i18n/*.js
   et s'enregistrent avec SI.add({ "texte français": ["English", "العربية"] }). Un texte sans traduction reste en français. */
(function () {
  "use strict";
  var LANGS = ["fr", "en", "ar"], APPKEY = "dossier-schengen-v2";
  var d = document, w = window;

  function ls(k, v) {
    try { if (v === undefined) return w.localStorage.getItem(k); w.localStorage.setItem(k, v); } catch (e) { /* ignore */ }
    return null;
  }
  function pick() {
    var m = /[?&]lang=(fr|en|ar)\b/.exec(location.search || "");
    if (m) return m[1];
    var s = ls("vc_lang");
    if (s && LANGS.indexOf(s) >= 0) return s;
    try {
      var raw = ls(APPKEY), o = raw ? JSON.parse(raw) : null;
      if (o && o.d && LANGS.indexOf(o.d.lang) >= 0) return o.d.lang;
    } catch (e) { /* ignore */ }
    var n = String((navigator.languages && navigator.languages[0]) || navigator.language || "").slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) >= 0 ? n : "fr";
  }
  /* Mémorise la langue pour toutes les pages (application, pages de contenu, espaces IA). */
  function remember(l) {
    ls("vc_lang", l);
    try {
      var raw = ls(APPKEY), o = raw ? JSON.parse(raw) : null;
      if (o && o.d) { o.d.lang = l; ls(APPKEY, JSON.stringify(o)); }
    } catch (e) { /* ignore */ }
  }

  var lang = pick(), IDX = lang === "en" ? 0 : lang === "ar" ? 1 : -1, DICT = {};
  function norm(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  function add(o) { for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) DICT[norm(k)] = o[k]; }
  function tr(key) {
    if (IDX < 0) return null;
    var e = DICT[norm(key)];
    return e && e[IDX] ? e[IDX] : null;
  }

  var BLOCKSEL = "p,div,ul,ol,li,table,tr,td,th,h1,h2,h3,h4,h5,h6,section,nav,footer,header,form,details,summary,select,textarea,option,button,label,fieldset,blockquote,main,article,input,svg,img,dl,dt,dd,figure,pre";
  var SKIP = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, SVG: 1, TEMPLATE: 1 };
  /* Blocs de texte : un élément sans bloc à l'intérieur. Un élément qui n'est qu'un seul lien/mot en gras est traité à l'intérieur. */
  function collect(root, out) {
    out = out || [];
    var kids = root.children, i;
    for (i = 0; i < kids.length; i++) {
      var el = kids[i];
      if (SKIP[el.nodeName.toUpperCase()] || el.hasAttribute("data-no-i18n")) continue;
      if (el.querySelector(BLOCKSEL)) { collect(el, out); continue; }
      var t = norm(el.textContent);
      if (!t) continue;
      if (onlyLinks(el)) { collect(el, out); continue; }
      var one = el.children.length === 1 ? el.children[0] : null;
      if (one && norm(one.textContent) === t && !one.querySelector(BLOCKSEL)) { out.push({ el: one, key: t }); continue; }
      out.push({ el: el, key: t });
    }
    return out;
  }
  /* Plusieurs liens séparés par des espaces (pied de page) : chaque lien est un bloc. */
  function onlyLinks(el) {
    if (el.children.length < 2) return false;
    var rest = el.textContent, i;
    for (i = 0; i < el.children.length; i++) {
      if (el.children[i].nodeName !== "A") return false;
      rest = rest.replace(el.children[i].textContent, "");
    }
    return !rest.trim();
  }
  var ATTRS = ["placeholder", "aria-label", "title", "alt"];
  function apply(root) {
    root = root || d.body;
    if (IDX >= 0) {
      collect(root).forEach(function (b) {
        var v = tr(b.key);
        if (v != null) b.el.innerHTML = v;
      });
      Array.prototype.forEach.call(root.querySelectorAll("*"), function (el) {
        ATTRS.forEach(function (a) {
          if (!el.hasAttribute(a)) return;
          var v = tr(el.getAttribute(a));
          if (v != null) el.setAttribute(a, v.replace(/<[^>]*>/g, ""));
        });
      });
      var t = tr(d.title); if (t) d.title = t.replace(/<[^>]*>/g, "");
      var m = d.querySelector('meta[name="description"]');
      if (m) { var md = tr(m.getAttribute("content")); if (md) m.setAttribute("content", md.replace(/<[^>]*>/g, "")); }
      var og = d.querySelectorAll('meta[property="og:title"],meta[property="og:description"]');
      Array.prototype.forEach.call(og, function (x) { var v = tr(x.getAttribute("content")); if (v) x.setAttribute("content", v.replace(/<[^>]*>/g, "")); });
    }
  }
  function setAttrs() {
    var h = d.documentElement;
    h.setAttribute("lang", lang);
    h.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  }
  /* Sélecteur FR / EN / عربي en haut de la page. Changer de langue recharge la page dans la nouvelle langue. */
  function switcher() {
    var host = d.querySelector("main");
    if (!host || host.querySelector(".sn-lang")) return;
    var box = d.createElement("div");
    box.className = "sn-lang"; box.setAttribute("role", "group"); box.setAttribute("aria-label", "Langue / Language / اللغة");
    [["fr", "FR"], ["en", "EN"], ["ar", "عربي"]].forEach(function (p) {
      var b = d.createElement("button");
      b.type = "button"; b.textContent = p[1]; b.setAttribute("data-l", p[0]); b.setAttribute("aria-pressed", String(p[0] === lang));
      b.addEventListener("click", function () {
        if (p[0] === lang) return;
        remember(p[0]);
        var u = location.search.replace(/([?&])lang=(fr|en|ar)&?/, "$1").replace(/[?&]$/, "");
        location.replace(location.pathname + u + location.hash);
      });
      box.appendChild(b);
    });
    host.insertBefore(box, host.firstChild);
  }
  function init() { apply(d.body); switcher(); }

  setAttrs();
  w.SI = { lang: lang, add: add, collect: collect, apply: apply, tr: tr, norm: norm, remember: remember };
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", init); else init();
})();
