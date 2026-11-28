# Rapport technique — SafeLanding Module 2 « Airport Arrival » (projet unifié Modules 1 + 2)

**Mode : autonome, hors dépôt.** Aucun accès à GitHub : le dépôt et la branche `safelanding` n'ont PAS été lus ni modifiés. Aucun commit, push, fusion ni déploiement. Module 3 non commencé.

## 1. Inspection du Module 1 (avant toute modification)
ZIP extrait et vérifié (intégrité OK, 29 fichiers). Architecture : `web/` statique (index.html, app.js, sw.js) ; `web/src/core/` (moteur pur, état, alertes, explications IA) ; `web/src/rules/` (règles et packs pays) ; `tests/`. **Base de tests avant modification : 39/39.**
Points d'intégration retenus : état (`state.js`), calcul de fiabilité (`engine.js`), contrat de pack (champ `arrival`), table `handled`, IA (`explain.js`), service worker, fenêtre de profil.

## 2. Fonctionnalités développées (Module 2)
Parcours en 9 phases (spec §2) : arrivée · contrôle des documents · immigration · bagages · douane · formalités sanitaires · sortie · transport et transfert · incidents et urgences.
- **Personnalisation sans ressaisie** : réponses de préparation au contrôle (motif, durée, hébergement, billet retour, ressources) et liste des documents à garder à portée, tirées du profil et des documents du Module 1 ; donnée absente ⇒ « à renseigner », jamais inventée.
- **Cohérence avec le Module 1** : statuts de documents et alertes du Module 1 repris tels quels (source unique) ; correspondances (pays de transit) reprises ; incohérence aéroport/destination détectée.
- **Officiel vs pratique** : chaque élément est « information officielle » (source, date de vérification, champ d'application, fiabilité) ou « conseil pratique » (sans source, étiqueté). Une information officielle obsolète est **remplacée par un avertissement** (jamais présentée comme exigence actuelle).
- **Adaptation** : bagage en soute oui/non/inconnu, hébergement (hôte particulier/hôtel), mineur, budget (options de transfert classées), aéroport (pack optionnel, sinon conseils généraux signalés).
- **Incidents** : visa/documents, refus d'entrée, perte de documents, bagage, transport, contacts officiels.
- **Progression** d'arrivée (« Fait »), hors incidents ; états partagé, sans effet sur la progression du Module 1.
- **Migration d'état v1 → v2** sans perte ; une version future n'efface jamais les données.
- Interface : onglets dans la même application, un seul formulaire de profil, mobile-first, hors connexion.

## 3. Fichiers
**Ajoutés (8)** : `web/src/core/arrival.js`, `web/src/core/airports.js`, `web/src/rules/arrival-base.js`, `web/src/rules/airports.js`, `tests/arrival.test.js`, `tests/helpers-m2.js`, `tests/browser_smoke_m2.py`, `docs/RAPPORT-MODULE2.md`.
**Modifiés (16)** : `web/src/core/state.js` (v2, migrations, bloc arrivée) · `engine.js` (1 export, `reliabilityOf`) · `constants.js` (phases, budgets) · `explain.js` (adaptateur IA) · `web/src/rules/packs.js` (champ `arrival`) · `web/src/index.js` (exports) · `web/app.js` (onglets, rendu, champs) · `web/index.html` · `web/style.css` · `web/sw.js` (cache `safelanding-v2`, précache étendu) · `tests/alerts-profile-state.test.js` (1 assertion) · `package.json` · `README.md` · `docs/ARCHITECTURE.md`, `docs/INTEGRATION.md`, `docs/RAPPORT.md` (en-tête).
**Supprimés : aucun.**
**Modification d'un test existant, justifiée** : l'ancienne assertion exigeait qu'une version d'état inconnue (99) réinitialise tout ; la spec du Module 2 l'interdit. Elle est remplacée par une assertion de conservation des données. Aucun autre test du Module 1 n'a été modifié.

## 4. Tests réellement exécutés (Node 22, Chromium via Playwright)
| Suite | Résultat |
|---|---|
| `node --test tests/*.test.js` — Module 1 (39) + Module 2 (31) + cas Brésil (12) + destinations (7) | **89/89** |
| `tests/browser_smoke.py` — Module 1, test d'origine inchangé | **17/17** |
| `tests/browser_smoke_m2.py` — Module 2, migration, hors connexion, mobile | **20/20** |
| `tests/browser_smoke_brazil.py` — cas Tunisien → Brésil (Modules 1 + 2) | **11/11** |
| `tests/browser_smoke_filter.py` — nationalité → liste de destinations filtrée | **15/15** |
Couverture Module 2 : migration v1→v2 (aucune perte, idempotente, version future, entrées corrompues), non-régression de la checklist du Module 1 avant/après migration, personnalisation sans ressaisie, données absentes, profil invalide, bagages, hébergement, mineur, budget, aéroport connu/inconnu/incohérent, officiel/pratique, règle vérifiée/obsolète/non vérifiée, exigence sanitaire ancienne, états partagés, garde-fous IA, données livrées, navigateur mobile 390 px sans débordement, PWA hors connexion, migration d'un état v1 réel dans le navigateur.
**Test de mutation** : deux défauts critiques introduits volontairement (remise à zéro sur changement de version ; exigence obsolète présentée comme actuelle) sont bien détectés (6 et 1 échecs), puis retirés.
Défauts trouvés pendant le travail : test de l'ancien comportement de version (voir §3) ; deux de mes tests navigateur lisaient mal le contenu de sections repliées (erreur de test, vérifiée avant correction).

## 5. Régressions, limites et dette technique
1. **Aucune donnée d'aéroport** : `AIRPORT_PACKS` est vide (rien de vérifiable). Le mécanisme est testé avec un aéroport fictif ; les conseils par aéroport sont donc généraux.
2. **Contenus officiels = renvois non vérifiés** : renvois « douane » (UE, États-Unis, Canada, Royaume-Uni) et pack Brésil (visa tunisien, douane, santé, immigration) fournis, tous `unverified`, **URL non ouvertes** (pas de réseau) : à confirmer. Aucune exigence sanitaire, douanière ou frontalière détaillée n'est donnée.
3. **Conseils pratiques rédigés par l'IA** à partir de connaissances générales, non relus par un expert (en particulier refus d'entrée et pertes de documents) ; formulés prudemment (« les droits varient »), à faire relire.
4. **Contacts officiels et numéros d'urgence** : non fournis (renvoi vers la source) — écart avec la spec §2.9 tant qu'aucune donnée vérifiée n'est saisie.
5. **Données absentes du Module 1** : « type de visa ou de séjour » (spec §3) et détails de vol (numéro, horaires, terminal) n'existent pas dans le profil ; non inventés. Le motif, l'autorisation d'entrée (statut « À vérifier ») et les pays de transit sont utilisés. Ajouter ces champs demande une décision produit + migration v2→v3.
6. **Questions d'immigration** génériques, non spécifiques par pays.
7. **IA non branchée** (prompt et garde-fou seulement, comme au Module 1).
8. **Navigateur** : Chromium uniquement ; pas de Safari/Firefox ni d'appareil réel ; installation PWA (iOS/Android) non testée ; pas d'audit d'accessibilité outillé ; français uniquement.
9. Détail UI : l'aéroport sans données apparaît à la fois en ligne d'info et en alerte (redondance mineure).
10. Version future lue « au mieux » puis réécrite en v2 : une ancienne version de l'application ouvrant ces données perdrait les champs qu'elle ignore.
11. Non intégré au dépôt réel (non consulté) : identité visuelle CheckMyVisa approximée, clé de stockage et service worker à aligner (voir INTEGRATION.md).

## 6. Correction du Module 2 — cas exemple Tunisien → Brésil (itération suivante)
**Demande** : prendre le Brésil comme pays exemple, les Tunisiens étant sans visa. **Principe tenu** : une affirmation du client n'est pas une vérification officielle.
**Ce que la recherche a établi** : un accord bilatéral Brésil–Tunisie (signé à Tunis le 19/07/2001), promulgué par le Décret 5.169/2004, exempte de visa les titulaires de passeport national valide pour tourisme ou affaires, jusqu'à 90 jours, renouvelables dans la limite de 180 jours par an (texte lu sur un site tiers, Justia ; deux sources secondaires concordantes). **Non établi** : la validité ACTUELLE (aucune page officielle récente de l'Itamaraty listant la Tunisie n'a pu être lue ; les tableaux de visas trouvés datent de 2022 ou avant).
**Décision** : règle encodée avec ses sources mais **`unverified`** ⇒ l'application affiche « À vérifier » (calcul interne : « Non applicable »), jamais « Conforme », avec le message « Résultat à confirmer : règle non vérifiée ».
**Pour la valider (action humaine)** : confirmer sur le portail officiel du MRE/Itamaraty (et le texte en vigueur sur planalto.gov.br) l'exemption pour la Tunisie, puis dans `web/src/rules/packs.js` (`BR_PACK`) passer `status:'verified'` et `lastVerified:'AAAA-MM-JJ'` ; même chose pour les trois renvois d'arrivée (douane, santé, immigration), dont les URL n'ont pas pu être ouvertes.
**Extensions du moteur (Module 1, rétro-compatibles)** : nouveau type de règle `visa_exemption` (motifs couverts, durée maximale) ; une règle de pack qui ne s'applique pas à la nationalité **retombe sur la règle générique du socle** (au lieu de disparaître) ; sources complémentaires (`otherSources`) et champ d'application par nationalité (`scope.nationalities`) exposés par les éléments et affichés ; un résultat rétrogradé porte désormais l'avertissement « Résultat à confirmer ». Même repli appliqué aux étapes et transferts du Module 2.
**Fichiers** : ajoutés `tests/brazil.test.js`, `tests/browser_smoke_brazil.py` ; modifiés `web/src/core/engine.js`, `web/src/core/arrival.js`, `web/src/rules/packs.js` (pack `BR_PACK`, + `ALL_PACKS`), `web/app.js` (sources multiples, champ d'application), `README.md`, ce rapport. Aucun fichier supprimé ; aucun test existant modifié.
**Hors périmètre du cas** : exigence de validité du passeport pour le Brésil non encodée (« À vérifier ») ; entrées multiples non modélisées ; aucune donnée d'aéroport brésilien.

## 7. Itération — choix « nationalité puis destination » (liste limitée aux pays sans visa)
**Demande** : au début du parcours, une case nationalité puis une case pays ; pour une nationalité tunisienne, la liste ne contient que les pays sans visa pour les Tunisiens. On commence par le Brésil.
**Réalisation** : écran d'accueil avec 1) nationalité, 2) destination, puis « Continuer » qui ouvre le profil déjà prérempli (aucune ressaisie). Même logique dans la fenêtre de profil (champs réordonnés : nationalité, destination, puis résidence). Nouveau module `core/destinations.js` : `destinationsFor(nationalité, registre)` déduit les destinations **uniquement des règles `visa_exemption` des packs** (aucune liste codée en dur) et expose leur fiabilité ; l'interface ajoute « (à confirmer) » tant que la règle n'est pas vérifiée.
**Comportements voulus** : nationalité tunisienne ⇒ une seule destination aujourd'hui, le Brésil ; nationalité sans règle d'exemption enregistrée ⇒ liste vide avec explication (rien n'est supposé) ; case « Afficher aussi les pays qui peuvent exiger un visa » ⇒ tous les pays, pour que le produit reste universel ; un choix déjà fait n'est jamais perdu (la case se coche automatiquement si la destination n'est plus dans la liste filtrée). Ajouter un pays à la liste = ajouter une règle d'exemption sourcée dans un pack, sans toucher au code.
**Limite assumée** : la liste « sans visa » ne peut être aussi complète que les packs ; elle l'est donc très peu aujourd'hui (Brésil seul, non vérifié). Ce n'est pas un filtre exhaustif des destinations sans visa, et l'interface l'indique (« base en cours de constitution »).
**Fichiers** : ajoutés `web/src/core/destinations.js`, `tests/destinations.test.js`, `tests/browser_smoke_filter.py` ; modifiés `web/index.html`, `web/app.js`, `web/style.css`, `web/sw.js`, `web/src/index.js`, `README.md`, ce rapport. **Deux tests navigateur existants adaptés** (`browser_smoke.py`, `browser_smoke_m2.py`) : ils choisissaient l'Allemagne pour un Tunisien, destination désormais absente de la liste filtrée ; ils cochent maintenant « Afficher aussi… », comportement voulu de la nouvelle fonction. Aucune assertion de fond n'a été modifiée.

## 8. Prochaines étapes (en attente de votre validation explicite)
Audit indépendant → intégration sur `safelanding` → saisie et vérification humaine des données par pays/aéroport prioritaires → décision sur les champs manquants (§5.5) → relecture experte des conseils. **Je m'arrête ici : Module 3 (After Arrival) reste bloqué jusqu'à votre validation du Module 2 ; il n'a pas été commencé.**
