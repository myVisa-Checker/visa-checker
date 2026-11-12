/* Page « Partenaires » : fenêtre de demande de partenariat.
   Parcours : cartes de profil -> fenêtre (champs communs + champs propres au profil) -> envoi.
   Envoi : POST JSON vers la route /partner du Worker « visa-chat » (qui transmet l'e-mail à CheckMyVisa).
   Secours : si le Worker ne confirme pas la réception, la demande est proposée par e-mail (mailto + copie du texte).
   Aucune donnée n'est stockée dans le navigateur. Le logo est redimensionné et converti dans le navigateur (WebP, 512 px max). */
(function () {
  "use strict";
  /* Traduction (partner-i18n.js) : sans lui, le formulaire reste en français. */
  var PF = window.PF || { lang: "fr", t: function (x) { return x; }, f: function (x, a) { for (var i = 0; i < (a || []).length; i++) x = x.split("{" + i + "}").join(a[i]); return x; }, apply: function () {} };
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/partner";
  var TO = "visacheckercontact@gmail.com";
  var TIMEOUT_MS = 20000;
  var LOGO_MAX_BYTES = 5 * 1024 * 1024;   // fichier choisi
  var LOGO_MAX_CHARS = 190000;            // data URL finale (~140 Ko)

  var COUNTRIES = ["Tunisie", "Maroc", "Algérie", "France", "Autre pays"];
  var MODELS = [
    ["listing", "Référencement gratuit sur le site"],
    ["deal", "Bon plan ou réduction pour les voyageurs"],
    ["affiliate", "Lien partenaire avec commission"],
    ["other", "Autre, à discuter"]
  ];

  /* Champs par profil. t : text | email | tel | url | select | area | checks | yesno ; req : obligatoire ; w : pleine largeur */
  var CATS = {
    agence: {
      label: "Agence de voyages",
      fields: [
        { n: "licence", l: "Licence ou numéro d'enregistrement", t: "text", h: "Registre du commerce, licence d'agence de voyages ou IATA." },
        { n: "services", l: "Services proposés", t: "checks", w: 1, o: ["Billets d'avion", "Réservations d'hôtel", "Assurance voyage", "Accompagnement du dossier de voyage", "Voyages organisés", "Transferts et location de voiture"] },
        { n: "cancellable", l: "Réservations annulables pour un dossier de visa ?", t: "yesno", w: 1 },
        { n: "zones", l: "Villes ou pays où vous intervenez", t: "text", w: 1 }
      ]
    },
    hotel: {
      label: "Hôtel et hébergement",
      fields: [
        { n: "kind", l: "Type d'établissement", t: "select", req: 1, o: ["Hôtel", "Résidence ou appart-hôtel", "Maison d'hôtes ou riad", "Auberge", "Autre"] },
        { n: "stars", l: "Classement", t: "select", o: ["Non classé", "1 étoile", "2 étoiles", "3 étoiles", "4 étoiles", "5 étoiles"] },
        { n: "address", l: "Adresse de l'établissement", t: "text", req: 1, w: 1 },
        { n: "mapLink", l: "Lien Google Maps ou Booking", t: "url", w: 1 },
        { n: "freeCancel", l: "Annulation gratuite possible (réservation pour visa) ?", t: "yesno", w: 1 },
        { n: "priceFrom", l: "Tarif à partir de (par nuit)", t: "text", ph: "Ex. 120 DT", w: 1 }
      ]
    },
    transport: {
      label: "Transport et mobilité",
      fields: [
        { n: "kinds", l: "Type de service", t: "checks", w: 1, req: 1, o: ["Transferts aéroport", "Location de voitures", "Chauffeur privé", "Transport interurbain", "Autre"] },
        { n: "zones", l: "Villes ou aéroports desservis", t: "text", w: 1 },
        { n: "fleet", l: "Taille de la flotte", t: "text", ph: "Ex. 12 véhicules" }
      ]
    },
    assurance: {
      label: "Assurance et services digitaux",
      fields: [
        { n: "kinds", l: "Type de service", t: "checks", w: 1, req: 1, o: ["Assurance voyage", "eSIM ou internet voyage", "Transfert d'argent", "Carte bancaire ou paiement voyage", "Autre"] },
        { n: "licence", l: "Agrément ou licence", t: "text", h: "Assureur, banque, opérateur ou établissement de paiement agréé." },
        { n: "coverage", l: "Pays couverts", t: "text" }
      ]
    },
    autre: {
      label: "Autre activité",
      fields: [
        { n: "activity", l: "Votre type d'activité", t: "text", req: 1, w: 1 }
      ]
    }
  };

  var SOCIALS = [
    { n: "facebook", l: "Facebook", ph: "facebook.com/votrepage" },
    { n: "instagram", l: "Instagram", ph: "@votrecompte ou lien" },
    { n: "tiktok", l: "TikTok", ph: "@votrecompte ou lien" },
    { n: "linkedin", l: "LinkedIn", ph: "linkedin.com/company/..." },
    { n: "whatsapp", l: "WhatsApp Business ou Telegram", ph: "+216 ... ou @compte" },
    { n: "other", l: "Autre lien (YouTube, X, Google Maps...)", ph: "https://..." }
  ];

  function $(id) { return document.getElementById(id); }
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;"); }
  function clean(v, max) { return String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max || 200); }
  function cleanMulti(v, max) { return String(v == null ? "" : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, " ").replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max || 1200); }

  var dlg = $("pf-dlg"), form = $("pf-form"), bodyEl = $("pf-body"), doneEl = $("pf-done");
  if (!dlg || !form) return;
  var cur = "", built = "", logo = null, sending = false, lastTrigger = null;

  /* ---------- Fabrication du formulaire ---------- */
  function fieldHtml(f) {
    var id = "pf-" + f.n, req = f.req ? ' required aria-required="true"' : "";
    var wide = f.w ? " pf-wide" : "";
    var lab = '<label for="' + id + '">' + esc(f.l) + (f.req ? ' <em aria-hidden="true">*</em>' : "") + "</label>";
    var desc = ' aria-describedby="' + (f.h ? "pf-h-" + f.n + " " : "") + 'pf-e-' + f.n + '"';
    var hint = f.h ? '<p class="pf-hint" id="pf-h-' + f.n + '">' + esc(f.h) + "</p>" : "";
    var err = '<p class="pf-err" id="pf-e-' + f.n + '" hidden></p>';
    var ctl = "";
    if (f.t === "select") {
      ctl = '<select id="' + id + '" name="' + f.n + '"' + req + desc + '><option value="">Choisir…</option>' + f.o.map(function (o) { return '<option value="' + esc(o) + '">' + esc(o) + "</option>"; }).join("") + "</select>";
    } else if (f.t === "area") {
      ctl = '<textarea id="' + id + '" name="' + f.n + '" rows="4" maxlength="' + (f.max || 1200) + '"' + req + desc + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : "") + "></textarea>";
    } else if (f.t === "checks" || f.t === "yesno") {
      var type = f.t === "checks" ? "checkbox" : "radio", opts = f.t === "yesno" ? ["Oui", "Non"] : f.o;
      return '<div class="pf-f' + wide + '" role="group" aria-labelledby="pf-l-' + f.n + '"><span class="pf-lab" id="pf-l-' + f.n + '">' + esc(f.l) + (f.req ? ' <em aria-hidden="true">*</em>' : "") + "</span>" +
        '<div class="pf-checks">' + opts.map(function (o) { return '<label class="pf-chk"><input type="' + type + '" name="' + f.n + '" value="' + esc(o) + '"> ' + esc(o) + "</label>"; }).join("") + "</div>" + hint + err + "</div>";
    } else {
      var ac = f.ac ? ' autocomplete="' + f.ac + '"' : ' autocomplete="off"';
      ctl = '<input type="' + (f.t || "text") + '" id="' + id + '" name="' + f.n + '"' + req + desc + ac + ' maxlength="' + (f.max || 200) + '"' + (f.ph ? ' placeholder="' + esc(f.ph) + '"' : "") + (f.t === "email" || f.t === "url" || f.t === "tel" ? ' inputmode="' + (f.t === "tel" ? "tel" : f.t) + '"' : "") + ">";
    }
    return '<div class="pf-f' + wide + '">' + lab + ctl + hint + err + "</div>";
  }

  function commonBefore() {
    return [
      { n: "company", l: "Nom de l'entreprise", t: "text", req: 1, w: 1, ac: "organization", max: 120 },
      { n: "country", l: "Pays", t: "select", req: 1, o: COUNTRIES },
      { n: "city", l: "Ville", t: "text", req: 1, ac: "address-level2", max: 80 },
      { n: "website", l: "Site web", t: "url", w: 1, ph: "https://www.votre-site.com", h: "Si vous en avez un." }
    ];
  }
  function commonAfter() {
    return [
      { n: "description", l: "Présentez votre activité", t: "area", req: 1, w: 1, max: 1200, h: "Ce que vous proposez, depuis quand, pour quels voyageurs (20 caractères minimum)." },
      { n: "offer", l: "Avantage proposé aux voyageurs", t: "text", w: 1, max: 200, ph: "Ex. -10 % avec un code, tarif négocié, service offert", h: "Facultatif." },
      { n: "model", l: "Type de collaboration souhaité", t: "select", w: 1, o: MODELS.map(function (m) { return m[1]; }) }
    ];
  }
  function contactFields() {
    return [
      { n: "contactName", l: "Nom et prénom", t: "text", req: 1, ac: "name", max: 100 },
      { n: "role", l: "Fonction", t: "text", ac: "organization-title", max: 80 },
      { n: "email", l: "E-mail", t: "email", req: 1, ac: "email", max: 254 },
      { n: "phone", l: "Téléphone ou WhatsApp", t: "tel", req: 1, ac: "tel", max: 30, ph: "+216 ..." }
    ];
  }
  function build(cat) {
    var C = CATS[cat], h = "";
    h += '<fieldset class="pf-sec"><legend>Votre entreprise</legend><div class="pf-row">' + commonBefore().map(fieldHtml).join("") + "</div></fieldset>";
    h += '<fieldset class="pf-sec"><legend>Présence en ligne</legend><p class="pf-note">Ajoutez ceux que vous avez : cela accélère la vérification de votre entreprise.</p><div class="pf-row">' +
      SOCIALS.map(function (s) { return fieldHtml({ n: s.n, l: s.l, t: "text", ph: s.ph, max: 200, w: s.n === "other" }); }).join("") + "</div></fieldset>";
    h += '<fieldset class="pf-sec"><legend>Votre logo</legend><div class="pf-f"><div class="pf-logo"><input type="file" id="pf-logo" accept="image/png,image/jpeg,image/webp" aria-describedby="pf-h-logo pf-e-logo">' +
      '<div class="pf-prev" id="pf-prev" hidden><img id="pf-prev-img" alt="Aperçu du logo"><button type="button" class="pf-btn pf-ghost" id="pf-logo-rm">Retirer</button></div></div>' +
      '<p class="pf-hint" id="pf-h-logo">PNG, JPG ou WebP, fond transparent de préférence, 5 Mo maximum : le logo est réduit automatiquement (512 px). Le SVG n\'est pas accepté ; exportez-le en PNG.</p><p class="pf-err" id="pf-e-logo" hidden></p></div></fieldset>';
    h += '<fieldset class="pf-sec"><legend>Votre activité · ' + esc(C.label) + '</legend><div class="pf-row">' + C.fields.map(fieldHtml).join("") + "</div></fieldset>";
    h += '<fieldset class="pf-sec"><legend>Votre proposition</legend><div class="pf-row">' + commonAfter().map(fieldHtml).join("") + "</div></fieldset>";
    h += '<fieldset class="pf-sec"><legend>Votre contact</legend><div class="pf-row">' + contactFields().map(fieldHtml).join("") + "</div></fieldset>";
    h += '<label class="pf-consent"><input type="checkbox" id="pf-consent" name="consent" required aria-required="true" aria-describedby="pf-e-consent"><span>J\'accepte que CheckMyVisa me contacte au sujet de cette demande et, après validation et accord écrit, publie le nom et le logo de mon entreprise. <em style="color:#b42318;font-style:normal">*</em></span></label><p class="pf-err" id="pf-e-consent" hidden></p>';
    h += '<div class="pf-hp" aria-hidden="true"><label>Ne pas remplir<input type="text" id="pf-hp" name="hp" tabindex="-1" autocomplete="off"></label></div>';
    bodyEl.innerHTML = h;
    PF.apply(bodyEl);
    built = cat; logo = null;
    $("pf-logo").addEventListener("change", onLogo);
    $("pf-logo-rm").addEventListener("click", function () { setLogo(null); $("pf-logo").value = ""; });
  }

  /* ---------- Logo : lecture, réduction, conversion ---------- */
  function fieldErr(n, msg) {
    var e = $("pf-e-" + n);
    if (e) { e.textContent = PF.t(msg || ""); e.hidden = !msg; }
    var c = $("pf-" + n);
    if (c && c.setAttribute) { if (msg) c.setAttribute("aria-invalid", "true"); else c.removeAttribute("aria-invalid"); }
  }
  function setLogo(l) {
    logo = l; fieldErr("logo", "");
    $("pf-prev").hidden = !l;
    if (l) $("pf-prev-img").src = l.dataUrl; else $("pf-prev-img").removeAttribute("src");
  }
  function guessType(f) {
    if (/^image\/(png|jpeg|webp)$/.test(f.type)) return f.type;
    var m = /\.(png|jpe?g|webp)$/i.exec(f.name || "");
    if (!m) return "";
    var x = m[1].toLowerCase();
    return x === "png" ? "image/png" : x === "webp" ? "image/webp" : "image/jpeg";
  }
  function encode(img) {
    var sizes = [512, 400, 300, 220], quals = [0.9, 0.8, 0.7], out = "", s, q;
    for (s = 0; s < sizes.length; s++) {
      var k = Math.min(1, sizes[s] / Math.max(img.naturalWidth, img.naturalHeight));
      var w = Math.max(1, Math.round(img.naturalWidth * k)), h = Math.max(1, Math.round(img.naturalHeight * k));
      var cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      var cx = cv.getContext("2d"); cx.clearRect(0, 0, w, h); cx.drawImage(img, 0, 0, w, h);
      for (q = 0; q < quals.length; q++) {
        out = cv.toDataURL("image/webp", quals[q]);
        if (out.indexOf("data:image/webp") !== 0) out = cv.toDataURL("image/png");
        if (out.length <= LOGO_MAX_CHARS) return out;
      }
    }
    return "";
  }
  function onLogo() {
    var f = this.files && this.files[0];
    if (!f) { setLogo(null); return; }
    var type = guessType(f);
    if (!type) { setLogo(null); fieldErr("logo", "Format non accepté. Utilisez un fichier PNG, JPG ou WebP."); return; }
    if (f.size > LOGO_MAX_BYTES) { setLogo(null); fieldErr("logo", "Fichier trop lourd (5 Mo maximum)."); return; }
    /* Lecture par FileReader (data URL) : la politique de sécurité de la page n'autorise pas les images blob:. */
    var rd = new FileReader();
    rd.onerror = function () { setLogo(null); fieldErr("logo", "Image illisible. Essayez un autre fichier."); };
    rd.onload = function () {
      var img = new Image();
      img.onload = function () {
        if (!img.naturalWidth || !img.naturalHeight) { setLogo(null); fieldErr("logo", "Image illisible."); return; }
        var data = encode(img);
        if (!data) { setLogo(null); fieldErr("logo", "Logo trop lourd même après réduction. Choisissez une image plus simple."); return; }
        var mime = data.slice(5, data.indexOf(";"));
        setLogo({ name: "logo." + (mime === "image/webp" ? "webp" : "png"), mime: mime, dataUrl: data });
      };
      img.onerror = function () { setLogo(null); fieldErr("logo", "Image illisible. Essayez un autre fichier."); };
      img.src = String(rd.result);
    };
    rd.readAsDataURL(f);
  }

  /* ---------- Lecture et validation ---------- */
  function val(n) { var e = form.elements[n]; return e && e.value != null ? e.value : ""; }
  function checked(n) { return Array.prototype.map.call(form.querySelectorAll('input[name="' + n + '"]:checked'), function (e) { return e.value; }); }
  function normUrl(v) {
    v = clean(v, 300); if (!v) return "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    try { var u = new URL(v); if (!/^https?:$/.test(u.protocol) || u.hostname.indexOf(".") < 1) return null; return u.href.slice(0, 300); } catch (e) { return null; }
  }
  function normSocial(v, n) {
    v = clean(v, 200); if (!v) return "";
    if (n === "whatsapp") return /^[+@\w][\w .@\-()+\/:]{2,99}$/.test(v) ? v : null;
    if (/^@?[\w.\-]{2,60}$/.test(v)) return v;
    return normUrl(v);
  }
  function collect() {
    var C = CATS[cur], errs = [], p = { details: {}, social: {} }, all = commonBefore().concat(C.fields, commonAfter(), contactFields());
    all.forEach(function (f) { fieldErr(f.n, ""); });
    SOCIALS.forEach(function (s) { fieldErr(s.n, ""); });
    fieldErr("consent", "");
    function bad(n, msg) { errs.push(n); fieldErr(n, msg); }
    function req(n, label) { var v = clean(val(n), 300); if (!v) bad(n, "Champ obligatoire."); return v; }

    p.company = req("company"); p.country = req("country"); p.city = req("city");
    var w = normUrl(val("website")); if (w === null) bad("website", "Adresse de site invalide (ex. https://www.exemple.com)."); else p.website = w;
    SOCIALS.forEach(function (s) { var r = normSocial(val(s.n), s.n); if (r === null) bad(s.n, "Lien ou identifiant invalide."); else p.social[s.n] = r; });

    C.fields.forEach(function (f) {
      var v;
      if (f.t === "checks") { v = checked(f.n); if (f.req && !v.length) bad(f.n, "Choisissez au moins une option."); }
      else if (f.t === "yesno") { v = checked(f.n)[0] || ""; }
      else if (f.t === "url") { v = normUrl(val(f.n)); if (v === null) { bad(f.n, "Adresse invalide."); v = ""; } }
      else { v = clean(val(f.n), f.max || 200); if (f.req && !v) bad(f.n, "Champ obligatoire."); }
      p.details[f.n] = v;
    });

    p.description = cleanMulti(val("description"), 1200);
    if (!p.description) bad("description", "Champ obligatoire."); else if (p.description.length < 20) bad("description", "Décrivez votre activité en 20 caractères au moins.");
    p.offer = clean(val("offer"), 200); p.model = clean(val("model"), 100);

    var cn = clean(val("contactName"), 100); if (!cn) bad("contactName", "Champ obligatoire.");
    var em = clean(val("email"), 254); if (!em) bad("email", "Champ obligatoire."); else if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(em)) bad("email", "Adresse e-mail invalide.");
    var ph = clean(val("phone"), 30); if (!ph) bad("phone", "Champ obligatoire."); else if (!/^\+?[\d][\d\s().\-]{6,24}$/.test(ph)) bad("phone", "Numéro invalide (ex. +216 20 000 000).");
    p.contact = { name: cn, role: clean(val("role"), 80), email: em, phone: ph };
    if (!$("pf-consent").checked) { bad("consent", "Votre accord est nécessaire pour envoyer la demande."); }
    if (logo === null && $("pf-logo").files && $("pf-logo").files.length && $("pf-e-logo").hidden) fieldErr("logo", "Le logo n'est pas prêt, choisissez-le à nouveau.");

    p.kind = "partner"; p.category = cur; p.categoryLabel = C.label; p.lang = PF.lang; p.source = "partenaires.html";
    p.logo = logo ? { name: logo.name, mime: logo.mime, dataUrl: logo.dataUrl } : null;
    p.consent = true; p.hp = clean(val("hp"), 50);
    return { errs: errs, payload: p };
  }

  /* ---------- Texte de la demande (secours e-mail) ---------- */
  function toText(p, noLogoNote) {
    var L = [], d = p.details, k;
    L.push("Demande de partenariat CheckMyVisa", "Profil : " + p.categoryLabel, "");
    L.push("Entreprise : " + p.company, "Lieu : " + p.city + ", " + p.country);
    if (p.website) L.push("Site : " + p.website);
    for (k in p.social) if (p.social[k]) L.push("Réseau " + k + " : " + p.social[k]);
    L.push("");
    for (k in d) {
      var v = Array.isArray(d[k]) ? d[k].join(", ") : d[k];
      if (v) L.push(labelOf(k) + " : " + v);
    }
    L.push("", "Présentation : " + p.description);
    if (p.offer) L.push("Avantage proposé : " + p.offer);
    if (p.model) L.push("Collaboration : " + p.model);
    L.push("", "Contact : " + p.contact.name + (p.contact.role ? " (" + p.contact.role + ")" : ""), "E-mail : " + p.contact.email, "Téléphone : " + p.contact.phone);
    if (p.logo && noLogoNote) L.push("", "Logo : à joindre à cet e-mail (fichier " + p.logo.name + ").");
    return L.join("\n");
  }
  function labelOf(k) {
    var all = []; Object.keys(CATS).forEach(function (c) { all = all.concat(CATS[c].fields); });
    for (var i = 0; i < all.length; i++) if (all[i].n === k) return all[i].l;
    return k;
  }
  function mailto(p) {
    var subj = "Demande de partenariat - " + p.categoryLabel + " - " + p.company;
    var body = toText(p, true);
    if (body.length > 1500) body = body.slice(0, 1500) + "\n[…]";
    return "mailto:" + TO + "?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
  }
  function copyText(t, done) {
    function legacy() {
      var ta = document.createElement("textarea"); ta.value = t; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      var ok = false; try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta); done(ok);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(function () { done(true); }, legacy); else legacy();
  }

  /* ---------- Envoi ---------- */
  function send(payload) {
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, TIMEOUT_MS) : null;
    return fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
      .then(function (r) { if (timer) clearTimeout(timer); return r.json().then(function (j) { return { ok: r.ok, j: j }; }, function () { return { ok: false, j: null }; }); })
      .then(function (r) { if (r.ok && r.j && r.j.ok === true && r.j.partner === true) return { sent: true }; return { sent: false, invalid: !!(r.j && r.j.error === "invalid"), rate: !!(r.j && r.j.error === "rate") }; },
        function () { if (timer) clearTimeout(timer); return { sent: false }; });
  }

  function showDone(kind, p) {
    form.hidden = true; doneEl.hidden = false;
    var h = "";
    if (kind === "sent") {
      h = '<span class="pf-ok" aria-hidden="true">✓</span><h2>' + PF.t("Demande envoyée") + '</h2><p>' + PF.f("Merci {0} ! Nous examinons chaque demande et vous répondons à {1}. Aucun partenariat n'est présumé tant que vous n'avez pas reçu notre confirmation écrite.", [esc(p.contact.name.split(" ")[0] || ""), '<b>' + esc(p.contact.email) + '</b>']) + '</p><div class="pf-actions"><button type="button" class="pf-btn" id="pf-done-close">' + PF.t("Fermer") + '</button></div>';
    } else if (kind === "rate") {
      h = '<span class="pf-ok pf-warn" aria-hidden="true">!</span><h2>' + PF.t("Trop de demandes") + '</h2><p>' + PF.f("Veuillez réessayer dans une heure, ou écrivez-nous à {0}.", ['<b>' + TO + '</b>']) + '</p><div class="pf-actions"><button type="button" class="pf-btn" id="pf-done-close">' + PF.t("Fermer") + '</button></div>';
    } else {
      var txt = toText(p, true);
      h = '<span class="pf-ok pf-warn" aria-hidden="true">!</span><h2>' + PF.t("Dernière étape : envoyez par e-mail") + '</h2><p>' + PF.f(p.logo ? "L'envoi automatique n'est pas disponible pour le moment. Votre demande est prête : ouvrez votre messagerie, <b>joignez votre logo</b> puis envoyez-la à {0}." : "L'envoi automatique n'est pas disponible pour le moment. Votre demande est prête : ouvrez votre messagerie puis envoyez-la à {0}.", ['<b>' + TO + '</b>']) + '</p>' +
        '<div class="pf-actions"><a class="pf-btn" id="pf-mailto" href="' + esc(mailto(p)) + '">' + PF.t("Ouvrir ma messagerie") + '</a><button type="button" class="pf-btn pf-ghost" id="pf-copy">' + PF.t("Copier la demande") + '</button></div>' +
        '<p class="pf-hint" id="pf-copied" role="status"></p><textarea class="pf-copy" readonly aria-label="' + PF.t("Texte de la demande") + '">' + esc(txt) + '</textarea>' +
        '<div class="pf-actions"><button type="button" class="pf-btn pf-ghost" id="pf-back">' + PF.t("Modifier ma demande") + '</button></div>';
    }
    doneEl.innerHTML = h;
    var c = $("pf-done-close"); if (c) c.addEventListener("click", closeDlg);
    var cp = $("pf-copy"); if (cp) cp.addEventListener("click", function () { copyText(txt, function (ok) { $("pf-copied").textContent = PF.t(ok ? "Demande copiée. Collez-la dans votre e-mail." : "Copie impossible : sélectionnez le texte ci-dessous."); }); });
    var bk = $("pf-back"); if (bk) bk.addEventListener("click", function () { doneEl.hidden = true; form.hidden = false; });
    if (kind === "sent") { built = ""; }
    doneEl.focus();
  }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    if (sending) return;
    var r = collect(), sum = $("pf-sum");
    if (r.errs.length) {
      sum.hidden = false; sum.textContent = r.errs.length === 1 ? PF.t("Un champ est à corriger.") : PF.f("{0} champs sont à corriger.", [r.errs.length]);
      var first = form.querySelector('[aria-invalid="true"]') || $("pf-e-" + r.errs[0]);
      if (first && first.focus) { first.focus(); if (first.scrollIntoView) first.scrollIntoView({ block: "center" }); }
      return;
    }
    sum.hidden = true;
    var p = r.payload;
    if (p.hp) { showDone("sent", p); return; } /* anti-robot : on ne transmet rien */
    sending = true; var btn = $("pf-send"); btn.disabled = true; btn.textContent = PF.t("Envoi en cours…");
    send(p).then(function (res) {
      sending = false; btn.disabled = false; btn.textContent = PF.t("Envoyer ma demande");
      showDone(res.sent ? "sent" : res.rate ? "rate" : "fallback", p);
    });
  });

  /* Efface le message d'erreur d'un champ dès qu'on le modifie ; masque le résumé quand tout est corrigé. */
  function clearOnEdit(e) {
    var n = e.target && e.target.name; if (!n) return;
    fieldErr(n, "");
    if (!form.querySelector('[aria-invalid="true"]') && !form.querySelector(".pf-err:not([hidden])")) $("pf-sum").hidden = true;
  }
  form.addEventListener("input", clearOnEdit);
  form.addEventListener("change", clearOnEdit);

  /* ---------- Ouverture / fermeture ---------- */
  function openDlg(cat, trigger) {
    if (!CATS[cat]) return;
    lastTrigger = trigger || null; cur = cat;
    if (built !== cat) build(cat);
    $("pf-tag").textContent = PF.t(CATS[cat].label);
    $("pf-sum").hidden = true; doneEl.hidden = true; form.hidden = false;
    if (typeof dlg.showModal === "function") { if (!dlg.open) dlg.showModal(); }
    else { dlg.setAttribute("open", ""); dlg.classList.add("pf-fallback"); }
    var f = $("pf-company"); if (f) setTimeout(function () { f.focus(); }, 30);
    dlg.scrollTop = 0;
  }
  function closeDlg() {
    if (typeof dlg.close === "function" && dlg.open) dlg.close(); else { dlg.removeAttribute("open"); }
    if (lastTrigger && lastTrigger.focus) lastTrigger.focus();
  }
  $("pf-close").addEventListener("click", closeDlg);
  $("pf-cancel").addEventListener("click", closeDlg);
  dlg.addEventListener("click", function (e) { if (e.target === dlg) closeDlg(); });
  dlg.addEventListener("close", function () { if (lastTrigger && lastTrigger.focus) lastTrigger.focus(); });

  Array.prototype.forEach.call(document.querySelectorAll("[data-cat]"), function (b) {
    b.addEventListener("click", function () { openDlg(b.getAttribute("data-cat"), b); });
  });
  var hash = (location.hash || "").slice(1);
  if (CATS[hash]) setTimeout(function () { openDlg(hash, document.querySelector('[data-cat="' + hash + '"]')); }, 200);
})();
