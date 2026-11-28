import { STATUS as S } from './constants.js';
import { parseDate, diffDays, fmt } from './dates.js';

export function buildAlerts({ profile, docs, items, today, departure, stayEnd }) {
  const out = [], add = (type, severity, message, itemId = null) => out.push({ type, severity, message, itemId });
  for (const i of items) {
    if (i.status === S.EXPIRED) add('missing', 'high', `${i.title} : expiré.`, i.id);
    if (i.status === S.MISSING) add('missing', 'high', `${i.title} : manquant ou insuffisant.`, i.id);
    if (!i.source || !i.source.url) add('reliability', 'low', `${i.title} : aucune source officielle renseignée.`, i.id);
  }
  const days = diffDays(today, departure);
  const open = items.filter((i) => (i.status === S.TO_PREPARE || i.status === S.MISSING) && !i.handled);
  if (days <= 14 && open.length) add('deadline', 'high', `Départ dans ${days} jour(s) : ${open.length} élément(s) restent à traiter.`);
  const pExp = docs.passport && parseDate(docs.passport.expiry);
  if (pExp && diffDays(today, pExp) >= 0 && diffDays(today, pExp) <= 180) add('deadline', 'medium', `Votre passeport expire dans ${diffDays(today, pExp)} jour(s) : pensez au renouvellement.`);
  const t = docs.ticket || {}, ob = parseDate(t.outbound), rt = parseDate(t.return);
  if (ob && rt && rt < ob) add('inconsistency', 'high', 'Le retour est antérieur à l’aller.');
  if (ob && diffDays(departure, ob) !== 0) add('inconsistency', 'medium', `La date de l’aller (${fmt(ob)}) diffère de la date de départ du profil (${fmt(departure)}).`);
  if (rt && Math.abs(diffDays(stayEnd, rt)) > 1) add('inconsistency', 'medium', `La durée du séjour (${profile.stayDays} j) ne correspond pas au billet retour (${fmt(rt)}).`);
  const l = docs.lodging || {}, ci = parseDate(l.checkIn), co = parseDate(l.checkOut);
  if (ci && co && co < ci) add('inconsistency', 'high', 'Départ de l’hébergement antérieur à l’arrivée.');
  if (ci && ci > departure) add('inconsistency', 'medium', 'L’hébergement commence après votre arrivée.');
  if (co && co < stayEnd && diffDays(co, stayEnd) > 1) add('inconsistency', 'medium', 'L’hébergement ne couvre pas la fin du séjour.');
  const n = items.filter((i) => i.reliability !== 'verified').length;
  if (n) add('reliability', 'medium', `${n} règle(s) non vérifiée(s) ou obsolète(s) : validation officielle requise.`);
  const rank = { high: 0, medium: 1, low: 2 };
  return out.sort((a, b) => rank[a.severity] - rank[b.severity]);
}
