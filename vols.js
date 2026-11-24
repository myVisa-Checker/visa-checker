/* CheckMyVisa — page « Réserver un vol » (vols.html).
   Recherche via le Worker visa-flight (/flight/places, /flight/search), puis réservation en attente (/flight/book) et récapitulatif.
   Aucune donnée personnelle n'est conservée dans le navigateur. */
(function () {
  "use strict";
  var FH = window.VCFlightHold;
  if (!FH || !FH.enabled()) { location.replace("./?accueil=1"); return; }
  var URL_ = FH.url;

  var T = {
    fr: {
      h1: ["Réservez votre vol", "en toute confiance"], sub: "Cherchez. Réservez. Obtenez un code PNR vérifiable.",
      allAp: "Tous les aéroports", upd: ["Nouvelle version disponible", "Mettre à jour"], trust: ["Code PNR vérifiable", "Réservation immédiate", "Sans payer le billet"],
      nav: ["Guide Visa", "À propos", "Contact"], destT: "Destinations populaires", destGo: "Chercher un vol",
      stats: [["FR · EN · AR", "Interface en 3 langues"], ["Réservation vérifiable", "Code PNR contrôlable chez la compagnie"], ["Compagnies aériennes", "Choisissez parmi plusieurs vols"], ["Assistante IA Aïcha", "Elle vérifie votre dossier"]],
      dest: { PAR: "Paris", DXB: "Dubaï", NYC: "New York", IST: "Istanbul", LON: "Londres" }, footT: "Réservation en attente : billet non émis, annulée automatiquement à l'échéance.",
      one: "Aller simple", rt: "Aller-retour", from: "Départ", to: "Destination", d1: "Date de départ", d2: "Date de retour", pax: "Voyageurs", adult: "1 Adulte", cabin: "Classe",
      cabins: { economy: "Économique", premium_economy: "Premium éco", business: "Affaires", first: "Première" }, search: "Rechercher", searching: "Recherche en cours…",
      ph: "Ville ou code", pick: "Choisissez un aéroport dans la liste.", dates: "Indiquez la date de départ (et de retour pour un aller-retour).",
      found: function (n) { return n + " vol(s) réservable(s) sans paiement"; }, none: "Aucun vol réservable sans paiement sur ces dates. Essayez d'autres dates ou un aéroport proche.",
      net: "Connexion impossible. Réessayez dans un instant.", expires: "Valable jusqu'au", price: "Prix si vous confirmez", book: "Réserver ce vol (attente)", booking: "Réservation en cours…",
      back: "← Modifier la recherche", pax2: "Passager (comme sur le passeport)", given: "Prénom(s)", family: "Nom", gender: "Genre", m: "Masculin", f: "Féminin", born: "Date de naissance", mail: "E-mail", phone: "Téléphone (avec indicatif, ex. +216…)",
      rdv: "Date du rendez-vous consulaire (facultatif)", confirm: "Obtenir mon code PNR", fill: "Merci de remplir tous les champs obligatoires.",
      untilT: "Valable jusqu'au", leftT: "Temps restant", stHold: "En attente — billet non émis", stExpired: "Expirée — annulée automatiquement par la compagnie", stIssued: "Payée — billet émis par la compagnie", refresh: "Actualiser le statut",
      expiredNote: "La date limite est dépassée : la compagnie annule automatiquement une réservation non émise. Elle n'est plus valable pour un dossier de visa.", noDeadline: "La compagnie n'a pas communiqué de date limite. Vérifiez-la auprès d'elle avec le code PNR.",
      badge: "Réservation temporaire — billet non émis", pnr: "Référence de réservation (PNR)", passenger: "Passager", print: "Télécharger en PDF / Imprimer", again: "Nouvelle recherche",
      warn: function (d) { return "Attention : cette réservation expire avant votre rendez-vous consulaire (" + d + "). Refaites-la plus près de la date."; },
      legal: "Il s'agit d'une réservation temporaire (mode attente), non émise et à validité limitée, destinée aux démarches de visa. Elle s'annule automatiquement à la date limite fixée par la compagnie si elle n'est pas payée. Ce n'est pas un billet. Vérifiez auprès du consulat qu'une réservation en attente est acceptée pour votre dossier.",
      doc: "Réservation en attente de paiement, annulée automatiquement à l'échéance. Ce document n'est pas un billet.",
      d: ["j", "h", "min"]
    },
    en: {
      h1: ["Book your flight", "with confidence"], sub: "Search. Hold. Get a verifiable PNR code.",
      allAp: "All airports", upd: ["New version available", "Update"], trust: ["Verifiable PNR code", "Instant booking", "No need to pay for the ticket"],
      nav: ["Visa Guide", "About", "Contact"], destT: "Popular destinations", destGo: "Search a flight",
      stats: [["FR · EN · AR", "Interface in 3 languages"], ["Verifiable booking", "PNR code you can check with the airline"], ["Airlines", "Choose among several flights"], ["Aicha AI assistant", "She checks your file"]],
      dest: { PAR: "Paris", DXB: "Dubai", NYC: "New York", IST: "Istanbul", LON: "London" }, footT: "Booking on hold: ticket not issued, automatically cancelled at the deadline.",
      one: "One way", rt: "Round trip", from: "From", to: "To", d1: "Departure date", d2: "Return date", pax: "Travellers", adult: "1 Adult", cabin: "Class",
      cabins: { economy: "Economy", premium_economy: "Premium economy", business: "Business", first: "First" }, search: "Search", searching: "Searching…",
      ph: "City or code", pick: "Pick an airport from the list.", dates: "Enter the departure date (and the return date for a round trip).",
      found: function (n) { return n + " flight(s) bookable without payment"; }, none: "No flight can be held without payment on these dates. Try other dates or a nearby airport.",
      net: "Connection failed. Please try again in a moment.", expires: "Valid until", price: "Price if you confirm", book: "Hold this flight", booking: "Booking…",
      back: "← Change search", pax2: "Passenger (as on the passport)", given: "Given name(s)", family: "Family name", gender: "Gender", m: "Male", f: "Female", born: "Date of birth", mail: "Email", phone: "Phone (with country code, e.g. +216…)",
      rdv: "Consular appointment date (optional)", confirm: "Get my PNR code", fill: "Please fill in all required fields.",
      untilT: "Valid until", leftT: "Time left", stHold: "On hold — ticket not issued", stExpired: "Expired — automatically cancelled by the airline", stIssued: "Paid — ticket issued by the airline", refresh: "Refresh status",
      expiredNote: "The deadline has passed: the airline automatically cancels a reservation that has not been ticketed. It is no longer valid for a visa file.", noDeadline: "The airline has not given a deadline. Check it with them using the PNR code.",
      badge: "Temporary reservation — ticket not issued", pnr: "Booking reference (PNR)", passenger: "Passenger", print: "Download as PDF / Print", again: "New search",
      warn: function (d) { return "Warning: this reservation expires before your consular appointment (" + d + "). Book it again closer to the date."; },
      legal: "This is a temporary reservation (on hold), not ticketed and valid for a limited time, intended for visa applications. It is cancelled automatically at the airline's deadline if it is not paid. It is not a ticket. Check with the consulate that an on-hold reservation is accepted for your application.",
      doc: "Reservation awaiting payment, automatically cancelled at the deadline. This document is not a ticket.",
      d: ["d", "h", "min"]
    },
    ar: {
      h1: ["احجز رحلتك", "بثقة"], sub: "ابحث. احجز. واحصل على رمز PNR قابل للتحقق.",
      allAp: "كل المطارات", upd: ["إصدار جديد متاح", "تحديث"], trust: ["رمز PNR قابل للتحقق", "حجز فوري", "دون دفع ثمن التذكرة"],
      nav: ["دليل التأشيرة", "من نحن", "اتصل بنا"], destT: "وجهات شائعة", destGo: "ابحث عن رحلة",
      stats: [["FR · EN · AR", "واجهة بثلاث لغات"], ["حجز قابل للتحقق", "رمز PNR يمكنك التحقق منه لدى الشركة"], ["شركات الطيران", "اختر من بين عدة رحلات"], ["المساعدة الذكية عائشة", "تتحقق من ملفك"]],
      dest: { PAR: "باريس", DXB: "دبي", NYC: "نيويورك", IST: "إسطنبول", LON: "لندن" }, footT: "حجز معلّق: التذكرة غير مُصدرة، ويُلغى تلقائيًا عند انتهاء المهلة.",
      one: "ذهاب فقط", rt: "ذهاب وإياب", from: "من", to: "إلى", d1: "تاريخ الذهاب", d2: "تاريخ العودة", pax: "المسافرون", adult: "بالغ واحد", cabin: "الدرجة",
      cabins: { economy: "اقتصادية", premium_economy: "اقتصادية مميزة", business: "رجال الأعمال", first: "الأولى" }, search: "بحث", searching: "جارٍ البحث…",
      ph: "مدينة أو رمز", pick: "اختر مطارًا من القائمة.", dates: "أدخل تاريخ الذهاب (وتاريخ العودة للذهاب والإياب).",
      found: function (n) { return n + " رحلة قابلة للحجز دون دفع"; }, none: "لا توجد رحلة قابلة للحجز دون دفع في هذه التواريخ. جرّب تواريخ أخرى أو مطارًا قريبًا.",
      net: "تعذّر الاتصال. حاول مرة أخرى بعد قليل.", expires: "صالح حتى", price: "السعر عند التأكيد", book: "احجز هذه الرحلة (معلّق)", booking: "جارٍ الحجز…",
      back: "→ تعديل البحث", pax2: "المسافر (كما في جواز السفر)", given: "الاسم الشخصي", family: "اللقب", gender: "الجنس", m: "ذكر", f: "أنثى", born: "تاريخ الميلاد", mail: "البريد الإلكتروني", phone: "الهاتف (مع رمز الدولة، مثل +216…)",
      rdv: "تاريخ موعد القنصلية (اختياري)", confirm: "احصل على رمز PNR", fill: "يرجى ملء جميع الحقول الإلزامية.",
      untilT: "صالح حتى", leftT: "الوقت المتبقي", stHold: "معلّق — التذكرة غير مُصدرة", stExpired: "منتهي — ألغته شركة الطيران تلقائيًا", stIssued: "مدفوع — أصدرت الشركة التذكرة", refresh: "تحديث الحالة",
      expiredNote: "انتهت المهلة: تلغي شركة الطيران تلقائيًا الحجز غير المُصدر. لم يعد صالحًا لملف التأشيرة.", noDeadline: "لم تحدد شركة الطيران مهلة. تحقق منها لديها برمز PNR.",
      badge: "حجز مؤقت — التذكرة غير مُصدرة", pnr: "مرجع الحجز (PNR)", passenger: "المسافر", print: "تنزيل PDF / طباعة", again: "بحث جديد",
      warn: function (d) { return "تنبيه: ينتهي هذا الحجز قبل موعد القنصلية (" + d + "). أعد الحجز قرب الموعد."; },
      legal: "هذا حجز مؤقت (معلّق)، غير مُصدر وصالح لمدة محدودة، مخصص لإجراءات التأشيرة. يُلغى تلقائيًا في الموعد الذي تحدده الشركة إذا لم يُدفع. هذه ليست تذكرة. تحقق لدى القنصلية من قبول الحجز المعلّق ضمن ملفك.",
      doc: "حجز في انتظار الدفع، يُلغى تلقائيًا عند انتهاء المهلة. هذه الوثيقة ليست تذكرة.",
      d: ["ي", "س", "د"]
    }
  };

  var L = "fr";
  try { var sl = localStorage.getItem("vc_lang"); if (sl && T[sl]) L = sl; } catch (e) { /* ignore */ }
  var t = T[L];
  document.documentElement.lang = L;
  document.documentElement.dir = L === "ar" ? "rtl" : "ltr";

  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var locale = L === "ar" ? "ar-TN" : L === "en" ? "en-GB" : "fr-FR";
  var fmt = function (iso) { if (!iso) return "—"; try { return new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return iso; } };
  var today = function () { var d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };

  var trip = "rt", pax = null, offers = [], cur = null, tick = null, appt = "";
  var pick = { from: "TUN", to: "" }, notes = { from: "", to: "" };
  function showNotes() {
    var n = $("vl-note"), txt = [notes.from, notes.to].filter(Boolean).join("  ·  ");
    n.textContent = txt; n.hidden = !txt;
  }

  function post(path, payload) {
    var ts = path === "/flight/book" && window.CMV_TS ? window.CMV_TS.token() : Promise.resolve("");
    return ts.then(function (tk) { if (tk) payload.turnstile = tk; return fetch(URL_ + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) }); })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || d.ok === false) throw new Error(d.error || ""); return d; }); });
  }
  var msg = function (e) { return e && e.message && e.message !== "Failed to fetch" ? e.message : t.net; };
  function showErr(m) { var e = $("vl-err"); e.textContent = m || ""; e.hidden = !m; }

  var IC = {
    plane: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.500a2.5 2.5 0 0 1 0 5z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 9h14v11H5z"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z"/></svg>',
    seat: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h7l3 5h2.500l-3-5.500A2 2 0 0 0 17 11V4a2 2 0 0 0-2-2zM4 17v2h9v-2z"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8.500-7 10-4-1.500-7-5-7-10V6z" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    bolt: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13 2L5 14h6l-1 8 8-12h-6z" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linejoin="round"/></svg>',
    wallet: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="13" rx="2.500" fill="none" stroke="currentColor" stroke-width="1.900"/><path d="M3 10h18M16 14.500h2" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.700"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.700"/></svg>',
    headset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="currentColor" stroke-width="1.800"/><rect x="3" y="14" width="4" height="6" rx="1.500" fill="none" stroke="currentColor" stroke-width="1.800"/><rect x="17" y="14" width="4" height="6" rx="1.500" fill="none" stroke="currentColor" stroke-width="1.800"/><path d="M19 20c0 1.500-2 2-5 2" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.200"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    swap: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7h11l-3-3 1.400-1.400L22 8l-5.600 5.400L15 12l3-3H7zm10 10H6l3 3-1.400 1.400L2 16l5.600-5.400L9 12l-3 3h11z"/></svg>'
  };
  function setGo(txt, icon) { $("vl-go").innerHTML = (icon ? '<i class="vl-ic">' + IC.search + "</i>" : "") + esc(txt); }
  function lab(id, ic, text) { $(id).innerHTML = '<i class="vl-ic">' + IC[ic] + "</i>" + esc(text); }
  /* ---------- texte statique ---------- */
  function paintStatic() {
    $("vl-h1").innerHTML = esc(t.h1[0]) + " <em>" + esc(t.h1[1]) + "</em>";
    $("vl-sub").textContent = t.sub;
    lab("vl-l-from", "plane", t.from); lab("vl-l-to", "pin", t.to); lab("vl-l-d1", "cal", t.d1); lab("vl-l-d2", "cal", t.d2);
    lab("vl-l-pax", "user", t.pax); paintPax();
    $("vl-from").placeholder = t.ph; $("vl-to").placeholder = t.ph;
    setGo(t.search, true); $("vl-legal").textContent = t.legal;
    $("vl-d1").min = $("vl-d2").min = today();
    var tIc = ["shield", "bolt", "wallet"];
    $("vl-trust").innerHTML = t.trust.map(function (x, i) { return '<li><i class="vl-ic">' + IC[tIc[i]] + "</i>" + esc(x) + "</li>"; }).join("");
    var sIc = ["globe", "shield", "plane", "headset"];
    $("vl-stats").innerHTML = t.stats.map(function (x, i) { return '<li><i class="vl-ic">' + IC[sIc[i]] + "</i><span><b>" + esc(x[0]) + "</b>" + esc(x[1]) + "</span></li>"; }).join("");
    $("vl-dest-h").innerHTML = '<i class="vl-ic">' + IC.pin + "</i>" + esc(t.destT);
    $("vl-cards").innerHTML = [["PAR", "paris"], ["DXB", "dubai"], ["NYC", "newyork"], ["IST", "istanbul"], ["LON", "london"]].map(function (d) {
      return '<li><button type="button" class="vl-dc" data-dest="' + d[0] + '"><img src="./images/dest-' + d[1] + '.webp" alt="" width="221" height="110" loading="lazy"><span class="vl-dn">' + esc(t.dest[d[0]]) + '</span><span class="vl-dg">' + esc(t.destGo) + '<i class="vl-ic">' + IC.arrow + "</i></span></button></li>";
    }).join("");
    $("vl-n-guide").textContent = t.nav[0]; $("vl-n-about").textContent = t.nav[1]; $("vl-n-contact").textContent = t.nav[2];
    $("vl-foot-t").textContent = t.footT;
    paintTabs();
  }
  function paintTabs() {
    $("vl-tabs").innerHTML = [["one", t.one, "plane"], ["rt", t.rt, "swap"]].map(function (x) { return '<button type="button" class="chip" data-trip="' + x[0] + '" aria-pressed="' + (trip === x[0]) + '"><i class="vl-ic">' + IC[x[2]] + "</i>" + esc(x[1]) + "</button>"; }).join("");
    $("vl-d2w").hidden = trip === "one";
  }

  /* ---------- autocomplétion ---------- */
  /* Aéroports tunisiens : repli si le Worker ne répond pas (et recherche par « Tunisie »). */
  var TN_AP = [
    ["TUN", "Tunis", "Tunis-Carthage"], ["NBE", "Enfidha", "Enfidha-Hammamet"], ["MIR", "Monastir", "Habib Bourguiba"], ["DJE", "Djerba", "Djerba-Zarzis"],
    ["SFA", "Sfax", "Thyna"], ["TOE", "Tozeur", "Tozeur-Nefta"], ["TBJ", "Tabarka", "Tabarka-Aïn Draham"], ["GAF", "Gafsa", "Gafsa-Ksar"], ["GAE", "Gabès", "Gabès-Matmata"]
  ];
  function plain(s) { return String(s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function localPlaces(q) {
    var k = plain(q).trim(); if (k.length < 2) return [];
    var all = "tunisie tunisia tunisien تونس".indexOf(k) > -1 || k === "tn";
    return TN_AP.filter(function (a) { return all || plain(a[0] + " " + a[1] + " " + a[2]).indexOf(k) > -1; })
      .map(function (a) { return { iata: a[0], type: "airport", name: a[2], city: a[1], country: "TN" }; });
  }
  function countryName(c) { try { return c ? new Intl.DisplayNames([locale], { type: "region" }).of(c) : ""; } catch (e) { return ""; } }
  function setupAc(key) {
    var inp = $("vl-" + key), list = $("vl-" + key + "-list"), timer = null, seq = 0, items = [], idx = -1;
    function close() { list.hidden = true; inp.setAttribute("aria-expanded", "false"); idx = -1; }
    function choose(p) {
      notes[key] = "";
      if (p.type === "city") {
        var ap = items.filter(function (x) { return x.type === "airport" && x.city === p.name; }).map(function (x) { return x.name + " (" + x.iata + ")"; });
        if (ap.length) notes[key] = p.name + " (" + p.iata + ") : " + ap.join(", ");
      }
      showNotes();
      pick[key] = p.iata; inp.value = p.iata + " - " + (p.city || p.name) + (countryName(p.country) ? ", " + countryName(p.country) : ""); close(); }
    function hl() { Array.prototype.forEach.call(list.children, function (li, i) { li.setAttribute("aria-selected", String(i === idx)); }); }
    inp.addEventListener("input", function () {
      pick[key] = ""; notes[key] = ""; showNotes();
      var q = inp.value.trim(); clearTimeout(timer);
      if (q.length < 2) return close();
      if (/^[A-Za-z]{3}$/.test(q)) pick[key] = q.toUpperCase();
      timer = setTimeout(function () {
        var my = ++seq;
        function render(list0, errTxt) {
          items = list0 || [];
          var aps = items.filter(function (x) { return x.type === "airport"; });
          if (aps.length) items = aps;
          if (!items.length) {
            if (!errTxt) return close();
            list.innerHTML = '<li class="vl-err" role="option" aria-disabled="true"><span>' + esc(errTxt) + "</span></li>";
            list.hidden = false; inp.setAttribute("aria-expanded", "true"); idx = -1; return;
          }
          list.innerHTML = items.map(function (p, i) {
            var cc = /^[A-Za-z]{2}$/.test(p.country || "") ? p.country.toLowerCase() : "";
            var nm = p.type === "city" ? p.name : (p.city || p.name);
            var ctry = countryName(p.country);
            return '<li role="option" data-i="' + i + '" class="vl-a">' + (cc ? '<img class="vl-fl" src="./flags/' + cc + '.png" alt="" width="22" height="16">' : '<i class="vl-fl"></i>') + "<span><b dir=\"ltr\">" + esc(p.iata) + "</b> - " + esc(nm) + (ctry ? ", " + esc(ctry) : "") + (p.type === "airport" && p.name && p.name !== nm ? "<small>" + esc(p.name) + "</small>" : "") + "</span></li>";
          }).join("");
          list.hidden = false; inp.setAttribute("aria-expanded", "true"); idx = -1;
        }
        post("/flight/places", { query: q }).then(function (r) {
          if (my !== seq) return;
          var got = r.places || [], loc = localPlaces(q);
          render(got.length ? got : loc);
        }).catch(function (er) {
          if (my !== seq) return;
          var loc = localPlaces(q);
          render(loc, loc.length ? "" : msg(er));
        });
      }, 250);
    });
    inp.addEventListener("keydown", function (e) {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { idx = Math.min(items.length - 1, idx + 1); hl(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { idx = Math.max(0, idx - 1); hl(); e.preventDefault(); }
      else if (e.key === "Enter" && idx >= 0) { choose(items[idx]); e.preventDefault(); }
      else if (e.key === "Escape") close();
    });
    list.addEventListener("mousedown", function (e) { var li = e.target.closest("li[data-i]"); if (li) { e.preventDefault(); choose(items[+li.getAttribute("data-i")]); } });
    list.addEventListener("error", function (e) { if (e.target.tagName === "IMG") e.target.style.visibility = "hidden"; }, true);
    inp.addEventListener("blur", function () { setTimeout(close, 120); });
  }

  /* ---------- recherche ---------- */
  function segs(slices) {
    return (slices || []).map(function (s) {
      return '<div class="fh-sl"><b dir="ltr">' + esc(s.origin) + " → " + esc(s.destination) + "</b>" + (s.segments || []).map(function (g) {
        return '<div class="fh-sg" dir="ltr">' + esc(g.flight_number) + " · " + esc(g.carrier) + " · " + esc(g.from) + " " + fmt(g.departing_at) + " → " + esc(g.to) + " " + fmt(g.arriving_at) + "</div>";
      }).join("") + "</div>";
    }).join("");
  }

  /* ---------- cartes de résultats ---------- */
  var X = {
    fr: { sel: "Choisir", det: "Voir les détails", direct: "Direct", stops: function (n) { return n + " escale" + (n > 1 ? "s" : ""); } },
    en: { sel: "Select", det: "View details", direct: "Direct", stops: function (n) { return n + " stop" + (n > 1 ? "s" : ""); } },
    ar: { sel: "اختيار", det: "عرض التفاصيل", direct: "مباشر", stops: function (n) { return n + (n > 1 ? " توقفات" : " توقف"); } }
  }[L];
  var XP = {
    fr: { lab: ["Adulte", "Enfant (2-11 ans)", "Bébé (moins de 2 ans)"], one: ["Adulte", "Enfant", "Bébé"], sum: function (a, c, i) { return a + " Adulte" + (a > 1 ? "s" : "") + ", " + c + " Enfant" + (c > 1 ? "s" : "") + ", " + i + " Bébé" + (i > 1 ? "s" : ""); },
      svc: function (n, tot) { return "Tarif du service : 15 TND × " + n + " passager" + (n > 1 ? "s" : "") + " = " + tot + " TND"; }, babyMax: "Un bébé par adulte au maximum.", born: "Date de naissance", email: "E-mail (la réservation sera envoyée à cette adresse)" },
    en: { lab: ["Adult", "Child (2-11 years)", "Infant (under 2)"], one: ["Adult", "Child", "Infant"], sum: function (a, c, i) { return a + " Adult" + (a > 1 ? "s" : "") + ", " + c + " Child" + (c > 1 ? "ren" : "") + ", " + i + " Infant" + (i > 1 ? "s" : ""); },
      svc: function (n, tot) { return "Service fee: 15 TND × " + n + " passenger" + (n > 1 ? "s" : "") + " = " + tot + " TND"; }, babyMax: "One infant per adult at most.", born: "Date of birth", email: "Email (your booking will be sent here)" },
    ar: { lab: ["بالغ", "طفل (2-11 سنة)", "رضيع (أقل من سنتين)"], one: ["بالغ", "طفل", "رضيع"], sum: function (a, c, i) { return a + " بالغ، " + c + " طفل، " + i + " رضيع"; },
      svc: function (n, tot) { return "رسوم الخدمة: 15 دينار × " + n + " مسافر = " + tot + " دينار"; }, babyMax: "رضيع واحد لكل بالغ كحد أقصى.", born: "تاريخ الميلاد", email: "البريد الإلكتروني (سيُرسل الحجز إليه)" }
  }[L];
  var cnt = { a: 1, c: 0, i: 0 }, lastCnt = { a: 1, c: 0, i: 0 };
  var SVC = 15;
  function nPax(c) { return c.a + c.c + c.i; }
  function paintPax() {
    $("vl-pax").textContent = XP.sum(cnt.a, cnt.c, cnt.i);
    $("vl-paxp").innerHTML = [["a", 0, 1], ["c", 1, 0], ["i", 2, 0]].map(function (r) {
      return '<div class="vl-pr"><span>' + esc(XP.lab[r[1]]) + '</span><span class="vl-ps"><button type="button" data-pax="' + r[0] + '-1" aria-label="-">−</button><b>' + cnt[r[0]] + '</b><button type="button" data-pax="' + r[0] + '+1" aria-label="+">+</button></span></div>';
    }).join("");
  }
  function movePax(code) {
    var k = code.charAt(0), d = code.charAt(1) === "+" ? 1 : -1, n = cnt[k] + d;
    if (k === "a") { if (n < 1 || n + cnt.c > 9) return; cnt.a = n; if (cnt.i > cnt.a) cnt.i = cnt.a; }
    else if (k === "c") { if (n < 0 || cnt.a + n > 9) return; cnt.c = n; }
    else { if (n < 0 || n > cnt.a) return; cnt.i = n; }
    paintPax();
  }
  function svcLine(c) { var n = nPax(c); return XP.svc(n, n * SVC); }
  function hm(iso) { return /T(\d\d:\d\d)/.test(iso || "") ? RegExp.$1 : "—"; }
  function dmy(iso) { try { return new Date(String(iso).slice(0, 10) + "T12:00:00").toLocaleDateString(locale, { dateStyle: "medium" }); } catch (e) { return ""; } }
  function dur(d) { var m = /^P(?:(\d+)D)?T?(?:(\d+)H)?(?:(\d+)M)?$/.exec(d || ""); if (!m) return ""; var h = (+m[1] || 0) * 24 + (+m[2] || 0); return (h ? h + "h" : "") + (m[3] ? String(+m[3]).padStart(h ? 2 : 1, "0") + (h ? "" : "min") : ""); }
  function offerCard(o) {
    var sl = (o.slices || []).map(function (s) {
      var g = s.segments || [], a = g[0] || {}, z = g[g.length - 1] || {}, d = dur(s.duration);
      return '<div class="vr-sl" dir="ltr"><div class="vr-tm"><span>' + esc(dmy(a.departing_at)) + "<b>" + esc(hm(a.departing_at)) + '</b></span><span class="vr-r">' + esc(dmy(z.arriving_at)) + "<b>" + esc(hm(z.arriving_at)) + "</b></span></div>" +
        '<div class="vr-cd"><b>' + esc(s.origin) + '</b><i class="vl-ic">' + IC.arrow + "</i><b>" + esc(s.destination) + "</b></div>" +
        '<p class="vr-m">' + (d ? esc(d) + " · " : "") + esc(g.length > 1 ? X.stops(g.length - 1) : X.direct) + "</p></div>";
    }).join("");
    return '<div class="vr-card"><div class="vr-air">' + (/^https:\/\//.test(o.owner_logo || "") ? '<img src="' + esc(o.owner_logo) + '" alt="" width="40" height="40" loading="lazy">' : "") + "<b>" + esc(o.owner) + "</b></div>" + sl +
      '<p class="vr-pr" dir="ltr">' + esc(nPax(lastCnt) * SVC) + " TND</p><p class=\"vr-m\">" + esc(svcLine(lastCnt)) + "</p>" +
      '<button type="button" class="pay wide vr-sel" data-offer="' + esc(o.id) + '">' + esc(X.sel) + '<i class="vl-ic">' + IC.arrow + "</i></button>" +
      '<details class="vr-det"><summary>' + esc(X.det) + "</summary><p class=\"fh-row\"><span>" + esc(t.expires) + " " + fmt(o.payment_required_by) + "</span></p>" + segs(o.slices) + "</details></div>";
  }

  function onSearch(e) {
    e.preventDefault(); showErr("");
    var d1 = $("vl-d1").value, d2 = trip === "rt" ? $("vl-d2").value : "";
    if (!/^[A-Z]{3}$/.test(pick.from) || !/^[A-Z]{3}$/.test(pick.to)) return showErr(t.pick);
    if (!d1 || (trip === "rt" && !d2)) return showErr(t.dates);
    var btn = $("vl-go"); btn.disabled = true; setGo(t.searching, false);
    post("/flight/search", { origin: pick.from, destination: pick.to, departure_date: d1, return_date: d2 || null, cabin_class: "economy", adults: cnt.a, children: cnt.c, infants: cnt.i })
      .then(function (r) {
        lastCnt = { a: cnt.a, c: cnt.c, i: cnt.i };
        offers = r.offers || [];
        var box = $("vl-results");
        if (!offers.length) { box.innerHTML = ""; return showErr(t.none); }
        box.innerHTML = "<h2>" + esc(t.found(r.hold_count)) + "</h2>" + offers.map(offerCard).join("");
        box.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function (er) { showErr(msg(er)); })
      .then(function () { btn.disabled = false; setGo(t.search, true); });
  }

  /* ---------- passager ---------- */
  function field(id, label, type, extra) { return '<label class="fh-f" for="vp-' + id + '">' + esc(label) + '<input class="sel" id="vp-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || "") + "></label>"; }
  function blocks() {
    var out = [], types = [["a", 0, "adult"], ["c", 1, "child"], ["i", 2, "infant"]];
    types.forEach(function (ty) { for (var k = 1; k <= lastCnt[ty[0]]; k++) out.push({ type: ty[2], label: XP.one[ty[1]] + (lastCnt[ty[0]] > 1 ? " " + k : "") }); });
    return out;
  }
  function showPassenger(id) {
    var o = offers.filter(function (x) { return x.id === id; })[0]; if (!o) return;
    var bl = blocks().map(function (p, n) {
      return '<fieldset class="vp-blk"><legend>' + esc(p.label) + '</legend><div class="fh-grid">' +
        '<label class="fh-f" for="vp-g' + n + '">' + esc(t.gender) + '<select class="sel" id="vp-g' + n + '" name="g' + n + '" required><option value="">—</option><option value="m">' + esc(t.m) + '</option><option value="f">' + esc(t.f) + "</option></select></label>" +
        field("n" + n + "-given", t.given, "text", 'autocomplete="off" style="text-transform:uppercase" required') + field("n" + n + "-family", t.family, "text", 'autocomplete="off" style="text-transform:uppercase" required') +
        field("n" + n + "-born", XP.born, "date", "required") + "</div></fieldset>";
    }).join("");
    $("vl-results").innerHTML = '<button type="button" class="chip vl-back" data-back="1">' + esc(t.back) + '</button><div class="fh-offer"><div class="fh-row"><b>' + esc(o.owner) + '</b><span dir="ltr">' + esc(nPax(lastCnt) * SVC) + " TND</span></div><p class=\"vr-m\">" + esc(svcLine(lastCnt)) + "</p>" + segs(o.slices) + "</div>" +
      '<form id="vp-form" novalidate data-offer="' + esc(id) + '"><h2>' + esc(t.pax2) + "</h2>" + bl + '<div class="fh-grid">' +
      field("email", XP.email, "email", 'autocomplete="email" dir="ltr" required') + field("phone_number", t.phone, "tel", 'autocomplete="tel" dir="ltr" placeholder="+216" required') + field("appointment_date", t.rdv, "date") +
      '</div><p class="fe fh-err" id="vp-err" role="alert" hidden></p><button type="submit" class="pay wide" id="vp-go">' + esc(t.confirm) + "</button></form>";
    $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function onBook(e) {
    e.preventDefault();
    var f = Object.fromEntries(new FormData(e.target)), err = $("vp-err"), btn = $("vp-go");
    err.hidden = true;
    var email = String(f.email || "").trim(), phone = String(f.phone_number || "").trim();
    var list = blocks().map(function (p, n) { return { type: p.type, gender: f["g" + n], given_name: f["n" + n + "-given"], family_name: f["n" + n + "-family"], born_on: f["n" + n + "-born"], email: email, phone_number: phone }; });
    for (var i = 0; i < list.length; i++) {
      var q = list[i];
      if (!q.gender || !String(q.given_name || "").trim() || !String(q.family_name || "").trim() || !q.born_on || !email || !phone) { err.textContent = t.fill; err.hidden = false; return; }
    }
    appt = f.appointment_date || "";
    btn.disabled = true; btn.textContent = t.booking;
    post("/flight/book", { offer_id: e.target.getAttribute("data-offer"), passengers: list })
      .then(function (o) { showReceipt(o); })
      .catch(function (er) { btn.disabled = false; btn.textContent = t.confirm; err.textContent = msg(er); err.hidden = false; });
  }

  /* ---------- récapitulatif ---------- */
  function left(ms) {
    var m = Math.max(0, Math.floor(ms / 60000)), d = Math.floor(m / 1440), h = Math.floor((m % 1440) / 60), u = t.d;
    return (d ? d + " " + u[0] + " " : "") + (d || h ? h + " " + u[1] + " " : "") + (m % 60) + " " + u[2];
  }
  function paint() {
    var box = $("fh-exp"); if (!box || !cur) return;
    var exp = cur.payment_required_by ? new Date(cur.payment_required_by).getTime() : null;
    var st = cur.status === "issued" ? "issued" : (exp && Date.now() >= exp) ? "expired" : "hold";
    box.setAttribute("data-state", st);
    $("fh-state").textContent = st === "issued" ? t.stIssued : st === "expired" ? t.stExpired : t.stHold;
    var lf = $("fh-left"); lf.textContent = st === "hold" && exp ? t.leftT + " : " + left(exp - Date.now()) : ""; lf.hidden = !(st === "hold" && exp);
    $("fh-note").textContent = st === "expired" ? t.expiredNote : (!exp && st === "hold" ? t.noDeadline : "");
    if (st === "expired") clearInterval(tick);
  }
  function showReceipt(o) {
    var late = appt && o.payment_required_by && new Date(o.payment_required_by) < new Date(appt + "T23:59:59");
    cur = { pnr: o.pnr, status: o.status || "hold", payment_required_by: o.payment_required_by };
    $("vl-results").innerHTML = '<section class="fh-receipt" id="fh-receipt"><p class="fh-badge">' + esc(t.badge) + '</p><p class="fh-k">' + esc(t.pnr) + '</p><p class="fh-pnr" dir="ltr">' + esc(o.pnr) + "</p>" +
      '<div class="fh-exp" id="fh-exp" data-state="hold" aria-live="polite"><p class="fh-k">' + esc(t.untilT) + '</p><p class="fh-until">' + fmt(o.payment_required_by) + '</p><p class="fh-left" id="fh-left"></p><p class="fh-state" id="fh-state"></p><p class="fh-note" id="fh-note"></p></div>' +
      '<dl class="fh-dl"><dt>' + esc(t.passenger) + '</dt><dd dir="ltr">' + (o.passengers || [o.passenger]).map(function (x) { return esc(x.family_name) + " / " + esc(x.given_name); }).join("<br>") + "</dd><dt>" + esc(t.price) + '</dt><dd dir="ltr">' + esc(o.total_amount) + " " + esc(o.total_currency) + "</dd></dl>" + segs(o.slices) +
      (late ? '<p class="fh-warn fh-noprint">' + esc(t.warn(appt)) + "</p>" : "") + '<p class="fh-doc">' + esc(t.doc) + "</p></section>" +
      '<button type="button" class="pay wide fh-noprint" data-print="1">' + esc(t.print) + '</button> <button type="button" class="chip fh-noprint" data-refresh="1">' + esc(t.refresh) + '</button> <button type="button" class="chip fh-noprint" data-again="1">' + esc(t.again) + "</button>";
    paint(); clearInterval(tick); tick = setInterval(paint, 30000);
    $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var el;
    if ((el = e.target.closest("[data-pax]"))) { movePax(el.getAttribute("data-pax")); return; }
    if ((el = e.target.closest("#vl-pax"))) { var pp = $("vl-paxp"); pp.hidden = !pp.hidden; el.setAttribute("aria-expanded", String(!pp.hidden)); return; }
    if (!e.target.closest("#vl-paxp") && !$("vl-paxp").hidden) { $("vl-paxp").hidden = true; $("vl-pax").setAttribute("aria-expanded", "false"); }
    if ((el = e.target.closest("[data-dest]"))) {
      var c = el.getAttribute("data-dest"); pick.to = c; notes.to = ""; showNotes(); $("vl-to").value = t.dest[c] + " (" + c + ")";
      $("vl-form").scrollIntoView({ behavior: "smooth", block: "center" }); return;
    }
    if ((el = e.target.closest("[data-trip]"))) { trip = el.getAttribute("data-trip"); paintTabs(); return; }
    if ((el = e.target.closest(".vr-sel[data-offer]"))) { showPassenger(el.getAttribute("data-offer")); return; }
    if (e.target.closest("[data-back]")) { $("vl-form").scrollIntoView({ behavior: "smooth" }); $("vl-results").innerHTML = ""; return; }
    if ((el = e.target.closest("[data-refresh]"))) {
      if (!cur) return; el.disabled = true;
      post("/flight/status", { pnr: cur.pnr }).then(function (r) { cur.status = r.status; cur.payment_required_by = r.payment_required_by || cur.payment_required_by; }).catch(function () { /* repli : horloge */ }).then(function () { el.disabled = false; paint(); });
      return;
    }
    if (e.target.closest("[data-print]")) { window.print(); return; }
    if (e.target.closest("[data-again]")) { clearInterval(tick); cur = null; $("vl-results").innerHTML = ""; $("vl-form").scrollIntoView({ behavior: "smooth" }); }
  });
  document.addEventListener("submit", function (e) { if (e.target.id === "vl-form") onSearch(e); else if (e.target.id === "vp-form") onBook(e); });

  var jt = { fr: ["Bonjour !", "Je suis Aïcha, je vérifie votre dossier."], en: ["Hello!", "I am Aicha, I check your file."], ar: ["مرحبًا!", "أنا عائشة، أتحقق من ملفك."] }[L];
  $("vl-joury-t").innerHTML = "<b>" + esc(jt[0]) + "</b> " + esc(jt[1]);
  /* Nouvelle version : compare la version de cette page à version.json (jamais mis en cache) ; le bouton vide le cache puis recharge. */
  function checkVersion() {
    var mine = document.body.getAttribute("data-version");
    fetch("./version.json?t=" + Date.now(), { cache: "no-store" }).then(function (r) { return r.json(); }).then(function (j) {
      if (!j || !j.version || j.version === mine) return;
      $("vl-upd-t").textContent = t.upd[0]; $("vl-upd-b").textContent = t.upd[1]; $("vl-upd").hidden = false;
    }).catch(function () { /* hors ligne : rien */ });
  }
  $("vl-upd-b").addEventListener("click", function () {
    var done = function () { location.reload(); };
    try {
      Promise.all([
        window.caches ? caches.keys().then(function (k) { return Promise.all(k.map(function (n) { return caches.delete(n); })); }) : 0,
        navigator.serviceWorker ? navigator.serviceWorker.getRegistrations().then(function (rs) { return Promise.all(rs.map(function (r) { return r.update(); })); }) : 0
      ]).then(done, done);
    } catch (e) { done(); }
  });
  checkVersion();
  document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") checkVersion(); });
  setInterval(checkVersion, 5 * 60e3);

  paintStatic();
  function plus(n) { var d = new Date(); d.setDate(d.getDate() + n); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); }
  $("vl-d1").value = plus(30); $("vl-d2").value = plus(37);
  var phTxt = { fr: "jj/mm/aaaa", en: "dd/mm/yyyy", ar: "يوم/شهر/سنة" }[L];
  ["vl-d1", "vl-d2"].forEach(function (id) {
    var inp = $(id), ph = document.createElement("span");
    ph.className = "vl-ph"; ph.textContent = phTxt; ph.setAttribute("aria-hidden", "true");
    inp.parentNode.appendChild(ph);
    var sync = function () { if (inp.value) inp.removeAttribute("data-empty"); else inp.setAttribute("data-empty", "1"); ph.hidden = !!inp.value; };
    inp.addEventListener("input", sync); inp.addEventListener("change", sync); sync();
    /* Certains Chrome Android n'ouvrent pas le calendrier au toucher : on l'ouvre explicitement (sans effet s'il est déjà ouvert). */
    inp.addEventListener("click", function () { try { if (typeof inp.showPicker === "function") inp.showPicker(); } catch (e) { /* déjà ouvert ou refusé */ } });
  });
  var lg = $("vl-lang"); lg.value = L;
  lg.addEventListener("change", function () { try { localStorage.setItem("vc_lang", lg.value); } catch (e) { /* ignore */ } location.reload(); });
  $("vl-from").value = "Tunis (TUN)";
  setupAc("from"); setupAc("to");
})();
