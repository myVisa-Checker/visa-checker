/* Rendez-vous en direct : signalements des voyageurs. Aucun robot, aucune donnée personnelle.
   Script externe (la CSP de la page n'autorise pas le script inline). Textes FR/EN/AR dans T. */
(function () {
  "use strict";
  var API = "https://visa-proxy.rabehfly.workers.dev/rdv/";
  var L = (window.SI && SI.lang) || "fr"; if (["fr", "en", "ar"].indexOf(L) < 0) L = "fr";
  var IX = { fr: 0, en: 1, ar: 2 }[L];
  function t(a) { return a[IX]; }
  var T = {
    title: ["Rendez-vous visa en direct", "Live visa appointments", "مواعيد التأشيرة مباشرة"],
    lead: ["Les voyageurs signalent en temps réel quand des créneaux s'ouvrent et combien de temps prend vraiment une réponse.", "Travellers report in real time when slots open and how long a decision really takes.", "المسافرون يبلّغون مباشرة عند فتح مواعيد وعن المدة الفعلية للرد."],
    note: ["Informations données par la communauté, sans aucune vérification officielle. CheckMyVisa ne lit pas les sites des centres et ne réserve rien à votre place.", "Information supplied by the community, with no official verification. CheckMyVisa does not read the centres' websites and books nothing for you.", "معلومات من المجتمع دون أي تحقق رسمي. لا يطّلع CheckMyVisa على مواقع المراكز ولا يحجز نيابةً عنك."],
    country: ["Pays du visa", "Visa country", "بلد التأشيرة"], city: ["Centre", "Centre", "المركز"],
    found: ["🟢 Je viens de trouver un RDV", "🟢 I just found a slot", "🟢 وجدت موعدًا للتو"],
    none: ["🔴 Aucun créneau disponible", "🔴 No slot available", "🔴 لا توجد مواعيد"],
    passport: ["⏳ J'ai reçu mon passeport", "⏳ I got my passport back", "⏳ استلمت جواز سفري"],
    dep: ["Date de dépôt", "Drop-off date", "تاريخ الإيداع"], ans: ["Date de réponse", "Decision date", "تاريخ الرد"], send: ["Envoyer le délai", "Send the delay", "إرسال المدة"],
    live: ["Où en sont les centres (dernière heure)", "Centre status (last hour)", "حالة المراكز (آخر ساعة)"],
    delays: ["Délais de traitement déclarés", "Reported processing times", "مدد المعالجة المصرّح بها"],
    how: ["Comment ça marche", "How it works", "كيف يعمل"],
    howItems: [
      ["Un centre passe en vert (« vague de créneaux ») seulement quand 3 appareils différents signalent une ouverture dans la dernière heure.", "A centre turns green (“wave of slots”) only when 3 different devices report an opening within the last hour.", "يتحول المركز إلى الأخضر («موجة مواعيد») فقط عندما يبلّغ 3 أجهزة مختلفة عن فتح خلال الساعة الأخيرة."],
      ["Un délai moyen n'est affiché qu'à partir de 5 déclarations pour le même centre.", "An average delay is shown only from 5 reports for the same centre.", "لا يُعرض متوسط المدة إلا بعد 5 تصريحات للمركز نفسه."],
      ["Nous ne demandons aucune donnée personnelle : ni nom, ni passeport, ni capture d'écran.", "We ask for no personal data: no name, passport or screenshot.", "لا نطلب أي بيانات شخصية: لا اسم ولا جواز ولا لقطة شاشة."],
      ["Les alertes instantanées par e-mail ou Telegram arrivent bientôt.", "Instant e-mail or Telegram alerts are coming soon.", "التنبيهات الفورية عبر البريد أو تيليغرام قريبًا."]
    ],
    wave: ["Vague de créneaux", "Wave of slots", "موجة مواعيد"], blocked: ["Bloqué", "Blocked", "مغلق"], calm: ["Calme", "Quiet", "هادئ"],
    seen: ["Dernier signalement", "Last report", "آخر تبليغ"], ago: ["il y a ", "", "قبل "], min: [" min", " min ago", " دقيقة"], hour: [" h", " h ago", " ساعة"],
    reports: ["signalements (24 h)", "reports (24 h)", "تبليغات (24 س)"], days: ["jours (médiane)", "days (median)", "يومًا (الوسيط)"], decl: ["déclarations", "reports", "تصريحات"],
    empty: ["Aucun signalement pour l'instant. Soyez le premier à signaler.", "No reports yet. Be the first to report.", "لا توجد تبليغات بعد. كن أول من يبلّغ."],
    delaysEmpty: ["Pas encore assez de déclarations (5 minimum par centre).", "Not enough reports yet (5 minimum per centre).", "لا توجد تصريحات كافية بعد (5 على الأقل لكل مركز)."],
    ok: ["Merci, votre signalement est pris en compte.", "Thank you, your report has been recorded.", "شكرًا، تم تسجيل تبليغك."],
    dup: ["Vous avez déjà signalé ce centre récemment.", "You already reported this centre recently.", "لقد بلّغت عن هذا المركز مؤخرًا."],
    rate: ["Trop de signalements depuis cet appareil. Réessayez plus tard.", "Too many reports from this device. Try again later.", "تبليغات كثيرة من هذا الجهاز. حاول لاحقًا."],
    err: ["Envoi impossible pour le moment. Réessayez dans un instant.", "Could not send right now. Please try again shortly.", "تعذّر الإرسال حاليًا. أعد المحاولة بعد قليل."],
    baddays: ["Dates incohérentes : la réponse doit être après le dépôt (120 jours maximum).", "Inconsistent dates: the decision must be after the drop-off (120 days maximum).", "تواريخ غير منطقية: يجب أن يكون الرد بعد الإيداع (120 يومًا كحد أقصى)."],
    cta: ["Bravo ! Pour ne pas être refusé au dépôt, faites vérifier votre dossier avec Aïcha avant votre rendez-vous.", "Great! To avoid a refusal at drop-off, have your file checked by Aïcha before your appointment.", "مبروك! لتفادي الرفض عند الإيداع، دع عائشة تفحص ملفك قبل موعدك."],
    ctaBtn: ["Vérifier mon dossier avec Aïcha", "Check my file with Aïcha", "افحص ملفي مع عائشة"],
    home: ["Accueil", "Home", "الرئيسية"], crumb: ["Rendez-vous en direct", "Live appointments", "مواعيد مباشرة"]
  };
  var COUNTRIES = [["fr", ["France", "France", "فرنسا"]], ["it", ["Italie", "Italy", "إيطاليا"]], ["es", ["Espagne", "Spain", "إسبانيا"]]];
  var CITIES = [["tunis", ["Tunis", "Tunis", "تونس"]], ["sfax", ["Sfax", "Sfax", "صفاقس"]], ["sousse", ["Sousse", "Sousse", "سوسة"]]];
  function $(id) { return document.getElementById(id); }
  function name(list, k) { for (var i = 0; i < list.length; i++) if (list[i][0] === k) return t(list[i][1]); return k; }
  function txt(id, a) { var e = $(id); if (e) e.textContent = t(a); }
  document.documentElement.lang = L; document.documentElement.dir = L === "ar" ? "rtl" : "ltr";
  document.title = t(T.title) + " | CheckMyVisa";
  txt("rd-title", T.title); txt("rd-lead", T.lead); txt("rd-note", T.note); txt("rd-l-country", T.country); txt("rd-l-city", T.city);
  txt("rd-found", T.found); txt("rd-none", T.none); txt("rd-passport", T.passport); txt("rd-l-dep", T.dep); txt("rd-l-ans", T.ans); txt("rd-send", T.send);
  txt("rd-h-live", T.live); txt("rd-h-delays", T.delays); txt("rd-h-how", T.how); txt("rd-delays-empty", T.delaysEmpty); txt("rd-empty", T.empty);
  txt("rd-cta-text", T.cta); txt("rd-cta-btn", T.ctaBtn); txt("rd-crumb-home", T.home); txt("rd-crumb", T.crumb);
  var how = $("rd-how"); T.howItems.forEach(function (a) { var li = document.createElement("li"); li.textContent = t(a); how.appendChild(li); });
  function fill(sel, list) { list.forEach(function (c) { var o = document.createElement("option"); o.value = c[0]; o.textContent = t(c[1]); sel.appendChild(o); }); }
  fill($("rd-country"), COUNTRIES); fill($("rd-city"), CITIES);
  var today = new Date().toISOString().slice(0, 10); $("rd-dep").max = today; $("rd-ans").max = today;

  function msg(a, bad) { var m = $("rd-msg"); m.textContent = t(a); m.style.color = bad ? "#c0392b" : "#16803c"; }
  function busy(on) { ["rd-found", "rd-none", "rd-send"].forEach(function (i) { $(i).disabled = on; }); }
  function post(path, body, done) {
    busy(true);
    fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { s: r.status, j: j }; }); })
      .then(function (x) {
        if (x.s === 429) msg(T.rate, true); else if (x.j && x.j.duplicate) msg(T.dup, true); else if (x.j && x.j.ok) { msg(T.ok, false); done && done(); load(); } else msg(T.err, true);
      }).catch(function () { msg(T.err, true); }).then(function () { busy(false); });
  }
  function ctr() { return { country: $("rd-country").value, city: $("rd-city").value }; }
  $("rd-found").onclick = function () { var c = ctr(); c.kind = "open"; post("report", c, function () { $("rd-cta").hidden = false; }); };
  $("rd-none").onclick = function () { var c = ctr(); c.kind = "none"; post("report", c); };
  $("rd-passport").onclick = function () { var f = $("rd-delay"); f.hidden = !f.hidden; };
  $("rd-delay").onsubmit = function (e) {
    e.preventDefault();
    var d = Math.round((new Date($("rd-ans").value) - new Date($("rd-dep").value)) / 864e5);
    if (!(d >= 1 && d <= 120)) { msg(T.baddays, true); return; }
    var c = ctr(); c.days = d; post("delay", c, function () { $("rd-delay").hidden = true; });
  };
  function ago(ts, now) {
    var m = Math.max(1, Math.round((now - ts) / 60000));
    if (m < 60) return t(T.ago) + m + t(T.min);
    return t(T.ago) + Math.round(m / 60) + t(T.hour);
  }
  function card(title, pill, body, big) {
    var d = document.createElement("div"); d.className = "rd-card" + (pill ? " " + pill[0] : "");
    var b = document.createElement("b"); b.textContent = title; d.appendChild(b);
    if (big) { var g = document.createElement("span"); g.className = "rd-big"; g.textContent = big; d.appendChild(g); }
    if (pill) { var p = document.createElement("span"); p.className = "rd-pill " + pill[0]; p.textContent = pill[1]; d.appendChild(p); }
    var s = document.createElement("small"); s.textContent = body; d.appendChild(s); return d;
  }
  function render(j) {
    var box = $("rd-centers"); box.textContent = "";
    var list = (j.centers || []);
    $("rd-empty").hidden = list.length > 0;
    list.forEach(function (c) {
      var st = c.status || "calm";
      box.appendChild(card(name(COUNTRIES, c.country) + " · " + name(CITIES, c.city), [st, t(T[st])], t(T.seen) + " : " + ago(c.last, j.now) + " · " + c.reports24h + " " + t(T.reports)));
    });
    var dl = $("rd-delays"); dl.textContent = ""; var ds = j.delays || [];
    $("rd-delays-empty").hidden = ds.length > 0;
    ds.forEach(function (d) { dl.appendChild(card(name(COUNTRIES, d.country) + " · " + name(CITIES, d.city), null, t(T.days) + " · " + d.n + " " + t(T.decl), d.median)); });
  }
  function load() {
    fetch(API + "live").then(function (r) { return r.json(); }).then(function (j) { if (j && j.ok) render(j); }).catch(function () {});
  }
  load(); setInterval(load, 60000);
})();
