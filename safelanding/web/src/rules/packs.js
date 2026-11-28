// Packs par destination. Statut « unverified » tant qu'un humain n'a pas confirmé la règle
// à la source officielle ; l'ingénieur de règles passe alors status:'verified' + lastVerified.
const unv = (name, url) => ({ status: 'unverified', lastVerified: null, source: { name, url } });

const SCHENGEN_SRC = unv('Commission européenne — espace Schengen', 'https://home-affairs.ec.europa.eu/policies/schengen_en');
const SCHENGEN = ['AT','BE','BG','HR','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','CH'];

export const SCHENGEN_PACK = { id: 'schengen', name: 'Espace Schengen', countries: SCHENGEN, rules: [
  { id: 'passport', category: 'passport', title: 'Passeport valide', kind: 'passport_validity',
    params: { monthsAfterStayEnd: 3, maxAgeYears: 10, blankPages: null }, verification: SCHENGEN_SRC },
  { id: 'entry-authorization', category: 'visa', title: 'Visa ou autorisation électronique (ex. ETIAS) — statut en vigueur à confirmer',
    kind: 'entry_authorization', params: { name: 'visa Schengen ou autorisation de voyage' },
    verification: unv('Union européenne — informations voyageurs', 'https://travel-europe.europa.eu/') },
  { id: 'transit', category: 'transport', title: 'Conditions de transit (Schengen)', kind: 'transit_check', params: {}, verification: SCHENGEN_SRC },
] };

export const US_PACK = { id: 'us', name: 'États-Unis', countries: ['US'], rules: [
  { id: 'entry-authorization', category: 'visa', title: 'Visa ou ESTA selon éligibilité', kind: 'entry_authorization',
    params: { name: 'visa ou ESTA' }, verification: unv('U.S. CBP — ESTA', 'https://esta.cbp.dhs.gov/') } ] };

export const CA_PACK = { id: 'ca', name: 'Canada', countries: ['CA'], rules: [
  { id: 'entry-authorization', category: 'visa', title: 'Visa ou AVE (eTA) selon éligibilité', kind: 'entry_authorization',
    params: { name: 'visa ou AVE (eTA)' },
    verification: unv('Gouvernement du Canada — IRCC', 'https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html') } ] };

export const GB_PACK = { id: 'gb', name: 'Royaume-Uni', countries: ['GB'], rules: [
  { id: 'entry-authorization', category: 'visa', title: 'Visa ou ETA selon éligibilité', kind: 'entry_authorization',
    params: { name: 'visa ou ETA' }, verification: unv('GOV.UK — ETA', 'https://www.gov.uk/eta') } ] };

// Module 2 : champ optionnel `arrival` des packs (même contrat de vérification que `rules`). Renvois vers la source seulement.
const uv = (name, url, countries) => ({ status: 'unverified', lastVerified: null, source: { name, url }, scope: { countries, airports: null } });
const customs = (name, url, countries) => ({ id: 'c-declare', phase: 'customs', kind: 'official', title: 'Douane : déclarations et marchandises réglementées',
  text: 'Consultez les règles douanières officielles applicables à {destination} (déclarations, marchandises réglementées ou interdites).', verification: uv(name, url, countries) });
SCHENGEN_PACK.arrival = [customs('Commission européenne — douane', 'https://taxation-customs.ec.europa.eu/', SCHENGEN)];
US_PACK.arrival = [customs('U.S. CBP — informations voyageurs', 'https://www.cbp.gov/travel', ['US'])];
CA_PACK.arrival = [customs('Agence des services frontaliers du Canada', 'https://www.cbsa-asfc.gc.ca/', ['CA'])];
GB_PACK.arrival = [customs('GOV.UK', 'https://www.gov.uk/', ['GB'])];

// ---- Brésil : premier pays « exemple » complet (Module 1 + Module 2). TOUT reste « unverified » : la règle d'exemption est
// appuyée par un texte juridique trouvé (Décret 5.169/2004, accord Brésil–Tunisie de 2001, tourisme ou affaires, 90 jours renouvelables,
// 180 jours/an au plus) mais sa validité ACTUELLE n'a pas été confirmée sur le portail officiel de l'Itamaraty. Un humain doit la confirmer
// puis passer status:'verified' + lastVerified. Aucune URL ci-dessous n'a pu être ouverte depuis l'environnement de développement sans réseau.
const BR_MRE = { name: 'Itamaraty (MRE) — vistos pour le Brésil', url: 'https://www.gov.br/mre/pt-br/assuntos/portal-consular/vistos/informacoes-sobre-vistos-para-estrangeiros-viajarem-ao-brasil' };
const BR_TREATY = { name: 'Décret 5.169/2004 — Accord Brésil–Tunisie d’exemption partielle de visas (2001)', url: 'https://brasil.justia.com/nacionales/decretos/5-169-de-4-8-2004/gdoc' };
const brArr = (id, phase, title, text, name, url) => ({ id, phase, kind: 'official', title, text, verification: uv(name, url, ['BR']) });
export const BR_PACK = { id: 'br', name: 'Brésil', countries: ['BR'],
  rules: [{ id: 'entry-authorization', category: 'visa', title: 'Visa : exemption pour les nationaux tunisiens (accord bilatéral)', kind: 'visa_exemption',
    appliesTo: { nationalities: ['TN'] },
    params: { name: 'l’accord d’exemption partielle de visas Brésil–Tunisie', purposes: ['tourism', 'business'], maxStayDays: 90 },
    verification: { status: 'unverified', lastVerified: null, source: BR_TREATY, otherSources: [BR_MRE], scope: { countries: ['BR'], nationalities: ['TN'] } } }],
  arrival: [
    brArr('i-process', 'immigration', 'Contrôle migratoire (Polícia Federal)', 'Le contrôle migratoire à l’arrivée au Brésil relève de la Polícia Federal. Les étapes, formulaires et justificatifs éventuels sont à confirmer à la source officielle.', 'Polícia Federal — immigration', 'https://www.gov.br/pf/pt-br/assuntos/imigracao'),
    brArr('c-declare', 'customs', 'Douane : déclarations et marchandises réglementées', 'Consultez les règles officielles de la douane brésilienne (Receita Federal) : déclaration de bagages, devises, produits réglementés ou interdits.', 'Receita Federal do Brasil', 'https://www.gov.br/receitafederal/pt-br'),
    brArr('h-current', 'health', 'Formalités sanitaires', 'Consultez la source officielle brésilienne (ANVISA) pour d’éventuelles exigences sanitaires à jour, selon votre provenance et votre situation. Aucune exigence n’est présentée ici comme actuelle.', 'ANVISA — santé des voyageurs', 'https://www.gov.br/anvisa/pt-br'),
  ] };

export const ALL_PACKS = [SCHENGEN_PACK, US_PACK, CA_PACK, GB_PACK, BR_PACK];
