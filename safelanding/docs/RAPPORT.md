> **Rapport historique du Module 1.** Pour l’état actuel du projet (Modules 1 + 2), voir `RAPPORT-MODULE2.md`.

# Rapport de livraison — Module 1 « Before Departure »

**Mode : autonome, hors dépôt.** Aucun accès à GitHub : le dépôt, la branche `safelanding` et `main` n'ont PAS été lus ni modifiés. Aucun commit, push, fusion ni déploiement.
L'architecture existante du dépôt n'a pas pu être auditée ; ce module est une conception neuve, à rapprocher du code existant à l'intégration.

## 1. Travaux réalisés
Socle commun + moteur de règles + packs extensibles, checklist à 6 statuts, alertes (manquants, échéances, incohérences), progression, signalement de changements, garde-fous IA, interface mobile-first hors connexion, 40+ contrôles automatisés.

## 2. Fichiers (29)
`web/` : index.html, app.js, style.css, sw.js, manifest.webmanifest, icon.svg · `web/src/index.js` · `core/` constants, dates, profile, registry, engine, alerts, state, changes, explain · `rules/` base, packs · `tools/serve.mjs` · `tests/` helpers, engine.test, alerts-profile-state.test, static.test, browser_smoke.py · `docs/` ARCHITECTURE, INTEGRATION, RAPPORT · README.md, package.json.

## 3. Tests réellement exécutés (dans cet environnement : Node 22, Chromium via Playwright)
- `node --test tests/*.test.js` : **39 réussis / 0 échec** (derniers résultats ci-dessous).
- `tests/browser_smoke.py` : **17/17** (Chromium, viewport par défaut) : validation du formulaire, checklist, transit, alertes, « Traité », persistance sans n° de passeport, liens sûrs, rechargement **hors connexion** (service worker), effacement, aucune erreur console.
- Parcours manuel : une capture mobile (390×844) relue visuellement.
Couverture des cas de la spec §10 : nationalités différentes, destinations (avec/sans pack), transit, passeport proche d'expiration/expiré/trop ancien/pages vierges, documents manquants, changements de dates, règles non vérifiées et obsolètes, hors connexion, sécurité des données.

Défauts trouvés et corrigés pendant les tests : (a) assurance vide traitée comme renseignée → l'exigence inconnue n'apparaissait jamais « À vérifier » (moteur) ; (b) serveur local répondant deux fois sur une page absente ; (c) trois tests fautifs corrigés (attendus erronés, pas de contournement du moteur).

## 4. Limites et risques restants (à lire avant l'audit)
1. **Aucune règle réglementaire n'est validée.** Les packs (Schengen, US, CA, GB) sont `unverified` ; la règle Schengen (3 mois / 10 ans) vient de ma connaissance générale, **pas d'une source consultée**. Les URL sources n'ont **pas été ouvertes** (pas de réseau) : à confirmer une par une. Conséquence voulue : l'application n'affiche jamais « Conforme » tant qu'un humain n'a pas validé une règle.
2. **Couverture fonctionnelle partielle vs spec** : visas à entrées multiples/durées autorisées (§3B), liste de justificatifs financiers acceptables (§3E), vaccinations par pays (§3F), exigences mineurs détaillées (§3G) ne sont que des éléments « À vérifier » génériques ; aucune donnée par pays n'a été saisie.
3. **IA non branchée** : prompt et contrôle heuristique uniquement ; `guardAiAnswer` est un filet de sécurité, pas une garantie.
4. **Non intégré** : réutilisation des composants/services existants (§9) non faite ; identité visuelle CheckMyVisa **approximée** (bleus), à remplacer par la charte réelle ; clé de profil partagé à aligner avec le dépôt.
5. **UI** : français uniquement (pas d'i18n ni de RTL arabe) ; accessibilité vérifiée à la main (focus, libellés, cibles 44 px), pas d'audit outillé (axe/Lighthouse) ; testé uniquement sur Chromium, pas sur Safari/Firefox ni appareil réel.
6. **Données locales non chiffrées** (`localStorage`) ; protection = absence de données sensibles (liste blanche) et effacement/export. Mise à jour du service worker : incrémenter `CACHE` manuellement.
7. Hypothèses de calcul (arrivée le jour du départ, UTC) à valider métier.

## 5. Prochaines étapes
Audit indépendant → intégration sur `safelanding` (voir INTEGRATION.md) → validation humaine des règles par pays prioritaires → branchement IA avec `buildAiPrompt`/`guardAiAnswer` → i18n (AR/EN) → tests sur appareils et audit d'accessibilité.
