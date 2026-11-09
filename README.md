# Visa Checker

Application web (PWA) multilingue (français, anglais, arabe) pour les voyageurs tunisiens, marocains et algériens : documents de visa, pack recours, e-Visa par passeport, assistant d'entretien.

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
