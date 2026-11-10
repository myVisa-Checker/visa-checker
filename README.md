# Visa Checker

Application web (PWA) multilingue (français, anglais, arabe) pour les voyageurs tunisiens, marocains et algériens : documents de visa, pack recours, e-Visa par passeport, assistant d'entretien.

Site : https://checkmyvisa.org

## Tests de base

Aucune dépendance. Avec Node 18 ou plus récent :

    node tests/run.mjs

Le script vérifie la syntaxe des scripts et des deux Workers, les fichiers JSON, les fichiers référencés par `index.html`, le précache du service worker, le sitemap, la version, la CSP de chaque page, quelques contrôles de sécurité simples et le rendu de la section e-Visa pour les trois passeports dans les trois langues.

## Déploiement

1. Site : `node bump-version.mjs` (estampille `sw.js` et `version.json`), puis commit et push sur `main` : GitHub Pages publie `checkmyvisa.org`.
2. Workers Cloudflare : voir `worker/README.md`. Cloudflare ne lit pas ce dépôt : coller le fichier dans Cloudflare > Edit code > Deploy.

## Structure

- `index.html` + `visa-app.js` : application principale (checklists, e-Visa, pack recours, commandes agences).
- `joury.html`, `aicha.html` + `joury.js`, `avatar3d.js` : assistants IA Joury et Aicha.
- `partenaires.html` + `partner-form.js` : candidatures partenaires.
- `sw.js`, `visa-pwa.js`, `manifest.json` : PWA et hors-ligne.
- `partners.json`, `rdv.json`, `deals.json` : données éditables.
- `worker/` : code des Workers `visa-proxy` et `visa-chat`.

## Branches

- `main` : version en ligne.
- `amelioration` : travaux d'amélioration, à relire avant tout passage sur `main`.

## Design

L'identité visuelle bleue (marine, bleu royal, bleu clair, blanc) est définie dans `brand.css`, chargé en dernier par toutes les pages. Pour revenir à l'ancien rendu, retirer la ligne `<link rel="stylesheet" href="/brand.css">`.
