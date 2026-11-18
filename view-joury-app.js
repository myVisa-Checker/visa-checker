/* Joury — analyse des refus de visa (view-joury.html). Script externe : la CSP de la page n'autorise plus de script inline.
   Textes : français comme clés, traduits par VC.tx() (i18n/view-common.js et i18n/view-joury.js). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); }, T = VC.tx,
    refusalFiles = [], supportFiles = [], report = '', letter = '', chatHistory = [], busy = false, cur = { state: '' },
    allowed = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'], max = 5 * 1024 * 1024;

  function toast(s) { VC.toast(s); }
  function allFiles() { return refusalFiles.concat(supportFiles); }
  function update() {
    $('jy-doc-count').textContent = allFiles().length; $('jy-analyze').disabled = !refusalFiles.length || busy;
    $('jy-generate-letter').disabled = !report || busy; $('jy-appeal').disabled = !report || busy; $('jy-download').disabled = !report;
  }
  var LISTS = { refusal: { id: 'jy-refusal-list', empty: 'Aucune notification ajoutée.' }, support: { id: 'jy-support-list', empty: 'Aucune pièce ajoutée.' } };
  function listOf(which) { return which === 'refusal' ? refusalFiles : supportFiles; }
  function renderFiles(which) {
    var box = $(LISTS[which].id), files = listOf(which); box.textContent = '';
    if (!files.length) { var e = document.createElement('span'); e.className = 'vc-mute vc-small'; e.textContent = T(LISTS[which].empty); box.appendChild(e); return; }
    files.forEach(function (f, i) {
      var row = document.createElement('div'); row.className = 'jy-file-row';
      var name = document.createElement('span'); name.textContent = f.name + ' · ' + VC.fmtSize(f.size);
      var b = document.createElement('button'); b.type = 'button'; b.textContent = '×'; b.setAttribute('aria-label', T('Retirer {name}', { name: f.name }));
      b.addEventListener('click', function () { files.splice(i, 1); renderFiles(which); update(); });
      row.append(name, b); box.appendChild(row);
    });
  }
  function addFiles(which, list) {
    var dest = listOf(which), files = Array.prototype.slice.call(list || []);
    files.forEach(function (f) {
      if (!allowed.includes(f.type) || !f.size || f.size > max) { toast(T('Format non accepté ou fichier supérieur à 5 Mo.')); return; }
      if (allFiles().length >= 10) { toast(T('Maximum 10 fichiers au total.')); return; }
      if (!dest.some(function (x) { return x.name === f.name && x.size === f.size; })) dest.push(f);
    });
    renderFiles(which); update();
  }
  function drop(id, which, inputId) {
    var z = $(id), inp = $(inputId);
    inp.addEventListener('change', function () { addFiles(which, inp.files); inp.value = ''; });
    ['dragenter', 'dragover'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.add('is-over'); }); });
    ['dragleave', 'drop'].forEach(function (ev) { z.addEventListener(ev, function (e) { e.preventDefault(); z.classList.remove('is-over'); }); });
    z.addEventListener('drop', function (e) { addFiles(which, e.dataTransfer.files); });
  }
  drop('jy-refusal-drop', 'refusal', 'jy-refusal-files'); drop('jy-support-drop', 'support', 'jy-support-files');
  function busyState(v) { busy = v; $('jy-progress').hidden = !v; update(); }
  function state(fr, kind) { cur.state = fr; cur.kind = kind; var s = $('jy-review-state'); s.textContent = T(fr); s.className = 'vc-badge vc-badge-' + kind; }
  function bubble(role, text) {
    var b = VC.el('div', 'vc-message ' + (role === 'assistant' ? 'assistant' : 'user'));
    b.appendChild(VC.el('small', '', role === 'assistant' ? T('Joury') : T('Vous'))); b.appendChild(document.createTextNode(text));
    $('jy-chat-log').appendChild(b); $('jy-chat-log').scrollTop = $('jy-chat-log').scrollHeight;
  }

  /* Les libellés MOTIF / EXPLICATION / SEVERITE / PIECES A JOINDRE / ARGUMENT A ECRIRE sont un protocole avec le Worker :
     ils restent identiques dans toutes les langues, seul le contenu change de langue. */
  function parseIssues(t) {
    var blocks = t.split(/(?=^MOTIF\s*[:：])/im).filter(function (x) { return /^MOTIF\s*[:：]/i.test(x.trim()); });
    return blocks.slice(0, 12).map(function (block) {
      function field(name) { var m = block.match(new RegExp('^(?:' + name + ')\\s*[:：]\\s*(.*)$', 'im')); return m ? m[1].trim() : ''; }
      return { title: field('MOTIF'), explanation: field('EXPLICATION'), severity: field('SÉVÉRITÉ|SEVERITE'), evidence: field('PIÈCES À JOINDRE|PIECES A JOINDRE|PIÈCES'), argument: field('ARGUMENT À ÉCRIRE|ARGUMENT A ECRIRE|ARGUMENT') };
    });
  }
  function sevClass(s) { s = (s || '').toLowerCase(); return /high|élev|elev|important|bloquant|مرتفع|عالي|عالية|حاسم/.test(s) ? 'high' : /medium|modér|moder|moyen|متوسط/.test(s) ? 'medium' : 'low'; }
  function sevText(item) { return item.severity ? T(sevClass(item.severity) === 'high' ? 'Élevée' : sevClass(item.severity) === 'medium' ? 'Moyenne' : 'Faible') : T('À confirmer'); }
  var EVAL_RE = /^(?:ÉVALUATION DU RECOURS|EVALUATION DU RECOURS|APPEAL ASSESSMENT|تقييم الطعن)\s*[:：]\s*(.+)$/im;
  function evalText(raw) {
    var v = raw.replace(/[.\s]+$/, '').trim(), k = v.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    if (/^a examiner|^to review|^for review/.test(k)) return T('À examiner');
    if (/^a consolider|^to strengthen/.test(k)) return T('À consolider');
    if (/^risque eleve|^high risk/.test(k)) return T('Risque élevé');
    if (/^non evaluable|^not assessable/.test(k)) return T('Non évaluable');
    return v;
  }

  function renderReport(t, keepLetter) {
    report = t; state('Analyse reçue', 'ok');
    var issues = parseIssues(t), high = 0, medium = 0, low = 0;
    $('jy-issues').textContent = '';
    if (!issues.length) {
      var tr0 = document.createElement('tr'), td0 = document.createElement('td'); td0.colSpan = 5; td0.className = 'jy-empty';
      td0.textContent = T('Consultez le rapport détaillé ci-dessous. Joury n’a pas pu structurer les motifs en lignes distinctes : vous pouvez lui demander une clarification.');
      tr0.appendChild(td0); $('jy-issues').appendChild(tr0);
    }
    issues.forEach(function (item) {
      var c = sevClass(item.severity); if (c === 'high') high++; else if (c === 'medium') medium++; else low++;
      var tr = document.createElement('tr'),
        values = [item.title, item.explanation, sevText(item),
          ((item.evidence ? T('Pièces : {x}', { x: item.evidence }) + ' ' : '') + (item.argument ? T('Argument : {x}', { x: item.argument }) : '')) || T('Voir le rapport détaillé')];
      values.forEach(function (v) { var td = document.createElement('td'); td.textContent = v || T('À préciser dans le rapport'); tr.appendChild(td); });
      var td = document.createElement('td'), btn = document.createElement('button'); btn.type = 'button'; btn.className = 'vc-btn vc-btn-sm'; btn.textContent = T('Examiner / Corriger');
      btn.addEventListener('click', function () {
        var box = $('jy-selected-issue'); box.textContent = '';
        var title = document.createElement('h3'); title.textContent = item.title || T('Motif à préciser');
        function line(frKey, v, fallback) { var p = document.createElement('p'); p.textContent = T(frKey, { x: v || T(fallback) }); return p; }
        box.append(title,
          line('Analyse : {x}', item.explanation, 'À préciser à partir de la notification.'),
          line('Sévérité : {x}', item.severity ? sevText(item) : '', 'À confirmer'),
          line('Pièces à joindre : {x}', item.evidence, 'À déterminer selon les faits et les exigences officielles.'),
          line('Argument à développer : {x}', item.argument, 'À compléter avec des faits vérifiables.'));
        box.hidden = false; $('jy-resolve').scrollIntoView({ behavior: 'smooth' });
      });
      td.appendChild(btn); tr.appendChild(td); $('jy-issues').appendChild(tr);
    });
    $('jy-high-count').textContent = high; $('jy-medium-count').textContent = medium; $('jy-low-count').textContent = low;
    $('jy-issue-count').textContent = issues.length || '—';
    $('jy-issue-caption').textContent = T('{high} motif(s) bloquant(s) · {n} identifié(s)', { high: high, n: issues.length });
    var evalLine = t.match(EVAL_RE);
    $('jy-status').textContent = evalLine ? evalText(evalLine[1]) : T('Non évaluable');
    $('jy-status-caption').textContent = T('Évaluation indicative à confirmer officiellement');
    $('jy-actions').textContent = t; $('jy-actions').className = 'jy-actions jy-report-text';
    if (!keepLetter) { $('jy-letter-output').hidden = true; letter = ''; $('jy-copy-letter').disabled = true; }
    update();
  }

  function analyze() {
    if (!refusalFiles.length || busy) return; busyState(true);
    /* Consigne envoyée au service IA (en français, la langue des consignes) ; la réponse est demandée dans la langue choisie via `language`. */
    var context = 'Analyse exclusivement un refus de visa. Notification officielle : ' + refusalFiles.length + ' fichier(s). Dossier initial : ' + supportFiles.length +
      ' fichier(s). Autorité/pays : ' + $('jy-authority').value + '. Date : ' + $('jy-date').value + '. Référence : ' + $('jy-reference').value +
      '. Faits complémentaires : ' + $('jy-facts').value + '. Identifie chaque motif exactement tel qu’écrit, explique son sens, relie-le aux preuves visibles, indique les pièces précises à joindre et les arguments factuels à développer. Distingue faits, interprétations et informations à confirmer. Ne conclus pas sur la recevabilité juridique sans connaître le pays et l’autorité.';
    VC.api.post('/api/analyze-refusal', { task: 'refusal-analysis', context: context, language: VC.lang, lang: VC.lang }, allFiles()).then(function (d) {
      if (!d.reply) throw new Error(d.error || 'ai_unavailable');
      renderReport(d.reply); chatHistory.push({ role: 'user', text: context }, { role: 'assistant', text: d.reply });
      bubble('assistant', T('Votre analyse est prête. Les constats, pièces à réunir et points à vérifier sont affichés dans le rapport.'));
      $('jy-review').scrollIntoView({ behavior: 'smooth' });
    }).catch(function (e) { toast(VC.api.errorMessage(e)); }).finally(function () { busyState(false); });
  }
  $('jy-analyze').addEventListener('click', analyze);

  function generate() {
    if (!report || busy) return;
    if (window.VisaPay && VisaPay.needsPay('joury')) { VisaPay.open('joury', generate); return; }
    busyState(true);
    var body = { authority: $('jy-authority').value, destination: $('jy-authority').value, refusalDate: $('jy-date').value, reference: $('jy-reference').value, refusalText: report, facts: $('jy-facts').value, language: VC.lang === 'ar' ? 'arabe' : VC.lang === 'en' ? 'anglais' : 'français', lang: VC.lang };
    VC.api.post('/api/generate-appeal', body, allFiles()).then(function (d) {
      if (!d.reply) throw new Error(d.error || 'ai_unavailable');
      letter = d.reply; $('jy-letter-output').textContent = letter; $('jy-letter-output').hidden = false; $('jy-copy-letter').disabled = false;
      $('jy-letter-output').scrollIntoView({ behavior: 'smooth' });
    }).catch(function (e) { toast(VC.api.errorMessage(e)); }).finally(function () { busyState(false); });
  }
  $('jy-generate-letter').addEventListener('click', generate);
  $('jy-appeal').addEventListener('click', function () { $('jy-report').scrollIntoView({ behavior: 'smooth' }); generate(); });
  $('jy-copy-letter').addEventListener('click', function () {
    VC.copy(letter).then(function () { toast(T('Lettre copiée.')); }).catch(function () { toast(T('Copie impossible.')); });
  });
  $('jy-download').addEventListener('click', function () {
    if (!report) return;
    var blob = new Blob([T('CHECKMYVISA — RAPPORT JOURY') + '\n\n' + report + (letter ? '\n\n' + T('PROJET DE LETTRE') + '\n\n' + letter : '')], { type: 'text/plain;charset=utf-8' }),
      url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'checkmyvisa-rapport-joury.txt'; a.click(); URL.revokeObjectURL(url);
  });
  $('jy-chat-form').addEventListener('submit', function (e) {
    e.preventDefault(); var q = $('jy-chat-input').value.trim(); if (!q || busy) return;
    $('jy-chat-input').value = ''; bubble('user', q); chatHistory.push({ role: 'user', text: q }); busyState(true);
    VC.api.post('', { mode: 'joury-refusal', messages: chatHistory.slice(-8), lang: VC.lang }).then(function (d) {
      if (!d.reply) throw new Error(d.error || 'ai_unavailable');
      chatHistory.push({ role: 'assistant', text: d.reply }); bubble('assistant', d.reply);
    }).catch(function (e2) { toast(VC.api.errorMessage(e2)); }).finally(function () { busyState(false); });
  });
  $('jy-chat-input').addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); $('jy-chat-form').requestSubmit(); } });

  /* Changement de langue : on redessine ce que le script a écrit (le texte de l'IA reste dans sa langue). */
  document.addEventListener('vc:lang', function () {
    renderFiles('refusal'); renderFiles('support');
    if (cur.state && !report) state(cur.state, cur.kind);
    if (report) renderReport(report, true);
  });
  VC.init({}, 'joury'); update();
})();
