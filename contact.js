/* Formulaire de contact : envoi direct via le Worker (/contact) ; secours : ouverture de la messagerie avec le message prêt. Rien n'est stocké. */
(function () {
  var f = document.getElementById("cform");
  if (!f) return;
  var TO = "contact@checkmyvisa.org";
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/contact";
  var LI = { fr: 0, en: 1, ar: 2 }[(window.SI && window.SI.lang) || "fr"] || 0;
  var MSG = {
    "name": [
      "Merci d'indiquer votre nom complet.",
      "Please enter your full name.",
      "يرجى إدخال اسمك الكامل."
    ],
    "mail": [
      "Merci d'indiquer une adresse e-mail valide.",
      "Please enter a valid e-mail address.",
      "يرجى إدخال عنوان بريد إلكتروني صالح."
    ],
    "msg": [
      "Merci d'écrire votre message.",
      "Please write your message.",
      "يرجى كتابة رسالتك."
    ],
    "rgpd": [
      "Merci d'accepter l'utilisation de vos informations pour répondre à votre demande.",
      "Please agree to the use of your information to answer your request.",
      "يرجى الموافقة على استخدام معلوماتك للرد على طلبك."
    ],
    "sent": [
      "Merci, votre message a bien été envoyé. Nous vous répondrons sous 24 à 48 heures ouvrées.",
      "Thank you, your message has been sent. We will reply within 24 to 48 working hours.",
      "شكرًا، تم إرسال رسالتك. سنرد عليك خلال 24 إلى 48 ساعة عمل."
    ],
    "fb": [
      "L'envoi direct n'est pas disponible pour le moment : votre messagerie s'ouvre avec le message prêt. Vous pouvez aussi écrire à ",
      "Direct sending is not available at the moment: your e-mail app opens with the message ready. You can also write to ",
      "الإرسال المباشر غير متاح حاليًا: سيُفتح تطبيق البريد لديك والرسالة جاهزة. يمكنك أيضًا الكتابة إلى "
    ]
  };
  function m(k) { return MSG[k][LI]; }
  function $(id) { return document.getElementById(id); }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("cf-err"), ok = $("cf-ok");
    var name = $("cf-name").value.trim(), mail = $("cf-mail").value.trim(), msg = $("cf-msg").value.trim();
    ok.hidden = true;
    var problem = "";
    if (!name) problem = m("name");
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) problem = m("mail");
    else if (!msg) problem = m("msg");
    else if (!$("cf-rgpd").checked) problem = m("rgpd");
    if (problem) { err.textContent = problem; err.hidden = false; return; }
    err.hidden = true;
    var btn = f.querySelector(".cf-btn");
    btn.disabled = true;
    var payload = { name: name, email: mail, subject: $("cf-subj").value, message: msg, consent: true, hp: ($("cf-hp") || {}).value || "" };
    var ctl = typeof AbortController === "function" ? new AbortController() : null;
    var timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
    fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
      .catch(function () { return false; })
      .then(function (sent) {
        if (timer) clearTimeout(timer);
        btn.disabled = false;
        if (sent) {
          f.reset();
          ok.textContent = m("sent");
          ok.hidden = false;
        } else {
          fallback(name, mail, msg);
        }
      });
  });
  function fallback(name, mail, msg) {
    var ok = $("cf-ok");
    var subject = "[CheckMyVisa] " + $("cf-subj").value;
    var body = msg + "\n\n--\n" + name + "\n" + mail;
    ok.textContent = m("fb") + TO + ".";
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    ok.hidden = false;
  }
})();
