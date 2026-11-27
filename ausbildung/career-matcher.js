/* Career Matcher Ausbildung — deterministic, explainable, no network calls. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AusbildungMatcher = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const WEIGHTS = Object.freeze({ skills: 35, interests: 30, environments: 20, experience: 15 });
  const DIMENSIONS = Object.keys(WEIGHTS);

  function cleanList(value) {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(v => typeof v === "string" && v.trim()).map(v => v.trim()))];
  }
  function overlapScore(selected, expected) {
    const wanted = cleanList(expected);
    if (!selected.length || !wanted.length) return null;
    const set = new Set(selected);
    const hits = wanted.filter(tag => set.has(tag)).length;
    return Math.round((hits / wanted.length) * 100);
  }
  function dimensionScore(profile, occupation, key) {
    const selected = cleanList(profile[key]);
    const sourceKey = key === "experience" ? "experience_domains" : key;
    return overlapScore(selected, occupation[sourceKey]);
  }
  function scoreOccupation(profile, occupation) {
    const dimensions = {};
    let weighted = 0, activeWeight = 0;
    for (const key of DIMENSIONS) {
      const score = dimensionScore(profile, occupation, key);
      dimensions[key] = score;
      if (score !== null) {
        weighted += score * WEIGHTS[key];
        activeWeight += WEIGHTS[key];
      }
    }
    if (!activeWeight) return {
      occupation_id: occupation.id, score: null, confidence: "insufficient_data",
      dimensions, reasons: [], missing_dimensions: DIMENSIONS.slice()
    };
    const missing = DIMENSIONS.filter(key => dimensions[key] === null);
    const score = Math.round(weighted / activeWeight);
    const reasons = DIMENSIONS
      .filter(key => dimensions[key] !== null && dimensions[key] >= 25)
      .sort((a,b) => (dimensions[b] * WEIGHTS[b]) - (dimensions[a] * WEIGHTS[a]))
      .map(key => ({
        dimension:key,
        score:dimensions[key],
        label_fr:({
          skills:"Vos compétences correspondent à plusieurs compétences utiles dans ce métier.",
          interests:"Ce domaine correspond à vos centres d'intérêt.",
          environments:"L'environnement de travail correspond à vos préférences.",
          experience:"Votre expérience ou vos projets sont pertinents pour ce métier."
        })[key]
      }));
    const answeredWeight = activeWeight / DIMENSIONS.reduce((sum,k)=>sum+WEIGHTS[k],0);
    const confidence = answeredWeight >= .85 ? "high" : answeredWeight >= .55 ? "medium" : "low";
    return { occupation_id:occupation.id, score, confidence, dimensions, reasons, missing_dimensions:missing };
  }
  const EDUCATION_LABELS_FR = Object.freeze({
    middle_school:"collège", secondary_no_bac:"lycée sans baccalauréat", baccalaureat:"baccalauréat",
    vocational:"formation professionnelle", bac2:"bac +2", licence:"licence", master:"master ou plus"
  });
  const AVAILABILITY_LABELS_FR = Object.freeze({
    soon:"dès que possible", "3_6":"dans 3 à 6 mois", "6_12":"dans 6 à 12 mois", later:"plus tard", exploring:"vous découvrez encore le projet"
  });
  // Volonté de mobilité (yes, no, consider) distincte de la situation administrative (visa_pending) : un visa en cours n'est jamais lu comme un refus.
  /* Vocabulaire commun questionnaire ↔ catalogue (P1-1).
     Chaque tag du catalogue (data/occupations.json) doit être atteignable par au moins une réponse ci-dessous,
     et chaque réponse doit atteindre au moins un métier : ces deux sens sont verrouillés par tests/matcher.test.js.
     Les compétences et domaines sont 1 réponse = 1 tag. Les intérêts sont 1 réponse = 1 tag (même nom).
     Un lieu de travail (réponse unique) active l'ensemble de tags listé ; le score divise par le nombre de tags
     du métier lui-même, donc élargir un ensemble ne favorise aucun métier par construction. */
  const VOCABULARY = Object.freeze({
    skills: Object.freeze(["logic","analytical_thinking","programming","troubleshooting","mechanical_reasoning","manual_precision","attention_to_detail","safety_awareness","communication","organization","teamwork","empathy","planning","creativity","numeracy","reliability","electrical_reasoning","service_mindset"]),
    domains: Object.freeze(["it","automotive","electrical","health","logistics","hospitality","retail","cooking","construction","manufacturing","social"]),
    interests: Object.freeze(["health","technology","automotive","electronics","industry","logistics","hospitality","cooking","sales","construction","helping_people","problem_solving"]),
    environments: Object.freeze({
      office: Object.freeze(["office","computer","technical_team"]),
      workshop: Object.freeze(["workshop","garage","hands_on","technical_team"]),
      hospital: Object.freeze(["hospital","clinic","care_home","medical_practice","people_facing"]),
      hotel: Object.freeze(["hotel","reception","people_facing","shift_work"]),
      shop: Object.freeze(["shop","retail_store","people_facing","team"]),
      warehouse: Object.freeze(["warehouse","logistics_center","active_work","team","transport"]),
      construction_site: Object.freeze(["construction_site","field_work","hands_on"]),
      factory: Object.freeze(["factory","industrial_site","production","technical_team"]),
      kitchen: Object.freeze(["professional_kitchen","restaurant","bakery","production","hands_on","shift_work","team"])
    })
  });
  // « Ouvert à plusieurs environnements » = union de tous les lieux.
  const OPEN_ENVIRONMENTS = Object.freeze([...new Set(Object.values(VOCABULARY.environments).flat())]);
  function environmentTags(choice) {
    if (choice === "open") return OPEN_ENVIRONMENTS.slice();
    return Object.prototype.hasOwnProperty.call(VOCABULARY.environments, choice) ? VOCABULARY.environments[choice].slice() : [];
  }
  const MOBILITY_CODES = Object.freeze(["yes", "no", "consider", "visa_pending", "other"]);
  function readiness(profile) {
    const german = typeof profile.german_level === "string" ? profile.german_level.toUpperCase() : "UNKNOWN";
    const order = ["A0","A1","A2","B1","B2","C1","C2"];
    const known = order.includes(german);
    const education = EDUCATION_LABELS_FR[profile.education] || null;
    const availability = AVAILABILITY_LABELS_FR[profile.availability] || null;
    return {
      german_level: known ? german : "UNKNOWN",
      german_note_fr: !known
        ? "Votre niveau d'allemand reste à préciser."
        : order.indexOf(german) < order.indexOf("B1")
          ? "Prévoyez une progression en allemand. Le niveau demandé dépend de la formation, de l'établissement et de la procédure de séjour."
          : "Votre niveau déclaré est B1 ou supérieur ; vérifiez tout de même les exigences de la formation et de la procédure de séjour.",
      school_note_fr:education
        ? "Niveau d'études déclaré : " + education + ". Les conditions scolaires varient selon le métier, le Land et l'entreprise ; vérifiez-les auprès de l'établissement ou de l'employeur."
        : "Les conditions scolaires varient selon le métier, le Land et l'entreprise. Vérifiez-les auprès de l'établissement ou de l'employeur.",
      project_note_fr:availability ? "Votre horizon de départ déclaré : " + availability + "." : "Votre calendrier de départ reste à préciser.",
      mobility_note_fr:({yes:"Vous vous déclarez prêt(e) à déménager en Allemagne.",no:"Vous ne souhaitez pas déménager pour le moment.",consider:"Vous hésitez encore à déménager en Allemagne.",visa_pending:"Votre visa est en cours de traitement : cela ne remet pas en cause votre souhait de déménager.",other:"Votre situation est différente ; elle reste à préciser."})[profile.mobility] || "Votre mobilité reste à discuter.",
      visa_note_fr:"Ce classement ne vérifie pas votre éligibilité au visa et ne garantit ni contrat de formation ni décision administrative."
    };
  }
  // Codes neutres des notes « À préparer » : l'interface s'en sert pour les afficher dans la langue choisie.
  // Ils restent hors de readiness() : les notes *_fr de readiness() sont les seuls textes qui contiennent des libellés lisibles.
  function readinessCodes(profile) {
    const german = typeof profile.german_level === "string" ? profile.german_level.toUpperCase() : "UNKNOWN";
    const order = ["A0","A1","A2","B1","B2","C1","C2"];
    return {
      german: !order.includes(german) ? "unknown" : order.indexOf(german) < order.indexOf("B1") ? "below_b1" : "b1_plus",
      education: EDUCATION_LABELS_FR[profile.education] ? profile.education : null,
      availability: AVAILABILITY_LABELS_FR[profile.availability] ? profile.availability : null,
      mobility: MOBILITY_CODES.includes(profile.mobility) ? profile.mobility : "unknown"
    };
  }
  function match(profile, catalogue, limit=3) {
    if (!profile || !catalogue || !Array.isArray(catalogue.occupations)) throw new TypeError("Profil et catalogue requis.");
    const ranked = catalogue.occupations.map(o => ({occupation:o, result:scoreOccupation(profile,o)}))
      .filter(x => x.result.score !== null)
      .sort((a,b) => b.result.score-a.result.score || a.occupation.title_de.localeCompare(b.occupation.title_de));
    return {
      engine_version:"0.1.1",
      scoring_weights:WEIGHTS,
      results:ranked.slice(0,Math.max(1,Math.min(ranked.length||1,Number.isFinite(limit)?Math.floor(limit):3))).map(x => ({...x.result,occupation:x.occupation})),
      readiness:readiness(profile),
      readiness_codes:readinessCodes(profile),
      disclaimer_fr:"Orientation indicative uniquement. Le score mesure une correspondance avec les préférences et compétences déclarées, pas une probabilité d'embauche ou de visa."
    };
  }
  return Object.freeze({ match, scoreOccupation, readiness, readinessCodes, WEIGHTS, VOCABULARY, environmentTags });
});
