/* Host & Go : page « Join As… ». Deux rôles (Hôte, Voyageur / Worker) puis six thèmes d'échange.
   Aucun parcours n'est encore ouvert : un choix se met en surbrillance et la page l'annonce, sans rien envoyer. Script externe (CSP). */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var IX = { fr: 0, en: 1, ar: 2 }[lang];
  function t(a) { return a[IX]; }
  var copy = {
    en: {carA:"Experiences",prevL:"Previous",nextL:"Next",cardOf:"Card {n} of {t}",barL:"Host & Go navigation",tabFind:"Discover",tabHost:"Host",tabTrav:"Traveller",tabVisa:"CheckMyVisa",findA:"Become a",findB:"host",findP:"Host & Go opens soon. Sign up to be among the first.",ctaHost:"Become a host →",destT:"Countries where you can become a host",conA:"Connect",conB:"with travellers",conP:"Planning a trip and want to share your adventure? Join the traveller waiting list.",ctaTrav:"Join as a traveller →",chips:["Tunisia","Morocco","Algeria","France","Germany","Italy","Spain","Portugal","Belgium","Netherlands","Ireland"],fPriv:"Privacy",fTerms:"Terms",themesTitle:"Choose your experience",t1:"Family life",t2:"Farms & agriculture",t3:"Gardening & nature",t4:"Guesthouses",t5:"Cultural & language exchange",t6:"Animals & pet-sitting",home:"Home",about:"About",how:"How It Works",safety:"Safety",faq:"FAQ",signin:"Accounts soon",headline:"Travel differently.<br>Experience more.",lead:"Connect with locals, share cultures, and make your journey unforgettable.",start:"Start your journey",rolesLabel:"I am a…",join:"Join As...",sub:"Choose how you want to be part of the Host & Go community",host:"Host",hostDesc:"Welcome travellers and share your home",traveller:"Traveller / Worker",travellerDesc:"Discover places, share your skills and experience local life",secure:"Safety first<br>checks planned",global:"Network in the making<br>opening soon",human:"Real Human<br>Connections",together:"<em>Together,</em> let’s explore the world.",tagline:"Host & Go — More than a trip, a human exchange.",joinNow:"Join Now →"},
    fr: {carA:"Expériences",prevL:"Précédent",nextL:"Suivant",cardOf:"Carte {n} sur {t}",barL:"Navigation Host & Go",tabFind:"Découvrir",tabHost:"Hôte",tabTrav:"Voyageur",tabVisa:"CheckMyVisa",findA:"Devenez",findB:"hôte",findP:"Host & Go ouvre bientôt. Inscrivez-vous pour être parmi les premiers.",ctaHost:"Devenir hôte →",destT:"Pays où vous pouvez devenir hôte",conA:"Rencontrez",conB:"des voyageurs",conP:"Vous préparez un voyage et voulez partager l’aventure ? Rejoignez la liste d’attente voyageur.",ctaTrav:"Rejoindre comme voyageur →",chips:["Tunisie","Maroc","Algérie","France","Allemagne","Italie","Espagne","Portugal","Belgique","Pays-Bas","Irlande"],fPriv:"Confidentialité",fTerms:"Conditions",themesTitle:"Choisissez votre expérience",t1:"Vie en famille",t2:"Fermes et agriculture",t3:"Jardinage et nature",t4:"Maisons d'hôtes",t5:"Échange culturel et linguistique",t6:"Animaux et gardiennage",home:"Accueil",about:"À propos",how:"Comment ça marche",safety:"Sécurité",faq:"FAQ",signin:"Comptes bientôt",headline:"Voyagez autrement.<br>Vivez plus.",lead:"Rencontrez les habitants, partagez les cultures et rendez votre voyage inoubliable.",start:"Commencer l’aventure",rolesLabel:"Je suis…",join:"Rejoindre comme…",sub:"Choisissez votre rôle dans la communauté Host & Go",host:"Hôte",hostDesc:"Accueillez des voyageurs et partagez votre quotidien",traveller:"Voyageur / Worker",travellerDesc:"Découvrez de nouveaux lieux, partagez vos compétences et vivez comme un local",secure:"La sécurité d’abord<br>vérifications prévues",global:"Réseau en construction<br>ouverture prochaine",human:"De vraies rencontres<br>humaines",together:"<em>Ensemble,</em> explorons le monde.",tagline:"Host & Go — Plus qu’un voyage, un échange humain.",joinNow:"Rejoindre →"},
    ar: {carA:"التجارب",prevL:"السابق",nextL:"التالي",cardOf:"البطاقة {n} من {t}",barL:"التنقل في Host & Go",tabFind:"اكتشف",tabHost:"مضيف",tabTrav:"مسافر",tabVisa:"CheckMyVisa",findA:"كن",findB:"مضيفاً",findP:"يفتح Host & Go قريباً. سجّل لتكون من الأوائل.",ctaHost:"← كن مضيفاً",destT:"البلدان التي يمكنك أن تصبح فيها مضيفاً",conA:"تواصل",conB:"مع المسافرين",conP:"تخطط لرحلة وتريد مشاركة المغامرة؟ انضم إلى قائمة انتظار المسافرين.",ctaTrav:"← انضم كمسافر",chips:["تونس","المغرب","الجزائر","فرنسا","ألمانيا","إيطاليا","إسبانيا","البرتغال","بلجيكا","هولندا","إيرلندا"],fPriv:"الخصوصية",fTerms:"الشروط",themesTitle:"اختر تجربتك",t1:"الحياة العائلية",t2:"المزارع والزراعة",t3:"البستنة والطبيعة",t4:"بيوت الضيافة",t5:"التبادل الثقافي واللغوي",t6:"الحيوانات ورعايتها",home:"الرئيسية",about:"من نحن",how:"كيف يعمل",safety:"السلامة",faq:"الأسئلة",signin:"الحسابات قريباً",headline:"سافر بطريقة مختلفة.<br>اكتشف المزيد.",lead:"تعرّف على السكان المحليين وتبادل الثقافات واجعل رحلتك لا تُنسى.",start:"ابدأ رحلتك",rolesLabel:"أنا…",join:"انضم بصفتك…",sub:"اختر دورك في مجتمع Host & Go",host:"مضيف",hostDesc:"استقبل المسافرين وشاركهم حياتك اليومية",traveller:"مسافر / عامل",travellerDesc:"اكتشف أماكن جديدة وشارك مهاراتك وعِش التجربة المحلية",secure:"الأمان أولاً<br>تحققات مخطط لها",global:"شبكة قيد الإنشاء<br>الافتتاح قريباً",human:"روابط إنسانية<br>حقيقية",together:"<em>معاً،</em> لنستكشف العالم.",tagline:"Host & Go — أكثر من رحلة، إنه تبادل إنساني.",joinNow:"انضم الآن ←"}
  }[lang];
  var UI = {
    themes: ["Choisissez un thème d’échange", "Choose an exchange theme", "اختر موضوع التبادل"],
    soon: ["ce parcours ouvrira bientôt.", "this journey will open soon.", "سيُفتح هذا المسار قريباً."],
    sel: ["Sélection", "Selected", "اختيارك"]
  };
  /* Six thèmes. Pas encore de photos : tuile illustrée (couleur + pictogramme). Pour passer à une photo, mettre img = "nom" (images/hostgo/nom.webp). */
  var THEMES = [
    { id: "family", icon: "users", t: ["Vie en famille", "Family life", "الحياة العائلية"], d: ["Partagez le quotidien d’une famille d’accueil", "Share daily life with a host family", "شارك الحياة اليومية مع أسرة مضيفة"] },
    { id: "farm", icon: "barn", t: ["Fermes et agriculture", "Farms & agriculture", "المزارع والزراعة"], d: ["Participez aux travaux d’une ferme", "Lend a hand on a working farm", "شارك في أعمال مزرعة"] },
    { id: "garden", icon: "sprout", t: ["Jardinage et nature", "Gardening & nature", "البستنة والطبيعة"], d: ["Entretenez jardins et espaces verts", "Look after gardens and green spaces", "اعتنِ بالحدائق والمساحات الخضراء"] },
    { id: "guesthouse", icon: "bed", t: ["Maisons d’hôtes", "Guesthouses", "بيوت الضيافة"], d: ["Aidez à accueillir les voyageurs", "Help welcome guests", "ساعد في استقبال الضيوف"] },
    { id: "exchange", icon: "chat", t: ["Échange culturel et linguistique", "Cultural & language exchange", "التبادل الثقافي واللغوي"], d: ["Partagez votre langue et votre culture", "Share your language and culture", "شارك لغتك وثقافتك"] },
    { id: "pets", icon: "paw", t: ["Animaux et gardiennage", "Pets & house-sitting", "الحيوانات وحراسة المنزل"], d: ["Gardez la maison et prenez soin des animaux", "Mind the home and care for pets", "احرس المنزل واعتنِ بالحيوانات"] }
  ];
  var P = {
    home: '<path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-6h4v6"/>',
    plane: '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5.2a3 3 0 0 1 0 5.6M21 20v-1a5 5 0 0 0-3.5-4.8"/>',
    barn: '<path d="M3 21V10l9-6 9 6v11M3 21h18M8 21v-7h8v7M8 14l8 7M16 14l-8 7"/>',
    sprout: '<path d="M12 21v-9M12 12c0-4 3-6 7-6 0 4-2 7-7 6zM12 15c0-3-2-5-6-5 0 3 2 6 6 5z"/>',
    bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="1.5"/>',
    chat: '<path d="M4 5h11v7H9l-3 3v-3H4zM15 9h5v7h-2v3l-3-3h-4v-2"/>',
    paw: '<circle cx="6" cy="10" r="1.8"/><circle cx="10" cy="6" r="1.8"/><circle cx="14" cy="6" r="1.8"/><circle cx="18" cy="10" r="1.8"/><path d="M12 12c-3 0-5.5 3-5.5 5.2 0 1.6 1.3 2.3 2.7 2.3 1 0 1.9-.5 2.8-.5s1.8.5 2.8.5c1.4 0 2.7-.7 2.7-2.3C17.5 15 15 12 12 12z"/>'
  };
  function svg(k) { return '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' + P[k] + '</svg>'; }
  function $(id) { return document.getElementById(id); }

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-ia]").forEach(function (el) { var k = el.getAttribute("data-ia"); if (copy[k] != null) el.setAttribute("aria-label", copy[k]); });
  var chipBox = $("hg-chips"); if (chipBox) copy.chips.forEach(function (c) { var li = document.createElement("li"), a = document.createElement("a"); a.href = "./hostgo-hote.html"; a.textContent = c; li.appendChild(a); chipBox.appendChild(li); });
  /* Carrousel horizontal : défilement tactile (scroll-snap), carte centrée, voisines visibles, points de navigation */
  function carousel(root, label) {
    var track = root.querySelector(".hg-track"), dots = root.nextElementSibling, prev = root.querySelector(".prev"), next = root.querySelector(".next"); if (!track || !dots) return;
    var cards = [].slice.call(track.children), cur = 0, tick = false, reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    cards.forEach(function (c, i) {
      c.setAttribute("role", "group"); c.setAttribute("aria-roledescription", "slide"); c.setAttribute("aria-label", (label ? label + " — " : "") + copy.cardOf.replace("{n}", i + 1).replace("{t}", cards.length));
      var b = document.createElement("button"); b.type = "button"; b.className = "hg-dot"; b.setAttribute("aria-label", c.getAttribute("aria-label")); b.addEventListener("click", function () { go(i); }); dots.appendChild(b);
    });
    function center(i) { var c = cards[i]; return c.offsetLeft + c.offsetWidth / 2 - track.clientWidth / 2; }
    function go(i) { i = Math.max(0, Math.min(cards.length - 1, i)); track.scrollTo({ left: center(i), behavior: reduce ? "auto" : "smooth" }); }
    function mark() {
      tick = false; var mid = track.scrollLeft + track.clientWidth / 2, best = 0, d = 1e9;
      cards.forEach(function (c, i) { var x = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid); if (x < d) { d = x; best = i; } });
      cur = best; cards.forEach(function (c, i) { c.classList.toggle("on", i === best); }); [].slice.call(dots.children).forEach(function (b, i) { if (i === best) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
      if (prev) prev.disabled = best === 0; if (next) next.disabled = best === cards.length - 1;
    }
    track.addEventListener("scroll", function () { if (!tick) { tick = true; requestAnimationFrame(mark); } }, { passive: true });
    if (prev) prev.addEventListener("click", function () { go(cur - 1); }); if (next) next.addEventListener("click", function () { go(cur + 1); });
    track.addEventListener("keydown", function (e) { var k = e.key, step = k === "ArrowRight" ? 1 : k === "ArrowLeft" ? -1 : 0; if (!step) return; e.preventDefault(); go(cur + step); });
    window.addEventListener("resize", function () { go(cur); });
    go(0); track.scrollLeft = center(0); mark();
  }
  if (lang !== "fr") document.documentElement.classList.add("hg-nofr");
  carousel($("hg-car"), copy.carA);
  document.querySelectorAll("[data-i]").forEach(function (el) { var k = el.getAttribute("data-i"); if (copy[k] != null) el.textContent = copy[k]; });
  ["headline", "secure", "global", "human", "together"].forEach(function (k) { var el = document.querySelector('[data-i="' + k + '"]'); if (el && copy[k]) el.innerHTML = copy[k]; });
  document.title = lang === "fr" ? "Host & Go — Voyage · Échange · Rencontre" : lang === "ar" ? "Host & Go — سفر · تبادل · انتماء" : "Host & Go — Travel · Exchange · Belong";

  /* Rôles */
  var ROLE_ICON = { host: "home", "traveler-worker": "plane" };
  var roleBtns = [].slice.call(document.querySelectorAll(".hg-role"));
  roleBtns.forEach(function (b) { b.querySelector(".hg-role-ico").innerHTML = svg(ROLE_ICON[b.getAttribute("data-role")]); });

  /* Thèmes */
  var grid = $("hg-grid");
  (grid ? THEMES : []).forEach(function (th) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "hg-card t-" + th.id; b.setAttribute("data-theme", th.id); b.setAttribute("aria-pressed", "false");
    var m = document.createElement("span"); m.className = "hg-media"; m.setAttribute("aria-hidden", "true"); m.innerHTML = svg(th.icon);
    var c = document.createElement("span"); c.className = "hg-card-content";
    var s = document.createElement("strong"); s.textContent = t(th.t);
    var d = document.createElement("small"); d.textContent = t(th.d);
    var a = document.createElement("span"); a.className = "hg-arrow"; a.setAttribute("aria-hidden", "true"); a.textContent = lang === "ar" ? "←" : "→";
    c.appendChild(s); c.appendChild(d); b.appendChild(m); b.appendChild(c); b.appendChild(a); grid.appendChild(b);
  });
  var themeBtns = grid ? [].slice.call(grid.querySelectorAll(".hg-card")) : [];

  function pick(list, btn) {
    var was = btn.getAttribute("aria-pressed") === "true";
    list.forEach(function (x) { x.setAttribute("aria-pressed", "false"); x.classList.remove("is-selected"); });
    if (!was) { btn.setAttribute("aria-pressed", "true"); btn.classList.add("is-selected"); }
    status();
  }
  function label(btn) { return btn.querySelector("strong").textContent; }
  function status() {
    var parts = [];
    roleBtns.concat(themeBtns).forEach(function (b) { if (b.getAttribute("aria-pressed") === "true") parts.push(label(b)); });
    $("hg-status").textContent = parts.length ? t(UI.sel) + " : " + parts.join(" · ") + " — " + t(UI.soon) : "";
  }
  roleBtns.forEach(function (b) { b.addEventListener("click", function () { pick(roleBtns, b); }); });
  themeBtns.forEach(function (b) { b.addEventListener("click", function () { pick(themeBtns, b); }); });


  /* ---------- Suite du parcours : Hôte -> inscription hôte, Voyageur / Worker -> tarifs et compte voyageur ---------- */
  var PAGES = { host: "./hostgo-hote.html", "traveler-worker": "./hostgo-voyageur.html" };
  var CTA = {
    host: ["Devenir hôte : commencer mon inscription →", "Become a host: start my sign-up →", "كن مضيفاً: ابدأ تسجيلي ←"],
    "traveler-worker": ["Voyageur / Worker : voir les tarifs et s’inscrire →", "Traveller / Worker: see the plans and sign up →", "مسافر / عامل: اطّلع على الاشتراكات وسجّل ←"]
  };
  function selected(list, attr) { var r = list.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0]; return r ? r.getAttribute(attr) : ""; }
  function syncCta() {
    var r = selected(roleBtns, "data-role"), box = $("hg-host-cta");
    box.hidden = !r; if (r) { var a = $("hg-host-link"); a.href = PAGES[r]; a.textContent = t(CTA[r]); }
  }
  var baseStatus = status;
  status = function () { baseStatus(); syncCta(); };
  syncCta();
  roleBtns.forEach(function (b) {
    b.addEventListener("click", function () { if (b.getAttribute("aria-pressed") === "true") window.location.href = PAGES[b.getAttribute("data-role")]; });
  });

  var role = new URLSearchParams(window.location.search).get("role");
  roleBtns.forEach(function (b) { if (b.getAttribute("data-role") === role) pick(roleBtns, b); });
})();
