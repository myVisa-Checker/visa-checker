import {
  evaluate, createRegistry, ALL_PACKS, STATUS_LABELS, CATEGORIES, CATEGORY_LABELS, PURPOSES, PURPOSE_LABELS,
  ACCOMMODATIONS, ACCOMMODATION_LABELS, emptyState, parseState, serializeState, STATE_KEY,
  validateProfile, createChangeReport, explainItem,
  evaluateArrival, createAirportRegistry, AIRPORT_PACKS, BUDGET_LABELS, destinationsFor,
} from './src/index.js';

const registry = createRegistry(ALL_PACKS);
const airportRegistry = createAirportRegistry(AIRPORT_PACKS);
const dn = (() => { try { return new Intl.DisplayNames(['fr'], { type: 'region' }); } catch { return null; } })();
const countryName = (c) => { try { return (dn && dn.of(c)) || c; } catch { return c; } };
const $ = (id) => document.getElementById(id);
const ICONS = { to_prepare: '○', to_verify: '?', compliant: '✓', missing: '✕', expired: '!', not_applicable: '–' };
let state = load();

function load() { try { return parseState(localStorage.getItem(STATE_KEY)); } catch { return emptyState(); } }
function save() { try { localStorage.setItem(STATE_KEY, serializeState(state)); } catch { /* stockage indisponible */ } }

// Construction DOM par nœuds : tout texte est inséré comme texte, jamais comme balisage.
function h(tag, attrs = {}, ...kids) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) { if (v != null && v !== false) el.setAttribute(k, v === true ? '' : v); }
  for (const kid of kids.flat()) if (kid != null) el.append(kid);
  return el;
}
const safeUrl = (u) => { try { const x = new URL(u); return x.protocol === 'https:' || x.protocol === 'http:' ? x.href : null; } catch { return null; } };
// Sources : principale + « voir aussi » ; champ d'application (pays, aéroport, nationalité). Liens http(s) uniquement.
function sourceNodes(i) {
  const out = [], add = (s) => { const u = s && safeUrl(s.url); out.push(u ? h('a', { href: u, target: '_blank', rel: 'noopener noreferrer' }, s.name) : (s ? s.name : 'à identifier')); };
  add(i.source); for (const o of i.otherSources || []) { out.push(' · Voir aussi : '); add(o); }
  return out;
}
function scopeText(i) {
  const s = i.scope; if (!s) return '';
  const parts = [];
  if (s.countries) parts.push(`pays ${s.countries.slice(0, 4).join(', ')}`);
  if (s.airports) parts.push(`aéroport ${s.airports.join(', ')}`);
  if (s.nationalities) parts.push(`nationalité ${s.nationalities.join(', ')}`);
  return parts.length ? ` — Champ : ${parts.join(' ; ')}` : '';
}

function countries() {
  const dn = new Intl.DisplayNames(['fr'], { type: 'region' }), skip = new Set(['EU', 'UN', 'EZ', 'ZZ', 'QO', 'XA', 'XB']);
  const out = [], A = 65;
  for (let i = 0; i < 26; i++) for (let j = 0; j < 26; j++) {
    const code = String.fromCharCode(A + i, A + j);
    let name; try { name = dn.of(code); } catch { continue; }
    if (name && name !== code && !skip.has(code)) out.push([code, name]);
  }
  return out.sort((a, b) => a[1].localeCompare(b[1], 'fr'));
}
function fillSelect(sel, pairs) {
  sel.append(h('option', { value: '' }, 'Choisir…'));
  for (const [v, t] of pairs) sel.append(h('option', { value: v }, t));
}

function renderItem(i) {
  const rel = i.reliability === 'verified' ? `Vérifié le ${i.lastVerified}`
    : i.reliability === 'outdated' ? `Obsolète (dernière vérification : ${i.lastVerified})` : 'Non vérifié';
  const chk = h('input', { type: 'checkbox', id: `h-${i.id}` });
  chk.checked = i.handled;
  chk.addEventListener('change', () => { if (chk.checked) state.handled[i.id] = true; else delete state.handled[i.id]; save(); render(); });
  const report = h('button', { type: 'button', class: 'linkbtn' }, 'Signaler un changement');
  report.addEventListener('click', () => {
    const note = window.prompt('Quel changement réglementaire avez-vous constaté ?');
    if (note == null) return;
    try { state.changeReports.push(createChangeReport({ ruleId: i.ruleId, packId: registry.get(state.profile.destination)?.id || '', note })); save(); window.alert('Signalement enregistré sur cet appareil.'); }
    catch (e) { window.alert(e.message); }
  });
  return h('li', { class: 'item', 'data-status': i.status },
    h('span', { class: 'badge' }, `${ICONS[i.status]} ${STATUS_LABELS[i.status]}`),
    h('h3', {}, i.title),
    h('p', {}, i.message),
    h('p', { class: 'meta' }, 'Source : ', ...sourceNodes(i), ` — ${rel}${scopeText(i)}`),
    h('div', { class: 'row' }, h('label', { class: 'check', for: chk.id }, chk, 'Traité'), report));
}

function render() { renderM1(); renderArrival(); }

function renderM1() {
  const r = evaluate(state, { registry });
  $('empty').hidden = r.valid; $('checklist').hidden = !r.valid;
  $('progress-section').hidden = !r.valid; $('alerts-section').hidden = !r.valid || !r.alerts.length;
  if (!r.valid) return;
  $('progress').value = r.progress.percent;
  $('progress-text').textContent = `${r.progress.done} élément(s) sur ${r.progress.total} traités (${r.progress.percent} %). ${r.progress.unverified} règle(s) à confirmer officiellement.`;
  const al = $('alerts'); al.replaceChildren(...r.alerts.map((a) => h('li', { 'data-sev': a.severity }, a.message)));
  const box = $('categories'); box.replaceChildren();
  for (const cat of CATEGORIES) {
    const items = r.items.filter((i) => i.category === cat); if (!items.length) continue;
    box.append(h('details', { open: items.some((i) => i.status !== 'compliant') },
      h('summary', {}, `${CATEGORY_LABELS[cat]} (${items.length})`), h('ul', { class: 'items' }, items.map(renderItem))));
  }
}

function fillForm() {
  const f = $('profile-form').elements, p = state.profile, d = state.documents;
  const set = (n, v) => { f[n].value = v == null ? '' : v; };
  for (const n of ['nationality', 'residence', 'departureDate', 'stayDays', 'purpose', 'accommodation', 'birthDate']) set(n, p[n]);
  f.showAllDestinations.checked = false; refreshDestinations(f.destination, f.showAllDestinations, $('dest-hint'), p.nationality, p.destination);
  set('transit', p.transit.join(', '));
  const pp = d.passport || {}, tk = d.ticket || {}, lg = d.lodging || {}, fn = d.funds || {}, ins = d.insurance || {};
  set('passport_expiry', pp.expiry); set('passport_issue', pp.issueDate); set('passport_blank', pp.blankPages);
  set('ticket_outbound', tk.outbound); set('ticket_return', tk.return); f.ticket_onward.checked = !!tk.onward;
  set('lodging_address', lg.address); set('lodging_checkIn', lg.checkIn); set('lodging_checkOut', lg.checkOut); set('lodging_host', lg.hostContact);
  const ar = state.arrival || {};
  set('arrival_airport', ar.airport); set('arrival_budget', ar.budget); set('arrival_bags', ar.checkedBags === true ? 'yes' : ar.checkedBags === false ? 'no' : '');
  set('funds_amount', fn.amount); set('funds_currency', fn.currency); set('ins_from', ins.validFrom); set('ins_to', ins.validTo);
}

function readForm() {
  const f = $('profile-form').elements, v = (n) => f[n].value;
  const n = (name) => (v(name) === '' ? null : Number(v(name)));
  return {
    profile: { nationality: v('nationality'), residence: v('residence'), destination: v('destination'), transit: v('transit'),
      departureDate: v('departureDate'), stayDays: v('stayDays'), purpose: v('purpose'), accommodation: v('accommodation'), birthDate: v('birthDate') },
    arrival: { airport: v('arrival_airport'), budget: v('arrival_budget'), checkedBags: v('arrival_bags') === 'yes' ? true : v('arrival_bags') === 'no' ? false : null },
    documents: {
      passport: { expiry: v('passport_expiry'), issueDate: v('passport_issue'), blankPages: n('passport_blank') },
      ticket: { outbound: v('ticket_outbound'), return: v('ticket_return'), onward: f.ticket_onward.checked },
      lodging: { address: v('lodging_address'), checkIn: v('lodging_checkIn'), checkOut: v('lodging_checkOut'), hostContact: v('lodging_host') },
      funds: { amount: n('funds_amount'), currency: v('funds_currency') },
      insurance: { validFrom: v('ins_from'), validTo: v('ins_to') },
    },
  };
}

// ---------- Module 2 : Airport Arrival (même état, même profil, même moteur de fiabilité) ----------
function showTab(id) {
  const m2 = id === 'm2';
  $('panel-m1').hidden = m2; $('panel-m2').hidden = !m2;
  $('tab-m1').setAttribute('aria-selected', String(!m2)); $('tab-m2').setAttribute('aria-selected', String(m2));
  $('title').textContent = m2 ? 'Airport Arrival' : 'Before Departure';
  $('intro').textContent = m2 ? 'Du hall d’arrivée à votre destination : contrôle, bagages, douane, sortie et transfert.'
    : 'Vérifiez vos documents, autorisations et justificatifs avant de partir, selon votre nationalité et votre destination.';
  document.title = `${$('title').textContent} — SafeLanding`;
}
const REL_LABELS = { verified: 'Vérifié', outdated: 'Obsolète', unverified: 'Non vérifié' };
function renderArrivalItem(i) {
  const chk = h('input', { type: 'checkbox', id: `h-${i.id}` }); chk.checked = i.handled;
  chk.addEventListener('change', () => { if (chk.checked) state.handled[i.id] = true; else delete state.handled[i.id]; save(); render(); });
  const official = i.kind === 'official';
  return h('li', { class: 'item', 'data-kind': i.kind },
    h('span', { class: 'badge' }, official ? `Information officielle · ${REL_LABELS[i.reliability]}` : 'Conseil pratique'),
    i.option && i.fit === true ? h('span', { class: 'fit' }, ' Adapté à votre budget') : null,
    h('h3', {}, i.title), h('p', {}, i.text), i.notice ? h('p', { class: 'meta' }, i.notice) : null,
    official ? h('p', { class: 'meta' }, 'Source : ', ...sourceNodes(i), i.lastVerified ? ` — vérifié le ${i.lastVerified}` : ' — jamais vérifié', scopeText(i)) : null,
    h('label', { class: 'check', for: chk.id }, chk, 'Fait'));
}
function renderArrival() {
  const r = evaluateArrival(state, { registry, airportRegistry, countryName });
  $('m2-empty').hidden = r.valid; $('m2-body').hidden = !r.valid;
  if (!r.valid) return;
  $('m2-airport').textContent = r.airport.iata ? (r.airport.known ? `Aéroport : ${r.airport.name} (${r.airport.iata})` : `Aéroport ${r.airport.iata} : aucune donnée spécifique, conseils généraux affichés.`)
    : 'Aéroport non renseigné : conseils généraux affichés. Vous pouvez indiquer son code dans votre profil.';
  $('m2-progress').value = r.progress.percent;
  $('m2-progress-text').textContent = `${r.progress.done} étape(s) sur ${r.progress.total} faites (${r.progress.percent} %).`;
  $('m2-alerts').replaceChildren(...r.alerts.map((a) => h('li', { 'data-sev': a.severity }, (a.origin === 'module1' ? 'Avant le départ : ' : '') + a.message)));
  $('m2-brief-note').textContent = r.briefing.note;
  $('m2-questions').replaceChildren(...r.briefing.questions.map((q) => h('li', {}, h('strong', {}, q.question), ' ', q.answer, q.missing ? ' — complétez votre profil.' : '')));
  $('m2-docs').replaceChildren(...r.briefing.documents.map((d) => h('li', { 'data-status': d.status }, h('span', { class: 'badge' }, `${ICONS[d.status]} ${d.statusLabel}`), ' ', d.title)));
  const box = $('m2-phases'); box.replaceChildren();
  r.phases.forEach((ph, idx) => box.append(h('details', { open: idx < 2 }, h('summary', {}, `${ph.title} (${ph.items.length})`), h('ul', { class: 'items' }, ph.items.map(renderArrivalItem)))));
}

// ---------- Choix nationalité → destinations (liste limitée aux pays « sans visa » connus de SafeLanding) ----------
let ALL = [];
const HINT_ALL = 'Tous les pays sont affichés : un visa peut être exigé, la checklist le vérifiera.';
const HINT_NONE = 'Aucune destination sans visa n’est encore enregistrée pour cette nationalité : cochez « Afficher aussi les pays qui peuvent exiger un visa ».';
const HINT_LIST = 'Liste limitée aux destinations sans visa selon la base SafeLanding, encore en cours de constitution et à confirmer à la source officielle.';
function refreshDestinations(sel, box, hint, nationality, current) {
  let pairs = [];
  if (!box.checked) {
    pairs = destinationsFor(nationality, registry).map((d) => [d.country, `${countryName(d.country)} — sans visa${d.reliability === 'verified' ? '' : ' (à confirmer)'}`]);
    if (current && !pairs.some((x) => x[0] === current)) box.checked = true; // ne jamais perdre un choix déjà fait
  }
  if (box.checked) pairs = ALL;
  sel.replaceChildren(); fillSelect(sel, pairs);
  sel.value = pairs.some((x) => x[0] === current) ? current : '';
  hint.textContent = !nationality ? 'Choisissez d’abord votre nationalité.' : box.checked ? HINT_ALL : pairs.length ? HINT_LIST : HINT_NONE;
}

function init() {
  const list = countries(); ALL = list;
  for (const n of ['nationality', 'residence']) fillSelect($('profile-form').elements[n], list);
  fillSelect($('profile-form').elements.purpose, PURPOSES.map((k) => [k, PURPOSE_LABELS[k]]));
  fillSelect($('profile-form').elements.accommodation, ACCOMMODATIONS.map((k) => [k, ACCOMMODATION_LABELS[k]]));
  fillSelect($('profile-form').elements.arrival_budget, Object.entries(BUDGET_LABELS));
  fillSelect($('profile-form').elements.arrival_bags, [['yes', 'Oui'], ['no', 'Non']]);
  $('tab-m1').addEventListener('click', () => showTab('m1')); $('tab-m2').addEventListener('click', () => showTab('m2'));
  const dlg = $('profile-dialog');
  const pf = $('profile-form').elements, qf = $('quickstart').elements;
  const dlgRefresh = () => refreshDestinations(pf.destination, pf.showAllDestinations, $('dest-hint'), pf.nationality.value, pf.destination.value);
  pf.nationality.addEventListener('change', dlgRefresh); pf.showAllDestinations.addEventListener('change', dlgRefresh);
  fillSelect(qf.qs_nationality, list);
  const qsRefresh = () => refreshDestinations(qf.qs_destination, qf.qs_all, $('qs-hint'), qf.qs_nationality.value, qf.qs_destination.value);
  const syncQuickStart = () => { qf.qs_all.checked = false; qf.qs_nationality.value = state.profile.nationality || ''; refreshDestinations(qf.qs_destination, qf.qs_all, $('qs-hint'), qf.qs_nationality.value, state.profile.destination); };
  qf.qs_nationality.addEventListener('change', qsRefresh); qf.qs_all.addEventListener('change', qsRefresh);
  $('quickstart').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!qf.qs_nationality.value || !qf.qs_destination.value) { $('qs-hint').textContent = 'Choisissez votre nationalité et votre destination.'; return; }
    state = parseState(serializeState({ ...state, profile: { ...state.profile, nationality: qf.qs_nationality.value, destination: qf.qs_destination.value } }));
    save(); fillForm(); $('form-errors').replaceChildren(); dlg.showModal();
  });
  syncQuickStart();
  $('open-profile').addEventListener('click', () => { fillForm(); $('form-errors').replaceChildren(); dlg.showModal(); });
  $('cancel-profile').addEventListener('click', () => dlg.close());
  $('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const next = readForm(), v = validateProfile(next.profile);
    if (!v.valid) { $('form-errors').replaceChildren(...v.errors.map((x) => h('li', {}, x.message))); return; }
    state = parseState(serializeState({ ...state, profile: v.profile, documents: next.documents, arrival: next.arrival }));
    save(); dlg.close(); render();
  });
  $('export').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([serializeState(state)], { type: 'application/json' }));
    const a = h('a', { href: url, download: 'safelanding-donnees.json' }); document.body.append(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });
  $('reset').addEventListener('click', () => {
    if (!window.confirm('Effacer le profil, les documents et la checklist de cet appareil ?')) return;
    state = emptyState(); try { localStorage.removeItem(STATE_KEY); } catch { /* ignore */ } syncQuickStart(); render();
  });
  const net = () => { $('net').textContent = navigator.onLine ? '' : 'Hors connexion : vos données enregistrées restent disponibles.'; };
  window.addEventListener('online', net); window.addEventListener('offline', net); net();
  render();
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) navigator.serviceWorker.register('sw.js').catch(() => {});
}
init();
export { explainItem };
