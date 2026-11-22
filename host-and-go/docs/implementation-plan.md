# Plan d'implémentation

## Phase 0 — Préparation

- Confirmer le dépôt et la branche de travail.
- Examiner l'architecture existante.
- Vérifier la compatibilité de l'environnement Cloudflare.
- Décider définitivement du stockage.
- Formaliser les migrations.
- Définir les conventions de code et les contrats API.

Aucune modification du dépôt n'est réputée réalisée par ce document.

## Phase 1 — Identité

- Inscription.
- Vérification email.
- Hachage Argon2id.
- Sessions opaques.
- Cookies sécurisés.
- Réinitialisation de mot de passe.
- Révocation des sessions.
- MFA administrateur.

Critères :
- tests d'authentification ;
- tests d'autorisation ;
- tests de révocation ;
- tests de limitation de débit.

## Phase 2 — Profils

- Profil hôte.
- Profil voyageur.
- Rôles multiples pour un même utilisateur.
- Séparation des données publiques et privées.
- Contrôles de propriété.

## Phase 3 — Offres

- Création gratuite.
- Brouillon.
- Validation des champs.
- Versionnement immuable.
- Soumission à modération.
- Suspension et retrait.

## Phase 4 — Conformité

- Registre des pays.
- Sources officielles.
- Versions des règles.
- Date de vérification.
- Date d'expiration.
- Évaluation par activité et durée.
- Blocage en cas d'incertitude.
- Revue humaine.

Les pays initiaux sont Rwanda, Afrique du Sud, Kenya, Tanzanie,
Ouganda, Sénégal et Ghana. Leur statut initial reste `RESEARCH`.

## Phase 5 — Modération

- File de revue.
- Approbation.
- Rejet motivé.
- Signalements.
- Blocage et suspension.
- Audit des décisions.

## Phase 6 — Publication et recherche

Une offre est visible uniquement si :
- modération `APPROVED` ;
- conformité `CLEARED` ;
- pays `VERIFIED` ;
- publication `ACTIVE`.

Les filtres de sécurité sont exécutés avant le classement.

## Phase 7 — Candidatures

- Création d'une candidature.
- Référence à la version de l'offre.
- Instantané des conditions.
- Acceptation par les deux parties.
- Refus ou retrait.
- Gestion des modifications de conditions.

## Phase 8 — Consentements et coordonnées

- Consentement explicite des deux parties.
- Vérification des acceptations.
- Vérification de la conformité.
- Vérification des suspensions et blocages.
- Partage conditionnel des coordonnées.
- Journalisation de l'événement.

## Phase 9 — Notifications

- Outbox.
- Tentatives de livraison.
- Gestion des échecs.
- Idempotence.
- Préférences utilisateur.

## Phase 10 — Qualité et sécurité

- Tests unitaires.
- Tests d'intégration.
- Tests de concurrence.
- Tests IDOR/BOLA.
- Tests de rejeu.
- Tests d'idempotence.
- Tests de transitions d'états.
- Tests de non-divulgation des coordonnées.
- Tests de conformité.

## Phase 11 — Préparation au lancement

- Revue juridique pays par pays.
- Revue de sécurité.
- Vérification des sauvegardes.
- Vérification des limites de charge.
- Vérification des journaux et alertes.
- Procédure de réponse aux incidents.
- Procédure manuelle de déploiement.
- Validation finale des conditions d'utilisation.

## Règles de livraison

- Pas de GitHub Actions.
- Pas de CI/CD automatisée.
- Validation locale et manuelle.
- Aucun commit, push ou déploiement sans autorisation explicite.
- Ne jamais déclarer un test réussi sans l'avoir exécuté.
- Ne jamais déclarer une intégration terminée sans l'avoir vérifiée.
