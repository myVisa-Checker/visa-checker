/* Host & Go : page « Join As… ». Script externe (la CSP de la page n'autorise pas le script inline).
   Textes FR/EN/AR dans T. Chaque carte pointe vers une page déjà existante ; sans parcours existant, la carte reste visible avec la mention « Bientôt ». */
(function () {
  "use strict";
  var L = (window.SI && SI.lang) || "fr"; if (["fr", "en", "ar"].indexOf(L) < 0) L = "fr";
  var IX = { fr: 0, en: 1, ar: 2 }[L];
  function t(a) { return a[IX]; }
  var T = {
    title: ["Voyagez autrement,|vivez l’échange !", "Travel differently,|live the exchange!", "سافر بطريقة مختلفة،|عِش التبادل!"],
    lead: ["Host & Go vous connecte avec des hôtes locaux partout dans le monde pour un séjour authentique, solidaire et enrichissant.", "Host & Go connects you with local hosts around the world for an authentic, supportive and enriching stay.", "تربطك Host & Go بمضيفين محليين حول العالم لإقامة أصيلة وتضامنية ومُثرية."],
    sub: ["Choisissez votre profil pour commencer votre aventure", "Choose your profile to start your adventure", "اختر ملفك لتبدأ مغامرتك"],
    note: ["Les parcours Hôte et Host & Work ouvriront prochainement.", "The Host and Host & Work journeys will open soon.", "مساران «مضيف» و«Host & Work» سيفتحان قريباً."],
    endT: ["Un monde plus proche, ensemble", "A closer world, together", "عالم أقرب، معاً"],
    endBtn: ["Préparer mon dossier visa", "Prepare my visa file", "حضّر ملف التأشيرة"],
    soon: ["Bientôt", "Soon", "قريباً"],
    home: ["Accueil", "Home", "الرئيسية"], crumb: ["Host & Go", "Host & Go", "Host & Go"]
  };
  /* href = page existante du site ; null = pas encore de parcours. */
  var CARDS = [
    { id: "voyageur", img: "voyageur", href: "./?accueil=1", icon: "plane", t: ["Voyageur", "Traveller", "مسافر"], d: ["Préparez et vérifiez votre dossier visa avant de partir", "Prepare and check your visa file before you go", "حضّر ملف تأشيرتك وتحقق منه قبل السفر"] },
    { id: "hote", img: "hote", href: null, icon: "home", t: ["Hôte", "Host", "مضيف"], d: ["Accueillez des voyageurs et partagez votre culture", "Welcome travellers and share your culture", "استقبل المسافرين وشاركهم ثقافتك"] },
    { id: "work", img: "work", href: null, icon: "tools", t: ["Host & Work", "Host & Work", "Host & Work"], d: ["Participez à la vie d’un foyer le temps d’un séjour", "Take part in a household’s life during your stay", "شارك في حياة الأسرة خلال إقامتك"] },
    { id: "etudiant", img: "etudiant", href: "./guide-visa-etudiant.html", icon: "cap", t: ["Étudiant", "Student", "طالب"], d: ["Visa étudiant : pièces à réunir et conseils", "Student visa: documents and advice", "تأشيرة الطالب: الوثائق والنصائح"] },
    { id: "pro", img: "pro", href: "./guide-visa-affaires.html", icon: "bag", t: ["Professionnel", "Professional", "محترف"], d: ["Voyage d’affaires : pièces à réunir et conseils", "Business trip: documents and advice", "رحلة عمل: الوثائق والنصائح"] },
    { id: "famille", img: "famille", href: "./guide-visite-familiale.html", icon: "users", t: ["Famille", "Family", "عائلة"], d: ["Visite familiale et voyage avec enfants", "Family visit and travelling with children", "زيارة عائلية والسفر مع الأطفال"] }
  ];
  var ICONS = {
    plane: '<path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/>',
    home: '<path d="M3 11.5 12 4l9 7.5M5.5 10v10h13V10M10 20v-6h4v6"/>',
    tools: '<path d="M14.5 6.5a4 4 0 0 0-5 5L4 17l3 3 5.5-5.5a4 4 0 0 0 5-5l-2.5 2.5-2-2z"/>',
    cap: '<path d="m2 9 10-5 10 5-10 5zM6 11.5V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.5"/>',
    bag: '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 13h18"/>',
    users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-1a5 5 0 0 1 5-5h2a5 5 0 0 1 5 5v1M16 5.2a3 3 0 0 1 0 5.6M21 20v-1a5 5 0 0 0-3.5-4.8"/>'
  };
  var SVG = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">';
  function $(id) { return document.getElementById(id); }
  document.documentElement.lang = L; document.documentElement.dir = L === "ar" ? "rtl" : "ltr";
  document.title = "Host & Go : Join As… | CheckMyVisa";

  var parts = t(T.title).split("|"), h1 = $("hg-title");
  h1.appendChild(document.createTextNode(parts[0]));
  var em = document.createElement("em"); em.textContent = parts[1]; h1.appendChild(em);
  $("hg-lead").textContent = t(T.lead); $("hg-sub").textContent = t(T.sub); $("hg-note").textContent = t(T.note);
  $("hg-end-t").textContent = t(T.endT); $("hg-end-btn").textContent = t(T.endBtn);
  $("hg-crumb-home").textContent = t(T.home); $("hg-crumb").textContent = t(T.crumb);

  var grid = $("hg-grid");
  CARDS.forEach(function (c) {
    var li = document.createElement("li"), live = !!c.href;
    var el = document.createElement(live ? "a" : "div");
    el.className = "hg-c" + (live ? "" : " is-soon");
    if (live) el.href = c.href; else el.setAttribute("aria-disabled", "true");
    var img = document.createElement("img");
    img.src = "./images/hostgo/" + c.img + ".webp"; img.alt = ""; img.loading = "lazy"; img.decoding = "async"; img.width = 240; img.height = 255;
    var body = document.createElement("div"); body.className = "hg-body";
    var ico = document.createElement("span"); ico.className = "hg-ico"; ico.setAttribute("aria-hidden", "true"); ico.innerHTML = SVG + ICONS[c.icon] + "</svg>";
    var tt = document.createElement("h3"); tt.className = "hg-t"; tt.textContent = t(c.t);
    var d = document.createElement("p"); d.className = "hg-d"; d.textContent = t(c.d);
    body.appendChild(ico); body.appendChild(tt); body.appendChild(d);
    if (live) {
      var go = document.createElement("span"); go.className = "hg-go"; go.setAttribute("aria-hidden", "true"); go.innerHTML = SVG + '<path d="M5 12h14M13 6l6 6-6 6"/></svg>'; el.appendChild(img); el.appendChild(body); el.appendChild(go);
    } else {
      var s = document.createElement("span"); s.className = "hg-soon"; s.textContent = t(T.soon); body.insertBefore(s, tt); el.appendChild(img); el.appendChild(body);
    }
    li.appendChild(el); grid.appendChild(li);
  });
})();
