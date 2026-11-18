/* Aïcha — analyse de dossier (view-dossier.html). Script externe : la CSP de la page n'autorise plus de script inline.
   Textes : français comme clés, traduits par VC.tx() (dictionnaires i18n/view-common.js et i18n/view-dossier.js). */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); }, T = VC.tx, files = [], reportText = '', cur = { state: '', kind: 'muted' };

  /* Chiffres arabes (٠-٩) → chiffres latins, pour lire le score d'un rapport en arabe */
  function latin(s) { return String(s).replace(/[٠-٩]/g, function (c) { return c.charCodeAt(0) - 1632; }); }

  /* Mots qui signalent un point à vérifier dans un rapport écrit en français, anglais ou arabe */
  var RE_LINE = /missing|manquant|illisible|unreadable|illegible|incoh|inconsisten|discrepan|mismatch|expire|expir|invalid|absence|absent|à fournir|to provide|à corriger|to correct|alert|issue|anomal|not provided|مفقود|ناقص|غير مقروء|غير واضح|تناقض|عدم تطابق|اختلاف|منتهي|ينتهي|انتهت|انتهاء|غير صالح|غير متطابق|غير متوافق|غير متسق|غياب|غائب|يجب تقديم|يجب تصحيح|تنبيه|مشكلة|شاذ/i;
  var RE_HIGH = /missing|manquant|absence|illisible|unreadable|illegible|absent|not provided|مفقود|ناقص|غير مقروء|غير واضح|غياب|غائب/i;
  var RE_MEDIUM = /expire|expir|incoh|invalid|à corriger|différen|inconsisten|discrepan|mismatch|differs|to correct|تناقض|عدم تطابق|اختلاف|منتهي|ينتهي|انتهت|انتهاء|غير صالح|غير متطابق|غير متوافق|غير متسق|يجب تصحيح|تصحيح/i;
  var RE_SCORE_LINE = /^\s*(?:score|الدرجة|درجة|النتيجة)/i;
  var RE_SCORE = /(?:score|conformit[eé]|compliance|الامتثال|الدرجة|درجة|النتيجة)[^0-9٠-٩]{0,30}([0-9٠-٩]{1,3})\s*(?:\/\s*100|%)/i;

  function renderFiles() {
    var box = $('ai-file-list'); box.textContent = ''; $('ai-doc-count').textContent = String(files.length);
    if (!files.length) { box.appendChild(VC.el('span', 'vc-mute vc-small', T('Aucune pièce ajoutée.'))); return; }
    files.forEach(function (f, i) {
      var row = VC.el('div', 'jy-file-row'); row.appendChild(VC.el('span', '', f.name + ' · ' + VC.fmtSize(f.size)));
      var del = VC.el('button', '', '×'); del.type = 'button'; del.setAttribute('aria-label', T('Retirer {name}', { name: f.name }));
      del.addEventListener('click', function () { files.splice(i, 1); renderFiles(); });
      row.appendChild(del); box.appendChild(row);
    });
  }
  function addFiles(list) {
    try {
      var incoming = VC.api.validateFiles(list);
      if (files.length + incoming.length > 10) throw new Error('too_many_files');
      var total = files.concat(incoming).reduce(function (s, f) { return s + f.size; }, 0);
      if (total > 14 * 1024 * 1024) throw new Error('total_files_too_large');
      files = files.concat(incoming); renderFiles();
    } catch (e) { VC.toast(VC.api.errorMessage(e)); }
  }
  function setStep(n) {
    document.querySelectorAll('#ai-steps li').forEach(function (li) {
      var v = Number(li.dataset.step); li.classList.toggle('is-current', v === n); li.classList.toggle('is-done', v < n);
    });
  }
  function state(fr, kind) { cur.state = fr; cur.kind = kind; var s = $('ai-review-state'); s.textContent = T(fr); s.className = 'vc-badge vc-badge-' + kind; }
  function severity(line) { return RE_HIGH.test(line) ? 'high' : RE_MEDIUM.test(line) ? 'medium' : 'low'; }
  function sevLabel(s) { return T(s === 'high' ? 'Élevée' : s === 'medium' ? 'Moyenne' : 'Faible'); }

  function renderReport(text) {
    reportText = text; $('ai-report').textContent = text; $('ai-export').disabled = !text; $('ai-download').disabled = !text;
    var m = latin(text).match(RE_SCORE), score = m ? Math.max(0, Math.min(100, Number(m[1]))) : null;
    $('ai-score').textContent = score === null ? '—' : String(score);
    $('ai-score-caption').textContent = T(score === null ? 'Score non évaluable avec les pièces fournies' : 'Complétude apparente du dossier · /100');
    var lines = text.split(/\n+/).filter(function (x) { return !RE_SCORE_LINE.test(x) && RE_LINE.test(x); })
      .map(function (x) { return x.replace(/^[-•*#\s]+/, '').trim(); }).filter(Boolean).slice(0, 25);
    var counts = { high: 0, medium: 0, low: 0 }, rows = [];
    lines.forEach(function (l) { var s = severity(l); counts[s]++; rows.push({ text: l, sev: s }); });
    var order = { high: 0, medium: 1, low: 2 };
    rows.sort(function (a, b) { return order[a.sev] - order[b.sev]; });
    $('ai-high-count').textContent = counts.high; $('ai-medium-count').textContent = counts.medium; $('ai-low-count').textContent = counts.low;
    $('ai-issue-count').textContent = rows.length;
    $('ai-issue-caption').textContent = T(rows.length ? 'Relevés dans le rapport de l’IA' : 'Aucun point détecté automatiquement');
    var st = $('ai-status'), cap = $('ai-status-caption'), k;
    if (score === null && !rows.length) { st.textContent = T('À vérifier'); k = 'Consultez le rapport complet'; }
    else if (counts.high > 0 || (score !== null && score < 60)) { st.textContent = T('À corriger'); k = 'Des pièces essentielles sont à compléter'; }
    else if (counts.medium > 0 || (score !== null && score < 85)) { st.textContent = T('À consolider'); k = 'Quelques points à corriger avant le dépôt'; }
    else { st.textContent = T('Prêt à vérifier'); k = 'Relisez le rapport avant le dépôt'; }
    cap.textContent = T(k);
    state('Analyse reçue', 'ok');
    var body = $('ai-issues'); body.textContent = ''; var acts = $('ai-actions'); acts.textContent = '';
    if (!rows.length) {
      var tr = document.createElement('tr'), td = document.createElement('td'); td.colSpan = 2; td.className = 'jy-empty';
      td.textContent = T('Aïcha n’a pas structuré de points distincts. Consultez le rapport complet ci-dessous.'); tr.appendChild(td); body.appendChild(tr);
      acts.appendChild(VC.el('div', 'jy-empty-block', T('Aucune correction détectée automatiquement. Relisez le rapport complet.')));
    } else {
      rows.forEach(function (r) {
        var tr = document.createElement('tr'), a = document.createElement('td'), b = document.createElement('td');
        a.textContent = r.text; b.appendChild(VC.badge(r.sev === 'high' ? 'err' : r.sev === 'medium' ? 'warn' : 'ok', sevLabel(r.sev)));
        tr.appendChild(a); tr.appendChild(b); body.appendChild(tr);
      });
      acts.textContent = rows.filter(function (r) { return r.sev !== 'low'; }).map(function (r, i) { return (i + 1) + '. ' + r.text; }).join('\n') ||
        T('Aucune correction prioritaire. Vérifiez les points de gravité faible.');
    }
    setStep(4);
  }
  function download() {
    if (!reportText) return;
    var blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' }), url = URL.createObjectURL(blob), a = document.createElement('a');
    a.href = url; a.download = 'checkmyvisa-rapport-aicha.txt'; a.click(); URL.revokeObjectURL(url);
  }

  $('ai-files').addEventListener('change', function (e) { addFiles(e.target.files); e.target.value = ''; });
  var drop = $('ai-drop');
  ['dragenter', 'dragover'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.add('is-over'); }); });
  ['dragleave', 'drop'].forEach(function (ev) { drop.addEventListener(ev, function (e) { e.preventDefault(); drop.classList.remove('is-over'); }); });
  drop.addEventListener('drop', function (e) { if (e.dataTransfer) addFiles(e.dataTransfer.files); });

  $('ai-analyze').addEventListener('click', function () {
    if (!files.length) { VC.toast(T('Ajoutez au moins un document.')); return; }
    if (files.length > 1 && window.VisaPay && VisaPay.needsPay('aicha')) { VisaPay.open('aicha'); return; }
    if (!confirm(T('Vos documents et les informations saisies seront transmis au service IA pour analyse. Continuer ?'))) return;
    setStep(2); state('Analyse en cours', 'info'); $('ai-progress').hidden = false;
    VC.api.withBusy($('ai-analyze'), function () {
      return VC.api.analyzeDossier({ passportCountry: $('passport').value, destination: $('destination').value, purpose: $('purpose').value, occupation: $('occupation').value, lang: VC.lang }, files);
    }).then(function (data) {
      $('ai-progress').hidden = true; renderReport((data && data.reply) || T('Aucun rapport reçu.'));
    }).catch(function (e) {
      $('ai-progress').hidden = true; state('Échec', 'err'); VC.toast(VC.api.errorMessage(e)); setStep(1);
    });
  });
  $('ai-export').addEventListener('click', download); $('ai-download').addEventListener('click', download);

  /* Changement de langue : on redessine ce que le script a écrit (le texte de l'IA reste dans sa langue). */
  document.addEventListener('vc:lang', function () {
    renderFiles();
    if (cur.state) state(cur.state, cur.kind);
    if (reportText) renderReport(reportText);
  });
  VC.init({}, 'dossier'); renderFiles();
})();
