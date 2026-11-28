import { parseDate } from './dates.js';
import { normalizeProfile } from './profile.js';

export const STATE_VERSION = 2;
export const BUDGETS = Object.freeze(['low', 'medium', 'high']);
const IATA = /^[A-Z]{3}$/;
export const STATE_KEY = 'safelanding.state';
const str = (v, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const date = (v) => (parseDate(v) ? v : '');
const num = (v, max) => { const n = Number(v); return v !== '' && v != null && Number.isFinite(n) && n >= 0 && n <= max ? n : null; };

function sanitizeArrival(a) {
  a = a && typeof a === 'object' ? a : {};
  const ap = typeof a.airport === 'string' ? a.airport.trim().toUpperCase() : '';
  return { airport: IATA.test(ap) ? ap : '', budget: BUDGETS.includes(a.budget) ? a.budget : '',
    checkedBags: a.checkedBags === true || a.checkedBags === false ? a.checkedBags : null };
}

export function emptyState() {
  return { version: STATE_VERSION, profile: normalizeProfile({}), documents: {}, handled: {}, changeReports: [], arrival: sanitizeArrival({}) };
}

// Migrations : chaque entrée convertit la version N en N+1 SANS perte. Ajouter une entrée à chaque évolution.
const MIGRATIONS = { 1: (s) => ({ ...s, version: 2, arrival: {} }) };
function migrate(raw) {
  let s = raw;
  while (s.version < STATE_VERSION) { const m = MIGRATIONS[s.version]; if (!m) return null; s = m(s); }
  return s;
}

// Liste blanche stricte : tout champ inconnu est supprimé (donc jamais de n° de passeport, de MRZ, etc.).
export function sanitizeState(raw) {
  // Un changement de version ne réinitialise jamais les données : migration, ou lecture « au mieux » d'une version future.
  if (!raw || typeof raw !== 'object' || !Number.isInteger(raw.version) || raw.version < 1) return emptyState();
  raw = raw.version <= STATE_VERSION ? migrate(raw) : raw;
  if (!raw) return emptyState();
  const d = raw.documents && typeof raw.documents === 'object' ? raw.documents : {};
  const pp = d.passport || {}, tk = d.ticket || {}, lg = d.lodging || {}, fn = d.funds || {}, ins = d.insurance || {};
  const handled = {};
  for (const [k, v] of Object.entries(raw.handled && typeof raw.handled === 'object' ? raw.handled : {}).slice(0, 200)) {
    if (/^[a-z0-9_:.-]{1,80}$/i.test(k) && v === true) handled[k] = true;
  }
  const reports = (Array.isArray(raw.changeReports) ? raw.changeReports : []).slice(0, 50).map((r) => ({
    ruleId: str(r && r.ruleId, 80), packId: str(r && r.packId, 40), note: str(r && r.note, 500), createdAt: str(r && r.createdAt, 30),
  }));
  return {
    version: STATE_VERSION, profile: normalizeProfile(raw.profile || {}),
    documents: {
      passport: { expiry: date(pp.expiry), issueDate: date(pp.issueDate), blankPages: num(pp.blankPages, 200) },
      ticket: { outbound: date(tk.outbound), return: date(tk.return), onward: tk.onward === true },
      lodging: { address: str(lg.address), checkIn: date(lg.checkIn), checkOut: date(lg.checkOut), hostContact: str(lg.hostContact) },
      funds: { amount: num(fn.amount, 1e9), currency: str(fn.currency, 3).toUpperCase() },
      insurance: { validFrom: date(ins.validFrom), validTo: date(ins.validTo) },
    },
    handled, changeReports: reports, arrival: sanitizeArrival(raw.arrival),
  };
}
export const serializeState = (s) => JSON.stringify(sanitizeState(s));
export function parseState(text) {
  try { return sanitizeState(JSON.parse(text)); } catch { return emptyState(); }
}
