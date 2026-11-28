import { createRegistry, ALL_PACKS, emptyState, parseDate } from '../web/src/index.js';
export const TODAY = parseDate('2026-11-26');
// Pack FICTIF de test (destination « ZZ ») : valeurs et statut « verified » inventés pour tester le moteur, jamais livrés.
const v = { status: 'verified', lastVerified: '2026-10-01', source: { name: 'Source de test', url: 'https://example.org/test' } };
export const TEST_PACK = { id: 'testland', name: 'Testland', countries: ['ZZ'], rules: [
  { id: 'passport', category: 'passport', title: 'Passeport', kind: 'passport_validity', params: { monthsAfterStayEnd: 6, maxAgeYears: 10, blankPages: 2 }, verification: v },
  { id: 'funds', category: 'finance', title: 'Ressources', kind: 'funds', params: { minPerDay: 50, currency: 'EUR' }, verification: v },
  { id: 'insurance', category: 'health', title: 'Assurance', kind: 'insurance', params: { required: true }, verification: v },
  { id: 'ticket', category: 'transport', title: 'Billet', kind: 'ticket', params: {}, verification: v },
  { id: 'lodging', category: 'lodging', title: 'Hébergement', kind: 'lodging', params: {}, verification: v },
  { id: 'visa-fr', category: 'visa', title: 'Visa (non-FR)', kind: 'entry_authorization', appliesTo: { excludeNationalities: ['FR'] }, params: { name: 'visa' }, verification: v },
  { id: 'transit', category: 'transport', title: 'Transit', kind: 'transit_check', params: {}, verification: v },
] };
export const registry = createRegistry([...ALL_PACKS, TEST_PACK]);
export function mk(over = {}, docs = {}) {
  const s = emptyState();
  s.profile = { nationality: 'FR', residence: 'FR', destination: 'ZZ', transit: [], departureDate: '2026-12-10', stayDays: 10,
    purpose: 'tourism', accommodation: 'hotel', birthDate: '', ...over };
  s.documents = {
    passport: { expiry: '2028-01-01', issueDate: '2023-01-01', blankPages: 4 },
    ticket: { outbound: '2026-12-10', return: '2026-12-20', onward: false },
    lodging: { address: '1 rue Test', checkIn: '2026-12-10', checkOut: '2026-12-20', hostContact: '' },
    funds: { amount: 600, currency: 'EUR' }, insurance: { validFrom: '2026-12-09', validTo: '2026-12-21' }, ...docs };
  return s;
}
export const byId = (r, id) => r.items.find((i) => i.id === id);
