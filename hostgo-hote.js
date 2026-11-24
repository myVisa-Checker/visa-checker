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
      back: "← Retour", next: "Continuer →", eyebrow2: "ÉTAPE 5 · VOS COORDONNÉES", h2: "Vos coordonnées",
      privacyLead: "Seul votre prénom pourra être affiché sur votre futur profil public. Vos coordonnées ne seront jamais affichées.",
      firstName: "Votre prénom", email: "Votre adresse e-mail", city: "Votre ville", about: "Parlez-nous de votre lieu d’accueil (facultatif)",
      termsPre: "J’ai lu et j’accepte les", termsLink: "conditions générales", termsMid: "et la", privLink: "politique de confidentialité",
      marketing: "J’accepte de recevoir des e-mails sur les nouveautés de Host & Go (facultatif).", send: "Envoyer ma demande",
      fPriv: "Confidentialité", fTerms: "Conditions", doneH: "Merci !",
      doneOk: "Votre demande est enregistrée. Nous vous écrivons dès l’ouverture.",
      doneFb: "L’envoi direct n’est pas disponible : votre messagerie s’ouvre avec le message prêt. Vous pouvez aussi écrire à ",
      progress: "Étape {n} sur 5",
      eCountry: "Veuillez choisir votre pays.", eChecks: "Veuillez confirmer chaque déclaration pour continuer.",
      eFields: "Merci de renseigner votre prénom, une adresse e-mail valide et votre ville.", eTerms: "Vous devez accepter les conditions et la politique de confidentialité.",
      tipsT: "Quelques conseils :", min: "Écrivez au moins 20 caractères pour que les voyageurs puissent vous connaître.", chars: "caractères",
      eb_st2: "ÉTAPE 2 · VOTRE LIEU", h_st2: "Décrivez votre lieu d’accueil", eb_st3: "ÉTAPE 3 · L’AIDE SOUHAITÉE", h_st3: "Décrivez l’aide que vous souhaitez", eb_st4: "ÉTAPE 4 · VOUS", h_st4: "Présentez-vous",
      tips: { st2: ["Décrivez le logement et l’espace proposé : chambre, environnement, ce qui est inclus.", "Dites ce que vous aimez dans votre région et pourquoi les voyageurs l’aimeront aussi.", "Précisez ce que vous offrez : repas, connexion, autres."], st3: ["Expliquez ce que le voyageur fera : tâches, heures par jour, jours par semaine.", "Dites si vous ferez les tâches ensemble et quelles compétences vous aimeriez partager ou apprendre.", "Soyez clair sur ce qui n’est pas attendu."], st4: ["Parlez de vous, de votre famille ou des personnes impliquées.", "Indiquez les langues que vous parlez.", "Écrivez avec vos propres mots : soyez vous-même."] },
      decls: ["Je suis intéressé(e) par l’échange culturel et je propose des possibilités d’apprentissage.", "Je peux fournir gratuitement un hébergement et, si proposé, des repas, sans frais pour le voyageur.", "Je respecte les lois et obligations applicables dans mon pays.", "Je ne suis pas une agence.", "Je ne me suis pas déjà inscrit(e) comme hôte sur Host & Go.", "Je rédigerai mon profil avec mes propres mots."],
      countries: ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"]
    },
    en: {
      backHome: "Back to Host & Go", eyebrow: "BECOME A HOST & GO HOST", h1a: "Open your door.", h1b: "Share your world.",
      lead: "Welcome travellers, share your culture and create meaningful encounters.",
      countryQ: "In which country would you like to host?", pickCountry: "Choose your country", before: "BEFORE YOU CONTINUE", verify: "Check your details",
      accType: "Account type", accHost: "Host", yourCountry: "Your country", none: "Not selected", confirm: "I confirm that:",
      noAccount: "Accounts are not open yet: your request joins the waiting list and we will write to you as soon as it opens.",
      back: "← Back", next: "Continue →", eyebrow2: "STEP 5 · YOUR DETAILS", h2: "Your contact details",
      privacyLead: "Only your first name may be shown on your future public profile. Your contact details will never be displayed.",
      firstName: "Your first name", email: "Your e-mail address", city: "Your city", about: "Tell us about your place (optional)",
      termsPre: "I have read and accept the", termsLink: "terms and conditions", termsMid: "and the", privLink: "privacy policy",
      marketing: "I agree to receive e-mails about Host & Go news (optional).", send: "Send my request",
      fPriv: "Privacy", fTerms: "Terms", doneH: "Thank you!",
      doneOk: "Your request is in. We will write to you when it opens.",
      doneFb: "Direct sending is not available: your e-mail app opens with the message ready. You can also write to ",
      progress: "Step {n} of 5",
      eCountry: "Please choose your country.", eChecks: "Please confirm every statement to continue.",
      eFields: "Please enter your first name, a valid e-mail address and your city.", eTerms: "You must accept the terms and the privacy policy.",
      tipsT: "Some tips:", min: "Please write at least 20 characters so travellers can get to know you.", chars: "characters",
      eb_st2: "STEP 2 · YOUR PLACE", h_st2: "Describe your place", eb_st3: "STEP 3 · THE HELP YOU’D LIKE", h_st3: "Describe the kind of help you’d like", eb_st4: "STEP 4 · YOU", h_st4: "Introduce yourself",
      tips: { st2: ["Describe the accommodation and the space offered: room, surroundings, what is included.", "Say what you love about your area and why travellers will love it too.", "Be clear about what you offer: meals, internet, anything else."], st3: ["Explain what the traveller will do: tasks, hours per day, days per week.", "Say whether you will work side by side and which skills you would like to share or learn.", "Be clear about what is not expected."], st4: ["Tell us about yourself, your family or the people involved.", "Mention the languages you speak.", "Write in your own words: be yourself."] },
      decls: ["I am interested in cultural exchange and I offer learning opportunities.", "I can provide accommodation free of charge and, if offered, meals, at no cost to the traveller.", "I comply with the laws and obligations that apply in my country.", "I am not an agency.", "I have not already registered as a host on Host & Go.", "I will write my profile in my own words."],
      countries: ["Tunisia", "Morocco", "Algeria", "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Ireland", "Other"]
    },
    ar: {
      backHome: "العودة إلى Host & Go", eyebrow: "كن مضيفاً في Host & Go", h1a: "افتح بابك.", h1b: "شارك عالمك.",
      lead: "استقبل المسافرين وشاركهم ثقافتك وابنِ لقاءات غنية بالمعنى.",
      countryQ: "في أي بلد تودّ الاستضافة؟", pickCountry: "اختر بلدك", before: "قبل المتابعة", verify: "راجع معلوماتك",
      accType: "نوع الحساب", accHost: "مضيف", yourCountry: "بلدك", none: "لم يتم الاختيار", confirm: "أؤكد أنّ:",
      noAccount: "الحسابات لم تُفتح بعد: يُضاف طلبك إلى قائمة الانتظار وسنكتب إليك فور الافتتاح.",
      back: "رجوع →", next: "متابعة ←", eyebrow2: "الخطوة 5 · بيانات التواصل", h2: "بيانات التواصل",
      privacyLead: "يمكن عرض اسمك الأول فقط في ملفك العام مستقبلاً. لن تُعرض بيانات التواصل أبداً.",
      firstName: "اسمك الأول", email: "بريدك الإلكتروني", city: "مدينتك", about: "حدّثنا عن مكان الاستضافة (اختياري)",
      termsPre: "قرأت وأوافق على", termsLink: "الشروط العامة", termsMid: "و", privLink: "سياسة الخصوصية",
      marketing: "أوافق على تلقي رسائل بريدية عن مستجدات Host & Go (اختياري).", send: "أرسل طلبي",
      fPriv: "الخصوصية", fTerms: "الشروط", doneH: "شكراً!",
      doneOk: "تم تسجيل طلبك. سنكتب إليك عند الافتتاح.",
      doneFb: "الإرسال المباشر غير متاح: سيُفتح تطبيق البريد والرسالة جاهزة. يمكنك أيضاً الكتابة إلى ",
      progress: "الخطوة {n} من 5",
      eCountry: "يرجى اختيار بلدك.", eChecks: "يرجى تأكيد كل إقرار للمتابعة.",
      eFields: "يرجى إدخال اسمك الأول وبريد إلكتروني صالح ومدينتك.", eTerms: "يجب قبول الشروط وسياسة الخصوصية.",
      tipsT: "بعض النصائح:", min: "اكتب 20 حرفاً على الأقل ليتعرّف عليك المسافرون.", chars: "حرفاً",
      eb_st2: "الخطوة 2 · مكانك", h_st2: "صِف مكان الاستضافة", eb_st3: "الخطوة 3 · المساعدة المطلوبة", h_st3: "صِف المساعدة التي تريدها", eb_st4: "الخطوة 4 · أنت", h_st4: "قدّم نفسك",
      tips: { st2: ["صِف السكن والمساحة المعروضة: الغرفة والمحيط وما هو مشمول.", "قل ما تحبه في منطقتك ولماذا سيحبها المسافرون أيضاً.", "وضّح ما تقدّمه: وجبات أو إنترنت أو غير ذلك."], st3: ["اشرح ما سيقوم به المسافر: المهام وساعات العمل يومياً وأيامه أسبوعياً.", "قل إن كنتما ستعملان معاً وما المهارات التي تودّ تبادلها أو تعلّمها.", "وضّح ما لا يُنتظر من المسافر."], st4: ["حدّثنا عن نفسك وعن عائلتك أو الأشخاص المعنيين.", "اذكر اللغات التي تتحدثها.", "اكتب بكلماتك الخاصة: كن على طبيعتك."] },
      decls: ["أهتم بالتبادل الثقافي وأوفّر فرصاً للتعلّم.", "يمكنني توفير الإقامة مجاناً، والوجبات إن عُرضت، دون أي تكلفة على المسافر.", "ألتزم بالقوانين والالتزامات المعمول بها في بلدي.", "لست وكالة.", "لم أسجّل سابقاً كمضيف على Host & Go.", "سأكتب ملفي الشخصي بكلماتي الخاصة."],
      countries: ["تونس", "المغرب", "الجزائر", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "البرتغال", "بلجيكا", "هولندا", "إيرلندا", "أخرى"]
    }
  }[lang];
  var COUNTRIES_FR = ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"];
  function $(id) { return document.getElementById(id); }
  var IDS = ["st1", "st2", "st3", "st4", "st5"], done = $("done"), country = $("country"), MIN = 20, cur = 0;
  if (!done || !country || IDS.some(function (i) { return !$(i); })) return;

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
  ["st2", "st3", "st4"].forEach(function (id) {
    var ul = $("tl-" + id); T.tips[id].forEach(function (x) { var li = document.createElement("li"); li.textContent = x; ul.appendChild(li); });
    var ta = $("ta-" + id), ct = $("ct-" + id);
    function upd() { ct.textContent = ta.value.length + " / " + ta.maxLength + " " + T.chars; } ta.addEventListener("input", upd); upd();
  });
  function sum() { var o = country.options[country.selectedIndex]; $("countrySummary").textContent = country.value ? o.textContent : T.none; }
  country.addEventListener("change", sum); sum();

  var bars = [].slice.call(document.querySelectorAll("#hgh-progress span"));
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(n, focus) {
    cur = n;
    IDS.forEach(function (id, i) { $(id).hidden = i !== n; });
    done.hidden = n !== 5;
    bars.forEach(function (b, i) { b.className = i <= Math.min(n, 4) ? "on" : ""; });
    $("hgh-progress").setAttribute("aria-label", T.progress.replace("{n}", Math.min(n, 4) + 1));
    $("hgh-progress").hidden = n === 5;
    if (focus === false) return;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var h = n === 5 ? done : $("h-" + IDS[n]); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  show(0, false);
  function err(id, msg, el) { $(id).textContent = msg; if (el) el.focus(); return false; }

  var validators = [
    function () {
      if (!country.value) return err("error1", T.eCountry, country);
      var miss = [].slice.call(document.querySelectorAll(".required-check")).filter(function (c) { return !c.checked; })[0];
      if (miss) return err("error1", T.eChecks, miss);
      $("error1").textContent = ""; return true;
    }
  ];
  ["st2", "st3", "st4"].forEach(function (id) {
    validators.push(function () { var ta = $("ta-" + id); if (ta.value.trim().length < MIN) return err("err-" + id, T.min, ta); $("err-" + id).textContent = ""; return true; });
  });
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-go") === "prev") { if (cur > 0) show(cur - 1); return; }
      if (cur < 4 && validators[cur]()) show(cur + 1);
    });
  });

  function fallback(msg, name, mail) {
    $("doneMsg").textContent = T.doneFb + TO + "."; show(5);
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent("[Host & Go] Inscription hôte") + "&body=" + encodeURIComponent(msg + "\n\n--\n" + name + "\n" + mail);
  }
  $("finish").addEventListener("click", function () {
    var name = $("firstName").value.trim(), mail = $("email").value.trim(), city = $("city").value.trim(), okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    if (!name || !city || !okMail) return err("error2", T.eFields, !name ? $("firstName") : !okMail ? $("email") : $("city"));
    if (!$("terms").checked) return err("error2", T.eTerms, $("terms"));
    $("error2").textContent = "";
    var msg = ["[Host & Go — inscription hôte]", "Pays d'accueil : " + country.value, "Ville : " + city, "Déclarations : 6/6 confirmées", "E-mails d'information : " + ($("marketing").checked ? "oui" : "non"), "Langue de la page : " + lang, "",
      "LIEU D'ACCUEIL :", $("ta-st2").value.trim(), "", "AIDE SOUHAITÉE :", $("ta-st3").value.trim(), "", "PRÉSENTATION :", $("ta-st4").value.trim()].join("\n");
    var btn = $("finish"); btn.disabled = true;
    var ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name, email: mail, subject: SUBJECT, message: msg, consent: true, hp: $("hp").value || "" }), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (sent) {
        if (timer) clearTimeout(timer); btn.disabled = false;
        if (sent) { $("doneMsg").textContent = T.doneOk; show(5); } else fallback(msg, name, mail);
      });
  });
})();
