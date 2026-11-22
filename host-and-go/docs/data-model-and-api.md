# Modèle de données et contrats API

## 1. Tables prévues

- `users`
- `user_roles`
- `user_sessions`
- `host_profiles`
- `traveler_profiles`
- `countries`
- `country_rule_versions`
- `offers`
- `offer_versions`
- `offer_activities`
- `moderation_reviews`
- `applications`
- `application_terms_versions`
- `application_acceptances`
- `consents`
- `contact_shares`
- `reports`
- `audit_events`
- `notification_outbox`
- `notification_deliveries`
- `notification_preferences`
- `idempotency_keys`

## 2. Principes d'intégrité

- Clés étrangères activées.
- Suppression restrictive pour les objets métier importants.
- Versions d'offres immuables.
- Instantanés de conditions immuables.
- Unicité des candidatures actives.
- Acceptations liées à une version précise.
- Idempotence sur les opérations sensibles.
- Transactions pour les opérations atomiques.
- Historique conservé.

## 3. Schéma SQL

Le schéma complet (21 tables prévues + `application_acceptances`) est dans :

- `migrations/0001_foundation.sql` : tables, contraintes, index, triggers d'immutabilité ;
- `migrations/0002_seed_countries.sql` : les 7 pays initiaux, tous en `RESEARCH`.

Garanties portées par le schéma :
- clés étrangères en `ON DELETE RESTRICT` ;
- `offer_versions`, `application_terms_versions`, `application_acceptances`
  et `audit_events` immuables (triggers) ;
- une règle pays ne peut être `VERIFIED` sans source officielle, dates
  et responsable ;
- une seule candidature active par voyageur et par offre ;
- acceptations, consentements et partages liés à une version précise
  des conditions ;
- un signalement clos exige un motif.

Limites connues :
- `offers.current_version` est un invariant applicatif, non une clé étrangère ;
- pas de table pour les jetons à usage unique (vérification email,
  réinitialisation de mot de passe) : à ajouter avec la phase Identité ;
- schéma testé sous SQLite, pas encore sous D1.

## 4. API envisagée

### Offres

- `POST /api/offers`
- `GET /api/offers/:id`
- `PATCH /api/offers/:id`
- `POST /api/offers/:id/submit`
- `POST /api/offers/:id/withdraw`

### Recherche

- `GET /api/search/offers`

Les filtres d'éligibilité sont appliqués avant le classement.

### Candidatures

- `POST /api/offers/:id/applications`
- `GET /api/applications/:id`
- `POST /api/applications/:id/accept`
- `POST /api/applications/:id/reject`
- `POST /api/applications/:id/withdraw`

### Consentement et coordonnées

- `POST /api/applications/:id/consents`
- `GET /api/applications/:id/contact`

L'endpoint de contact recalcule toutes les préconditions côté serveur.

### Signalements

- `POST /api/reports`

### Administration

Les endpoints administratifs doivent exiger un rôle approprié,
une authentification renforcée et un événement d'audit.

## 5. Exigences communes API

- Authentification serveur.
- Autorisation sur chaque objet.
- Validation stricte des entrées.
- Pagination bornée.
- Limitation de débit.
- Réponses d'erreur cohérentes.
- Idempotence pour les opérations sensibles.
- Aucun statut critique contrôlé par le client.
- Journalisation sans divulguer de secrets.
