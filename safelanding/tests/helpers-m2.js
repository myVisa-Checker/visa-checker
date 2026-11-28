import { createRegistry, createAirportRegistry, ALL_PACKS, parseDate } from '../web/src/index.js';
import { TEST_PACK, mk, TODAY } from './helpers.js';
export { mk, TODAY };
const ok = { status: 'verified', lastVerified: '2026-10-01', source: { name: 'Source de test', url: 'https://example.org/arrivee' }, scope: { countries: ['ZZ'], airports: null } };
const old = { ...ok, lastVerified: '2026-01-01' }; // > 180 jours avant TODAY (2026-11-26) : obsolète
// Données FICTIVES de test (jamais livrées) : pays ZZ et aéroport ZZA.
export const ARR_PACK = { ...TEST_PACK, arrival: [
  { id: 'c-declare', phase: 'customs', kind: 'official', title: 'Douane Testland', text: 'Limite de test : 1000 unités.', verification: ok },
  { id: 'h-current', phase: 'health', kind: 'official', title: 'Santé Testland', text: 'Certificat de test exigé.', verification: old },
] };
export const AIRPORT = { iata: 'ZZA', name: 'Aéroport de test', country: 'ZZ',
  steps: [{ id: 'a-orient', phase: 'arrival', kind: 'practical', title: 'Orientation ZZA', text: 'Suivre la ligne bleue du terminal 2.' }],
  transfers: [{ id: 'tram', title: 'Tramway de test', text: 'Tramway toutes les 10 minutes.', budgets: ['low'], kind: 'practical' }] };
export const registry = createRegistry([...ALL_PACKS, ARR_PACK]);
export const airportRegistry = createAirportRegistry([AIRPORT]);
export const opts = { registry, airportRegistry, today: TODAY };
export const items = (r) => r.phases.flatMap((p) => p.items);
export const item = (r, id) => items(r).find((i) => i.stepId === id);
