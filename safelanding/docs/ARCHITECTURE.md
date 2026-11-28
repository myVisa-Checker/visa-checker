# Architecture

Séparation en trois couches (spec §9) :
1. **Données utilisateur** — `core/state.js` : profil + documents + éléments « traités » + signalements. Liste blanche stricte ; stockage `localStorage` (clé `safelanding.state`), jamais de n° de passeport/MRZ.
2. **Règles réglementaires** — `rules/base.js` (socle) + `rules/packs.js` (par destination). Données pures, sans logique. Ajouter une destination = ajouter un pack et l'enregistrer dans `createRegistry` ; aucun changement du moteur.
3. **Logique métier** — `core/engine.js` : `evaluate(state, {registry, today})` → `{items, alerts, progress}`. Fonction pure (la date est injectée), sans DOM ni réseau, donc testable et réutilisable par les autres modules.

## Flux
profil validé (`profile.js`) → règles du socle surchargées par le pack de la destination (par `id`) → un handler par `kind` (`passport_validity`, `ticket`, `lodging`, `funds`, `insurance`, `entry_authorization`, `transit_check`, `manual`) → fiabilité (`verified | outdated | unverified`) → rétrogradation éventuelle → alertes (`alerts.js`) → progression.

## Statuts
À préparer · À vérifier · Conforme · Manquant · Expiré · Non applicable. `computedStatus` conserve le résultat brut ; `status` est le statut affiché après règle de fiabilité.

## Hypothèses de calcul
Arrivée le jour du départ ; fin de séjour = départ + durée ; dates en UTC (AAAA-MM-JJ) ; « Traité » ne fait progresser que si l'élément n'est ni Manquant ni Expiré.

## IA (spec §6)
`explain.js` fournit : `explainItem` (explication déterministe), `buildAiPrompt` (contexte + garde-fous : aucune règle inventée, signaler le non-vérifié), `guardAiAnswer` (contrôle heuristique : URL hors sources connues, certitude sans règle vérifiée). **Aucun modèle n'est appelé** dans ce paquet ; l'intégration reste à faire.

## Hors connexion
`sw.js` précache l'application entière (un test vérifie la liste fichier par fichier) ; l'état reste en `localStorage`. Incrémenter `CACHE` dans `sw.js` à chaque modification livrée.

## Sécurité
CSP stricte (`script-src 'self'`, pas d'inline), DOM construit sans `innerHTML`, liens externes `rel="noopener noreferrer"` et http(s) uniquement, aucune requête réseau sortante, données uniquement locales, bouton d'export et d'effacement.


---
# Module 2 — Airport Arrival (extension, sans architecture parallèle)

## Ce qui est réutilisé du Module 1 (aucune duplication)
- **Profil et documents** : `state.profile` / `state.documents` saisis une seule fois (fenêtre « Profil voyageur » unique).
- **Moteur** : `evaluateArrival` appelle `evaluate` (Module 1) — statuts de documents, alertes et validation du profil restent à source unique.
- **Fiabilité des sources** : `reliabilityOf` (exporté depuis `engine.js`), même seuil de 180 jours.
- **Registre de packs** : le contrat `pack` gagne un champ optionnel `arrival` (renvois officiels par pays), même surcharge par `id`.
- **Éléments « faits »** : même table `state.handled`, clés `arrival:<id>` (n'affectent pas la progression du Module 1 — testé).
- **IA** : `arrivalToAiItems` adapte les éléments au même `buildAiPrompt` / `guardAiAnswer`.
- **PWA** : même service worker, précache étendu ; même CSP, même construction DOM sans `innerHTML`.

## Ce qui est ajouté
| Fichier | Rôle |
|---|---|
| `core/arrival.js` | `evaluateArrival(state, {registry, airportRegistry})` → phases, préparation aux réponses, documents à portée, transferts, alertes, progression |
| `core/airports.js` | `createAirportRegistry` (clé IATA, contrat validé) |
| `rules/arrival-base.js` | Socle commun : étapes `official` (renvois) et `practical` (conseils), modes de transfert |
| `rules/airports.js` | Données par aéroport — **livré vide** (aucune donnée vérifiable) |
| `core/state.js` (étendu) | Version 2, bloc `arrival {airport, budget, checkedBags}`, table de migrations |

## Couches de contenu (fusion par `id`) : socle → pack du pays (`arrival`) → pack de l'aéroport
Deux natures d'information, jamais mélangées : **official** (source, `lastVerified`, `scope` ; non vérifiée ou obsolète ⇒ signalée, et une information obsolète est remplacée par un avertissement au lieu d'être présentée comme exigence actuelle) et **practical** (conseil non réglementaire, sans source).

## Migration d'état
`MIGRATIONS = {1: v1→v2}` ; `sanitizeState` migre toute version antérieure sans perte. Une version **future** est lue « au mieux » (champs connus conservés, inconnus ignorés) puis réécrite en v2. Version absente ou invalide ⇒ état vide (impossible d'interpréter). Pour la v3 : ajouter `MIGRATIONS[2]` et incrémenter `STATE_VERSION` ; ne jamais retirer une migration.


## Contrat de règles — extensions du cas Brésil
- **`kind:'visa_exemption'`** (`params: {name, purposes[], maxStayDays}`) avec `appliesTo.nationalities` : résultat « Non applicable » si motif et durée sont couverts, sinon « À vérifier ». Rétrogradé en « À vérifier » tant que la règle n'est pas `verified` récente.
- **Repli sur le socle** : pour un `id` donné, la première règle qui s'applique est retenue, dans l'ordre pack → socle (Module 1) et aéroport → pays → socle (Module 2). Un pack peut donc ne cibler qu'une nationalité sans masquer la règle générique des autres.
- **`verification.otherSources[]`** (« voir aussi ») et **`verification.scope.{countries, airports, nationalities}`** exposés tels quels dans les éléments.
- Premier pays exemple complet : `BR_PACK` (visa pour nationaux tunisiens + renvois douane/santé/immigration), livré `unverified`.

## Choix nationalité → destination
`core/destinations.js` : `destinationsFor(nationalité, registre)` lit les règles `visa_exemption` des packs (même source que le moteur : une seule vérité) et renvoie les destinations avec leur fiabilité. L'écran d'accueil (`#quickstart`) et la fenêtre de profil partagent `refreshDestinations` dans `app.js` ; les choix sont écrits dans `state.profile` (profil partagé par tous les modules).
