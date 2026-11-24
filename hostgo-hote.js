/* Host & Go : demande d'inscription hôte, en deux étapes (FR/EN/AR).
   Pas de compte ni de mot de passe : la demande part par e-mail (route /contact du Worker) et rejoint la liste d'attente. Script externe (CSP). */
(function () {
  "use strict";
  var lang = (window.SI && SI.lang) || document.documentElement.lang || "fr";
  if (["fr", "en", "ar"].indexOf(lang) < 0) lang = "fr";
  var ENDPOINT = "https://visa-chat.rabehfly.workers.dev/contact", TO = "contact@checkmyvisa.org", SUBJECT = "Partenariat / Autre demande";
  var T = {
    fr: {
      backHome: "Retour à Host & Go", eyebrow: "DEVENEZ HÔTE HOST & GO", h1a: "Ouvrez votre porte.", h1b: "Partagez votre monde.",
      lead: "Accueillez des voyageurs, partagez votre culture et créez des rencontres enrichissantes.",
      countryQ: "Dans quel pays souhaitez-vous accueillir ?", pickCountry: "Choisissez votre pays", before: "AVANT DE CONTINUER", verify: "Vérifiez vos informations",
      accType: "Type de compte", accHost: "Hôte", yourCountry: "Votre pays", none: "Non sélectionné", confirm: "Je confirme que :",
      noAccount: "Les comptes ne sont pas encore ouverts : votre demande rejoint la liste d’attente et nous vous écrivons dès l’ouverture.",
      back: "← Retour", next: "Continuer →", eyebrow2: "VOS COORDONNÉES", h2: "Vos coordonnées",
      privacyLead: "Seul votre prénom pourra être affiché sur votre futur profil public. Vos coordonnées ne seront jamais affichées.",
      firstName: "Votre prénom", email: "Votre adresse e-mail", city: "Votre ville", about: "Parlez-nous de votre lieu d’accueil (facultatif)",
      termsPre: "J’ai lu et j’accepte les", termsLink: "conditions générales", termsMid: "et la", privLink: "politique de confidentialité",
      marketing: "J’accepte de recevoir des e-mails sur les nouveautés de Host & Go (facultatif).", send: "Envoyer ma demande",
      fPriv: "Confidentialité", fTerms: "Conditions", doneH: "Merci !",
      doneOk: "Votre demande est enregistrée. Nous vous écrivons dès l’ouverture.",
      doneFb: "L’envoi direct n’est pas disponible : votre messagerie s’ouvre avec le message prêt. Vous pouvez aussi écrire à ",
      roleNotice: "Cet e-mail est déjà enregistré ici comme compte Voyageur. Un compte Voyageur ne peut pas servir de compte Hôte : utilisez une autre adresse e-mail pour ce rôle. Votre demande a tout de même été envoyée.",
      progress: "Étape {n} sur {t}",
      eCountry: "Veuillez choisir votre pays.", eChecks: "Veuillez confirmer chaque déclaration pour continuer.",
      eFields: "Merci de renseigner votre prénom, une adresse e-mail valide et votre ville.", eTerms: "Vous devez accepter les conditions et la politique de confidentialité.",
      tipsT: "Quelques conseils :", min: "Écrivez au moins 20 caractères pour que les voyageurs puissent vous connaître.", chars: "caractères",
      eb_st2: "VOTRE LIEU", h_st2: "Décrivez votre lieu d’accueil", eb_st3: "L’AIDE SOUHAITÉE", h_st3: "Décrivez l’aide que vous souhaitez", eb_st4: "VOUS", h_st4: "Présentez-vous",
      tips: { st2: ["Décrivez le logement et l’espace proposé : chambre, environnement, ce qui est inclus.", "Dites ce que vous aimez dans votre région et pourquoi les voyageurs l’aimeront aussi.", "Précisez ce que vous offrez : repas, connexion, autres."], st3: ["Expliquez ce que le voyageur fera : tâches, heures par jour, jours par semaine.", "Dites si vous ferez les tâches ensemble et quelles compétences vous aimeriez partager ou apprendre.", "Soyez clair sur ce qui n’est pas attendu."], st4: ["Parlez de vous, de votre famille ou des personnes impliquées.", "Indiquez les langues que vous parlez.", "Écrivez avec vos propres mots : soyez vous-même."] },
      stepOf: "ÉTAPE {n} SUR {t}", eb_ty: "TYPES D’AIDE", h_ty: "Quelle aide souhaitez-vous ?", ty_lead: "Choisissez une ou plusieurs activités.", eTy: "Choisissez au moins un type d’aide.",
      eb_pl: "PLANNING", h_pl: "Précisez le planning", pl_hours: "Heures d’aide", pl_days: "Jours d’aide", pl_stay: "Séjour minimum",
      pl_tip: "Un échange équilibré : au maximum 4 à 5 heures par jour et 5 jours par semaine, avec 2 jours de repos.",
      types: ["Jardinage léger", "Aide à la ferme", "Soin des animaux", "Cuisine en famille", "Aide à la maison", "Enseignement et langues", "Accueil et tourisme", "Petits travaux et bricolage", "Informatique et internet", "Garde d’enfants et jeux", "Compagnie aux personnes âgées", "Garde de maison et d’animaux"],
      hours: ["Jusqu’à 2 h par jour", "3 à 4 h par jour", "Maximum 4 à 5 h par jour"], days: ["3 jours par semaine", "4 jours par semaine", "5 jours par semaine"],
      stays: ["Aucun minimum", "1 semaine ou moins", "Au moins 1 semaine", "Au moins 2 semaines", "Au moins 3 semaines", "Au moins 1 mois"],
      decls: ["Je suis intéressé(e) par l’échange culturel et je propose des possibilités d’apprentissage.", "Je peux fournir gratuitement un hébergement et, si proposé, des repas, sans frais pour le voyageur.", "Je respecte les lois et obligations applicables dans mon pays.", "Je ne suis pas une agence.", "Je ne me suis pas déjà inscrit(e) comme hôte sur Host & Go.", "Je rédigerai mon profil avec mes propres mots."],
      countries: ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"]
    },
    en: {
      backHome: "Back to Host & Go", eyebrow: "BECOME A HOST & GO HOST", h1a: "Open your door.", h1b: "Share your world.",
      lead: "Welcome travellers, share your culture and create meaningful encounters.",
      countryQ: "In which country would you like to host?", pickCountry: "Choose your country", before: "BEFORE YOU CONTINUE", verify: "Check your details",
      accType: "Account type", accHost: "Host", yourCountry: "Your country", none: "Not selected", confirm: "I confirm that:",
      noAccount: "Accounts are not open yet: your request joins the waiting list and we will write to you as soon as it opens.",
      back: "← Back", next: "Continue →", eyebrow2: "YOUR DETAILS", h2: "Your contact details",
      privacyLead: "Only your first name may be shown on your future public profile. Your contact details will never be displayed.",
      firstName: "Your first name", email: "Your e-mail address", city: "Your city", about: "Tell us about your place (optional)",
      termsPre: "I have read and accept the", termsLink: "terms and conditions", termsMid: "and the", privLink: "privacy policy",
      marketing: "I agree to receive e-mails about Host & Go news (optional).", send: "Send my request",
      fPriv: "Privacy", fTerms: "Terms", doneH: "Thank you!",
      doneOk: "Your request is in. We will write to you when it opens.",
      doneFb: "Direct sending is not available: your e-mail app opens with the message ready. You can also write to ",
      roleNotice: "This e-mail is already registered here as a Traveller account. A Traveller account cannot be used as a Host account: please use another e-mail address for this role. Your request has still been sent.",
      progress: "Step {n} of {t}",
      eCountry: "Please choose your country.", eChecks: "Please confirm every statement to continue.",
      eFields: "Please enter your first name, a valid e-mail address and your city.", eTerms: "You must accept the terms and the privacy policy.",
      tipsT: "Some tips:", min: "Please write at least 20 characters so travellers can get to know you.", chars: "characters",
      eb_st2: "YOUR PLACE", h_st2: "Describe your place", eb_st3: "THE HELP YOU’D LIKE", h_st3: "Describe the kind of help you’d like", eb_st4: "YOU", h_st4: "Introduce yourself",
      tips: { st2: ["Describe the accommodation and the space offered: room, surroundings, what is included.", "Say what you love about your area and why travellers will love it too.", "Be clear about what you offer: meals, internet, anything else."], st3: ["Explain what the traveller will do: tasks, hours per day, days per week.", "Say whether you will work side by side and which skills you would like to share or learn.", "Be clear about what is not expected."], st4: ["Tell us about yourself, your family or the people involved.", "Mention the languages you speak.", "Write in your own words: be yourself."] },
      stepOf: "STEP {n} OF {t}", eb_ty: "TYPES OF HELP", h_ty: "What kind of help would you like?", ty_lead: "Choose one or more activities.", eTy: "Please choose at least one type of help.",
      eb_pl: "SCHEDULE", h_pl: "Set the schedule", pl_hours: "Hours of help", pl_days: "Days of help", pl_stay: "Minimum stay",
      pl_tip: "A balanced exchange: at most 4–5 hours a day and 5 days a week, with 2 days off.",
      types: ["Light gardening", "Farm help", "Animal care", "Cooking family meals", "Help around the house", "Teaching and languages", "Hospitality and tourism", "Light DIY and repairs", "Computers and internet", "Childcare and play", "Companionship for the elderly", "House and pet sitting"],
      hours: ["Up to 2 hours a day", "3–4 hours a day", "Maximum 4–5 hours a day"], days: ["3 days a week", "4 days a week", "5 days a week"],
      stays: ["No minimum", "1 week or less", "At least 1 week", "At least 2 weeks", "At least 3 weeks", "At least 1 month"],
      decls: ["I am interested in cultural exchange and I offer learning opportunities.", "I can provide accommodation free of charge and, if offered, meals, at no cost to the traveller.", "I comply with the laws and obligations that apply in my country.", "I am not an agency.", "I have not already registered as a host on Host & Go.", "I will write my profile in my own words."],
      countries: ["Tunisia", "Morocco", "Algeria", "France", "Germany", "Italy", "Spain", "Portugal", "Belgium", "Netherlands", "Ireland", "Other"]
    },
    ar: {
      backHome: "العودة إلى Host & Go", eyebrow: "كن مضيفاً في Host & Go", h1a: "افتح بابك.", h1b: "شارك عالمك.",
      lead: "استقبل المسافرين وشاركهم ثقافتك وابنِ لقاءات غنية بالمعنى.",
      countryQ: "في أي بلد تودّ الاستضافة؟", pickCountry: "اختر بلدك", before: "قبل المتابعة", verify: "راجع معلوماتك",
      accType: "نوع الحساب", accHost: "مضيف", yourCountry: "بلدك", none: "لم يتم الاختيار", confirm: "أؤكد أنّ:",
      noAccount: "الحسابات لم تُفتح بعد: يُضاف طلبك إلى قائمة الانتظار وسنكتب إليك فور الافتتاح.",
      back: "رجوع →", next: "متابعة ←", eyebrow2: "بيانات التواصل", h2: "بيانات التواصل",
      privacyLead: "يمكن عرض اسمك الأول فقط في ملفك العام مستقبلاً. لن تُعرض بيانات التواصل أبداً.",
      firstName: "اسمك الأول", email: "بريدك الإلكتروني", city: "مدينتك", about: "حدّثنا عن مكان الاستضافة (اختياري)",
      termsPre: "قرأت وأوافق على", termsLink: "الشروط العامة", termsMid: "و", privLink: "سياسة الخصوصية",
      marketing: "أوافق على تلقي رسائل بريدية عن مستجدات Host & Go (اختياري).", send: "أرسل طلبي",
      fPriv: "الخصوصية", fTerms: "الشروط", doneH: "شكراً!",
      doneOk: "تم تسجيل طلبك. سنكتب إليك عند الافتتاح.",
      doneFb: "الإرسال المباشر غير متاح: سيُفتح تطبيق البريد والرسالة جاهزة. يمكنك أيضاً الكتابة إلى ",
      roleNotice: "هذا البريد مسجّل هنا كحساب مسافر. لا يمكن استخدام حساب المسافر كحساب مضيف: استخدم بريداً آخر لهذا الدور. وقد أُرسل طلبك مع ذلك.",
      progress: "الخطوة {n} من {t}",
      eCountry: "يرجى اختيار بلدك.", eChecks: "يرجى تأكيد كل إقرار للمتابعة.",
      eFields: "يرجى إدخال اسمك الأول وبريد إلكتروني صالح ومدينتك.", eTerms: "يجب قبول الشروط وسياسة الخصوصية.",
      tipsT: "بعض النصائح:", min: "اكتب 20 حرفاً على الأقل ليتعرّف عليك المسافرون.", chars: "حرفاً",
      eb_st2: "مكانك", h_st2: "صِف مكان الاستضافة", eb_st3: "المساعدة المطلوبة", h_st3: "صِف المساعدة التي تريدها", eb_st4: "أنت", h_st4: "قدّم نفسك",
      tips: { st2: ["صِف السكن والمساحة المعروضة: الغرفة والمحيط وما هو مشمول.", "قل ما تحبه في منطقتك ولماذا سيحبها المسافرون أيضاً.", "وضّح ما تقدّمه: وجبات أو إنترنت أو غير ذلك."], st3: ["اشرح ما سيقوم به المسافر: المهام وساعات العمل يومياً وأيامه أسبوعياً.", "قل إن كنتما ستعملان معاً وما المهارات التي تودّ تبادلها أو تعلّمها.", "وضّح ما لا يُنتظر من المسافر."], st4: ["حدّثنا عن نفسك وعن عائلتك أو الأشخاص المعنيين.", "اذكر اللغات التي تتحدثها.", "اكتب بكلماتك الخاصة: كن على طبيعتك."] },
      stepOf: "الخطوة {n} من {t}", eb_ty: "أنواع المساعدة", h_ty: "ما نوع المساعدة التي تريدها؟", ty_lead: "اختر نشاطاً واحداً أو أكثر.", eTy: "يرجى اختيار نوع واحد على الأقل.",
      eb_pl: "الجدول", h_pl: "حدّد الجدول", pl_hours: "ساعات المساعدة", pl_days: "أيام المساعدة", pl_stay: "الحد الأدنى للإقامة",
      pl_tip: "تبادل متوازن: بحدّ أقصى 4 إلى 5 ساعات يومياً و5 أيام أسبوعياً، مع يومين للراحة.",
      types: ["بستنة خفيفة", "مساعدة في المزرعة", "العناية بالحيوانات", "إعداد وجبات العائلة", "مساعدة في المنزل", "التعليم واللغات", "الضيافة والسياحة", "أعمال صيانة وإصلاح خفيفة", "الحاسوب والإنترنت", "رعاية الأطفال واللعب", "مرافقة كبار السن", "حراسة المنزل والحيوانات"],
      hours: ["حتى ساعتين يومياً", "من 3 إلى 4 ساعات يومياً", "بحد أقصى 4 إلى 5 ساعات يومياً"], days: ["3 أيام أسبوعياً", "4 أيام أسبوعياً", "5 أيام أسبوعياً"],
      stays: ["بلا حد أدنى", "أسبوع أو أقل", "أسبوع على الأقل", "أسبوعان على الأقل", "3 أسابيع على الأقل", "شهر على الأقل"],
      decls: ["أهتم بالتبادل الثقافي وأوفّر فرصاً للتعلّم.", "يمكنني توفير الإقامة مجاناً، والوجبات إن عُرضت، دون أي تكلفة على المسافر.", "ألتزم بالقوانين والالتزامات المعمول بها في بلدي.", "لست وكالة.", "لم أسجّل سابقاً كمضيف على Host & Go.", "سأكتب ملفي الشخصي بكلماتي الخاصة."],
      countries: ["تونس", "المغرب", "الجزائر", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "البرتغال", "بلجيكا", "هولندا", "إيرلندا", "أخرى"]
    }
  }[lang];

  var X = {
    fr: {
      eb_ac: "VOTRE HÉBERGEMENT", h_ac: "Décrivez l’hébergement que vous proposez", eb_cx: "ÉCHANGE CULTUREL", h_cx: "Décrivez l’échange culturel possible chez vous", eb_oi: "INFORMATIONS UTILES", h_oi: "Ajoutez toute autre information utile aux voyageurs (facultatif)",
      tips: { ac: ["Assurez-vous de proposer un endroit propre et sûr pour dormir.", "Si c’est du camping, prévoyez la tente et la literie.", "C’est le bon endroit pour expliquer comment les repas fonctionnent."], cx: ["Des activités où les voyageurs rencontrent votre famille, votre équipe et les habitants.", "Les compétences et connaissances que vous pouvez partager.", "Ce que vous espérez apprendre en accueillant des personnes d’autres cultures."], oi: ["Idées de sorties pendant le temps libre et transports autour de chez vous.", "Ce qu’ils doivent savoir sur votre mode de vie ou les règles de la maison.", "N’ajoutez PAS de site web, d’e-mail ni de numéro de téléphone ici."] },
      eb_av: "DISPONIBILITÉS", h_av: "Indiquez vos disponibilités", lead_av: "Touchez un mois pour changer son état. Ce champ est facultatif.", prevYear: "Année précédente", nextYear: "Année suivante", calHelp: "Mois de l’année",
      months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
      states: ["Non précisé", "Voyageurs recherchés : demandes très bienvenues", "Disponibilité partielle", "Pas de disponibilité"],
      eb_lg: "LANGUES", h_lg: "Parlez des langues que vous parlez ou apprenez", lead_lg: "Facultatif.", addLang: "+ Ajouter une langue", lxOn: "Oui, je souhaite être présenté(e) comme hôte intéressé(e) par l’échange linguistique.", lxNote: "Autre chose à dire sur l’échange linguistique ? (facultatif)", langLbl: "Langue", levelLbl: "Niveau", rmLang: "Retirer cette langue",
      langs: ["Arabe", "Français", "Anglais", "Allemand", "Italien", "Espagnol", "Portugais", "Turc", "Russe", "Autre"], levels: ["Débutant", "Intermédiaire", "Courant", "Langue maternelle"],
      eb_am: "ÉQUIPEMENTS", h_am: "Cochez ce qui s’applique à vous et à votre lieu", lead_am: "Facultatif.", amH: "Votre lieu", trH: "Pouvez-vous accueillir ces types de voyageurs ?",
      amen: ["Accès à internet", "Animaux à la maison", "Fumeurs", "Internet limité"], trav: ["Nomades numériques", "Familles", "Campeurs / camping-cars", "Voyageurs avec animaux"],
      eb_ad: "ADRESSE", h_ad: "Indiquez l’adresse où vous accueillerez", addrL: "Adresse (rue et numéro)", zipL: "Code postal (facultatif)", ad_tip: "Votre adresse exacte ne sera jamais affichée en ligne : seule notre équipe la voit pour vérifier votre demande.", eAddr: "Merci d’indiquer l’adresse où vous accueillerez.",
      pvL: "Message privé pour l’équipe (facultatif)"
    },
    en: {
      eb_ac: "YOUR ACCOMMODATION", h_ac: "Describe the accommodation you offer", eb_cx: "CULTURAL EXCHANGE", h_cx: "Describe the cultural exchange available at your place", eb_oi: "USEFUL INFORMATION", h_oi: "Add any other relevant information for travellers (optional)",
      tips: { ac: ["Make sure you can provide a clean and secure place to sleep.", "If camping, you will need to provide tents and bedding.", "This is a good place to explain how meals will work."], cx: ["Social activities where travellers can meet your family, your team and the local community.", "The skills and knowledge you can share.", "What you hope to learn by hosting people from different cultures."], oi: ["Ideas for what they can do in their time off and transport around your area.", "Anything they should know about how you live or your house rules.", "Please do NOT add a website, e-mail or phone number here."] },
      eb_av: "AVAILABILITY", h_av: "Set your availability", lead_av: "Tap a month to change its status. This is optional.", prevYear: "Previous year", nextYear: "Next year", calHelp: "Months of the year",
      months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
      states: ["Not specified", "Travellers needed: enquiries very welcome", "Partial availability", "No availability"],
      eb_lg: "LANGUAGES", h_lg: "Tell us about the languages you speak or are learning", lead_lg: "Optional.", addLang: "+ Add a language", lxOn: "Yes, please show me as a host interested in language exchange.", lxNote: "More to say about the language exchange? (optional)", langLbl: "Language", levelLbl: "Level", rmLang: "Remove this language",
      langs: ["Arabic", "French", "English", "German", "Italian", "Spanish", "Portuguese", "Turkish", "Russian", "Other"], levels: ["Beginner", "Intermediate", "Fluent", "Native"],
      eb_am: "FACILITIES", h_am: "Select those that apply to you and your place", lead_am: "Optional.", amH: "Your place", trH: "Are you able to accept these types of traveller?",
      amen: ["Internet access", "Pets/animals at home", "Smokers", "Limited internet"], trav: ["Digital nomads", "Families", "Campers/motorhomes", "Travelling with pets"],
      eb_ad: "ADDRESS", h_ad: "Enter the address where you’ll be hosting", addrL: "Address (street and house/flat number)", zipL: "Postal code (optional)", ad_tip: "Your exact address will never be shown online: only our team sees it to check your request.", eAddr: "Please enter the address where you will host.",
      pvL: "Private message for the team (optional)"
    },
    ar: {
      eb_ac: "مكان الإقامة", h_ac: "صِف مكان الإقامة الذي تعرضه", eb_cx: "التبادل الثقافي", h_cx: "صِف التبادل الثقافي المتاح عندك", eb_oi: "معلومات مفيدة", h_oi: "أضف أي معلومات أخرى مفيدة للمسافرين (اختياري)",
      tips: { ac: ["تأكد من توفير مكان نظيف وآمن للنوم.", "إن كان التخييم فعليك توفير الخيمة والفراش.", "هذا مكان مناسب لشرح كيفية تدبير الوجبات."], cx: ["أنشطة اجتماعية يلتقي فيها المسافرون بعائلتك وفريقك وأهل المنطقة.", "المهارات والمعارف التي يمكنك مشاركتها.", "ما تأمل تعلّمه باستضافة أشخاص من ثقافات مختلفة."], oi: ["أفكار لما يمكنهم فعله في وقت فراغهم ووسائل النقل حول منطقتك.", "ما ينبغي أن يعرفوه عن أسلوب حياتك أو قواعد المنزل.", "لا تضف موقعاً إلكترونياً أو بريداً أو رقم هاتف هنا."] },
      eb_av: "التوفر", h_av: "حدّد أوقات توفرك", lead_av: "المس شهراً لتغيير حالته. هذا الحقل اختياري.", prevYear: "السنة السابقة", nextYear: "السنة التالية", calHelp: "أشهر السنة",
      months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
      states: ["غير محدد", "المسافرون مطلوبون: الطلبات مرحَّب بها جداً", "توفر جزئي", "لا يوجد توفر"],
      eb_lg: "اللغات", h_lg: "حدّثنا عن اللغات التي تتحدثها أو تتعلمها", lead_lg: "اختياري.", addLang: "+ إضافة لغة", lxOn: "نعم، أودّ الظهور كمضيف مهتم بتبادل اللغات.", lxNote: "هل من شيء آخر عن تبادل اللغات؟ (اختياري)", langLbl: "اللغة", levelLbl: "المستوى", rmLang: "إزالة هذه اللغة",
      langs: ["العربية", "الفرنسية", "الإنجليزية", "الألمانية", "الإيطالية", "الإسبانية", "البرتغالية", "التركية", "الروسية", "أخرى"], levels: ["مبتدئ", "متوسط", "طليق", "لغة أم"],
      eb_am: "المرافق", h_am: "حدّد ما ينطبق عليك وعلى مكانك", lead_am: "اختياري.", amH: "مكانك", trH: "هل يمكنك استقبال هذه الفئات من المسافرين؟",
      amen: ["الإنترنت", "حيوانات في المنزل", "مدخّنون", "إنترنت محدود"], trav: ["الرحّالة الرقميون", "العائلات", "المخيّمون / المنازل المتنقلة", "مسافرون مع حيواناتهم"],
      eb_ad: "العنوان", h_ad: "أدخل العنوان الذي ستستضيف فيه", addrL: "العنوان (الشارع والرقم)", zipL: "الرمز البريدي (اختياري)", ad_tip: "لن يُعرض عنوانك الدقيق على الإنترنت أبداً: فريقنا وحده يراه للتحقق من طلبك.", eAddr: "يرجى إدخال العنوان الذي ستستضيف فيه.",
      pvL: "رسالة خاصة للفريق (اختياري)"
    }
  }[lang];
  Object.keys(X).forEach(function (k) { if (k === "tips") Object.keys(X.tips).forEach(function (t) { T.tips[t] = X.tips[t]; }); else T[k] = X[k]; });
  var SHORT = { fr: ["Janv", "Févr", "Mars", "Avr", "Mai", "Juin", "Juil", "Août", "Sept", "Oct", "Nov", "Déc"], en: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], ar: [] }[lang];
  var MONTHS_FR = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"], STATES_FR = ["", "Besoin", "Partiel", "Indisponible"];
  var LANGS_FR = ["Arabe", "Français", "Anglais", "Allemand", "Italien", "Espagnol", "Portugais", "Turc", "Russe", "Autre"], LEVELS_FR = ["Débutant", "Intermédiaire", "Courant", "Langue maternelle"];
  var AMEN_FR = ["Accès à internet", "Animaux à la maison", "Fumeurs", "Internet limité"], TRAV_FR = ["Nomades numériques", "Familles", "Campeurs / camping-cars", "Voyageurs avec animaux"];
  var COUNTRIES_FR = ["Tunisie", "Maroc", "Algérie", "France", "Allemagne", "Italie", "Espagne", "Portugal", "Belgique", "Pays-Bas", "Irlande", "Autre"];
  function $(id) { return document.getElementById(id); }
  var IDS = ["st1", "st2", "ac", "ty", "pl", "av", "st3", "cx", "lg", "st4", "am", "ad", "oi", "st5"], TXT = ["st2", "ac", "st3", "cx", "st4", "oi"], REQ = ["st2", "ac", "st3", "cx", "st4"], LAST = IDS.length - 1, done = $("done"), country = $("country"), MIN = 20, cur = 0;
  var HOURS_FR = ["Jusqu'à 2 h par jour", "3 à 4 h par jour", "Maximum 4 à 5 h par jour"], DAYS_FR = ["3 jours par semaine", "4 jours par semaine", "5 jours par semaine"], STAYS_FR = ["Aucun minimum", "1 semaine ou moins", "Au moins 1 semaine", "Au moins 2 semaines", "Au moins 3 semaines", "Au moins 1 mois"];
  var TYPES_FR = ["Jardinage léger", "Aide à la ferme", "Soin des animaux", "Cuisine en famille", "Aide à la maison", "Enseignement et langues", "Accueil et tourisme", "Petits travaux et bricolage", "Informatique et internet", "Garde d'enfants et jeux", "Compagnie aux personnes âgées", "Garde de maison et d'animaux"];
  if (!done || !country || IDS.some(function (i) { return !$(i); })) return;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i]").forEach(function (el) { var k = el.getAttribute("data-i"); if (T[k] != null) el.textContent = T[k]; });
  document.title = "Host & Go — " + ({ fr: "Devenir hôte", en: "Become a host", ar: "كن مضيفاً" }[lang]);
  var EB = { st2: T.eb_st2, ac: T.eb_ac, ty: T.eb_ty, pl: T.eb_pl, av: T.eb_av, st3: T.eb_st3, cx: T.eb_cx, lg: T.eb_lg, st4: T.eb_st4, am: T.eb_am, ad: T.eb_ad, oi: T.eb_oi, st5: T.eyebrow2 };
  Object.keys(EB).forEach(function (id) {
    var e = $(id).querySelector(".hgh-eyebrow"); if (e) e.textContent = T.stepOf.replace("{n}", IDS.indexOf(id) + 1).replace("{t}", IDS.length) + " · " + EB[id];
  });

  var ph = document.createElement("option"); ph.value = ""; ph.textContent = T.pickCountry; country.appendChild(ph);
  T.countries.forEach(function (n, i) { var o = document.createElement("option"); o.value = COUNTRIES_FR[i]; o.textContent = n; country.appendChild(o); });
  var decls = $("decls");
  T.decls.forEach(function (txt) {
    var l = document.createElement("label"), c = document.createElement("input"), s = document.createElement("span");
    c.type = "checkbox"; c.className = "required-check"; s.textContent = txt; l.appendChild(c); l.appendChild(s); decls.appendChild(l);
  });
  var typesBox = $("types");
  T.types.forEach(function (txt, i) {
    var l = document.createElement("label"), c = document.createElement("input"), s = document.createElement("span");
    l.className = "hgh-type"; c.type = "checkbox"; c.value = String(i); c.addEventListener("change", function () { l.classList.toggle("on", c.checked); }); s.textContent = txt; l.appendChild(c); l.appendChild(s); typesBox.appendChild(l);
  });
  function fillSel(id, list, def) { var el = $(id); list.forEach(function (t, i) { var o = document.createElement("option"); o.value = String(i); o.textContent = t; el.appendChild(o); }); el.selectedIndex = def; }
  fillSel("pl-hours", T.hours, 2); fillSel("pl-days", T.days, 2); fillSel("pl-stay", T.stays, 0);
  TXT.forEach(function (id) {
    var ul = $("tl-" + id); T.tips[id].forEach(function (x, i, a) { var li = document.createElement("li"); li.textContent = x; if (id === "oi" && i === a.length - 1) li.style.fontWeight = "800"; ul.appendChild(li); });
    var ta = $("ta-" + id), ct = $("ct-" + id);
    function upd() { ct.textContent = ta.value.length + " / " + ta.maxLength + " " + T.chars; } ta.addEventListener("input", upd); upd();
  });

  /* Calendrier : 4 états par mois (non précisé, besoin, partiel, indisponible), pour l'année en cours et la suivante */
  var Y0 = new Date().getFullYear(), year = Y0, cal = {}, SYM = ["", "✓", "~", "✕"];
  $("yr-prev").setAttribute("aria-label", T.prevYear); $("yr-next").setAttribute("aria-label", T.nextYear); $("months").setAttribute("aria-label", T.calHelp);
  function monthLabel(b, m, y) { return T.months[m] + " " + y + " : " + T.states[(cal[y] && cal[y][m]) || 0]; }
  function drawCal() {
    $("yr-lbl").textContent = year; $("yr-prev").disabled = year <= Y0; $("yr-next").disabled = year >= Y0 + 1;
    var box = $("months"); box.innerHTML = "";
    T.months.forEach(function (name, m) {
      var st = (cal[year] && cal[year][m]) || 0, b = document.createElement("button");
      b.type = "button"; b.className = "hgh-mo m" + st; b.setAttribute("aria-label", monthLabel(b, m, year));
      b.innerHTML = '<span class="mn"></span><span class="ms" aria-hidden="true"></span>'; b.firstChild.textContent = SHORT[m] || name; b.lastChild.textContent = SYM[st];
      b.addEventListener("click", function () { cal[year] = cal[year] || {}; cal[year][m] = ((cal[year][m] || 0) + 1) % 4; drawCal(); var again = $("months").children[m]; if (again) again.focus(); });
      box.appendChild(b);
    });
  }
  $("yr-prev").addEventListener("click", function () { if (year > Y0) { year--; drawCal(); } });
  $("yr-next").addEventListener("click", function () { if (year < Y0 + 1) { year++; drawCal(); } });
  var lg = $("legend");
  [1, 2, 3].forEach(function (i) { var li = document.createElement("li"); li.innerHTML = '<i class="sw m' + i + '" aria-hidden="true"></i><span></span>'; li.lastChild.textContent = SYM[i] + " " + T.states[i]; lg.appendChild(li); });
  drawCal();

  /* Langues : lignes ajoutables (langue + niveau) */
  var langsBox = $("langs");
  function addLang() {
    var row = document.createElement("div"), n = langsBox.children.length + 1; row.className = "hgh-lrow";
    function sel(label, list, idp) {
      var w = document.createElement("div"), l = document.createElement("label"), s = document.createElement("select"); l.className = "hgh-label"; l.textContent = label; l.htmlFor = idp + n; s.id = idp + n;
      list.forEach(function (t, i) { var o = document.createElement("option"); o.value = String(i); o.textContent = t; s.appendChild(o); }); w.appendChild(l); w.appendChild(s); return w;
    }
    row.appendChild(sel(T.langLbl, T.langs, "lg-l")); var lv = sel(T.levelLbl, T.levels, "lg-v"); lv.lastChild.selectedIndex = 2; row.appendChild(lv);
    var rm = document.createElement("button"); rm.type = "button"; rm.className = "hgh-rm"; rm.textContent = "✕"; rm.setAttribute("aria-label", T.rmLang);
    rm.addEventListener("click", function () { row.remove(); $("add-lang").focus(); }); row.appendChild(rm); langsBox.appendChild(row); row.querySelector("select").focus();
  }
  $("add-lang").addEventListener("click", addLang);

  /* Équipements et voyageurs acceptés : cartes à cocher */
  function cards(boxId, list) {
    var box = $(boxId);
    list.forEach(function (txt, i) {
      var l = document.createElement("label"), c = document.createElement("input"), s = document.createElement("span");
      l.className = "hgh-type"; c.type = "checkbox"; c.value = String(i); c.addEventListener("change", function () { l.classList.toggle("on", c.checked); }); s.textContent = txt; l.appendChild(c); l.appendChild(s); box.appendChild(l);
    });
  }
  cards("amen", T.amen); cards("trav", T.trav);
  function picked(boxId, fr) { return [].slice.call($(boxId).querySelectorAll("input:checked")).map(function (c) { return fr[+c.value]; }).join(", "); }
  function calText() {
    var out = [];
    Object.keys(cal).sort().forEach(function (y) {
      [1, 2, 3].forEach(function (st) {
        var ms = []; for (var m = 0; m < 12; m++) if (cal[y][m] === st) ms.push(MONTHS_FR[m]);
        if (ms.length) out.push(y + " — " + STATES_FR[st] + " : " + ms.join(", "));
      });
    });
    return out.join(" | ");
  }
  function langText() {
    var out = [].slice.call(langsBox.children).map(function (r) { var sl = r.querySelectorAll("select"); return LANGS_FR[+sl[0].value] + " (" + LEVELS_FR[+sl[1].value] + ")"; });
    return out.join(", ");
  }
  function sum() { var o = country.options[country.selectedIndex]; $("countrySummary").textContent = country.value ? o.textContent : T.none; }
  country.addEventListener("change", sum); sum();

  var bar = $("hgh-progress");
  IDS.forEach(function () { bar.appendChild(document.createElement("span")); });
  var bars = [].slice.call(bar.children);
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function show(n, focus) {
    cur = n;
    IDS.forEach(function (id, i) { $(id).hidden = i !== n; });
    done.hidden = n !== IDS.length;
    bars.forEach(function (b, i) { b.className = i <= Math.min(n, LAST) ? "on" : ""; });
    bar.setAttribute("aria-label", T.progress.replace("{n}", Math.min(n, LAST) + 1).replace("{t}", IDS.length));
    bar.hidden = n === IDS.length;
    if (focus === false) return;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    var h = n === IDS.length ? done : $("h-" + IDS[n]); if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
  }
  show(0, false);
  function err(id, msg, el) { $(id).textContent = msg; if (el) el.focus(); return false; }

  var validators = {
    st1: function () {
      if (!country.value) return err("error1", T.eCountry, country);
      var miss = [].slice.call(document.querySelectorAll(".required-check")).filter(function (c) { return !c.checked; })[0];
      if (miss) return err("error1", T.eChecks, miss);
      $("error1").textContent = ""; return true;
    },
    ty: function () {
      var any = typesBox.querySelector("input:checked");
      if (!any) return err("err-ty", T.eTy, typesBox.querySelector("input"));
      $("err-ty").textContent = ""; return true;
    }
  };
  validators.ad = function () { var a = $("addr"); if (a.value.trim().length < 5) return err("err-ad", T.eAddr, a); $("err-ad").textContent = ""; return true; };
  REQ.forEach(function (id) {
    validators[id] = function () { var ta = $("ta-" + id); if (ta.value.trim().length < MIN) return err("err-" + id, T.min, ta); $("err-" + id).textContent = ""; return true; };
  });
  document.querySelectorAll("[data-go]").forEach(function (b) {
    b.addEventListener("click", function () {
      if (b.getAttribute("data-go") === "prev") { if (cur > 0) show(cur - 1); return; }
      var v = validators[IDS[cur]];
      if (cur < LAST && (!v || v())) show(cur + 1);
    });
  });

  function fallback(msg, name, mail) {
    $("doneMsg").textContent = T.doneFb + TO + "."; show(IDS.length);
    window.location.href = "mailto:" + TO + "?subject=" + encodeURIComponent("[Host & Go] Inscription hôte") + "&body=" + encodeURIComponent(msg + "\n\n--\n" + name + "\n" + mail);
  }
  $("finish").addEventListener("click", function () {
    var name = $("firstName").value.trim(), mail = $("email").value.trim(), city = $("city").value.trim(), okMail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail);
    if (!name || !city || !okMail) return err("error2", T.eFields, !name ? $("firstName") : !okMail ? $("email") : $("city"));
    if (!$("terms").checked) return err("error2", T.eTerms, $("terms"));
    $("error2").textContent = "";
    var types = [].slice.call(typesBox.querySelectorAll("input:checked")).map(function (c) { return TYPES_FR[+c.value]; }).join(", ");
    var lines = ["[Host & Go — inscription hôte]", "Pays d'accueil : " + country.value, "Ville : " + city, "Déclarations : 6/6 confirmées", "E-mails d'information : " + ($("marketing").checked ? "oui" : "non"), "Langue de la page : " + lang, "",
      "TYPES D'AIDE : " + types, "HEURES : " + HOURS_FR[+$("pl-hours").value], "JOURS : " + DAYS_FR[+$("pl-days").value], "SÉJOUR MINIMUM : " + STAYS_FR[+$("pl-stay").value],
      "DISPONIBILITÉS : " + (calText() || "non précisées"), "LANGUES : " + (langText() || "non précisées") + " | Échange linguistique : " + ($("lx-on").checked ? "oui" : "non") + ($("lx-note").value.trim() ? " | " + $("lx-note").value.trim() : ""),
      "ÉQUIPEMENTS : " + (picked("amen", AMEN_FR) || "aucun"), "VOYAGEURS ACCEPTÉS : " + (picked("trav", TRAV_FR) || "non précisé"), "ADRESSE : " + $("addr").value.trim() + ($("zip").value.trim() ? ", " + $("zip").value.trim() : ""), "",
      "LIEU D'ACCUEIL :", $("ta-st2").value.trim(), "", "HÉBERGEMENT :", $("ta-ac").value.trim(), "", "AIDE SOUHAITÉE :", $("ta-st3").value.trim(), "", "ÉCHANGE CULTUREL :", $("ta-cx").value.trim(), "", "PRÉSENTATION :", $("ta-st4").value.trim()];
    if ($("ta-oi").value.trim()) lines.push("", "INFOS UTILES :", $("ta-oi").value.trim());
    if ($("pv").value.trim()) lines.push("", "NOTE PRIVÉE POUR L'ÉQUIPE :", $("pv").value.trim());
    var msg = lines.join("\n");
    var btn = $("finish"); btn.disabled = true;
    /* Le Worker garde 3000 caractères par message : au-delà, la demande part en plusieurs messages (suite 2/2…). */
    var parts = [], cur2 = [], size = 0;
    lines.forEach(function (ln) { if (size + ln.length + 1 > 2800 && cur2.length) { parts.push(cur2); cur2 = []; size = 0; } cur2.push(ln); size += ln.length + 1; });
    parts.push(cur2);
    var texts = parts.map(function (p, i) { return (i ? "[Host & Go — suite " + (i + 1) + "/" + parts.length + " — " + mail + "]\n" : "") + p.join("\n"); });
    function post(text) {
      var ctl = typeof AbortController === "function" ? new AbortController() : null, timer = ctl ? setTimeout(function () { ctl.abort(); }, 12000) : null;
      return fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name, email: mail, subject: SUBJECT, message: text, consent: true, hp: $("hp").value || "" }), signal: ctl ? ctl.signal : undefined, credentials: "omit" })
        .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return r.ok && j.ok; }); })
        .catch(function () { return false; })
        .then(function (ok) { if (timer) clearTimeout(timer); return ok; });
    }
    texts.reduce(function (chain, t) { return chain.then(function (ok) { return ok ? post(t) : false; }); }, Promise.resolve(true))
      .then(function (sent) {
        btn.disabled = false;
        var other = false; try { var rl = JSON.parse(localStorage.getItem("hg_roles") || "{}"); other = rl[mail.toLowerCase()] === "traveler"; if (sent && !other) { rl[mail.toLowerCase()] = "host"; localStorage.setItem("hg_roles", JSON.stringify(rl)); } } catch (e) { /* stockage indisponible */ }
        $("roleNotice").textContent = other ? T.roleNotice : "";
        if (sent) { $("doneMsg").textContent = T.doneOk; show(IDS.length); } else fallback(msg, name, mail);
      });
  });
})();
