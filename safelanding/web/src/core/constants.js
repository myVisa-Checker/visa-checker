export const STATUS = Object.freeze({
  TO_PREPARE: 'to_prepare', TO_VERIFY: 'to_verify', COMPLIANT: 'compliant',
  MISSING: 'missing', EXPIRED: 'expired', NOT_APPLICABLE: 'not_applicable',
});
export const STATUS_LABELS = Object.freeze({
  to_prepare: 'À préparer', to_verify: 'À vérifier', compliant: 'Conforme',
  missing: 'Manquant', expired: 'Expiré', not_applicable: 'Non applicable',
});
export const CATEGORIES = Object.freeze(['passport', 'visa', 'transport', 'lodging', 'finance', 'health', 'specific']);
export const CATEGORY_LABELS = Object.freeze({
  passport: 'Passeport', visa: 'Visa et autorisations', transport: 'Billets et transit',
  lodging: 'Hébergement', finance: 'Justificatifs financiers', health: 'Assurance et santé',
  specific: 'Formalités spécifiques',
});
export const STALE_DAYS = 180; // une règle vérifiée depuis plus longtemps est « obsolète »
export const PURPOSES = Object.freeze(['tourism', 'business', 'family', 'study', 'work', 'medical', 'other']);
export const PURPOSE_LABELS = Object.freeze({
  tourism: 'Tourisme', business: 'Affaires', family: 'Visite familiale', study: 'Études',
  work: 'Travail', medical: 'Raisons médicales', other: 'Autre',
});
export const ACCOMMODATIONS = Object.freeze(['hotel', 'rental', 'private', 'other']);
export const ACCOMMODATION_LABELS = Object.freeze({
  hotel: 'Hôtel', rental: 'Location', private: 'Chez un particulier', other: 'Autre',
});

// Module 2 — Airport Arrival
export const ARRIVAL_PHASES = Object.freeze([
  { id: 'arrival', title: 'Arrivée à l’aéroport' }, { id: 'documents', title: 'Contrôle des documents' },
  { id: 'immigration', title: 'Immigration et frontière' }, { id: 'baggage', title: 'Bagages' },
  { id: 'customs', title: 'Douane' }, { id: 'health', title: 'Formalités sanitaires' },
  { id: 'exit', title: 'Sortie de l’aéroport' }, { id: 'transfer', title: 'Transport et transfert' },
  { id: 'incidents', title: 'Incidents et urgences' },
]);
export const BUDGET_LABELS = Object.freeze({ low: 'Économique', medium: 'Intermédiaire', high: 'Confort' });
