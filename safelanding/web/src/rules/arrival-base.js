// Socle commun du Module 2, indépendant des pays. Deux natures d'information, jamais mélangées :
//  - kind 'official'  : renvoi vers une exigence officielle ; porte verification {status,lastVerified,source,scope}.
//  - kind 'practical' : conseil de bon sens, non réglementaire, signalé comme tel.
// AUCUNE exigence administrative ou frontalière n'est énoncée ici : les points officiels sont des renvois vers la source.
const PTR = { status: 'unverified', lastVerified: null, source: { name: 'Autorité officielle du pays de destination (à identifier)', url: null }, scope: { countries: null, airports: null } };
const p = (id, phase, title, text, appliesTo) => ({ id, phase, title, text, kind: 'practical', ...(appliesTo ? { appliesTo } : {}) });
const o = (id, phase, title, text, appliesTo) => ({ id, phase, title, text, kind: 'official', verification: PTR, ...(appliesTo ? { appliesTo } : {}) });

export const ARRIVAL_BASE_STEPS = [
  p('a-orient', 'arrival', 'Suivre le parcours d’arrivée', 'Suivez les panneaux « Arrivées » et « Immigration » (ou « Correspondances » si vous poursuivez votre voyage). Allumez votre téléphone et préparez vos documents avant d’atteindre le contrôle.'),
  o('a-forms', 'arrival', 'Formulaire ou carte d’arrivée', 'Vérifiez si un formulaire ou une déclaration d’arrivée (papier ou numérique) est exigé pour {destination}.'),
  p('d-ready', 'documents', 'Garder ses documents à portée', 'Gardez passeport, visa ou autorisation éventuelle, billet retour et adresse d’hébergement ensemble, dans un endroit accessible et non dans votre bagage en soute.'),
  p('d-consistency', 'documents', 'Des informations identiques partout', 'Dates, adresse et motif du séjour doivent être identiques dans vos documents et dans vos réponses.'),
  o('i-process', 'immigration', 'Étapes du contrôle frontalier', 'Les étapes exactes (files, bornes automatiques, biométrie) dépendent du pays et de l’aéroport : suivez les consignes affichées et celles des agents. Détail à confirmer à la source officielle de {destination}.'),
  p('i-honest', 'immigration', 'Répondre simplement et sincèrement', 'Répondez de façon claire et brève, avec vos informations réelles, sans rien ajouter qui ne figure pas dans vos documents.'),
  p('i-minor', 'immigration', 'Voyageur mineur', 'Gardez à portée les documents relatifs au mineur et à son accompagnateur (à vérifier selon le pays).', { minorOnly: true }),
  p('b-claim', 'baggage', 'Récupérer ses bagages', 'Repérez le carrousel de votre vol sur les écrans et vérifiez l’étiquette avant de partir avec un bagage.', { bags: 'yes' }),
  p('b-problem', 'baggage', 'Bagage absent ou abîmé', 'Ne quittez pas la zone bagages : signalez-le au guichet de la compagnie ou au service des bagages perdus et conservez le récépissé. Les délais de réclamation varient selon la compagnie : renseignez-vous sur place.', { bags: 'yes' }),
  p('b-nobag', 'baggage', 'Pas de bagage en soute', 'Sans bagage en soute, vous pouvez passer directement à l’étape suivante.', { bags: 'no' }),
  o('c-declare', 'customs', 'Déclarations et marchandises réglementées', 'Vérifiez auprès de l’administration des douanes de {destination} les règles de déclaration (argent liquide, aliments, médicaments) et les marchandises réglementées ou interdites.'),
  o('h-current', 'health', 'Formalités sanitaires', 'Les exigences sanitaires éventuelles pour {destination} dépendent du pays, de votre situation et de la date : consultez la source officielle à jour. SafeLanding ne présente jamais une ancienne exigence comme une règle actuelle.'),
  p('e-meeting', 'exit', 'Convenir d’un point de rendez-vous', 'Si quelqu’un vous attend, convenez à l’avance d’un point précis (nom de sortie ou de terminal).'),
  p('e-host', 'exit', 'Rejoindre votre hôte', 'Vous êtes hébergé chez un particulier : prévenez votre hôte de votre arrivée et convenez du lieu de rencontre. Contact enregistré : {hostContact}.', { accommodations: ['private'] }),
  p('e-safety', 'exit', 'Rester vigilant à la sortie', 'Gardez vos affaires devant vous et déclinez les offres d’aide non sollicitées.'),
  p('t-scam', 'transfer', 'Éviter les arnaques au transport', 'Utilisez la file de taxis officielle ou un transfert pré-réservé, déclinez les rabatteurs, convenez du prix ou du compteur avant de monter, et montrez votre adresse écrite : {address}.'),
  p('x-docs', 'incidents', 'Problème de visa ou de documents', 'Restez calme, demandez à l’agent de vous expliquer le problème, puis contactez votre compagnie aérienne et l’ambassade ou le consulat de {nationality}.'),
  p('x-refusal', 'incidents', 'Difficulté ou refus d’entrée', 'Restez courtois, demandez qu’on vous explique la décision et les démarches possibles, et sollicitez votre ambassade ou consulat de {nationality} et votre compagnie. Les droits applicables varient selon le pays.'),
  p('x-lostdocs', 'incidents', 'Perte de documents', 'Signalez la perte à la police ou au service compétent de l’aéroport, puis contactez votre ambassade ou consulat pour connaître la procédure de remplacement.'),
  p('x-baggage', 'incidents', 'Bagage perdu, retardé ou endommagé', 'Faites établir un récépissé auprès de la compagnie avant de quitter l’aéroport, photographiez les dégâts et gardez tous les justificatifs.'),
  p('x-transport', 'incidents', 'Problème de transport', 'Revenez vers l’espace officiel d’information ou de taxis de l’aéroport, ou contactez votre hébergement ou votre hôte.'),
  o('x-contacts', 'incidents', 'Contacts officiels et urgences', 'Relevez à la source officielle, avant le départ, les contacts de l’ambassade ou du consulat de {nationality} et le numéro d’urgence local de {destination}, et enregistrez-les pour les consulter hors connexion.'),
];

export const TRANSFER_MODES = [
  { id: 'public', title: 'Transport public', text: 'Souvent économique ; vérifiez l’itinéraire et les horaires, surtout avec des bagages ou à l’arrivée tardive.', budgets: ['low', 'medium'] },
  { id: 'shuttle', title: 'Navette', text: 'Pratique si votre trajet correspond à une ligne ; confirmez l’arrêt et le tarif avant de monter.', budgets: ['low', 'medium'] },
  { id: 'taxi', title: 'Taxi officiel', text: 'Prenez uniquement la file officielle ; convenez du prix ou du compteur avant de partir.', budgets: ['medium', 'high'] },
  { id: 'private', title: 'Transfert privé pré-réservé', text: 'Le prix est connu à l’avance ; vérifiez l’identité du chauffeur et le nom indiqué sur sa pancarte.', budgets: ['medium', 'high'] },
  { id: 'host', title: 'Récupération par votre hôte', text: 'Convenez d’un point de rencontre précis avec votre hôte. Contact enregistré : {hostContact}.', budgets: ['low', 'medium', 'high'], appliesTo: { accommodations: ['private'] } },
  { id: 'hotel', title: 'Navette ou transfert de l’hôtel', text: 'Demandez à votre hôtel s’il propose un transfert et à quel point de rendez-vous.', budgets: ['low', 'medium', 'high'], appliesTo: { accommodations: ['hotel'] } },
];
