/* Formulaire de contact : ouvre la messagerie de l'utilisateur avec le message prêt (pas de serveur, rien n'est stocké). */
(function () {
  var f = document.getElementById("cform");
  if (!f) return;
  var TO = "visacheckercontact@gmail.com";
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
    var subject = "[CheckMyVisa] " + $("cf-subj").value;
    var body = msg + "\n\n--\n" + name + "\n" + mail;
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    ok.hidden = false;
  });
})();
