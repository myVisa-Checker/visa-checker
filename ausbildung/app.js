/* Ausbildung Career Matcher : interface du questionnaire (français, anglais, arabe).
   Script externe : la CSP de la page n'autorise aucun script inline. Aucune donnée n'est envoyée ni enregistrée :
   les réponses restent en mémoire dans cette page et disparaissent à la fermeture ou au clic sur « Recommencer ». */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const I = window.AusI18n.make((window.SI && window.SI.lang) || "fr"), t = I.t;
  // Les textes viennent de i18n.js (fr, en, ar) : ici seulement les identifiants de réponses, que le moteur comprend.
  { const m = document.getElementById("aus"); if (m) { m.setAttribute("lang", I.lang); m.setAttribute("dir", I.dir); } document.documentElement.setAttribute("lang", I.lang); }
  const steps = [
    {id:"education",values:["middle_school","secondary_no_bac","baccalaureat","vocational","bac2","licence","master"]},
    {id:"experience",values:["professional","internship","personal_projects","training","none"],multi:true},
    {id:"german",values:["A0","A1","A2","B1","B2","C1"]},
    {id:"interests",values:["health","technology","automotive","electronics","industry","logistics","hospitality","cooking","sales","construction","helping_people","problem_solving"],multi:true},
    {id:"environment",values:["office","workshop","hospital","hotel","shop","warehouse","kitchen","construction_site","factory","open"]},
    {id:"project",values:["soon","3_6","6_12","later","exploring"]}
  ];
  const skillValues = window.AusbildungMatcher.VOCABULARY.skills.slice();
  const domainValues = window.AusbildungMatcher.VOCABULARY.domains.slice();
  const labelled = (prefix, values) => values.map((v) => [v, t(prefix + v)]);
  const emptyAnswers = () => ({education:"",experience:[],experienceDomains:[],german:"",interests:[],environment:"",project:"",mobility:"",skills:[]});
  let step = 0, answers = emptyAnswers(), catalogue = null, companies = null, sector = "all";
  const SECTORS = ["all","health","it","tech","logistics","hospitality","retail"];
  const titleOf = (o) => window.AusFiche.titleOf(o, I.lang);
  const chosen = new Set();
  const ICONS = {pflegefachkraft:"🩺",fachinformatiker:"💻",kfz_mechatroniker:"🚗",elektroniker_betrieb:"⚡",industriemechaniker:"⚙️",lagerlogistik:"📦",hotelfach:"🏨",koch:"🍳",verkaeufer:"🛍️",anlagenmechaniker_shk:"🔧",elektroniker_energie_gebaeude:"💡",baecker:"🥖",medizinische_fachangestellte:"🩹",berufskraftfahrer:"🚚"};
  function setStage(n) { // 1 = Métier, 2 = Profil, 3 = Résultat
    document.querySelectorAll("#stages li").forEach((li, i) => {
      li.classList.toggle("done", i < n); li.classList.toggle("cur", i === n);
      if (i === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
      const num = li.querySelector(".n"); if (num) num.textContent = i < n ? "✓" : String(i + 1);
    });
  }

  function norm(t) { return String(t).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""); }
  function renderSectors() {
    $("sectors").innerHTML = SECTORS.map((k) => `<button type="button" class="chip${sector === k ? " on" : ""}" data-sector="${k}" aria-pressed="${sector === k}">${escapeHtml(t("sector." + k))}</button>`).join("");
  }
  function renderPick() {
    const q = norm($("pickSearch").value.trim());
    const list = catalogue.occupations.filter((o) => (sector === "all" || o.sector === sector) && (!q || norm([o.title_fr, o.title_en, o.title_de, o.title_ar].join(" ")).includes(q)));
    $("pickGrid").innerHTML = list.map((o) => {
      const on = chosen.has(o.id), reg = o.training_type !== "dual";
      return `<div class="pick-item"><button type="button" class="pick-card${on ? " on" : ""}" data-id="${escapeHtml(o.id)}" aria-pressed="${on}"><span class="pi" aria-hidden="true">${ICONS[o.id] || "🎓"}</span><span class="pt"><strong>${escapeHtml(titleOf(o))}</strong><small>${escapeHtml(o.title_de)}${reg ? " · " + escapeHtml(t("pick.reg")) : ""}</small></span><span class="pc" aria-hidden="true">${on ? "✓" : ""}</span></button><button type="button" class="fiche-btn" data-fiche="${escapeHtml(o.id)}" aria-label="${escapeHtml(t("pick.fiche") + " : " + titleOf(o))}">${escapeHtml(t("pick.fiche"))}</button></div>`;
    }).join("");
    $("pickNone").hidden = list.length > 0;
    renderSectors();
    const names = catalogue.occupations.filter((o) => chosen.has(o.id)).map(titleOf);
    $("pickSumT").textContent = names.length === 0 ? t("pick.sum0") : names.length === 1 ? t("pick.sum1") : t("pick.sumN", {n: names.length});
    $("pickSumL").textContent = names.length ? names.join(I.lang === "ar" ? "، " : ", ") : "";
    $("pickClear").hidden = !names.length;
    $("pickSum").classList.toggle("has", names.length > 0);
  }
  function showFiche(id, back) {
    const o = catalogue.occupations.find((x) => x.id === id); if (!o) return;
    $("pick").hidden = true; $("pickmore").hidden = true; $("introwrap").hidden = true; $("fiche").hidden = false;
    $("fiche").innerHTML = window.AusFiche.render({o, data: catalogue, companies, I, chosen});
    window.scrollTo({top: 0, behavior: "auto"}); $("ficheH").focus();
    $("ficheBack").addEventListener("click", () => { hideFiche(); const again = $("pickGrid").querySelector(`[data-fiche="${id}"]`); if (again) again.focus(); });
    $("ficheChoose").addEventListener("click", () => { if (chosen.has(id)) chosen.delete(id); else chosen.add(id); showFiche(id); $("ficheChoose").focus(); });
  }
  function hideFiche() { $("fiche").hidden = true; $("fiche").innerHTML = ""; showPick(); }
  function showPick() {
    $("fiche").hidden = true; $("introwrap").hidden = false; $("pick").hidden = false; $("pickmore").hidden = false; $("quizhero").hidden = true; $("quiz").hidden = true; $("results").hidden = true;
    setStage(1); renderPick();
  }
  function showQuiz(focus) {
    $("fiche").hidden = true; $("introwrap").hidden = true; $("pick").hidden = true; $("pickmore").hidden = true; $("quizhero").hidden = false; $("quiz").hidden = false; $("results").hidden = true;
    setStage(2); step = 0; render(!!focus);
  }
  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  // Le HTML est en français ; pour l'anglais et l'arabe, chaque élément marqué data-t / data-ta reçoit son texte traduit.
  function applyStatic() {
    document.querySelectorAll("[data-t]").forEach((el) => { el.textContent = t(el.getAttribute("data-t")); });
    document.querySelectorAll("[data-ta]").forEach((el) => {
      el.getAttribute("data-ta").split(";").forEach((pair) => { const [a, k] = pair.split("="); if (a && k) el.setAttribute(a.trim(), t(k.trim())); });
    });
  }
  function checkboxes(name, list, selected) {
    return list.map(([v, l]) => `<label class="option"><input type="checkbox" name="${name}" value="${v}" ${selected.includes(v) ? "checked" : ""}><span>${escapeHtml(l)}</span></label>`).join("");
  }

  function render(focusTitle) {
    const item = steps[step];
    $("progress").textContent = t("step.n", {n: step + 1, total: steps.length});
    $("progressbar").style.width = `${((step + 1) / steps.length) * 100}%`;
    const track = $("progresstrack");
    track.setAttribute("aria-valuenow", String(step + 1));
    track.setAttribute("aria-valuetext", t("step.n", {n: step + 1, total: steps.length}));
    $("questionTitle").textContent = t("q." + item.id + ".title");
    $("questionHint").textContent = t("q." + item.id + ".hint");
    const selected = answers[item.id];
    $("answers").setAttribute("aria-labelledby", "questionTitle");
    $("answers").innerHTML = labelled("o." + item.id + ".", item.values).map(([value, label]) => {
      const checked = Array.isArray(selected) ? selected.includes(value) : selected === value;
      return `<label class="option"><input type="${item.multi ? "checkbox" : "radio"}" name="${item.id}" value="${value}" ${checked ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
    }).join("");
    $("skillArea").hidden = step !== 1;
    if (step === 1) {
      $("skillArea").innerHTML = `<h3>${escapeHtml(t("sk.title"))}</h3><p class="muted">${escapeHtml(t("sk.hint"))}</p><div class="options" role="group" aria-label="${escapeHtml(t("sk.aria"))}">${checkboxes("skills", labelled("skill.", skillValues), answers.skills)}</div><h3>${escapeHtml(t("dm.title"))}</h3><p class="muted">${escapeHtml(t("dm.hint"))}</p><div class="options" role="group" aria-label="${escapeHtml(t("dm.aria"))}">${checkboxes("experienceDomains", labelled("dom.", domainValues), answers.experienceDomains)}</div>`;
    }
    $("mobilityArea").hidden = step !== 5;
    if (step === 5) document.querySelectorAll('input[name="mobility"]').forEach((x) => { x.checked = x.value === answers.mobility; });
    $("back").disabled = false; $("toStart").disabled = step === 0;
    $("next").textContent = step === steps.length - 1 ? t("btn.finish") : t("btn.next");
    $("error").textContent = "";
    if (focusTitle) { $("questionTitle").focus(); }
  }

  function collect() {
    const item = steps[step], values = [...document.querySelectorAll(`input[name="${item.id}"]:checked`)].map((x) => x.value);
    answers[item.id] = item.multi ? values : (values[0] || "");
    if (step === 1) {
      answers.skills = [...document.querySelectorAll('input[name="skills"]:checked')].map((x) => x.value);
      answers.experienceDomains = [...document.querySelectorAll('input[name="experienceDomains"]:checked')].map((x) => x.value);
    }
    if (step === 5) { const m = document.querySelector('input[name="mobility"]:checked'); answers.mobility = m ? m.value : ""; }
    // « Aucune expérience » est une réponse neutre : elle retire seulement la dimension expérience du calcul.
    if (item.id === "experience" && answers.experience.includes("none")) { answers.experience = ["none"]; answers.experienceDomains = []; }
  }

  function profile() {
    const interests = answers.interests.slice();
    const environments = window.AusbildungMatcher.environmentTags(answers.environment);
    return {skills:answers.skills,interests,environments,experience:answers.experience.includes("none") ? [] : answers.experienceDomains,german_level:answers.german,education:answers.education,availability:answers.project,mobility:answers.mobility};
  }

  function resultCard(r, i) {
    const o = r.occupation, regulated = o.training_type !== "dual";
    const title = o["title_" + I.lang] || o.title_fr;
    const reasons = r.reasons.slice(0, 3).map((x) => `<li>${escapeHtml(t("reason." + x.dimension))}</li>`).join("");
    return `<article class="result-card"><div class="result-top"><span class="rank">#${i + 1}</span><strong><bdi lang="de">${escapeHtml(o.title_de)}</bdi></strong><span class="score" dir="ltr">${r.score}/100</span></div>`
      + `<small>${escapeHtml(t("conf.label", {v: t("conf." + (["high","medium","low"].includes(r.confidence) ? r.confidence : "low"))}))}</small>`
      + `<p>${escapeHtml(title)} · ${escapeHtml(I.duration(o.duration_months))} · ${escapeHtml(regulated ? t("kind.reg") : t("kind.dual"))}</p>`
      + (regulated ? `<p class="reg-note">${escapeHtml(t("reg.note"))}</p>` : "")
      + `<ul>${reasons || `<li>${escapeHtml(t("reason.empty"))}</li>`}</ul></article>`;
  }

  // Notes « À préparer » : composées à partir des codes du moteur, dans la langue de l'interface.
  function readinessHtml(c) {
    const school = c.education ? t("ready.school.with", {edu: t("edu." + c.education)}) : t("ready.school.without");
    const project = c.availability ? t("ready.project.with", {when: t("avail." + c.availability)}) : t("ready.project.without");
    return `<h3>${escapeHtml(t("ready.title"))}</h3><p>${escapeHtml(t("ready.german." + (c.german || "unknown")))}</p><p>${escapeHtml(school)}</p><p>${escapeHtml(project)}</p><p>${escapeHtml(t("ready.mobility." + (c.mobility || "other")))}</p><p>${escapeHtml(t("ready.visa"))}</p><small>${escapeHtml(t("disclaimer"))}</small>`;
  }

  function showResults() {
    const result = window.AusbildungMatcher.match(profile(), catalogue, 3);
    const full = window.AusbildungMatcher.match(profile(), catalogue, catalogue.occupations.length);
    // Un score de 0 signifie « aucune correspondance » : on ne le présente pas comme une piste.
    const useful = result.results.filter((r) => r.score > 0);
    $("quiz").hidden = true; $("results").hidden = false; setStage(3);
    // Tout métier choisi reste affiché : classé par le moteur, sinon (profil trop pauvre pour être classé) avec la mention « pas assez de réponses ».
    const ranked = new Map(full.results.map((r, i) => [r.occupation.id, [r, i]]));
    const mine = catalogue.occupations.filter((o) => chosen.has(o.id)).map((o) => ranked.get(o.id) || [{occupation: o, score: 0}, Infinity]).sort((x, y) => x[1] - y[1]);
    $("chosenWrap").hidden = !mine.length;
    $("chosenList").innerHTML = mine.map(([r, i]) => r.score > 0 ? resultCard(r, i) : `<article class="result-card"><strong>${escapeHtml(r.occupation.title_de)}</strong><p>${escapeHtml(t("res.noenough", {title: titleOf(r.occupation)}))}</p></article>`).join("");
    $("resultList").innerHTML = useful.map(resultCard).join("")
      || `<p>${escapeHtml(t("res.none"))}</p>`;
    $("readiness").innerHTML = readinessHtml(result.readiness_codes);
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:0,behavior:reduce ? "auto" : "smooth"});
    $("resultsTitle").focus();
  }

  // Question « expérience » : plusieurs cases possibles ; « Aucune expérience » est exclusive (cocher l'une décoche les autres).
  $("answers").addEventListener("change", (e) => {
    const t = e.target;
    if (!t || t.name !== "experience" || t.type !== "checkbox") return;
    const boxes = [...document.querySelectorAll('input[name="experience"]')];
    if (t.checked && t.value === "none") boxes.forEach((x) => { if (x !== t) x.checked = false; });
    else if (t.checked) boxes.forEach((x) => { if (x.value === "none") x.checked = false; });
  });
  // Accès directs : début du questionnaire et sélection des métiers ; les réponses restent en mémoire (aucun stockage navigateur).
  $("toStart").addEventListener("click", () => { collect(); step = 0; render(true); window.scrollTo({top:0,behavior:"auto"}); });
  $("toPick").addEventListener("click", () => { collect(); showPick(); $("pickH").focus(); });
  $("back").addEventListener("click", () => { collect(); if (step === 0) { showPick(); $("pickH").focus(); return; } step = Math.max(0, step - 1); render(true); });
  $("next").addEventListener("click", () => { collect(); if (step < steps.length - 1) { step++; render(true); } else showResults(); });
  $("restart").addEventListener("click", () => { step = 0; answers = emptyAnswers(); chosen.clear(); $("pickSearch").value = ""; showPick(); $("pickH").focus(); });

  $("pickGrid").addEventListener("click", (e) => {
    const fb = e.target.closest && e.target.closest(".fiche-btn"); if (fb) { showFiche(fb.getAttribute("data-fiche")); return; }
    const b = e.target.closest && e.target.closest(".pick-card"); if (!b) return;
    const id = b.getAttribute("data-id"); if (chosen.has(id)) chosen.delete(id); else chosen.add(id);
    renderPick(); const again = $("pickGrid").querySelector(`[data-id="${id}"]`); if (again) again.focus();
  });
  $("sectors").addEventListener("click", (e) => { const b = e.target.closest && e.target.closest("[data-sector]"); if (!b) return; sector = b.getAttribute("data-sector"); renderPick(); const again = $("sectors").querySelector(`[data-sector="${sector}"]`); if (again) again.focus(); });
  $("pickSearch").addEventListener("input", renderPick);
  $("pickClear").addEventListener("click", () => { chosen.clear(); renderPick(); $("pickSearch").focus(); });
  $("pickNext").addEventListener("click", () => { showQuiz(true); window.scrollTo({top:0,behavior:"auto"}); });
  $("print").addEventListener("click", () => window.print());

  // Changement de langue : le sélecteur du site recharge la page. Pour ne pas perdre les réponses, elles sont confiées
  // à window.name (mémoire de l'onglet, aucun stockage navigateur) au moment précis du clic, puis effacées dès la relecture.
  const HANDOFF = "aus-handoff:";
  const strList = (v) => (Array.isArray(v) ? v.filter((x) => typeof x === "string" && x.length < 40).slice(0, 40) : []);
  const strVal = (v) => (typeof v === "string" && v.length < 40 ? v : "");
  function currentScreen() { return !$("results").hidden ? "results" : !$("quiz").hidden ? "quiz" : "pick"; }
  document.addEventListener("click", (e) => {
    if (!e.target.closest || !e.target.closest(".sn-lang button") || !catalogue) return;
    try {
      if (!$("quiz").hidden) collect();
      window.name = HANDOFF + JSON.stringify({answers, chosen: [...chosen], step, sector, screen: currentScreen()});
    } catch (err) { window.name = ""; }
  }, true);
  function takeHandoff() {
    if (typeof window.name !== "string" || window.name.indexOf(HANDOFF) !== 0) return null;
    const raw = window.name.slice(HANDOFF.length); window.name = "";
    try {
      const s = JSON.parse(raw), a = s.answers || {}, base = emptyAnswers();
      const ids = new Set(catalogue.occupations.map((o) => o.id));
      const out = {};
      for (const k of Object.keys(base)) out[k] = Array.isArray(base[k]) ? strList(a[k]) : strVal(a[k]);
      return {answers: out, chosen: strList(s.chosen).filter((x) => ids.has(x)), step: Number.isInteger(s.step) && s.step >= 0 && s.step < steps.length ? s.step : 0,
        sector: SECTORS.includes(s.sector) ? s.sector : "all", screen: ["pick", "quiz", "results"].includes(s.screen) ? s.screen : "pick"};
    } catch (err) { return null; }
  }
  function restoreHandoff(h) {
    answers = h.answers; h.chosen.forEach((id) => chosen.add(id)); sector = h.sector;
    if (h.screen === "quiz") { showQuiz(false); step = h.step; render(false); }
    else if (h.screen === "results") showResults();
    else showPick();
  }
  $("editAnswers").addEventListener("click", () => { showQuiz(true); window.scrollTo({top:0,behavior:"auto"}); });

  if (I.lang !== "fr") applyStatic();

  fetch("./data/occupations.json").then((r) => { if (!r.ok) throw new Error("catalogue"); return r.json(); }).then((data) => {
    if (!data || !Array.isArray(data.occupations) || !data.occupations.length) throw new Error("catalogue");
    catalogue = data; $("pickTitle").textContent = t("pick.title", {n: data.occupations.length}); $("loading").hidden = true;
    const h = takeHandoff(); if (h) restoreHandoff(h); else showPick();
    // Annuaire : facultatif, la fiche reste utilisable sans lui.
    fetch("./data/companies.json").then((r) => (r.ok ? r.json() : null)).then((c) => { companies = c; }).catch(() => {});
  }).catch(() => {
    $("loading").textContent = t("load.error");
  });
})();
