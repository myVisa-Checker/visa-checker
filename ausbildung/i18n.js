/* Ausbildung Career Matcher : textes de l'interface en français, anglais et arabe.
   Le français est la langue source (celle du HTML). La langue vient du sélecteur du site (window.SI.lang).
   Aucune donnée n'est stockée ici : ce fichier ne contient que des textes. */
(function (root, factory) {
  const api = factory(root);
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AusI18n = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function (root) {
  "use strict";

  const fr = {
    "meta.title": "Ausbildung en Allemagne : trouvez votre métier | CheckMyVisa",
    "meta.desc": "Répondez à quelques questions pour découvrir les métiers de l'Ausbildung (formation en alternance en Allemagne) qui correspondent à vos intérêts et à vos compétences. Orientation indicative, gratuite et sans document personnel.",
    "meta.ogdesc": "Un questionnaire de 3 à 4 minutes pour découvrir les métiers de l'Ausbildung qui vous correspondent.",

    "aria.crumbs": "Fil d'Ariane", "crumb.home": "Accueil", "crumb.sep": "›",
    "hero.eyebrow": "VOTRE PROJET · ALLEMAGNE",
    "hero.h1": "Trouvez une Ausbildung qui vous correspond.",
    "hero.p": "Quelques questions pour découvrir les métiers de la formation en alternance en Allemagne qui correspondent à vos intérêts, à vos compétences et à votre façon de travailler.",
    "trust.free": "✓ Gratuit", "trust.time": "✓ 3–4 minutes", "trust.nodoc": "✓ Sans document personnel",
    "loading": "Chargement du catalogue…",
    "load.error": "Le catalogue est momentanément indisponible. Vérifiez votre connexion puis réessayez.",
    "aria.quiz": "Questionnaire", "aria.progress": "Progression", "aria.results": "Résultats",
    "step.n": "Étape {n} sur {total}",
    "btn.back": "Retour", "btn.next": "Continuer", "btn.finish": "Voir mes résultats",
    "btn.restart": "Recommencer", "btn.print": "Imprimer / enregistrer en PDF",

    "q.education.title": "Votre parcours scolaire", "q.education.hint": "Quel est votre niveau d'études le plus élevé ?",
    "o.education.middle_school": "Collège", "o.education.secondary_no_bac": "Lycée sans bac", "o.education.baccalaureat": "Baccalauréat",
    "o.education.vocational": "Formation professionnelle", "o.education.bac2": "Bac +2", "o.education.licence": "Licence", "o.education.master": "Master ou plus",
    "q.experience.title": "Votre expérience", "q.experience.hint": "Qu'avez-vous déjà fait ? Plusieurs réponses possibles.",
    "o.experience.professional": "Expérience professionnelle", "o.experience.internship": "Stage", "o.experience.personal_projects": "Projets personnels", "o.experience.none": "Aucune expérience",
    "q.german.title": "Vos langues", "q.german.hint": "Quel est votre niveau actuel en allemand ?",
    "o.german.A0": "Aucun", "o.german.A1": "A1 — débutant", "o.german.A2": "A2 — élémentaire", "o.german.B1": "B1 — intermédiaire", "o.german.B2": "B2 — indépendant", "o.german.C1": "C1 ou plus",
    "q.interests.title": "Vos centres d'intérêt", "q.interests.hint": "Choisissez un ou plusieurs domaines.",
    "o.interests.health": "Santé et aide aux personnes", "o.interests.technology": "Informatique et technologie", "o.interests.automotive": "Automobile et mécanique",
    "o.interests.electronics": "Électricité et électronique", "o.interests.industry": "Industrie et machines", "o.interests.logistics": "Logistique et transport",
    "o.interests.hospitality": "Hôtellerie et tourisme", "o.interests.cooking": "Cuisine et gastronomie", "o.interests.sales": "Commerce et vente",
    "o.interests.construction": "Installation et bâtiment", "o.interests.helping_people": "Aider les autres", "o.interests.problem_solving": "Résoudre des problèmes",
    "q.environment.title": "Votre environnement idéal", "q.environment.hint": "Où vous voyez-vous travailler ?",
    "o.environment.office": "Bureau et ordinateur", "o.environment.workshop": "Atelier et machines", "o.environment.hospital": "Hôpital et soins",
    "o.environment.hotel": "Hôtel et accueil", "o.environment.shop": "Magasin et contact client", "o.environment.warehouse": "Entrepôt et logistique",
    "o.environment.construction_site": "Chantier et terrain", "o.environment.factory": "Usine et production", "o.environment.open": "Ouvert à plusieurs environnements",
    "q.project.title": "Votre projet Allemagne", "q.project.hint": "Quand souhaitez-vous commencer ?",
    "o.project.soon": "Dès que possible", "o.project.3_6": "Dans 3 à 6 mois", "o.project.6_12": "Dans 6 à 12 mois", "o.project.later": "Plus tard", "o.project.exploring": "Je découvre encore",

    "sk.title": "Quelles compétences possédez-vous ?", "sk.hint": "Vous pouvez sélectionner des compétences acquises en autodidacte.", "sk.aria": "Compétences",
    "skill.logic": "Logique", "skill.analytical_thinking": "Analyse", "skill.programming": "Programmation", "skill.troubleshooting": "Diagnostic et résolution de problèmes",
    "skill.mechanical_reasoning": "Mécanique", "skill.manual_precision": "Précision manuelle", "skill.communication": "Communication", "skill.organization": "Organisation",
    "skill.teamwork": "Travail en équipe", "skill.empathy": "Écoute et empathie", "skill.planning": "Planification", "skill.creativity": "Créativité",
    "skill.numeracy": "Calcul", "skill.reliability": "Fiabilité", "skill.electrical_reasoning": "Électricité", "skill.service_mindset": "Sens du service",
    "dm.title": "Dans quel(s) domaine(s) avez-vous de l'expérience ?", "dm.hint": "Stage, emploi, formation pratique ou projet personnel.", "dm.aria": "Domaines d'expérience",
    "dom.it": "Informatique / web", "dom.automotive": "Automobile / mécanique", "dom.electrical": "Électricité / électronique", "dom.health": "Santé / soins",
    "dom.logistics": "Logistique / transport", "dom.hospitality": "Hôtellerie / tourisme", "dom.retail": "Commerce / vente", "dom.cooking": "Cuisine / restauration",
    "dom.construction": "Bâtiment / installation", "dom.manufacturing": "Industrie / fabrication", "dom.social": "Social / bénévolat",
    "mob.title": "Êtes-vous prêt(e) à déménager en Allemagne ?", "mob.yes": "Oui", "mob.no": "Non", "mob.consider": "Je dois encore réfléchir",

    "res.eyebrow": "VOTRE ORIENTATION", "res.title": "Les métiers qui vous correspondent",
    "res.sub": "Ce classement est une première orientation, pas une promesse d'embauche.",
    "res.none": "Nous n'avons pas assez de réponses concordantes pour proposer un classement utile. Recommencez en sélectionnant au moins un domaine, une compétence ou un environnement.",
    "conf.label": "Fiabilité du classement : {v}", "conf.high": "élevée", "conf.medium": "moyenne", "conf.low": "faible",
    "kind.dual": "Formation duale", "kind.reg": "Formation réglementée",
    "reg.note": "Cette formation relève d'un cadre réglementaire distinct de l'Ausbildung duale classique : vérifiez ses conditions auprès des organismes officiels compétents.",
    "reason.empty": "Ajoutez des compétences ou des intérêts pour affiner ce résultat.",
    "reason.skills": "Vos compétences correspondent à plusieurs compétences utiles dans ce métier.",
    "reason.interests": "Ce domaine correspond à vos centres d'intérêt.",
    "reason.environments": "L'environnement de travail correspond à vos préférences.",
    "reason.experience": "Votre expérience ou vos projets sont pertinents pour ce métier.",

    "ready.title": "À préparer",
    "ready.german.unknown": "Votre niveau d'allemand reste à préciser.",
    "ready.german.below_b1": "Prévoyez une progression en allemand. Le niveau demandé dépend de la formation, de l'établissement et de la procédure de séjour.",
    "ready.german.b1_plus": "Votre niveau déclaré est B1 ou supérieur ; vérifiez tout de même les exigences de la formation et de la procédure de séjour.",
    "ready.school.with": "Niveau d'études déclaré : {edu}. Les conditions scolaires varient selon le métier, le Land et l'entreprise ; vérifiez-les auprès de l'établissement ou de l'employeur.",
    "ready.school.without": "Les conditions scolaires varient selon le métier, le Land et l'entreprise. Vérifiez-les auprès de l'établissement ou de l'employeur.",
    "ready.project.with": "Votre horizon de départ déclaré : {when}.", "ready.project.without": "Votre calendrier de départ reste à préciser.",
    "ready.mobility.yes": "Vous vous déclarez prêt(e) à déménager en Allemagne.", "ready.mobility.no": "Vous ne souhaitez pas déménager pour le moment.", "ready.mobility.other": "Votre mobilité reste à discuter.",
    "ready.visa": "Ce classement ne vérifie pas votre éligibilité au visa et ne garantit ni contrat de formation ni décision administrative.",
    "disclaimer": "Orientation indicative uniquement. Le score mesure une correspondance avec les préférences et compétences déclarées, pas une probabilité d'embauche ou de visa.",
    "edu.middle_school": "collège", "edu.secondary_no_bac": "lycée sans baccalauréat", "edu.baccalaureat": "baccalauréat", "edu.vocational": "formation professionnelle",
    "edu.bac2": "bac +2", "edu.licence": "licence", "edu.master": "master ou plus",
    "avail.soon": "dès que possible", "avail.3_6": "dans 3 à 6 mois", "avail.6_12": "dans 6 à 12 mois", "avail.later": "plus tard", "avail.exploring": "vous découvrez encore le projet",

    "next.title": "Et ensuite ?",
    "next.p": "Une formation en Allemagne suppose aussi un dossier de séjour solide. Préparez vos pièces avec CheckMyVisa, puis vérifiez les règles sur les sites officiels.",
    "next.visa": "Préparer mon dossier de visa", "next.guide": "Lire notre guide Ausbildung",
    "legal": "Les durées et descriptions du catalogue sont des données de travail à vérifier auprès des sources officielles avant publication. Les exigences peuvent varier selon la formation, l'employeur et le lieu. Le résultat ne prédit ni l'obtention d'un contrat ni celle d'un visa. Aucune de vos réponses n'est envoyée ni enregistrée."
  };

  const en = {
    "meta.title": "Ausbildung in Germany: find your occupation | CheckMyVisa",
    "meta.desc": "Answer a few questions to discover the Ausbildung occupations (dual vocational training in Germany) that match your interests and skills. Indicative guidance, free and without any personal document.",
    "meta.ogdesc": "A 3–4 minute questionnaire to discover the Ausbildung occupations that suit you.",

    "aria.crumbs": "Breadcrumb", "crumb.home": "Home", "crumb.sep": "›",
    "hero.eyebrow": "YOUR PROJECT · GERMANY",
    "hero.h1": "Find an Ausbildung that suits you.",
    "hero.p": "A few questions to discover the dual vocational training occupations in Germany that match your interests, your skills and the way you like to work.",
    "trust.free": "✓ Free", "trust.time": "✓ 3–4 minutes", "trust.nodoc": "✓ No personal documents",
    "loading": "Loading the catalogue…",
    "load.error": "The catalogue is temporarily unavailable. Check your connection and try again.",
    "aria.quiz": "Questionnaire", "aria.progress": "Progress", "aria.results": "Results",
    "step.n": "Step {n} of {total}",
    "btn.back": "Back", "btn.next": "Continue", "btn.finish": "See my results",
    "btn.restart": "Start over", "btn.print": "Print / save as PDF",

    "q.education.title": "Your education", "q.education.hint": "What is your highest level of education?",
    "o.education.middle_school": "Middle school", "o.education.secondary_no_bac": "High school without the baccalaureate", "o.education.baccalaureat": "Baccalaureate",
    "o.education.vocational": "Vocational training", "o.education.bac2": "Bac +2 (two-year degree)", "o.education.licence": "Bachelor's degree (Licence)", "o.education.master": "Master's or higher",
    "q.experience.title": "Your experience", "q.experience.hint": "What have you already done? Several answers possible.",
    "o.experience.professional": "Work experience", "o.experience.internship": "Internship", "o.experience.personal_projects": "Personal projects", "o.experience.none": "No experience",
    "q.german.title": "Your languages", "q.german.hint": "What is your current level of German?",
    "o.german.A0": "None", "o.german.A1": "A1 — beginner", "o.german.A2": "A2 — elementary", "o.german.B1": "B1 — intermediate", "o.german.B2": "B2 — upper intermediate", "o.german.C1": "C1 or higher",
    "q.interests.title": "Your interests", "q.interests.hint": "Choose one or more fields.",
    "o.interests.health": "Health and care for people", "o.interests.technology": "IT and technology", "o.interests.automotive": "Automotive and mechanics",
    "o.interests.electronics": "Electrical engineering and electronics", "o.interests.industry": "Industry and machinery", "o.interests.logistics": "Logistics and transport",
    "o.interests.hospitality": "Hospitality and tourism", "o.interests.cooking": "Cooking and gastronomy", "o.interests.sales": "Trade and sales",
    "o.interests.construction": "Installation and construction", "o.interests.helping_people": "Helping others", "o.interests.problem_solving": "Solving problems",
    "q.environment.title": "Your ideal environment", "q.environment.hint": "Where do you see yourself working?",
    "o.environment.office": "Office and computer", "o.environment.workshop": "Workshop and machines", "o.environment.hospital": "Hospital and care",
    "o.environment.hotel": "Hotel and reception", "o.environment.shop": "Shop and customer contact", "o.environment.warehouse": "Warehouse and logistics",
    "o.environment.construction_site": "Construction site and field work", "o.environment.factory": "Factory and production", "o.environment.open": "Open to several environments",
    "q.project.title": "Your Germany plan", "q.project.hint": "When do you want to start?",
    "o.project.soon": "As soon as possible", "o.project.3_6": "In 3 to 6 months", "o.project.6_12": "In 6 to 12 months", "o.project.later": "Later", "o.project.exploring": "I'm still exploring",

    "sk.title": "Which skills do you have?", "sk.hint": "You can select skills you have taught yourself.", "sk.aria": "Skills",
    "skill.logic": "Logic", "skill.analytical_thinking": "Analysis", "skill.programming": "Programming", "skill.troubleshooting": "Diagnosis and troubleshooting",
    "skill.mechanical_reasoning": "Mechanics", "skill.manual_precision": "Manual precision", "skill.communication": "Communication", "skill.organization": "Organization",
    "skill.teamwork": "Teamwork", "skill.empathy": "Listening and empathy", "skill.planning": "Planning", "skill.creativity": "Creativity",
    "skill.numeracy": "Numeracy", "skill.reliability": "Reliability", "skill.electrical_reasoning": "Electrical work", "skill.service_mindset": "Service mindset",
    "dm.title": "In which field(s) do you have experience?", "dm.hint": "Internship, job, practical training or personal project.", "dm.aria": "Fields of experience",
    "dom.it": "IT / web", "dom.automotive": "Automotive / mechanics", "dom.electrical": "Electrical / electronics", "dom.health": "Health / care",
    "dom.logistics": "Logistics / transport", "dom.hospitality": "Hospitality / tourism", "dom.retail": "Trade / sales", "dom.cooking": "Cooking / catering",
    "dom.construction": "Construction / installation", "dom.manufacturing": "Industry / manufacturing", "dom.social": "Social work / volunteering",
    "mob.title": "Are you ready to move to Germany?", "mob.yes": "Yes", "mob.no": "No", "mob.consider": "I still need to think about it",

    "res.eyebrow": "YOUR GUIDANCE", "res.title": "The occupations that suit you",
    "res.sub": "This ranking is a first orientation, not a promise of a job.",
    "res.none": "We do not have enough matching answers to offer a useful ranking. Start over and select at least one field, skill or environment.",
    "conf.label": "Ranking reliability: {v}", "conf.high": "high", "conf.medium": "medium", "conf.low": "low",
    "kind.dual": "Dual training", "kind.reg": "Regulated training",
    "reg.note": "This training falls under a regulatory framework separate from the standard dual Ausbildung: check its requirements with the competent official bodies.",
    "reason.empty": "Add skills or interests to refine this result.",
    "reason.skills": "Your skills match several skills useful in this occupation.",
    "reason.interests": "This field matches your interests.",
    "reason.environments": "The work environment matches your preferences.",
    "reason.experience": "Your experience or projects are relevant to this occupation.",

    "ready.title": "To prepare",
    "ready.german.unknown": "Your German level remains to be specified.",
    "ready.german.below_b1": "Plan to improve your German. The level required depends on the training, the institution and the residence procedure.",
    "ready.german.b1_plus": "Your declared level is B1 or higher; still check the requirements of the training and of the residence procedure.",
    "ready.school.with": "Declared level of education: {edu}. School requirements vary by occupation, Land and company; check them with the institution or the employer.",
    "ready.school.without": "School requirements vary by occupation, Land and company. Check them with the institution or the employer.",
    "ready.project.with": "Your declared departure horizon: {when}.", "ready.project.without": "Your departure timeline remains to be specified.",
    "ready.mobility.yes": "You say you are ready to move to Germany.", "ready.mobility.no": "You do not wish to move for now.", "ready.mobility.other": "Your mobility remains to be discussed.",
    "ready.visa": "This ranking does not check your visa eligibility and guarantees neither a training contract nor an administrative decision.",
    "disclaimer": "Indicative guidance only. The score measures a match with the declared preferences and skills, not a probability of being hired or getting a visa.",
    "edu.middle_school": "middle school", "edu.secondary_no_bac": "high school without the baccalaureate", "edu.baccalaureat": "baccalaureate", "edu.vocational": "vocational training",
    "edu.bac2": "bac +2 (two-year degree)", "edu.licence": "bachelor's degree", "edu.master": "master's or higher",
    "avail.soon": "as soon as possible", "avail.3_6": "in 3 to 6 months", "avail.6_12": "in 6 to 12 months", "avail.later": "later", "avail.exploring": "you are still exploring the project",

    "next.title": "What next?",
    "next.p": "Training in Germany also requires a solid residence application. Prepare your documents with CheckMyVisa, then check the rules on the official websites.",
    "next.visa": "Prepare my visa application", "next.guide": "Read our Ausbildung guide",
    "legal": "The durations and descriptions in the catalogue are working data to be checked against official sources before publication. Requirements may vary depending on the training, the employer and the location. The result predicts neither a training contract nor a visa. None of your answers is sent or saved."
  };

  const ar = {
    "meta.title": "التكوين المهني بالتناوب في ألمانيا (Ausbildung): اعثر على مهنتك | CheckMyVisa",
    "meta.desc": "أجب عن بضعة أسئلة لتكتشف مهن Ausbildung (التكوين المهني بالتناوب في ألمانيا) التي تناسب اهتماماتك ومهاراتك. توجيه إرشادي ومجاني ودون أي وثيقة شخصية.",
    "meta.ogdesc": "استبيان من 3 إلى 4 دقائق لتكتشف مهن Ausbildung التي تناسبك.",

    "aria.crumbs": "مسار التصفح", "crumb.home": "الرئيسية", "crumb.sep": "‹",
    "hero.eyebrow": "مشروعك · ألمانيا",
    "hero.h1": "اعثر على تكوين Ausbildung يناسبك.",
    "hero.p": "بضعة أسئلة لتكتشف مهن التكوين المهني بالتناوب في ألمانيا التي تناسب اهتماماتك ومهاراتك وطريقتك في العمل.",
    "trust.free": "✓ مجاني", "trust.time": "✓ 3–4 دقائق", "trust.nodoc": "✓ دون أي وثيقة شخصية",
    "loading": "جارٍ تحميل القائمة…",
    "load.error": "القائمة غير متاحة مؤقتاً. تحقّق من اتصالك ثم أعد المحاولة.",
    "aria.quiz": "الاستبيان", "aria.progress": "التقدّم", "aria.results": "النتائج",
    "step.n": "الخطوة {n} من {total}",
    "btn.back": "رجوع", "btn.next": "متابعة", "btn.finish": "عرض نتائجي",
    "btn.restart": "إعادة البدء", "btn.print": "طباعة / حفظ بصيغة PDF",

    "q.education.title": "مسارك الدراسي", "q.education.hint": "ما هو أعلى مستوى دراسي بلغته؟",
    "o.education.middle_school": "التعليم الإعدادي", "o.education.secondary_no_bac": "الثانوي دون شهادة الباكالوريا", "o.education.baccalaureat": "الباكالوريا",
    "o.education.vocational": "التكوين المهني", "o.education.bac2": "باكالوريا + سنتان", "o.education.licence": "الإجازة (ليسانس)", "o.education.master": "الماجستير أو أعلى",
    "q.experience.title": "خبرتك", "q.experience.hint": "ماذا سبق أن قمت به؟ يمكنك اختيار أكثر من إجابة.",
    "o.experience.professional": "خبرة مهنية", "o.experience.internship": "تدريب", "o.experience.personal_projects": "مشاريع شخصية", "o.experience.none": "لا توجد خبرة",
    "q.german.title": "لغاتك", "q.german.hint": "ما هو مستواك الحالي في اللغة الألمانية؟",
    "o.german.A0": "لا شيء", "o.german.A1": "A1 — مبتدئ", "o.german.A2": "A2 — أساسي", "o.german.B1": "B1 — متوسط", "o.german.B2": "B2 — فوق المتوسط", "o.german.C1": "C1 أو أعلى",
    "q.interests.title": "اهتماماتك", "q.interests.hint": "اختر مجالاً واحداً أو أكثر.",
    "o.interests.health": "الصحة ومساعدة الأشخاص", "o.interests.technology": "المعلوميات والتكنولوجيا", "o.interests.automotive": "السيارات والميكانيك",
    "o.interests.electronics": "الكهرباء والإلكترونيات", "o.interests.industry": "الصناعة والآلات", "o.interests.logistics": "اللوجستيك والنقل",
    "o.interests.hospitality": "الفندقة والسياحة", "o.interests.cooking": "الطبخ وفنون المطبخ", "o.interests.sales": "التجارة والبيع",
    "o.interests.construction": "التركيبات والبناء", "o.interests.helping_people": "مساعدة الآخرين", "o.interests.problem_solving": "حلّ المشكلات",
    "q.environment.title": "بيئة عملك المثالية", "q.environment.hint": "أين ترى نفسك تعمل؟",
    "o.environment.office": "مكتب وحاسوب", "o.environment.workshop": "ورشة وآلات", "o.environment.hospital": "مستشفى ورعاية",
    "o.environment.hotel": "فندق واستقبال", "o.environment.shop": "متجر والتعامل مع الزبائن", "o.environment.warehouse": "مستودع ولوجستيك",
    "o.environment.construction_site": "ورشة بناء وعمل ميداني", "o.environment.factory": "مصنع وإنتاج", "o.environment.open": "منفتح على بيئات متعددة",
    "q.project.title": "مشروعك في ألمانيا", "q.project.hint": "متى ترغب في البدء؟",
    "o.project.soon": "في أقرب وقت ممكن", "o.project.3_6": "خلال 3 إلى 6 أشهر", "o.project.6_12": "خلال 6 إلى 12 شهراً", "o.project.later": "لاحقاً", "o.project.exploring": "ما زلت أستكشف",

    "sk.title": "ما المهارات التي تمتلكها؟", "sk.hint": "يمكنك اختيار مهارات اكتسبتها بالتعلّم الذاتي.", "sk.aria": "المهارات",
    "skill.logic": "المنطق", "skill.analytical_thinking": "التحليل", "skill.programming": "البرمجة", "skill.troubleshooting": "التشخيص وحلّ الأعطال",
    "skill.mechanical_reasoning": "الميكانيك", "skill.manual_precision": "الدقة اليدوية", "skill.communication": "التواصل", "skill.organization": "التنظيم",
    "skill.teamwork": "العمل الجماعي", "skill.empathy": "الإصغاء والتعاطف", "skill.planning": "التخطيط", "skill.creativity": "الإبداع",
    "skill.numeracy": "الحساب", "skill.reliability": "الالتزام والموثوقية", "skill.electrical_reasoning": "الكهرباء", "skill.service_mindset": "روح الخدمة",
    "dm.title": "في أي مجال أو مجالات لديك خبرة؟", "dm.hint": "تدريب أو عمل أو تكوين تطبيقي أو مشروع شخصي.", "dm.aria": "مجالات الخبرة",
    "dom.it": "المعلوميات / الويب", "dom.automotive": "السيارات / الميكانيك", "dom.electrical": "الكهرباء / الإلكترونيات", "dom.health": "الصحة / الرعاية",
    "dom.logistics": "اللوجستيك / النقل", "dom.hospitality": "الفندقة / السياحة", "dom.retail": "التجارة / البيع", "dom.cooking": "الطبخ / المطاعم",
    "dom.construction": "البناء / التركيبات", "dom.manufacturing": "الصناعة / التصنيع", "dom.social": "العمل الاجتماعي / التطوع",
    "mob.title": "هل أنت مستعد للانتقال إلى ألمانيا؟", "mob.yes": "نعم", "mob.no": "لا", "mob.consider": "ما زلت بحاجة إلى التفكير",

    "res.eyebrow": "توجيهك", "res.title": "المهن التي تناسبك",
    "res.sub": "هذا الترتيب توجيه أولي وليس وعداً بالتوظيف.",
    "res.none": "ليست لدينا إجابات كافية متوافقة لاقتراح ترتيب مفيد. أعد البدء مع اختيار مجال أو مهارة أو بيئة واحدة على الأقل.",
    "conf.label": "موثوقية الترتيب: {v}", "conf.high": "مرتفعة", "conf.medium": "متوسطة", "conf.low": "ضعيفة",
    "kind.dual": "تكوين بالتناوب", "kind.reg": "تكوين منظَّم قانونياً",
    "reg.note": "يخضع هذا التكوين لإطار تنظيمي مختلف عن نظام Ausbildung المزدوج المعتاد: تحقّق من شروطه لدى الهيئات الرسمية المختصة.",
    "reason.empty": "أضف مهارات أو اهتمامات لتحسين دقة هذه النتيجة.",
    "reason.skills": "تتوافق مهاراتك مع عدة مهارات مفيدة في هذه المهنة.",
    "reason.interests": "يتوافق هذا المجال مع اهتماماتك.",
    "reason.environments": "بيئة العمل تتوافق مع تفضيلاتك.",
    "reason.experience": "خبرتك أو مشاريعك ذات صلة بهذه المهنة.",

    "ready.title": "ما يجب تحضيره",
    "ready.german.unknown": "ما زال مستواك في الألمانية بحاجة إلى تحديد.",
    "ready.german.below_b1": "خطّط لتحسين مستواك في الألمانية. يختلف المستوى المطلوب حسب التكوين والمؤسسة وإجراءات الإقامة.",
    "ready.german.b1_plus": "مستواك المصرَّح به B1 أو أعلى؛ ومع ذلك تحقّق من متطلبات التكوين وإجراءات الإقامة.",
    "ready.school.with": "المستوى الدراسي المصرَّح به: {edu}. تختلف الشروط الدراسية حسب المهنة والولاية الاتحادية (Land) والشركة؛ تحقّق منها لدى المؤسسة أو صاحب العمل.",
    "ready.school.without": "تختلف الشروط الدراسية حسب المهنة والولاية الاتحادية (Land) والشركة. تحقّق منها لدى المؤسسة أو صاحب العمل.",
    "ready.project.with": "أفق انطلاقك المصرَّح به: {when}.", "ready.project.without": "ما زال موعد انطلاقك بحاجة إلى تحديد.",
    "ready.mobility.yes": "صرّحت بأنك مستعد للانتقال إلى ألمانيا.", "ready.mobility.no": "لا ترغب في الانتقال حالياً.", "ready.mobility.other": "ما زالت مسألة تنقّلك محل نقاش.",
    "ready.visa": "لا يتحقق هذا الترتيب من أهليتك للتأشيرة ولا يضمن عقد تكوين ولا قراراً إدارياً.",
    "disclaimer": "توجيه إرشادي فقط. تقيس النتيجة مدى التوافق مع التفضيلات والمهارات المصرَّح بها، وليس احتمال التوظيف أو الحصول على التأشيرة.",
    "edu.middle_school": "التعليم الإعدادي", "edu.secondary_no_bac": "الثانوي دون شهادة الباكالوريا", "edu.baccalaureat": "الباكالوريا", "edu.vocational": "التكوين المهني",
    "edu.bac2": "باكالوريا + سنتان", "edu.licence": "الإجازة (ليسانس)", "edu.master": "الماجستير أو أعلى",
    "avail.soon": "في أقرب وقت ممكن", "avail.3_6": "خلال 3 إلى 6 أشهر", "avail.6_12": "خلال 6 إلى 12 شهراً", "avail.later": "لاحقاً", "avail.exploring": "ما زلت تستكشف المشروع",

    "next.title": "وماذا بعد؟",
    "next.p": "يتطلب التكوين في ألمانيا أيضاً ملف إقامة متيناً. حضّر وثائقك مع CheckMyVisa، ثم تحقّق من القواعد في المواقع الرسمية.",
    "next.visa": "حضّر ملف التأشيرة", "next.guide": "اقرأ دليلنا حول Ausbildung",
    "legal": "المدد والأوصاف الواردة في القائمة بيانات عمل ينبغي التحقق منها لدى المصادر الرسمية قبل النشر. قد تختلف المتطلبات حسب التكوين وصاحب العمل والمكان. ولا تتنبأ النتيجة بالحصول على عقد تكوين ولا على تأشيرة. لا يتم إرسال أي من إجاباتك ولا حفظها."
  };

  const DICT = { fr, en, ar };

  /* Durée en mois → texte (années et mois) avec les accords de chaque langue. */
  function arCount(n, one, two, few, many) {
    if (n === 1) return one;
    if (n === 2) return two;
    return n + " " + (n >= 3 && n <= 10 ? few : many);
  }
  function duration(months, lang) {
    const y = Math.floor(months / 12), m = months % 12;
    let years = "", mon = "", and = " et ";
    if (lang === "en") {
      and = " and ";
      years = y ? y + (y > 1 ? " years" : " year") : "";
      mon = m ? m + (m > 1 ? " months" : " month") : "";
    } else if (lang === "ar") {
      and = " و";
      years = y ? arCount(y, "سنة", "سنتان", "سنوات", "سنة") : "";
      mon = m ? arCount(m, "شهر", "شهران", "أشهر", "شهراً") : "";
    } else {
      years = y ? y + (y > 1 ? " ans" : " an") : "";
      mon = m ? m + " mois" : "";
    }
    return years && mon ? years + and + mon : (years || mon);
  }

  function make(lang) {
    const l = DICT[lang] ? lang : "fr", d = DICT[l];
    function t(key, vars) {
      let s = Object.prototype.hasOwnProperty.call(d, key) ? d[key] : fr[key];
      if (s === undefined) return key;
      if (vars) s = s.replace(/\{(\w+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(vars, k) ? String(vars[k]) : m));
      return s;
    }
    return { lang: l, dir: l === "ar" ? "rtl" : "ltr", t, duration: (months) => duration(months, l) };
  }

  /* Titre, description et aperçu de la page : traduits par le moteur du site (site-i18n.js). */
  if (root && root.SI && typeof root.SI.add === "function") {
    const k = {};
    k[fr["meta.title"]] = [en["meta.title"], ar["meta.title"]];
    k[fr["meta.desc"]] = [en["meta.desc"], ar["meta.desc"]];
    k[fr["meta.ogdesc"]] = [en["meta.ogdesc"], ar["meta.ogdesc"]];
    root.SI.add(k);
  }

  return Object.freeze({ dict: DICT, make, duration });
});
