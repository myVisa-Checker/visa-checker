import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, validateProfile, isMinor, parseDate, addMonths, createRegistry, sanitizeState, serializeState, parseState, emptyState,
  createChangeReport, explainItem, buildAiPrompt, guardAiAnswer, ALL_PACKS } from '../web/src/index.js';
import { mk, registry, byId, TODAY } from './helpers.js';

test('profil : validation et normalisation', () => {
  const ok = validateProfile({ nationality: 'fr', residence: 'fr ', destination: 'de', transit: 'ae, tr', departureDate: '2026-12-10', stayDays: '7', purpose: 'tourism', accommodation: 'hotel' }, TODAY);
  assert.ok(ok.valid); assert.deepEqual(ok.profile.transit, ['AE', 'TR']); assert.equal(ok.profile.stayDays, 7);
  const f = (o) => validateProfile({ ...mk().profile, ...o }, TODAY).errors.map((e) => e.field);
  assert.ok(f({ departureDate: '2026-02-30' }).includes('departureDate'));
  assert.ok(f({ departureDate: '2026-11-01' }).includes('departureDate'));
  assert.ok(f({ stayDays: 0 }).includes('stayDays')); assert.ok(f({ stayDays: 400 }).includes('stayDays'));
  assert.ok(f({ transit: ['ZZ'], destination: 'ZZ' }).includes('transit'));
  assert.ok(f({ transit: ['AA', 'BB', 'CC', 'DD', 'EE', 'FF'] }).includes('transit'));
  assert.ok(f({ nationality: 'France' }).includes('nationality'));
});
test('dates : fin de mois et mineur', () => {
  assert.equal(addMonths(parseDate('2026-08-31'), 6).toISOString().slice(0, 10), '2027-02-28');
  assert.equal(isMinor({ birthDate: '2008-12-11' }, parseDate('2026-12-10')), true);
  assert.equal(isMinor({ birthDate: '2008-12-10' }, parseDate('2026-12-10')), false);
});
test('alertes : incohérences de dates', () => {
  const r = evaluate(mk({}, { ticket: { outbound: '2026-12-10', return: '2026-12-05', onward: false } }), { registry, today: TODAY });
  assert.ok(r.alerts.some((a) => a.type === 'inconsistency' && /antérieur/.test(a.message)));
  const r2 = evaluate(mk({}, { lodging: { address: 'x', checkIn: '2026-12-10', checkOut: '2026-12-12' } }), { registry, today: TODAY });
  assert.ok(r2.alerts.some((a) => /ne couvre pas la fin/.test(a.message)));
  const r3 = evaluate(mk({}, { ticket: { outbound: '2026-12-11', return: '2026-12-20' } }), { registry, today: TODAY });
  assert.ok(r3.alerts.some((a) => /diffère de la date de départ/.test(a.message)));
});
test('alertes : échéance proche avec éléments manquants, passeport bientôt expiré', () => {
  const r = evaluate(mk({ departureDate: '2026-12-01' }, { ticket: {} }), { registry, today: TODAY });
  assert.ok(r.alerts.some((a) => a.type === 'deadline' && a.severity === 'high'));
  const r2 = evaluate(mk({}, { passport: { expiry: '2027-03-01', issueDate: '2023-01-01', blankPages: 4 } }), { registry, today: TODAY });
  assert.ok(r2.alerts.some((a) => a.type === 'deadline' && /renouvellement/.test(a.message)));
});
test('registre extensible : doublon de pays refusé, pack invalide refusé', () => {
  assert.throws(() => createRegistry([ALL_PACKS[0], { id: 'x', countries: ['FR'], rules: [] }]), /deux packs/);
  assert.throws(() => createRegistry([{ id: 'x' }]), /invalide/);
  assert.equal(createRegistry([{ id: 'n', countries: ['NZ'], rules: [] }]).get('NZ').id, 'n');
});
test('état : liste blanche — jamais de numéro de passeport ni de champs inconnus', () => {
  const dirty = { version: 1, profile: mk().profile, handled: { ticket: true, '<script>': true, x: false },
    documents: { passport: { expiry: '2028-01-01', number: 'AB1234567', mrz: 'P<FRA...', blankPages: -3 }, evil: { a: 1 } }, extra: 'x', changeReports: [{ ruleId: 'r', note: 'n'.repeat(900) }] };
  const out = sanitizeState(dirty), json = JSON.stringify(out);
  assert.ok(!json.includes('AB1234567') && !json.includes('mrz') && !json.includes('evil') && !json.includes('script'));
  assert.equal(out.documents.passport.blankPages, null); assert.deepEqual(out.handled, { ticket: true });
  assert.equal(out.changeReports[0].note.length, 500);
});
test('état : aller-retour hors connexion et entrées corrompues', () => {
  const s = mk(); s.handled = { passport: true };
  const back = parseState(serializeState(s));
  assert.deepEqual(back.profile, sanitizeState(s).profile); assert.deepEqual(back.handled, { passport: true });
  assert.deepEqual(parseState('{pas du json'), emptyState()); assert.deepEqual(parseState(null), emptyState());
  assert.deepEqual(parseState(JSON.stringify({ version: 'x' })), emptyState());
  assert.deepEqual(parseState(JSON.stringify({ version: 0 })), emptyState());
  // v2 : un changement de numéro de version ne réinitialise JAMAIS les données (lecture « au mieux » d'une version future)
  const fut = parseState(JSON.stringify({ version: 99, profile: mk().profile, handled: { ticket: true }, inconnu: 1 }));
  assert.equal(fut.profile.destination, 'ZZ'); assert.deepEqual(fut.handled, { ticket: true }); assert.equal(fut.version, 2);
});
test('signalement de changement : validation', () => {
  assert.ok(createChangeReport({ ruleId: 'passport', note: 'Durée portée à 6 mois' }).createdAt);
  assert.throws(() => createChangeReport({ ruleId: 'a b', note: 'valide valide' }));
  assert.throws(() => createChangeReport({ ruleId: 'passport', note: 'ok' }));
});
test('IA : le prompt impose les garde-fous et n’embarque que les faits du moteur', () => {
  const r = evaluate(mk({ destination: 'DE' }), { registry, today: TODAY }), p = buildAiPrompt(r.items.length ? mk().profile : {}, r.items);
  assert.match(p, /N’invente AUCUNE règle/); assert.match(p, /reliability/);
  assert.match(explainItem(byId(r, 'passport')), /non vérifiée/);
});
test('IA : garde-fou rejette URL inconnue et certitude sans règle vérifiée', () => {
  const r = evaluate(mk({ destination: 'DE' }), { registry, today: TODAY });
  assert.equal(guardAiAnswer('Voir https://faux-site.example/visa', r.items).ok, false);
  assert.equal(guardAiAnswer('Le visa est obligatoire.', r.items).ok, false);
  assert.equal(guardAiAnswer('Vérifiez sur https://travel-europe.europa.eu/ ce qui s’applique.', r.items).ok, true);
});
