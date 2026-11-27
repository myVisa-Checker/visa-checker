/* Parcours Ausbildung dans un vrai navigateur (Playwright) : FR, EN, AR à 390 px.
   Usage : python3 -m http.server 8770 (à la racine du dépôt) puis node ausbildung/tests/flow.e2e.cjs [url] */
"use strict";
const assert = require("assert"), {chromium} = require("playwright");
const BASE = process.argv[2] || "http://localhost:8770";
const EXPECT = {
  fr: {visa: /visa est en cours/, no: /ne souhaitez pas/},
  en: {visa: /visa is being processed/, no: /do not wish to move/},
  ar: {visa: /تأشيرتك قيد المعالجة/, no: /لا ترغب في الانتقال/}
};
(async () => {
  const browser = await chromium.launch();
  for (const lang of ["fr", "en", "ar"]) {
    const ctx = await browser.newContext({viewport: {width: 390, height: 800}}), p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(`${BASE}/ausbildung/?lang=${lang}`); await p.waitForSelector(".pick-card");
    assert.equal(await p.evaluate(() => document.getElementById("aus").dir), lang === "ar" ? "rtl" : "ltr");
    await p.click('.pick-card[data-id="koch"]'); await p.click("#pickNext"); await p.waitForSelector("#answers input");
    await p.check('input[name=education][value=baccalaureat]'); await p.click("#next");

    // 1. Expérience : cases à cocher, plusieurs réponses simultanées, « aucune » exclusive
    const boxes = p.locator('#answers input[name=experience]');
    assert.equal(await boxes.count(), 5, lang + " : 5 choix d'expérience (dont formation complémentaire)");
    assert.equal(await boxes.evaluateAll((a) => a.every((x) => x.type === "checkbox")), true, lang + " : cases à cocher");
    assert.ok(await p.locator('input[name=experience][value=training]').count(), lang + " : formation complémentaire");
    for (const v of ["professional", "internship", "personal_projects", "training"]) await p.check(`input[name=experience][value=${v}]`);
    assert.equal(await p.locator('input[name=experience]:checked').count(), 4, lang + " : 4 réponses simultanées");
    await p.check('input[name=experience][value=none]');
    assert.equal(await p.locator('input[name=experience]:checked').count(), 1, lang + " : « aucune » décoche les autres");
    await p.check('input[name=experience][value=internship]');
    assert.equal(await p.locator('input[name=experience][value=none]').isChecked(), false, lang + " : cocher un choix décoche « aucune »");
    await p.check('input[name=experience][value=training]');
    await p.check('#skillArea input >> nth=0');
    await p.click("#next"); await p.check("input[name=german][value=A2]");

    // Navigation : retour, début, sélection des métiers — sans perte
    await p.click("#back");
    assert.deepEqual(await p.locator('input[name=experience]:checked').evaluateAll((a) => a.map((x) => x.value).sort()), ["internship", "training"], lang + " : expérience conservée après Retour");
    assert.equal(await p.locator('#skillArea input:checked').count(), 1, lang + " : compétence conservée");
    await p.click("#next"); assert.equal(await p.locator("input[name=german]:checked").getAttribute("value"), "A2", lang + " : allemand conservé");
    await p.click("#next"); await p.check("input[name=interests] >> nth=0"); await p.click("#next");
    await p.check("input[name=environment] >> nth=0"); await p.click("#next"); await p.check("input[name=project][value=soon]");
    await p.click("#toStart");
    assert.equal(await p.locator('input[name=education]:checked').getAttribute("value"), "baccalaureat", lang + " : début du questionnaire, diplôme conservé");
    assert.equal(await p.locator("#toStart").isDisabled(), true, lang + " : « début » inactif à l'étape 1");
    await p.click("#toPick"); assert.equal(await p.locator("#pick").isVisible(), true, lang + " : retour à la sélection");
    assert.equal(await p.locator('.pick-card[data-id="koch"]').getAttribute("aria-pressed"), "true", lang + " : métier choisi conservé");
    await p.click("#pickNext"); await p.click("#next");
    assert.deepEqual(await p.locator('input[name=experience]:checked').evaluateAll((a) => a.map((x) => x.value).sort()), ["internship", "training"], lang + " : expérience conservée après aller-retour");
    for (let i = 0; i < 4; i++) await p.click("#next");
    assert.equal(await p.locator("input[name=project]:checked").getAttribute("value"), "soon", lang + " : projet conservé");

    // 2. Mobilité : 5 réponses ; visa en cours ≠ refus
    assert.deepEqual(await p.locator("input[name=mobility]").evaluateAll((a) => a.map((x) => x.value)), ["yes", "no", "consider", "visa_pending", "other"]);
    await p.check("input[name=mobility][value=visa_pending]");
    await p.click("#back"); await p.click("#next");
    assert.equal(await p.locator("input[name=project]:checked").getAttribute("value"), "soon");
    assert.equal(await p.locator("input[name=mobility]:checked").getAttribute("value"), "visa_pending", lang + " : mobilité conservée");
    await p.click("#next"); await p.waitForSelector("#readiness p");
    const ready = await p.locator("#readiness").innerText();
    assert.match(ready, EXPECT[lang].visa, lang + " : message visa en cours");
    assert.doesNotMatch(ready, EXPECT[lang].no, lang + " : visa en cours non lu comme un refus");

    // Confidentialité : aucun stockage navigateur ; mobile : pas de défilement horizontal
    assert.deepEqual(await p.evaluate(() => [localStorage.length, sessionStorage.length]), [0, 0], lang + " : aucun stockage navigateur");
    assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, lang + " : pas de défilement horizontal");
    assert.deepEqual(errs, [], lang + " : aucune erreur JS");
    await ctx.close();
  }
  await browser.close(); console.log("Ausbildung parcours (Playwright FR/EN/AR, 390 px) : toutes les vérifications sont passées.");
})().catch((e) => { console.error(e.message); process.exit(1); });
