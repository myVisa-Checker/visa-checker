import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate, evaluateArrival, createRegistry, createAirportRegistry, ALL_PACKS, BR_PACK, STATUS as S, parseDate } from '../web/src/index.js';
import { mk, TODAY } from './helpers.js';

// Cas exemple : voyageur tunisien vers le Brésil. La règle d'exemption est livrée « non vérifiée » (voir packs.js).
const registry = createRegistry(ALL_PACKS), airportRegistry = createAirportRegistry([]);
const tn = (over = {}, docs = {}) => mk({ nationality: 'TN', residence: 'TN', destination: 'BR', purpose: 'tourism', stayDays: 10, ...over }, docs);
const visa = (r) => r.items.find((i) => i.id === 'entry-authorization');
const run = (s, reg = registry) => evaluate(s, { registry: reg, today: TODAY });
// Copie du pack avec la règle déclarée « vérifiée » : sert UNIQUEMENT à tester le mécanisme, jamais livrée.
const verifiedReg = () => createRegistry([...ALL_PACKS.filter((p) => p.id !== 'br'), { ...BR_PACK, rules: BR_PACK.rules.map((r) => ({ ...r, verification: { ...r.verification, status: 'verified', lastVerified: '2026-11-20' } })) }]);

test('Tunisien → Brésil, tourisme 10 j : résultat calculé « non applicable », affiché « À vérifier » car règle non vérifiée', () => {
  const v = visa(run(tn()));
  assert.equal(v.computedStatus, S.NOT_APPLICABLE); assert.equal(v.status, S.TO_VERIFY); assert.equal(v.downgraded, true);
  assert.equal(v.reliability, 'unverified'); assert.equal(v.lastVerified, null); assert.match(v.message, /jusqu’à 90 jours/); assert.match(v.message, /Résultat à confirmer/);
});
test('sources : texte juridique en source principale, page officielle de l’Itamaraty en complément, champ d’application renseigné', () => {
  const v = visa(run(tn()));
  assert.match(v.source.url, /^https:\/\/brasil\.justia\.com\/.*5-169-de-4-8-2004/); assert.match(v.otherSources[0].url, /^https:\/\/www\.gov\.br\/mre\//);
  assert.deepEqual(v.scope, { countries: ['BR'], nationalities: ['TN'] }); assert.equal(v.needsHumanCheck, true);
});
test('règle confirmée par un humain (simulation) : « Non applicable » affiché, jamais « Conforme »', () => {
  const v = visa(run(tn(), verifiedReg()));
  assert.equal(v.reliability, 'verified'); assert.equal(v.status, S.NOT_APPLICABLE); assert.equal(v.downgraded, false); assert.ok(!/Résultat à confirmer/.test(v.message));
});
test('même règle confirmée mais devenue ancienne (> 180 jours) : de nouveau rétrogradée', () => {
  const r = evaluate(tn({ departureDate: '2027-09-01' }), { registry: verifiedReg(), today: parseDate('2027-08-01') });
  assert.equal(visa(r).reliability, 'outdated'); assert.equal(visa(r).status, S.TO_VERIFY);
});
test('motif non couvert (travail, études) : jamais présenté comme sans visa', () => {
  for (const purpose of ['work', 'study', 'medical']) {
    const v = visa(run(tn({ purpose }), verifiedReg())); assert.equal(v.status, S.TO_VERIFY, purpose); assert.match(v.message, /un visa peut être exigé/);
  }
  assert.equal(visa(run(tn({ purpose: 'business' }), verifiedReg())).status, S.NOT_APPLICABLE);
});
test('durée au-delà de 90 jours : prolongation ou visa à vérifier', () => {
  const v = visa(run(tn({ stayDays: 120 }), verifiedReg())); assert.equal(v.status, S.TO_VERIFY); assert.match(v.message, /au-delà des 90 jours/);
  assert.equal(visa(run(tn({ stayDays: 90 }), verifiedReg())).status, S.NOT_APPLICABLE);
});
test('autre nationalité vers le Brésil : repli sur la règle générique du socle (la règle tunisienne ne s’applique pas)', () => {
  for (const nat of ['FR', 'DZ', 'MA']) {
    const v = visa(run(tn({ nationality: nat }), verifiedReg())); assert.equal(v.title, 'Visa ou autorisation électronique d’entrée', nat);
    assert.equal(v.status, S.TO_VERIFY); assert.match(v.message, /ne décide jamais à votre place/);
  }
});
test('non-régression : les autres destinations gardent leur règle (ex. Schengen, États-Unis) et le socle', () => {
  const de = visa(run(tn({ destination: 'DE' }))), us = visa(run(tn({ destination: 'US' })));
  assert.match(de.title, /Schengen|ETIAS/); assert.match(us.title, /ESTA/);
  assert.equal(run(tn({ destination: 'JP' })).items.find((i) => i.id === 'entry-authorization').title, 'Visa ou autorisation électronique d’entrée');
});
test('passeport pour le Brésil : exigence de validité non encodée → À vérifier (rien d’inventé)', () => {
  const r = run(tn({}, { passport: { expiry: '2030-01-01', issueDate: '2024-01-01', blankPages: 5 } }));
  assert.equal(r.items.find((i) => i.id === 'passport').status, S.TO_VERIFY); assert.match(r.items.find((i) => i.id === 'passport').message, /n’est pas connue/);
});
test('Module 2, Tunisien → Brésil : renvois officiels brésiliens, tous non vérifiés, avec leurs sources', () => {
  const r = evaluateArrival(tn(), { registry, airportRegistry, today: TODAY }), all = r.phases.flatMap((p) => p.items), by = (id) => all.find((i) => i.stepId === id);
  assert.match(by('c-declare').source.url, /receitafederal/); assert.match(by('h-current').source.url, /anvisa/); assert.match(by('i-process').source.url, /\/pf\//);
  for (const id of ['c-declare', 'h-current', 'i-process']) { assert.equal(by(id).reliability, 'unverified', id); assert.match(by(id).notice, /non vérifiée/); assert.deepEqual(by(id).scope, { countries: ['BR'], airports: null }, id); }
  assert.match(by('c-declare').text, /Receita Federal/);
});
test('Module 2 réutilise le résultat visa du Module 1 sans le recalculer (source unique)', () => {
  const r = evaluateArrival(tn(), { registry, airportRegistry, today: TODAY }), d = r.briefing.documents.find((x) => x.id === 'entry-authorization');
  assert.equal(d.status, S.TO_VERIFY); assert.match(d.message, /accord d’exemption partielle de visas Brésil–Tunisie/);
  assert.ok(r.alerts.some((a) => a.type === 'reliability'));
});
test('aucune donnée du Brésil n’est livrée comme « vérifiée »', () => {
  for (const r of [...BR_PACK.rules, ...BR_PACK.arrival]) assert.equal(r.verification.status, 'unverified', r.id);
});
