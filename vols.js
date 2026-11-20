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
      trust: ["Sans payer le billet", "Code PNR vérifiable auprès de la compagnie", "Annulation automatique à l'échéance"],
      one: "Aller simple", rt: "Aller-retour", from: "Départ", to: "Destination", d1: "Date de départ", d2: "Date de retour", pax: "Voyageurs", adult: "1 Adulte", cabin: "Classe",
      cabins: { economy: "Économique", premium_economy: "Premium éco", business: "Affaires", first: "Première" }, search: "Rechercher", searching: "Recherche en cours…",
      popT: "Destinations populaires", ph: "Ville ou code (ex. TUN)", pick: "Choisissez un aéroport dans la liste.", dates: "Indiquez la date de départ (et de retour pour un aller-retour).",
      found: function (n) { return n + " vol(s) réservable(s) sans paiement"; }, none: "Aucun vol réservable sans paiement sur ces dates. Essayez d'autres dates ou un aéroport proche.",
      net: "Connexion impossible. Réessayez dans un instant.", expires: "Valable jusqu'au", price: "Prix si vous confirmez", book: "Réserver ce vol (attente)", booking: "Réservation en cours…",
      back: "← Modifier la recherche", pax2: "Passager (comme sur le passeport)", given: "Prénom(s)", family: "Nom", gender: "Genre", m: "Masculin", f: "Féminin", born: "Date de naissance", mail: "E-mail", phone: "Téléphone (avec indicatif, ex. +216…)",
      rdv: "Date du rendez-vous consulaire (facultatif)", confirm: "Obtenir mon code PNR", fill: "Merci de remplir tous les champs obligatoires.",
      untilT: "Valable jusqu'au", leftT: "Temps restant", stHold: "En attente — billet non émis", stExpired: "Expirée — annulée automatiquement par la compagnie", stIssued: "Payée — billet émis par la compagnie", refresh: "Actualiser le statut",
      expiredNote: "La date limite est dépassée : la compagnie annule automatiquement une réservation non émise. Elle n'est plus valable pour un dossier de visa.", noDeadline: "La compagnie n'a pas communiqué de date limite. Vérifiez-la auprès d'elle avec le code PNR.",
      badge: "Réservation temporaire — billet non émis", pnr: "Référence de réservation (PNR)", passenger: "Passager", print: "Télécharger en PDF / Imprimer", again: "Nouvelle recherche",
      warn: function (d) { return "Attention : cette réservation expire avant votre rendez-vous consulaire (" + d + "). Refaites-la plus près de la date."; },
      legal: "Il s'agit d'une réservation temporaire (mode attente), non émise et à validité limitée, destinée aux démarches de visa. Elle s'annule automatiquement à la date limite fixée par la compagnie si elle n'est pas payée. Ce n'est pas un billet.",
      doc: "Réservation en attente de paiement, annulée automatiquement à l'échéance. Ce document n'est pas un billet.",
      pop: [["Paris", "PAR"], ["Dubaï", "DXB"], ["New York", "NYC"], ["Istanbul", "IST"], ["Londres", "LON"]], d: ["j", "h", "min"]
    },
    en: {
      h1: ["Book your flight", "with confidence"], sub: "Search. Hold. Get a verifiable PNR code.",
      trust: ["No need to pay for the ticket", "PNR code you can check with the airline", "Automatic cancellation at the deadline"],
      one: "One way", rt: "Round trip", from: "From", to: "To", d1: "Departure date", d2: "Return date", pax: "Travellers", adult: "1 Adult", cabin: "Class",
      cabins: { economy: "Economy", premium_economy: "Premium economy", business: "Business", first: "First" }, search: "Search", searching: "Searching…",
      popT: "Popular destinations", ph: "City or code (e.g. TUN)", pick: "Pick an airport from the list.", dates: "Enter the departure date (and the return date for a round trip).",
      found: function (n) { return n + " flight(s) bookable without payment"; }, none: "No flight can be held without payment on these dates. Try other dates or a nearby airport.",
      net: "Connection failed. Please try again in a moment.", expires: "Valid until", price: "Price if you confirm", book: "Hold this flight", booking: "Booking…",
      back: "← Change search", pax2: "Passenger (as on the passport)", given: "Given name(s)", family: "Family name", gender: "Gender", m: "Male", f: "Female", born: "Date of birth", mail: "Email", phone: "Phone (with country code, e.g. +216…)",
      rdv: "Consular appointment date (optional)", confirm: "Get my PNR code", fill: "Please fill in all required fields.",
      untilT: "Valid until", leftT: "Time left", stHold: "On hold — ticket not issued", stExpired: "Expired — automatically cancelled by the airline", stIssued: "Paid — ticket issued by the airline", refresh: "Refresh status",
      expiredNote: "The deadline has passed: the airline automatically cancels a reservation that has not been ticketed. It is no longer valid for a visa file.", noDeadline: "The airline has not given a deadline. Check it with them using the PNR code.",
      badge: "Temporary reservation — ticket not issued", pnr: "Booking reference (PNR)", passenger: "Passenger", print: "Download as PDF / Print", again: "New search",
      warn: function (d) { return "Warning: this reservation expires before your consular appointment (" + d + "). Book it again closer to the date."; },
      legal: "This is a temporary reservation (on hold), not ticketed and valid for a limited time, intended for visa applications. It is cancelled automatically at the airline's deadline if it is not paid. It is not a ticket.",
      doc: "Reservation awaiting payment, automatically cancelled at the deadline. This document is not a ticket.",
      pop: [["Paris", "PAR"], ["Dubai", "DXB"], ["New York", "NYC"], ["Istanbul", "IST"], ["London", "LON"]], d: ["d", "h", "min"]
    },
    ar: {
      h1: ["احجز رحلتك", "بثقة"], sub: "ابحث. احجز. واحصل على رمز PNR قابل للتحقق.",
      trust: ["دون دفع ثمن التذكرة", "رمز PNR يمكن التحقق منه لدى الشركة", "إلغاء تلقائي عند انتهاء المهلة"],
      one: "ذهاب فقط", rt: "ذهاب وإياب", from: "من", to: "إلى", d1: "تاريخ الذهاب", d2: "تاريخ العودة", pax: "المسافرون", adult: "بالغ واحد", cabin: "الدرجة",
      cabins: { economy: "اقتصادية", premium_economy: "اقتصادية مميزة", business: "رجال الأعمال", first: "الأولى" }, search: "بحث", searching: "جارٍ البحث…",
      popT: "وجهات شائعة", ph: "مدينة أو رمز (مثل TUN)", pick: "اختر مطارًا من القائمة.", dates: "أدخل تاريخ الذهاب (وتاريخ العودة للذهاب والإياب).",
      found: function (n) { return n + " رحلة قابلة للحجز دون دفع"; }, none: "لا توجد رحلة قابلة للحجز دون دفع في هذه التواريخ. جرّب تواريخ أخرى أو مطارًا قريبًا.",
      net: "تعذّر الاتصال. حاول مرة أخرى بعد قليل.", expires: "صالح حتى", price: "السعر عند التأكيد", book: "احجز هذه الرحلة (معلّق)", booking: "جارٍ الحجز…",
      back: "→ تعديل البحث", pax2: "المسافر (كما في جواز السفر)", given: "الاسم الشخصي", family: "اللقب", gender: "الجنس", m: "ذكر", f: "أنثى", born: "تاريخ الميلاد", mail: "البريد الإلكتروني", phone: "الهاتف (مع رمز الدولة، مثل +216…)",
      rdv: "تاريخ موعد القنصلية (اختياري)", confirm: "احصل على رمز PNR", fill: "يرجى ملء جميع الحقول الإلزامية.",
      untilT: "صالح حتى", leftT: "الوقت المتبقي", stHold: "معلّق — التذكرة غير مُصدرة", stExpired: "منتهي — ألغته شركة الطيران تلقائيًا", stIssued: "مدفوع — أصدرت الشركة التذكرة", refresh: "تحديث الحالة",
      expiredNote: "انتهت المهلة: تلغي شركة الطيران تلقائيًا الحجز غير المُصدر. لم يعد صالحًا لملف التأشيرة.", noDeadline: "لم تحدد شركة الطيران مهلة. تحقق منها لديها برمز PNR.",
      badge: "حجز مؤقت — التذكرة غير مُصدرة", pnr: "مرجع الحجز (PNR)", passenger: "المسافر", print: "تنزيل PDF / طباعة", again: "بحث جديد",
      warn: function (d) { return "تنبيه: ينتهي هذا الحجز قبل موعد القنصلية (" + d + "). أعد الحجز قرب الموعد."; },
      legal: "هذا حجز مؤقت (معلّق)، غير مُصدر وصالح لمدة محدودة، مخصص لإجراءات التأشيرة. يُلغى تلقائيًا في الموعد الذي تحدده الشركة إذا لم يُدفع. هذه ليست تذكرة.",
      doc: "حجز في انتظار الدفع، يُلغى تلقائيًا عند انتهاء المهلة. هذه الوثيقة ليست تذكرة.",
      pop: [["باريس", "PAR"], ["دبي", "DXB"], ["نيويورك", "NYC"], ["إسطنبول", "IST"], ["لندن", "LON"]], d: ["ي", "س", "د"]
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
  var pick = { from: "TUN", to: "" };

  function post(path, payload) {
    return fetch(URL_ + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || d.ok === false) throw new Error(d.error || ""); return d; }); });
  }
  var msg = function (e) { return e && e.message && e.message !== "Failed to fetch" ? e.message : t.net; };
  function showErr(m) { var e = $("vl-err"); e.textContent = m || ""; e.hidden = !m; }

  /* ---------- texte statique ---------- */
  function paintStatic() {
    $("vl-h1").innerHTML = esc(t.h1[0]) + " <em>" + esc(t.h1[1]) + "</em>";
    $("vl-sub").textContent = t.sub;
    $("vl-trust").innerHTML = t.trust.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("vl-l-from").textContent = t.from; $("vl-l-to").textContent = t.to; $("vl-l-d1").textContent = t.d1; $("vl-l-d2").textContent = t.d2;
    $("vl-l-pax").textContent = t.pax; $("vl-pax").textContent = t.adult; $("vl-l-cabin").textContent = t.cabin;
    $("vl-from").placeholder = t.ph; $("vl-to").placeholder = t.ph;
    $("vl-cabin").innerHTML = Object.keys(t.cabins).map(function (k) { return '<option value="' + k + '">' + esc(t.cabins[k]) + "</option>"; }).join("");
    $("vl-go").textContent = t.search; $("vl-legal").textContent = t.legal; $("vl-pop-t").textContent = t.popT;
    $("vl-pop").innerHTML = t.pop.map(function (p) { return '<button type="button" class="chip" data-dest="' + p[1] + '" data-name="' + esc(p[0]) + '">' + esc(p[0]) + "</button>"; }).join("");
    $("vl-d1").min = $("vl-d2").min = today();
    paintTabs();
  }
  function paintTabs() {
    $("vl-tabs").innerHTML = [["one", t.one], ["rt", t.rt]].map(function (x) { return '<button type="button" class="chip" data-trip="' + x[0] + '" aria-pressed="' + (trip === x[0]) + '">' + esc(x[1]) + "</button>"; }).join("");
    $("vl-d2w").hidden = trip === "one";
  }

  /* ---------- autocomplétion ---------- */
  function setupAc(key) {
    var inp = $("vl-" + key), list = $("vl-" + key + "-list"), timer = null, seq = 0, items = [], idx = -1;
    function close() { list.hidden = true; inp.setAttribute("aria-expanded", "false"); idx = -1; }
    function choose(p) { pick[key] = p.iata; inp.value = (p.city || p.name) + " (" + p.iata + ")"; close(); }
    function hl() { Array.prototype.forEach.call(list.children, function (li, i) { li.setAttribute("aria-selected", String(i === idx)); }); }
    inp.addEventListener("input", function () {
      pick[key] = "";
      var q = inp.value.trim(); clearTimeout(timer);
      if (q.length < 2) return close();
      if (/^[A-Za-z]{3}$/.test(q)) pick[key] = q.toUpperCase();
      timer = setTimeout(function () {
        var my = ++seq;
        post("/flight/places", { query: q }).then(function (r) {
          if (my !== seq) return;
          items = r.places || [];
          if (!items.length) return close();
          list.innerHTML = items.map(function (p, i) { return '<li role="option" data-i="' + i + '"><span>' + esc((p.city || p.name) + (p.city && p.name && p.name !== p.city ? " — " + p.name : "")) + "</span><b>" + esc(p.iata) + "</b></li>"; }).join("");
          list.hidden = false; inp.setAttribute("aria-expanded", "true"); idx = -1;
        }).catch(close);
      }, 250);
    });
    inp.addEventListener("keydown", function (e) {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { idx = Math.min(items.length - 1, idx + 1); hl(); e.preventDefault(); }
      else if (e.key === "ArrowUp") { idx = Math.max(0, idx - 1); hl(); e.preventDefault(); }
      else if (e.key === "Enter" && idx >= 0) { choose(items[idx]); e.preventDefault(); }
      else if (e.key === "Escape") close();
    });
    list.addEventListener("mousedown", function (e) { var li = e.target.closest("li"); if (li) { e.preventDefault(); choose(items[+li.getAttribute("data-i")]); } });
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

  function onSearch(e) {
    e.preventDefault(); showErr("");
    var d1 = $("vl-d1").value, d2 = trip === "rt" ? $("vl-d2").value : "";
    if (!/^[A-Z]{3}$/.test(pick.from) || !/^[A-Z]{3}$/.test(pick.to)) return showErr(t.pick);
    if (!d1 || (trip === "rt" && !d2)) return showErr(t.dates);
    var btn = $("vl-go"); btn.disabled = true; btn.textContent = t.searching;
    post("/flight/search", { origin: pick.from, destination: pick.to, departure_date: d1, return_date: d2 || null, cabin_class: $("vl-cabin").value })
      .then(function (r) {
        offers = r.offers || [];
        var box = $("vl-results");
        if (!offers.length) { box.innerHTML = ""; return showErr(t.none); }
        box.innerHTML = "<h2>" + esc(t.found(r.hold_count)) + "</h2>" + offers.map(function (o) {
          return '<div class="fh-offer"><div class="fh-row"><b>' + esc(o.owner) + "</b><span dir=\"ltr\">" + esc(o.total_amount) + " " + esc(o.total_currency) + "</span></div><div class=\"fh-row\"><span>" + esc(t.expires) + " " + fmt(o.payment_required_by) + "</span></div>" + segs(o.slices) +
            '<button type="button" class="pay wide" data-offer="' + esc(o.id) + '">' + esc(t.book) + "</button></div>";
        }).join("");
        box.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function (er) { showErr(msg(er)); })
      .then(function () { btn.disabled = false; btn.textContent = t.search; });
  }

  /* ---------- passager ---------- */
  function field(id, label, type, extra) { return '<label class="fh-f" for="vp-' + id + '">' + esc(label) + '<input class="sel" id="vp-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || "") + "></label>"; }
  function showPassenger(id) {
    var o = offers.filter(function (x) { return x.id === id; })[0]; if (!o) return;
    $("vl-results").innerHTML = '<button type="button" class="chip vl-back" data-back="1">' + esc(t.back) + '</button><div class="fh-offer"><div class="fh-row"><b>' + esc(o.owner) + '</b><span dir="ltr">' + esc(o.total_amount) + " " + esc(o.total_currency) + "</span></div>" + segs(o.slices) + "</div>" +
      '<form id="vp-form" novalidate data-offer="' + esc(id) + '"><h2>' + esc(t.pax2) + '</h2><div class="fh-grid">' +
      field("given_name", t.given, "text", 'autocomplete="given-name" style="text-transform:uppercase" required') + field("family_name", t.family, "text", 'autocomplete="family-name" style="text-transform:uppercase" required') +
      '<label class="fh-f" for="vp-gender">' + esc(t.gender) + '<select class="sel" id="vp-gender" name="gender" required><option value="">—</option><option value="m">' + esc(t.m) + '</option><option value="f">' + esc(t.f) + "</option></select></label>" +
      field("born_on", t.born, "date", "required") + field("email", t.mail, "email", 'autocomplete="email" dir="ltr" required') + field("phone_number", t.phone, "tel", 'autocomplete="tel" dir="ltr" placeholder="+216" required') + field("appointment_date", t.rdv, "date") +
      '</div><p class="fe fh-err" id="vp-err" role="alert" hidden></p><button type="submit" class="pay wide" id="vp-go">' + esc(t.confirm) + "</button></form>";
    $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function onBook(e) {
    e.preventDefault();
    var f = Object.fromEntries(new FormData(e.target)), err = $("vp-err"), btn = $("vp-go");
    err.hidden = true;
    var need = ["given_name", "family_name", "gender", "born_on", "email", "phone_number"];
    for (var i = 0; i < need.length; i++) if (!String(f[need[i]] || "").trim()) { err.textContent = t.fill; err.hidden = false; return; }
    appt = f.appointment_date || "";
    pax = { given_name: f.given_name, family_name: f.family_name, gender: f.gender, born_on: f.born_on, email: f.email, phone_number: f.phone_number };
    btn.disabled = true; btn.textContent = t.booking;
    post("/flight/book", { offer_id: e.target.getAttribute("data-offer"), passenger: pax })
      .then(function (o) { pax = null; showReceipt(o); })
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
      '<dl class="fh-dl"><dt>' + esc(t.passenger) + '</dt><dd dir="ltr">' + esc(o.passenger.family_name) + " / " + esc(o.passenger.given_name) + "</dd><dt>" + esc(t.price) + '</dt><dd dir="ltr">' + esc(o.total_amount) + " " + esc(o.total_currency) + "</dd></dl>" + segs(o.slices) +
      (late ? '<p class="fh-warn fh-noprint">' + esc(t.warn(appt)) + "</p>" : "") + '<p class="fh-doc">' + esc(t.doc) + "</p></section>" +
      '<button type="button" class="pay wide fh-noprint" data-print="1">' + esc(t.print) + '</button> <button type="button" class="chip fh-noprint" data-refresh="1">' + esc(t.refresh) + '</button> <button type="button" class="chip fh-noprint" data-again="1">' + esc(t.again) + "</button>";
    paint(); clearInterval(tick); tick = setInterval(paint, 30000);
    $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var el;
    if ((el = e.target.closest("[data-trip]"))) { trip = el.getAttribute("data-trip"); paintTabs(); return; }
    if ((el = e.target.closest("[data-dest]"))) { pick.to = el.getAttribute("data-dest"); $("vl-to").value = el.getAttribute("data-name") + " (" + pick.to + ")"; $("vl-d1").focus(); return; }
    if ((el = e.target.closest("[data-offer]"))) { showPassenger(el.getAttribute("data-offer")); return; }
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

  paintStatic();
  $("vl-from").value = "Tunis (TUN)";
  setupAc("from"); setupAc("to");
})();
