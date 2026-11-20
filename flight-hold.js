/* CheckMyVisa — Réservation de vol temporaire (PNR en attente).
   Affichée dans le parcours « Billet d'avion » (étape de choix du serveur) : une carte ouvre une fenêtre
   avec le formulaire, la liste des vols réservables sans paiement, puis le récapitulatif imprimable.
   FLIGHT_URL vide = module désactivé (la carte n'apparaît pas, le site reste inchangé).
   Aucune donnée personnelle n'est gardée dans le navigateur. */
(function () {
  "use strict";
  var FLIGHT_URL = ""; /* ex. "https://visa-flight.rabehfly.workers.dev" une fois le Worker déployé */

  var T = {
    fr: {
      cardT: "Réservation vérifiable (code PNR)", cardS: "Réservation réelle en attente de paiement, avec un code PNR que vous pouvez vérifier auprès de la compagnie. Billet non émis.", cardB: "Obtenir mon code PNR",
      title: "Réservation de vol temporaire", close: "Fermer", pax: "Passager (comme sur le passeport)", given: "Prénom(s)", family: "Nom", gender: "Genre", m: "Masculin", f: "Féminin", born: "Date de naissance", mail: "E-mail", phone: "Téléphone (avec indicatif, ex. +21620123456)",
      trip: "Voyage", from: "Aéroport de départ (code, ex. TUN)", to: "Aéroport d'arrivée (code, ex. CDG)", d1: "Date d'aller", d2: "Date de retour (facultatif)", rdv: "Date du rendez-vous consulaire (facultatif)",
      search: "Chercher des vols", searching: "Recherche en cours…", booking: "Réservation en cours…", found: function (n) { return n + " vol(s) réservable(s) sans paiement"; }, expires: "Valable jusqu'au", book: "Réserver ce vol (attente)",
      none: "Aucun vol réservable sans paiement sur ces dates. Essayez d'autres dates ou un aéroport proche.", fill: "Merci de remplir tous les champs obligatoires.", net: "Connexion impossible. Réessayez dans un instant.",
      badge: "Réservation temporaire — billet non émis", pnr: "Référence de réservation (PNR)", passenger: "Passager", price: "Prix si vous confirmez", print: "Télécharger en PDF / Imprimer", again: "Nouvelle recherche",
      warn: function (d) { return "Attention : cette réservation expire avant votre rendez-vous consulaire (" + d + "). Refaites-la plus près de la date."; },
      legal: "Il s'agit d'une réservation temporaire (mode attente), non émise et à validité limitée, destinée aux démarches de visa. Elle s'annule automatiquement à la date limite fixée par la compagnie si elle n'est pas payée. Nous vous conseillons de la commander à l'approche de votre rendez-vous consulaire. Ce document n'est pas un billet d'avion.",
      doc: "Réservation en attente de paiement, annulée automatiquement à l'échéance. Ce document n'est pas un billet."
    },
    en: {
      cardT: "Verifiable booking (PNR code)", cardS: "A real booking held until payment, with a PNR code you can check with the airline. Ticket not issued.", cardB: "Get my PNR code",
      title: "Temporary flight reservation", close: "Close", pax: "Passenger (as on the passport)", given: "Given name(s)", family: "Family name", gender: "Gender", m: "Male", f: "Female", born: "Date of birth", mail: "Email", phone: "Phone (with country code, e.g. +21620123456)",
      trip: "Trip", from: "Departure airport (code, e.g. TUN)", to: "Arrival airport (code, e.g. CDG)", d1: "Departure date", d2: "Return date (optional)", rdv: "Consular appointment date (optional)",
      search: "Search flights", searching: "Searching…", booking: "Booking…", found: function (n) { return n + " flight(s) bookable without payment"; }, expires: "Valid until", book: "Hold this flight",
      none: "No flight can be held without payment on these dates. Try other dates or a nearby airport.", fill: "Please fill in all required fields.", net: "Connection failed. Please try again in a moment.",
      badge: "Temporary reservation — ticket not issued", pnr: "Booking reference (PNR)", passenger: "Passenger", price: "Price if you confirm", print: "Download as PDF / Print", again: "New search",
      warn: function (d) { return "Warning: this reservation expires before your consular appointment (" + d + "). Book it again closer to the date."; },
      legal: "This is a temporary reservation (on hold), not ticketed and valid for a limited time, intended for visa applications. It is cancelled automatically at the airline's deadline if it is not paid. We advise ordering it close to your consular appointment. This document is not a flight ticket.",
      doc: "Reservation awaiting payment, automatically cancelled at the deadline. This document is not a ticket."
    },
    ar: {
      cardT: "حجز قابل للتحقق (رمز PNR)", cardS: "حجز حقيقي معلّق إلى حين الدفع، مع رمز PNR يمكنك التحقق منه لدى شركة الطيران. التذكرة غير مُصدرة.", cardB: "احصل على رمز PNR",
      title: "حجز طيران مؤقت", close: "إغلاق", pax: "المسافر (كما في جواز السفر)", given: "الاسم الشخصي", family: "اللقب", gender: "الجنس", m: "ذكر", f: "أنثى", born: "تاريخ الميلاد", mail: "البريد الإلكتروني", phone: "الهاتف (مع رمز الدولة، مثل +21620123456)",
      trip: "الرحلة", from: "مطار المغادرة (الرمز، مثل TUN)", to: "مطار الوصول (الرمز، مثل CDG)", d1: "تاريخ الذهاب", d2: "تاريخ العودة (اختياري)", rdv: "تاريخ موعد القنصلية (اختياري)",
      search: "ابحث عن رحلات", searching: "جارٍ البحث…", booking: "جارٍ الحجز…", found: function (n) { return n + " رحلة قابلة للحجز دون دفع"; }, expires: "صالح حتى", book: "احجز هذه الرحلة (معلّق)",
      none: "لا توجد رحلة قابلة للحجز دون دفع في هذه التواريخ. جرّب تواريخ أخرى أو مطارًا قريبًا.", fill: "يرجى ملء جميع الحقول الإلزامية.", net: "تعذّر الاتصال. أعد المحاولة بعد قليل.",
      badge: "حجز مؤقت — التذكرة غير مُصدرة", pnr: "مرجع الحجز (PNR)", passenger: "المسافر", price: "السعر عند التأكيد", print: "تنزيل PDF / طباعة", again: "بحث جديد",
      warn: function (d) { return "تنبيه: ينتهي هذا الحجز قبل موعد القنصلية (" + d + "). أعد الحجز قرب الموعد."; },
      legal: "هذا حجز مؤقت (معلّق)، غير مُصدر وصالح لمدة محدودة، مخصص لإجراءات التأشيرة. يُلغى تلقائيًا في الموعد الذي تحدده الشركة إذا لم يُدفع. ننصحك بطلبه قرب موعد القنصلية. هذه الوثيقة ليست تذكرة طيران.",
      doc: "حجز في انتظار الدفع، يُلغى تلقائيًا عند انتهاء المهلة. هذه الوثيقة ليست تذكرة."
    }
  };

  var dlg = null, pax = null, appt = "";

  function lang() { var l = document.documentElement.lang; return T[l] ? l : "fr"; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function fmt(iso) { if (!iso) return "—"; try { return new Date(iso).toLocaleString(lang() === "ar" ? "ar-TN" : lang() === "en" ? "en-GB" : "fr-FR", { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return iso; } }
  function enabled() { return /^https:\/\//.test(FLIGHT_URL); }

  function card(L) {
    var t = T[L] || T.fr;
    return '<div class="ag-card fh-card"><div class="ag-body"><b>' + t.cardT + '</b><span class="ag-meta">' + t.cardS + '</span></div><button type="button" class="pay wide" data-fh-open="1">' + t.cardB + '</button></div>';
  }

  function post(path, payload) {
    return fetch(FLIGHT_URL + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || d.ok === false) throw new Error(d.error || ""); return d; }); });
  }

  function segs(slices) {
    return (slices || []).map(function (s) {
      return '<div class="fh-sl"><b dir="ltr">' + esc(s.origin) + " → " + esc(s.destination) + "</b>" + (s.segments || []).map(function (g) {
        return '<div class="fh-sg" dir="ltr">' + esc(g.flight_number) + " · " + esc(g.carrier) + " · " + esc(g.from) + " " + fmt(g.departing_at) + " → " + esc(g.to) + " " + fmt(g.arriving_at) + "</div>";
      }).join("") + "</div>";
    }).join("");
  }

  function field(id, label, type, extra) {
    return '<label class="fh-f" for="fh-' + id + '">' + label + '<input class="sel" id="fh-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || "") + "></label>";
  }

  function formHtml(t) {
    return '<form id="fh-form" novalidate><h3>' + t.pax + '</h3><div class="fh-grid">' +
      field("given_name", t.given, "text", 'autocomplete="given-name" style="text-transform:uppercase" required') +
      field("family_name", t.family, "text", 'autocomplete="family-name" style="text-transform:uppercase" required') +
      '<label class="fh-f" for="fh-gender">' + t.gender + '<select class="sel" id="fh-gender" name="gender" required><option value="">—</option><option value="m">' + t.m + '</option><option value="f">' + t.f + "</option></select></label>" +
      field("born_on", t.born, "date", "required") +
      field("email", t.mail, "email", 'autocomplete="email" dir="ltr" required') +
      field("phone_number", t.phone, "tel", 'autocomplete="tel" dir="ltr" placeholder="+216" required') +
      '</div><h3>' + t.trip + '</h3><div class="fh-grid">' +
      field("origin", t.from, "text", 'maxlength="3" dir="ltr" style="text-transform:uppercase" required') +
      field("destination", t.to, "text", 'maxlength="3" dir="ltr" style="text-transform:uppercase" required') +
      field("departure_date", t.d1, "date", "required") + field("return_date", t.d2, "date") + field("appointment_date", t.rdv, "date") +
      '</div><p class="fe fh-err" id="fh-err" role="alert" hidden></p><button type="submit" class="pay wide" id="fh-go">' + t.search + '</button></form>' +
      '<div id="fh-offers"></div><p class="fh-legal">' + t.legal + "</p>";
  }

  function build() {
    if (dlg) dlg.remove();
    var t = T[lang()];
    dlg = document.createElement("dialog");
    dlg.className = "fh-dlg";
    dlg.setAttribute("aria-labelledby", "fh-title");
    dlg.innerHTML = '<div class="fh-head"><h2 id="fh-title">' + t.title + '</h2><button type="button" class="fh-x" data-fh-close="1" aria-label="' + t.close + '">×</button></div><div class="fh-body" id="fh-body">' + formHtml(t) + "</div>";
    document.body.appendChild(dlg);
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
    document.documentElement.classList.add("modal-open");
    dlg.addEventListener("close", function () { document.documentElement.classList.remove("modal-open"); pax = null; });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
  }

  function showErr(m) { var e = dlg.querySelector("#fh-err"); e.textContent = m || ""; e.hidden = !m; }

  function onSearch(e) {
    e.preventDefault();
    var t = T[lang()], f = Object.fromEntries(new FormData(e.target)), btn = dlg.querySelector("#fh-go");
    showErr("");
    var need = ["given_name", "family_name", "gender", "born_on", "email", "phone_number", "origin", "destination", "departure_date"];
    for (var i = 0; i < need.length; i++) if (!String(f[need[i]] || "").trim()) return showErr(t.fill);
    pax = { given_name: f.given_name, family_name: f.family_name, gender: f.gender, born_on: f.born_on, email: f.email, phone_number: f.phone_number };
    appt = f.appointment_date || "";
    btn.disabled = true; btn.textContent = t.searching;
    post("/flight/search", { origin: f.origin, destination: f.destination, departure_date: f.departure_date, return_date: f.return_date || null })
      .then(function (r) {
        var box = dlg.querySelector("#fh-offers");
        if (!r.offers.length) { box.innerHTML = ""; return showErr(t.none); }
        box.innerHTML = '<h3>' + t.found(r.hold_count) + "</h3>" + r.offers.map(function (o) {
          return '<div class="fh-offer"><div class="fh-row"><b>' + esc(o.owner) + '</b><span>' + t.expires + " " + fmt(o.payment_required_by) + "</span></div>" + segs(o.slices) +
            '<button type="button" class="pay wide" data-fh-book="' + esc(o.id) + '">' + t.book + "</button></div>";
        }).join("");
        box.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function (err) { showErr(err && err.message && err.message !== "Failed to fetch" ? err.message : t.net); })
      .then(function () { btn.disabled = false; btn.textContent = t.search; });
  }

  function onBook(btn) {
    var t = T[lang()]; showErr(""); btn.disabled = true; btn.textContent = t.booking;
    post("/flight/book", { offer_id: btn.getAttribute("data-fh-book"), passenger: pax })
      .then(showReceipt)
      .catch(function (err) { btn.disabled = false; btn.textContent = t.book; showErr(err && err.message && err.message !== "Failed to fetch" ? err.message : t.net); });
  }

  function showReceipt(o) {
    var t = T[lang()], late = appt && o.payment_required_by && new Date(o.payment_required_by) < new Date(appt + "T23:59:59");
    dlg.querySelector("#fh-body").innerHTML = '<section class="fh-receipt" id="fh-receipt"><p class="fh-badge">' + t.badge + '</p><p class="fh-k">' + t.pnr + '</p><p class="fh-pnr" dir="ltr">' + esc(o.pnr) + "</p>" +
      '<dl class="fh-dl"><dt>' + t.passenger + "</dt><dd dir=\"ltr\">" + esc(o.passenger.family_name) + " / " + esc(o.passenger.given_name) + "</dd><dt>" + t.expires + "</dt><dd><b>" + fmt(o.payment_required_by) + "</b></dd><dt>" + t.price + '</dt><dd dir="ltr">' + esc(o.total_amount) + " " + esc(o.total_currency) + "</dd></dl>" + segs(o.slices) +
      (late ? '<p class="fh-warn fh-noprint">' + t.warn(esc(appt)) + "</p>" : "") + '<p class="fh-doc">' + t.doc + '</p></section>' +
      '<button type="button" class="pay wide fh-noprint" data-fh-print="1">' + t.print + '</button><button type="button" class="chip fh-noprint" data-fh-again="1">' + t.again + "</button>";
  }

  document.addEventListener("click", function (e) {
    var el;
    if ((el = e.target.closest("[data-fh-open]"))) { build(); return; }
    if (!dlg) return;
    if (e.target.closest("[data-fh-close]")) { dlg.close(); return; }
    if ((el = e.target.closest("[data-fh-book]"))) { onBook(el); return; }
    if (e.target.closest("[data-fh-print]")) { document.documentElement.classList.add("fh-printing"); window.print(); setTimeout(function () { document.documentElement.classList.remove("fh-printing"); }, 500); return; }
    if (e.target.closest("[data-fh-again]")) { build(); }
  });
  document.addEventListener("submit", function (e) { if (e.target && e.target.id === "fh-form") onSearch(e); });

  window.VCFlightHold = { enabled: enabled, card: card };
})();
