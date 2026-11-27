/* Page d'accueil Ausbildung : vignettes, 4 langues, liens, mise en page 390/1280 px. Usage : node ausbildung/tests/hub.e2e.cjs [url] */
"use strict";
const assert = require("assert"), {chromium} = require("playwright");
const BASE = process.argv[2] || "http://localhost:8770";
const EXPECT = {de: ["Ich bin Bewerber/in", "Ich bin ein Unternehmen", "Was ist eine Ausbildung?"], en: ["I am a candidate", "I am a company", "What is Ausbildung?"], fr: ["Je suis candidat", "Je suis entreprise", "Qu'est-ce que l'Ausbildung ?"], ar: ["أنا مترشّح", "أنا شركة", "ما هو الأوسبيلدونغ؟"]};
(async () => {
  const browser = await chromium.launch();
  for (const [w, h] of [[390, 844], [1280, 900]]) {
    for (const lang of ["de", "en", "fr", "ar"]) {
      const ctx = await browser.newContext({viewport: {width: w, height: h}}), p = await ctx.newPage();
      const errs = []; p.on("pageerror", (e) => errs.push(e.message)); p.on("console", (m) => { if (m.type() === "error") errs.push(m.text()); });
      await p.goto(`${BASE}/ausbildung-allemagne.html?lang=${lang}`); await p.waitForSelector(".tile");
      const tag = `${lang}@${w}`;
      const labels = await p.$$eval(".tile .lbl", (e) => e.map((x) => x.textContent.trim()));
      assert.deepEqual(labels, [EXPECT[lang][0], EXPECT[lang][1]], tag + " : libellés des vignettes");
      assert.equal(await p.textContent("#hub h2"), EXPECT[lang][2], tag + " : titre de présentation");
      assert.equal(await p.getAttribute("#hub", "dir"), lang === "ar" ? "rtl" : "ltr", tag + " : sens de lecture");
      assert.equal(await p.getAttribute("#hub", "lang"), lang);
      const colors = await p.$$eval(".tile .lbl", (e) => e.map((x) => getComputedStyle(x).color));
      assert.deepEqual(colors, ["rgb(249, 115, 22)", "rgb(249, 115, 22)"], tag + " : texte des vignettes en orange");
      const box = await p.$$eval(".tile", (e) => e.map((x) => { const r = x.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }));
      assert.deepEqual(box[0], box[1], tag + " : vignettes de même dimension " + JSON.stringify(box));
      const imgsOk = await p.$$eval(".tile img", (e) => e.every((i) => i.complete && i.naturalWidth > 0));
      assert.ok(imgsOk, tag + " : images chargées");
      const small = await p.$$eval(".lang4 button", (e) => e.filter((b) => { const r = b.getBoundingClientRect(); return r.width < 44 || r.height < 44; }).length);
      assert.equal(small, 0, tag + " : boutons de langue ≥ 44 px");
      assert.equal(await p.getAttribute(`.lang4 button[data-l="${lang}"]`, "aria-pressed"), "true");
      assert.equal(await p.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1), true, tag + " : pas de défilement horizontal");
      assert.equal((await p.title()).length > 10, true);
      assert.deepEqual(errs, [], tag + " : aucune erreur " + errs.join("|"));
      if (w === 390 && lang === "fr" && process.env.SHOT_DIR) await p.screenshot({path: process.env.SHOT_DIR + "/hub-390-fr.png", fullPage: true});
      await ctx.close();
    }
  }
  // liens et changement de langue
  {
    const ctx = await browser.newContext({viewport: {width: 390, height: 844}}), p = await ctx.newPage();
    await p.goto(`${BASE}/ausbildung-allemagne.html?lang=fr`); await p.waitForSelector(".tile");
    await p.click('.lang4 button[data-l="de"]'); await p.waitForURL(/lang=de/); await p.waitForSelector(".tile .lbl");
    assert.equal(await p.textContent(".tile .lbl"), "Ich bin Bewerber/in", "bouton DE");
    await p.click('.lang4 button[data-l="ar"]'); await p.waitForURL(/lang=ar/);
    assert.equal(await p.evaluate(() => document.documentElement.dir), "rtl", "AR : page entière en RTL");
    await p.click('.lang4 button[data-l="fr"]'); await p.waitForURL(/lang=fr/);
    await p.click(".tile >> nth=1"); await p.waitForFunction(() => location.hash === "#entreprises");
    assert.equal(await p.locator("#entreprises").isVisible(), true, "vignette entreprise → section entreprises");
    await p.goto(`${BASE}/ausbildung-allemagne.html?lang=fr`); await p.click(".tile >> nth=0"); await p.waitForURL(/\/ausbildung\/$/);
    await p.waitForSelector(".pick-card"); await ctx.close();
  }
  // accueil → vignette Ausbildung → page d'accueil Ausbildung
  {
    const ctx = await browser.newContext({viewport: {width: 390, height: 844}}), p = await ctx.newPage();
    await p.goto(`${BASE}/?accueil=1`); await p.waitForSelector("a.aus-link", {state: "attached"});
    const hrefs = await p.$$eval("a.aus-link", (e) => e.map((a) => a.getAttribute("href")));
    assert.ok(hrefs.length >= 1 && hrefs.every((h) => h === "./ausbildung-allemagne.html"), "carte d'accueil → hub : " + hrefs);
    await p.locator("a.aus-link:visible").first().click(); await p.waitForURL(/ausbildung-allemagne\.html/); await p.waitForSelector(".tile");
    await ctx.close();
  }
  await browser.close();
  console.log("Ausbildung page d'accueil (vignettes, DE/EN/FR/AR, liens, 390 et 1280 px) : toutes les vérifications sont passées.");
})().catch((e) => { console.error(e); process.exit(1); });
