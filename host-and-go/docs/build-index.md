# Index de construction — Host & Go

Ce document indexe les modules de conception récupérables.

Les modules ci-dessous décrivent des exigences et décisions. Leur présence
dans cet index ne prouve pas qu'ils ont été codés ou intégrés au dépôt.

## Modules BUILD 001 à 024

### BUILD 001 — Cycle de vie des offres
Définir les états de création, soumission, modération, validation,
publication, suspension, retrait et archivage.

### BUILD 002 — Moteur de conformité
Évaluer les règles applicables selon le pays, la nationalité, la résidence,
la durée, l'activité et les avantages proposés.

### BUILD 003 — Recherche et matching
Appliquer les filtres d'éligibilité avant tout classement des résultats.

### BUILD 004 — Candidatures et double acceptation
Garantir que les deux parties acceptent la même version des conditions.

### BUILD 005 — Confiance, sécurité et modération
Prévoir les signalements, blocages, suspensions, examens humains
et décisions traçables.

### BUILD 006 — Administration et opérations
Fournir des outils d'examen, de décision, de suspension et d'audit.

### BUILD 007 — Notifications
Mettre en place une outbox fiable et des tentatives de livraison.

### BUILD 008 — Performance, observabilité et résilience
Mesurer les performances, journaliser les erreurs et définir les limites
de charge et les stratégies de reprise.

### BUILD 009 — Machines à états
Formaliser les transitions autorisées et interdire les transitions
incohérentes.

### BUILD 010 — RBAC et contrôle d'accès
Séparer les rôles et vérifier chaque action côté serveur.

### BUILD 011 — Sécurité et contrats API
Définir les entrées, sorties, erreurs, validations et limites de requêtes.

### BUILD 012 — Modèle de menace
Identifier les abus, les attaques d'accès horizontal, les usurpations
et les risques de manipulation des états.

### BUILD 013 — Vie privée et gouvernance des données
Limiter les données collectées et encadrer leur accès, conservation
et suppression.

### BUILD 014 — Tests et qualité
Prévoir tests unitaires, intégration, sécurité, concurrence et régression.

### BUILD 015 — Déploiement et release
Utiliser une procédure manuelle, reproductible et vérifiable.

### BUILD 016 — Migrations et données initiales
Versionner les migrations et vérifier leur compatibilité.

### BUILD 017 — Découverte et recherche
Empêcher l'affichage d'offres non conformes ou non approuvées.

### BUILD 018 — Parcours voyageur
Définir découverte, consultation, candidature, acceptation et suivi.

### BUILD 019 — Parcours hôte
Définir profil, création, soumission, publication et gestion des candidatures.

### BUILD 020 — Tableau de bord administrateur
Permettre la revue des offres, comptes, signalements et décisions.

### BUILD 021 — Gouvernance juridique
Maintenir des sources officielles, dates de vérification et périmètres
d'application par pays.

### BUILD 022 — Paiements et intégrité financière
Aucun paiement interne dans le MVP. Toute monétisation future est
hors périmètre initial et exige une décision distincte.

### BUILD 023 — Internationalisation
Préparer les contenus et interfaces à plusieurs langues.
Le français est la langue de travail initiale.

### BUILD 024 — Revue et gel d'architecture
Effectuer une revue finale avant d'engager l'implémentation complète.

## Modules BUILD 025 à 032

### BUILD 025 — Vertical slice MVP
Parcours :
inscription → vérification email → profil hôte → brouillon gratuit
→ modération → conformité pays → publication → recherche publique.

### BUILD 026 — Décision de stockage
D1/SQLite est provisoire. Vérifier les garanties transactionnelles,
les contraintes de concurrence et la stratégie de migration.

### BUILD 027 — Modèle de données consolidé
Tables prévues :
- users
- user_roles
- user_sessions
- host_profiles
- traveler_profiles
- countries
- country_rule_versions
- offers
- offer_versions
- offer_activities
- moderation_reviews
- applications
- application_terms_versions
- consents
- contact_shares
- reports
- audit_events
- notification_outbox
- notification_deliveries

### BUILD 028 — Intégrité SQL
Prévoir clés étrangères, contraintes, unicité, versions immuables,
idempotence et transactions sur les opérations critiques.

### BUILD 029 — Moteur pays
États pays :
`RESEARCH`, `VERIFIED`, `RESTRICTED`, `EXPIRED`.

Décisions :
`CLEARED`, `BLOCKED`, `HUMAN_REVIEW`.

### BUILD 030 — Moteur d'éligibilité
Vérifier pays, activité, durée et autorisation requise.

### BUILD 031 — API sécurisée
Définir les endpoints d'offres, recherche et candidatures avec
authentification, autorisation, validation, limitation de débit
et pagination.

### BUILD 032 — Authentification et sessions
Prévoir Argon2id, jetons opaques aléatoires stockés sous forme hachée,
cookies sécurisés, vérification email, MFA administrateur,
réinitialisation à usage unique, rotation et révocation des sessions.
