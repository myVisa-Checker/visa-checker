/* Couverture des traductions du module Ausbildung (FR / EN / AR). Sans dépendance externe. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const i18n = require("../i18n.js");
const matcher = require("../career-matcher.js");
const root = path.join(__dirname, "..");
const read = (f) => fs.readFileSync(path.join(root, f), "utf8");
const catalogue = JSON.parse(read("data/occupations.json"));
const { fr, en, ar } = i18n.dict;

// 1. Mêmes clés dans les trois langues, aucune valeur vide.
const keys = Object.keys(fr).sort();
assert.deepEqual(Object.keys(en).sort(), keys, "EN : mêmes clés que FR");
assert.deepEqual(Object.keys(ar).sort(), keys, "AR : mêmes clés que FR");
for (const [l, d] of [["fr", fr], ["en", en], ["ar", ar]]) for (const k of keys) assert.ok(String(d[k]).trim(), `${l}.${k} vide`);

// 2. Les variables {x} sont identiques d'une langue à l'autre.
const vars = (s) => (s.match(/\{\w+\}/g) || []).sort().join(",");
for (const k of keys) { assert.equal(vars(en[k]), vars(fr[k]), "variables EN " + k); assert.equal(vars(ar[k]), vars(fr[k]), "variables AR " + k); }

// 3. Le texte arabe contient de l'arabe, le texte anglais n'est pas une copie du français (hors termes identiques).
const same = new Set(["crumb.sep", "trust.time"]);
for (const k of keys) {
  if (same.has(k)) continue;
  if (/^(o\.german\.A|o\.german\.B|o\.german\.C)/.test(k)) continue;
  assert.match(ar[k], /[؀-ۿ]/, "AR sans caractère arabe : " + k);
}
for (const k of keys) if (!same.has(k) && fr[k].length > 25) assert.notEqual(en[k], fr[k], "EN identique au FR : " + k);

// 4. Chaque réponse du questionnaire, compétence, domaine, raison et note du moteur a son texte.
const app = read("app.js");
const arr = (name) => JSON.parse(app.match(new RegExp(name + " = (\\[[^\\]]*\\])"))[1]);
const stepRe = /\{id:"(\w+)",values:(\[[^\]]*\])/g; let m, nSteps = 0;
while ((m = stepRe.exec(app))) { nSteps++; for (const v of JSON.parse(m[2])) for (const d of [fr, en, ar]) assert.ok(d[`o.${m[1]}.${v}`], `réponse manquante ${m[1]}.${v}`); for (const d of [fr, en, ar]) { assert.ok(d[`q.${m[1]}.title`]); assert.ok(d[`q.${m[1]}.hint`]); } }
assert.equal(nSteps, 6, "6 étapes");
for (const v of arr("skillValues")) for (const d of [fr, en, ar]) assert.ok(d["skill." + v], "compétence " + v);
for (const v of arr("domainValues")) for (const d of [fr, en, ar]) assert.ok(d["dom." + v], "domaine " + v);
for (const k of ["skills", "interests", "environments", "experience"]) assert.ok(fr["reason." + k], "raison " + k);
for (const c of ["middle_school", "secondary_no_bac", "baccalaureat", "vocational", "bac2", "licence", "master"]) assert.ok(fr["edu." + c] && ar["edu." + c]);
for (const c of ["soon", "3_6", "6_12", "later", "exploring"]) assert.ok(fr["avail." + c] && ar["avail." + c]);
for (const c of ["unknown", "below_b1", "b1_plus"]) assert.ok(fr["ready.german." + c] && ar["ready.german." + c]);

// 5. Les codes du moteur couvrent toutes les notes ; le texte français du dictionnaire reste aligné sur celui du moteur.
const rd = (p) => matcher.readiness(p);
const rc = (p) => matcher.readinessCodes(p);
assert.equal(rc({german_level: "A1"}).german, "below_b1");
assert.equal(rc({german_level: "B2"}).german, "b1_plus");
assert.equal(rc({}).german, "unknown");
assert.equal(rc({education: "licence", availability: "3_6", mobility: "yes"}).education, "licence");
assert.equal(rc({mobility: "no"}).mobility, "no");
assert.equal(rc({mobility: "consider"}).mobility, "other");
assert.equal(rd({german_level: "A1"}).german_note_fr, fr["ready.german.below_b1"], "note allemand alignée");
assert.equal(rd({german_level: "B2"}).german_note_fr, fr["ready.german.b1_plus"], "note allemand B1+ alignée");
assert.equal(rd({}).german_note_fr, fr["ready.german.unknown"], "note allemand inconnu alignée");
assert.equal(rd({education: "licence"}).school_note_fr, i18n.make("fr").t("ready.school.with", {edu: fr["edu.licence"]}), "note scolaire alignée");
assert.equal(rd({}).school_note_fr, fr["ready.school.without"]);
assert.equal(rd({availability: "3_6"}).project_note_fr, i18n.make("fr").t("ready.project.with", {when: fr["avail.3_6"]}), "note calendrier alignée");
assert.equal(rd({}).project_note_fr, fr["ready.project.without"]);
assert.equal(rd({mobility: "yes"}).mobility_note_fr, fr["ready.mobility.yes"]);
assert.equal(rd({mobility: "no"}).mobility_note_fr, fr["ready.mobility.no"]);
assert.equal(rd({}).mobility_note_fr, fr["ready.mobility.other"]);
assert.equal(rd({}).visa_note_fr, fr["ready.visa"]);
const res = matcher.match({skills: ["logic"], interests: ["technology"], environments: ["office"], experience: [], german_level: "A2"}, catalogue, 3);
assert.deepEqual(res.readiness_codes, rc({german_level: "A2"}), "match() expose les codes des notes");
assert.doesNotMatch(JSON.stringify(res.readiness), /below_b1|b1_plus|"codes"/, "readiness() ne contient aucun code interne");
assert.equal(res.disclaimer_fr, fr["disclaimer"], "avertissement aligné");
const reasonSrc = read("career-matcher.js");
for (const [k, v] of Object.entries({skills: fr["reason.skills"], interests: fr["reason.interests"], environments: fr["reason.environments"], experience: fr["reason.experience"]})) assert.ok(reasonSrc.includes(v), "raison alignée " + k);

// 6. Catalogue : titres EN et AR pour chaque métier.
for (const o of catalogue.occupations) { assert.ok(o.title_en && o.title_en.length >= 3, "title_en " + o.id); assert.match(o.title_ar, /[؀-ۿ]/, "title_ar " + o.id); }

// 7. HTML : chaque élément data-t existe dans le dictionnaire et son texte français est celui du dictionnaire.
const html = read("index.html");
const norm = (s) => s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
let nStatic = 0;
for (const mt of html.matchAll(/<(\w+)[^>]*\bdata-t="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/g)) { nStatic++; assert.ok(fr[mt[2]], "clé data-t inconnue " + mt[2]); assert.equal(norm(mt[3]), fr[mt[2]], "texte HTML ≠ dictionnaire : " + mt[2]); }
for (const mt of html.matchAll(/data-ta="([^"]+)"/g)) for (const pair of mt[1].split(";")) { const k = pair.split("=")[1]; assert.ok(fr[k], "clé data-ta inconnue " + k); }
assert.ok(nStatic >= 20, "textes statiques marqués : " + nStatic);
assert.ok(!/<main[^>]*\b(?:lang|dir)=/.test(html), "main ne force ni lang ni dir (le site les gère)");
assert.equal(fr["meta.title"], (html.match(/<title>([^<]+)<\/title>/) || [])[1].replace(/&amp;/g, "&"), "titre de la page aligné");
assert.equal(fr["meta.desc"], (html.match(/<meta name="description" content="([^"]+)"/) || [])[1], "description alignée");
assert.equal(fr["meta.ogdesc"], (html.match(/<meta property="og:description" content="([^"]+)"/) || [])[1], "description og alignée");

// 8. Durées accordées dans chaque langue.
const d = (n) => ["fr", "en", "ar"].map((l) => i18n.make(l).duration(n));
assert.deepEqual(d(24), ["2 ans", "2 years", "سنتان"]);
assert.deepEqual(d(36), ["3 ans", "3 years", "3 سنوات"]);
assert.deepEqual(d(42), ["3 ans et 6 mois", "3 years and 6 months", "3 سنوات وأشهر".replace("أشهر", "6 أشهر")]);
assert.deepEqual(d(12), ["1 an", "1 year", "سنة"]);
assert.deepEqual(d(6), ["6 mois", "6 months", "6 أشهر"]);
assert.equal(i18n.make("zz").lang, "fr", "langue inconnue → français");
assert.equal(i18n.make("ar").dir, "rtl");
assert.equal(i18n.make("en").t("step.n", {n: 2, total: 6}), "Step 2 of 6");
assert.equal(i18n.make("en").t("inexistante"), "inexistante", "clé absente : la clé elle-même, jamais d'exception");

console.log("Ausbildung i18n : toutes les vérifications sont passées.");
