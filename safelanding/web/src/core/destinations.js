import { reliabilityOf } from './engine.js';
import { todayUTC } from './dates.js';

// Destinations « sans visa » pour une nationalité, calculées UNIQUEMENT à partir des règles `visa_exemption` des packs
// (jamais d'une liste codée en dur ni d'une affirmation non sourcée). La fiabilité de chaque règle est exposée :
// une destination dont la règle n'est pas vérifiée est listée avec reliability 'unverified' (affichée « à confirmer »).
export function destinationsFor(nationality, registry, today = todayUTC()) {
  const nat = typeof nationality === 'string' ? nationality.trim().toUpperCase() : '';
  const out = new Map();
  if (!nat || !registry) return [];
  for (const iso of registry.countries()) {
    for (const r of registry.get(iso).rules) {
      if (r.kind !== 'visa_exemption' || !r.appliesTo || !(r.appliesTo.nationalities || []).includes(nat)) continue;
      const reliability = reliabilityOf(r.verification, today), prev = out.get(iso);
      if (!prev || (reliability === 'verified' && prev.reliability !== 'verified')) {
        out.set(iso, { country: iso, ruleId: r.id, reliability, purposes: (r.params && r.params.purposes) || null,
          maxStayDays: r.params && r.params.maxStayDays != null ? r.params.maxStayDays : null, source: (r.verification && r.verification.source) || null });
      }
    }
  }
  return [...out.values()].sort((a, b) => a.country.localeCompare(b.country));
}
