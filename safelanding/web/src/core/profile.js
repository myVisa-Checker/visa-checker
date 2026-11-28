import { PURPOSES, ACCOMMODATIONS } from './constants.js';
import { parseDate, todayUTC, diffDays } from './dates.js';

const ISO2 = /^[A-Z]{2}$/;

export function normalizeProfile(p = {}) {
  const up = (v) => (typeof v === 'string' ? v.trim().toUpperCase() : '');
  let transit = p.transit;
  if (typeof transit === 'string') transit = transit.split(/[\s,;]+/);
  if (!Array.isArray(transit)) transit = [];
  transit = [...new Set(transit.map(up).filter(Boolean))];
  return {
    nationality: up(p.nationality), residence: up(p.residence), destination: up(p.destination),
    transit,
    departureDate: typeof p.departureDate === 'string' ? p.departureDate.trim() : '',
    stayDays: p.stayDays === '' || p.stayDays == null ? null : Number(p.stayDays),
    purpose: typeof p.purpose === 'string' ? p.purpose : '',
    accommodation: typeof p.accommodation === 'string' ? p.accommodation : '',
    birthDate: typeof p.birthDate === 'string' ? p.birthDate.trim() : '',
  };
}

export function validateProfile(raw, today = todayUTC()) {
  const p = normalizeProfile(raw), errors = [];
  const err = (field, message) => errors.push({ field, message });
  for (const f of ['nationality', 'residence', 'destination']) {
    if (!ISO2.test(p[f])) err(f, 'Choisissez un pays.');
  }
  if (p.transit.length > 5) err('transit', 'Cinq pays de transit au maximum.');
  if (p.transit.some((c) => !ISO2.test(c))) err('transit', 'Utilisez des codes pays à deux lettres (ex. AE, TR).');
  if (p.transit.includes(p.destination)) err('transit', 'Un pays de transit ne peut pas être la destination.');
  const dep = parseDate(p.departureDate);
  if (!dep) err('departureDate', 'Saisissez une date de départ valide.');
  else if (diffDays(today, dep) < 0) err('departureDate', 'La date de départ est dans le passé.');
  if (!Number.isInteger(p.stayDays) || p.stayDays < 1 || p.stayDays > 365) err('stayDays', 'Durée du séjour : de 1 à 365 jours.');
  if (!PURPOSES.includes(p.purpose)) err('purpose', 'Choisissez le motif du voyage.');
  if (!ACCOMMODATIONS.includes(p.accommodation)) err('accommodation', 'Choisissez le type d’hébergement.');
  if (p.birthDate && !parseDate(p.birthDate)) err('birthDate', 'Date de naissance invalide.');
  return { valid: errors.length === 0, errors, profile: p };
}

export function isMinor(profile, departure) {
  const b = parseDate(profile.birthDate);
  if (!b || !departure) return false;
  const y = departure.getUTCFullYear() - b.getUTCFullYear();
  const had = departure.getUTCMonth() > b.getUTCMonth() ||
    (departure.getUTCMonth() === b.getUTCMonth() && departure.getUTCDate() >= b.getUTCDate());
  return (had ? y : y - 1) < 18;
}
