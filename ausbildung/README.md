# Ausbildung Career Matcher — paquet de développement V0.1

Ce paquet contient un premier module autonome à intégrer dans CheckMyVisa.

## Contenu
- `index.html`, `ausbildung.css`, `app.js` : questionnaire mobile-first en français.
- `data/occupations.json` : catalogue initial de dix métiers.
- `career-matcher.js` : moteur déterministe et explicable.
- `schemas/occupation.schema.json` : schéma JSON de validation.
- `tests/matcher.test.js` : tests sans dépendance externe.

## Exécution locale
Depuis la racine du dépôt, servir les fichiers avec un serveur HTTP statique (par exemple `python -m http.server 8000`) puis ouvrir `/index.html`. Le `fetch()` du catalogue ne fonctionne pas depuis `file://`.

## Tests
```bash
node ausbildung/tests/matcher.test.js
```

## Règles du moteur
- Compatibilité métier : compétences 35 %, intérêts 30 %, environnement 20 %, expérience 15 %.
- Les dimensions non renseignées sont exclues du dénominateur ; elles ne valent pas zéro.
- Pas de filtre par âge, nationalité, sexe, origine, santé ou statut migratoire.
- L'allemand, le diplôme et la mobilité ne diminuent pas la compatibilité métier ; ils alimentent les conseils de préparation, à compléter par une vérification officielle dédiée.
- Aucun score ne représente une probabilité d'embauche ou de visa.

## État des données
Les intitulés et durées sont un socle de travail, pas une publication réglementaire finale. Avant publication, vérifier chaque fiche et chaque durée sur les sources BIBB / textes officiels / organismes compétents, notamment la formation infirmière qui relève d'un cadre réglementaire distinct. Les niveaux linguistiques ne sont volontairement pas codés comme exigences fixes.

## Intégration dans CheckMyVisa (faite)
- Page publique : `/ausbildung/` (lien « Ausbildung » dans la navigation, le pied de page de l'accueil et la carte Ausbildung de l'accueil).
- Styles limités à `#aus`, couleurs issues de `brand.css`; CSP stricte (aucun script inline, aucun réseau tiers); aucune réponse envoyée ni enregistrée.
- Hors ligne : fichiers et `data/occupations.json` dans le précache de `sw.js` (règle JSON dédiée).
- Tests : `node ausbildung/tests/matcher.test.js` (aussi lancé par `node tests/run.mjs`).
- Limite : le questionnaire est en français uniquement (un avis EN/AR s'affiche). Catalogue provisoire : vérification BIBB / sources officielles requise avant publication, formation infirmière à part.
