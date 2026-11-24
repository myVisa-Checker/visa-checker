/* Host & Go : parcours voyageur / worker (FR/EN/AR) — formules, création de compte (liste d'attente), étapes à venir.
   Pas de mot de passe ni de paiement pour l'instant : la demande part par e-mail (route /contact du Worker). Script externe (CSP). */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/contact", TO = "contact@checkmyvisa.org", SUBJECT = "Partenariat / Autre demande";
  var PRICES = { solo: 100, couple: 180 }; /* dinars par an : exemples, à confirmer */
  var T = {
    fr: {
      backHome: "Retour à Host & Go", back: "← Retour", join: "Rejoindre →", send: "Envoyer ma demande", fPriv: "Confidentialité", fTerms: "Conditions",
      eb_pl: "VOYAGEUR / WORKER", h_pl: "Choisissez votre formule", lead_pl: "Rejoignez la communauté Host & Go pour échanger avec des hôtes du monde entier.", solo: "Solo", couple: "Couple / amis",
      soloName: "Voyageur solo", coupleName: "Couple / amis", soloFor: "Si vous voyagez seul(e).", coupleFor: "Si vous voyagez à deux.", perYear: "DT par an", featH: "Inclus dans votre abonnement",
      feats: ["Contactez des hôtes et des projets d’accueil", "Échanges illimités avec les hôtes et les voyageurs", "Profils d’hôtes examinés par notre équipe avant publication", "Pratiquez une nouvelle langue avec les autres membres", "Assistance par une équipe humaine"],
      payLater: "Aperçu : le paiement n’est pas encore ouvert. Les tarifs affichés sont indicatifs.",
      eb_ac: "CRÉER VOTRE COMPTE", h_ac: "Créez votre compte voyageur", lead_ac: "Les comptes ne sont pas encore ouverts : votre place est réservée sur la liste d’attente.", chosen: "Formule choisie : {p} — {n} DT par an (indicatif)",
      firstName: "Votre prénom", email: "Votre adresse e-mail", country: "Votre pays", city: "Votre ville",
      termsPre: "J’ai lu et j’accepte les", termsLink: "conditions générales", termsMid: "et la", privLink: "politique de confidentialité",
      noAccount: "Aucun mot de passe et aucun paiement ne sont demandés pour l’instant. Nous vous écrivons dès l’ouverture.",
      oneRole: "Un compte Hôte et un compte Voyageur sont distincts : utilisez une adresse e-mail différente pour chaque rôle.",
      eFields: "Merci de renseigner votre prénom, une adresse e-mail valide, votre pays et votre ville.", eTerms: "Vous devez accepter les conditions et la politique de confidentialité.",
      roleNotice: "Cet e-mail est déjà enregistré ici comme compte Hôte. Un compte Hôte ne peut pas servir de compte Voyageur : utilisez une autre adresse e-mail pour ce rôle. Votre demande a tout de même été envoyée.",
      doneH: "Merci !", doneOk: "Votre demande est enregistrée. Nous vous écrivons dès l’ouverture.", doneFb: "L’envoi direct n’est pas disponible : votre messagerie s’ouvre avec le message prêt. Vous pouvez aussi écrire à ",
      dashH: "Ce qui vous attend", dashLead: "Voici les 5 étapes pour devenir membre vérifié.", dashDone: "1 / 5 étapes", soon: "Bientôt",
      dash: [["Créer votre compte", "Votre demande est enregistrée."], ["Activer votre abonnement", "Choisissez et réglez votre formule pour contacter les hôtes."], ["Compléter votre profil", "Présentez-vous : votre histoire, vos photos, vos compétences et vos projets de voyage."], ["Vérifier votre e-mail", "Confirmez votre adresse pour recevoir les messages et les alertes de sécurité."], ["Faire vérifier votre profil", "Notre équipe examine chaque profil pour garder la communauté sûre et fiable."]],
      progress: "Étape {n} sur {t}"
    },
    en: {
      backHome: "Back to Host & Go", back: "← Back", join: "Join →", send: "Send my request", fPriv: "Privacy", fTerms: "Terms",
      eb_pl: "TRAVELLER / WORKER", h_pl: "Choose your plan", lead_pl: "Join the Host & Go community and connect with hosts around the world.", solo: "Solo", couple: "Couple / friends",
      soloName: "Solo traveller", coupleName: "Couple / friends", soloFor: "If you travel on your own.", coupleFor: "If you travel as a pair.", perYear: "TND per year", featH: "Included in your membership",
      feats: ["Contact hosts and hosting projects", "Unlimited exchanges with hosts and travellers", "Host profiles reviewed by our team before listing", "Practise a new language with other members", "Support from a human team"],
      payLater: "Preview: payment is not open yet. The prices shown are indicative.",
      eb_ac: "CREATE YOUR ACCOUNT", h_ac: "Create your traveller account", lead_ac: "Accounts are not open yet: your place is reserved on the waiting list.", chosen: "Chosen plan: {p} — {n} TND per year (indicative)",
      firstName: "Your first name", email: "Your e-mail address", country: "Your country", city: "Your city",
      termsPre: "I have read and accept the", termsLink: "terms and conditions", termsMid: "and the", privLink: "privacy policy",
      noAccount: "No password and no payment are requested for now. We will write to you as soon as it opens.",
      oneRole: "A Host account and a Traveller account are separate: use a different e-mail address for each role.",
      eFields: "Please enter your first name, a valid e-mail address, your country and your city.", eTerms: "You must accept the terms and the privacy policy.",
      roleNotice: "This e-mail is already registered here as a Host account. A Host account cannot be used as a Traveller account: please use another e-mail address for this role. Your request has still been sent.",
      doneH: "Thank you!", doneOk: "Your request is in. We will write to you when it opens.", doneFb: "Direct sending is not available: your e-mail app opens with the message ready. You can also write to ",
      dashH: "What is next", dashLead: "Here are the 5 steps to become a verified member.", dashDone: "1 / 5 steps", soon: "Soon",
      dash: [["Create your account", "Your request is in."], ["Activate your membership", "Choose and pay for your plan to contact hosts."], ["Complete your profile", "Introduce yourself: your story, photos, skills and travel plans."], ["Verify your e-mail", "Confirm your address to receive messages and security alerts."], ["Get your profile verified", "Our team reviews every profile to keep the community safe and trustworthy."]],
      progress: "Step {n} of {t}"
    },
    ar: {
      backHome: "العودة إلى Host & Go", back: "رجوع →", join: "← انضم", send: "أرسل طلبي", fPriv: "الخصوصية", fTerms: "الشروط",
      eb_pl: "مسافر / عامل", h_pl: "اختر اشتراكك", lead_pl: "انضم إلى مجتمع Host & Go وتواصل مع مضيفين حول العالم.", solo: "فردي", couple: "زوجان / أصدقاء",
      soloName: "مسافر فردي", coupleName: "زوجان / أصدقاء", soloFor: "إن كنت تسافر وحدك.", coupleFor: "إن كنتما تسافران معاً.", perYear: "دينار في السنة", featH: "ما يشمله اشتراكك",
      feats: ["تواصل مع المضيفين ومشاريع الاستضافة", "تبادل غير محدود مع المضيفين والمسافرين", "ملفات المضيفين يراجعها فريقنا قبل النشر", "تدرّب على لغة جديدة مع الأعضاء الآخرين", "مساندة من فريق بشري"],
      payLater: "معاينة: الدفع غير متاح بعد. الأسعار المعروضة تقريبية.",
      eb_ac: "أنشئ حسابك", h_ac: "أنشئ حساب المسافر", lead_ac: "الحسابات لم تُفتح بعد: مكانك محجوز في قائمة الانتظار.", chosen: "الاشتراك المختار: {p} — {n} دينار في السنة (تقريبي)",
      firstName: "اسمك الأول", email: "بريدك الإلكتروني", country: "بلدك", city: "مدينتك",
      termsPre: "قرأت وأوافق على", termsLink: "الشروط العامة", termsMid: "و", privLink: "سياسة الخصوصية",
      noAccount: "لا نطلب كلمة مرور ولا دفعاً في الوقت الحالي. سنكتب إليك فور الافتتاح.",
      oneRole: "حساب المضيف وحساب المسافر منفصلان: استخدم بريداً إلكترونياً مختلفاً لكل دور.",
      eFields: "يرجى إدخال اسمك الأول وبريد صالح وبلدك ومدينتك.", eTerms: "يجب قبول الشروط وسياسة الخصوصية.",
      roleNotice: "هذا البريد مسجّل هنا كحساب مضيف. لا يمكن استخدام حساب المضيف كحساب مسافر: استخدم بريداً آخر لهذا الدور. وقد أُرسل طلبك مع ذلك.",
      doneH: "شكراً!", doneOk: "تم تسجيل طلبك. سنكتب إليك عند الافتتاح.", doneFb: "الإرسال المباشر غير متاح: سيُفتح تطبيق البريد والرسالة جاهزة. يمكنك أيضاً الكتابة إلى ",
      dashH: "ما ينتظرك", dashLead: "هذه هي الخطوات الخمس لتصبح عضواً موثّقاً.", dashDone: "1 / 5 خطوات", soon: "قريباً",
      dash: [["أنشئ حسابك", "تم تسجيل طلبك."], ["فعّل اشتراكك", "اختر اشتراكك وادفعه للتواصل مع المضيفين."], ["أكمل ملفك الشخصي", "قدّم نفسك: قصتك وصورك ومهاراتك وخطط سفرك."], ["تحقق من بريدك", "أكّد عنوانك لتتلقى الرسائل وتنبيهات الأمان."], ["وثّق ملفك", "يراجع فريقنا كل ملف للحفاظ على مجتمع آمن وموثوق."]],
      progress: "الخطوة {n} من {t}"
    }
  }[lang];
  function $(id) { return document.getElementById(id); }
  var IDS = ["pl", "ac"], cur = 0, plan = "solo", done = $("done");
  if (!done) return;
  document.documentElement.lang = lang; document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.title = "Host & Go — " + ({ fr: "Voyageur / Worker", en: "Traveller / Worker", ar: "مسافر / عامل" }[lang]);
  document.querySelectorAll("[data-i]").forEach(function (el) { var k = el.getAttribute("data-i"); if (T[k] != null) el.textContent = T[k]; });
  var EBL = { pl: T.eb_pl, ac: T.eb_ac };
  IDS.forEach(function (id) { var e = $(id).querySelector(".hgh-eyebrow"); e.textContent = T.progress.replace("{n}", IDS.indexOf(id) + 1).replace("{t}", IDS.length).toUpperCase() + " · " + EBL[id]; });

  var bar = $("hgh-progress"); IDS.forEach(function () { bar.appendChild(document.createElement("span")); });
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(n, focus) {
    cur = n; IDS.forEach(function (id, i) { $(id).hidden = i !== n; }); done.hidden = n !== IDS.length;
    [].slice.call(bar.children).forEach(function (b, i) { b.className = i <= Math.min(n, IDS.length - 1) ? "on" : ""; });
    bar.setAttribute("aria-label", T.progress.replace("{n}", Math.min(n, IDS.length - 1) + 1).replace("{t}", IDS.length)); bar.hidden = n === IDS.length;
    if (focus === false) return;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var h = n === IDS.length ? done : $("h-" + IDS[n]); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  show(0, false);

  var feat = $("feat"); T.feats.forEach(function (f) { var li = document.createElement("li"); li.textContent = f; feat.appendChild(li); });
  function drawPlan() {
    var solo = plan === "solo";
    $("plan-name").textContent = solo ? T.soloName : T.coupleName; $("plan-price").textContent = PRICES[plan]; $("plan-for").textContent = solo ? T.soloFor : T.coupleFor;
    [].slice.call(document.querySelectorAll(".hgv-opt")).forEach(function (b) { b.setAttribute("aria-pressed", b.getAttribute("data-plan") === plan ? "true" : "false"); });
    $("chosen").textContent = T.chosen.replace("{p}", solo ? T.soloName : T.coupleName).replace("{n}", PRICES[plan]);
  }
  [].slice.call(document.querySelectorAll(".hgv-opt")).forEach(function (b) { b.addEventListener("click", function () { plan = b.getAttribute("data-plan"); drawPlan(); }); });
  drawPlan();
  document.querySelectorAll("[data-go]").forEach(function (b) { b.addEventListener("click", function () { if (b.getAttribute("data-go") === "prev") { if (cur > 0) show(cur - 1); } else if (cur < IDS.length - 1) show(cur + 1); }); });

  /* Étapes à venir (aperçu du tableau de bord) */
  var dash = $("dash");
  T.dash.forEach(function (d, i) {
    var li = document.createElement("li"); li.className = i === 0 ? "ok" : i === 4 ? "lock" : "";
    li.innerHTML = '<span class="n" aria-hidden="true"></span><div><b></b><span class="d"></span></div>';
    li.querySelector(".n").textContent = i === 0 ? "✓" : String(i + 1); li.querySelector("b").textContent = (i + 1) + ". " + d[0]; li.querySelector(".d").textContent = d[1];
    if (i > 0) { var s = document.createElement("span"); s.className = "soon"; s.textContent = T.soon; li.querySelector("b").appendChild(s); }
    dash.appendChild(li);
  });
  $("dash-bar").setAttribute("aria-label", T.dashDone); $("dash-bar").firstChild.textContent = T.dashDone; $("dash-bar").firstChild.style.width = "20%";

  /* Un même e-mail ne sert pas aux deux rôles (contrôle léger sur cet appareil ; le vrai contrôle viendra avec les comptes) */
  function roles() { try { return JSON.parse(localStorage.getItem("hg_roles") || "{}"); } catch (e) { return {}; } }
  function saveRole(mail, role) { try { var r = roles(); r[mail.toLowerCase()] = role; localStorage.setItem("hg_roles", JSON.stringify(r)); } catch (e) { /* stockage indisponible */ } }

  function err(msg, el) { $("error2").textContent = msg; if (el) el.focus(); return false; }
  function fallback(msg, name, mail) {
    $("doneMsg").textContent = T.doneFb + TO + "."; show(IDS.length);
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent("[Host & Go] Inscription voyageur") + "&body=" + encodeURIComponent(msg + "\n\n--\n" + name + "\n" + mail);
  }
  $("finish").addEventListener("click", function () {
    var name = $("firstName").value.trim(), mail = $("email").value.trim(), country = $("country").value.trim(), city = $("city").value.trim();
    if (!name || !country || !city || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) return err(T.eFields, !name ? $("firstName") : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail) ? $("email") : !country ? $("country") : $("city"));
    if (!$("terms").checked) return err(T.eTerms, $("terms"));
    $("error2").textContent = ""; $("roleNotice").textContent = "";
    var other = roles()[mail.toLowerCase()] === "host"; if (other) $("roleNotice").textContent = T.roleNotice;
    var msg = ["[Host & Go — inscription voyageur / worker]", "Formule : " + (plan === "solo" ? "Solo" : "Couple / amis") + " (" + PRICES[plan] + " DT par an, indicatif)", "Pays : " + country, "Ville : " + city, "Langue de la page : " + lang, other ? "Remarque : e-mail déjà utilisé comme hôte sur cet appareil" : ""].filter(Boolean).join("\n");
    var btn = $("finish"); btn.disabled = true;
    var ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
    (window.CMV_TS ? window.CMV_TS.fetch : function (u, o) { return fetch(u, o); })(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name, email: mail, subject: SUBJECT, message: msg, consent: true, hp: $("hp").value || "" }), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (sent) {
        if (timer) clearTimeout(timer); btn.disabled = false;
        if (sent) { if (!other) saveRole(mail, "traveler"); $("doneMsg").textContent = T.doneOk; show(IDS.length); } else fallback(msg, name, mail);
      });
  });
})();
