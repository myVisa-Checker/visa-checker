/* Données et fiches : toute information porte une source officielle datée, sinon « Non confirmé ». */
"use strict";
const assert = require("assert"), path = require("path");
const cat = require("../data/occupations.json"), co = require("../data/companies.json");
const I18N = require("../i18n.js"), F = require("../fiche.js");
const DATE = /^\d{4}-\d{2}-\d{2}$/, LANGS = ["fr", "en", "ar"];

for (const [id, s] of Object.entries(cat.sources)) {
  assert.ok(/^https:\/\//.test(s.url), "source https : " + id);
  assert.ok(DATE.test(s.checked) && s.title, "source datée et titrée : " + id);
}
const trilingual = (o, where) => { for (const l of LANGS) assert.ok(typeof o[l] === "string" && o[l].trim(), where + " manque " + l); };
for (const [k, g] of Object.entries(cat.general)) { trilingual(g.text, "general." + k); assert.ok(cat.sources[g.source], "general." + k + " : source inconnue"); }

for (const o of cat.occupations) {
  const f = o.fiche; assert.ok(f, o.id + " : fiche absente");
  assert.ok(cat.sources[f.source], o.id + " : source principale inconnue");
  trilingual(f.summary, o.id + ".summary");
  if (f.tasks) { const n = f.tasks.fr.length; assert.ok(n > 0); for (const l of LANGS) assert.equal(f.tasks[l].length, n, o.id + " : tâches " + l); }
  if (f.pay) for (const p of f.pay) {
    assert.ok(cat.sources[p.source], o.id + " : source de rémunération inconnue");
    assert.ok(p.years.every((v, i) => Number.isInteger(v) && v >= 500 && v <= 2500 && (!i || v >= p.years[i - 1])), o.id + " : rémunérations incohérentes");
  }
  assert.equal(o.language_guidance.level, null, o.id + " : niveau d'allemand non sourcé");
  for (const l of LANGS) {
    const html = F.render({o, data: cat, companies: co, I: I18N.make(l), chosen: new Set()});
    assert.ok(!/undefined|\[object|NaN/.test(html), o.id + "/" + l + " : valeur non rendue");
    assert.ok(html.includes('class="nc"'), o.id + "/" + l + " : « Non confirmé » attendu");
    assert.ok(html.includes(cat.sources[f.source].url.replace(/&/g, "&amp;")), o.id + "/" + l + " : lien source absent");
    if (!f.pay) assert.ok(!/\d ?\d{3}&nbsp;€/.test(html), o.id + " : montant sans source");
  }
}
assert.equal(I18N.dict.ar["nc"], "غير مؤكد");

assert.ok(DATE.test(co.verified_on));
const ids = new Set(cat.occupations.map((o) => o.id));
for (const c of co.companies) {
  assert.ok(c.name && /^https:\/\//.test(c.recruitment_url), c.id + " : lien de recrutement https requis");
  if (c.direct_url) assert.ok(/^https:\/\//.test(c.direct_url));
  assert.ok(c.occupations.length && c.occupations.every((x) => ids.has(x)), c.id + " : métier inconnu");
  assert.ok(["open", "closed", "unverified"].includes(c.offer_status));
  if (c.offer_status === "unverified") assert.equal(c.intake_year, null, c.id + " : rentrée sans vérification");
  assert.equal(c.international, "unconfirmed", c.id + " : candidature internationale non confirmée");
  trilingual(c.note, c.id + ".note");
}
// P2 données : traçabilité des rémunérations, alignement des mentions, distinction entreprise référencée / offre confirmée.
{
  const fs = require("node:fs"), path = require("node:path");
  for (const o of cat.occupations) if (o.fiche.pay) for (const p of o.fiche.pay) assert.ok(p.row && p.source === "bibb_pay_2025", o.id + " : ligne source BIBB obligatoire pour la rémunération");
  const v = cat.occupations.find((o) => o.id === "verkaeufer");
  for (const l of ["fr", "en", "ar"]) assert.doesNotMatch(v.fiche.summary[l], /poursuiv|continue|continu|الاستمرار|متابعة/i, "Verkäufer : aucune nuance non sourcée (" + l + ")");
  assert.equal(cat.catalogue_status, "verified_for_publication", "statut du catalogue aligné sur la vérification des sources");
  const I18Nf = require("../i18n.js");
  for (const l of ["fr", "en", "ar"]) assert.doesNotMatch(I18Nf.make(l).t("legal"), /données de travail|working data|بيانات عمل/, "mention « données de travail » obsolète (" + l + ")");
  assert.doesNotMatch(fs.readFileSync(path.join(__dirname, "../index.html"), "utf8"), /données de travail/, "index.html aligné");
  for (const c of co.companies.filter((x) => x.offer_status !== "open")) {
    const html = F.render({o: cat.occupations.find((o) => o.id === c.occupations[0]), data: cat, companies: co, I: I18N.make("fr"), chosen: new Set()});
    assert.match(html, /Entreprise référencée/, c.id + " : affichée comme entreprise référencée");
    assert.doesNotMatch(html, /Offre : confirmée/, c.id + " : jamais « offre confirmée » sans vérification");
  }
}
console.log("Ausbildung données et fiches : toutes les vérifications sont passées.");
