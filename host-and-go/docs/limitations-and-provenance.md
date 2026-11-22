# Provenance, limites et état réel

## 1. Source de ce dossier

Ce dossier est reconstruit à partir des décisions, spécifications,
extraits SQL et exemples techniques disponibles dans le contexte
de travail transmis à cette exécution.

Il ne prétend pas reproduire mot pour mot l'intégralité de tous les
messages de la session ni des fichiers qui ne sont plus accessibles
dans le contexte courant.

## 2. Nature du contenu

Les éléments sont des spécifications, décisions et exemples de conception.

Ils ne prouvent pas :
- que le code correspondant existe dans le dépôt ;
- que les migrations ont été exécutées ;
- que les API sont implémentées ;
- que les tests ont été écrits ou exécutés ;
- que les pays ont été juridiquement vérifiés ;
- que le service a été déployé ;
- que les contrôles Cloudflare sont configurés.

## 3. État réglementaire

Les pays initiaux sont en statut `RESEARCH`.

Aucune conclusion juridique positive ne doit être déduite de leur présence
dans ce dossier.

La réglementation doit être vérifiée avec des sources officielles,
pour le profil et l'activité concernés.

## 4. Stockage

Cloudflare D1/SQLite est une option provisoire.
La décision finale dépend d'une vérification des garanties transactionnelles,
des contraintes de concurrence et des besoins de cohérence.

## 5. Dépôt et intégration

Le dépôt identifié dans le contexte est :

`myVisa-Checker/visa-checker`

La branche de travail mentionnée est :

`feature/host-go-foundation`

Une tentative antérieure d'écriture via l'intégration GitHub a échoué
avec une erreur 403 `Resource not accessible by integration`.

Aucune intégration de ces fichiers au dépôt ne doit donc être présumée.

## 6. Configuration Cloudflare existante mentionnée

Le fichier racine `wrangler.toml` avait été observé avec :

```toml
name = "visa-checker"
pages_build_output_dir = "."
compatibility_date = "2026-11-11"
```

D'autres Workers existants avaient été mentionnés :
- `visa-chat-worker.js`
- `visa-flight-worker.js`
- `visa-proxy-worker.js`
- `visa-rules-worker.js`

Un fichier `worker/wrangler.toml` indiquait que des KV et secrets
étaient configurés dans le tableau de bord Cloudflare.

Ces informations sont des observations antérieures et doivent être
revérifiées avant toute modification.

## 7. Politique de livraison

Les hôtes publient gratuitement leurs offres au lancement.

Aucun mécanisme de publication payante ne doit être introduit dans le MVP.

Les paiements internes et la messagerie interne sont hors périmètre MVP.

Aucune action externe — commit, push, déploiement ou modification
des paramètres de production — ne doit être exécutée sans autorisation.
