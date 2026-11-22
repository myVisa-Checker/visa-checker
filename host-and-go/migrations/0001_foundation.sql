-- Host & Go — migration 0001 : schéma fondateur (SQLite / D1)
-- Statut : conception. Non exécutée sur une base réelle.
-- Ordre : tables sans dépendance d'abord.

PRAGMA foreign_keys = ON;

-- ───────────── Identité ─────────────

CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL COLLATE NOCASE UNIQUE,
    email_verified_at TEXT,
    password_hash TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ACTIVE'
      CHECK (status IN ('ACTIVE','SUSPENDED','BLOCKED','DELETED')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE user_roles (
    user_id TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('HOST','TRAVELER','MODERATOR','ADMIN')),
    granted_at TEXT NOT NULL,
    granted_by TEXT,
    PRIMARY KEY (user_id, role),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (granted_by) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL UNIQUE,   -- hash du jeton opaque, jamais le jeton
    created_at TEXT NOT NULL,
    expires_at TEXT NOT NULL,
    last_seen_at TEXT,
    mfa_verified_at TEXT,
    revoked_at TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_sessions_user ON user_sessions(user_id);

-- ───────────── Pays et conformité ─────────────

CREATE TABLE countries (
    code TEXT PRIMARY KEY CHECK (length(code) = 2 AND code = upper(code)),
    name_fr TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'RESEARCH'
      CHECK (status IN ('RESEARCH','VERIFIED','RESTRICTED','EXPIRED')),
    updated_at TEXT NOT NULL
);

CREATE TABLE country_rule_versions (
    id TEXT PRIMARY KEY,
    country_code TEXT NOT NULL,
    version INTEGER NOT NULL CHECK (version >= 1),
    status TEXT NOT NULL DEFAULT 'DRAFT'
      CHECK (status IN ('DRAFT','VERIFIED','SUPERSEDED','EXPIRED')),
    -- nationalité, résidence, durée, activité, rémunération,
    -- avantages en nature, hébergement, repas, autorisation requise
    rule_json TEXT NOT NULL,
    official_source_url TEXT,
    consulted_at TEXT,
    last_verified_at TEXT,
    expires_at TEXT,
    verified_by_user_id TEXT,
    created_at TEXT NOT NULL,
    UNIQUE (country_code, version),
    FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE RESTRICT,
    FOREIGN KEY (verified_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    -- Une règle ne peut être VERIFIED sans source, dates et responsable.
    CHECK (status <> 'VERIFIED' OR (
        official_source_url IS NOT NULL
        AND consulted_at IS NOT NULL
        AND last_verified_at IS NOT NULL
        AND expires_at IS NOT NULL
        AND verified_by_user_id IS NOT NULL
    ))
);

-- ───────────── Profils ─────────────

CREATE TABLE host_profiles (
    user_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    bio TEXT,
    country_code TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE RESTRICT
);

CREATE TABLE traveler_profiles (
    user_id TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    bio TEXT,
    nationality_code TEXT,           -- donnée privée, jamais publique
    residence_country_code TEXT,     -- donnée privée, jamais publique
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ───────────── Offres ─────────────

CREATE TABLE offers (
    id TEXT PRIMARY KEY,
    host_user_id TEXT NOT NULL,
    country_code TEXT NOT NULL,
    current_version INTEGER NOT NULL DEFAULT 1 CHECK (current_version >= 1),
    moderation_status TEXT NOT NULL DEFAULT 'PENDING'
      CHECK (moderation_status IN ('PENDING','APPROVED','REJECTED')),
    compliance_status TEXT NOT NULL DEFAULT 'UNKNOWN'
      CHECK (compliance_status IN ('UNKNOWN','CLEARED','BLOCKED')),
    publication_status TEXT NOT NULL DEFAULT 'INACTIVE'
      CHECK (publication_status IN ('INACTIVE','ACTIVE','SUSPENDED')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (host_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (country_code) REFERENCES countries(code) ON DELETE RESTRICT
);
-- Invariant applicatif : current_version référence une ligne de offer_versions
-- (non imposé en SQL pour éviter une FK circulaire différée sous D1).

-- Index partiel de la recherche publique (le statut du pays est joint à la requête).
CREATE INDEX idx_offers_visible ON offers(country_code)
  WHERE moderation_status = 'APPROVED'
    AND compliance_status = 'CLEARED'
    AND publication_status = 'ACTIVE';

CREATE TABLE offer_versions (
    offer_id TEXT NOT NULL,
    version INTEGER NOT NULL CHECK (version >= 1),
    terms_json TEXT NOT NULL,
    terms_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (offer_id, version),
    FOREIGN KEY (offer_id) REFERENCES offers(id) ON DELETE RESTRICT
);

CREATE TABLE offer_activities (
    id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL,
    offer_version INTEGER NOT NULL,
    activity TEXT NOT NULL CHECK (activity IN (
        'GARDENING','FARM_HELP','COOKING','MAINTENANCE',
        'LANGUAGE_EXCHANGE','FAMILY_HELP'
    )),
    hours_per_week INTEGER CHECK (hours_per_week IS NULL OR hours_per_week > 0),
    description TEXT,
    FOREIGN KEY (offer_id, offer_version)
      REFERENCES offer_versions(offer_id, version) ON DELETE RESTRICT
);
CREATE INDEX idx_offer_activities_offer ON offer_activities(offer_id, offer_version);

CREATE TABLE moderation_reviews (
    id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL,
    offer_version INTEGER NOT NULL,
    reviewer_user_id TEXT NOT NULL,
    decision TEXT NOT NULL CHECK (decision IN ('APPROVED','REJECTED','NEEDS_CHANGES')),
    reason TEXT NOT NULL CHECK (length(reason) > 0),
    created_at TEXT NOT NULL,
    FOREIGN KEY (offer_id, offer_version)
      REFERENCES offer_versions(offer_id, version) ON DELETE RESTRICT,
    FOREIGN KEY (reviewer_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ───────────── Candidatures, conditions, consentements ─────────────

CREATE TABLE applications (
    id TEXT PRIMARY KEY,
    offer_id TEXT NOT NULL,
    traveler_user_id TEXT NOT NULL,
    offer_version INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING'
      CHECK (status IN ('PENDING','ACCEPTED','REJECTED','WITHDRAWN','CANCELLED')),
    created_at TEXT NOT NULL,
    FOREIGN KEY (offer_id, offer_version)
      REFERENCES offer_versions(offer_id, version) ON DELETE RESTRICT,
    FOREIGN KEY (traveler_user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE UNIQUE INDEX uq_application_active
ON applications(offer_id, traveler_user_id)
WHERE status IN ('PENDING','ACCEPTED');

CREATE TABLE application_terms_versions (
    application_id TEXT NOT NULL,
    version INTEGER NOT NULL CHECK (version >= 1),
    terms_json TEXT NOT NULL,        -- instantané figé des conditions
    terms_hash TEXT NOT NULL,
    created_at TEXT NOT NULL,
    PRIMARY KEY (application_id, version),
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE RESTRICT
);

CREATE TABLE application_acceptances (
    application_id TEXT NOT NULL,
    terms_version INTEGER NOT NULL,
    actor_user_id TEXT NOT NULL,
    accepted_at TEXT NOT NULL,
    PRIMARY KEY (application_id, terms_version, actor_user_id),
    FOREIGN KEY (application_id, terms_version)
      REFERENCES application_terms_versions(application_id, version) ON DELETE RESTRICT,
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE consents (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    terms_version INTEGER NOT NULL,
    actor_user_id TEXT NOT NULL,
    consent_type TEXT NOT NULL CHECK (consent_type IN ('CONTACT_SHARING')),
    granted_at TEXT NOT NULL,
    revoked_at TEXT,
    UNIQUE (application_id, terms_version, actor_user_id, consent_type),
    FOREIGN KEY (application_id, terms_version)
      REFERENCES application_terms_versions(application_id, version) ON DELETE RESTRICT,
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE RESTRICT
);

CREATE TABLE contact_shares (
    id TEXT PRIMARY KEY,
    application_id TEXT NOT NULL,
    terms_version INTEGER NOT NULL,
    shared_at TEXT NOT NULL,
    -- Instantané des préconditions vérifiées côté serveur au moment du partage.
    decision_snapshot_json TEXT NOT NULL,
    revoked_at TEXT,
    UNIQUE (application_id, terms_version),
    FOREIGN KEY (application_id, terms_version)
      REFERENCES application_terms_versions(application_id, version) ON DELETE RESTRICT
);

-- ───────────── Signalements et audit ─────────────

CREATE TABLE reports (
    id TEXT PRIMARY KEY,
    reporter_user_id TEXT NOT NULL,
    target_type TEXT NOT NULL CHECK (target_type IN ('USER','OFFER')),
    target_id TEXT NOT NULL,
    reason_code TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'OPEN'
      CHECK (status IN ('OPEN','IN_REVIEW','ACTIONED','DISMISSED')),
    created_at TEXT NOT NULL,
    resolved_at TEXT,
    resolved_by_user_id TEXT,
    resolution_reason TEXT,
    FOREIGN KEY (reporter_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (resolved_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CHECK (status NOT IN ('ACTIONED','DISMISSED')
           OR (resolved_at IS NOT NULL AND resolution_reason IS NOT NULL))
);
CREATE INDEX idx_reports_open ON reports(status, created_at);

CREATE TABLE audit_events (
    id TEXT PRIMARY KEY,
    actor_user_id TEXT,              -- NULL = action système
    action TEXT NOT NULL,
    object_type TEXT NOT NULL,
    object_id TEXT NOT NULL,
    previous_state_json TEXT,
    new_state_json TEXT,
    reason TEXT,
    context_json TEXT,               -- ne jamais y mettre de secret
    created_at TEXT NOT NULL,
    FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE RESTRICT
);
CREATE INDEX idx_audit_object ON audit_events(object_type, object_id, created_at);

-- ───────────── Idempotence et notifications ─────────────

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
CREATE INDEX idx_outbox_pending ON notification_outbox(status, available_at);

CREATE TABLE notification_deliveries (
    id TEXT PRIMARY KEY,
    outbox_id TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('EMAIL','IN_APP','SMS')),
    provider_reference TEXT,
    status TEXT NOT NULL CHECK (status IN ('PENDING','SENT','FAILED')),
    delivered_at TEXT,
    FOREIGN KEY (outbox_id) REFERENCES notification_outbox(id) ON DELETE RESTRICT
);

CREATE TABLE notification_preferences (
    user_id TEXT NOT NULL,
    channel TEXT NOT NULL CHECK (channel IN ('EMAIL','IN_APP','SMS')),
    enabled INTEGER NOT NULL CHECK (enabled IN (0,1)),
    updated_at TEXT NOT NULL,
    PRIMARY KEY (user_id, channel),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- ───────────── Immutabilité ─────────────

CREATE TRIGGER offer_versions_no_update BEFORE UPDATE ON offer_versions
BEGIN SELECT RAISE(ABORT, 'offer_versions est immuable'); END;
CREATE TRIGGER offer_versions_no_delete BEFORE DELETE ON offer_versions
BEGIN SELECT RAISE(ABORT, 'offer_versions est immuable'); END;

CREATE TRIGGER terms_versions_no_update BEFORE UPDATE ON application_terms_versions
BEGIN SELECT RAISE(ABORT, 'application_terms_versions est immuable'); END;
CREATE TRIGGER terms_versions_no_delete BEFORE DELETE ON application_terms_versions
BEGIN SELECT RAISE(ABORT, 'application_terms_versions est immuable'); END;

CREATE TRIGGER acceptances_no_update BEFORE UPDATE ON application_acceptances
BEGIN SELECT RAISE(ABORT, 'application_acceptances est immuable'); END;
CREATE TRIGGER acceptances_no_delete BEFORE DELETE ON application_acceptances
BEGIN SELECT RAISE(ABORT, 'application_acceptances est immuable'); END;

CREATE TRIGGER audit_events_no_update BEFORE UPDATE ON audit_events
BEGIN SELECT RAISE(ABORT, 'audit_events est immuable'); END;
CREATE TRIGGER audit_events_no_delete BEFORE DELETE ON audit_events
BEGIN SELECT RAISE(ABORT, 'audit_events est immuable'); END;
