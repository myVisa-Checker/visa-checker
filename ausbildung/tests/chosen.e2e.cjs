/* P1-2 dans un vrai navigateur : tous les métiers choisis restent affichés, quel que soit leur rang.
   Usage : python3 -m http.server 8770 (racine du dépôt) puis node ausbildung/tests/chosen.e2e.cjs [url] */
"use strict";
const assert = require("assert"), {chromium} = require("playwright");
const BASE = process.argv[2] || "http://localhost:8770";
const CHOSEN = ["industriemechaniker", "anlagenmechaniker_shk", "koch", "baecker", "verkaeufer"];
async function run(browser, lang, answered) {
  const p = await (await browser.newContext({viewport: {width: 390, height: 800}})).newPage();
  await p.goto(`${BASE}/ausbildung/?lang=${lang}`); await p.waitForSelector(".pick-card");
  assert.equal(await p.locator(".pick-card").count(), 14, "catalogue de 14 métiers affiché");
  for (const id of CHOSEN) await p.click(`.pick-card[data-id="${id}"]`);
  await p.click("#pickNext");
  if (answered) {
    // profil santé : les métiers choisis (industrie, cuisine, vente…) se classent loin derrière le 10e rang
    await p.check("input[name=education][value=baccalaureat]"); await p.click("#next");
    for (const v of ["empathy", "communication", "teamwork"]) await p.check(`#skillArea input[value=${v}]`);
    await p.click("#next"); await p.check("input[name=german][value=B1]"); await p.click("#next");
    await p.check("input[name=interests][value=health]"); await p.check("input[name=interests][value=helping_people]"); await p.click("#next");
    await p.check("input[name=environment][value=hospital]"); await p.click("#next");
    await p.check("input[name=project][value=soon]");
  } else for (let i = 0; i < 5; i++) await p.click("#next"); // aucune réponse : profil vide
  await p.click("#next"); await p.waitForSelector("#results:not([hidden])");
  const n = await p.locator("#chosenList article").count();
  assert.equal(n, CHOSEN.length, `${lang} ${answered ? "profil renseigné" : "profil vide"} : ${CHOSEN.length} métiers choisis, ${n} affichés`);
  const titles = await p.locator("#chosenList article strong").allInnerTexts();
  assert.equal(new Set(titles).size, CHOSEN.length, "aucun doublon");
  await p.context().close();
}
(async () => {
  const browser = await chromium.launch();
  for (const lang of ["fr", "en", "ar"]) for (const answered of [true, false]) await run(browser, lang, answered);
  await browser.close(); console.log("Ausbildung métiers choisis (Playwright FR/EN/AR) : 5 choisis = 5 affichés, profil renseigné ou vide.");
})().catch((e) => { console.error(e.message); process.exit(1); });
