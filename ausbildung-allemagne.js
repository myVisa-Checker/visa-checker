/* Page d'accueil Ausbildung : textes en allemand, anglais, français et arabe (arabe standard simplifié).
   Langue : ?lang=de|en|fr|ar, sinon la langue du site (window.SI.lang), sinon le français.
   Le HTML contient déjà le français (repli sans JavaScript) ; ce script remplace les éléments marqués data-t / data-alt. */
(function () {
  "use strict";
  var T = {
    fr: {
      "title": "Ausbildung en Allemagne : la formation en alternance | CheckMyVisa",
      "desc": "L'Ausbildung expliquée simplement : la formation professionnelle en alternance allemande, ses chiffres clés, et deux parcours : candidat ou entreprise.",
      "h1": "Ausbildung en Allemagne",
      "t.cand": "Je suis candidat", "t.ent": "Je suis entreprise",
      "intro.h": "Qu'est-ce que l'Ausbildung ?",
      "intro.p1": "L'Ausbildung est la formation professionnelle en alternance allemande, appelée aussi « système dual ». Vous apprenez un métier en entreprise et vous suivez des cours dans une école professionnelle (Berufsschule). Vous êtes à la fois salarié de l'entreprise et élève de l'école.",
      "intro.p2": "C'est une voie très répandue : environ la moitié des jeunes qui quittent l'école en Allemagne la choisissent, et le portail officiel deutschland.de la décrit comme reconnue dans le monde entier.",
      "fig1.b": "2 à 3,5 ans", "fig1.s": "de formation, selon le métier",
      "fig2.b": "300+", "fig2.s": "métiers de formation reconnus par l'État",
      "fig3.b": "1 jeune sur 2", "fig3.s": "choisit cette voie à la sortie de l'école",
      "fig4.b": "Rémunérée", "fig4.s": "vous recevez une indemnité de formation",
      "box1.h": "En entreprise", "box1.p": "Vous apprenez sur le terrain, avec un contrat de formation signé avec l'entreprise. L'indemnité de formation augmente chaque année et suit souvent la convention collective.",
      "box2.h": "À l'école professionnelle", "box2.p": "Vous suivez la théorie : un à deux jours par semaine, ou par blocs de plusieurs semaines, selon le métier.",
      "steps.h": "Les grandes étapes",
      "s1": "Choisir un métier : technique, santé, commerce, hôtellerie, artisanat… plus de 300 métiers sont reconnus.",
      "s2": "Trouver une entreprise formatrice et signer le contrat de formation.",
      "s3": "Se former pendant 2 à 3,5 ans : en entreprise et à l'école professionnelle.",
      "s4": "Passer l'examen final devant la chambre compétente (gratuit pour l'apprenti) et recevoir un certificat reconnu.",
      "cand.h": "Pour les candidats",
      "cand.p": "Explorez les métiers, consultez des fiches sourcées (durée, rémunération, conditions) et obtenez un classement indicatif selon votre profil.",
      "cand.b1": "Commencer le questionnaire", "cand.b2": "Lire le guide complet",
      "ent.h": "Pour les entreprises",
      "ent.p": "Vous souhaitez former un apprenti venu de l'étranger ? Voici ce qu'indique le portail officiel Make it in Germany :",
      "ent.l1": "Un apprenti hors UE a besoin d'un visa pour formation professionnelle ; il est accessible dès que l'entreprise s'est engagée fermement sur une place de formation.",
      "ent.l2": "Niveau d'allemand B1 (CECR) attendu ; la preuve peut être levée si l'entreprise confirme que les compétences linguistiques suffisent.",
      "ent.l3": "Un titre de séjour est nécessaire pour commencer la formation (hors UE) ; l'accord de l'Agence fédérale pour l'emploi peut être requis.",
      "ent.l4": "Un guide téléchargeable, « Recruiting International Trainees » (2026), détaille recrutement, visa, obligations légales et intégration.",
      "ent.note": "CheckMyVisa est un outil d'information : nous ne plaçons pas de candidats et ne garantissons ni contrat de formation ni visa.",
      "ent.b": "Nous contacter",
      "src.h": "Sources",
      "src1": "BIBB : le système dual", "src2": "deutschland.de : comment fonctionne la formation duale", "src3": "Make it in Germany : recruter des apprentis étrangers", "src4": "Make it in Germany : guide pour les employeurs (PDF, 2026)",
      "disc": "Informations indicatives, relues le 27/11/2026 sur les sources ci-dessus. Vérifiez toujours auprès des autorités compétentes avant toute démarche."
    },
    en: {
      "title": "Ausbildung in Germany: dual vocational training | CheckMyVisa",
      "desc": "Ausbildung explained simply: Germany's dual vocational training, key figures, and two paths: candidate or company.",
      "h1": "Ausbildung in Germany",
      "t.cand": "I am a candidate", "t.ent": "I am a company",
      "intro.h": "What is Ausbildung?",
      "intro.p1": "Ausbildung is Germany's dual vocational training, also called the “dual system”. You learn a trade at a company and attend classes at a vocational school (Berufsschule). You are both an employee of the company and a student at the school.",
      "intro.p2": "It is a very common path: around half of Germany's school leavers choose it, and the official portal deutschland.de describes it as recognised worldwide.",
      "fig1.b": "2 to 3.5 years", "fig1.s": "of training, depending on the occupation",
      "fig2.b": "300+", "fig2.s": "state-recognised training occupations",
      "fig3.b": "1 in 2", "fig3.s": "school leavers choose this path",
      "fig4.b": "Paid", "fig4.s": "you receive a training allowance",
      "box1.h": "At the company", "box1.p": "You learn on the job, with a training contract signed with the company. The training allowance rises each year and often follows the collective agreement.",
      "box2.h": "At vocational school", "box2.p": "You study the theory: one to two days a week, or in block periods of several weeks, depending on the occupation.",
      "steps.h": "The main steps",
      "s1": "Choose a trade: technical, health, retail, hospitality, crafts… more than 300 occupations are recognised.",
      "s2": "Find a training company and sign the training contract.",
      "s3": "Train for 2 to 3.5 years: at the company and at vocational school.",
      "s4": "Take the final exam before the competent chamber (free of charge for the trainee) and receive a recognised certificate.",
      "cand.h": "For candidates",
      "cand.p": "Explore the trades, read sourced fact sheets (duration, pay, requirements) and get an indicative ranking based on your profile.",
      "cand.b1": "Start the questionnaire", "cand.b2": "Read the full guide",
      "ent.h": "For companies",
      "ent.p": "Want to train an apprentice from abroad? Here is what the official Make it in Germany portal says:",
      "ent.l1": "A non-EU apprentice needs a vocational training visa; it is available once the company has made a binding commitment for a training place.",
      "ent.l2": "German at level B1 (CEFR) is expected; proof can be waived if the company confirms the language skills are sufficient.",
      "ent.l3": "A residence permit is needed to start training (non-EU); approval from the Federal Employment Agency may be required.",
      "ent.l4": "A downloadable guide, “Recruiting International Trainees” (2026), covers recruitment, visa, legal requirements and integration.",
      "ent.note": "CheckMyVisa is an information tool: we do not place candidates and we guarantee neither a training contract nor a visa.",
      "ent.b": "Contact us",
      "src.h": "Sources",
      "src1": "BIBB: the dual system", "src2": "deutschland.de: how dual vocational training works", "src3": "Make it in Germany: recruiting foreign apprentices", "src4": "Make it in Germany: guide for employers (PDF, 2026)",
      "disc": "Indicative information, re-read on 27/11/2026 against the sources above. Always check with the competent authorities before taking any step."
    },
    de: {
      "title": "Ausbildung in Deutschland: die duale Berufsausbildung | CheckMyVisa",
      "desc": "Die Ausbildung einfach erklärt: die duale Berufsausbildung in Deutschland, wichtige Zahlen und zwei Wege: Bewerber oder Unternehmen.",
      "h1": "Ausbildung in Deutschland",
      "t.cand": "Ich bin Bewerber/in", "t.ent": "Ich bin ein Unternehmen",
      "intro.h": "Was ist eine Ausbildung?",
      "intro.p1": "Die Ausbildung ist die duale Berufsausbildung in Deutschland. Sie lernen einen Beruf im Betrieb und besuchen den Unterricht in der Berufsschule. Sie sind zugleich Beschäftigte oder Beschäftigter des Betriebs und Schülerin oder Schüler der Berufsschule.",
      "intro.p2": "Es ist ein weit verbreiteter Weg: Rund die Hälfte der Schulabgänger in Deutschland entscheidet sich dafür, und das offizielle Portal deutschland.de beschreibt die Ausbildung als weltweit anerkannt.",
      "fig1.b": "2 bis 3,5 Jahre", "fig1.s": "Ausbildung, je nach Beruf",
      "fig2.b": "300+", "fig2.s": "staatlich anerkannte Ausbildungsberufe",
      "fig3.b": "Jeder Zweite", "fig3.s": "wählt nach der Schule diesen Weg",
      "fig4.b": "Vergütet", "fig4.s": "Sie erhalten eine Ausbildungsvergütung",
      "box1.h": "Im Betrieb", "box1.p": "Sie lernen in der Praxis, mit einem Ausbildungsvertrag mit dem Betrieb. Die Ausbildungsvergütung steigt jedes Jahr und richtet sich oft nach dem Tarifvertrag.",
      "box2.h": "In der Berufsschule", "box2.p": "Dort lernen Sie die Theorie: ein bis zwei Tage pro Woche oder in Blöcken von mehreren Wochen, je nach Beruf.",
      "steps.h": "Die wichtigsten Schritte",
      "s1": "Einen Beruf wählen: Technik, Gesundheit, Handel, Gastgewerbe, Handwerk … mehr als 300 Berufe sind anerkannt.",
      "s2": "Einen Ausbildungsbetrieb finden und den Ausbildungsvertrag unterschreiben.",
      "s3": "2 bis 3,5 Jahre lernen: im Betrieb und in der Berufsschule.",
      "s4": "Die Abschlussprüfung bei der zuständigen Kammer ablegen (für Auszubildende kostenlos) und ein anerkanntes Zeugnis erhalten.",
      "cand.h": "Für Bewerber",
      "cand.p": "Entdecken Sie Berufe, lesen Sie Berufsblätter mit Quellen (Dauer, Vergütung, Voraussetzungen) und erhalten Sie eine unverbindliche Rangliste passend zu Ihrem Profil.",
      "cand.b1": "Fragebogen starten", "cand.b2": "Ganzen Ratgeber lesen",
      "ent.h": "Für Unternehmen",
      "ent.p": "Sie möchten einen Auszubildenden aus dem Ausland ausbilden? Das sagt das offizielle Portal Make it in Germany:",
      "ent.l1": "Auszubildende aus Nicht-EU-Staaten brauchen ein Visum zur Berufsausbildung; es ist möglich, sobald der Betrieb verbindlich einen Ausbildungsplatz zugesagt hat.",
      "ent.l2": "Erwartet werden Deutschkenntnisse auf Niveau B1 (GER); der Nachweis kann entfallen, wenn der Betrieb bestätigt, dass die Sprachkenntnisse ausreichen.",
      "ent.l3": "Für den Ausbildungsbeginn ist ein Aufenthaltstitel nötig (Nicht-EU); die Zustimmung der Bundesagentur für Arbeit kann erforderlich sein.",
      "ent.l4": "Ein Leitfaden zum Herunterladen, „Recruiting International Trainees“ (2026), behandelt Anwerbung, Visum, rechtliche Vorgaben und Integration.",
      "ent.note": "CheckMyVisa ist ein Informationsangebot: Wir vermitteln keine Bewerber und garantieren weder einen Ausbildungsvertrag noch ein Visum.",
      "ent.b": "Kontakt aufnehmen",
      "src.h": "Quellen",
      "src1": "BIBB: das duale System", "src2": "deutschland.de: So funktioniert die duale Berufsausbildung", "src3": "Make it in Germany: ausländische Auszubildende gewinnen", "src4": "Make it in Germany: Leitfaden für Arbeitgeber (PDF, 2026)",
      "disc": "Unverbindliche Informationen, am 27.11.2026 anhand der obigen Quellen geprüft. Bitte klären Sie vor jedem Schritt die Angaben bei den zuständigen Behörden."
    },
    ar: {
      "title": "الأوسبيلدونغ في ألمانيا: التكوين المهني بالتناوب | CheckMyVisa",
      "desc": "شرح مبسّط للأوسبيلدونغ: التكوين المهني بالتناوب في ألمانيا وأهم الأرقام ومسارَان: مترشح أو شركة.",
      "h1": "الأوسبيلدونغ في ألمانيا",
      "t.cand": "أنا مترشّح", "t.ent": "أنا شركة",
      "intro.h": "ما هو الأوسبيلدونغ؟",
      "intro.p1": "الأوسبيلدونغ (Ausbildung) هو التكوين المهني بالتناوب في ألمانيا، ويسمى أيضاً «النظام المزدوج». تتعلم مهنة داخل الشركة وتتابع دروساً في مدرسة مهنية (Berufsschule). فأنت في الوقت نفسه موظف في الشركة وتلميذ في المدرسة.",
      "intro.p2": "وهو مسار شائع جداً: حوالي نصف الشباب الذين يغادرون المدرسة في ألمانيا يختارونه، وتصفه البوابة الرسمية deutschland.de بأنه معترف به في العالم كله.",
      "fig1.b": "من سنتين إلى 3.5 سنوات", "fig1.s": "مدة التكوين حسب المهنة",
      "fig2.b": "+300", "fig2.s": "مهنة تكوين معترف بها من الدولة",
      "fig3.b": "شاب من كل اثنين", "fig3.s": "يختار هذا المسار بعد المدرسة",
      "fig4.b": "بأجر", "fig4.s": "تتقاضى منحة تكوين من الشركة",
      "box1.h": "في الشركة", "box1.p": "تتعلم في الميدان بموجب عقد تكوين تبرمه مع الشركة. ترتفع منحة التكوين كل سنة وتتبع غالباً الاتفاقية الجماعية.",
      "box2.h": "في المدرسة المهنية", "box2.p": "تدرس الجانب النظري: يوماً أو يومين في الأسبوع، أو على فترات متواصلة من عدة أسابيع، حسب المهنة.",
      "steps.h": "المراحل الرئيسية",
      "s1": "اختيار مهنة: تقنية أو صحية أو تجارية أو فندقية أو حرفية… أكثر من 300 مهنة معترف بها.",
      "s2": "العثور على شركة مكوِّنة وتوقيع عقد التكوين.",
      "s3": "التكوين لمدة تتراوح بين سنتين و3.5 سنوات: في الشركة وفي المدرسة المهنية.",
      "s4": "اجتياز الامتحان النهائي أمام الغرفة المختصة (مجاني للمتكوّن) والحصول على شهادة معترف بها.",
      "cand.h": "للمترشحين",
      "cand.p": "اكتشف المهن، واطّلع على بطاقات موثّقة بالمصادر (المدة والأجر والشروط)، واحصل على ترتيب إرشادي حسب ملفك.",
      "cand.b1": "ابدأ الاستبيان", "cand.b2": "اقرأ الدليل الكامل",
      "ent.h": "للشركات",
      "ent.p": "هل تريد تكوين متدرّب قادم من الخارج؟ إليك ما تذكره البوابة الرسمية Make it in Germany:",
      "ent.l1": "يحتاج المتدرّب من خارج الاتحاد الأوروبي إلى تأشيرة للتكوين المهني، وتصبح متاحة بعد أن تلتزم الشركة التزاماً قاطعاً بمنحه مكاناً في التكوين.",
      "ent.l2": "يُنتظر مستوى B1 في الألمانية (الإطار الأوروبي المرجعي)؛ ويمكن الإعفاء من الإثبات إذا أكدت الشركة أن مهاراته اللغوية كافية.",
      "ent.l3": "يلزم تصريح إقامة لبدء التكوين (من خارج الاتحاد الأوروبي)، وقد تُطلب موافقة الوكالة الاتحادية للعمل.",
      "ent.l4": "يتوفر دليل قابل للتنزيل بعنوان «Recruiting International Trainees» (2026) يشرح الاستقطاب والتأشيرة والالتزامات القانونية والاندماج.",
      "ent.note": "CheckMyVisa أداة معلومات: نحن لا نوظّف المترشحين ولا نضمن عقد تكوين ولا تأشيرة.",
      "ent.b": "تواصل معنا",
      "src.h": "المصادر",
      "src1": "BIBB: النظام المزدوج", "src2": "deutschland.de: كيف يعمل التكوين المهني المزدوج", "src3": "Make it in Germany: استقطاب متدرّبين أجانب", "src4": "Make it in Germany: دليل أصحاب العمل (PDF، 2026)",
      "disc": "معلومات إرشادية، روجعت بتاريخ 27/11/2026 على المصادر أعلاه. تحقق دائماً لدى الجهات المختصة قبل أي إجراء."
    }
  };
  var LANGS = ["de", "en", "fr", "ar"], d = document, w = window;
  function pick() {
    var m = /[?&]lang=(de|en|fr|ar)\b/.exec(location.search || "");
    if (m) return m[1];
    return (w.SI && LANGS.indexOf(w.SI.lang) >= 0) ? w.SI.lang : "fr";
  }
  var lang = pick();
  function apply() {
    var dict = T[lang], main = d.getElementById("hub");
    main.setAttribute("lang", lang); main.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    [].forEach.call(d.querySelectorAll("[data-t]"), function (el) { var v = dict[el.getAttribute("data-t")]; if (v) el.textContent = v; });
    d.title = dict.title;
    var md = d.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", dict.desc);
    [].forEach.call(d.querySelectorAll(".lang4 button"), function (b) { b.setAttribute("aria-pressed", String(b.getAttribute("data-l") === lang)); });
  }
  /* Sélecteur DE / EN / FR / عربي : on recharge avec ?lang= pour que l'en-tête et le pied de page suivent aussi (FR, EN, AR). */
  [].forEach.call(d.querySelectorAll(".lang4 button"), function (b) {
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-l"); if (l === lang) return;
      if (w.SI && w.SI.remember && l !== "de") w.SI.remember(l);
      location.replace(location.pathname + "?lang=" + l + location.hash);
    });
  });
  w.AusHub = { T: T, lang: lang };
  apply();
})();
