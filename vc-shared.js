/* Visa Checker – socle UI partagé (JavaScript vanilla, sans dépendance)
   - thème clair/sombre, langues FR/EN/AR (RTL automatique)
   - en-tête + barre de navigation mobile commune aux 3 vues
   - petits utilitaires (el, badge, toast, tailles de fichiers)
   Seules les préférences de thème et de langue sont stockées localement. */
(function (w, d) {
  'use strict';

  /* Les vues utilisent exclusivement le CSS local vc.css. */

  var LS = {
    get: function (k) { try { return w.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { w.localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  var LANGS = {
    fr: { dir: 'ltr', label: 'Français' },
    en: { dir: 'ltr', label: 'English' },
    ar: { dir: 'rtl', label: 'العربية' }
  };

  var BASE = {
    fr: {
      hub: 'Retour au hub', nav_dossier: 'Dossier', nav_recours: 'Recours', nav_entretien: 'Entretien',
      theme_toggle: 'Changer de thème', lang_label: 'Langue', preview: 'Aperçu',
      privacy: 'Les fichiers sont envoyés au service IA uniquement lorsque vous lancez explicitement l’analyse.',
      disclaimer: 'Outil d’aide indicatif : il ne remplace ni le consulat ni un conseil juridique. Vérifiez toujours les exigences officielles.'
    },
    en: {
      hub: 'Back to hub', nav_dossier: 'File', nav_recours: 'Appeal', nav_entretien: 'Interview',
      theme_toggle: 'Toggle theme', lang_label: 'Language', preview: 'Preview',
      privacy: 'Files are sent to the AI service only when you explicitly start the analysis.',
      disclaimer: 'Indicative help tool: it does not replace the consulate or legal advice. Always check the official requirements.'
    },
    ar: {
      hub: 'العودة إلى الرئيسية', nav_dossier: 'الملف', nav_recours: 'الطعن', nav_entretien: 'المقابلة',
      theme_toggle: 'تبديل المظهر', lang_label: 'اللغة', preview: 'معاينة',
      privacy: 'لا تُرسل الملفات إلى خدمة الذكاء الاصطناعي إلا عند بدء التحليل صراحةً.',
      disclaimer: 'أداة مساعدة إرشادية: لا تغني عن القنصلية ولا عن الاستشارة القانونية. تحقق دائماً من الشروط الرسمية.'
    }
  };

  var VC = w.VC = { lang: 'fr', page: {}, active: '', api: { base: 'https://visa-chat.rabehfly.workers.dev' } };

  /* ---------- Langue & thème (appliqués avant le premier affichage) ---------- */
  function detectLang() {
    var s = LS.get('vc_lang');
    if (s && LANGS[s]) return s;
    var n = String(navigator.language || 'fr').slice(0, 2).toLowerCase();
    return LANGS[n] ? n : 'fr';
  }
  function applyLangAttrs() {
    d.documentElement.lang = VC.lang;
    d.documentElement.dir = LANGS[VC.lang].dir;
  }
  function detectTheme() {
    var s = LS.get('vc_theme');
    if (s === 'dark' || s === 'light') return s;
    return (w.matchMedia && w.matchMedia('(prefers-color-scheme: dark)').matches) ? 'dark' : 'light';
  }
  function applyTheme() {
    d.documentElement.classList.toggle('dark', VC.theme === 'dark');
    var m = d.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', VC.theme === 'dark' ? '#0a1330' : '#f4f7fc');
  }
  VC.lang = detectLang();
  VC.theme = detectTheme();
  applyLangAttrs();
  applyTheme();

  /* ---------- Traductions ---------- */
  VC.t = function (key, vars) {
    var p = VC.page[VC.lang], s = (p && p[key]) || (BASE[VC.lang] && BASE[VC.lang][key]) ||
      (VC.page.fr && VC.page.fr[key]) || BASE.fr[key] || key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
    return s;
  };

  VC.apply = function (root) {
    root = root || d;
    var i, n;
    n = root.querySelectorAll('[data-i18n]');
    for (i = 0; i < n.length; i++) n[i].textContent = VC.t(n[i].getAttribute('data-i18n'));
    n = root.querySelectorAll('[data-i18n-ph]');
    for (i = 0; i < n.length; i++) n[i].setAttribute('placeholder', VC.t(n[i].getAttribute('data-i18n-ph')));
    n = root.querySelectorAll('[data-i18n-title]');
    for (i = 0; i < n.length; i++) {
      var v = VC.t(n[i].getAttribute('data-i18n-title'));
      n[i].setAttribute('title', v); n[i].setAttribute('aria-label', v);
    }
    d.title = VC.t('doc_title');
  };

  /* ---------- Utilitaires DOM ---------- */
  VC.el = function (tag, cls, text) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  };
  VC.badge = function (kind, text) { return VC.el('span', 'vc-badge vc-badge-' + kind, text); };
  VC.fmtSize = function (b) {
    if (b < 1024) return b + ' o';
    if (b < 1048576) return Math.round(b / 1024) + ' Ko';
    return (b / 1048576).toFixed(1).replace('.', ',') + ' Mo';
  };
  VC.toast = function (msg) {
    var t = VC.el('div', 'vc-toast', msg);
    t.setAttribute('role', 'status');
    d.body.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2800);
  };
  VC.copy = function (text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (ok, ko) {
      var ta = d.createElement('textarea');
      ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
      d.body.appendChild(ta); ta.select();
      try { d.execCommand('copy') ? ok() : ko(); } catch (e) { ko(e); }
      d.body.removeChild(ta);
    });
  };

  /* ---------- API Worker : aucun cache, validation stricte et états de chargement ---------- */
  var API_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
  var API_FILE_MAX = 5 * 1024 * 1024;
  var API_FILE_COUNT_MAX = 10;
  var API_TOTAL_MAX = 14 * 1024 * 1024;

  VC.api.validateFiles = function (list) {
    var files = Array.prototype.slice.call(list || []);
    if (files.length > API_FILE_COUNT_MAX) throw new Error('too-many-files');
    var total = 0;
    files.forEach(function (f) {
      if (!API_TYPES.includes(String(f.type || '').toLowerCase())) throw new Error('invalid-file-type');
      if (!f.size || f.size > API_FILE_MAX) throw new Error('file-size');
      total += f.size;
    });
    if (total > API_TOTAL_MAX) throw new Error('total-files-size');
    return files;
  };

  VC.api.post = function (path, body, fileList) {
    if (!VC.api.base) return Promise.reject(new Error('no-backend'));
    var files;
    try { files = VC.api.validateFiles(fileList || []); } catch (e) { return Promise.reject(e); }
    var options = { method: 'POST', cache: 'no-store', credentials: 'omit', redirect: 'error' };
    if (files.length) {
      var form = new FormData();
      form.append('payload', JSON.stringify(body || {}));
      files.forEach(function (f) { form.append('files', f, f.name); });
      options.body = form;
    } else {
      options.headers = { 'Content-Type': 'application/json' };
      options.body = JSON.stringify(body || {});
    }
    return fetch(VC.api.base.replace(/\/$/, '') + path, options).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (data) {
        if (!r.ok) {
          var err = new Error(data.error || ('http-' + r.status));
          err.status = r.status;
          throw err;
        }
        return data;
      });
    }).catch(function (error) {
      if (error && (error.name === 'TypeError' || !navigator.onLine)) {
        var offline = new Error('offline');
        offline.status = 503;
        throw offline;
      }
      throw error;
    });
  };

  VC.api.withBusy = function (button, task) {
    if (!button || button.disabled) return Promise.resolve(null);
    var label = button.innerHTML;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    var spinner = d.createElement('span');
    spinner.className = 'vc-spinner';
    spinner.setAttribute('aria-hidden', 'true');
    button.insertBefore(spinner, button.firstChild);
    return Promise.resolve().then(task).finally(function () {
      button.disabled = false;
      button.removeAttribute('aria-busy');
      if (spinner.parentNode) spinner.parentNode.removeChild(spinner);
      button.innerHTML = label;
    });
  };

  VC.api.analyzeDossier = function (data, files) { return VC.api.post('/api/analyze-dossier', data, files); };
  VC.api.generateAppeal = function (data, files) { return VC.api.post('/api/generate-appeal', data, files); };
  VC.api.interviewFeedback = function (data) { return VC.api.post('/api/interview-feedback', data); };

  VC.api.errorMessage = function (error) {
    var map = {
      'too-many-files': 'Maximum 10 fichiers.',
      'file-size': 'Chaque fichier doit peser au maximum 5 Mo.',
      'invalid-file-type': 'Format refusé : utilisez PDF, JPG, PNG ou WebP.',
      'total-files-size': 'Le total des fichiers doit rester inférieur à 14 Mo.',
      'too_many_files': 'Maximum 10 fichiers.',
      'file_too_large': 'Un fichier dépasse 5 Mo.',
      'total_files_too_large': 'Le total des fichiers dépasse la limite technique de 14 Mo.',
      'invalid_file_type': 'Le type ou le contenu réel d’un fichier est invalide.',
      'code': 'Code d’accès invalide.',
      'limit': 'Le quota de cette session est atteint.',
      'rate': 'Trop de requêtes. Réessayez dans quelques minutes.',
      'ai_unavailable': 'Le service IA est momentanément indisponible.',
      'ai_timeout': 'Le service IA met trop de temps à répondre.',
      'no-backend': 'Le service IA n’est pas configuré.',
      'offline': 'Service IA hors ligne (503). Vérifiez votre connexion puis réessayez.'
    };
    return map[error && error.message] || 'Une erreur est survenue. Vérifiez votre connexion et réessayez.';
  };

  /* ---------- Coquille commune : en-tête + barre mobile ---------- */
  var NAV = [
    ['dossier', 'view-dossier.html', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM9 12l2 2 4-4'],
    ['recours', 'view-recours.html', 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6'],
    ['entretien', 'view-entretien.html', 'M12 14a3 3 0 003-3V6a3 3 0 00-6 0v5a3 3 0 003 3zM6 11a6 6 0 0012 0M12 17v4']
  ];
  function icon(path, size) {
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
  }
  VC.icon = icon;

  function renderShell() {
    var head = d.getElementById('vc-header'), bot = d.getElementById('vc-bottomnav');
    if (head) {
      var tabs = '', i, it, opts = '';
      for (i = 0; i < NAV.length; i++) {
        it = NAV[i];
        tabs += '<a class="vc-tab' + (VC.active === it[0] ? ' is-active' : '') + '" href="' + it[1] + '"' +
          (VC.active === it[0] ? ' aria-current="page"' : '') + '>' + icon(it[2], 18) +
          '<span>' + VC.t('nav_' + it[0]) + '</span></a>';
      }
      for (var k in LANGS) opts += '<option value="' + k + '"' + (k === VC.lang ? ' selected' : '') + '>' + LANGS[k].label + '</option>';
      var moon = 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z';
      var sun = 'M12 4V2M12 22v-2M4 12H2M22 12h-2M5.6 5.6L4.2 4.2M19.8 19.8l-1.4-1.4M5.6 18.4l-1.4 1.4M19.8 4.2l-1.4 1.4M12 17a5 5 0 100-10 5 5 0 000 10z';
      head.innerHTML =
        '<header class="sticky top-0 z-30" style="background:color-mix(in srgb,var(--bg) 88%,transparent);' +
        'backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-bottom:1px solid var(--line)">' +
        '<div class="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">' +
        '<a href="index.html" class="flex items-center gap-2 font-bold" style="color:var(--ink);text-decoration:none" title="' + VC.t('hub') + '">' +
        '<span style="display:grid;place-items:center;width:2rem;height:2rem;border-radius:.6rem;background:var(--royal);color:#fff">' +
        icon('M5 12.5l4.5 4.5L19 7.5', 18) + '</span><span>Visa Checker</span></a>' +
        '<nav class="hidden md:flex ms-4 gap-1" aria-label="Navigation">' + tabs + '</nav>' +
        '<div class="ms-auto flex items-center gap-2">' +
        '<select id="vc-lang" class="vc-input" style="width:auto;min-height:2.25rem;padding:.2rem .5rem;font-size:14px" aria-label="' + VC.t('lang_label') + '">' + opts + '</select>' +
        '<button type="button" id="vc-theme" class="vc-btn vc-btn-icon" style="min-height:2.25rem;min-width:2.25rem;padding:.3rem" aria-label="' + VC.t('theme_toggle') + '" title="' + VC.t('theme_toggle') + '">' +
        icon(VC.theme === 'dark' ? sun : moon, 18) + '</button>' +
        '</div></div></header>';
      d.getElementById('vc-lang').addEventListener('change', function (e) { VC.setLang(e.target.value); });
      d.getElementById('vc-theme').addEventListener('click', VC.toggleTheme);
    }
    if (bot) {
      var b = '';
      for (var j = 0; j < NAV.length; j++) {
        b += '<a href="' + NAV[j][1] + '"' + (VC.active === NAV[j][0] ? ' class="is-active" aria-current="page"' : '') + '>' +
          icon(NAV[j][2], 22) + '<span>' + VC.t('nav_' + NAV[j][0]) + '</span></a>';
      }
      bot.innerHTML = '<nav class="vc-bottom" aria-label="Navigation">' + b + '</nav>';
    }
  }

  VC.setLang = function (l) {
    if (!LANGS[l]) return;
    VC.lang = l; LS.set('vc_lang', l);
    applyLangAttrs(); renderShell(); VC.apply(d);
    d.dispatchEvent(new CustomEvent('vc:lang'));
  };
  VC.toggleTheme = function () {
    VC.theme = VC.theme === 'dark' ? 'light' : 'dark';
    LS.set('vc_theme', VC.theme); applyTheme(); renderShell();
    d.dispatchEvent(new CustomEvent('vc:theme'));
  };

  /* Appel unique, en fin de <body> de chaque vue */
  VC.init = function (pageDict, active) {
    VC.page = pageDict || {}; VC.active = active || '';
    renderShell(); VC.apply(d);
    if ('serviceWorker' in navigator && d.querySelector('link[rel="manifest"]')) { /* le sw.js du hub gère le cache */ }
  };
})(window, document);
