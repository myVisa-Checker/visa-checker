/* Consulat Saden — entretien blanc (view-entretien.html). Script externe : la CSP de la page n'autorise plus de script inline.
   Textes : français comme clés, traduits par VC.tx() (i18n/view-common.js et i18n/view-entretien.js).
   Les questions posées existent déjà en trois langues ; la langue de l'entretien (#iv-lang) suit la langue du site au départ. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); }, T = VC.tx;
  var questions = {
    fr: ['Pouvez-vous présenter brièvement le motif de votre voyage ?', 'Pourquoi avez-vous choisi cette destination ?', 'Qui finance votre séjour et comment le justifiez-vous ?', 'Quels sont vos liens et engagements dans votre pays de résidence ?', 'Quelles sont vos dates et votre organisation de voyage ?'],
    en: ['Could you briefly explain the purpose of your trip?', 'Why did you choose this destination?', 'Who will finance your stay and how can you support this?', 'What ties and commitments do you have in your country of residence?', 'What are your travel dates and arrangements?'],
    ar: ['هل يمكنك شرح سبب سفرك باختصار؟', 'لماذا اخترت هذه الوجهة؟', 'من سيموّل إقامتك وكيف يمكنك إثبات ذلك؟', 'ما هي روابطك والتزاماتك في بلد إقامتك؟', 'ما هي تواريخ سفرك وترتيبات الرحلة؟']
  };
  var closing = { fr: 'Session terminée. Relisez les retours et assurez-vous que chaque réponse correspond à votre situation réelle.', en: 'Session finished. Read the feedback again and make sure each answer matches your real situation.', ar: 'انتهت الجلسة. أعد قراءة الملاحظات وتأكد من أن كل إجابة تطابق وضعك الحقيقي.' };
  /* Intitulés que l'IA peut employer dans son retour, selon la langue de l'entretien */
  var LABELS = { clarity: 'Clarté|Clarity|الوضوح', precision: 'Précision|Accuracy|Precision|الدقة', confidence: 'Niveau de certitude|Confidence level|Level of confidence|Confidence|مستوى الثقة|درجة الثقة|مستوى اليقين' };
  var idx = 0, active = false, answered = 0, feedbacks = [], amode = 'text', rec = null, listening = false, st = { state: 'En attente', kind: 'muted', quality: null, left: null, started: false };
  var por = function () { return $('sd-portrait'); }, SR = window.SpeechRecognition || window.webkitSpeechRecognition,
    TTS = ('speechSynthesis' in window) && typeof SpeechSynthesisUtterance === 'function', LC = { fr: 'fr-FR', en: 'en-US', ar: 'ar-SA' };
  function ivLang() { var v = $('iv-lang').value; return questions[v] ? v : 'fr'; }
  function setState(fr, kind) { st.state = fr; st.kind = kind; $('iv-state').textContent = T(fr); $('iv-state').className = 'vc-badge vc-badge-' + kind; }
  function micLabel(on) { $('iv-mic').textContent = on ? T('■ Arrêter') : T('🎙 Parler (bouton)'); $('iv-mic').setAttribute('aria-pressed', String(!!on)); }

  function speak(text) {
    if (amode !== 'voice' || !TTS || !text) return;
    try {
      speechSynthesis.cancel(); var u = new SpeechSynthesisUtterance(String(text).slice(0, 1200)); u.lang = LC[ivLang()] || 'fr-FR';
      u.onstart = function () { por().classList.add('is-speaking'); }; u.onend = u.onerror = function () { por().classList.remove('is-speaking'); };
      speechSynthesis.speak(u);
    } catch (e) { /* ignore */ }
  }
  function stopListen() { por().classList.remove('is-listening'); if (rec && listening) { try { rec.stop(); } catch (e) { /* ignore */ } } listening = false; micLabel(false); }
  function modeNote() {
    var note = $('iv-mode-note');
    if (amode !== 'voice') note.textContent = T('Vous répondez par écrit.');
    else if (SR && TTS) note.textContent = T('Consulat Saden lit les questions à voix haute. Appuyez sur « Parler » pour dicter votre réponse, relisez-la puis envoyez. La dictée peut passer par le service vocal de votre navigateur.');
    else if (TTS) note.textContent = T('La dictée vocale n’est pas disponible sur ce navigateur : vous écoutez les questions et vous répondez par écrit.');
    else note.textContent = T('La voix n’est pas disponible sur ce navigateur : vous pouvez continuer par écrit.');
  }
  function setAnswerMode(m, save) {
    amode = m; var v = m === 'voice';
    $('iv-mode-text').classList.toggle('is-active', !v); $('iv-mode-voice').classList.toggle('is-active', v);
    $('iv-mode-text').setAttribute('aria-pressed', String(!v)); $('iv-mode-voice').setAttribute('aria-pressed', String(v));
    $('iv-mic').hidden = !v || !SR;
    if (!v) { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } por().classList.remove('is-speaking'); stopListen(); }
    modeNote();
    if (save) { try { localStorage.setItem('vc-saden-mode', m); } catch (e) { /* ignore */ } }
  }
  function listen() {
    if (!SR) return;
    if (listening) { stopListen(); return; }
    try {
      rec = new SR(); rec.lang = LC[ivLang()] || 'fr-FR'; rec.interimResults = true; rec.continuous = false; var base = $('iv-answer').value.trim();
      rec.onresult = function (e) { var t = ''; for (var i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; $('iv-answer').value = (base ? base + ' ' : '') + t.trim(); };
      rec.onerror = function (e) { listening = false; micLabel(false); VC.toast(T(e && e.error === 'not-allowed' ? 'Autorisez le microphone pour répondre à voix haute.' : 'La dictée vocale a échoué. Vous pouvez répondre par écrit.')); };
      rec.onend = function () { listening = false; micLabel(false); };
      try { speechSynthesis.cancel(); } catch (e) { /* ignore */ }
      rec.start(); listening = true; por().classList.add('is-listening'); micLabel(true);
    } catch (e) { listening = false; VC.toast(T('La dictée vocale n’est pas disponible. Répondez par écrit.')); }
  }
  function say(role, text) {
    if (role === 'agent') speak(text);
    var el = VC.el('div', 'vc-interview-message ' + role);
    el.appendChild(VC.el('small', '', role === 'agent' ? T('Consulat Saden') : T('Vous'))); el.appendChild(document.createTextNode(text));
    $('iv-log').appendChild(el); $('iv-log').scrollTop = $('iv-log').scrollHeight;
  }
  function currentQuestion() { var q = questions[ivLang()]; return q[idx % q.length]; }
  function ask() {
    if (idx >= 5) { finish(); return; }
    $('iv-next').disabled = true; $('iv-answer').disabled = false; $('iv-send').disabled = false; $('iv-mic').disabled = false; $('iv-answer').focus(); say('agent', currentQuestion());
  }
  function resetQuality() { ['clarity', 'precision', 'confidence'].forEach(function (k) { $('q-' + k).textContent = T('En attente'); }); st.quality = null; }
  function start() {
    if (!$('iv-code').value.trim()) { VC.toast(T('Le code d’accès est requis pour démarrer.')); $('iv-code').focus(); return; }
    idx = 0; answered = 0; feedbacks = []; active = true; $('iv-log').textContent = ''; $('iv-feedback').textContent = T('En attente de votre première réponse.'); resetQuality();
    st.started = true; setState('En cours', 'info'); $('iv-end').disabled = false; $('iv-start').textContent = T('Recommencer'); ask();
  }
  function finish() {
    active = false; stopListen(); $('iv-answer').disabled = true; $('iv-send').disabled = true; $('iv-mic').disabled = true; $('iv-next').disabled = true; $('iv-end').disabled = true;
    setState('Terminée', 'ok'); say('agent', closing[ivLang()]);
  }
  function extract(reply, key) {
    var m = (reply || '').match(new RegExp('(?:' + LABELS[key] + ')\\s*[:：-]\\s*([^\\n]+)', 'i'));
    return m ? m[1].trim().slice(0, 150) : T('Voir le retour IA');
  }

  $('iv-mode-text').addEventListener('click', function () { setAnswerMode('text', true); });
  $('iv-mode-voice').addEventListener('click', function () { setAnswerMode('voice', true); });
  $('iv-mic').addEventListener('click', listen);
  window.addEventListener('pagehide', function () { try { speechSynthesis.cancel(); } catch (e) { /* ignore */ } });
  $('iv-start').addEventListener('click', start); $('iv-end').addEventListener('click', finish);
  $('iv-next').addEventListener('click', function () {
    if (!active) return;
    if (idx >= 1 && window.VisaPay && VisaPay.needsPay('saden')) { VisaPay.open('saden'); return; }
    idx++; ask();
  });
  $('iv-form').addEventListener('submit', function (e) {
    e.preventDefault(); if (!active) return;
    var answer = $('iv-answer').value.trim(); if (!answer) return;
    var q = currentQuestion(); say('user', answer); $('iv-answer').value = ''; stopListen(); $('iv-answer').disabled = true; $('iv-mic').disabled = true;
    VC.api.withBusy($('iv-send'), function () {
      return VC.api.interviewFeedback({ code: $('iv-code').value.trim(), question: q, answer: answer, lang: ivLang(), context: 'Motif : ' + $('iv-purpose').value + ' ; langue : ' + ivLang() + ' ; mode : simulation consulaire' });
    }).then(function (data) {
      answered++; feedbacks.push(data.reply || ''); $('iv-feedback').textContent = data.reply || T('Feedback non disponible.'); speak(data.reply);
      st.quality = { clarity: extract(data.reply, 'clarity'), precision: extract(data.reply, 'precision'), confidence: extract(data.reply, 'confidence') };
      $('q-clarity').textContent = st.quality.clarity; $('q-precision').textContent = st.quality.precision; $('q-confidence').textContent = st.quality.confidence;
      $('iv-next').disabled = false; setState('Feedback reçu', 'ok');
      if (data.left != null) { st.left = data.left; $('iv-state').title = T('Questions restantes selon quota : {n}', { n: data.left }); }
    }).catch(function (err) { $('iv-answer').disabled = false; $('iv-mic').disabled = false; VC.toast(VC.api.errorMessage(err)); });
  });

  /* Changement de langue du site : on redessine ce que le script a écrit et on aligne la langue de l'entretien (sauf séance commencée).
     Le retour de l'IA et les questions déjà posées restent dans leur langue. */
  document.addEventListener('vc:lang', function () {
    if (!st.started) $('iv-lang').value = VC.lang;
    setState(st.state, st.kind); modeNote(); micLabel(listening);
    $('iv-start').textContent = T(st.started ? 'Recommencer' : 'Démarrer l’entretien');
    if (st.left != null) $('iv-state').title = T('Questions restantes selon quota : {n}', { n: st.left });
    if (st.started && !st.quality) { resetQuality(); if (!feedbacks.length) $('iv-feedback').textContent = T('En attente de votre première réponse.'); }
  });
  VC.init({}, 'entretien');
  $('iv-lang').value = VC.lang;
  var saved = 'text'; try { saved = localStorage.getItem('vc-saden-mode') || 'text'; } catch (e) { /* ignore */ }
  setAnswerMode(saved === 'voice' ? 'voice' : 'text', false); micLabel(false);
})();
