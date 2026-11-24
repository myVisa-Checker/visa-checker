/* Host & Go : page « Join As… ». Deux rôles (Hôte, Voyageur / Worker) puis six thèmes d'échange.
   Aucun parcours n'est encore ouvert : un choix se met en surbrillance et la page l'annonce, sans rien envoyer. Script externe (CSP). */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var IX = { fr: 0, en: 1, ar: 2 }[lang];
  function t(a) { return a[IX]; }
  var copy = {
    en: {themesTitle:"Choose your experience",t1:"Family life",t2:"Farms & agriculture",t3:"Gardening & nature",t4:"Guesthouses",t5:"Cultural & language exchange",t6:"Animals & pet-sitting",home:"Home",about:"About",how:"How It Works",safety:"Safety",faq:"FAQ",signin:"Sign In",headline:"Travel differently.<br>Experience more.",lead:"Connect with locals, share cultures, and make your journey unforgettable.",start:"Start your journey",rolesLabel:"I am a…",join:"Join As...",sub:"Choose how you want to be part of the Host & Go community",host:"Host",hostDesc:"Welcome travellers and share your home",traveller:"Traveller / Worker",travellerDesc:"Discover places, share your skills and experience local life",secure:"Safe & Secure<br>Community",global:"Global Network<br>Worldwide",human:"Real Human<br>Connections",together:"<em>Together,</em> let’s explore the world.",tagline:"Host & Go — More than a trip, a human exchange.",joinNow:"Join Now →"},
    fr: {themesTitle:"Choisissez votre expérience",t1:"Vie en famille",t2:"Fermes et agriculture",t3:"Jardinage et nature",t4:"Maisons d'hôtes",t5:"Échange culturel et linguistique",t6:"Animaux et gardiennage",home:"Accueil",about:"À propos",how:"Comment ça marche",safety:"Sécurité",faq:"FAQ",signin:"Se connecter",headline:"Voyagez autrement.<br>Vivez plus.",lead:"Rencontrez les habitants, partagez les cultures et rendez votre voyage inoubliable.",start:"Commencer l’aventure",rolesLabel:"Je suis…",join:"Rejoindre comme…",sub:"Choisissez votre rôle dans la communauté Host & Go",host:"Hôte",hostDesc:"Accueillez des voyageurs et partagez votre quotidien",traveller:"Voyageur / Worker",travellerDesc:"Découvrez de nouveaux lieux, partagez vos compétences et vivez comme un local",secure:"Communauté<br>sûre et sécurisée",global:"Réseau mondial<br>international",human:"De vraies rencontres<br>humaines",together:"<em>Ensemble,</em> explorons le monde.",tagline:"Host & Go — Plus qu’un voyage, un échange humain.",joinNow:"Rejoindre →"},
    ar: {themesTitle:"اختر تجربتك",t1:"الحياة العائلية",t2:"المزارع والزراعة",t3:"البستنة والطبيعة",t4:"بيوت الضيافة",t5:"التبادل الثقافي واللغوي",t6:"الحيوانات ورعايتها",home:"الرئيسية",about:"من نحن",how:"كيف يعمل",safety:"السلامة",faq:"الأسئلة",signin:"تسجيل الدخول",headline:"سافر بطريقة مختلفة.<br>اكتشف المزيد.",lead:"تعرّف على السكان المحليين وتبادل الثقافات واجعل رحلتك لا تُنسى.",start:"ابدأ رحلتك",rolesLabel:"أنا…",join:"انضم بصفتك…",sub:"اختر دورك في مجتمع Host & Go",host:"مضيف",hostDesc:"استقبل المسافرين وشاركهم حياتك اليومية",traveller:"مسافر / عامل",travellerDesc:"اكتشف أماكن جديدة وشارك مهاراتك وعِش التجربة المحلية",secure:"مجتمع آمن<br>وموثوق",global:"شبكة عالمية<br>حول العالم",human:"روابط إنسانية<br>حقيقية",together:"<em>معاً،</em> لنستكشف العالم.",tagline:"Host & Go — أكثر من رحلة، إنه تبادل إنساني.",joinNow:"انضم الآن ←"}
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
  document.querySelectorAll("[data-i]").forEach(function (el) { var k = el.getAttribute("data-i"); if (copy[k] != null) el.textContent = copy[k]; });
  ["headline", "secure", "global", "human", "together"].forEach(function (k) { var el = document.querySelector('[data-i="' + k + '"]'); if (el && copy[k]) el.innerHTML = copy[k]; });
  document.title = lang === "fr" ? "Host & Go — Voyage · Échange · Rencontre" : lang === "ar" ? "Host & Go — سفر · تبادل · انتماء" : "Host & Go — Travel · Exchange · Belong";

  /* Rôles */
  var ROLE_ICON = { host: "home", "traveler-worker": "plane" };
  var roleBtns = [].slice.call(document.querySelectorAll(".hg-role"));
  roleBtns.forEach(function (b) { b.querySelector(".hg-role-ico").innerHTML = svg(ROLE_ICON[b.getAttribute("data-role")]); });

  /* Thèmes */
  var grid = $("hg-grid");
  THEMES.forEach(function (th) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "hg-card t-" + th.id; b.setAttribute("data-theme", th.id); b.setAttribute("aria-pressed", "false");
    var m = document.createElement("span"); m.className = "hg-media"; m.setAttribute("aria-hidden", "true"); m.innerHTML = svg(th.icon);
    var c = document.createElement("span"); c.className = "hg-card-content";
    var s = document.createElement("strong"); s.textContent = t(th.t);
    var d = document.createElement("small"); d.textContent = t(th.d);
    var a = document.createElement("span"); a.className = "hg-arrow"; a.setAttribute("aria-hidden", "true"); a.textContent = lang === "ar" ? "←" : "→";
    c.appendChild(s); c.appendChild(d); b.appendChild(m); b.appendChild(c); b.appendChild(a); grid.appendChild(b);
  });
  var themeBtns = [].slice.call(grid.querySelectorAll(".hg-card"));

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


  /* ---------- Liste d'attente : envoi via la route /contact existante du Worker (aucune donnée stockée ici) ---------- */
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/contact", TO = "contact@checkmyvisa.org", SUBJECT = "Partenariat / Autre demande";
  var F = {
    h: ["Rejoindre la liste d’attente", "Join the waiting list", "انضم إلى قائمة الانتظار"],
    intro: ["Ce parcours n’est pas encore ouvert. Laissez vos coordonnées : nous vous écrivons dès son ouverture.", "This journey is not open yet. Leave your details and we will write to you as soon as it opens.", "هذا المسار لم يُفتح بعد. اترك بياناتك وسنكتب إليك فور افتتاحه."],
    name: ["Nom et prénom", "Full name", "الاسم الكامل"], mail: ["E-mail", "E-mail", "البريد الإلكتروني"],
    country: ["Pays", "Country", "البلد"], city: ["Ville", "City", "المدينة"],
    msg: ["Parlez-nous de vous (facultatif)", "Tell us about yourself (optional)", "حدّثنا عن نفسك (اختياري)"],
    consent: ["J’accepte que CheckMyVisa me contacte au sujet de Host & Go.", "I agree that CheckMyVisa may contact me about Host & Go.", "أوافق على أن يتواصل معي CheckMyVisa بخصوص Host & Go."],
    send: ["Envoyer ma demande", "Send my request", "أرسل طلبي"],
    pickRole: ["Choisissez d’abord votre rôle : Hôte ou Voyageur / Worker.", "Please choose your role first: Host or Traveller / Worker.", "اختر دورك أولاً: مضيف أو مسافر / عامل."],
    bad: ["Merci de remplir votre nom, une adresse e-mail valide, votre pays et votre ville.", "Please enter your name, a valid e-mail address, your country and your city.", "يرجى إدخال اسمك وبريد إلكتروني صالح وبلدك ومدينتك."],
    rgpd: ["Merci d’accepter d’être contacté.", "Please agree to be contacted.", "يرجى الموافقة على التواصل معك."],
    ok: ["Merci ! Votre demande est enregistrée. Nous vous écrivons dès l’ouverture.", "Thank you! Your request is in. We will write to you when it opens.", "شكراً! تم تسجيل طلبك. سنكتب إليك عند الافتتاح."],
    fb: ["L’envoi direct n’est pas disponible : votre messagerie s’ouvre avec le message prêt. Vous pouvez aussi écrire à ", "Direct sending is not available: your e-mail app opens with the message ready. You can also write to ", "الإرسال المباشر غير متاح: سيُفتح تطبيق البريد والرسالة جاهزة. يمكنك أيضاً الكتابة إلى "]
  };
  var ROLE_FR = { host: "Hôte", "traveler-worker": "Voyageur / Worker" };
  var form = $("hg-form");
  var FIELDS = { "hg-form-h": "h", "hg-form-intro": "intro", "hl-name": "name", "hl-mail": "mail", "hl-country": "country", "hl-city": "city", "hl-msg": "msg", "hl-consent": "consent", "hf-send": "send" };
  Object.keys(FIELDS).forEach(function (id) { $(id).textContent = t(F[FIELDS[id]]); });
  function selected(list, attr) { var r = list.filter(function (b) { return b.getAttribute("aria-pressed") === "true"; })[0]; return r ? r.getAttribute(attr) : ""; }
  var HOST_CTA = ["Devenir hôte : commencer mon inscription →", "Become a host: start my sign-up →", "كن مضيفاً: ابدأ تسجيلي ←"];
  $("hg-host-link").textContent = t(HOST_CTA);
  function syncForm() { var r = selected(roleBtns, "data-role"); $("hg-host-cta").hidden = r !== "host"; form.hidden = !r || r === "host"; }
  var baseStatus = status;
  status = function () { baseStatus(); syncForm(); };
  syncForm();
  function themeFr(id) { var r = THEMES.filter(function (x) { return x.id === id; })[0]; return r ? r.t[0] : ""; }
  function fail(msg) { var e = $("hf-err"); e.textContent = msg; e.hidden = false; }
  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var ok = $("hf-ok"); ok.hidden = true; $("hf-err").hidden = true;
    var role = selected(roleBtns, "data-role"), theme = selected(themeBtns, "data-theme");
    var name = $("hf-name").value.trim(), mail = $("hf-mail").value.trim(), country = $("hf-country").value.trim(), city = $("hf-city").value.trim(), note = $("hf-msg").value.trim();
    if (!role) return fail(t(F.pickRole));
    if (!name || !country || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return fail(t(F.bad));
    if (!$("hf-consent").checked) return fail(t(F.rgpd));
    var msg = ["[Host & Go — liste d'attente]", "Rôle : " + ROLE_FR[role], "Thème : " + (themeFr(theme) || "non précisé"), "Pays : " + country, "Ville : " + city, "Langue de la page : " + lang, "", note || "(pas de message)"].join("\n");
    var btn = $("hf-send"); btn.disabled = true;
    var ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name, email: mail, subject: SUBJECT, message: msg, consent: true, hp: $("hf-hp").value || "" }), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (sent) {
        if (timer) clearTimeout(timer); btn.disabled = false;
        if (sent) { form.reset(); ok.textContent = t(F.ok); ok.hidden = false; return; }
        ok.textContent = t(F.fb) + TO + "."; ok.hidden = false;
        window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent("[Host & Go] " + ROLE_FR[role]) + "&body=" + encodeURIComponent(msg + "\n\n--\n" + name + "\n" + mail);
      });
  });

  var role = new URLSearchParams(window.location.search).get("role");
  roleBtns.forEach(function (b) { if (b.getAttribute("data-role") === role) pick(roleBtns, b); });
})();
