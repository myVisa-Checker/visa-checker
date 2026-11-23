/* Host & Go landing page. Two entry roles only: Host and Traveller / Worker. */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var copy = {
    en: {themesTitle:"Choose your experience",t1:"Family life",t2:"Farms & agriculture",t3:"Gardening & nature",t4:"Guesthouses",t5:"Cultural & language exchange",t6:"Animals & pet-sitting",home:"Home",about:"About",how:"How It Works",safety:"Safety",faq:"FAQ",signin:"Sign In",headline:"Travel differently.<br>Experience more.",lead:"Connect with locals, share cultures, and make your journey unforgettable.",start:"Start your journey",join:"Join As...",sub:"Choose how you want to be part of the Host & Go community",host:"Host",hostDesc:"Welcome travellers and share your home",traveller:"Traveller / Worker",travellerDesc:"Discover places, share your skills and experience local life",secure:"Safe & Secure<br>Community",global:"Global Network<br>Worldwide",human:"Real Human<br>Connections",together:"<em>Together,</em> let’s explore the world.",tagline:"Host & Go — More than a trip, a human exchange.",joinNow:"Join Now →"},
    fr: {themesTitle:"Choisissez votre expérience",t1:"Vie en famille",t2:"Fermes et agriculture",t3:"Jardinage et nature",t4:"Maisons d'hôtes",t5:"Échange culturel et linguistique",t6:"Animaux et gardiennage",home:"Accueil",about:"À propos",how:"Comment ça marche",safety:"Sécurité",faq:"FAQ",signin:"Se connecter",headline:"Voyagez autrement.<br>Vivez plus.",lead:"Rencontrez les habitants, partagez les cultures et rendez votre voyage inoubliable.",start:"Commencer l’aventure",join:"Rejoindre comme…",sub:"Choisissez votre rôle dans la communauté Host & Go",host:"Hôte",hostDesc:"Accueillez des voyageurs et partagez votre quotidien",traveller:"Voyageur / Worker",travellerDesc:"Découvrez de nouveaux lieux, partagez vos compétences et vivez comme un local",secure:"Communauté<br>sûre et sécurisée",global:"Réseau mondial<br>international",human:"De vraies rencontres<br>humaines",together:"<em>Ensemble,</em> explorons le monde.",tagline:"Host & Go — Plus qu’un voyage, un échange humain.",joinNow:"Rejoindre →"},
    ar: {themesTitle:"اختر تجربتك",t1:"الحياة العائلية",t2:"المزارع والزراعة",t3:"البستنة والطبيعة",t4:"بيوت الضيافة",t5:"التبادل الثقافي واللغوي",t6:"الحيوانات ورعايتها",home:"الرئيسية",about:"من نحن",how:"كيف يعمل",safety:"السلامة",faq:"الأسئلة",signin:"تسجيل الدخول",headline:"سافر بطريقة مختلفة.<br>اكتشف المزيد.",lead:"تعرّف على السكان المحليين وتبادل الثقافات واجعل رحلتك لا تُنسى.",start:"ابدأ رحلتك",join:"انضم بصفتك…",sub:"اختر دورك في مجتمع Host & Go",host:"مضيف",hostDesc:"استقبل المسافرين وشاركهم حياتك اليومية",traveller:"مسافر / عامل",travellerDesc:"اكتشف أماكن جديدة وشارك مهاراتك وعِش التجربة المحلية",secure:"مجتمع آمن<br>وموثوق",global:"شبكة عالمية<br>حول العالم",human:"روابط إنسانية<br>حقيقية",together:"<em>معاً،</em> لنستكشف العالم.",tagline:"Host & Go — أكثر من رحلة، إنه تبادل إنساني.",joinNow:"انضم الآن ←"}
  }[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i]").forEach(function (el) { var key = el.getAttribute("data-i"); if (copy[key]) el.textContent = copy[key]; });
  ["headline","secure","global","human","together"].forEach(function (key) { var el = document.querySelector('[data-i="' + key + '"]'); if (el && copy[key]) el.innerHTML = copy[key]; });
  document.title = lang === "fr" ? "Host & Go — Voyage · Échange · Rencontre" : "Host & Go — Travel · Exchange · Belong";
  var role = new URLSearchParams(window.location.search).get("role");
  if (role === "host" || role === "traveler-worker") {
    var selected = document.querySelector(role === "host" ? '.hg-card[href="?role=host"]' : '.hg-card[href="?role=traveler-worker"]');
    if (selected) { selected.classList.add("is-selected"); selected.setAttribute("aria-current", "step"); }
  }
})();
