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

## 3. Schéma SQL de base

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE offers (
    id TEXT PRIMARY KEY,
    host_user_id TEXT NOT NULL,
    current_version INTEGER NOT NULL DEFAULT 1,
    moderation_status TEXT NOT NULL DEFAULT 'PENDING'
      CHECK (moderation_status IN ('PENDING','APPROVED','REJECTED')),
    compliance_status TEXT NOT NULL DEFAULT 'UNKNOWN'
      CHECK (compliance_status IN ('UNKNOWN','CLEARED','BLOCKED')),
    publication_status TEXT NOT NULL DEFAULT 'INACTIVE'
      CHECK (publication_status IN ('INACTIVE','ACTIVE','SUSPENDED')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CHECK (current_version >= 1)
);

CREATE TABLE offer_versions (
    offer_id TEXT NOT NULL,
    version INTEGER NOT NULL,
    terms_json TEXT NOT NULL,
    terms_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (offer_id, version),
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE RESTRICT,
    CHECK (version >= 1)
);

CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL,
    traveler_user_id TEXT NOT NULL,
    offer_version INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING'
      CHECK (status IN (
        'PENDING','ACCEPTED','REJECTED','WITHDRAWN','CANCELLED'
      )),
    created_at TEXT NOT NULL,
    FOREIGN KEY (offer_id, offer_version)
      REFERENCES offer_versions(offer_id, version),
    FOREIGN KEY (traveler_user_id)
      REFERENCES users(id) ON DELETE RESTRICT
);

CREATE UNIQUE INDEX uq_application_active
ON applications(offer_id, traveler_user_id)
WHERE status IN ('PENDING','ACCEPTED');

CREATE TABLE application_acceptances (
    application_id TEXT NOT NULL,
    terms_version INTEGER NOT NULL,
    actor_user_id TEXT NOT NULL,
    accepted_at TEXT NOT NULL,
    PRIMARY KEY (application_id, terms_version, actor_user_id),
    FOREIGN KEY (application_id)
      REFERENCES applications(id) ON DELETE RESTRICT,
    FOREIGN KEY (actor_user_id)
      REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE idempotency_keys (
    scope TEXT NOT NULL,
    idempotency_key TEXT NOT NULL,
    request_hash TEXT NOT NULL,
    response_json TEXT,
    created_at TEXT NOT NULL,
    PRIMARY KEY (scope, idempotency_key)
);

CREATE TABLE notification_outbox (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_type TEXT NOT NULL,
    payload_json TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING'
      CHECK (status IN ('PENDING','PROCESSING','SENT','FAILED','DEAD')),
    attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
    available_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE notification_deliveries (
    id TEXT PRIMARY KEY,
    outbox_id TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('EMAIL','IN_APP','SMS')),
    provider_reference TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING','SENT','FAILED')),
    delivered_at TEXT,
    FOREIGN KEY (outbox_id)
      REFERENCES notification_outbox(id) ON DELETE RESTRICT
);

CREATE TABLE notification_preferences (
    user_id TEXT NOT NULL,
    channel TEXT NOT NULL,
    enabled INTEGER NOT NULL CHECK (enabled IN (0,1)),
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, channel),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE INDEX idx_outbox_pending
ON notification_outbox(status, available_at);
```

Ce SQL constitue un socle partiel de conception. Il dépend notamment
de la création préalable de la table `users` et ne représente pas
l'ensemble des migrations de production.

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
