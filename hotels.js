/* CheckMyVisa — page « Réserver un hôtel » (hotels.html).
   Recherche via le Worker visa-flight (/hotel/places, /hotel/search, /hotel/rates), puis réservation (/hotel/book) et confirmation imprimable.
   Seules les chambres annulables sans frais sont proposées. Aucune donnée personnelle n'est conservée dans le navigateur. */
(function () {
  "use strict";
  var FH = window.VCFlightHold;
  if (!FH || !FH.enabled()) { location.replace("./?accueil=1"); return; }
  var URL_ = FH.url;

  var T = {
    fr: {
      h1: ["Réservez votre hôtel", "pour un visa sans souci"], sub: "Obtenez une réservation d'hôtel annulable gratuitement pour votre dossier de visa.",
      trust: ["Confirmation immédiate", "Confirmation en PDF", "Annulation gratuite"], tab: "Hôtels Visa-Friendly", nav: ["Guide Visa", "À propos", "Contact"],
      upd: ["Nouvelle version disponible", "Mettre à jour"], to: "Destination", ph: "Ville", d1: "Arrivée", d2: "Départ", pax: "Voyageurs", search: "Rechercher", searching: "Recherche en cours…",
      pick: "Choisissez une ville dans la liste.", dates: "Indiquez une date d'arrivée et une date de départ postérieure.", net: "Connexion impossible. Réessayez dans un instant.",
      adult: "Adulte", adults: "Adultes", child: "Enfant", children: "Enfants", lAdult: "Adultes", lChild: "Enfants (0-17 ans)", age: "Âge de l'enfant", yrs: "an(s)",
      found: function (n) { return n + " hôtel(s) trouvé(s)"; }, none: "Aucun hôtel disponible sur ces dates. Essayez d'autres dates ou une autre ville.", nights: function (n) { return "pour " + n + " nuit" + (n > 1 ? "s" : ""); },
      kmC: function (k) { return k + " km du centre"; }, rev: function (s, n) { return s + "/10" + (n ? " · " + n + " avis" : ""); },
      ck: ["Confirmation immédiate", "Confirmation en PDF", "Seules les chambres annulables sans frais sont proposées"], select: "Sélectionner", loading: "Chargement…",
      back: "← Retour aux hôtels", rooms: "Chambres annulables sans frais", noRooms: "Aucune chambre annulable sans frais pour cet hôtel à ces dates. Choisissez un autre hôtel.",
      free: function (d) { return "Annulation gratuite jusqu'au " + d; }, due: "À payer à l'hôtel", reserve: "Réserver cette chambre", vf: "Visa-Friendly", checkin: "Arrivée dès", checkout: "Départ avant",
      boards: { room_only: "Chambre seule", breakfast: "Petit-déjeuner inclus", half_board: "Demi-pension", full_board: "Pension complète", all_inclusive: "Tout compris" },
      beds: { single: "lit simple", double: "lit double", queen: "lit queen size", king: "lit king size", twin: "lits jumeaux", sofa_bed: "canapé-lit", bunk: "lits superposés" },
      guests: "Voyageurs (comme sur le passeport)", given: "Prénom(s)", family: "Nom", born: "Date de naissance", mail: "E-mail (la confirmation sera envoyée à cette adresse)", phone: "Téléphone (avec indicatif, ex. +216…)",
      confirm: "Confirmer la réservation", booking: "Réservation en cours…", fill: "Merci de remplir tous les champs obligatoires.",
      soon: "La réservation d'hôtel ouvre bientôt. Votre recherche est bien enregistrée : revenez dans quelques jours.",
      badge: "Réservation d'hôtel confirmée", ref: "Référence de réservation", hotel: "Hôtel", stay: "Séjour", who: "Voyageurs", total: "Total", cancelUntil: "Annulation gratuite jusqu'au",
      print: "Télécharger en PDF / Imprimer", again: "Nouvelle recherche",
      doc: "Confirmation de réservation d'hôtel. Présentez la référence à l'hôtel. Annulez avant la date indiquée si vous n'en avez plus besoin.",
      whyT: "Pourquoi choisir CheckMyVisa\u00a0?", why: [["Réservation vérifiable", "avec une référence hôtel"], ["Confirmation immédiate", "en PDF à télécharger"], ["Assistante IA Joury", "elle répond à vos questions"], ["Voyagez sereinement", "annulation gratuite vérifiée"]],
      joT: "Joury, votre assistante voyage", joP: "Besoin d'une réservation d'hôtel pour votre demande de visa ? Je vous aide à choisir.", joL: ["Conditions claires", "Confirmation prête à télécharger", "Annulation gratuite vérifiée"], joB: "Parler à Joury",
      jb: ["Bonjour !", "Je suis Joury, je vous aide pour votre voyage."], footT: "Hôtels réservés auprès de partenaires de réservation. Annulation gratuite jusqu'à la date indiquée sur chaque chambre.",
      legal: "Il s'agit d'une réservation réelle auprès de l'hôtel, annulable sans frais jusqu'à la date indiquée. Passé ce délai, des frais peuvent s'appliquer. Aucune garantie d'acceptation de votre visa : la décision appartient au consulat."
    },
    en: {
      h1: ["Book your hotel", "for a worry-free visa"], sub: "Get a hotel booking you can cancel for free, for your visa application.",
      trust: ["Instant confirmation", "PDF confirmation", "Free cancellation"], tab: "Visa-Friendly Hotels", nav: ["Visa Guide", "About", "Contact"],
      upd: ["New version available", "Update"], to: "Destination", ph: "City", d1: "Check-in", d2: "Check-out", pax: "Travellers", search: "Search", searching: "Searching…",
      pick: "Pick a city from the list.", dates: "Enter a check-in date and a later check-out date.", net: "Connection failed. Please try again in a moment.",
      adult: "Adult", adults: "Adults", child: "Child", children: "Children", lAdult: "Adults", lChild: "Children (0-17)", age: "Child's age", yrs: "yr",
      found: function (n) { return n + " hotel(s) found"; }, none: "No hotel available on these dates. Try other dates or another city.", nights: function (n) { return "for " + n + " night" + (n > 1 ? "s" : ""); },
      kmC: function (k) { return k + " km from the centre"; }, rev: function (s, n) { return s + "/10" + (n ? " · " + n + " reviews" : ""); },
      ck: ["Instant confirmation", "PDF confirmation", "Only rooms with free cancellation are shown"], select: "Select", loading: "Loading…",
      back: "← Back to hotels", rooms: "Rooms with free cancellation", noRooms: "No room with free cancellation for this hotel on these dates. Choose another hotel.",
      free: function (d) { return "Free cancellation until " + d; }, due: "To pay at the hotel", reserve: "Book this room", vf: "Visa-Friendly", checkin: "Check-in from", checkout: "Check-out before",
      boards: { room_only: "Room only", breakfast: "Breakfast included", half_board: "Half board", full_board: "Full board", all_inclusive: "All inclusive" },
      beds: { single: "single bed", double: "double bed", queen: "queen bed", king: "king bed", twin: "twin beds", sofa_bed: "sofa bed", bunk: "bunk beds" },
      guests: "Travellers (as on the passport)", given: "Given name(s)", family: "Family name", born: "Date of birth", mail: "Email (the confirmation will be sent here)", phone: "Phone (with country code, e.g. +216…)",
      confirm: "Confirm booking", booking: "Booking…", fill: "Please fill in all required fields.",
      soon: "Hotel booking opens soon. Your search is fine: come back in a few days.",
      badge: "Hotel booking confirmed", ref: "Booking reference", hotel: "Hotel", stay: "Stay", who: "Travellers", total: "Total", cancelUntil: "Free cancellation until",
      print: "Download as PDF / Print", again: "New search",
      doc: "Hotel booking confirmation. Show the reference at the hotel. Cancel before the date shown if you no longer need it.",
      whyT: "Why choose CheckMyVisa?", why: [["Verifiable booking", "with a hotel reference"], ["Instant confirmation", "PDF to download"], ["Joury AI assistant", "she answers your questions"], ["Travel with peace of mind", "free cancellation checked"]],
      joT: "Joury, your travel assistant", joP: "Need a hotel booking for your visa application? I'll help you choose.", joL: ["Clear conditions", "Confirmation ready to download", "Free cancellation checked"], joB: "Talk to Joury",
      jb: ["Hello!", "I am Joury, I help with your trip."], footT: "Hotels are booked through booking partners. Free cancellation until the date shown on each room.",
      legal: "This is a real booking with the hotel, cancellable free of charge until the date shown. After that, fees may apply. Your visa is not guaranteed: the decision belongs to the consulate."
    },
    ar: {
      h1: ["احجز فندقك", "لتأشيرة بلا قلق"], sub: "احصل على حجز فندقي يمكنك إلغاؤه مجانًا لملف التأشيرة.",
      trust: ["تأكيد فوري", "تأكيد بصيغة PDF", "إلغاء مجاني"], tab: "فنادق مناسبة للتأشيرة", nav: ["دليل التأشيرة", "من نحن", "اتصل بنا"],
      upd: ["إصدار جديد متاح", "تحديث"], to: "الوجهة", ph: "مدينة", d1: "الوصول", d2: "المغادرة", pax: "المسافرون", search: "بحث", searching: "جارٍ البحث…",
      pick: "اختر مدينة من القائمة.", dates: "أدخل تاريخ الوصول وتاريخ مغادرة لاحقًا.", net: "تعذّر الاتصال. حاول مرة أخرى بعد قليل.",
      adult: "بالغ", adults: "بالغون", child: "طفل", children: "أطفال", lAdult: "البالغون", lChild: "الأطفال (0-17 سنة)", age: "عمر الطفل", yrs: "سنة",
      found: function (n) { return "تم العثور على " + n + " فندق"; }, none: "لا يوجد فندق متاح في هذه التواريخ. جرّب تواريخ أخرى أو مدينة أخرى.", nights: function (n) { return "لـ " + n + " ليلة"; },
      kmC: function (k) { return k + " كم من المركز"; }, rev: function (s, n) { return s + "/10" + (n ? " · " + n + " تقييم" : ""); },
      ck: ["تأكيد فوري", "تأكيد بصيغة PDF", "تُعرض فقط الغرف القابلة للإلغاء مجانًا"], select: "اختيار", loading: "جارٍ التحميل…",
      back: "→ العودة إلى الفنادق", rooms: "غرف قابلة للإلغاء مجانًا", noRooms: "لا توجد غرفة قابلة للإلغاء مجانًا في هذا الفندق في هذه التواريخ. اختر فندقًا آخر.",
      free: function (d) { return "إلغاء مجاني حتى " + d; }, due: "يُدفع في الفندق", reserve: "احجز هذه الغرفة", vf: "مناسب للتأشيرة", checkin: "الوصول ابتداءً من", checkout: "المغادرة قبل",
      boards: { room_only: "غرفة فقط", breakfast: "الفطور مشمول", half_board: "نصف إقامة", full_board: "إقامة كاملة", all_inclusive: "شامل كل شيء" },
      beds: { single: "سرير مفرد", double: "سرير مزدوج", queen: "سرير كوين", king: "سرير كينغ", twin: "سريران منفصلان", sofa_bed: "أريكة سرير", bunk: "سرير بطابقين" },
      guests: "المسافرون (كما في جواز السفر)", given: "الاسم الشخصي", family: "اللقب", born: "تاريخ الميلاد", mail: "البريد الإلكتروني (سيُرسل التأكيد إليه)", phone: "الهاتف (مع رمز الدولة، مثل +216…)",
      confirm: "تأكيد الحجز", booking: "جارٍ الحجز…", fill: "يرجى ملء جميع الحقول الإلزامية.",
      soon: "حجز الفنادق سيفتح قريبًا. بحثك سليم: عد بعد أيام قليلة.",
      badge: "تم تأكيد حجز الفندق", ref: "مرجع الحجز", hotel: "الفندق", stay: "الإقامة", who: "المسافرون", total: "المجموع", cancelUntil: "إلغاء مجاني حتى",
      print: "تنزيل PDF / طباعة", again: "بحث جديد",
      doc: "تأكيد حجز فندق. أظهر المرجع في الفندق. ألغِ قبل التاريخ المذكور إذا لم تعد بحاجة إليه.",
      whyT: "لماذا تختار CheckMyVisa؟", why: [["حجز قابل للتحقق", "بمرجع من الفندق"], ["تأكيد فوري", "بصيغة PDF للتنزيل"], ["المساعدة الذكية جوري", "تجيب عن أسئلتك"], ["سافر بطمأنينة", "الإلغاء المجاني مُتحقَّق منه"]],
      joT: "جوري، مساعدتك للسفر", joP: "تحتاج حجز فندق لطلب التأشيرة؟ أساعدك على الاختيار.", joL: ["شروط واضحة", "تأكيد جاهز للتنزيل", "إلغاء مجاني مُتحقَّق منه"], joB: "تحدّث مع جوري",
      jb: ["مرحبًا!", "أنا جوري، أساعدك في رحلتك."], footT: "تُحجز الفنادق عبر شركاء الحجز. إلغاء مجاني حتى التاريخ المذكور على كل غرفة.",
      legal: "هذا حجز حقيقي لدى الفندق، قابل للإلغاء مجانًا حتى التاريخ المذكور. بعده قد تُطبَّق رسوم. لا ضمان لقبول تأشيرتك: القرار للقنصلية."
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
  var dtf = function (iso) { if (!iso) return "—"; try { return new Date(iso).toLocaleString(locale, { dateStyle: "medium", timeStyle: "short" }); } catch (e) { return esc(iso); } };
  var dmy = function (iso) { try { return new Date(String(iso).slice(0, 10) + "T12:00:00").toLocaleDateString(locale, { dateStyle: "medium" }); } catch (e) { return ""; } };
  var money = function (a, c) { try { return new Intl.NumberFormat(locale, { style: "currency", currency: c, maximumFractionDigits: 2 }).format(parseFloat(a)); } catch (e) { return a + " " + c; } };
  var ymd = function (d) { return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
  var plus = function (n) { var d = new Date(); d.setDate(d.getDate() + n); return ymd(d); };
  var countryName = function (c) { try { return c ? new Intl.DisplayNames([locale], { type: "region" }).of(c) : ""; } catch (e) { return ""; } };

  var pick = null, cnt = { a: 1, c: 0 }, ages = [], hotels = [], stay = null, hotel = null, rooms = [], room = null;

  function post(path, payload) {
    return fetch(URL_ + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { if (!r.ok || d.ok === false) { var er = new Error(d.error || ""); er.code = d.code; throw er; } return d; }); });
  }
  var msg = function (e) { return e && e.code === "booking_disabled" ? t.soon : e && e.message && e.message !== "Failed to fetch" ? e.message : t.net; };
  function showErr(m) { var e = $("vl-err"); e.textContent = m || ""; e.hidden = !m; }

  var IC = {
    pin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a7 7 0 0 0-7 7c0 5 7 13 7 13s7-8 7-13a7 7 0 0 0-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.500a2.5 2.5 0 0 1 0 5z"/></svg>',
    cal: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 2v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-2V2h-2v2H9V2zM5 9h14v11H5z"/></svg>',
    user: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4 0-8 2-8 5v3h16v-3c0-3-4-5-8-5z"/></svg>',
    bed: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19V6M3 15h18v4M21 15v-3a3 3 0 0 0-3-3h-7v6" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="11" r="2" fill="none" stroke="currentColor" stroke-width="1.800"/></svg>',
    shield: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 5-3 8.500-7 10-4-1.500-7-5-7-10V6z" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linejoin="round"/><path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    doc: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h7l5 5v13H7z M14 3v5h5 M10 13h6 M10 17h6" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linejoin="round" stroke-linecap="round"/></svg>',
    refresh: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 12a8 8 0 1 1-2.500-5.800M20 4v5h-5" fill="none" stroke="currentColor" stroke-width="1.900" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    headset: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 14v-2a8 8 0 0 1 16 0v2" fill="none" stroke="currentColor" stroke-width="1.800"/><rect x="3" y="14" width="4" height="6" rx="1.500" fill="none" stroke="currentColor" stroke-width="1.800"/><rect x="17" y="14" width="4" height="6" rx="1.500" fill="none" stroke="currentColor" stroke-width="1.800"/><path d="M19 20c0 1.500-2 2-5 2" fill="none" stroke="currentColor" stroke-width="1.800" stroke-linecap="round"/></svg>',
    globe: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.700"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" fill="none" stroke="currentColor" stroke-width="1.700"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.200"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2.200" stroke-linecap="round"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.200" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };
  var ic = function (n) { return '<i class="vl-ic">' + IC[n] + "</i>"; };
  function setGo(txt, withIcon) { $("vl-go").innerHTML = (withIcon ? ic("search") : "") + esc(txt); }
  function lab(id, name, text) { $(id).innerHTML = ic(name) + esc(text); }

  /* ---------- texte statique ---------- */
  function paintStatic() {
    $("vl-h1").innerHTML = esc(t.h1[0]) + " <em>" + esc(t.h1[1]) + "</em>";
    $("vl-sub").textContent = t.sub;
    $("vl-trust").innerHTML = t.trust.map(function (x, i) { return "<li>" + ic(["shield", "doc", "refresh"][i]) + esc(x) + "</li>"; }).join("");
    $("vl-tabs").innerHTML = '<span class="vh-tab">' + ic("shield") + esc(t.tab) + "</span>";
    lab("vl-l-to", "pin", t.to); lab("vl-l-d1", "cal", t.d1); lab("vl-l-d2", "cal", t.d2); lab("vl-l-pax", "user", t.pax); paintPax();
    $("vl-to").placeholder = t.ph; setGo(t.search, true);
    $("vl-d1").min = today(); $("vl-d2").min = today();
    $("vh-why-h").textContent = t.whyT;
    $("vh-why-l").innerHTML = t.why.map(function (x, i) { return "<li>" + ic(["shield", "doc", "headset", "globe"][i]) + "<span><b>" + esc(x[0]) + "</b>" + esc(x[1]) + "</span></li>"; }).join("");
    $("vh-jo-h").textContent = t.joT; $("vh-jo-p").textContent = t.joP; $("vh-jo-b").textContent = t.joB;
    $("vh-jo-l").innerHTML = t.joL.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
    $("vl-legal").textContent = t.legal; $("vl-foot-t").textContent = t.footT;
    $("vl-n-guide").textContent = t.nav[0]; $("vl-n-about").textContent = t.nav[1]; $("vl-n-contact").textContent = t.nav[2];
  }
  function today() { return ymd(new Date()); }

  /* ---------- voyageurs ---------- */
  function paintPax() {
    $("vl-pax").textContent = cnt.a + " " + (cnt.a > 1 ? t.adults : t.adult) + (cnt.c ? ", " + cnt.c + " " + (cnt.c > 1 ? t.children : t.child) : "");
    var rows = [["a", t.lAdult], ["c", t.lChild]].map(function (r) {
      return '<div class="vl-pr"><span>' + esc(r[1]) + '</span><span class="vl-ps"><button type="button" data-pax="' + r[0] + '-1" aria-label="-">−</button><b>' + cnt[r[0]] + '</b><button type="button" data-pax="' + r[0] + '+1" aria-label="+">+</button></span></div>';
    }).join("");
    var ag = ages.map(function (v, i) {
      var o = ""; for (var y = 0; y <= 17; y++) o += '<option value="' + y + '"' + (y === v ? " selected" : "") + ">" + y + " " + esc(t.yrs) + "</option>";
      return '<div class="vl-pr"><span>' + esc(t.age) + " " + (i + 1) + '</span><select class="sel vh-age" data-age="' + i + '" aria-label="' + esc(t.age) + '">' + o + "</select></div>";
    }).join("");
    $("vl-paxp").innerHTML = rows + ag;
  }
  function movePax(code) {
    var k = code.charAt(0), d = code.charAt(1) === "+" ? 1 : -1, n = cnt[k] + d;
    if (k === "a") { if (n < 1 || n > 6) return; cnt.a = n; }
    else { if (n < 0 || n > 4) return; cnt.c = n; while (ages.length < n) ages.push(8); ages.length = n; }
    paintPax();
  }

  /* ---------- destination (autocomplétion) ---------- */
  function setupAc() {
    var inp = $("vl-to"), list = $("vl-to-list"), timer = null, seq = 0, items = [], idx = -1;
    function close() { list.hidden = true; inp.setAttribute("aria-expanded", "false"); idx = -1; }
    function choose(p) { pick = p; inp.value = p.city + (countryName(p.country) ? ", " + countryName(p.country) : ""); close(); }
    function hl() { Array.prototype.forEach.call(list.children, function (li, i) { li.setAttribute("aria-selected", String(i === idx)); }); }
    function render(arr, errTxt) {
      items = arr || [];
      if (!items.length) {
        if (!errTxt) return close();
        list.innerHTML = '<li class="vl-err" role="option" aria-disabled="true"><span>' + esc(errTxt) + "</span></li>"; list.hidden = false; inp.setAttribute("aria-expanded", "true"); return;
      }
      list.innerHTML = items.map(function (p, i) {
        var cc = /^[A-Za-z]{2}$/.test(p.country || "") ? p.country.toLowerCase() : "", ctry = countryName(p.country);
        return '<li role="option" data-i="' + i + '" class="vl-a">' + (cc ? '<img class="vl-fl" src="./flags/' + cc + '.png" alt="" width="22" height="16">' : '<i class="vl-fl"></i>') + "<span><b>" + esc(p.city) + "</b>" + (ctry ? ", " + esc(ctry) : "") + "</span></li>";
      }).join("");
      list.hidden = false; inp.setAttribute("aria-expanded", "true"); idx = -1;
    }
    inp.addEventListener("input", function () {
      pick = null; var q = inp.value.trim(); clearTimeout(timer);
      if (q.length < 2) return close();
      timer = setTimeout(function () {
        var my = ++seq;
        post("/hotel/places", { query: q }).then(function (r) { if (my === seq) render(r.places || []); }).catch(function (er) { if (my === seq) render([], msg(er)); });
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

  /* ---------- résultats ---------- */
  var stars = function (n) { return n ? '<span class="vh-st" aria-label="' + esc(n) + ' ★" dir="ltr">' + "★".repeat(Math.max(1, Math.min(5, Math.round(n)))) + "</span>" : ""; };
  function hotelCard(h) {
    var photo = /^https:\/\//.test(h.photo || "") ? '<img src="' + esc(h.photo) + '" alt="" loading="lazy" width="320" height="240">' : '<span class="vh-nophoto">' + ic("bed") + "</span>";
    return '<article class="vh-card"><div class="vh-ph">' + photo + '</div><div class="vh-in"><h3>' + esc(h.name) + " " + stars(h.stars) + "</h3>" +
      '<p class="vh-loc">' + ic("pin") + esc([h.city, h.distance_km != null ? t.kmC(h.distance_km) : ""].filter(Boolean).join(" · ")) + "</p>" +
      (h.review_score ? '<p class="vh-rev">' + esc(t.rev(h.review_score, h.review_count)) + "</p>" : "") +
      '<ul class="vh-ck">' + t.ck.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("") + "</ul></div>" +
      '<div class="vh-pr"><b dir="ltr">' + esc(money(h.total_amount, h.total_currency)) + "</b><span>" + esc(t.nights(h.nights)) + '</span><button type="button" class="pay vh-btn" data-hotel="' + esc(h.id) + '">' + esc(t.select) + ic("arrow") + "</button></div></article>";
  }
  function showHotels() {
    var box = $("vl-results");
    if (!hotels.length) { box.innerHTML = ""; return; }
    box.innerHTML = "<h2>" + esc(t.found(hotels.length)) + "</h2>" + hotels.map(hotelCard).join("");
  }
  function onSearch(e) {
    e.preventDefault(); showErr("");
    var d1 = $("vl-d1").value, d2 = $("vl-d2").value;
    if (!pick) return showErr(t.pick);
    if (!d1 || !d2 || d2 <= d1 || d1 < today()) return showErr(t.dates);
    var btn = $("vl-go"); btn.disabled = true; setGo(t.searching, false);
    var snap = { a: cnt.a, ages: ages.slice() };
    post("/hotel/search", { lat: pick.lat, lng: pick.lng, check_in: d1, check_out: d2, adults: cnt.a, children: ages })
      .then(function (r) {
        hotels = r.hotels || []; stay = { in: d1, out: d2, a: snap.a, ages: snap.ages, nights: hotels.length ? hotels[0].nights : Math.round((new Date(d2) - new Date(d1)) / 864e5) };
        if (!hotels.length) { $("vl-results").innerHTML = ""; return showErr(t.none); }
        showHotels(); $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(function (er) { showErr(msg(er)); })
      .then(function () { btn.disabled = false; setGo(t.search, true); });
  }

  /* ---------- chambres ---------- */
  function bedsTxt(arr) { return (arr || []).map(function (b) { return (b.count > 1 ? b.count + " × " : "") + (t.beds[b.type] || String(b.type || "").replace(/_/g, " ")); }).join(", "); }
  function roomCard(r) {
    var photo = /^https:\/\//.test(r.photo || "") ? '<img src="' + esc(r.photo) + '" alt="" loading="lazy" width="320" height="240">' : '<span class="vh-nophoto">' + ic("bed") + "</span>";
    var meta = [bedsTxt(r.beds), t.boards[r.board_type]].filter(Boolean).join(" · ");
    return '<article class="vh-card vh-room"><div class="vh-ph">' + photo + '<span class="vh-vf">' + ic("shield") + esc(t.vf) + '</span></div><div class="vh-in"><h3>' + esc(r.room || hotel.name) + "</h3>" +
      (meta ? '<p class="vh-loc">' + esc(meta) + "</p>" : "") +
      '<ul class="vh-ck"><li>' + esc(t.free(dtf(r.free_until))) + "</li>" + (r.due_at_accommodation_amount ? "<li>" + esc(t.due) + " : " + esc(money(r.due_at_accommodation_amount, r.due_at_accommodation_currency || r.total_currency)) + "</li>" : "") + "</ul></div>" +
      '<div class="vh-pr"><b dir="ltr">' + esc(money(r.total_amount, r.total_currency)) + "</b><span>" + esc(t.nights(stay.nights)) + '</span><button type="button" class="pay vh-btn" data-rate="' + esc(r.rate_id) + '">' + esc(t.reserve) + ic("arrow") + "</button></div></article>";
  }
  function openHotel(id, btn) {
    var h = hotels.filter(function (x) { return x.id === id; })[0]; if (!h) return;
    btn.disabled = true; var old = btn.innerHTML; btn.textContent = t.loading;
    post("/hotel/rates", { search_result_id: id }).then(function (r) {
      hotel = { id: id, name: (r.hotel && r.hotel.name) || h.name, stars: (r.hotel && r.hotel.stars) || h.stars, address: (r.hotel && r.hotel.address) || h.address || "", cin: r.hotel && r.hotel.check_in_after, cout: r.hotel && r.hotel.check_out_before };
      rooms = r.rates || [];
      $("vl-results").innerHTML = '<button type="button" class="chip vl-back" data-back="1">' + esc(t.back) + '</button><div class="vh-hd"><h2>' + esc(hotel.name) + " " + stars(hotel.stars) + "</h2><p>" + esc(hotel.address) + "</p><p>" +
        esc(dmy(stay.in) + " → " + dmy(stay.out)) + (hotel.cin ? " · " + esc(t.checkin) + " " + esc(hotel.cin) : "") + (hotel.cout ? " · " + esc(t.checkout) + " " + esc(hotel.cout) : "") + "</p></div>" +
        (rooms.length ? "<h2>" + esc(t.rooms) + "</h2>" + rooms.map(roomCard).join("") : '<p class="fe fh-err vh-none">' + esc(t.noRooms) + "</p>");
      $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
    }).catch(function (er) { btn.disabled = false; btn.innerHTML = old; showErr(msg(er)); $("vl-form").scrollIntoView({ behavior: "smooth", block: "center" }); });
  }

  /* ---------- voyageurs de la réservation ---------- */
  function field(id, label, type, extra) { return '<label class="fh-f" for="vg-' + id + '">' + esc(label) + '<input class="sel" id="vg-' + id + '" name="' + id + '" type="' + type + '" ' + (extra || "") + "></label>"; }
  function guestList() {
    var out = [], k;
    for (k = 1; k <= stay.a; k++) out.push({ label: t.lAdult.replace(/s$/, "") + (stay.a > 1 ? " " + k : ""), child: false });
    for (k = 0; k < stay.ages.length; k++) out.push({ label: t.child + " " + (k + 1) + " (" + stay.ages[k] + " " + t.yrs + ")", child: true });
    return out;
  }
  function showGuests(rateId) {
    room = rooms.filter(function (x) { return x.rate_id === rateId; })[0]; if (!room) return;
    var bl = guestList().map(function (g, n) {
      return '<fieldset class="vp-blk"><legend>' + esc(g.label) + '</legend><div class="fh-grid">' +
        field("n" + n + "-given", t.given, "text", 'autocomplete="off" style="text-transform:uppercase" required') + field("n" + n + "-family", t.family, "text", 'autocomplete="off" style="text-transform:uppercase" required') +
        (g.child ? field("n" + n + "-born", t.born, "date", "required") : "") + "</div></fieldset>";
    }).join("");
    $("vl-results").innerHTML = '<button type="button" class="chip vl-back" data-back-rooms="1">' + esc(t.back) + '</button><div class="fh-offer"><div class="fh-row"><b>' + esc(hotel.name) + '</b><span dir="ltr">' + esc(money(room.total_amount, room.total_currency)) + "</span></div><p class=\"vh-loc\">" +
      esc((room.room || "") + " · " + dmy(stay.in) + " → " + dmy(stay.out)) + '</p><p class="vh-free">' + esc(t.free(dtf(room.free_until))) + "</p></div>" +
      '<form id="vg-form" novalidate><h2>' + esc(t.guests) + "</h2>" + bl + '<div class="fh-grid">' + field("email", t.mail, "email", 'autocomplete="email" dir="ltr" required') + field("phone_number", t.phone, "tel", 'autocomplete="tel" dir="ltr" placeholder="+216" required') +
      '</div><p class="fe fh-err" id="vg-err" role="alert" hidden></p><button type="submit" class="pay wide" id="vg-go">' + esc(t.confirm) + "</button></form>";
    $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  function onBook(e) {
    e.preventDefault();
    var f = Object.fromEntries(new FormData(e.target)), err = $("vg-err"), btn = $("vg-go"); err.hidden = true;
    var email = String(f.email || "").trim(), phone = String(f.phone_number || "").trim();
    var list = guestList().map(function (g, n) { var o = { given_name: f["n" + n + "-given"], family_name: f["n" + n + "-family"] }; if (g.child) o.born_on = f["n" + n + "-born"]; return o; });
    for (var i = 0; i < list.length; i++) { if (!String(list[i].given_name || "").trim() || !String(list[i].family_name || "").trim() || (guestList()[i].child && !list[i].born_on) || !email || !phone) { err.textContent = t.fill; err.hidden = false; return; } }
    btn.disabled = true; btn.textContent = t.booking;
    post("/hotel/book", { rate_id: room.rate_id, guests: list, email: email, phone_number: phone })
      .then(showReceipt)
      .catch(function (er) { btn.disabled = false; btn.textContent = t.confirm; err.textContent = msg(er); err.hidden = false; });
  }

  /* ---------- confirmation ---------- */
  function showReceipt(o) {
    var h = o.hotel || {};
    $("vl-results").innerHTML = '<section class="fh-receipt" id="fh-receipt"><p class="fh-badge">' + esc(t.badge) + '</p><p class="fh-k">' + esc(t.ref) + '</p><p class="fh-pnr" dir="ltr">' + esc(o.reference || "—") + "</p>" +
      '<dl class="fh-dl"><dt>' + esc(t.hotel) + "</dt><dd>" + esc(h.name || hotel.name) + (h.address ? "<br>" + esc(h.address) : "") + "</dd><dt>" + esc(t.stay) + "</dt><dd>" + esc(dmy(o.check_in_date || stay.in) + " → " + dmy(o.check_out_date || stay.out)) + "</dd><dt>" + esc(t.who) + '</dt><dd dir="ltr">' +
      (o.guests || []).map(function (x) { return esc(x.family_name) + " / " + esc(x.given_name); }).join("<br>") + "</dd><dt>" + esc(t.total) + '</dt><dd dir="ltr">' + esc(money(o.total_amount, o.total_currency)) + "</dd><dt>" + esc(t.cancelUntil) + "</dt><dd>" + esc(dtf(o.free_until)) + "</dd></dl>" +
      '<p class="fh-doc">' + esc(t.doc) + "</p></section>" +
      '<button type="button" class="pay wide fh-noprint" data-print="1">' + esc(t.print) + '</button> <button type="button" class="chip fh-noprint" data-again="1">' + esc(t.again) + "</button>";
    $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* ---------- événements ---------- */
  document.addEventListener("click", function (e) {
    var el;
    if ((el = e.target.closest("[data-pax]"))) { movePax(el.getAttribute("data-pax")); return; }
    if (e.target.closest("#vl-pax")) { var pp = $("vl-paxp"); pp.hidden = !pp.hidden; $("vl-pax").setAttribute("aria-expanded", String(!pp.hidden)); return; }
    if (!e.target.closest("#vl-paxp") && !$("vl-paxp").hidden) { $("vl-paxp").hidden = true; $("vl-pax").setAttribute("aria-expanded", "false"); }
    if ((el = e.target.closest("[data-hotel]"))) { openHotel(el.getAttribute("data-hotel"), el); return; }
    if ((el = e.target.closest("[data-rate]"))) { showGuests(el.getAttribute("data-rate")); return; }
    if (e.target.closest("[data-back]")) { showHotels(); $("vl-results").scrollIntoView({ behavior: "smooth", block: "start" }); return; }
    if (e.target.closest("[data-back-rooms]")) { openHotel(hotel.id, document.createElement("button")); return; }
    if (e.target.closest("[data-print]")) { window.print(); return; }
    if (e.target.closest("[data-again]")) { $("vl-results").innerHTML = ""; $("vl-form").scrollIntoView({ behavior: "smooth" }); }
  });
  document.addEventListener("change", function (e) { var s = e.target.closest && e.target.closest("[data-age]"); if (s) ages[+s.getAttribute("data-age")] = +s.value; });
  document.addEventListener("submit", function (e) { if (e.target.id === "vl-form") onSearch(e); else if (e.target.id === "vg-form") onBook(e); });

  $("vl-joury-t").innerHTML = "<b>" + esc(t.jb[0]) + "</b> " + esc(t.jb[1]);
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
  $("vl-d1").value = plus(30); $("vl-d2").value = plus(36);
  var phTxt = { fr: "jj/mm/aaaa", en: "dd/mm/yyyy", ar: "يوم/شهر/سنة" }[L];
  ["vl-d1", "vl-d2"].forEach(function (id) {
    var inp = $(id), ph = document.createElement("span");
    ph.className = "vl-ph"; ph.textContent = phTxt; ph.setAttribute("aria-hidden", "true");
    inp.parentNode.appendChild(ph);
    var sync = function () { if (inp.value) inp.removeAttribute("data-empty"); else inp.setAttribute("data-empty", "1"); ph.hidden = !!inp.value; };
    inp.addEventListener("input", sync); inp.addEventListener("change", sync); sync();
    inp.addEventListener("click", function () { try { if (typeof inp.showPicker === "function") inp.showPicker(); } catch (e) { /* déjà ouvert ou refusé */ } });
  });
  $("vl-d1").addEventListener("change", function () { var a = $("vl-d1").value, b = $("vl-d2"); if (a && (!b.value || b.value <= a)) { var d = new Date(a + "T12:00:00"); d.setDate(d.getDate() + 6); b.value = ymd(d); b.dispatchEvent(new Event("change")); } });
  var lg = $("vl-lang"); lg.value = L;
  lg.addEventListener("change", function () { try { localStorage.setItem("vc_lang", lg.value); } catch (e) { /* ignore */ } location.reload(); });
  setupAc();
})();
