/* Ausbildung Career Matcher : interface du questionnaire (français).
   Script externe : la CSP de la page n'autorise aucun script inline. Aucune donnée n'est envoyée ni enregistrée :
   les réponses restent en mémoire dans cette page et disparaissent à la fermeture ou au clic sur « Recommencer ». */
(function () {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const steps = [
    {id:"education",title:"Votre parcours scolaire",hint:"Quel est votre niveau d'études le plus élevé ?",options:[
      ["middle_school","Collège"],["secondary_no_bac","Lycée sans bac"],["baccalaureat","Baccalauréat"],
      ["vocational","Formation professionnelle"],["bac2","Bac +2"],["licence","Licence"],["master","Master ou plus"]
    ]},
    {id:"experience",title:"Votre expérience",hint:"Qu'avez-vous déjà fait ? Plusieurs réponses possibles.",options:[
      ["professional","Expérience professionnelle"],["internship","Stage"],["personal_projects","Projets personnels"],["none","Aucune expérience"]
    ]},
    {id:"german",title:"Vos langues",hint:"Quel est votre niveau actuel en allemand ?",options:[
      ["A0","Aucun"],["A1","A1 — débutant"],["A2","A2 — élémentaire"],["B1","B1 — intermédiaire"],["B2","B2 — indépendant"],["C1","C1 ou plus"]
    ]},
    {id:"interests",title:"Vos centres d'intérêt",hint:"Choisissez un ou plusieurs domaines.",options:[
      ["health","Santé et aide aux personnes"],["technology","Informatique et technologie"],["automotive","Automobile et mécanique"],
      ["electronics","Électricité et électronique"],["industry","Industrie et machines"],["logistics","Logistique et transport"],
      ["hospitality","Hôtellerie et tourisme"],["cooking","Cuisine et gastronomie"],["sales","Commerce et vente"],
      ["construction","Installation et bâtiment"],["helping_people","Aider les autres"],["problem_solving","Résoudre des problèmes"]
    ],multi:true},
    {id:"environment",title:"Votre environnement idéal",hint:"Où vous voyez-vous travailler ?",options:[
      ["office","Bureau et ordinateur"],["workshop","Atelier et machines"],["hospital","Hôpital et soins"],["hotel","Hôtel et accueil"],
      ["shop","Magasin et contact client"],["warehouse","Entrepôt et logistique"],["construction_site","Chantier et terrain"],
      ["factory","Usine et production"],["open","Ouvert à plusieurs environnements"]
    ]},
    {id:"project",title:"Votre projet Allemagne",hint:"Quand souhaitez-vous commencer ?",options:[
      ["soon","Dès que possible"],["3_6","Dans 3 à 6 mois"],["6_12","Dans 6 à 12 mois"],["later","Plus tard"],["exploring","Je découvre encore"]
    ]}
  ];
  const skillOptions = [
    ["logic","Logique"],["analytical_thinking","Analyse"],["programming","Programmation"],["troubleshooting","Diagnostic et résolution de problèmes"],
    ["mechanical_reasoning","Mécanique"],["manual_precision","Précision manuelle"],["communication","Communication"],["organization","Organisation"],
    ["teamwork","Travail en équipe"],["empathy","Écoute et empathie"],["planning","Planification"],["creativity","Créativité"],
    ["numeracy","Calcul"],["reliability","Fiabilité"],["electrical_reasoning","Électricité"],["service_mindset","Sens du service"]
  ];
  const domainOptions = [["it","Informatique / web"],["automotive","Automobile / mécanique"],["electrical","Électricité / électronique"],["health","Santé / soins"],["logistics","Logistique / transport"],["hospitality","Hôtellerie / tourisme"],["retail","Commerce / vente"],["cooking","Cuisine / restauration"],["construction","Bâtiment / installation"],["manufacturing","Industrie / fabrication"],["social","Social / bénévolat"]];
  const CONFIDENCE_FR = {high:"élevée",medium:"moyenne",low:"faible"};
  const LANG_NOTE = {
    en:"This pathway is currently available in French only. The result is an orientation, not a promise of a job or a visa.",
    ar:"هذا المسار متاح حالياً بالفرنسية فقط. النتيجة توجيه أولي وليست وعداً بعقد عمل أو بتأشيرة."
  };
  const emptyAnswers = () => ({education:"",experience:[],experienceDomains:[],german:"",interests:[],environment:"",project:"",mobility:"",skills:[]});
  let step = 0, answers = emptyAnswers(), catalogue = null;

  function escapeHtml(s) { return String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }
  function durationFr(months) {
    const y = Math.floor(months / 12), m = months % 12;
    const years = y ? y + (y > 1 ? " ans" : " an") : "";
    return m ? (years ? years + " et " + m + " mois" : m + " mois") : years;
  }
  function checkboxes(name, list, selected) {
    return list.map(([v, l]) => `<label class="option"><input type="checkbox" name="${name}" value="${v}" ${selected.includes(v) ? "checked" : ""}><span>${escapeHtml(l)}</span></label>`).join("");
  }

  function render(focusTitle) {
    const item = steps[step];
    $("progress").textContent = `Étape ${step + 1} sur ${steps.length}`;
    $("progressbar").style.width = `${((step + 1) / steps.length) * 100}%`;
    const track = $("progresstrack");
    track.setAttribute("aria-valuenow", String(step + 1));
    track.setAttribute("aria-valuetext", `Étape ${step + 1} sur ${steps.length}`);
    $("questionTitle").textContent = item.title;
    $("questionHint").textContent = item.hint;
    const selected = answers[item.id];
    $("answers").setAttribute("aria-labelledby", "questionTitle");
    $("answers").innerHTML = item.options.map(([value, label]) => {
      const checked = Array.isArray(selected) ? selected.includes(value) : selected === value;
      return `<label class="option"><input type="${item.multi ? "checkbox" : "radio"}" name="${item.id}" value="${value}" ${checked ? "checked" : ""}><span>${escapeHtml(label)}</span></label>`;
    }).join("");
    $("skillArea").hidden = step !== 1;
    if (step === 1) {
      $("skillArea").innerHTML = `<h3>Quelles compétences possédez-vous ?</h3><p class="muted">Vous pouvez sélectionner des compétences acquises en autodidacte.</p><div class="options" role="group" aria-label="Compétences">${checkboxes("skills", skillOptions, answers.skills)}</div><h3>Dans quel(s) domaine(s) avez-vous de l'expérience ?</h3><p class="muted">Stage, emploi, formation pratique ou projet personnel.</p><div class="options" role="group" aria-label="Domaines d'expérience">${checkboxes("experienceDomains", domainOptions, answers.experienceDomains)}</div>`;
    }
    $("mobilityArea").hidden = step !== 5;
    if (step === 5) document.querySelectorAll('input[name="mobility"]').forEach((x) => { x.checked = x.value === answers.mobility; });
    $("back").disabled = step === 0;
    $("next").textContent = step === steps.length - 1 ? "Voir mes résultats" : "Continuer";
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
    const reasons = r.reasons.slice(0, 3).map((x) => `<li>${escapeHtml(x.label_fr)}</li>`).join("");
    return `<article class="result-card"><div class="result-top"><span class="rank">#${i + 1}</span><strong>${escapeHtml(o.title_de)}</strong><span class="score">${r.score}/100</span></div>`
      + `<small>Fiabilité du classement : ${CONFIDENCE_FR[r.confidence] || "faible"}</small>`
      + `<p>${escapeHtml(o.title_fr)} · ${durationFr(o.duration_months)} · ${regulated ? "Formation réglementée" : "Formation duale"}</p>`
      + (regulated ? `<p class="reg-note">Cette formation relève d'un cadre réglementaire distinct de l'Ausbildung duale classique : vérifiez ses conditions auprès des organismes officiels compétents.</p>` : "")
      + `<ul>${reasons || "<li>Ajoutez des compétences ou des intérêts pour affiner ce résultat.</li>"}</ul></article>`;
  }

  function showResults() {
    const result = window.AusbildungMatcher.match(profile(), catalogue, 3);
    // Un score de 0 signifie « aucune correspondance » : on ne le présente pas comme une piste.
    const useful = result.results.filter((r) => r.score > 0);
    $("quiz").hidden = true; $("results").hidden = false;
    $("resultList").innerHTML = useful.map(resultCard).join("")
      || "<p>Nous n'avons pas assez de réponses concordantes pour proposer un classement utile. Recommencez en sélectionnant au moins un domaine, une compétence ou un environnement.</p>";
    $("readiness").innerHTML = `<h3>À préparer</h3><p>${escapeHtml(result.readiness.german_note_fr)}</p><p>${escapeHtml(result.readiness.school_note_fr)}</p><p>${escapeHtml(result.readiness.project_note_fr)}</p><p>${escapeHtml(result.readiness.mobility_note_fr)}</p><p>${escapeHtml(result.readiness.visa_note_fr)}</p><small>${escapeHtml(result.disclaimer_fr)}</small>`;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({top:0,behavior:reduce ? "auto" : "smooth"});
    $("resultsTitle").focus();
  }

  $("back").addEventListener("click", () => { collect(); step = Math.max(0, step - 1); render(true); });
  $("next").addEventListener("click", () => { collect(); if (step < steps.length - 1) { step++; render(true); } else showResults(); });
  $("restart").addEventListener("click", () => { step = 0; answers = emptyAnswers(); $("results").hidden = true; $("quiz").hidden = false; render(true); });

  $("print").addEventListener("click", () => window.print());

  const lang = (window.SI && window.SI.lang) || "fr";
  if (LANG_NOTE[lang]) { const n = $("langNote"); n.textContent = LANG_NOTE[lang]; n.hidden = false; }

  fetch("./data/occupations.json").then((r) => { if (!r.ok) throw new Error("catalogue"); return r.json(); }).then((data) => {
    if (!data || !Array.isArray(data.occupations) || !data.occupations.length) throw new Error("catalogue");
    catalogue = data; render(false); $("loading").hidden = true; $("quiz").hidden = false;
  }).catch(() => {
    $("loading").textContent = "Le catalogue est momentanément indisponible. Vérifiez votre connexion puis réessayez.";
  });
})();
