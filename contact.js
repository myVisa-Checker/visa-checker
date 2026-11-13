/* Formulaire de contact : envoi direct via le Worker (/contact) ; secours : ouverture de la messagerie avec le message prêt. Rien n'est stocké. */
(function () {
  var f = document.getElementById("cform");
  if (!f) return;
  var TO = "visacheckercontact@gmail.com";
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/contact";
  function $(id) { return document.getElementById(id); }
  f.addEventListener("submit", function (e) {
    e.preventDefault();
    var err = $("cf-err"), ok = $("cf-ok");
    var name = $("cf-name").value.trim(), mail = $("cf-mail").value.trim(), msg = $("cf-msg").value.trim();
    ok.hidden = true;
    var problem = "";
    if (!name) problem = "Merci d'indiquer votre nom complet.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) problem = "Merci d'indiquer une adresse e-mail valide.";
    else if (!msg) problem = "Merci d'écrire votre message.";
    else if (!$("cf-rgpd").checked) problem = "Merci d'accepter l'utilisation de vos informations pour répondre à votre demande.";
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
          ok.textContent = "Merci, votre message a bien été envoyé. Nous vous répondrons sous 24 à 48 heures ouvrées.";
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
    ok.textContent = "L'envoi direct n'est pas disponible pour le moment : votre messagerie s'ouvre avec le message prêt. Vous pouvez aussi écrire à " + TO + ".";
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    ok.hidden = false;
  }
})();
