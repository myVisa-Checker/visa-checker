/* Correction 5 : réponses conservées au changement de langue, « Modifier mes réponses », Service Worker dès la 1re visite, hors ligne.
   Usage : node ausbildung/tests/nav.e2e.cjs [url]  (serveur statique à la racine du dépôt) */
"use strict";
const assert = require("assert"), {chromium} = require("playwright");
const BASE = process.argv[2] || "http://localhost:8770";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch();

  // --- 1. Langue : les réponses survivent au rechargement, sans stockage de réponses
  {
    const ctx = await browser.newContext({viewport: {width: 390, height: 800}}), p = await ctx.newPage();
    const errs = []; p.on("pageerror", (e) => errs.push(e.message));
    await p.goto(`${BASE}/ausbildung/?lang=fr`); await p.waitForSelector(".pick-card");
    await p.click('.pick-card[data-id="koch"]'); await p.click("#pickNext"); await p.waitForSelector("#answers input");
    await p.check("input[name=education][value=baccalaureat]"); await p.click("#next");
    await p.check("input[name=experience][value=internship]"); await p.check("input[name=skills][value=teamwork]").catch(() => {});
    // aller en étape allemand (2e étape de l'écran « Profil » = index 2)
    await p.click("#next");
    await p.check("input[name=german][value=A2]");
    // bascule EN depuis l'étape allemand
    await p.click('.sn-lang button[data-l="en"]'); await p.waitForSelector("#answers input[name=german]");
    assert.equal(await p.evaluate(() => document.documentElement.lang), "en");
    assert.equal(await p.isChecked("input[name=german][value=A2]"), true, "réponse allemand conservée après EN");
    await p.click("#back"); await p.waitForSelector("input[name=experience]");
    assert.equal(await p.isChecked("input[name=experience][value=internship]"), true, "expérience conservée après EN");
    await p.click("#back"); assert.equal(await p.isChecked("input[name=education][value=baccalaureat]"), true, "diplôme conservé après EN");
    assert.equal(await p.evaluate(() => window.name), "", "window.name vidé après relecture");
    // métier choisi conservé
    await p.click("#toPick"); await p.waitForSelector(".pick-card");
    assert.equal(await p.getAttribute('.pick-card[data-id="koch"]', "aria-pressed"), "true", "métier choisi conservé");
    // résultats → bascule AR → résultats toujours affichés
    await p.click("#pickNext"); await p.waitForSelector("#answers input");
    for (let i = 0; i < 6; i++) await p.click("#next");
    await p.waitForSelector("#results:not([hidden])");
    await p.click('.sn-lang button[data-l="ar"]'); await p.waitForSelector("#results:not([hidden])");
    assert.equal(await p.evaluate(() => document.getElementById("aus").dir), "rtl");
    assert.ok(await p.locator("#chosenList .result-card").count() >= 1, "métier choisi dans les résultats après AR");
    // « Modifier mes réponses »
    await p.click("#editAnswers"); await p.waitForSelector("#quiz:not([hidden])");
    assert.equal(await p.locator("#results").isHidden(), true);
    assert.equal(await p.isChecked("input[name=education][value=baccalaureat]"), true, "réponses intactes après « Modifier mes réponses »");
    // aucune réponse dans le stockage
    const dump = await p.evaluate(() => JSON.stringify([Object.entries(localStorage), Object.entries(sessionStorage)]));
    assert.doesNotMatch(dump, /baccalaureat|koch|internship|A2/, "aucune réponse dans localStorage/sessionStorage");
    assert.deepEqual(errs, [], "aucune erreur JS : " + errs.join("|"));
    await ctx.close();
  }

  // --- 2. Service Worker dès une première visite directe, puis hors ligne
  {
    const ctx = await browser.newContext({viewport: {width: 390, height: 800}}), p = await ctx.newPage();
    await p.goto(`${BASE}/ausbildung/`); await p.waitForSelector(".pick-card");
    await p.evaluate(() => navigator.serviceWorker.ready);
    await p.waitForFunction(() => navigator.serviceWorker.controller || false, null, {timeout: 15000}).catch(async () => { await p.reload(); });
    // attendre la fin du précache
    let cached = false;
    for (let i = 0; i < 40 && !cached; i++) {
      cached = await p.evaluate(async () => { const keys = await caches.keys(); for (const k of keys) { const c = await caches.open(k); if (await c.match("/ausbildung/data/occupations.json") && await c.match("/ausbildung/app.js") && await c.match("/ausbildung/sw-register.js")) return true; } return false; });
      if (!cached) await sleep(500);
    }
    assert.ok(cached, "précache Ausbildung complet après une 1re visite directe");
    await ctx.setOffline(true);
    for (const q of ["", "?lang=en", "?lang=ar"]) {
      await p.goto(`${BASE}/ausbildung/${q}`); await p.waitForSelector(".pick-card", {timeout: 10000});
      assert.ok(await p.locator(".pick-card").count() >= 14, "hors ligne" + q + " : 14 métiers affichés");
      await p.click('.fiche-btn[data-fiche="koch"]'); await p.waitForSelector("#fiche:not([hidden])");
      await p.click("#ficheBack");
    }
    await ctx.setOffline(false);
    await ctx.close();
  }
  await browser.close();
  console.log("Ausbildung navigation et PWA (langue, modifier les réponses, Service Worker, hors ligne) : toutes les vérifications sont passées.");
})().catch((e) => { console.error(e); process.exit(1); });
