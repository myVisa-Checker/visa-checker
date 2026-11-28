import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, STATUS as S, parseDate } from '../web/src/index.js';
import { mk, registry, byId, TODAY } from './helpers.js';
const run = (s, today = TODAY) => evaluate(s, { registry, today });

test('dossier complet avec règles vérifiées : tout conforme', () => {
  const r = run(mk()); assert.ok(r.valid);
  for (const id of ['passport', 'funds', 'insurance', 'ticket', 'lodging']) assert.equal(byId(r, id).status, S.COMPLIANT, id);
  assert.equal(byId(r, 'visa-fr'), undefined); // nationalité FR exclue de cette règle de test
});
test('nationalités différentes : la règle conditionnelle s’applique', () => {
  const r = run(mk({ nationality: 'TN' })); assert.equal(byId(r, 'visa-fr').status, S.TO_VERIFY);
});
test('passeport expirant avant la validité exigée (6 mois après fin de séjour)', () => {
  const r = run(mk({}, { passport: { expiry: '2027-03-01', issueDate: '2023-01-01', blankPages: 4 } }));
  assert.equal(byId(r, 'passport').status, S.MISSING); assert.match(byId(r, 'passport').message, /insuffisant/);
  assert.ok(r.alerts.some((a) => a.type === 'missing' && a.severity === 'high'));
});
test('passeport déjà expiré', () => {
  const r = run(mk({}, { passport: { expiry: '2026-01-01', issueDate: '2016-01-01', blankPages: 4 } }));
  assert.equal(byId(r, 'passport').status, S.EXPIRED);
});
test('passeport trop ancien et pages vierges insuffisantes', () => {
  assert.equal(byId(run(mk({}, { passport: { expiry: '2030-01-01', issueDate: '2012-01-01', blankPages: 4 } })), 'passport').status, S.MISSING);
  assert.equal(byId(run(mk({}, { passport: { expiry: '2030-01-01', issueDate: '2023-01-01', blankPages: 1 } })), 'passport').status, S.MISSING);
});
test('documents absents : À préparer', () => {
  const r = run(mk({}, { passport: {}, ticket: {}, lodging: {}, funds: { amount: null }, insurance: {} }));
  for (const id of ['passport', 'ticket', 'lodging', 'funds', 'insurance']) assert.equal(byId(r, id).status, S.TO_PREPARE, id);
});
test('billet sans retour ni continuation : Manquant', () => {
  assert.equal(byId(run(mk({}, { ticket: { outbound: '2026-12-10', return: '', onward: false } })), 'ticket').status, S.MISSING);
  assert.equal(byId(run(mk({}, { ticket: { outbound: '2026-12-10', return: '', onward: true } })), 'ticket').status, S.COMPLIANT);
});
test('hébergement chez un particulier sans coordonnées de l’hôte', () => {
  assert.equal(byId(run(mk({ accommodation: 'private' })), 'lodging').status, S.MISSING);
  assert.equal(byId(run(mk({ accommodation: 'private' }, { lodging: { address: 'x', hostContact: 'tel 123' } })), 'lodging').status, S.COMPLIANT);
});
test('ressources : cohérence durée du séjour / moyens', () => {
  assert.equal(byId(run(mk({ stayDays: 10 }, { funds: { amount: 499, currency: 'EUR' } })), 'funds').status, S.MISSING);
  assert.equal(byId(run(mk({ stayDays: 10 }, { funds: { amount: 500, currency: 'EUR' } })), 'funds').status, S.COMPLIANT);
  assert.equal(byId(run(mk({}, { funds: { amount: 9999, currency: 'USD' } })), 'funds').status, S.TO_VERIFY);
});
test('changement de dates : la durée change le résultat', () => {
  const docs = { funds: { amount: 600, currency: 'EUR' } };
  assert.equal(byId(run(mk({ stayDays: 10 }, docs)), 'funds').status, S.COMPLIANT);
  assert.equal(byId(run(mk({ stayDays: 30 }, docs)), 'funds').status, S.MISSING);
  const late = run(mk({ departureDate: '2027-06-01', stayDays: 10 }, { insurance: { validFrom: '2026-12-09', validTo: '2026-12-21' } }));
  assert.equal(byId(late, 'insurance').status, S.MISSING);
});
test('assurance : couverture partielle, exigence inconnue (socle commun)', () => {
  assert.equal(byId(run(mk({}, { insurance: { validFrom: '2026-12-11', validTo: '2026-12-21' } })), 'insurance').status, S.MISSING);
  assert.equal(byId(run(mk({ destination: 'JP' }, { insurance: {} })), 'insurance').status, S.TO_VERIFY);
});
test('voyage avec transit : un élément par pays, jamais décidé', () => {
  const r = run(mk({ transit: ['AE', 'TR'] }));
  assert.equal(byId(r, 'transit:AE').status, S.TO_VERIFY); assert.equal(byId(r, 'transit:TR').status, S.TO_VERIFY);
  assert.equal(byId(r, 'transit:AE').source.url, null);
  assert.ok(r.alerts.some((a) => a.itemId === 'transit:AE' && a.type === 'reliability'));
});
test('transit par un pays disposant d’un pack : source du pack utilisée', () => {
  const r = run(mk({ transit: ['FR'] })); assert.equal(byId(r, 'transit:FR').source.url, 'https://home-affairs.ec.europa.eu/policies/schengen_en');
});
test('règle non vérifiée : jamais « Conforme » (rétrogradée en À vérifier)', () => {
  const r = run(mk({ destination: 'JP' })); // pas de pack : socle commun non vérifié
  const t = byId(r, 'ticket'); assert.equal(t.computedStatus, S.COMPLIANT); assert.equal(t.status, S.TO_VERIFY);
  assert.equal(t.downgraded, true); assert.equal(t.reliability, 'unverified');
  assert.ok(r.items.every((i) => i.status !== S.COMPLIANT));
});
test('règle obsolète (> 180 jours) : rétrogradée', () => {
  const r = run(mk({ departureDate: '2027-06-10' }), parseDate('2027-06-01')); // pack de test vérifié le 2026-10-01
  assert.equal(byId(r, 'ticket').reliability, 'outdated'); assert.notEqual(byId(r, 'ticket').status, S.COMPLIANT);
});
test('pack Schengen : règle de passeport appliquée mais signalée non vérifiée', () => {
  const r = run(mk({ destination: 'DE' }, { passport: { expiry: '2027-01-01', issueDate: '2023-01-01' } }));
  assert.equal(byId(r, 'passport').status, S.MISSING); assert.equal(byId(r, 'passport').reliability, 'unverified');
  assert.ok(byId(r, 'passport').needsHumanCheck);
});
test('chaque élément porte source, fiabilité et date de vérification (clé présente)', () => {
  for (const i of run(mk({ transit: ['AE'] })).items) { assert.ok('source' in i && 'reliability' in i && 'lastVerified' in i, i.id); }
});
test('mineur : élément spécifique ajouté', () => {
  assert.equal(byId(run(mk({ birthDate: '2015-05-05' })), 'minor').status, S.TO_VERIFY);
  assert.equal(byId(run(mk({ birthDate: '1990-05-05' })), 'minor'), undefined);
});
test('motif professionnel : formalité spécifique', () => {
  assert.ok(byId(run(mk({ purpose: 'business' })), 'purpose')); assert.equal(byId(run(mk({ purpose: 'tourism' })), 'purpose'), undefined);
});
test('progression : « traité » compte, sauf Manquant/Expiré', () => {
  const s = mk({ destination: 'JP' }); const base = run(s).progress.done;
  s.handled = { ticket: true }; assert.equal(run(s).progress.done, base + 1);
  const bad = mk({}, { passport: { expiry: '2026-01-01' } }); bad.handled = { passport: true };
  assert.equal(byId(run(bad), 'passport').handled, true);
  assert.equal(run(bad).progress.done, run(mk({}, { passport: { expiry: '2026-01-01' } })).progress.done);
});
test('profil invalide : aucune checklist', () => {
  const r = run(mk({ destination: '' })); assert.equal(r.valid, false); assert.equal(r.items.length, 0); assert.ok(r.errors.length);
});
