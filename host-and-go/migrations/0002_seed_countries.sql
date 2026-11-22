-- Host & Go — migration 0002 : pays initiaux
-- Tous en RESEARCH : aucun pays n'est vérifié juridiquement.
-- Passer un pays à VERIFIED exige une règle VERIFIED (source officielle,
-- dates, responsable) dans country_rule_versions.

INSERT OR IGNORE INTO countries (code, name_fr, status, updated_at) VALUES
  ('RW', 'Rwanda',         'RESEARCH', '2026-11-22T00:00:00Z'),
  ('ZA', 'Afrique du Sud', 'RESEARCH', '2026-11-22T00:00:00Z'),
  ('KE', 'Kenya',          'RESEARCH', '2026-11-22T00:00:00Z'),
  ('TZ', 'Tanzanie',       'RESEARCH', '2026-11-22T00:00:00Z'),
  ('UG', 'Ouganda',        'RESEARCH', '2026-11-22T00:00:00Z'),
  ('SN', 'Sénégal',        'RESEARCH', '2026-11-22T00:00:00Z'),
  ('GH', 'Ghana',          'RESEARCH', '2026-11-22T00:00:00Z');
