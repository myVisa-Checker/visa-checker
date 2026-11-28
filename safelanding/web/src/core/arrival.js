import { ARRIVAL_PHASES, PURPOSE_LABELS, ACCOMMODATION_LABELS, STATUS_LABELS } from './constants.js';
import { evaluate, reliabilityOf } from './engine.js';
import { isMinor, validateProfile } from './profile.js';
import { parseDate, todayUTC, fmt, diffDays } from './dates.js';
import { ARRIVAL_BASE_STEPS, TRANSFER_MODES } from '../rules/arrival-base.js';

const MISSING = '[à renseigner]';
const OUTDATED = 'Cette information n’a pas été revérifiée récemment : ne la considérez pas comme une exigence actuelle et consultez la source officielle.';
const fill = (t, v) => t.replace(/\{(\w+)\}/g, (_, k) => v[k] || MISSING);

function applies(a, c) {
  if (!a) return true;
  if (a.nationalities && !a.nationalities.includes(c.p.nationality)) return false;
  if (a.excludeNationalities && a.excludeNationalities.includes(c.p.nationality)) return false;
  if (a.purposes && !a.purposes.includes(c.p.purpose)) return false;
  if (a.accommodations && !a.accommodations.includes(c.p.accommodation)) return false;
  if (a.minorOnly && !c.minor) return false;
  if (a.hasTransit != null && a.hasTransit !== (c.p.transit.length > 0)) return false;
  if (a.bags === 'yes' && c.arrival.checkedBags === false) return false;
  if (a.bags === 'no' && c.arrival.checkedBags !== false) return false;
  return true;
}

// Fusion par id : socle -> pack du pays -> pack de l'aéroport (même logique de surcharge que le Module 1).
// Listes ordonnées du moins au plus prioritaire ; pour chaque id, la 1re entrée (la plus prioritaire) qui s'applique est retenue.
function resolveById(lists, c) {
  const m = new Map();
  for (const l of lists) for (const x of l || []) { if (!m.has(x.id)) m.set(x.id, []); m.get(x.id).unshift(x); }
  return [...m.values()].map((cands) => cands.find((x) => applies(x.appliesTo, c))).filter(Boolean);
}

function toItem(step, c, extra = {}) {
  const official = step.kind === 'official';
  const v = official ? (step.verification || { status: 'unverified', lastVerified: null, source: null, scope: null }) : null;
  const reliability = official ? reliabilityOf(v, c.today) : 'practical';
  let text = fill(step.text, c.vars), notice = null;
  if (official && reliability === 'outdated') { text = OUTDATED; notice = 'Information obsolète.'; }
  else if (official && reliability === 'unverified') notice = 'Information non vérifiée : à confirmer à la source officielle.';
  const id = `arrival:${step.id}`;
  return { id, stepId: step.id, phase: step.phase, title: step.title, text, kind: step.kind, reliability, notice,
    source: v ? v.source || null : null, otherSources: v ? v.otherSources || [] : [], lastVerified: v ? v.lastVerified || null : null, scope: v ? v.scope || null : null,
    handled: !!c.handled[id], ...extra };
}

function briefing(c, m1) {
  const { p, docs, arrival } = c, tk = docs.ticket || {}, lg = docs.lodging || {}, fn = docs.funds || {};
  const end = fmt(c.stayEnd);
  const q = (question, answer) => ({ question, answer: answer || MISSING, missing: !answer });
  return {
    note: 'Questions fréquemment posées, à titre d’exemple : ce n’est pas une liste officielle. Répondez toujours avec vos informations réelles.',
    questions: [
      q('Quel est le motif de votre voyage ?', PURPOSE_LABELS[p.purpose]),
      q('Combien de temps comptez-vous rester ?', `${p.stayDays} jour(s), jusqu’au ${end}`),
      q('Où logerez-vous ?', lg.address || (p.accommodation ? ACCOMMODATION_LABELS[p.accommodation] : '')),
      q('Avez-vous un billet retour ou de continuation ?', tk.return ? `Retour le ${tk.return}` : tk.onward ? 'Billet de continuation' : ''),
      q('Disposez-vous de ressources suffisantes ?', fn.amount != null ? `${fn.amount} ${fn.currency || ''}`.trim() : ''),
    ],
    documents: m1.items.filter((i) => ['passport', 'entry-authorization', 'ticket', 'lodging', 'funds', 'insurance'].includes(i.id) || i.id.startsWith('transit:'))
      .map((i) => ({ id: i.id, title: i.title, status: i.status, statusLabel: STATUS_LABELS[i.status], reliability: i.reliability, message: i.message })),
  };
}

function transferItems(c, airportTransfers) {
  const modes = resolveById([TRANSFER_MODES, airportTransfers], c);
  const b = c.arrival.budget;
  const items = modes.map((m) => {
    const fit = b ? (m.budgets || []).includes(b) : null;
    const step = { id: `transfer-${m.id}`, phase: 'transfer', title: m.title, text: m.text, kind: m.kind || 'practical', verification: m.verification };
    return toItem(step, c, { option: true, fit });
  });
  return items.sort((x, y) => (y.fit === true) - (x.fit === true));
}

export function evaluateArrival(state, { registry, airportRegistry, today = todayUTC(), countryName = (c) => c } = {}) {
  const m1 = evaluate(state, { registry, today });
  if (!m1.valid) return { valid: false, errors: m1.errors, phases: [], alerts: [], progress: { total: 0, done: 0, percent: 0 }, m1 };
  return build(state, m1, { registry, airportRegistry, today, countryName });
}

function build(state, m1, { registry, airportRegistry, today, countryName }) {
  const p = validateProfile(state.profile, today).profile, departure = parseDate(p.departureDate);
  const arrival = state.arrival || { airport: '', budget: '', checkedBags: null }, docs = state.documents || {};
  const stayEnd = new Date(departure.getTime() + p.stayDays * 864e5);
  const lg = docs.lodging || {};
  const c = { p, docs, arrival, today, departure, stayEnd, minor: isMinor(p, departure), handled: state.handled || {},
    vars: { destination: countryName(p.destination), nationality: countryName(p.nationality), address: lg.address || '', hostContact: lg.hostContact || '' } };
  const pack = registry ? registry.get(p.destination) : null, airport = airportRegistry && arrival.airport ? airportRegistry.get(arrival.airport) : null;
  const steps = resolveById([ARRIVAL_BASE_STEPS, pack && pack.arrival, airport && airport.steps], c);
  const items = [...steps.map((s) => toItem(s, c)), ...transferItems(c, airport && airport.transfers)];
  const phases = ARRIVAL_PHASES.map((ph) => ({ ...ph, items: items.filter((i) => i.phase === ph.id) })).filter((ph) => ph.items.length);

  const alerts = [], add = (type, severity, message, origin = 'module2') => alerts.push({ type, severity, message, origin });
  for (const a of m1.alerts) if (a.type !== 'reliability') alerts.push({ ...a, origin: 'module1' });
  if (airport && airport.country !== p.destination) add('inconsistency', 'medium', `L’aéroport ${airport.iata} se trouve dans le pays ${airport.country}, différent de la destination du profil (${p.destination}) : s’agit-il d’une correspondance ?`);
  if (arrival.airport && !airport) add('reliability', 'low', `Aucune donnée disponible pour l’aéroport ${arrival.airport} : conseils généraux affichés.`);
  const off = items.filter((i) => i.kind === 'official' && i.reliability !== 'verified').length;
  if (off) add('reliability', 'medium', `${off} information(s) officielle(s) non vérifiée(s) ou obsolète(s) : confirmez-les à la source officielle.`);
  const d = diffDays(today, departure);
  if (d < 0) add('deadline', 'low', 'La date de départ du profil est passée : vérifiez vos dates.');
  const rank = { high: 0, medium: 1, low: 2 };
  alerts.sort((a, b) => rank[a.severity] - rank[b.severity]);

  const actionable = items.filter((i) => i.phase !== 'incidents' && !(i.option && i.fit === false));
  const done = actionable.filter((i) => i.handled).length;
  return { valid: true, errors: [], phases, alerts, briefing: briefing(c, m1), airport: { iata: arrival.airport || null, known: !!airport, name: airport ? airport.name : null },
    progress: { total: actionable.length, done, percent: actionable.length ? Math.round((done / actionable.length) * 100) : 0 },
    m1: { progress: m1.progress, packId: m1.packId } };
}
