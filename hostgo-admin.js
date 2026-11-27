/* Host & Go : interface de modération. Toute donnée affichée passe par textContent. La clé reste en mémoire (jamais stockée). */
(function () {
  "use strict";
  var API = String((window.HG_CONFIG && window.HG_CONFIG.api) || "https://visa-hostgo.rabehfly.workers.dev/hg").replace(/\/$/, "");
  var $ = function (id) { return document.getElementById(id); }, KEY = "", tab = "pending", urls = [], current = null;
  var TABS = [["pending", "En attente"], ["reported", "Signalées"], ["approved", "Approuvées"], ["hidden", "Masquées"], ["rejected", "Refusées"], ["removed", "Retirées"]];
  var COUNTRY = { tn: "Tunisie", ma: "Maroc", dz: "Algérie", fr: "France", de: "Allemagne", it: "Italie", es: "Espagne", pt: "Portugal", be: "Belgique", nl: "Pays-Bas", ie: "Irlande", other: "Autre" };
  var CAT = { family: "Accueil en famille", farm: "Ferme", garden: "Jardin", guesthouse: "Maison d’hôtes", exchange: "Échange culturel", pets: "Animaux" };
  var REASON = { spam: "Spam", fake: "Fausse offre", unsafe: "Danger", inappropriate: "Inapproprié", scam: "Arnaque", other: "Autre" };
  var TXT = { place: "Lieu", stay: "Hébergement", help: "Aide souhaitée", culture: "Échange culturel", intro: "Présentation", info: "Infos utiles" };
  function el(tag, text, cls) { var e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; }
  function api(path, opt) {
    opt = opt || {}; opt.headers = Object.assign({ "X-Admin-Key": KEY }, opt.headers || {}); opt.credentials = "omit";
    var ctl = typeof AbortController === "function" ? new AbortController() : null, t = ctl ? setTimeout(function () { ctl.abort(); }, 15000) : null; if (ctl) opt.signal = ctl.signal;
    return fetch(API + path, opt).then(function (r) { return { r: r, status: r.status }; }).catch(function () { return { status: 0 }; }).then(function (x) { if (t) clearTimeout(t); return x; });
  }
  function json(x) { return x.r ? x.r.json().catch(function () { return {}; }) : Promise.resolve({}); }
  function clearUrls() { urls.forEach(function (u) { URL.revokeObjectURL(u); }); urls = []; }
  function login() {
    KEY = $("key").value.trim(); $("login-err").textContent = ""; if (!KEY) return;
    api("/admin/queue?status=pending").then(function (x) {
      if (x.status === 200) { $("key").value = ""; $("login").hidden = true; $("app").hidden = false; return json(x).then(function (j) { tabs(j.counts || {}); render(j.items || []); }); }
      KEY = ""; $("login-err").textContent = x.status === 401 ? "Clé refusée." : x.status === 429 ? "Trop d’essais : patientez 15 minutes." : x.status === 0 ? "Connexion impossible." : "Erreur " + x.status + ".";
    });
  }
  function logout() { KEY = ""; clearUrls(); $("items").textContent = ""; $("detail").hidden = true; $("app").hidden = true; $("login").hidden = false; }
  function tabs(counts) {
    var box = $("tabs"); box.textContent = "";
    TABS.forEach(function (t) { var b = el("button", t[1] + " (" + (counts[t[0]] || 0) + ")"); b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", String(t[0] === tab)); b.addEventListener("click", function () { tab = t[0]; load(); }); box.appendChild(b); });
  }
  function load() {
    $("detail").hidden = true; $("state").textContent = "Chargement…";
    return api("/admin/queue?status=" + tab).then(function (x) {
      if (x.status === 401 || x.status === 429) { logout(); $("login-err").textContent = "Session refusée."; return; }
      if (x.status !== 200) { $("state").textContent = "Erreur de chargement (" + x.status + ")."; return; }
      return json(x).then(function (j) { tabs(j.counts || {}); render(j.items || []); });
    });
  }
  function render(items) {
    var ul = $("items"); ul.textContent = ""; $("state").textContent = items.length ? "" : "Aucune offre dans cette liste.";
    items.forEach(function (o) {
      var li = el("li", undefined, "hgo-item"); li.appendChild(el("h2", (COUNTRY[o.country] || o.country) + " — " + (o.city || "(retirée)")));
      li.appendChild(el("p", (o.firstName || "—") + " · " + new Date(o.createdAt).toISOString().slice(0, 10) + " · " + (o.cats || []).map(function (c) { return CAT[c] || c; }).join(", "), "hgo-meta"));
      if ((o.reports || []).length) li.appendChild(el("p", "⚠ " + o.reports.length + " signalement(s)", "hga-warn"));
      var b = el("button", "Examiner", "hgh-btn"); b.type = "button"; b.addEventListener("click", function () { open(o); }); li.appendChild(b); ul.appendChild(li);
    });
  }
  function row(dl, k, v) { if (v === undefined || v === "" || v === null) return; dl.appendChild(el("dt", k)); dl.appendChild(el("dd", String(v))); }
  function open(o) {
    current = o; clearUrls(); var d = $("detail"); d.textContent = ""; d.hidden = false;
    d.appendChild(el("h2", (COUNTRY[o.country] || o.country) + " — " + (o.city || "(retirée)")));
    d.appendChild(el("p", "Statut : " + o.status + " · identifiant " + o.id, "hgo-meta"));
    var dl = el("dl", undefined, "hga-grid");
    row(dl, "Prénom", o.firstName); row(dl, "E-mail", o.email); row(dl, "Adresse", [o.addr, o.zip].filter(Boolean).join(", ")); row(dl, "Catégories", (o.cats || []).map(function (c) { return CAT[c] || c; }).join(", "));
    row(dl, "Langue de la demande", o.lang); row(dl, "Note privée de l’hôte", o.pv);
    Object.keys(TXT).forEach(function (k) { row(dl, TXT[k], o.texts && o.texts[k]); }); d.appendChild(dl);
    var ph = el("div", undefined, "hga-photos"); d.appendChild(ph);
    (o.photos || []).forEach(function (p) {
      api("/admin/offers/" + o.id + "/photos/" + p.n).then(function (x) { if (x.status !== 200) return; return x.r.blob().then(function (bl) { var u = URL.createObjectURL(bl); urls.push(u); var im = new Image(); im.src = u; im.alt = "Photo " + (p.n + 1) + " de l’offre"; ph.appendChild(im); }); });
    });
    if ((o.reports || []).length) {
      d.appendChild(el("h3", "Signalements")); var ul = el("ul", undefined, "hga-reports");
      o.reports.forEach(function (r) { ul.appendChild(el("li", new Date(r.ts).toISOString().slice(0, 10) + " — " + (REASON[r.reason] || r.reason) + (r.note ? " : " + r.note : ""))); }); d.appendChild(ul);
    }
    if ((o.notes || []).length) { d.appendChild(el("h3", "Historique de modération")); var hl = el("ul", undefined, "hga-reports"); o.notes.forEach(function (n) { hl.appendChild(el("li", new Date(n.ts).toISOString().slice(0, 10) + " — " + n.action + (n.note ? " : " + n.note : ""))); }); d.appendChild(hl); }
    if (o.status !== "removed") {
      var lab = el("label", "Note interne (facultative)"); var note = el("input"); note.type = "text"; note.maxLength = 300; note.id = "note"; lab.appendChild(note); d.appendChild(lab);
      var act = el("div", undefined, "hga-act"), msg = el("p", "", "hgo-state"); msg.setAttribute("role", "status");
      [["approve", "Approuver", o.status !== "approved"], ["reject", "Refuser", o.status !== "rejected"], ["hide", "Masquer", o.status === "approved"], ["remove", "Retirer définitivement", true]].forEach(function (a) {
        if (!a[2]) return; var b = el("button", a[1], "hgh-btn" + (a[0] === "approve" ? "" : " ghost")); b.type = "button";
        b.addEventListener("click", function () {
          if (a[0] === "remove" && !window.confirm("Retirer définitivement cette offre ? Les données personnelles et les photos seront effacées.")) return;
          b.disabled = true;
          api("/admin/offers/" + o.id + "/" + a[0], { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ note: note.value }) }).then(function (x) {
            if (x.status === 200) { msg.textContent = "Fait : " + a[1].toLowerCase() + "."; load(); } else { b.disabled = false; msg.textContent = "Échec (" + x.status + ")."; }
          });
        }); act.appendChild(b);
      });
      d.appendChild(act); d.appendChild(msg);
    }
    d.focus();
  }
  $("go").addEventListener("click", login);
  $("key").addEventListener("keydown", function (e) { if (e.key === "Enter") login(); });
  $("out").addEventListener("click", logout);
  window.addEventListener("pagehide", clearUrls);
})();
