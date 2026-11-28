import { STATUS as S, CATEGORIES, STALE_DAYS, PURPOSE_LABELS } from './constants.js';
import { parseDate, addDays, addMonths, diffDays, todayUTC, fmt } from './dates.js';
import { validateProfile, isMinor } from './profile.js';
import { BASE_RULES, TRANSIT_RULE } from '../rules/base.js';
import { buildAlerts } from './alerts.js';

const res = (status, message) => ({ status, message });

function matches(rule, p, minor) {
  const a = rule.appliesTo; if (!a) return true;
  if (a.nationalities && !a.nationalities.includes(p.nationality)) return false;
  if (a.excludeNationalities && a.excludeNationalities.includes(p.nationality)) return false;
  if (a.purposes && !a.purposes.includes(p.purpose)) return false;
  if (a.minorOnly && !minor) return false;
  return true;
}

const HANDLERS = {
  passport_validity(c, r) {
    const doc = c.docs.passport, prm = r.params || {};
    const exp = doc && parseDate(doc.expiry);
    if (!exp) return res(S.TO_PREPARE, 'Renseignez la date d’expiration de votre passeport.');
    if (exp < c.today) return res(S.EXPIRED, `Votre passeport a expiré le ${fmt(exp)}.`);
    const need = prm.monthsAfterStayEnd == null ? c.stayEnd : addMonths(c.stayEnd, prm.monthsAfterStayEnd);
    if (exp < need) {
      return res(S.MISSING, `Passeport insuffisant : il expire le ${fmt(exp)}, validité requise jusqu’au ${fmt(need)}.`);
    }
    const notes = [];
    if (prm.maxAgeYears != null) {
      const iss = parseDate(doc.issueDate);
      if (!iss) notes.push('date de délivrance à renseigner');
      else if (addMonths(iss, prm.maxAgeYears * 12) < c.departure) {
        return res(S.MISSING, `Passeport trop ancien : délivré le ${fmt(iss)} (maximum ${prm.maxAgeYears} ans).`);
      }
    }
    if (prm.blankPages != null) {
      if (doc.blankPages == null) notes.push('nombre de pages vierges à renseigner');
      else if (doc.blankPages < prm.blankPages) return res(S.MISSING, `Pages vierges insuffisantes (${doc.blankPages}/${prm.blankPages}).`);
    }
    if (prm.monthsAfterStayEnd == null) return res(S.TO_VERIFY, 'La validité exigée n’est pas connue : consultez la source officielle.');
    if (notes.length) return res(S.TO_VERIFY, `Validité suffisante ; ${notes.join(' ; ')}.`);
    return res(S.COMPLIANT, `Passeport valide jusqu’au ${fmt(exp)} (exigé : ${fmt(need)}).`);
  },
  entry_authorization(c, r) {
    const n = (r.params && r.params.name) || 'visa ou autorisation';
    return res(S.TO_VERIFY, `Vérifiez si un(e) ${n} est exigé(e) pour la nationalité ${c.p.nationality} vers ${c.p.destination}. SafeLanding ne décide jamais à votre place.`);
  },
  // Exemption de visa pour une nationalité (règle de pack avec appliesTo.nationalities) ; jamais « Conforme » tant que la règle n'est pas vérifiée.
  visa_exemption(c, r) {
    const prm = r.params || {}, name = prm.name || 'l’exemption de visa';
    if (prm.purposes && !prm.purposes.includes(c.p.purpose)) {
      return res(S.TO_VERIFY, `Le motif « ${PURPOSE_LABELS[c.p.purpose] || c.p.purpose} » n’est pas couvert par ${name} : un visa peut être exigé. Vérifiez auprès de la source officielle.`);
    }
    if (prm.maxStayDays != null && c.p.stayDays > prm.maxStayDays) {
      return res(S.TO_VERIFY, `Séjour de ${c.p.stayDays} jours, au-delà des ${prm.maxStayDays} jours prévus par ${name} : prolongation ou visa à vérifier.`);
    }
    return res(S.NOT_APPLICABLE, `Selon la règle enregistrée (${name}), aucun visa n’est exigé pour ce motif et cette durée${prm.maxStayDays != null ? ` (jusqu’à ${prm.maxStayDays} jours)` : ''}.`);
  },
  transit_check() { return res(S.TO_VERIFY, 'Vérifiez les conditions de transit et un éventuel visa de transit auprès de la source officielle.'); },
  manual(c, r) { return res(S.TO_VERIFY, (r.params && r.params.text) || 'À vérifier auprès de la source officielle.'); },
  ticket(c) {
    const t = c.docs.ticket;
    if (!t || (!t.outbound && !t.return && !t.onward)) return res(S.TO_PREPARE, 'Ajoutez les dates de votre billet (aller et retour ou continuation).');
    if (t.return || t.onward) return res(S.COMPLIANT, 'Billet de retour ou de continuation renseigné.');
    return res(S.MISSING, 'Aucun billet de retour ni de continuation.');
  },
  lodging(c) {
    const l = c.docs.lodging;
    if (!l || (!l.address && !l.checkIn && !l.hostContact)) return res(S.TO_PREPARE, 'Ajoutez l’adresse et les dates de votre hébergement.');
    if (!l.address) return res(S.MISSING, 'Adresse d’hébergement manquante.');
    if (c.p.accommodation === 'private' && !l.hostContact) {
      return res(S.MISSING, 'Hébergement chez un particulier : ajoutez les coordonnées de l’hôte ; une lettre d’invitation peut être demandée (à vérifier).');
    }
    return res(S.COMPLIANT, 'Hébergement renseigné.');
  },
  funds(c, r) {
    const f = c.docs.funds, prm = r.params || {};
    if (!f || f.amount == null) return res(S.TO_PREPARE, 'Indiquez les ressources dont vous disposez pour le séjour.');
    if (prm.minPerDay == null) return res(S.TO_VERIFY, 'Montant exigé inconnu : consultez la source officielle.');
    const need = prm.minPerDay * c.p.stayDays;
    if (prm.currency && f.currency && prm.currency !== f.currency) return res(S.TO_VERIFY, `Devise différente (${f.currency} au lieu de ${prm.currency}) : conversion à vérifier.`);
    return f.amount >= need ? res(S.COMPLIANT, `Ressources suffisantes (${f.amount} ≥ ${need}).`)
      : res(S.MISSING, `Ressources insuffisantes : ${f.amount} déclarés pour ${need} requis (${c.p.stayDays} jours).`);
  },
  insurance(c, r) {
    const req = r.params ? r.params.required : null, raw = c.docs.insurance;
    const i = raw && (raw.validFrom || raw.validTo) ? raw : null; // objet vide = rien de renseigné
    if (req === false) return res(S.NOT_APPLICABLE, 'Assurance non exigée selon la règle ; elle reste recommandée.');
    if (req == null && !i) return res(S.TO_VERIFY, 'Exigence d’assurance inconnue : consultez la source officielle.');
    const from = i && parseDate(i.validFrom), to = i && parseDate(i.validTo);
    if (!from || !to) return res(S.TO_PREPARE, 'Ajoutez les dates de couverture de votre assurance.');
    if (from > c.departure || to < c.stayEnd) return res(S.MISSING, 'L’assurance ne couvre pas tout le séjour.');
    return req == null ? res(S.TO_VERIFY, 'Couverture complète ; exigence du pays à confirmer.') : res(S.COMPLIANT, 'Assurance couvrant tout le séjour.');
  },
};

export function reliabilityOf(v, today) {
  if (!v || v.status !== 'verified') return 'unverified';
  const lv = parseDate(v.lastVerified);
  return lv && diffDays(lv, today) <= STALE_DAYS && diffDays(lv, today) >= 0 ? 'verified' : 'outdated';
}

function toItem(rule, raw, ctx, id, state) {
  const reliability = reliabilityOf(rule.verification, ctx.today);
  let status = raw.status, downgraded = false;
  if ((status === S.COMPLIANT || status === S.NOT_APPLICABLE) && reliability !== 'verified') { status = S.TO_VERIFY; downgraded = true; }
  const v = rule.verification || {};
  if (downgraded) raw = { ...raw, message: `${raw.message} Résultat à confirmer : règle ${reliability === 'outdated' ? 'obsolète' : 'non vérifiée'}.` };
  const handled = !!(state.handled && state.handled[id]);
  return { id, ruleId: rule.id, category: rule.category, title: rule.title, status, computedStatus: raw.status, downgraded,
    message: raw.message, reliability, source: v.source || null, otherSources: v.otherSources || [], scope: v.scope || null, lastVerified: v.lastVerified || null, handled,
    needsHumanCheck: reliability !== 'verified' || status === S.TO_VERIFY };
}

export function computeProgress(items) {
  const ok = (i) => i.status === S.COMPLIANT || i.status === S.NOT_APPLICABLE ||
    (i.handled && i.status !== S.MISSING && i.status !== S.EXPIRED);
  const total = items.length, done = items.filter(ok).length;
  return { total, done, percent: total ? Math.round((done / total) * 100) : 0,
    unverified: items.filter((i) => i.reliability !== 'verified').length };
}

export function evaluate(state, { registry, today = todayUTC() } = {}) {
  const v = validateProfile(state.profile, today);
  if (!v.valid) return { valid: false, errors: v.errors, items: [], alerts: [], progress: { total: 0, done: 0, percent: 0, unverified: 0 } };
  const p = v.profile, departure = parseDate(p.departureDate), minor = isMinor(p, departure);
  const ctx = { p, docs: state.documents || {}, today, departure, stayEnd: addDays(departure, p.stayDays) };
  const pack = registry ? registry.get(p.destination) : null;
  // Candidats par id : règles du pack d'abord, puis règle du socle ; la première qui s'applique est retenue.
  const cands = new Map(BASE_RULES.map((r) => [r.id, []]));
  if (pack) for (const r of pack.rules) { if (!cands.has(r.id)) cands.set(r.id, []); cands.get(r.id).push(r); }
  for (const r of BASE_RULES) cands.get(r.id).push(r);
  const items = [];
  for (const [id, list] of cands) {
    if (id === 'transit') continue;
    const r = list.find((x) => matches(x, p, minor));
    if (r) items.push(toItem(r, HANDLERS[r.kind](ctx, r), ctx, r.id, state));
  }
  for (const t of p.transit) {
    const tp = registry ? registry.get(t) : null;
    const tr = (tp && tp.rules.find((r) => r.id === 'transit')) || TRANSIT_RULE;
    const rule = { ...tr, title: `Transit via ${t} : conditions d’entrée et visa de transit` };
    items.push(toItem(rule, HANDLERS.transit_check(ctx, rule), ctx, `transit:${t}`, state));
  }
  items.sort((a, b) => CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category));
  const alerts = buildAlerts({ profile: p, docs: ctx.docs, items, today, departure, stayEnd: ctx.stayEnd });
  return { valid: true, errors: [], items, alerts, progress: computeProgress(items), packId: pack ? pack.id : null };
}
