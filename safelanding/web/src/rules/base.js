// Socle commun, indépendant des pays. AUCUNE exigence chiffrée n'est inventée ici :
// tout paramètre inconnu vaut null et force un statut « À vérifier » auprès d'une source officielle.
const UNKNOWN_SOURCE = { name: 'Autorité officielle du pays de destination (à identifier)', url: null };
const V = { status: 'unverified', lastVerified: null, source: UNKNOWN_SOURCE };

export const BASE_RULES = [
  { id: 'passport', category: 'passport', title: 'Passeport valide', kind: 'passport_validity',
    params: { monthsAfterStayEnd: null, maxAgeYears: null, blankPages: null }, verification: V },
  { id: 'entry-authorization', category: 'visa', title: 'Visa ou autorisation électronique d’entrée',
    kind: 'entry_authorization', params: { name: 'visa ou autorisation électronique' }, verification: V },
  { id: 'ticket', category: 'transport', title: 'Billet aller-retour ou de continuation', kind: 'ticket',
    params: {}, verification: V },
  { id: 'lodging', category: 'lodging', title: 'Justificatif d’hébergement', kind: 'lodging',
    params: {}, verification: V },
  { id: 'funds', category: 'finance', title: 'Justificatifs de ressources financières', kind: 'funds',
    params: { minPerDay: null, currency: null }, verification: V },
  { id: 'insurance', category: 'health', title: 'Assurance voyage', kind: 'insurance',
    params: { required: null }, verification: V },
  { id: 'health', category: 'health', title: 'Vaccinations et documents sanitaires', kind: 'manual',
    params: { text: 'Vérifiez si le pays exige des vaccinations ou un certificat sanitaire.' }, verification: V },
  { id: 'purpose', category: 'specific', title: 'Conditions liées au motif du voyage', kind: 'manual',
    appliesTo: { purposes: ['business', 'study', 'work', 'medical'] },
    params: { text: 'Ce motif peut nécessiter un visa, une autorisation ou des justificatifs particuliers.' }, verification: V },
  { id: 'minor', category: 'specific', title: 'Documents pour voyageur mineur', kind: 'manual',
    appliesTo: { minorOnly: true },
    params: { text: 'Vérifiez les exigences pour les mineurs (autorisation parentale, acte de naissance, tuteur).' }, verification: V },
];
export const TRANSIT_RULE = { id: 'transit', category: 'transport', title: 'Conditions de transit', kind: 'transit_check',
  params: {}, verification: V };
