# Visa Checker

Plateforme web indépendante et multilingue (français, anglais, arabe) d'aide à la préparation des voyages et des demandes de visa. Le projet comprend des checklists indicatives selon les parcours actuellement couverts, des informations e-Visa pour certains passeports, un Visa Journey Planner, des guides et un assistant de préparation. Visa Radar est une fonctionnalité en préparation : aucune disponibilité de rendez-vous n'est actuellement surveillée ou garantie.

Les informations et checklists ne sont pas des décisions officielles. Les exigences doivent toujours être confirmées auprès des autorités et prestataires officiels compétents.

Les paiements en ligne sont désactivés tant qu'un prestataire et les conditions de vente n'ont pas été validés. Aucun mode de paiement simulé n'est prévu en production.

Site : https://checkmyvisa.org

## Tests de base

Aucune dépendance. Avec Node 18 ou plus récent :

    node tests/run.mjs

Le script vérifie la syntaxe des scripts, les fichiers JSON, les fichiers référencés par `index.html`, le sitemap, la version, quelques contrôles de sécurité simples et le rendu de la section e-Visa pour les trois passeports dans les trois langues.

## Branches

- `main` : version en ligne.
- `amelioration` : travaux d'amélioration, à relire avant tout passage sur `main`.

## Design

L'identité visuelle bleue (marine, bleu royal, bleu clair, blanc) est définie dans `brand.css`, chargé en dernier par toutes les pages. Pour revenir à l'ancien rendu, retirer la ligne `<link rel="stylesheet" href="/brand.css">`.
