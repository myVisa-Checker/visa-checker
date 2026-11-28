# SafeLanding — Modules 1 et 2 (application unifiée)

> **Statut : livraison autonome, NON intégrée.** Produit sans accès au dépôt GitHub ni à la branche `safelanding`.
> Rien n'a été modifié, poussé, fusionné ni déployé. Audit indépendant requis avant intégration.

Une seule application, deux onglets : **Avant le départ** (Module 1) et **Arrivée à l'aéroport** (Module 2).
Un seul profil voyageur, un seul état local, un seul moteur de fiabilité des sources.

## Lancer
```
npm test                                  # 89 tests Node (aucune dépendance)
npm run serve                             # http://127.0.0.1:8080 (développement local uniquement)
python3 tests/browser_smoke.py            # navigateur, Module 1 (Playwright + Chromium) — serveur sur le port 8765
python3 tests/browser_smoke_m2.py         # navigateur, Module 2 + migration + hors connexion — port 8765
python3 tests/browser_smoke_brazil.py     # navigateur, cas exemple Tunisien → Brésil — port 8765
python3 tests/browser_smoke_filter.py     # navigateur, nationalité → liste de destinations filtrée — port 8765
```
Node ≥ 20, aucune dépendance d'exécution. Le dossier `web/` est statique et autonome.

## Documentation
`docs/ARCHITECTURE.md` (architecture des deux modules) · `docs/RAPPORT-MODULE2.md` (rapport technique, tests, limites) · `docs/INTEGRATION.md` (reprise et intégration GitHub) · `docs/RAPPORT.md` (rapport historique du Module 1).

## Règle fondamentale (inchangée)
Aucune règle administrative ou frontalière n'est affirmée sans validation humaine. Toute information « officielle » porte source, date de vérification et champ d'application ; sinon elle est signalée « non vérifiée » ou « obsolète ». Les « conseils pratiques » sont étiquetés comme tels. Tous les contenus officiels livrés sont `unverified` (test automatisé).
