/* Ausbildung Career Matcher : interface du questionnaire (français, anglais, arabe).
   Script externe : la CSP de la page n'autorise aucun script inline. Aucune donnée n'est envoyée ni enregistrée :
   les réponses restent en mémoire dans cette page et disparaissent à la fermeture ou au clic sur « Recommencer ». */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const I = window.AusI18n.make((window.SI && window.SI.lang) || "fr"), t = I.t;
  // Les textes viennent de i18n.js (fr, en, ar) : ici seulement les identifiants de réponses, que le moteur comprend.
  const steps = [
    {id:"education",values:["middle_school","secondary_no_bac","baccalaureat","vocational","bac2","licence","master"]},
    {id:"experience",values:["professional","internship","personal_projects","none"]},
    {id:"german",values:["A0","A1","A2","B1","B2","C1"]},
    {id:"interests",values:["health","technology","automotive","electronics","industry","logistics","hospitality","cooking","sales","construction","helping_people","problem_solving"],multi:true},
    {id:"environment",values:["office","workshop","hospital","hotel","shop","warehouse","construction_site","factory","open"]},
    {id:"project",values:["soon","3_6","6_12","later","exploring"]}
  ];
  const skillValues = ["logic","analytical_thinking","programming","troubleshooting","mechanical_reasoning","manual_precision","communication","organization","teamwork","empathy","planning","creativity","numeracy","reliability","electrical_reasoning","service_mindset"];
  const domainValues = ["it","automotive","electrical","health","logistics","hospitality","retail","cooking","construction","manufacturing","social"];
  const labelled = (prefix, values) => values.map((v) => [v, t(prefix + v)]);
  const emptyAnswers = () => ({education:"",experience:[],experienceDomains:[],german:"",interests:[],environment:"",project:"",mobility:"",skills:[]});
  let step = 0, answers = emptyAnswers(), catalogue = null;

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
    $("back").disabled = step === 0;
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
    const interests = answers.interests.map((v) => ({electronics:"electronics",industry:"industrial_systems",construction:"construction"}[v] || v));
    const environments = answers.environment === "open"
      ? ["office","computer","hybrid","technical_team","workshop","garage","hands_on","hospital","clinic","care_home","people_facing","industrial_site","factory","field_work","warehouse","logistics_center","hotel","reception","shop","retail_store","construction_site","professional_kitchen","restaurant","production","team"]
      : ({
        office:["office","computer"],workshop:["workshop","garage","hands_on"],hospital:["hospital","clinic","care_home","people_facing"],
        hotel:["hotel","reception","people_facing"],shop:["shop","retail_store","people_facing"],warehouse:["warehouse","logistics_center","active_work","team"],
        construction_site:["construction_site","field_work","hands_on"],factory:["factory","industrial_site","production","technical_team"]
      })[answers.environment] || [];
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
    // Un score de 0 signifie « aucune correspondance » : on ne le présente pas comme une piste.
    const useful = result.results.filter((r) => r.score > 0);
    $("quiz").hidden = true; $("results").hidden = false;
    $("resultList").innerHTML = useful.map(resultCard).join("")
      || `<p>${escapeHtml(t("res.none"))}</p>`;
    $("readiness").innerHTML = readinessHtml(result.readiness_codes);
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:0,behavior:reduce ? "auto" : "smooth"});
    $("resultsTitle").focus();
  }

  $("back").addEventListener("click", () => { collect(); step = Math.max(0, step - 1); render(true); });
  $("next").addEventListener("click", () => { collect(); if (step < steps.length - 1) { step++; render(true); } else showResults(); });
  $("restart").addEventListener("click", () => { step = 0; answers = emptyAnswers(); $("results").hidden = true; $("quiz").hidden = false; render(true); });

  $("print").addEventListener("click", () => window.print());

  if (I.lang !== "fr") applyStatic();

  fetch("./data/occupations.json").then((r) => { if (!r.ok) throw new Error("catalogue"); return r.json(); }).then((data) => {
    if (!data || !Array.isArray(data.occupations) || !data.occupations.length) throw new Error("catalogue");
    catalogue = data; render(false); $("loading").hidden = true; $("quiz").hidden = false;
  }).catch(() => {
    $("loading").textContent = t("load.error");
  });
})();
