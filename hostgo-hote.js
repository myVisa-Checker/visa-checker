/* Host & Go : demande d'inscription hôte, en deux étapes (FR/EN/AR).
   Pas de compte ni de mot de passe : la demande part par e-mail (route /contact du Worker) et rejoint la liste d'attente. Script externe (CSP). */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/contact", TO = "contact@checkmyvisa.org", SUBJECT = "Partenariat / Autre demande";
  var T = {
    fr: {
      backHome: "Retour à Host & Go", eyebrow: "DEVENEZ HÔTE HOST & GO", h1a: "Ouvrez votre porte.", h1b: "Partagez votre monde.",
      lead: "Accueillez des voyageurs, partagez votre culture et créez des rencontres enrichissantes.",
      countryQ: "Dans quel pays souhaitez-vous accueillir ?", pickCountry: "Choisissez votre pays", before: "AVANT DE CONTINUER", verify: "Vérifiez vos informations",
      accType: "Type de compte", accHost: "Hôte", yourCountry: "Votre pays", none: "Non sélectionné", confirm: "Je confirme que :",
      noAccount: "Les comptes ne sont pas encore ouverts : votre demande rejoint la liste d’attente et nous vous écrivons dès l’ouverture.",
      back: "← Retour", next: "Continuer →", eyebrow2: "VOTRE DEMANDE", h2: "Vos coordonnées",
      privacyLead: "Seul votre prénom pourra être affiché sur votre futur profil public. Vos coordonnées ne seront jamais affichées.",
      firstName: "Votre prénom", email: "Votre adresse e-mail", city: "Votre ville", about: "Parlez-nous de votre lieu d’accueil (facultatif)",
      termsPre: "J’ai lu et j’accepte les", termsLink: "conditions générales", termsMid: "et la", privLink: "politique de confidentialité",
      marketing: "J’accepte de recevoir des e-mails sur les nouveautés de Host & Go (facultatif).", send: "Envoyer ma demande",
      fPriv: "Confidentialité", fTerms: "Conditions", doneH: "Merci !",
      doneOk: "Votre demande est enregistrée. Nous vous écrivons dès l’ouverture.",
      doneFb: "L’envoi direct n’est pas disponible : votre messagerie s’ouvre avec le message prêt. Vous pouvez aussi écrire à ",
      progress: "Étape {n} sur 2",
      eCountry: "Veuillez choisir votre pays.", eChecks: "Veuillez confirmer chaque déclaration pour continuer.",
      eFields: "Merci de renseigner votre prénom, une adresse e-mail valide et votre ville.", eTerms: "Vous devez accepter les conditions et la politique de confidentialité.",
      decls: ["Je suis intéressé(e) par l’échange culturel et je propose des possibilités d’apprentissage.", "Je peux fournir gratuitement un hébergement et, si proposé, des repas, sans frais pour le voyageur.", "Je respecte les lois et obligations applicables dans mon pays.", "Je ne suis pas une agence.", "Je ne me suis pas déjà inscrit(e) comme hôte sur Host & Go.", "Je rédigerai mon profil avec mes propres mots."],
      countries: ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"]
    },
    en: {
      backHome: "Back to Host & Go", eyebrow: "BECOME A HOST & GO HOST", h1a: "Open your door.", h1b: "Share your world.",
      lead: "Welcome travellers, share your culture and create meaningful encounters.",
      countryQ: "In which country would you like to host?", pickCountry: "Choose your country", before: "BEFORE YOU CONTINUE", verify: "Check your details",
      accType: "Account type", accHost: "Host", yourCountry: "Your country", none: "Not selected", confirm: "I confirm that:",
      noAccount: "Accounts are not open yet: your request joins the waiting list and we will write to you as soon as it opens.",
      back: "← Back", next: "Continue →", eyebrow2: "YOUR REQUEST", h2: "Your contact details",
      privacyLead: "Only your first name may be shown on your future public profile. Your contact details will never be displayed.",
      firstName: "Your first name", email: "Your e-mail address", city: "Your city", about: "Tell us about your place (optional)",
      termsPre: "I have read and accept the", termsLink: "terms and conditions", termsMid: "and the", privLink: "privacy policy",
      marketing: "I agree to receive e-mails about Host & Go news (optional).", send: "Send my request",
      fPriv: "Privacy", fTerms: "Terms", doneH: "Thank you!",
      doneOk: "Your request is in. We will write to you when it opens.",
      doneFb: "Direct sending is not available: your e-mail app opens with the message ready. You can also write to ",
      progress: "Step {n} of 2",
      eCountry: "Please choose your country.", eChecks: "Please confirm every statement to continue.",
      eFields: "Please enter your first name, a valid e-mail address and your city.", eTerms: "You must accept the terms and the privacy policy.",
      decls: ["I am interested in cultural exchange and I offer learning opportunities.", "I can provide accommodation free of charge and, if offered, meals, at no cost to the traveller.", "I comply with the laws and obligations that apply in my country.", "I am not an agency.", "I have not already registered as a host on Host & Go.", "I will write my profile in my own words."],
      countries: ["Tunisia", "Morocco", "Algeria", "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Ireland", "Other"]
    },
    ar: {
      backHome: "العودة إلى Host & Go", eyebrow: "كن مضيفاً في Host & Go", h1a: "افتح بابك.", h1b: "شارك عالمك.",
      lead: "استقبل المسافرين وشاركهم ثقافتك وابنِ لقاءات غنية بالمعنى.",
      countryQ: "في أي بلد تودّ الاستضافة؟", pickCountry: "اختر بلدك", before: "قبل المتابعة", verify: "راجع معلوماتك",
      accType: "نوع الحساب", accHost: "مضيف", yourCountry: "بلدك", none: "لم يتم الاختيار", confirm: "أؤكد أنّ:",
      noAccount: "الحسابات لم تُفتح بعد: يُضاف طلبك إلى قائمة الانتظار وسنكتب إليك فور الافتتاح.",
      back: "رجوع →", next: "متابعة ←", eyebrow2: "طلبك", h2: "بيانات التواصل",
      privacyLead: "يمكن عرض اسمك الأول فقط في ملفك العام مستقبلاً. لن تُعرض بيانات التواصل أبداً.",
      firstName: "اسمك الأول", email: "بريدك الإلكتروني", city: "مدينتك", about: "حدّثنا عن مكان الاستضافة (اختياري)",
      termsPre: "قرأت وأوافق على", termsLink: "الشروط العامة", termsMid: "و", privLink: "سياسة الخصوصية",
      marketing: "أوافق على تلقي رسائل بريدية عن مستجدات Host & Go (اختياري).", send: "أرسل طلبي",
      fPriv: "الخصوصية", fTerms: "الشروط", doneH: "شكراً!",
      doneOk: "تم تسجيل طلبك. سنكتب إليك عند الافتتاح.",
      doneFb: "الإرسال المباشر غير متاح: سيُفتح تطبيق البريد والرسالة جاهزة. يمكنك أيضاً الكتابة إلى ",
      progress: "الخطوة {n} من 2",
      eCountry: "يرجى اختيار بلدك.", eChecks: "يرجى تأكيد كل إقرار للمتابعة.",
      eFields: "يرجى إدخال اسمك الأول وبريد إلكتروني صالح ومدينتك.", eTerms: "يجب قبول الشروط وسياسة الخصوصية.",
      decls: ["أهتم بالتبادل الثقافي وأوفّر فرصاً للتعلّم.", "يمكنني توفير الإقامة مجاناً، والوجبات إن عُرضت، دون أي تكلفة على المسافر.", "ألتزم بالقوانين والالتزامات المعمول بها في بلدي.", "لست وكالة.", "لم أسجّل سابقاً كمضيف على Host & Go.", "سأكتب ملفي الشخصي بكلماتي الخاصة."],
      countries: ["تونس", "المغرب", "الجزائر", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "البرتغال", "بلجيكا", "هولندا", "إيرلندا", "أخرى"]
    }
  }[lang];
  var COUNTRIES_FR = ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"];
  function $(id) { return document.getElementById(id); }
  var step1 = $("step1"), step2 = $("step2"), done = $("done"), country = $("country");
  if (!step1 || !step2 || !done || !country) return;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i]").forEach(function (el) { var k = el.getAttribute("data-i"); if (T[k] != null) el.textContent = T[k]; });
  document.title = "Host & Go — " + ({ fr: "Devenir hôte", en: "Become a host", ar: "كن مضيفاً" }[lang]);

  var ph = document.createElement("option"); ph.value = ""; ph.textContent = T.pickCountry; country.appendChild(ph);
  T.countries.forEach(function (n, i) { var o = document.createElement("option"); o.value = COUNTRIES_FR[i]; o.textContent = n; country.appendChild(o); });
  var decls = $("decls");
  T.decls.forEach(function (txt) {
    var l = document.createElement("label"), c = document.createElement("input"), s = document.createElement("span");
    c.type = "checkbox"; c.className = "required-check"; s.textContent = txt; l.appendChild(c); l.appendChild(s); decls.appendChild(l);
  });
  function sum() { var o = country.options[country.selectedIndex]; $("countrySummary").textContent = country.value ? o.textContent : T.none; }
  country.addEventListener("change", sum); sum();

  var bars = [].slice.call(document.querySelectorAll("#hgh-progress span"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(n, focus) {
    step1.hidden = n !== 1; step2.hidden = n !== 2; done.hidden = n !== 3;
    bars.forEach(function (b, i) { b.className = i < Math.min(n, 2) ? "on" : ""; });
    $("hgh-progress").setAttribute("aria-label", T.progress.replace("{n}", Math.min(n, 2)));
    if (n === 3) $("hgh-progress").hidden = true;
    if (focus !== false) window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    if (focus === false) return;
    var h = n === 1 ? $("h-step1") : n === 2 ? $("h-step2") : done; if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  show(1, false);
  function err(id, msg, focusEl) { var e = $(id); e.textContent = msg; if (focusEl) focusEl.focus(); }

  $("continue1").addEventListener("click", function () {
    var checks = [].slice.call(document.querySelectorAll(".required-check"));
    if (!country.value) return err("error1", T.eCountry, country);
    var miss = checks.filter(function (c) { return !c.checked; })[0];
    if (miss) return err("error1", T.eChecks, miss);
    $("error1").textContent = ""; show(2);
  });
  $("back2").addEventListener("click", function () { $("error2").textContent = ""; show(1); });

  function fallback(msg, name, mail) {
    $("doneMsg").textContent = T.doneFb + TO + "."; show(3);
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent("[Host & Go] Inscription hôte") + "&body=" + encodeURIComponent(msg + "\n\n--\n" + name + "\n" + mail);
  }
  $("finish").addEventListener("click", function () {
    var name = $("firstName").value.trim(), mail = $("email").value.trim(), city = $("city").value.trim(), about = $("about").value.trim();
    if (!name || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return err("error2", T.eFields, !name ? $("firstName") : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? $("email") : $("city"));
    if (!$("terms").checked) return err("error2", T.eTerms, $("terms"));
    $("error2").textContent = "";
    var msg = ["[Host & Go — inscription hôte]", "Pays d'accueil : " + country.value, "Ville : " + city, "Déclarations : 6/6 confirmées", "E-mails d'information : " + ($("marketing").checked ? "oui" : "non"), "Langue de la page : " + lang, "", about || "(pas de description)"].join("\n");
    var btn = $("finish"); btn.disabled = true;
    var ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name, email: mail, subject: SUBJECT, message: msg, consent: true, hp: $("hp").value || "" }), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (sent) {
        if (timer) clearTimeout(timer); btn.disabled = false;
        if (sent) { $("doneMsg").textContent = T.doneOk; show(3); } else fallback(msg, name, mail);
      });
  });
})();
