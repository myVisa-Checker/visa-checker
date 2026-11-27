/* Host & Go : consultation des offres (FR/EN/AR). Lit l'API du Worker « visa-hostgo » (worker/hostgo-worker.js).
   Tant que ce Worker n'est pas déployé, la page l'indique clairement ; rien n'est simulé. Tout texte d'offre est inséré avec textContent. */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var API = "https://visa-hostgo.rabehfly.workers.dev/hg";
  var CATS = ["family", "farm", "garden", "guesthouse", "exchange", "pets"], COUNTRIES = ["tn", "ma", "dz", "fr", "de", "it", "es", "pt", "be", "nl", "ie", "other"];
  var REASONS = ["spam", "fake", "unsafe", "inappropriate", "scam", "other"];
  var L = {
    fr: {
      backHome: "Retour à Host & Go", fPriv: "Confidentialité", fTerms: "Conditions", eyebrow: "OFFRES D’ACCUEIL", title: "Trouver une offre d’accueil", lead: "Seules les offres relues par notre équipe sont affichées.",
      any: "Tous", reset: "Réinitialiser les filtres", more: "Voir plus d’offres", back: "← Retour aux offres", country: "Pays", cat: "Catégorie", stay: "Séjour", lang: "Langue", trav: "Voyageurs", filters: "Filtres",
      loading: "Chargement…", none: "Aucune offre ne correspond à ces filtres.", count: "{n} offre(s)", closed: "Les offres ne sont pas encore ouvertes. Revenez bientôt : aucune offre n’est publiée pour le moment.", err: "Chargement impossible. Réessayez dans un instant.",
      view: "Voir l’offre", contact: "Voir les coordonnées", report: "Signaler cette offre", from: "Proposé par {n}", notFound: "Cette offre n’est plus disponible.",
      sec: { place: "Le lieu", stay: "L’hébergement", help: "L’aide attendue", culture: "Culture et échanges", intro: "Présentation", info: "Autres informations" }, cal: "Disponibilités",
      free: "Il vous reste {n} contact(s) gratuit(s).", contactIs: "Contact de {n} :", unlockText: "Vous avez utilisé vos contacts gratuits. Le paiement en ligne n’est pas encore ouvert : si l’équipe Host & Go vous a remis un code d’accès, saisissez-le ici.", unlockLabel: "Code d’accès", unlockGo: "Débloquer",
      badCode: "Code invalide ou déjà utilisé.", unlocked: "Accès illimité activé jusqu’au {d}.", reasonL: "Motif du signalement", noteL: "Précisions (facultatif)", reportGo: "Envoyer le signalement", reported: "Merci. Votre signalement a été transmis à l’équipe.", rate: "Trop de demandes. Réessayez plus tard.",
      reasons: { spam: "Publicité ou spam", fake: "Fausse annonce", unsafe: "Danger ou insécurité", inappropriate: "Contenu inapproprié", scam: "Arnaque ou demande d’argent", other: "Autre" },
      cats: { family: "Vie en famille", farm: "Fermes et agriculture", garden: "Jardinage", guesthouse: "Maisons d’hôtes", exchange: "Échange culturel", pets: "Animaux et gardiennage" },
      countries: ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"],
      stays: ["Aucun minimum", "1 semaine ou moins", "Au moins 1 semaine", "Au moins 2 semaines", "Au moins 3 semaines", "Au moins 1 mois"], stayF: ["Tous les séjours", "Séjour d’1 semaine maximum", "Séjour de 2 semaines maximum", "Séjour de 3 semaines maximum"],
      langs: ["Arabe", "Français", "Anglais", "Allemand", "Italien", "Espagnol", "Portugais", "Turc", "Russe", "Autre"], travs: ["Nomades numériques", "Familles", "Campeurs / camping-cars", "Voyageurs avec animaux"],
      months: ["Janv.", "Févr.", "Mars", "Avr.", "Mai", "Juin", "Juil.", "Août", "Sept.", "Oct.", "Nov.", "Déc."], states: ["", "Voyageurs recherchés", "Disponibilité partielle", "Pas de disponibilité"]
    },
    en: {
      backHome: "Back to Host & Go", fPriv: "Privacy", fTerms: "Terms", eyebrow: "HOSTING OFFERS", title: "Find a hosting offer", lead: "Only offers reviewed by our team are shown.",
      any: "All", reset: "Reset filters", more: "Show more offers", back: "← Back to offers", country: "Country", cat: "Category", stay: "Stay", lang: "Language", trav: "Travellers", filters: "Filters",
      loading: "Loading…", none: "No offer matches these filters.", count: "{n} offer(s)", closed: "Offers are not open yet. Please come back soon: no offer is published at the moment.", err: "Could not load. Please try again in a moment.",
      view: "View offer", contact: "Show contact details", report: "Report this offer", from: "Offered by {n}", notFound: "This offer is no longer available.",
      sec: { place: "The place", stay: "The accommodation", help: "Help expected", culture: "Culture and exchange", intro: "Introduction", info: "Other information" }, cal: "Availability",
      free: "You have {n} free contact(s) left.", contactIs: "Contact for {n}:", unlockText: "You have used your free contacts. Online payment is not open yet: if the Host & Go team gave you an access code, enter it here.", unlockLabel: "Access code", unlockGo: "Unlock",
      badCode: "Invalid or already used code.", unlocked: "Unlimited access enabled until {d}.", reasonL: "Reason for the report", noteL: "Details (optional)", reportGo: "Send report", reported: "Thank you. Your report has been sent to the team.", rate: "Too many requests. Please try later.",
      reasons: { spam: "Advertising or spam", fake: "Fake listing", unsafe: "Danger or safety concern", inappropriate: "Inappropriate content", scam: "Scam or request for money", other: "Other" },
      cats: { family: "Family life", farm: "Farms & agriculture", garden: "Gardening", guesthouse: "Guesthouses", exchange: "Cultural exchange", pets: "Pets & house-sitting" },
      countries: ["Tunisia", "Morocco", "Algeria", "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Ireland", "Other"],
      stays: ["No minimum", "1 week or less", "At least 1 week", "At least 2 weeks", "At least 3 weeks", "At least 1 month"], stayF: ["Any stay", "Stay of 1 week at most", "Stay of 2 weeks at most", "Stay of 3 weeks at most"],
      langs: ["Arabic", "French", "English", "German", "Italian", "Spanish", "Portuguese", "Turkish", "Russian", "Other"], travs: ["Digital nomads", "Families", "Campers/motorhomes", "Travelling with pets"],
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], states: ["", "Travellers needed", "Partial availability", "No availability"]
    },
    ar: {
      backHome: "العودة إلى Host & Go", fPriv: "الخصوصية", fTerms: "الشروط", eyebrow: "عروض الاستضافة", title: "ابحث عن عرض استضافة", lead: "تُعرض فقط العروض التي راجعها فريقنا.",
      any: "الكل", reset: "إعادة ضبط المرشحات", more: "عرض المزيد", back: "← العودة إلى العروض", country: "البلد", cat: "الفئة", stay: "مدة الإقامة", lang: "اللغة", trav: "المسافرون", filters: "المرشحات",
      loading: "جارٍ التحميل…", none: "لا يوجد عرض يطابق هذه المرشحات.", count: "{n} عرض", closed: "العروض غير مفتوحة بعد. عد قريباً: لا يوجد أي عرض منشور حالياً.", err: "تعذّر التحميل. حاول مجدداً بعد قليل.",
      view: "عرض التفاصيل", contact: "إظهار بيانات الاتصال", report: "الإبلاغ عن هذا العرض", from: "مقدَّم من {n}", notFound: "هذا العرض لم يعد متاحاً.",
      sec: { place: "المكان", stay: "الإقامة", help: "المساعدة المنتظرة", culture: "الثقافة والتبادل", intro: "تعريف", info: "معلومات أخرى" }, cal: "فترات التوفر",
      free: "بقي لديك {n} اتصال مجاني.", contactIs: "بيانات اتصال {n}:", unlockText: "استنفدت الاتصالات المجانية. الدفع عبر الإنترنت غير متاح بعد: إذا أعطاك فريق Host & Go رمز دخول فأدخله هنا.", unlockLabel: "رمز الدخول", unlockGo: "فتح الوصول",
      badCode: "الرمز غير صالح أو سبق استخدامه.", unlocked: "تم تفعيل الوصول غير المحدود حتى {d}.", reasonL: "سبب الإبلاغ", noteL: "تفاصيل (اختياري)", reportGo: "إرسال البلاغ", reported: "شكراً. تم إرسال بلاغك إلى الفريق.", rate: "طلبات كثيرة. حاول لاحقاً.",
      reasons: { spam: "إعلان أو بريد مزعج", fake: "إعلان مزيّف", unsafe: "خطر أو عدم أمان", inappropriate: "محتوى غير لائق", scam: "احتيال أو طلب مال", other: "أخرى" },
      cats: { family: "الحياة العائلية", farm: "المزارع والفلاحة", garden: "البستنة", guesthouse: "دور الضيافة", exchange: "التبادل الثقافي", pets: "الحيوانات وحراسة المنازل" },
      countries: ["تونس", "المغرب", "الجزائر", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "البرتغال", "بلجيكا", "هولندا", "إيرلندا", "أخرى"],
      stays: ["بلا حد أدنى", "أسبوع أو أقل", "أسبوع على الأقل", "أسبوعان على الأقل", "3 أسابيع على الأقل", "شهر على الأقل"], stayF: ["أي مدة", "إقامة أسبوع كحد أقصى", "إقامة أسبوعان كحد أقصى", "إقامة 3 أسابيع كحد أقصى"],
      langs: ["العربية", "الفرنسية", "الإنجليزية", "الألمانية", "الإيطالية", "الإسبانية", "البرتغالية", "التركية", "الروسية", "أخرى"], travs: ["الرحّالة الرقميون", "العائلات", "المخيّمون / المنازل المتنقلة", "مسافرون مع حيواناتهم"],
      months: ["جانفي", "فيفري", "مارس", "أفريل", "ماي", "جوان", "جويلية", "أوت", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"], states: ["", "المسافرون مطلوبون", "توفر جزئي", "لا يوجد توفر"]
    }
  }[lang];
  var $ = function (id) { return document.getElementById(id); };
  var page = 0, total = 0, current = null, busy = false, filters = {};
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  [].forEach.call(document.querySelectorAll("[data-i]"), function (e) { var v = L[e.getAttribute("data-i")]; if (typeof v === "string") e.textContent = v; });
  function fmt(s, o) { return s.replace(/\{(\w+)\}/g, function (m, k) { return o[k]; }); }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }

  /* ----- appels à l'API : 3 états possibles (ok, fermé = Worker absent, erreur) ----- */
  function api(path, opts) {
    opts = opts || {};
    return fetch(API + path, { method: opts.method || "GET", headers: Object.assign({ "Content-Type": "application/json" }, opts.headers || {}), body: opts.body ? JSON.stringify(opts.body) : undefined, cache: "no-store" })
      .then(function (r) { return r.json().catch(function () { return null; }).then(function (d) { return { status: r.status, data: d }; }); })
      .catch(function () { return { status: 0, data: null }; });
  }
  /* « fermé » = Worker pas encore déployé (404 sans corps JSON de l'API) ; hors ligne ou erreur serveur = simple erreur */
  var closed = function (r) { return (r.status === 0 && navigator.onLine !== false) || (r.status === 404 && !(r.data && r.data.error)); };

  /* ----- filtres ----- */
  function fill(sel, first, labels, values) { sel.textContent = ""; var o = el("option", "", first); o.value = ""; sel.appendChild(o); labels.forEach(function (t, i) { var x = el("option", "", t); x.value = values ? values[i] : String(i); sel.appendChild(x); }); }
  function initFilters() {
    var f = $("filters"); f.setAttribute("aria-label", L.filters);
    var ls = f.querySelectorAll("label"); [L.country, L.cat, L.stay, L.lang, L.trav].forEach(function (t, i) { ls[i].firstChild.nodeValue = t; });
    fill($("f-country"), L.any, L.countries, COUNTRIES); fill($("f-cat"), L.any, CATS.map(function (c) { return L.cats[c]; }), CATS);
    fill($("f-stay"), L.stayF[0], L.stayF.slice(1), ["1", "3", "4"]); fill($("f-lang"), L.any, L.langs); fill($("f-trav"), L.any, L.travs);
    $("f-reset").textContent = L.reset; $("more").textContent = L.more; $("back-list").textContent = L.back;
    ["f-country", "f-cat", "f-stay", "f-lang", "f-trav"].forEach(function (id) { $(id).addEventListener("change", function () { load(true); }); });
    $("f-reset").addEventListener("click", function () { ["f-country", "f-cat", "f-stay", "f-lang", "f-trav"].forEach(function (id) { $(id).value = ""; }); load(true); });
    f.addEventListener("submit", function (e) { e.preventDefault(); });
  }
  function query() {
    var q = [], m = { country: "f-country", cat: "f-cat", maxStay: "f-stay", lang: "f-lang", trav: "f-trav" };
    Object.keys(m).forEach(function (k) { var v = $(m[k]).value; if (v !== "") q.push(k + "=" + encodeURIComponent(v)); });
    q.push("page=" + page); return "?" + q.join("&");
  }

  /* ----- liste ----- */
  function card(o) {
    var li = el("li", "hgo-item"), h = el("h2", "", (o.cats || []).map(function (c) { return L.cats[c] || ""; }).filter(Boolean).join(" · ") + " — " + o.city);
    var chips = el("ul", "hgo-chips"); chips.appendChild(el("li", "", L.countries[COUNTRIES.indexOf(o.country)] || ""));
    chips.appendChild(el("li", "", L.stays[o.stay] || "")); (o.langs || []).forEach(function (r) { chips.appendChild(el("li", "", (L.langs[r[0]] || "") )); }); (o.trav || []).forEach(function (t) { chips.appendChild(el("li", "", L.travs[t] || "")); });
    var b = el("button", "hgh-btn ghost", L.view); b.type = "button"; b.addEventListener("click", function () { openDetail(o.id, o.firstName); });
    li.appendChild(h); li.appendChild(el("p", "hgo-meta", fmt(L.from, { n: o.firstName }))); if (o.excerpt) li.appendChild(el("p", "", o.excerpt)); li.appendChild(chips); li.appendChild(b); return li;
  }
  function load(reset) {
    if (busy) return; busy = true; if (reset) { page = 0; $("results").textContent = ""; }
    $("state").textContent = L.loading;
    api("/offers" + query()).then(function (r) {
      busy = false;
      if (closed(r)) { $("state").textContent = L.closed; $("more").hidden = true; return; }
      if (r.status !== 200 || !r.data || !Array.isArray(r.data.items)) { $("state").textContent = r.status === 429 ? L.rate : L.err; return; }
      r.data.items.forEach(function (o) { $("results").appendChild(card(o)); });
      total = r.data.total; var shown = $("results").children.length;
      $("state").textContent = total ? fmt(L.count, { n: total }) : L.none; $("more").hidden = shown >= total;
    });
  }
  $("more").addEventListener("click", function () { page += 1; load(false); });

  /* ----- détail, coordonnées, signalement ----- */
  function setBox(id, show) { ["contact-box", "unlock-box", "report-box"].forEach(function (b) { $(b).hidden = b !== id || !show; }); }
  function openDetail(id, name) {
    $("d-err").textContent = ""; setBox("", false); current = { id: id };
    api("/offers/" + id).then(function (r) {
      if (r.status !== 200 || !r.data || !r.data.offer) { $("d-err").textContent = r.status === 404 ? L.notFound : L.err; if (r.status !== 404) return; }
      var o = r.data && r.data.offer; if (!o) return;
      $("list-view").hidden = true; $("detail-view").hidden = false;
      $("h-detail").textContent = (o.cats || []).map(function (c) { return L.cats[c] || ""; }).filter(Boolean).join(" · ") + " — " + o.city;
      $("d-meta").textContent = fmt(L.from, { n: o.firstName }) + " · " + (L.countries[COUNTRIES.indexOf(o.country)] || "") + " · " + (L.stays[o.stay] || "");
      var box = $("d-texts"); box.textContent = ""; ["place", "stay", "help", "culture", "intro", "info"].forEach(function (k) { if (o.texts && o.texts[k]) { var d = el("div", "hgo-text"); d.appendChild(el("strong", "", L.sec[k])); d.appendChild(el("p", "", o.texts[k])); box.appendChild(d); } });
      $("d-cal-h").textContent = L.cal; var cal = $("d-cal"); cal.textContent = "";
      Object.keys(o.cal || {}).sort().forEach(function (y) { Object.keys(o.cal[y]).map(Number).sort(function (a, b) { return a - b; }).forEach(function (m) { var s = o.cal[y][m]; cal.appendChild(el("li", "s" + s, L.months[m] + " " + y + " : " + L.states[s])); }); });
      $("d-cal-h").hidden = !cal.children.length;
      $("d-contact").textContent = L.contact; $("d-report").textContent = L.report; current.name = o.firstName; $("detail").focus(); window.scrollTo(0, 0);
    });
  }
  $("back-list").addEventListener("click", function () { $("detail-view").hidden = true; $("list-view").hidden = false; current = null; });

  function token() { try { return localStorage.getItem("hg_visitor") || ""; } catch (e) { return ""; } }
  function ensureSession() {
    var t = token(); if (/^[0-9a-f]{48}$/.test(t)) return Promise.resolve(t);
    return api("/session", { method: "POST", body: {} }).then(function (r) { if (r.status !== 200 || !r.data || !r.data.token) throw r; try { localStorage.setItem("hg_visitor", r.data.token); } catch (e) { /* stockage indisponible */ } return r.data.token; });
  }
  function showContact(d) {
    var b = $("contact-box"); b.textContent = ""; b.appendChild(el("p", "", fmt(L.contactIs, { n: d.contact.firstName })));
    var a = el("a", "", d.contact.email); a.href = "mailto:" + encodeURIComponent(d.contact.email).replace(/%40/g, "@"); a.rel = "noopener noreferrer"; b.appendChild(el("p", "")).appendChild(a);
    if (typeof d.freeContacts === "number") b.appendChild(el("p", "hgo-meta", fmt(L.free, { n: d.freeContacts }))); setBox("contact-box", true);
  }
  function reveal(retry) {
    $("d-err").textContent = "";
    return ensureSession().then(function (t) {
      return api("/offers/" + current.id + "/contact", { method: "POST", headers: { Authorization: "Bearer " + t }, body: {} }).then(function (r) {
        if (r.status === 200 && r.data && r.data.contact) return showContact(r.data);
        if (r.status === 402) { $("unlock-text").textContent = L.unlockText; $("unlock-label").textContent = L.unlockLabel; $("unlock-go").textContent = L.unlockGo; return setBox("unlock-box", true); }
        if (r.status === 401 && !retry) { try { localStorage.removeItem("hg_visitor"); } catch (e) { /* stockage indisponible */ } return reveal(true); }
        $("d-err").textContent = r.status === 429 ? L.rate : r.status === 404 ? L.notFound : L.err;
      });
    }).catch(function (r) { $("d-err").textContent = r && r.status === 429 ? L.rate : L.err; });
  }
  $("d-contact").addEventListener("click", function () { reveal(false); });
  $("unlock-box").addEventListener("submit", function (e) {
    e.preventDefault(); $("d-err").textContent = "";
    ensureSession().then(function (t) { return api("/unlock", { method: "POST", headers: { Authorization: "Bearer " + t }, body: { code: $("unlock-code").value.trim() } }); }).then(function (r) {
      if (r.status === 200 && r.data && r.data.until) { $("unlock-code").value = ""; setBox("", false); return reveal(false).then(function () { $("contact-box").appendChild(el("p", "hgo-meta", fmt(L.unlocked, { d: new Date(r.data.until).toLocaleDateString(lang) }))); }); }
      $("d-err").textContent = r.status === 429 ? L.rate : L.badCode;
    }).catch(function () { $("d-err").textContent = L.err; });
  });
  $("d-report").addEventListener("click", function () {
    $("d-err").textContent = ""; $("report-reason-l").textContent = L.reasonL; $("report-note-l").textContent = L.noteL; $("report-go").textContent = L.reportGo;
    fill($("report-reason"), "", REASONS.map(function (k) { return L.reasons[k]; }), REASONS); $("report-reason").remove(0); setBox("report-box", true); $("report-reason").focus();
  });
  $("report-box").addEventListener("submit", function (e) {
    e.preventDefault(); $("d-err").textContent = "";
    api("/offers/" + current.id + "/report", { method: "POST", body: { reason: $("report-reason").value, note: $("report-note").value } }).then(function (r) {
      if (r.status === 200) { setBox("", false); $("report-note").value = ""; var b = $("contact-box"); b.textContent = L.reported; setBox("contact-box", true); return; }
      $("d-err").textContent = r.status === 429 ? L.rate : L.err;
    });
  });

  initFilters(); load(true);
})();
