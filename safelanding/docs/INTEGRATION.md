# Reprise et intégration dans la branche `safelanding` (à faire par vous, après audit)

**Aucun push, fusion ni déploiement n'a été fait.** Le dépôt n'a jamais été lu (pas d'accès).

## Option simple (navigateur, sans terminal)
1. Décompresser `safelanding.zip` sur votre ordinateur.
2. Sur GitHub, ouvrir le dépôt, **choisir la branche `safelanding` (jamais `main`)**.
3. « Add file » → « Upload files », glisser le contenu du dossier décompressé.
4. En bas : « Commit directly to the `safelanding` branch », valider.

## Option terminal
```
git checkout safelanding            # ou: git checkout -b safelanding
# copier le contenu du ZIP dans le dépôt
git status && git diff              # relire
git add -A && git commit -m "SafeLanding : Modules 1 et 2"
git push origin safelanding         # uniquement après votre décision
```
## Points à traiter à l'intégration (le code existant du dépôt n'a pas été consulté)
1. Fusionner le `sw.js` avec celui du dépôt (un seul service worker par scope ; le cache est nommé `safelanding-v2`).
2. Aligner l'identité visuelle CheckMyVisa réelle (ici : bleus approximés).
3. Aligner la clé de stockage `safelanding.state` avec le profil partagé du dépôt.
4. Lancer `npm test` puis la suite existante du dépôt (`tests/run.mjs`) : vérifier l'absence de régression.
5. Faire valider les règles et contenus officiels à la source avant de passer `status:'verified'` + `lastVerified`.
6. Avant tout déploiement : audit indépendant, puis décision explicite.
