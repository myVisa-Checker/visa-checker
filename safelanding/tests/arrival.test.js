import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateArrival, evaluate, sanitizeState, parseState, serializeState, emptyState, createAirportRegistry, buildAiPrompt, guardAiAnswer,
  arrivalToAiItems, ARRIVAL_PHASES, ARRIVAL_BASE_STEPS, ALL_PACKS, STATE_VERSION, AIRPORT_PACKS } from '../web/src/index.js';
import { mk, TODAY, opts, registry, airportRegistry, items, item, AIRPORT } from './helpers-m2.js';
const run = (s, o = opts) => evaluateArrival(s, o);
const withArr = (s, a) => { s.arrival = { airport: '', budget: '', checkedBags: null, ...a }; return s; };

// ---------- migration et conservation des données ----------
const V1 = () => ({ version: 1, profile: mk().profile, handled: { passport: true, ticket: true },
  documents: mk().documents, changeReports: [{ ruleId: 'passport', packId: 'x', note: 'note de test', createdAt: '2026-11-01T00:00:00.000Z' }] });
test('migration v1 → v2 : aucune donnée perdue, bloc arrivée créé vide', () => {
  const m = sanitizeState(V1());
  assert.equal(m.version, STATE_VERSION); assert.equal(STATE_VERSION, 2);
  assert.equal(m.profile.destination, 'ZZ'); assert.equal(m.documents.passport.expiry, '2028-01-01');
  assert.equal(m.documents.lodging.address, '1 rue Test'); assert.deepEqual(m.handled, { passport: true, ticket: true });
  assert.equal(m.changeReports[0].note, 'note de test'); assert.deepEqual(m.arrival, { airport: '', budget: '', checkedBags: null });
});
test('non-régression Module 1 : même checklist avant et après migration', () => {
  const before = evaluate({ ...V1(), arrival: undefined }, { registry, today: TODAY }), after = evaluate(sanitizeState(V1()), { registry, today: TODAY });
  assert.deepEqual(after.items.map((i) => [i.id, i.status]), before.items.map((i) => [i.id, i.status]));
  assert.deepEqual(after.progress, before.progress);
});
test('migration idempotente et ré-ouverture : sérialiser/relire v2 ne change rien', () => {
  const once = sanitizeState(V1()), twice = parseState(serializeState(once));
  assert.deepEqual(twice, once);
});
test('version future : lecture au mieux, champs inconnus ignorés, jamais de remise à zéro', () => {
  const f = sanitizeState({ ...V1(), version: 7, secret: 'x', arrival: { airport: 'cdg', budget: 'high', checkedBags: false, extra: 1 } });
  assert.equal(f.version, 2); assert.equal(f.profile.destination, 'ZZ'); assert.equal(f.arrival.airport, 'CDG');
  assert.ok(!JSON.stringify(f).includes('secret'));
});
test('versions invalides ou entrées corrompues : état vide sans exception', () => {
  for (const bad of [null, undefined, 5, 'x', [], { version: 'a' }, { version: 0 }, { version: -1 }, { version: 1.5 }]) assert.deepEqual(sanitizeState(bad), emptyState());
  assert.deepEqual(parseState('{pas du json'), emptyState());
});
test('arrivée : liste blanche (IATA, budget, bagage) et jamais de champ inconnu', () => {
  const a = (x) => sanitizeState({ ...V1(), version: 2, arrival: x }).arrival;
  assert.deepEqual(a({ airport: 'cdg ' }), { airport: 'CDG', budget: '', checkedBags: null });
  assert.equal(a({ airport: 'PARIS' }).airport, ''); assert.equal(a({ airport: '1AB' }).airport, '');
  assert.equal(a({ budget: 'luxe' }).budget, ''); assert.equal(a({ checkedBags: 'yes' }).checkedBags, null);
  assert.equal(a({ checkedBags: false }).checkedBags, false); assert.equal(a('x').airport, '');
});

// ---------- personnalisation sans ressaisie ----------
test('les réponses de préparation reprennent le profil et les documents du Module 1', () => {
  const r = run(mk({ purpose: 'business', stayDays: 7 }, { lodging: { address: '12 avenue Test', hostContact: '' }, funds: { amount: 800, currency: 'EUR' } }));
  const q = r.briefing.questions.map((x) => x.answer);
  assert.equal(q[0], 'Affaires'); assert.match(q[1], /7 jour\(s\), jusqu’au 2026-12-17/); assert.equal(q[2], '12 avenue Test');
  assert.equal(q[3], 'Retour le 2026-12-20'); assert.equal(q[4], '800 EUR'); assert.ok(r.briefing.questions.every((x) => !x.missing));
});
test('information absente : signalée « à renseigner », jamais inventée', () => {
  const r = run(mk({}, { lodging: {}, ticket: {}, funds: { amount: null } }));
  const [, , lodge, ticket, funds] = r.briefing.questions;
  assert.equal(lodge.answer, 'Hôtel'); assert.equal(ticket.missing, true); assert.equal(funds.missing, true); assert.equal(ticket.answer, '[à renseigner]');
});
test('profil Module 1 invalide : Module 2 refuse avec les mêmes erreurs', () => {
  const s = mk({ destination: '' }), r = run(s);
  assert.equal(r.valid, false); assert.deepEqual(r.errors, evaluate(s, { registry, today: TODAY }).errors);
});
test('cohérence : les statuts de documents sont ceux du Module 1 (source unique)', () => {
  const s = mk({ transit: ['AE'] }), r = run(s), m1 = evaluate(s, { registry, today: TODAY });
  for (const d of r.briefing.documents) assert.equal(d.status, m1.items.find((i) => i.id === d.id).status, d.id);
  assert.ok(r.briefing.documents.some((d) => d.id === 'transit:AE'), 'correspondance reprise du Module 1');
});
test('alertes du Module 1 propagées (origine module1)', () => {
  const r = run(mk({}, { passport: { expiry: '2026-01-01' } }));
  assert.ok(r.alerts.some((a) => a.origin === 'module1' && a.severity === 'high'));
});
test('changement de dates : la fin de séjour suit le profil', () => {
  assert.match(run(mk({ stayDays: 20 })).briefing.questions[1].answer, /2026-12-30/);
});

// ---------- couverture du parcours ----------
test('neuf phases du parcours présentes pour un profil standard', () => {
  const r = run(withArr(mk(), { checkedBags: true }));
  assert.deepEqual(r.phases.map((p) => p.id), ARRIVAL_PHASES.map((p) => p.id));
  assert.ok(r.phases.every((p) => p.items.length));
});
test('bagages : étapes selon la présence d’un bagage en soute', () => {
  const ids = (a) => items(run(withArr(mk(), a))).filter((i) => i.phase === 'baggage').map((i) => i.stepId);
  assert.deepEqual(ids({ checkedBags: true }), ['b-claim', 'b-problem']); assert.deepEqual(ids({ checkedBags: null }), ['b-claim', 'b-problem']);
  assert.deepEqual(ids({ checkedBags: false }), ['b-nobag']);
});
test('hébergement : hôte particulier vs hôtel', () => {
  const priv = run(mk({ accommodation: 'private' }, { lodging: { address: 'x', hostContact: 'tel 123' } })), hotel = run(mk({ accommodation: 'hotel' }));
  assert.ok(item(priv, 'e-host') && item(priv, 'transfer-host')); assert.match(item(priv, 'e-host').text, /tel 123/);
  assert.equal(item(hotel, 'e-host'), undefined); assert.ok(item(hotel, 'transfer-hotel')); assert.equal(item(hotel, 'transfer-host'), undefined);
});
test('mineur : étape dédiée seulement pour un mineur', () => {
  assert.ok(item(run(mk({ birthDate: '2015-05-05' })), 'i-minor')); assert.equal(item(run(mk({ birthDate: '1990-05-05' })), 'i-minor'), undefined);
});
test('budget : options adaptées classées en premier, sinon neutres', () => {
  const t = (b) => run(withArr(mk({ accommodation: 'other' }), { budget: b })).phases.find((p) => p.id === 'transfer').items.filter((i) => i.option);
  const low = t('low'); assert.equal(low[0].fit, true); assert.ok(low.find((i) => i.stepId === 'transfer-taxi').fit === false);
  assert.ok(t('high').find((i) => i.stepId === 'transfer-taxi').fit === true);
  assert.ok(t('').every((i) => i.fit === null));
});
test('modèles de texte : valeurs manquantes jamais « undefined »', () => {
  const r = run(mk({}, { lodging: {} })), all = items(r).map((i) => i.text).join(' ');
  assert.ok(!/undefined|null|\{\w+\}/.test(all)); assert.match(item(r, 't-scam').text, /\[à renseigner\]/);
  assert.match(item(run(mk({}, { lodging: { address: '5 rue A' } })), 't-scam').text, /5 rue A/);
});

// ---------- officiel vs pratique, fiabilité, sources ----------
test('séparation : tout élément est officiel (avec fiabilité) ou pratique (sans source)', () => {
  for (const i of items(run(mk({ destination: 'DE' })))) {
    if (i.kind === 'official') assert.ok(['verified', 'outdated', 'unverified'].includes(i.reliability), i.id);
    else { assert.equal(i.reliability, 'practical', i.id); assert.equal(i.source, null, i.id); }
  }
});
test('données livrées : tout élément officiel non vérifié signale son statut', () => {
  const r = run(mk({ destination: 'DE' }));
  for (const i of items(r).filter((x) => x.kind === 'official')) { assert.equal(i.reliability, 'unverified', i.id); assert.match(i.notice, /non vérifiée/); }
  assert.ok(r.alerts.some((a) => a.type === 'reliability' && /non vérifiée/.test(a.message)));
});
test('pack pays : renvoi douane Schengen avec source ; sans pack, renvoi générique sans source', () => {
  const de = item(run(mk({ destination: 'DE' })), 'c-declare'), jp = item(run(mk({ destination: 'JP' })), 'c-declare');
  assert.match(de.source.url, /^https:\/\/taxation-customs\.ec\.europa\.eu/); assert.ok(de.scope.countries.includes('DE')); assert.equal(jp.source.url, null);
});
test('règle vérifiée récente : texte, source, date et champ d’application exposés', () => {
  const c = item(run(mk()), 'c-declare');
  assert.equal(c.reliability, 'verified'); assert.equal(c.notice, null); assert.match(c.text, /1000 unités/);
  assert.equal(c.lastVerified, '2026-10-01'); assert.equal(c.source.url, 'https://example.org/arrivee'); assert.deepEqual(c.scope, { countries: ['ZZ'], airports: null });
});
test('exigence sanitaire ancienne : jamais présentée comme règle actuelle', () => {
  const h = item(run(mk()), 'h-current');
  assert.equal(h.reliability, 'outdated'); assert.doesNotMatch(h.text, /Certificat de test/); assert.match(h.text, /ne la considérez pas comme une exigence actuelle/);
  const later = item(run(mk({ departureDate: '2027-06-10' }), { ...opts, today: new Date(Date.UTC(2027, 5, 1)) }), 'c-declare');
  assert.equal(later.reliability, 'outdated'); assert.doesNotMatch(later.text, /1000 unités/);
});

// ---------- aéroports ----------
test('aéroport connu : étape et transfert spécifiques, surcharge par id', () => {
  const r = run(withArr(mk(), { airport: 'ZZA', budget: 'low' }));
  assert.equal(item(r, 'a-orient').text, 'Suivre la ligne bleue du terminal 2.'); assert.ok(item(r, 'transfer-tram').fit);
  assert.equal(r.airport.known, true); assert.equal(r.airport.name, 'Aéroport de test');
  assert.match(item(run(mk()), 'a-orient').text, /panneaux/); // sans aéroport : texte générique du socle
});
test('aéroport inconnu : conseils généraux et signalement, sans erreur', () => {
  const r = run(withArr(mk(), { airport: 'XYZ' }));
  assert.equal(r.valid, true); assert.equal(r.airport.known, false); assert.ok(r.alerts.some((a) => /Aucune donnée disponible pour l’aéroport XYZ/.test(a.message)));
});
test('incohérence aéroport / destination du profil détectée', () => {
  assert.ok(run(withArr(mk({ destination: 'DE' }), { airport: 'ZZA' })).alerts.some((a) => a.type === 'inconsistency' && /ZZA/.test(a.message)));
  assert.ok(!run(withArr(mk(), { airport: 'ZZA' })).alerts.some((a) => a.type === 'inconsistency'));
});
test('registre d’aéroports : contrat validé, livré vide (aucune donnée non vérifiée)', () => {
  assert.throws(() => createAirportRegistry([{ iata: 'AB', name: 'x', country: 'ZZ' }]), /invalide/);
  assert.throws(() => createAirportRegistry([AIRPORT, AIRPORT]), /deux fois/);
  assert.throws(() => createAirportRegistry([{ iata: 'ABC', country: 'ZZ' }]), /invalide/);
  assert.deepEqual(AIRPORT_PACKS, []);
});

// ---------- progression et état partagé ----------
test('progression : étapes « faites » comptées, incidents exclus, options hors budget exclues', () => {
  const s = withArr(mk({ accommodation: 'other' }), { budget: 'low', checkedBags: true }), base = run(s);
  assert.equal(items(base).filter((i) => i.phase === 'incidents').length > 0, true);
  assert.equal(base.progress.total, items(base).filter((i) => i.phase !== 'incidents' && !(i.option && i.fit === false)).length);
  s.handled = { 'arrival:a-orient': true, 'arrival:x-docs': true }; const r = run(s);
  assert.equal(r.progress.done, 1); assert.equal(item(r, 'x-docs').handled, true);
});
test('état partagé : cocher une étape d’arrivée ne modifie pas la progression du Module 1', () => {
  const s = mk(), before = evaluate(s, { registry, today: TODAY }).progress;
  s.handled = { 'arrival:a-orient': true, 'arrival:d-ready': true };
  assert.deepEqual(evaluate(s, { registry, today: TODAY }).progress, before);
  assert.deepEqual(parseState(serializeState({ ...s, version: 2 })).handled, s.handled);
});

// ---------- IA : mêmes garde-fous que le Module 1 ----------
test('IA : éléments d’arrivée soumis au même prompt et au même garde-fou', () => {
  const r = run(mk({ destination: 'DE' })), ai = arrivalToAiItems(r);
  assert.ok(ai.length > 10); assert.match(buildAiPrompt(mk().profile, ai), /N’invente AUCUNE règle/);
  assert.equal(guardAiAnswer('Voir https://inconnu.example/x', ai).ok, false);
  assert.equal(guardAiAnswer('Consultez https://taxation-customs.ec.europa.eu/ pour la douane.', ai).ok, true);
  assert.equal(guardAiAnswer('La déclaration est obligatoire.', ai).ok, false);
});

// ---------- données livrées ----------
test('socle livré : ids uniques, phases valides, officiel = vérification non validée', () => {
  const ids = ARRIVAL_BASE_STEPS.map((s) => s.id); assert.equal(new Set(ids).size, ids.length);
  const phases = new Set(ARRIVAL_PHASES.map((p) => p.id));
  for (const s of [...ARRIVAL_BASE_STEPS, ...ALL_PACKS.flatMap((p) => p.arrival || [])]) {
    assert.ok(phases.has(s.phase), s.id); assert.ok(['official', 'practical'].includes(s.kind), s.id);
    if (s.kind === 'official') { assert.equal(s.verification.status, 'unverified', s.id); assert.equal(s.verification.lastVerified, null); }
    else assert.equal(s.verification, undefined, s.id);
  }
});
