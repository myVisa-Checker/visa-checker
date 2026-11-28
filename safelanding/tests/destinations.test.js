import test from 'node:test';
import assert from 'node:assert/strict';
import { destinationsFor, createRegistry, ALL_PACKS, BR_PACK, parseDate } from '../web/src/index.js';
const registry = createRegistry(ALL_PACKS), TODAY = parseDate('2026-11-26');
const verifiedReg = (date = '2026-11-20') => createRegistry([...ALL_PACKS.filter((p) => p.id !== 'br'),
  { ...BR_PACK, rules: BR_PACK.rules.map((r) => ({ ...r, verification: { ...r.verification, status: 'verified', lastVerified: date } })) }]);

test('nationalité tunisienne : seul le Brésil est proposé, signalé non vérifié, avec motifs, durée et source', () => {
  const d = destinationsFor('TN', registry, TODAY);
  assert.deepEqual(d.map((x) => x.country), ['BR']);
  assert.equal(d[0].reliability, 'unverified'); assert.deepEqual(d[0].purposes, ['tourism', 'business']); assert.equal(d[0].maxStayDays, 90);
  assert.match(d[0].source.url, /^https:\/\//);
});
test('nationalité sans règle d’exemption enregistrée : liste vide (rien n’est supposé)', () => {
  for (const nat of ['FR', 'DZ', 'MA', 'US', 'ZZ']) assert.deepEqual(destinationsFor(nat, registry, TODAY), [], nat);
});
test('entrées invalides : jamais d’exception, liste vide', () => {
  for (const bad of ['', '  ', null, undefined, 5, 'tunisie']) assert.deepEqual(destinationsFor(bad, registry, TODAY), []);
  assert.deepEqual(destinationsFor('TN', null, TODAY), []);
});
test('la casse de la nationalité est normalisée', () => { assert.deepEqual(destinationsFor(' tn ', registry, TODAY).map((x) => x.country), ['BR']); });
test('règle vérifiée récente : fiabilité « verified » ; trop ancienne : « outdated » (la destination reste listée, signalée)', () => {
  assert.equal(destinationsFor('TN', verifiedReg(), TODAY)[0].reliability, 'verified');
  assert.equal(destinationsFor('TN', verifiedReg('2026-01-01'), TODAY)[0].reliability, 'outdated');
});
test('seules les règles d’exemption comptent : les packs sans exemption (Schengen, États-Unis…) ne sont jamais listés', () => {
  const all = ['TN', 'FR', 'DZ'].flatMap((n) => destinationsFor(n, registry, TODAY).map((x) => x.country));
  for (const c of ['DE', 'FR', 'US', 'CA', 'GB']) assert.ok(!all.includes(c), c);
});
test('extensible : un nouveau pack d’exemption apparaît sans modifier le moteur, sans doublon, trié', () => {
  const extra = { id: 'xx', name: 'Pays de test', countries: ['AR'], rules: [
    { id: 'entry-authorization', category: 'visa', title: 'Visa', kind: 'visa_exemption', appliesTo: { nationalities: ['TN', 'MA'] }, params: { purposes: ['tourism'], maxStayDays: 30 },
      verification: { status: 'unverified', lastVerified: null, source: { name: 's', url: 'https://example.org' } } },
    { id: 'entry-authorization', category: 'visa', title: 'Visa bis', kind: 'visa_exemption', appliesTo: { nationalities: ['TN'] }, params: {}, verification: { status: 'unverified', lastVerified: null, source: null } }] };
  const reg = createRegistry([...ALL_PACKS, extra]);
  assert.deepEqual(destinationsFor('TN', reg, TODAY).map((x) => x.country), ['AR', 'BR']); assert.deepEqual(destinationsFor('MA', reg, TODAY).map((x) => x.country), ['AR']);
});
