// Tests du module de brouillon Host & Go (hostgo-draft.js). Sans DOM ni dépendance. Lancé par tests/run.mjs.
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const H = createRequire(import.meta.url)("../hostgo-draft.js");

let n = 0;
const t = (name, fn) => { fn(); n++; console.log("  ok   " + name); };
const mem = (opts = {}) => { const m = new Map(); return { m, getItem: (k) => { if (opts.failGet) throw new Error("x"); return m.has(k) ? m.get(k) : null; }, setItem: (k, v) => { if (opts.failSet) throw new Error("quota"); m.set(k, String(v)); }, removeItem: (k) => m.delete(k) }; };
const mk = (o = {}) => { const local = o.local || mem(), session = o.session || mem(), clock = { t: 1_700_000_000_000 }; return { local, session, clock, s: H.create({ local, session, now: () => clock.t, steps: 15 }) }; };
const full = () => ({ country: "Tunisie", decls: [true, true, true, true, true, true], types: [2, 0], hours: 1, days: 2, stay: 3, cal: { 2026: { 0: 1, 5: 3 } }, ta_st2: "Une ferme familiale avec oliveraie", ta_ac: "Chambre", langs: [[1, 2], [2, 1]], lxOn: false, lxNote: "ok", amen: [0], trav: [1], photos: 3, addr: "12 rue des Oliviers", zip: "9000", firstName: "Sami", email: "sami@example.com", city: "Béja", pv: "note privée" });

console.log("Brouillon Host & Go");

t("aller-retour : toutes les réponses sont restituées", () => {
  const { s } = mk(); const r = s.save({ step: 7, sid: "", data: full() });
  assert.ok(r.ok && r.privateOk && /^hg-[0-9a-f]{16}$/.test(r.sid));
  const l = s.load();
  assert.equal(l.step, 7); assert.equal(l.sid, r.sid); assert.equal(l.hasPrivate, true);
  assert.deepEqual(l.data, H.sanitize(full()));
  assert.deepEqual(l.data.types, [0, 2]);
});

t("protection : champs personnels uniquement en sessionStorage, jamais en localStorage", () => {
  const { s, local, session } = mk(); s.save({ step: 3, sid: "", data: full() });
  const L = local.m.get(H.KEY), S = session.m.get(H.KEY);
  for (const v of ["sami@example.com", "Sami", "Oliviers", "9000", "Béja", "note privée"]) { assert.ok(!L.includes(v), "localStorage contient " + v); assert.ok(S.includes(v), "sessionStorage devrait contenir " + v); }
  assert.ok(L.includes("Une ferme familiale avec oliveraie"));
});

t("protection : consentements (CGU, e-mails) et photos jamais mémorisés", () => {
  const { s, local } = mk(); s.save({ step: 14, sid: "", data: { ...full(), terms: true, marketing: true, hp: "bot", files: ["a.jpg"] } });
  const L = JSON.parse(local.m.get(H.KEY));
  for (const k of ["terms", "marketing", "hp", "files"]) assert.ok(!(k in L.data), k);
  assert.equal(L.data.photos, 3);
});

t("fermeture du navigateur : réponses gardées, coordonnées perdues", () => {
  const { s, local } = mk(); s.save({ step: 9, sid: "", data: full() });
  const s2 = H.create({ local, session: mem(), now: () => 1_700_000_000_000 + 1000, steps: 15 });
  const l = s2.load();
  assert.equal(l.step, 9); assert.equal(l.hasPrivate, false);
  assert.equal(l.data.ta_st2, "Une ferme familiale avec oliveraie"); assert.equal(l.data.email, undefined); assert.equal(l.data.addr, undefined);
});

t("session d'un autre brouillon ignorée et supprimée", () => {
  const { s, local, session } = mk(); s.save({ step: 2, sid: "", data: full() });
  session.m.set(H.KEY, JSON.stringify({ v: 1, ts: 1_700_000_000_000, sid: "hg-0000000000000000", data: { email: "autre@x.fr" } }));
  const l = s.load(); assert.equal(l.hasPrivate, false); assert.equal(l.data.email, undefined); assert.ok(!session.m.has(H.KEY));
});

t("expiration à 14 jours : brouillon effacé", () => {
  const { s, clock, local, session } = mk(); s.save({ step: 4, sid: "", data: full() });
  clock.t += H.TTL - 1000; assert.ok(s.load());
  clock.t += 2000; assert.equal(s.load(), null); assert.ok(!local.m.has(H.KEY) && !session.m.has(H.KEY));
});

t("horodatage futur ou version inconnue : rejeté", () => {
  const { s, clock, local } = mk(); s.save({ step: 4, sid: "", data: full() });
  const j = JSON.parse(local.m.get(H.KEY)); j.ts = clock.t + 3_600_000; local.m.set(H.KEY, JSON.stringify(j)); assert.equal(s.load(), null);
  s.save({ step: 4, sid: "", data: full() }); const k = JSON.parse(local.m.get(H.KEY)); k.v = 99; local.m.set(H.KEY, JSON.stringify(k)); assert.equal(s.load(), null);
});

t("données corrompues ou altérées : aucune exception, rien d'injecté", () => {
  const { s, local } = mk();
  for (const raw of ["{", "null", "[]", "42", '"x"', "{}"]) { local.m.set(H.KEY, raw); assert.equal(s.load(), null, raw); }
  const bad = { v: 1, ts: 1_700_000_000_000, sid: "hg-0123456789abcdef", step: "9", sent: ["zz", 5, "abcdef12"], data: { __proto__: { x: 1 }, constructor: "c", country: 5, types: "x", cal: { "1999": { 0: 1 }, "2026": { 13: 1, 2: 9, 3: 2 } }, langs: [[1], "a", [99, 99], [1, 2]], ta_st2: "<img src=x onerror=alert(1)>" + "a".repeat(5000), decls: [true, "yes"], evil: "<script>" } };
  local.m.set(H.KEY, JSON.stringify(bad)); const l = s.load();
  assert.equal(l.step, 0); assert.deepEqual(l.sent, ["", "", "abcdef12"]);
  assert.deepEqual(l.data.cal, { 2026: { 3: 2 } }); assert.deepEqual(l.data.langs, [[1, 2]]); assert.deepEqual(l.data.decls, [true, false]);
  assert.equal(l.data.ta_st2.length, 700); for (const k of ["evil", "country", "types", "constructor", "__proto__"]) assert.ok(!Object.hasOwn(l.data, k), k);
});

t("étape hors bornes ramenée dans 0-14", () => {
  const { s } = mk(); s.save({ step: 99, sid: "", data: full() }); assert.equal(s.load().step, 0);
  s.save({ step: 14, sid: "", data: full() }); assert.equal(s.load().step, 14);
});

t("stockage indisponible ou plein : pas d'exception, échec signalé", () => {
  const { s } = mk({ local: mem({ failSet: true }), session: mem({ failSet: true }) });
  const r = s.save({ step: 1, sid: "", data: full() }); assert.equal(r.ok, false); assert.equal(r.privateOk, false);
  const s2 = H.create({ local: undefined, session: undefined }); assert.equal(s2.save({ step: 1, data: full() }).ok, false); assert.equal(s2.load(), null);
  assert.equal(H.create({ local: mem({ failGet: true }), session: mem({ failGet: true }) }).load(), null);
});

t("clear : efface les deux stockages", () => {
  const { s, local, session } = mk(); s.save({ step: 1, sid: "", data: full() }); s.clear(); assert.ok(!local.m.has(H.KEY) && !session.m.has(H.KEY)); assert.equal(s.load(), null);
});

t("l'identifiant de demande reste stable entre les sauvegardes", () => {
  const { s } = mk(); const a = s.save({ step: 1, sid: "", data: full() }).sid; const b = s.save({ step: 2, sid: a, data: full() }).sid; assert.equal(a, b);
  assert.notEqual(H.newSid(), H.newSid());
});

t("pays et déclarations seuls : brouillon non significatif", () => {
  assert.equal(H.isMeaningful({ step: 0, data: { country: "Tunisie", decls: [true], photos: 0 } }), false);
  assert.equal(H.isMeaningful({ step: 1, data: {} }), true);
  assert.equal(H.isMeaningful({ step: 0, data: { ta_st2: "  " } }), false);
  assert.equal(H.isMeaningful({ step: 0, data: { types: [1] } }), true);
});

t("anti-doublon : les parties déjà acceptées ne sont pas renvoyées", () => {
  const texts = ["partie 1", "partie 2", "partie 3"];
  assert.deepEqual(H.planParts(texts, []), [0, 1, 2]);
  assert.deepEqual(H.planParts(texts, [H.hash("partie 1")]), [1, 2]);
  assert.deepEqual(H.planParts(texts, [H.hash("partie 1"), H.hash("partie 2"), H.hash("partie 3")]), []);
  assert.deepEqual(H.planParts(["partie 1 modifiée", "partie 2"], [H.hash("partie 1"), H.hash("partie 2")]), [0]);
  const { s } = mk(); s.save({ step: 14, sid: "", data: full(), sent: [H.hash("partie 1")] }); assert.deepEqual(s.load().sent, [H.hash("partie 1")]);
});

t("anti-doublon : mémoire d'envoi par empreinte d'e-mail (jamais l'adresse), 30 jours", () => {
  const { s, local, clock } = mk();
  assert.equal(s.wasSent("a@b.fr"), false); s.rememberSent(" A@B.fr ");
  assert.equal(s.wasSent("a@b.fr"), true); assert.equal(s.wasSent("autre@b.fr"), false);
  assert.ok(!local.m.get(H.SENT_KEY).toLowerCase().includes("a@b.fr"));
  clock.t += 31 * 24 * 3600 * 1000; assert.equal(s.wasSent("a@b.fr"), false);
});

t("rôle (hôte / voyageur) : empreinte d'e-mail, jamais l'adresse en clair", () => {
  const st = mem();
  assert.equal(H.getRole(st, "a@b.fr"), null);
  assert.ok(H.setRole(st, " A@B.fr ", "host"));
  assert.equal(H.getRole(st, "a@b.fr"), "host"); assert.equal(H.getRole(st, "autre@b.fr"), null);
  assert.ok(!st.m.get("hg_roles").toLowerCase().includes("a@b.fr"));
  assert.equal(H.setRole(st, "a@b.fr", "admin"), false);
});

t("rôle : anciennes entrées en clair migrées puis supprimées", () => {
  const st = mem(); st.m.set("hg_roles", JSON.stringify({ "old@x.fr": "traveler", "bad@x.fr": "root" }));
  assert.equal(H.getRole(st, "OLD@x.fr"), "traveler");
  assert.ok(!st.m.get("hg_roles").includes("old@x.fr")); assert.equal(H.getRole(st, "old@x.fr"), "traveler");
  assert.equal(H.getRole(st, "bad@x.fr"), null); assert.ok(!st.m.get("hg_roles").includes("bad@x.fr"));
  st.m.set("hg_roles", "{"); assert.equal(H.getRole(st, "a@b.fr"), null);
  assert.equal(H.getRole(mem({ failGet: true }), "a@b.fr"), null); assert.equal(H.setRole(mem({ failSet: true }), "a@b.fr", "host"), false);
});

console.log("\n" + n + " tests de brouillon réussis");
