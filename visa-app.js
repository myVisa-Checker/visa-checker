/* Les images de logos qui ne se chargent pas basculent sur leur lettre de secours (remplace l'ancien onerror en ligne, interdit par la politique de sécurité) */
document.addEventListener("error",function(e){var t=e.target;if(t&&t.tagName==="IMG"&&t.classList.contains("fav")&&t.parentNode){t.parentNode.classList.add("fb");t.remove()}},true);
(function(){
var UI={
fr:{stamp:"Voyageurs tunisiens",h1:"Visa Checker",sub:"Choisissez votre destination, puis cochez chaque document au fur et à mesure.",
 s_country:"Destination",cAvail:"Disponible",cSoon:"Bientôt",soonText:"La liste des pièces pour ce pays arrive bientôt.",
 agTitle:"Besoin d'un conseiller visa ?",agSub:"Consultez les coordonnées des conseillers indépendants.",
 gov:"Gouvernorat",govPick:"Choisir un gouvernorat",agCount:function(n){return n+(n>1?" conseillers":" conseiller")},
 agNone:"Pas encore de conseiller disponible.",payBtn:"Voir les options de paiement",payWait:"Lien de paiement bientôt",
 codeLabel:"Vous avez reçu un code d’accès ? Saisissez-le",unlock:"Débloquer",badCode:"Code incorrect.",contactSoon:"Coordonnées à venir",
 agNote:"Les conseillers sont indépendants. Visa Checker ne garantit pas l'obtention du visa.",
 s_status:"Votre activité",s_party:"Vous voyagez",s_stay:"Hébergement",s_pay:"Qui finance le voyage",
 status:{employee:"Salarié",self:"Indépendant / entrepreneur",student:"Étudiant",retired:"Retraité"},
 party:{alone:"Seul(e)",family:"En famille"},stay:{hotel:"Hôtel / location",hosted:"Chez un hôte"},pay:{self:"Moi-même",sponsor:"Un garant"},
 groups:{purpose:"Votre type de visa",steps:"Démarches et rendez-vous",core:"Documents de base",money:"Preuves financières",activity:"Votre situation professionnelle",stay:"Voyage et hébergement",family:"Famille"},
 opt:"Conseillé",of:"sur",ready:"prêts",
 msg0:"Commencez par la demande France-Visas.",msgN:function(n){return n+" document"+(n>1?"s":"")+" obligatoire"+(n>1?"s":"")+" à réunir."},msgDone:"Dossier complet. Vérifiez une dernière fois sur France-Visas.",
 bookTitle:"Réservations hôtel et vol",bookSlot:"Agences partenaires · bientôt",
 bookText:"Le consulat demande une réservation d'hôtel et de vol. Prenez uniquement des réservations réelles, de préférence annulables. Les agences partenaires seront proposées ici.",
 linkFV:"France-Visas Tunisie (officiel)",linkTLS:"TLScontact Tunisie",
 disc:"Les pièces exigées peuvent évoluer. Confirmez toujours la liste sur France-Visas et auprès de TLScontact. Cet outil aide à préparer le dossier et ne garantit pas l'obtention du visa. Il n'est lié à aucune ambassade. Passez uniquement par le portail officiel et méfiez-vous des intermédiaires qui promettent des facilités.",
 reset:"Tout décocher",
 brand:"Visa Checker",slogan:"Déposez votre dossier visa sans rien oublier.",homeSub:"Choisissez votre destination, dites-nous pourquoi vous voyagez, puis suivez la liste exacte des documents.",
 s_pass:"Passeport",passName:"Tunisie",s_dest:"Destination",s_motive:"Motif du voyage",
 motive:{medical:"Visite médicale",other:"Autre motif"},motiveHint:{medical:"Soins, consultation ou opération",other:"Tourisme, famille, affaires"},
 start:"Commencer",back:"Retour",next:"Continuer",stepWord:function(n){return "Étape "+n+" sur 2"},stepNames:["Motif","Profil","Documents","Aide en plus"],
 pTitle:"Votre profil",pSub:"Quelques réponses pour adapter la liste à votre situation.",dTitle:"Vos documents",dSub:"Cochez chaque document au fur et à mesure.",hTitle:"Analyse IA",hSub:"Faites analyser votre dossier ou votre refus.",
 medNote:"Visite médicale : le consulat veut voir un rendez-vous réel en France, le coût des soins et la preuve que vous pouvez les payer.",gMed:"Votre visite médicale",
 destTitle:"Votre voyage",destSub:"Pourquoi voyagez-vous ?",
 sloganA:"Votre dossier visa, vérifié",sloganB:"avant le dépôt",homeSub2:"Votre conseiller visa : nous vérifions que rien ne manque. Nous ne déposons pas votre demande."
 ,modeTitle:"Que voulez-vous faire ?",modeSub:"Visa Checker conseille et vérifie. Nous ne déposons pas votre demande.",mode:{check:["Vérifier mon dossier","Avant le dépôt : la liste exacte des documents à préparer."],appeal:["Recours après un refus","Lettre de recours, conseils pour redéposer, lettres modèles."]},apTitle:"Recours après un refus",apSub:"Reprenez votre dossier avec nos conseils.",adapt:"Adapter la liste à ma situation",ask:"Où partez-vous ?",
 howTitle:"Comment ça marche",how:[["Choisissez","Votre destination et le motif du voyage."],["Répondez","Quelques questions sur votre situation."],["Cochez","Chaque document, au fur et à mesure."]],
 whyTitle:"Pourquoi choisir Visa Checker",why:["Guidé étape par étape, en quelques minutes","Liste adaptée à votre situation : motif, activité, famille","Disponible en français, anglais et arabe","Votre progression reste enregistrée sur cet appareil","Aide en cas de refus : recours et lettres modèles"],whyNote:"Visa Checker conseille et vérifie votre dossier. Il ne dépose pas la demande, ne garantit pas le visa et n'est lié à aucune ambassade.",
 needTitle:"Besoin de documents de voyage ?",needSub:"Billet d'avion, réservation d'hôtel… Pour le visa, prenez des réservations annulables",needFlight:"Billet d'avion",needHotel:"Réservation d'hôtel",spTitle:"Nos partenaires",spSub:"Agences de voyage locales et partenaires dans le monde.",spLocal:"Agence de voyage locale",spWorld:"Partenaire dans le monde",spSlot:"Espace disponible",spTag:"Sponsorisé",spJoin:"Devenir partenaire",spSoon:"Contact à venir",
 s_purpose:"Type de visa",purpose:{tourism:"Tourisme",family:"Visite familiale ou amicale",business:"Affaires"},
 reunTitle:"Visa de long séjour",reunText:"Procédure différente d'un voyage touristique : la personne qui vit en France dépose d'abord la demande de regroupement familial auprès de l'OFII. Cette liste est générale. Confirmez les pièces sur France-Visas et auprès du consulat, car elles varient selon votre cas.",
 rfTitle:"Analyse IA de votre dossier",rfSub:"Décrivez votre situation ou votre refus : l'IA vous aide à voir ce qu'il faut corriger et prépare vos lettres.",
 rfWarn:"Le délai pour contester est court, environ 30 jours après la notification. Lisez dès aujourd'hui le motif indiqué sur votre formulaire de refus.",
 rfInc:["Analyse IA de votre cas : motif expliqué, pièces à corriger, plan d'action","Lettre de motivation ou de recours préparée par l'IA, à modifier","Conseils pour redéposer, étape par étape","4 lettres de motivation modèles : salarié, indépendant, étudiant, retraité","Le tout en PDF, à télécharger ou à recevoir par e-mail"],
 refHint:"Analyse IA de votre dossier ou de votre refus, avec lettres prêtes à modifier.",rfPrice:"Un seul prix, annoncé bientôt",rfPriceSub:"Paiement unique, à l'avance. Vous recevez tout de suite l'analyse et le pack : à télécharger en PDF ou à recevoir par e-mail.",
 caseLabel:"Votre cas, en bref",casePh:"Ex. : moyens de subsistance insuffisants",caseHint:"Écrivez le motif de refus comme indiqué sur le papier remis lors du refus (ou votre question).",advMail:"Écrire par e-mail",advWA:"Écrire sur WhatsApp",advSubject:"demande de conseil",advDest:"Destination",advCase:"Mon cas",pdfBtn:"Télécharger le pack en PDF",pdfHint:"Dans la fenêtre qui s'ouvre, choisissez « Enregistrer au format PDF ».",pdfMail:"Recevoir par e-mail",rfPay:"Payer",rfAdvTitle:"Conseils pour redéposer",rfLetTitle:"Lettres à copier",
 rfNote:"Les lettres sont en français, car elles sont adressées aux autorités françaises. Remplacez tout ce qui est entre [crochets]. Collez le texte dans Word ou Google Docs, puis imprimez.",
 rfNoGuar:"Ces modèles aident à présenter votre dossier. Ils ne garantissent pas le visa.",copy:"Copier le texte",copied:"Copié",selected:"Texte sélectionné, copiez-le",
 adv:["Lisez le formulaire de refus. La case cochée indique le motif à corriger.","Choisissez : un recours (délai court, indiqué sur la notification) ou une nouvelle demande, qui entraîne de nouveaux frais.","Corrigez le motif avec des preuves nouvelles. Moyens financiers : relevés réguliers, sans gros dépôt soudain. Objet du séjour : programme clair et réservations réelles. Retour en Tunisie : preuves d'attaches (emploi, famille, logement).","Restez cohérent avec la première demande. Le consulat garde votre dossier : dates, emploi et revenus doivent être identiques.","Il n'existe pas de délai légal d'attente avant de redéposer, mais ne redéposez pas le même dossier sans changement.","Aucun intermédiaire ne peut promettre un visa. Un faux document peut entraîner de graves conséquences, dont une interdiction d'entrée."]},
en:{stamp:"Tunisian travellers",h1:"Visa Checker",sub:"Pick your destination, then tick each document as you collect it.",
 s_country:"Destination",cAvail:"Available",cSoon:"Coming soon",soonText:"The document list for this country is coming soon.",
 agTitle:"Need a visa advisor?",agSub:"View contact details for independent visa advisors.",
 gov:"Governorate",govPick:"Choose a governorate",agCount:function(n){return n+(n>1?" advisors":" advisor")},
 agNone:"No advisor available yet.",payBtn:"View payment options",payWait:"Payment link coming soon",
 codeLabel:"Have you received an access code? Enter it",unlock:"Unlock",badCode:"Incorrect code.",contactSoon:"Contact details coming",
 agNote:"Advisors are independent. Visa Checker does not guarantee a visa.",
 s_status:"Your activity",s_party:"You travel",s_stay:"Accommodation",s_pay:"Who pays for the trip",
 status:{employee:"Employee",self:"Self-employed / business owner",student:"Student",retired:"Retired"},
 party:{alone:"Alone",family:"With family"},stay:{hotel:"Hotel / rental",hosted:"With a host"},pay:{self:"Myself",sponsor:"A sponsor"},
 groups:{purpose:"Your visa type",steps:"Steps and appointment",core:"Core documents",money:"Proof of funds",activity:"Your work or study situation",stay:"Travel and accommodation",family:"Family"},
 opt:"Advised",of:"of",ready:"ready",
 msg0:"Start with the France-Visas application.",msgN:function(n){return n+" required document"+(n>1?"s":"")+" to gather."},msgDone:"File complete. Check once more on France-Visas.",
 bookTitle:"Hotel and flight reservations",bookSlot:"Partner agencies · coming soon",
 bookText:"The consulate asks for a hotel and flight reservation. Use real bookings only, preferably cancellable ones. Partner agencies will be listed here.",
 linkFV:"France-Visas Tunisia (official)",linkTLS:"TLScontact Tunisia",
 disc:"Required documents can change. Always confirm the list on France-Visas and with TLScontact. This tool helps you prepare your file and does not guarantee a visa. It is not affiliated with any embassy. Use the official portal only, and be wary of intermediaries who promise shortcuts.",
 reset:"Untick everything",
 brand:"Visa Checker",slogan:"Apply for your visa without missing a document.",homeSub:"Pick your destination, tell us why you travel, then follow the exact list of documents.",
 s_pass:"Passport",passName:"Tunisia",s_dest:"Destination",s_motive:"Reason for travel",
 motive:{medical:"Medical visit",other:"Other reason"},motiveHint:{medical:"Treatment, consultation or surgery",other:"Tourism, family, business"},
 start:"Start",back:"Back",next:"Continue",stepWord:function(n){return "Step "+n+" of 2"},stepNames:["Reason","Profile","Documents","Extra help"],
 pTitle:"Your profile",pSub:"A few answers to fit the list to your situation.",dTitle:"Your documents",dSub:"Tick each document as you collect it.",hTitle:"AI analysis",hSub:"Have your file or refusal analysed.",
 medNote:"Medical visit: the consulate wants a real appointment in France, the cost of care and proof you can pay for it.",gMed:"Your medical visit",
 destTitle:"Your trip",destSub:"Why are you travelling?",
 sloganA:"Your visa file, checked",sloganB:"before you apply",homeSub2:"Your visa advisor: we check that nothing is missing. We do not file your application."
 ,modeTitle:"What do you want to do?",modeSub:"Visa Checker advises and checks. We do not file your application.",mode:{check:["Check my file","Before you apply: the exact list of documents to prepare."],appeal:["Appeal after a refusal","Appeal letter, advice for applying again, sample letters."]},apTitle:"Appeal after a refusal",apSub:"Rebuild your file with our advice.",adapt:"Adjust the list to my situation",ask:"Where are you headed?",
 howTitle:"How it works",how:[["Choose","Your destination and reason for travel."],["Answer","A few questions about your situation."],["Tick","Each document as you collect it."]],
 whyTitle:"Why travellers choose Visa Checker",why:["Guided step by step, in minutes","List fitted to your situation: reason, work, family","Available in French, English and Arabic","Your progress stays saved on this device","Help after a refusal: appeal and sample letters"],whyNote:"Visa Checker advises and checks your file. It does not file the application, does not guarantee a visa and is not affiliated with any embassy.",
 needTitle:"Need travel documents?",needSub:"Flight ticket, hotel booking… For the visa, choose cancellable bookings",needFlight:"Flight ticket",needHotel:"Hotel booking",spTitle:"Our partners",spSub:"Local travel agencies and partners around the world.",spLocal:"Local travel agency",spWorld:"Partner worldwide",spSlot:"Space available",spTag:"Sponsored",spJoin:"Become a partner",spSoon:"Contact coming soon",
 s_purpose:"Visa type",purpose:{tourism:"Tourism",family:"Family or friends visit",business:"Business"},
 reunTitle:"Long-stay visa",reunText:"This is a different procedure from a tourist trip: the person living in France first files the family reunification request with the OFII. This list is general. Confirm the documents on France-Visas and with the consulate, because they vary by case.",
 rfTitle:"AI analysis of your file",rfSub:"Describe your situation or your refusal: the AI helps you see what to fix and prepares your letters.",
 rfWarn:"The time to appeal is short, about 30 days after you are notified. Read the reason on your refusal form today.",
 rfInc:["AI analysis of your case: reason explained, documents to fix, action plan","Motivation or appeal letter drafted by the AI, ready to edit","Advice for applying again, step by step","4 sample motivation letters: employee, self-employed, student, retired","All in PDF, to download or receive by e-mail"],
 refHint:"AI analysis of your file or refusal, with letters ready to edit.",rfPrice:"One price, announced soon",rfPriceSub:"One payment, in advance. You get the analysis and the pack at once: download as a PDF or receive by e-mail.",
 caseLabel:"Your case, in brief",casePh:"E.g.: insufficient means of subsistence",caseHint:"Write the refusal reason as shown on the paper you received with the refusal (or your question).",advMail:"Write by e-mail",advWA:"Write on WhatsApp",advSubject:"advice request",advDest:"Destination",advCase:"My case",pdfBtn:"Download the pack as PDF",pdfHint:"In the window that opens, choose \"Save as PDF\".",pdfMail:"Receive by e-mail",rfPay:"Pay",rfAdvTitle:"Advice for applying again",rfLetTitle:"Letters to copy",
 rfNote:"The letters are in French because they go to the French authorities. Replace everything in [brackets]. Paste the text into Word or Google Docs, then print.",
 rfNoGuar:"These models help you present your file. They do not guarantee a visa.",copy:"Copy the text",copied:"Copied",selected:"Text selected, copy it",
 adv:["Read the refusal form. The ticked box shows the reason to fix.","Choose: an appeal (short deadline, shown on the notification) or a new application, which means new fees.","Fix the reason with new evidence. Funds: regular statements, no sudden large deposit. Purpose of stay: a clear plan and real bookings. Return to Tunisia: proof of ties (job, family, home).","Stay consistent with your first application. The consulate keeps your file: dates, job and income must be identical.","There is no legal waiting period before you apply again, but do not resubmit the same file unchanged.","No intermediary can promise a visa. A false document can have serious consequences, including an entry ban."]},
ar:{stamp:"المسافرون التونسيون",h1:"Visa Checker",sub:"اختر وجهتك ثم علّم كل وثيقة بعد تجهيزها.",
 s_country:"الوجهة",cAvail:"متاحة",cSoon:"قريبًا",soonText:"قائمة وثائق هذا البلد قادمة قريبًا.",
 agTitle:"هل تحتاج إلى مستشار تأشيرة؟",agSub:"عرض بيانات الاتصال بالمستشارين المستقلين.",
 gov:"الولاية",govPick:"اختر الولاية",agCount:function(n){return n===1?"مستشار واحد":n+" مستشارين"},
 agNone:"لا يوجد مستشار متاح بعد.",payBtn:"خيارات الدفع",payWait:"رابط الدفع قريبًا",
 codeLabel:"هل تلقيت رمز دخول؟ أدخله هنا",unlock:"فتح",badCode:"الرمز غير صحيح.",contactSoon:"بيانات الاتصال قريبًا",
 agNote:"المستشارون مستقلون. Visa Checker لا يضمن الحصول على التأشيرة.",
 s_status:"نشاطك",s_party:"تسافر",s_stay:"الإقامة",s_pay:"من يموّل السفر",
 status:{employee:"موظف",self:"عمل حر / صاحب مشروع",student:"طالب",retired:"متقاعد"},
 party:{alone:"بمفردي",family:"مع العائلة"},stay:{hotel:"فندق / كراء",hosted:"عند مضيف"},pay:{self:"أنا",sponsor:"كفيل"},
 groups:{purpose:"نوع تأشيرتك",steps:"الإجراءات والموعد",core:"الوثائق الأساسية",money:"إثبات الموارد المالية",activity:"وضعك المهني أو الدراسي",stay:"السفر والإقامة",family:"العائلة"},
 opt:"مُستحسن",of:"من",ready:"جاهزة",
 msg0:"ابدأ بالطلب على موقع France-Visas.",msgN:function(n){return "بقيت "+n+" وثيقة إلزامية."},msgDone:"الملف مكتمل. تحقق مرة أخيرة على موقع France-Visas.",
 bookTitle:"حجز الفندق والطائرة",bookSlot:"وكالات شريكة · قريبًا",
 bookText:"تطلب القنصلية حجز فندق وطيران. استعمل حجوزات حقيقية فقط، ويُفضّل القابلة للإلغاء. ستظهر الوكالات الشريكة هنا.",
 linkFV:"France-Visas تونس (الموقع الرسمي)",linkTLS:"TLScontact تونس",
 disc:"قد تتغير الوثائق المطلوبة. تأكد دائمًا من القائمة على موقع France-Visas ولدى TLScontact. هذه الأداة تساعدك على تحضير ملفك ولا تضمن الحصول على التأشيرة، وهي غير تابعة لأي سفارة. اعتمد البوابة الرسمية فقط واحذر من الوسطاء الذين يعدون بتسهيلات.",
 reset:"إلغاء كل العلامات",
 brand:"Visa Checker",slogan:"قدّم ملف تأشيرتك دون أن تنسى أي وثيقة.",homeSub:"اختر وجهتك، وأخبرنا سبب سفرك، ثم اتبع قائمة الوثائق الدقيقة.",
 s_pass:"جواز السفر",passName:"تونس",s_dest:"الوجهة",s_motive:"سبب السفر",
 motive:{medical:"زيارة طبية",other:"سبب آخر"},motiveHint:{medical:"علاج أو استشارة أو عملية",other:"سياحة أو عائلة أو أعمال"},
 start:"ابدأ",back:"رجوع",next:"متابعة",stepWord:function(n){return "الخطوة "+n+" من 2"},stepNames:["السبب","ملفك","الوثائق","مساعدة"],
 pTitle:"ملفك",pSub:"بضعة أجوبة لملاءمة القائمة مع وضعك.",dTitle:"وثائقك",dSub:"علّم كل وثيقة بعد تجهيزها.",hTitle:"تحليل بالذكاء الاصطناعي",hSub:"حلّل ملفك أو سبب الرفض.",
 medNote:"زيارة طبية: تريد القنصلية موعدًا حقيقيًا في فرنسا وتكلفة العلاج وإثبات قدرتك على دفعها.",gMed:"زيارتك الطبية",
 destTitle:"رحلتك",destSub:"ما سبب سفرك؟",
 sloganA:"ملف تأشيرتك، مُراجَع",sloganB:"قبل تقديمه",homeSub2:"مستشارك للتأشيرة: نتحقق من أنه لا ينقصك شيء. نحن لا نودع طلبك."
 ,modeTitle:"ماذا تريد أن تفعل؟",modeSub:"Visa Checker ينصح ويتحقق. نحن لا نودع طلبك.",mode:{check:["تحقق من ملفي","قبل التقديم: القائمة الدقيقة للوثائق المطلوبة."],appeal:["طعن بعد الرفض","رسالة طعن ونصائح لإعادة التقديم ورسائل نموذجية."]},apTitle:"طعن بعد الرفض",apSub:"أعد بناء ملفك بمساعدة نصائحنا.",adapt:"تكييف القائمة مع وضعي",ask:"إلى أين تسافر؟",
 howTitle:"كيف يعمل",how:[["اختر","وجهتك وسبب السفر."],["أجب","عن بضعة أسئلة حول وضعك."],["علّم","كل وثيقة بعد تجهيزها."]],
 whyTitle:"لماذا يختار المسافرون Visa Checker",why:["إرشاد خطوة بخطوة في دقائق","قائمة مناسبة لوضعك: السبب والعمل والعائلة","متاح بالفرنسية والإنجليزية والعربية","يبقى تقدّمك محفوظًا على هذا الجهاز","مساعدة عند الرفض: طعن ورسائل نموذجية"],whyNote:"Visa Checker ينصح ويتحقق من ملفك. لا يودع الطلب ولا يضمن التأشيرة وهو غير تابع لأي سفارة.",
 needTitle:"تحتاج وثائق السفر؟",needSub:"تذكرة طيران، حجز فندق… للتأشيرة، اختر حجوزات قابلة للإلغاء",needFlight:"تذكرة طيران",needHotel:"حجز فندق",spTitle:"شركاؤنا",spSub:"وكالات سفر محلية وشركاء حول العالم.",spLocal:"وكالة سفر محلية",spWorld:"شريك حول العالم",spSlot:"مساحة متاحة",spTag:"برعاية",spJoin:"كن شريكًا",spSoon:"بيانات الاتصال قريبًا",
 s_purpose:"نوع التأشيرة",purpose:{tourism:"سياحة",family:"زيارة عائلية أو للأصدقاء",business:"أعمال"},
 reunTitle:"تأشيرة الإقامة الطويلة",reunText:"الإجراء يختلف عن السفر السياحي: يقدّم الشخص المقيم في فرنسا أولًا طلب لمّ الشمل لدى المكتب الفرنسي للهجرة والاندماج (OFII). هذه القائمة عامة. تأكد من الوثائق على موقع France-Visas ولدى القنصلية لأنها تختلف حسب حالتك.",
 rfTitle:"تحليل ملفك بالذكاء الاصطناعي",rfSub:"صِف وضعك أو سبب الرفض: يساعدك الذكاء الاصطناعي على معرفة ما يجب تصحيحه ويحضّر رسائلك.",
 rfWarn:"مهلة الطعن قصيرة، نحو 30 يومًا بعد التبليغ. اقرأ اليوم سبب الرفض المكتوب في استمارة الرفض.",
 rfInc:["تحليل حالتك بالذكاء الاصطناعي: شرح السبب، وثائق يجب تصحيحها، خطة عمل","رسالة تحفيز أو طعن يحضّرها الذكاء الاصطناعي وقابلة للتعديل","نصائح لإعادة التقديم خطوة بخطوة","4 رسائل تحفيز نموذجية: موظف، عمل حر، طالب، متقاعد","كل ذلك بصيغة PDF، للتحميل أو الاستلام عبر البريد"],
 refHint:"تحليل ملفك أو رفضك بالذكاء الاصطناعي، مع رسائل جاهزة للتعديل.",rfPrice:"سعر واحد، يُعلن قريبًا",rfPriceSub:"دفعة واحدة مسبقًا. تحصل فورًا على التحليل والحزمة: تحميل بصيغة PDF أو استلام عبر البريد.",
 caseLabel:"حالتك باختصار",casePh:"مثال: عدم كفاية وسائل العيش",caseHint:"اكتب سبب الرفض كما هو مذكور في الورقة المسلّمة لك عند الرفض (أو سؤالك).",advMail:"راسل عبر البريد",advWA:"راسل عبر واتساب",advSubject:"طلب نصيحة",advDest:"الوجهة",advCase:"حالتي",pdfBtn:"تحميل الحزمة بصيغة PDF",pdfHint:"في النافذة التي تُفتح، اختر «حفظ بصيغة PDF».",pdfMail:"استلام عبر البريد",rfPay:"ادفع",rfAdvTitle:"نصائح لإعادة التقديم",rfLetTitle:"رسائل للنسخ",
 rfNote:"الرسائل بالفرنسية لأنها موجهة إلى السلطات الفرنسية. عوّض كل ما بين [أقواس]. الصق النص في Word أو Google Docs ثم اطبعه.",
 rfNoGuar:"هذه النماذج تساعدك على عرض ملفك ولا تضمن الحصول على التأشيرة.",copy:"نسخ النص",copied:"تم النسخ",selected:"تم تحديد النص، انسخه",
 adv:["اقرأ استمارة الرفض. الخانة المعلّمة تبيّن السبب الذي يجب إصلاحه.","اختر: الطعن (مهلة قصيرة مذكورة في التبليغ) أو تقديم طلب جديد، وهو يتطلب رسومًا جديدة.","أصلح السبب بإثباتات جديدة. الموارد المالية: كشوف منتظمة دون إيداع كبير مفاجئ. غرض الإقامة: برنامج واضح وحجوزات حقيقية. العودة إلى تونس: إثباتات الارتباط (عمل، عائلة، سكن).","حافظ على الانسجام مع الطلب الأول. القنصلية تحتفظ بملفك: يجب أن تتطابق التواريخ والعمل والدخل.","لا توجد مدة انتظار قانونية قبل إعادة التقديم، لكن لا تقدّم الملف نفسه دون تغيير.","لا يستطيع أي وسيط أن يعد بتأشيرة. الوثيقة المزوّرة قد تؤدي إلى عواقب خطيرة منها المنع من الدخول."]}
};
var any=function(){return true};
var ITEMS=[
{id:"fv",g:"steps",w:any,
 fr:["Demande en ligne sur France-Visas, imprimée et signée","Imprimez le récépissé. Le portail officiel est la seule voie pour déposer une demande."],
 en:["Online application on France-Visas, printed and signed","Print the receipt. The official portal is the only route to apply."],
 ar:["الطلب الإلكتروني على France-Visas، مطبوع وموقّع","اطبع وصل التسجيل. البوابة الرسمية هي الطريقة الوحيدة للتقديم."]},
{id:"appt",g:"steps",w:any,
 fr:["Rendez-vous TLScontact (Tunis ou Sfax) et lettre de confirmation imprimée","À réserver au moins 3 semaines avant le départ et jusqu'à 6 mois avant. Un rendez-vous par personne. Le numéro de passeport doit correspondre à la lettre."],
 en:["TLScontact appointment (Tunis or Sfax) and printed confirmation letter","Book at least 3 weeks before departure and up to 6 months before. One appointment per person. The passport number must match the letter."],
 ar:["موعد TLScontact (تونس أو صفاقس) ورسالة التأكيد مطبوعة","احجز قبل السفر بـ3 أسابيع على الأقل وحتى 6 أشهر. موعد لكل شخص. يجب أن يطابق رقم جواز السفر الرسالة."]},
{id:"fee",g:"steps",w:any,
 fr:["Frais de visa et frais de service du centre de dépôt","Les montants et le mode de paiement sont indiqués sur France-Visas et sur le site du centre de dépôt. Confirmez-les avant votre rendez-vous."],
 en:["Visa fee and application centre service fee","Amounts and payment method are shown on France-Visas and on the application centre's website. Confirm them before your appointment."],
 ar:["رسوم التأشيرة ورسوم خدمة مركز الإيداع","المبالغ وطريقة الدفع مذكورة على موقع France-Visas وعلى موقع مركز الإيداع. تأكد منها قبل موعدك."]},
{id:"passport",g:"core",w:any,
 fr:["Passeport valable 3 mois après votre retour","Délivré depuis moins de 10 ans, avec au moins 2 pages vierges. Apportez aussi les anciens passeports avec visas."],
 en:["Passport valid 3 months after you leave","Issued within the last 10 years, with at least 2 blank pages. Bring older passports that hold visas."],
 ar:["جواز سفر صالح 3 أشهر بعد عودتك","صادر منذ أقل من 10 سنوات وبه صفحتان فارغتان على الأقل. أحضر أيضًا جوازات السفر القديمة التي بها تأشيرات."]},
{id:"passcopy",g:"core",w:any,
 fr:["Copie de la page d'identité du passeport et des anciens visas",""],
 en:["Copy of the passport data page and previous visas",""],
 ar:["نسخة من صفحة بيانات الجواز والتأشيرات السابقة",""]},
{id:"photos",g:"core",w:any,
 fr:["2 photos d'identité identiques et récentes","35 x 45 mm, en couleur, fond blanc ou très clair, tête nue. Les photos faites à la maison sont souvent refusées."],
 en:["2 identical, recent passport photos","35 x 45 mm, colour, white or very light background, head uncovered. Home-printed photos are often refused."],
 ar:["صورتا هوية متطابقتان وحديثتان","35 × 45 مم، ملوّنة، خلفية بيضاء أو فاتحة جدًا، دون غطاء للرأس. الصور المطبوعة في البيت تُرفض غالبًا."]},
{id:"cin",g:"core",w:any,
 fr:["Copie de la carte d'identité nationale (CIN)",""],
 en:["Copy of the national ID card (CIN)",""],
 ar:["نسخة من بطاقة التعريف الوطنية",""]},
{id:"civil",g:"core",w:function(s){return s.purpose==="family"||s.party==="family"},
 fr:["Extrait d'acte de naissance avec filiation","Souvent demandé, de moins de 3 mois."],
 en:["Birth certificate extract with filiation","Often requested, less than 3 months old."],
 ar:["مضمون ولادة مع الأصول","يُطلب غالبًا، وعمره أقل من 3 أشهر."]},
{id:"insurance",g:"core",w:any,
 fr:["Assurance voyage médicale, 30 000 € minimum","Valable dans tout l'espace Schengen, avec rapatriement médical, pour la durée complète du séjour."],
 en:["Travel medical insurance, minimum €30,000","Valid across the Schengen area, with medical repatriation, for the whole stay."],
 ar:["تأمين سفر طبي بـ30 000 € على الأقل","صالح في كامل فضاء شنغن، ويشمل الإعادة الطبية، ويغطي كامل مدة الإقامة."]},
{id:"transl",g:"core",w:any,opt:1,
 fr:["Traduction française assermentée des documents en arabe","Souvent exigée pour les pièces rédigées en arabe."],
 en:["Sworn French translation of documents written in Arabic","Often required for documents written in Arabic."],
 ar:["ترجمة فرنسية محلّفة للوثائق المكتوبة بالعربية","تُطلب غالبًا للوثائق المحرّرة بالعربية."]},
{id:"prev",g:"core",w:any,opt:1,
 fr:["Anciens visas et preuves de voyages passés","Des voyages passés avec retour dans les délais renforcent le dossier."],
 en:["Previous visas and proof of past trips","Past trips returned on time strengthen your file."],
 ar:["التأشيرات السابقة وإثباتات الرحلات السابقة","الرحلات السابقة مع العودة في الوقت المحدد تقوّي الملف."]},
{id:"bank",g:"money",w:function(s){return s.pay==="self"},
 fr:["Relevés bancaires des 3 derniers mois et RIB","Évitez les gros dépôts en espèces juste avant la demande. Le solde doit rester cohérent avec la durée du séjour."],
 en:["Bank statements for the last 3 months and your RIB","Avoid large cash deposits just before applying. Your balance should fit the length of the stay."],
 ar:["كشوف الحساب البنكي لآخر 3 أشهر وبيانات الحساب (RIB)","تجنّب الإيداعات النقدية الكبيرة قبل التقديم مباشرة. يجب أن يتناسب الرصيد مع مدة الإقامة."]},
{id:"sp_letter",g:"money",w:function(s){return s.pay==="sponsor"},
 fr:["Lettre de prise en charge du garant","Signée, avec la copie de sa pièce d'identité ou de son titre de séjour."],
 en:["Sponsor's letter of financial support","Signed, with a copy of their ID or residence permit."],
 ar:["رسالة تكفّل من الكفيل","موقّعة، مع نسخة من بطاقة هويته أو بطاقة إقامته."]},
{id:"sp_bank",g:"money",w:function(s){return s.pay==="sponsor"},
 fr:["Relevés bancaires et justificatifs de revenus du garant",""],
 en:["Sponsor's bank statements and proof of income",""],
 ar:["كشوف الحساب البنكي وإثباتات دخل الكفيل",""]},
{id:"sp_rel",g:"money",w:function(s){return s.pay==="sponsor"},
 fr:["Preuve du lien avec le garant","Livret de famille, acte de naissance ou autre document officiel."],
 en:["Proof of relationship with the sponsor","Family record, birth certificate or other official document."],
 ar:["إثبات صلة القرابة بالكفيل","دفتر عائلي أو مضمون ولادة أو وثيقة رسمية أخرى."]},
{id:"emp_cert",g:"activity",w:function(s){return s.status==="employee"},
 fr:["Attestation de travail","Poste, date d'embauche et salaire mensuel, sur papier à en-tête de l'employeur."],
 en:["Employment certificate","Position, hire date and monthly salary, on the employer's letterhead."],
 ar:["شهادة عمل","الوظيفة وتاريخ التوظيف والأجر الشهري، على ورقة المؤسسة الرسمية."]},
{id:"emp_leave",g:"activity",w:function(s){return s.status==="employee"&&s.purpose!=="business"},
 fr:["Autorisation de congé de l'employeur","Avec les dates exactes du voyage."],
 en:["Leave authorisation from your employer","With the exact travel dates."],
 ar:["ترخيص عطلة من المشغّل","يتضمن تواريخ السفر بالضبط."]},
{id:"emp_pay",g:"activity",w:function(s){return s.status==="employee"},
 fr:["3 derniers bulletins de paie",""],en:["Last 3 payslips",""],ar:["آخر 3 كشوف أجر",""]},
{id:"emp_cnss",g:"activity",w:function(s){return s.status==="employee"},opt:1,
 fr:["Relevé de sécurité sociale (CNSS, CNRPS, autres)","Montre une activité déclarée et stable."],
 en:["Social security statement (CNSS, CNRPS, others)","Shows declared, stable employment."],
 ar:["شهادة الضمان الاجتماعي (CNSS، CNRPS، أخرى)","تُظهر نشاطًا مصرّحًا به ومستقرًا."]},
{id:"self_reg",g:"activity",w:function(s){return s.status==="self"},
 fr:["Registre de commerce, patente ou matricule fiscal","Selon votre activité."],
 en:["Business registration, patente or tax ID","Depending on your activity."],
 ar:["السجل التجاري أو الباتيندة أو المعرّف الجبائي","حسب نشاطك."]},
{id:"self_tax",g:"activity",w:function(s){return s.status==="self"},
 fr:["Attestation de situation fiscale et dernières déclarations",""],
 en:["Tax situation certificate and recent tax filings",""],
 ar:["شهادة الوضعية الجبائية وآخر التصاريح الجبائية",""]},
{id:"self_bank",g:"activity",w:function(s){return s.status==="self"},
 fr:["Relevés bancaires professionnels",""],en:["Business bank statements",""],ar:["كشوف الحساب البنكي المهني",""]},
{id:"stu_cert",g:"activity",w:function(s){return s.status==="student"},
 fr:["Attestation d'inscription ou de scolarité","Avec la carte d'étudiant."],
 en:["Enrolment or school certificate","With your student card."],
 ar:["شهادة تسجيل أو مدرسية","مع بطاقة الطالب."]},
{id:"stu_auth",g:"activity",w:function(s){return s.status==="student"},
 fr:["Autorisation d'absence de l'établissement","Avec les dates du voyage."],
 en:["Absence authorisation from your school","With the travel dates."],
 ar:["ترخيص غياب من المؤسسة التعليمية","مع تواريخ السفر."]},
{id:"ret_pen",g:"activity",w:function(s){return s.status==="retired"},
 fr:["Attestation de pension de retraite","Et les relevés montrant son versement."],
 en:["Pension certificate","And statements showing it is paid."],
 ar:["شهادة جراية التقاعد","وكشوف تُثبت صرفها."]},
{id:"med_hosp",g:"purpose",w:function(s){return s.purpose==="medical"},
 fr:["Attestation du médecin ou de l'établissement de santé en France","Sur papier à en-tête : nature des soins, dates de rendez-vous et durée prévue du séjour."],
 en:["Certificate from the doctor or healthcare facility in France","On letterhead: type of care, appointment dates and expected length of stay."],
 ar:["شهادة من الطبيب أو المؤسسة الصحية في فرنسا","على ورقة رسمية: نوع العلاج وتواريخ المواعيد والمدة المتوقعة للإقامة."]},
{id:"med_cost",g:"purpose",w:function(s){return s.purpose==="medical"},
 fr:["Devis des soins et preuve de paiement ou de prise en charge","Montre que vous pouvez financer les soins en plus du séjour : acompte payé, garantie ou prise en charge écrite."],
 en:["Cost estimate for the care and proof of payment or coverage","Shows you can fund the care on top of the stay: deposit paid, guarantee or written coverage."],
 ar:["تقدير تكلفة العلاج وإثبات الدفع أو التكفّل","يُثبت قدرتك على تمويل العلاج إضافة إلى الإقامة: عربون مدفوع أو ضمان أو تكفّل كتابي."]},
{id:"med_file",g:"purpose",w:function(s){return s.purpose==="medical"},
 fr:["Dossier médical et rapport de votre médecin en Tunisie","Diagnostic et raison du déplacement. Traduction française assermentée si le document est en arabe."],
 en:["Medical file and report from your doctor in Tunisia","Diagnosis and reason for travelling. Sworn French translation if the document is in Arabic."],
 ar:["الملف الطبي وتقرير طبيبك في تونس","التشخيص وسبب السفر. ترجمة فرنسية محلّفة إن كانت الوثيقة بالعربية."]},
{id:"med_comp",g:"purpose",w:function(s){return s.purpose==="medical"},opt:1,
 fr:["Accompagnateur éventuel","Si un proche voyage avec vous, il dépose son propre dossier et l'attestation médicale doit le mentionner."],
 en:["Companion, if any","If a relative travels with you, they file their own application and the medical certificate should mention them."],
 ar:["المرافق إن وُجد","إذا سافر معك قريب فإنه يقدّم ملفه الخاص ويجب أن تذكره الشهادة الطبية."]},
{id:"kin",g:"purpose",w:function(s){return s.purpose==="family"},
 fr:["Preuve du lien avec la personne que vous visitez","Livret de famille, acte de naissance ou autre document officiel. Ajoutez la copie de sa pièce d'identité ou de son titre de séjour."],
 en:["Proof of your relationship with the person you visit","Family record, birth certificate or other official document. Add a copy of their ID or residence permit."],
 ar:["إثبات صلتك بالشخص الذي تزوره","دفتر عائلي أو مضمون ولادة أو وثيقة رسمية أخرى. أضف نسخة من بطاقة هويته أو بطاقة إقامته."]},
{id:"inv_biz",g:"purpose",w:function(s){return s.purpose==="business"},
 fr:["Lettre d'invitation de l'entreprise ou du salon en France","Elle précise l'objet, les dates et qui prend en charge les frais, avec les coordonnées de l'organisateur."],
 en:["Invitation letter from the company or trade fair in France","It states the purpose, the dates and who covers the costs, with the organiser's contact details."],
 ar:["رسالة دعوة من الشركة أو المعرض في فرنسا","تبيّن الغرض والتواريخ ومن يتحمل التكاليف، مع بيانات الاتصال بالمنظّم."]},
{id:"mission",g:"purpose",w:function(s){return s.purpose==="business"&&s.status==="employee"},
 fr:["Ordre de mission de votre employeur","Objet de la mission, dates et prise en charge des frais, sur papier à en-tête."],
 en:["Mission order from your employer","Purpose of the mission, dates and who covers the costs, on letterhead."],
 ar:["أمر مهمة من المشغّل","غرض المهمة والتواريخ وتحمّل التكاليف، على ورقة المؤسسة الرسمية."]},
{id:"biz_proof",g:"purpose",w:function(s){return s.purpose==="business"&&s.status!=="employee"},
 fr:["Preuves de votre activité et de vos relations d'affaires","Contrats, factures ou échanges avec le partenaire en France."],
 en:["Proof of your activity and business relations","Contracts, invoices or exchanges with your partner in France."],
 ar:["إثباتات نشاطك وعلاقاتك التجارية","عقود أو فواتير أو مراسلات مع الشريك في فرنسا."]},
{id:"flight",g:"stay",w:any,
 fr:["Réservation de vol aller-retour","Réservation non payée. N'achetez pas de billet non remboursable avant d'avoir le visa."],
 en:["Round-trip flight reservation","Reserved but unpaid. Do not buy a non-refundable ticket before you have the visa."],
 ar:["حجز طيران ذهاب وإياب","حجز غير مدفوع. لا تشترِ تذكرة غير قابلة للاسترداد قبل الحصول على التأشيرة."]},
{id:"hotel",g:"stay",w:function(s){return s.stay==="hotel"},
 fr:["Réservation d'hôtel ou de location pour toutes les nuits","Dates et noms des voyageurs conformes au dossier."],
 en:["Hotel or rental reservation for every night","Dates and traveller names must match your file."],
 ar:["حجز فندق أو كراء لكل الليالي","يجب أن تطابق التواريخ وأسماء المسافرين ملفك."]},
{id:"invite",g:"stay",w:function(s){return s.stay==="hosted"},
 fr:["Attestation d'accueil (CERFA) validée par la mairie de l'hôte","Datée de moins de 6 mois. Ajoutez la pièce d'identité de l'hôte, son justificatif de domicile en France, ses revenus et la preuve du lien de parenté."],
 en:["Hosting certificate (CERFA) validated by the host's town hall","Dated within 6 months. Add the host's ID, proof of address in France, proof of income and proof of kinship."],
 ar:["شهادة استضافة (CERFA) مصادَق عليها من بلدية المضيف","مؤرخة بأقل من 6 أشهر. أضف هوية المضيف وإثبات إقامته في فرنسا ودخله وإثبات صلة القرابة."]},
{id:"itin",g:"stay",w:any,opt:1,
 fr:["Programme du séjour jour par jour","Utile surtout si vous visitez plusieurs villes."],
 en:["Day-by-day trip plan","Most useful if you visit several cities."],
 ar:["برنامج الإقامة يومًا بيوم","مفيد خصوصًا إن زرت عدة مدن."]},
{id:"fam_rec",g:"family",w:function(s){return s.party==="family"},
 fr:["Livret de famille ou acte de naissance de chaque enfant","Chaque enfant doit avoir son propre passeport."],
 en:["Family record or birth certificate of each child","Each child needs their own passport."],
 ar:["دفتر عائلي أو مضمون ولادة لكل طفل","يجب أن يملك كل طفل جواز سفره الخاص."]},
{id:"fam_auth",g:"family",w:function(s){return s.party==="family"},
 fr:["Autorisation écrite de l'autre parent","Nécessaire si un enfant voyage avec un seul parent."],
 en:["Written authorisation from the other parent","Needed if a child travels with one parent only."],
 ar:["ترخيص كتابي من الوالد الآخر","ضروري إذا سافر الطفل مع أحد والديه فقط."]}
];
/* Family reunification (long-stay visa): general list, to confirm with France-Visas and the consulate. */
var RITEMS=[
{id:"r_ofii",g:"steps",w:any,
 fr:["Décision ou preuve de la demande de regroupement familial déposée en France","La personne qui vit en France dépose d'abord la demande à l'OFII. En règle générale, elle doit résider légalement en France depuis au moins 18 mois."],
 en:["Decision or proof of the family reunification request filed in France","The person living in France files the request with the OFII first. As a rule, they must have lived legally in France for at least 18 months."],
 ar:["قرار أو إثبات طلب لمّ الشمل المقدَّم في فرنسا","يقدّم الشخص المقيم في فرنسا الطلب أولًا لدى OFII. كقاعدة عامة، يجب أن يقيم قانونيًا في فرنسا منذ 18 شهرًا على الأقل."]},
{id:"r_form",g:"steps",w:any,
 fr:["Demande de visa de long séjour sur France-Visas, imprimée et signée","Choisissez le motif famille. Seul le formulaire en vigueur est accepté."],
 en:["Long-stay visa application on France-Visas, printed and signed","Choose the family reason. Only the current form is accepted."],
 ar:["طلب تأشيرة الإقامة الطويلة على France-Visas، مطبوع وموقّع","اختر سبب العائلة. لا يُقبل إلا النموذج الساري."]},
{id:"r_appt",g:"steps",w:any,
 fr:["Rendez-vous de dépôt du dossier","Au centre indiqué par France-Visas. Gardez la confirmation imprimée."],
 en:["Appointment to submit your file","At the centre shown on France-Visas. Keep the printed confirmation."],
 ar:["موعد إيداع الملف","في المركز المحدد على France-Visas. احتفظ بالتأكيد مطبوعًا."]},
{id:"r_fee",g:"steps",w:any,
 fr:["Frais de visa de long séjour","Le montant dépend du type de visa. Confirmez-le sur France-Visas avant de payer."],
 en:["Long-stay visa fee","The amount depends on the visa type. Confirm it on France-Visas before paying."],
 ar:["رسوم تأشيرة الإقامة الطويلة","يختلف المبلغ حسب نوع التأشيرة. تأكد منه على France-Visas قبل الدفع."]},
{id:"r_pass",g:"core",w:any,
 fr:["Passeport valide, original et copie des pages utiles","Avec des pages vierges. Ajoutez les anciens visas et tampons français."],
 en:["Valid passport, original and copy of the useful pages","With blank pages. Add previous visas and French stamps."],
 ar:["جواز سفر صالح، الأصل ونسخة من الصفحات المفيدة","به صفحات فارغة. أضف التأشيرات السابقة والأختام الفرنسية."]},
{id:"r_photos",g:"core",w:any,
 fr:["2 photos d'identité récentes","35 x 45 mm, en couleur, fond blanc ou très clair."],
 en:["2 recent passport photos","35 x 45 mm, colour, white or very light background."],
 ar:["صورتا هوية حديثتان","35 × 45 مم، ملوّنة، خلفية بيضاء أو فاتحة جدًا."]},
{id:"r_cin",g:"core",w:any,
 fr:["Copie de la carte d'identité nationale (CIN)",""],
 en:["Copy of the national ID card (CIN)",""],
 ar:["نسخة من بطاقة التعريف الوطنية",""]},
{id:"r_birth",g:"core",w:any,
 fr:["Acte de naissance, copie intégrale","Récent, avec filiation."],
 en:["Birth certificate, full copy","Recent, with filiation."],
 ar:["مضمون ولادة، نسخة كاملة","حديث، مع الأصول."]},
{id:"r_mar",g:"family",w:any,
 fr:["Acte de mariage, copie intégrale, et livret de famille",""],
 en:["Marriage certificate, full copy, and family record",""],
 ar:["عقد زواج، نسخة كاملة، ودفتر عائلي",""]},
{id:"r_child",g:"family",w:function(s){return s.party==="family"},
 fr:["Acte de naissance de chaque enfant et livret de famille","Chaque enfant doit avoir son propre passeport."],
 en:["Birth certificate of each child and family record","Each child needs their own passport."],
 ar:["مضمون ولادة لكل طفل ودفتر عائلي","يجب أن يملك كل طفل جواز سفره الخاص."]},
{id:"r_auth",g:"family",w:function(s){return s.party==="family"},
 fr:["Autorisation de l'autre parent, signature légalisée","Nécessaire si l'enfant rejoint la France avec un seul parent."],
 en:["Authorisation from the other parent, legalised signature","Needed if the child joins France with one parent only."],
 ar:["ترخيص من الوالد الآخر، بإمضاء مصادَق عليه","ضروري إذا التحق الطفل بفرنسا مع أحد والديه فقط."]},
{id:"r_transl",g:"core",w:any,opt:1,
 fr:["Traduction française assermentée des actes en arabe","Souvent exigée pour les actes rédigés en arabe."],
 en:["Sworn French translation of documents in Arabic","Often required for documents written in Arabic."],
 ar:["ترجمة فرنسية محلّفة للوثائق بالعربية","تُطلب غالبًا للوثائق المحرّرة بالعربية."]}
];
var ORDER=["steps","core","purpose","money","activity","stay","family"];
/* ===== Persistance versionnée (localStorage) =====
   Enveloppe : {v:<version>, t:<horodatage>, d:<état>}. Chaque changement de forme du schéma incrémente SCHEMA_V
   et ajoute une fonction dans MIGRATIONS (clé = version de départ). Données illisibles ou trop récentes :
   copie dans CORRUPT_KEY puis retour aux valeurs par défaut (jamais d'exécution de données non validées). */
var KEY="dossier-schengen-v2",SCHEMA_V=2,LEGACY_KEYS=["dossier-schengen-v1"],CORRUPT_KEY="dossier-schengen-corrupt";
var S_DEFAULT={lang:"fr",step:0,mode:"check",motive:"other",country:"fr",origin:"tn",gov:"",paid:false,pack:false,purpose:"tourism",status:"employee",party:"alone",stay:"hotel",pay:"self",done:{}};
var S=JSON.parse(JSON.stringify(S_DEFAULT));
var MIGRATIONS={
 1:function(d){return d} /* v1 -> v2 : même contenu, nouveau conteneur versionné ; le tri se fait dans sanitizeState */
};
function sanitizeState(o){
  var r=JSON.parse(JSON.stringify(S_DEFAULT));
  if(!o||typeof o!=="object"||Array.isArray(o))return r;
  ["lang","mode","motive","country","origin","gov","purpose","status","party","stay","pay","need","pgov","pt","agent","evc"].forEach(function(k){
    if(typeof o[k]==="string"&&o[k].length<=64&&/^[\w-]*$/.test(o[k]))r[k]=o[k]});
  if(typeof o.refus==="string")r.refus=o.refus.slice(0,300);
  if(typeof o.tok==="string"&&o.tok.length<=1024)r.tok=o.tok;
  ["paid","pack"].forEach(function(k){if(typeof o[k]==="boolean")r[k]=o[k]});
  ["step","back"].forEach(function(k){var n=o[k];if(typeof n==="number"&&isFinite(n)&&Math.floor(n)===n&&n>=0&&n<=13)r[k]=n});
  if(o.done&&typeof o.done==="object"&&!Array.isArray(o.done)){var c=0,id;for(id in o.done){if(/^[A-Za-z0-9_]{1,32}$/.test(id)&&o.done[id]===true&&c<300){r.done[id]=true;c++}}}
  if(["fr","en","ar"].indexOf(r.lang)<0)r.lang="fr";
  if(["tn","ma","dz"].indexOf(r.origin)<0)r.origin="tn";
  if(["check","appeal"].indexOf(r.mode)<0)r.mode="check";
  return r;
}
function readJson(k){var raw=localStorage.getItem(k);if(raw==null)return {raw:null};try{return {raw:raw,val:JSON.parse(raw)}}catch(e){return {raw:raw,bad:true}}}
function quarantine(raw,key){try{localStorage.setItem(CORRUPT_KEY,String(raw).slice(0,20000));localStorage.removeItem(key)}catch(e){}}
function migrate(d,from){var v=from;while(v<SCHEMA_V){d=(MIGRATIONS[v]||function(x){return x})(d);v++}return d}
function loadState(){
  try{
    var cur=readJson(KEY);
    if(cur.raw!=null){
      var e=cur.val;
      if(cur.bad||!e||typeof e!=="object"||typeof e.v!=="number"||!e.d||e.v<1||e.v>SCHEMA_V){quarantine(cur.raw,KEY);return null}
      return sanitizeState(migrate(e.d,e.v));
    }
    for(var i=0;i<LEGACY_KEYS.length;i++){
      var lg=readJson(LEGACY_KEYS[i]);
      if(lg.raw==null)continue;
      localStorage.removeItem(LEGACY_KEYS[i]);
      if(lg.bad){quarantine(lg.raw,LEGACY_KEYS[i]);return null}
      return sanitizeState(migrate(lg.val,1));
    }
  }catch(err){}
  return null;
}
(function(){var o=loadState();if(o){for(var k in o)S[k]=o[k]}})();
if(!UI[S.lang])S.lang="fr";
function save(){try{localStorage.setItem(KEY,JSON.stringify({v:SCHEMA_V,t:Date.now(),d:S}))}catch(e){}}
save(); /* écrit tout de suite l'état migré (l'ancienne clé a été supprimée) */
/* Effacement complet des données locales (bouton « tout effacer » à brancher si besoin). */
function wipeLocalData(){try{localStorage.removeItem(KEY);localStorage.removeItem(CORRUPT_KEY);LEGACY_KEYS.forEach(function(k){localStorage.removeItem(k)})}catch(e){}S=sanitizeState(null)}
var $=function(id){return document.getElementById(id)};
function chips(q,label){
  var t=UI[S.lang],h='<div class="q"><div class="q-label">'+label+'</div><div class="chips" role="group" aria-label="'+label+'">';
  Object.keys(t[q]).forEach(function(v){h+='<button type="button" class="chip" data-q="'+q+'" data-v="'+v+'" aria-pressed="'+(S[q]===v)+'">'+t[q][v]+'</button>'});
  return h+'</div></div>';
}
/* ===== Paiement et déblocage =====
   PAY_URL / PAY_URL2 : liens de paiement Flouci ou Paymee (10 DT conseillers, 20 DT pack recours).
   Les codes ne sont PLUS stockés dans cette page : ils sont vérifiés par votre serveur (voir ARCHITECTURE-SECURITE.md).
   UNLOCK_URL : adresse HTTPS de l'API, par exemple "https://api.votre-domaine.tn/v1/unlock". Vide = déblocage désactivé.
   UNLOCK_DEV_MODE : true uniquement pour tester sans serveur (compare l'empreinte SHA-256 du code ; jamais en production). */
var PAY_URL="";
var PAY_URL2="";
var UNLOCK_URL="https://visa-proxy.rabehfly.workers.dev/unlock";
var PACK_URL="https://visa-proxy.rabehfly.workers.dev/pack";
var UNLOCK_TIMEOUT_MS=8000;
var N48={fr:"Modification possible pendant 48 h maximum après la demande, uniquement sur les dates. Le nom et le prénom ne sont jamais modifiables. Passé ce délai, faites une nouvelle demande.",en:"Changes are possible for 48 hours maximum after your request, dates only. First and last name can never be changed. After that, make a new request.",ar:"يمكن التعديل خلال 48 ساعة كحد أقصى بعد الطلب، وللتواريخ فقط. لا يمكن أبدًا تعديل الاسم واللقب. بعد هذه المدة قدّم طلبًا جديدًا."};
function n48(l){l=l||S.lang;return '<p class="n48" role="note">'+(N48[l]||N48.fr)+'</p>'}
var NXT={fr:"Nous vous informerons dès que les moyens de paiement sécurisés seront disponibles. Vous pourrez ensuite confirmer votre réservation.",en:"We will let you know when secure payment methods are available. You can then confirm your booking.",ar:"سنُعلمك عند توفر وسائل الدفع الآمنة، لتتمكن بعدها من تأكيد الحجز."};
function d17Later(a){return '<div class="d17" role="region"><p>'+(NXT[S.lang]||NXT.fr)+'</p></div>'}
function paymentMethodsHtml(lang){
  var L=lang||S.lang;
  var T={
    fr:{title:"Moyens de paiement",soon:"Bientôt disponible",desc:"Les paiements en ligne sont en préparation. Aucun paiement n'est demandé pour le moment.",bill:"Adresse de facturation",billText:"Elle sera demandée au moment du paiement sécurisé. Aucune adresse ni donnée bancaire n'est collectée ici."},
    en:{title:"Payment methods",soon:"Coming soon",desc:"Online payments are being prepared. No payment is requested at this time.",bill:"Billing address",billText:"It will be requested during secure checkout. No address or banking details are collected here."},
    ar:{title:"وسائل الدفع",soon:"قريبًا",desc:"نعمل على تجهيز الدفع عبر الإنترنت. لا يُطلب أي دفع في الوقت الحالي.",bill:"عنوان الفوترة",billText:"سيُطلب عند إتمام الدفع الآمن. لا نجمع هنا أي عنوان أو بيانات بنكية."}
  };
  var t=T[L]||T.fr;
  return '<div class="d17 pay-panel" role="region" aria-label="'+t.title+'"><b class="d17-t">'+t.title+'</b>'+
    '<div class="pay-methods"><div class="pay-method pay-konnect"><span class="pay-mark" aria-hidden="true">K</span><span class="pay-brand"><b>Konnect</b><small>'+t.soon+'</small></span></div>'+
    '<div class="pay-method pay-flouci"><span class="pay-mark" aria-hidden="true">f</span><span class="pay-brand"><b>flouci</b><small>'+t.soon+'</small></span></div></div>'+
    '<p class="ag-note">'+t.desc+'</p><div class="billing-block"><b>'+t.bill+'</b><p>'+t.billText+'</p></div></div>';
}
function d17Html(k,amt){return paymentMethodsHtml();}

/* ===== Pages « Ma demande » : liens des mails (client, agence, Visa Checker) =====
   Le Worker garde la demande, vérifie le délai de 48 h et les droits de chaque lien : ces pages affichent et envoient. */
var ORDER_URL=UNLOCK_URL.replace(/\/unlock$/,"/order");
function ordRef(id){return "VC-"+String(id||"").replace(/[^A-Za-z0-9]/g,"").slice(0,6).toUpperCase()}
var OV={id:"",k:"",a:"pay",role:"",L:"fr",od:null};
var OVX={
fr:{loading:"Chargement…",bad:"Lien invalide ou expiré. Faites une nouvelle demande.",payT:"Confirmer et payer",editT:"Modifier mes dates",recap:"Votre demande",left:function(h){return "Il vous reste environ "+h+" h pour modifier vos dates."},expired:"Les 48 h sont dépassées : la modification n'est plus possible. Faites une nouvelle demande.",newReq:"Faire une nouvelle demande",save:"Enregistrer mes dates",saving:"Envoi…",saved:"Dates modifiées. L'agence a été prévenue.",err:"Dates invalides ou envoi impossible. Vérifiez puis réessayez.",goPay:"Continuer vers le paiement",goEdit:"Modifier mes dates",locked:"Le nom et le prénom ne sont pas modifiables.",check:"Vérifiez vos informations, puis payez.",wait:"Votre demande est bien reçue. L'agence fixe le prix : vous recevrez un e-mail dès qu'il est prêt.",amt:"Montant à payer",paid:"J'ai payé",claimed:"Paiement signalé. Nous vérifions et vous prévenons par e-mail.",ok:"Paiement confirmé ✓ L'agence prépare votre document.",sent:"Document envoyé ✓ Vérifiez vos e-mails."},
en:{loading:"Loading…",bad:"Invalid or expired link. Please make a new request.",payT:"Confirm and pay",editT:"Change my dates",recap:"Your request",left:function(h){return "You have about "+h+" h left to change your dates."},expired:"The 48 hours have passed: changes are no longer possible. Please make a new request.",newReq:"Make a new request",save:"Save my dates",saving:"Sending…",saved:"Dates changed. The agency has been informed.",err:"Invalid dates or sending failed. Check and try again.",goPay:"Continue to payment",goEdit:"Change my dates",locked:"First and last name cannot be changed.",check:"Check your details, then pay.",wait:"Your request has been received. The agency sets the price: you will get an e-mail as soon as it is ready.",amt:"Amount to pay",paid:"I have paid",claimed:"Payment reported. We are checking and will e-mail you.",ok:"Payment confirmed ✓ The agency is preparing your document.",sent:"Document sent ✓ Check your e-mails."},
ar:{loading:"جارٍ التحميل…",bad:"رابط غير صالح أو منتهي. قدّم طلبًا جديدًا.",payT:"تأكيد ودفع",editT:"تعديل التواريخ",recap:"طلبك",left:function(h){return "بقي لك حوالي "+h+" ساعة لتعديل التواريخ."},expired:"انقضت الـ 48 ساعة: لم يعد التعديل ممكنًا. قدّم طلبًا جديدًا.",newReq:"تقديم طلب جديد",save:"حفظ التواريخ",saving:"جارٍ الإرسال…",saved:"تم تعديل التواريخ وإبلاغ الوكالة.",err:"تواريخ غير صالحة أو تعذّر الإرسال. تحقق وأعد المحاولة.",goPay:"المتابعة إلى الدفع",goEdit:"تعديل التواريخ",locked:"لا يمكن تعديل الاسم واللقب.",check:"تحقق من بياناتك ثم ادفع.",wait:"تم استلام طلبك. تحدد الوكالة السعر وستصلك رسالة بريد فور جاهزيته.",amt:"المبلغ المطلوب",paid:"دفعت",claimed:"تم الإبلاغ عن الدفع. نتحقق وسنراسلك بالبريد.",ok:"تم تأكيد الدفع ✓ الوكالة تجهّز وثيقتك.",sent:"تم إرسال الوثيقة ✓ راجع بريدك."}
};
function ordShell(L,inner){
  var o=$("ordv");
  if(!o){o=document.createElement("div");o.id="ordv";o.className="ordv";document.body.appendChild(o)}
  o.setAttribute("dir",L==="ar"?"rtl":"ltr");o.setAttribute("lang",L);
  o.innerHTML='<div class="ordv-in">'+inner+'</div>';o.scrollTop=0;
  document.documentElement.classList.add("modal-open");
}
function ordClose(){
  var o=$("ordv");if(o&&o.parentNode)o.parentNode.removeChild(o);
  document.documentElement.classList.remove("modal-open");
  try{history.replaceState(null,"",location.pathname)}catch(e){}
}
function ordRecap(L,od){
  var R=RT[L]||RT.fr,X=OVX[L]||OVX.fr,hot=od.svc==="hotel",sh=function(x){return String(x).replace(/\s*\(.*?\)/g,"")};
  var rows=[[(R.svc&&R.svc[od.svc])||od.svc,od.dest+(od.city?" · "+od.city:"")],[sh(R.ln),od.ln],[sh(R.fn),od.fn],[sh(hot?R.d1h:R.d1f),fmtD(od.d1)],[sh(hot?R.d2h:R.d2f),od.d2?fmtD(od.d2):"-"]];
  /* Tarif affiché uniquement après activation du paiement. */
  rows.push(["Réf.",od.ref]);
  return '<div class="recap"><h2>'+X.recap+'</h2><dl>'+rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join("")+'</dl></div>';
}
function ordBad(){ordShell(OV.L,'<h1>Visa Checker</h1><p class="n48" role="alert">'+(OVX[OV.L]||OVX.fr).bad+'</p><button type="button" class="pay wide" data-ovnew>'+(OVX[OV.L]||OVX.fr).newReq+'</button>')}
/* ---- client : confirmer et payer ---- */
function ordPayView(){
  var L=OV.L,X=OVX[L],od=OV.od;
  var h='<h1>'+X.payT+'</h1><p class="rf-sub">'+X.check+'</p>'+ordRecap(L,od)+n48(L);
  if(od.status==="sent"){h+='<p class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>'+X.sent+'</b></p>'}
  else if(od.status==="paid"){h+='<p class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>'+X.ok+'</b></p>'}
  else h+=paymentMethodsHtml(L);
  if(od.canEdit)h+='<button type="button" class="reset wide" data-ovedit>'+X.goEdit+'</button>';
  ordShell(L,h);
}
/* ---- client : modifier les dates ---- */
function ordEditView(msg){
  var L=OV.L,X=OVX[L],R=RT[L]||RT.fr,od=OV.od,hot=od.svc==="hotel",sh=function(x){return String(x).replace(/\s*\(.*?\)/g,"")};
  if(!od.canEdit)return ordShell(L,'<h1>'+X.editT+'</h1><p class="n48" role="alert">'+X.expired+'</p>'+ordRecap(L,od)+'<button type="button" class="pay wide" data-ovnew>'+X.newReq+'</button>');
  var h='<h1>'+X.editT+'</h1><p class="rf-sub">'+X.left(od.hoursLeft)+'</p>'+ordRecap(L,od)+'<p class="ag-note">'+X.locked+'</p>'+n48(L)
   +'<div class="f-row"><div class="field"><label class="q-label" for="ov-d1">'+sh(hot?R.d1h:R.d1f)+'</label><input class="sel" id="ov-d1" type="date" min="'+today()+'" value="'+esc(od.d1)+'"></div>'
   +(od.d2?'<div class="field"><label class="q-label" for="ov-d2">'+sh(hot?R.d2h:R.d2f)+'</label><input class="sel" id="ov-d2" type="date" min="'+today()+'" value="'+esc(od.d2)+'"></div>':'')+'</div>'
   +'<span class="fe" id="ov-err" role="alert">'+(msg||"")+'</span><button type="button" class="pay wide" data-ovsave>'+X.save+'</button>'
   +'<button type="button" class="reset wide" data-ovpay>'+X.goPay+'</button>';
  ordShell(L,h);
}
function ordSentView(){
  var od=OV.od,h='<h1>Document envoyé ?</h1>'+ordRecap("fr",od);
  if(od.status==="sent")h+='<p class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>Document déjà marqué comme envoyé.</b></p>';
  else if(od.status==="paid")h+='<p class="rf-sub">Le paiement est confirmé. Envoyez le document au client, puis cliquez.</p><button type="button" class="pay wide" data-ovact="sent">J\'ai envoyé le document</button>';
  else h+='<p class="n48" role="alert">Le paiement n\'est pas encore confirmé : n\'envoyez pas le document.</p>';
  ordShell("fr",h);
}
/* ---- Visa Checker : paiement reçu ---- */
function ordConfirmView(){
  var od=OV.od,h='<h1>Paiement reçu ?</h1>'+ordRecap("fr",od);
  if(od.status==="paid"||od.status==="sent")h+='<p class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>Paiement déjà confirmé.</b></p>';
  else h+='<p class="rf-sub">Confirmez uniquement après vérification effective du paiement dans le compte du prestataire.</p><button type="button" class="pay wide" data-ovact="paid">Paiement vérifié et reçu</button>';
  ordShell("fr",h);
}
function ordView(){
  var r=OV.role,a=OV.a;
  if(r==="a")return ordSentView();
  if(r==="v")return ordConfirmView();
  return a==="edit"?ordEditView():ordPayView();
}
function ordLoad(){
  fetch(ORDER_URL+"?id="+encodeURIComponent(OV.id)+"&k="+encodeURIComponent(OV.k),{cache:"no-store"}).then(function(r){return r.json().catch(function(){return {}})}).then(function(j){
    if(!j||!j.ok||!j.order){ordBad();return}
    OV.od=j.order;OV.role=j.role||"c";if(OV.role==="c"&&OVX[j.order.lang])OV.L=j.order.lang;
    ordView();
  },ordBad);
}
function orderInit(){
  var q;try{q=new URLSearchParams(location.search)}catch(e){return}
  var id=q.get("order"),k=q.get("k");
  if(!id||!k||!/^[A-Za-z0-9_-]{8,64}$/.test(id)||!/^[a-f0-9]{16,64}$/.test(k))return;
  OV.id=id;OV.k=k;OV.L=S.lang;OV.a=q.get("a")||"pay";
  ordShell(OV.L,'<p>'+(OVX[OV.L]||OVX.fr).loading+'</p>');
  ordLoad();
}
function ordPost(path,body){
  body.id=OV.id;body.k=OV.k;
  return fetch(ORDER_URL+path,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)})
   .then(function(r){return r.json().catch(function(){return {}}).then(function(j){return {s:r.status,j:j}})});
}
document.addEventListener("click",function(e){
  var t=e.target.closest&&e.target.closest("[data-ovnew],[data-ovedit],[data-ovpay],[data-ovsave],[data-ovact]");
  if(!t)return;
  var X=OVX[OV.L]||OVX.fr;
  if(t.hasAttribute("data-ovnew")){ordClose();return}
  if(t.hasAttribute("data-ovedit")){ordEditView();return}
  if(t.hasAttribute("data-ovpay")){ordPayView();return}
  if(t.hasAttribute("data-ovact")){
    var act=t.getAttribute("data-ovact"),body={},er=$("ov-err");
    t.disabled=true;
    ordPost("/"+act,body).then(function(x){
      if(x.j&&x.j.ok){ordLoad();return}
      t.disabled=false;if(er)er.textContent="Action impossible. Rechargez la page.";
      if(!er)ordLoad();
    },function(){t.disabled=false;if(er)er.textContent="Pas de connexion. Réessayez."});
    return;
  }
  var d1=$("ov-d1"),d2=$("ov-d2");
  t.disabled=true;t.textContent=X.saving;
  ordPost("/edit",{date1:d1?d1.value:"",date2:d2?d2.value:""}).then(function(x){
     if(x.s===410){OV.od.canEdit=false;ordEditView();return}
     if(x.j&&x.j.ok){OV.od.d1=x.j.d1;OV.od.d2=x.j.d2;ordShell(OV.L,'<h1>'+X.editT+'</h1><p class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>'+X.saved+'</b></p>'+ordRecap(OV.L,OV.od)+'<button type="button" class="pay wide" data-ovpay>'+X.goPay+'</button>');return}
     ordEditView(X.err);
   },function(){ordEditView(X.err)});
});
setTimeout(orderInit,0);

var UNLOCK_DEV_MODE=false;
var UNLOCK_DEV_HASHES={advisors:[],pack:[]};
var UNX={
 fr:{format:"Code invalide : 4 à 32 caractères (lettres, chiffres, tiret).",bad:"Code incorrect ou déjà utilisé.",rate:"Trop d'essais. Réessayez dans quelques minutes.",timeout:"Le serveur met trop de temps à répondre. Réessayez.",network:"Pas de connexion. Vérifiez votre réseau puis réessayez.",server:"Service momentanément indisponible. Réessayez plus tard.",off:"Le déblocage n'est pas encore activé.",checking:"Vérification…"},
 en:{format:"Invalid code: 4 to 32 characters (letters, digits, hyphen).",bad:"Incorrect or already used code.",rate:"Too many attempts. Try again in a few minutes.",timeout:"The server is taking too long to answer. Try again.",network:"No connection. Check your network and try again.",server:"Service temporarily unavailable. Try again later.",off:"Unlocking is not enabled yet.",checking:"Checking…"},
 ar:{format:"رمز غير صالح: من 4 إلى 32 حرفًا (حروف وأرقام وشرطة).",bad:"الرمز غير صحيح أو مستعمل من قبل.",rate:"محاولات كثيرة. أعد المحاولة بعد دقائق.",timeout:"الخادم يتأخر في الرد. أعد المحاولة.",network:"لا يوجد اتصال. تحقق من الشبكة ثم أعد المحاولة.",server:"الخدمة غير متاحة مؤقتًا. أعد المحاولة لاحقًا.",off:"لم يتم تفعيل فتح الخدمة بعد.",checking:"جارٍ التحقق…"}
};
/* fetch JSON avec délai maximal ; ne lève jamais d'exception : renvoie {ok,status,data} ou {ok:false,status:0,err:"timeout"|"network"} */
function fetchJson(url,opts,ms){
  var ctl=typeof AbortController==="function"?new AbortController():null,timer=null,o=Object.assign({credentials:"omit",cache:"no-store"},opts);
  if(ctl){o.signal=ctl.signal;timer=setTimeout(function(){ctl.abort()},ms)}
  return fetch(url,o).then(function(r){
    clearTimeout(timer);
    return r.text().then(function(t){var d=null;try{d=t?JSON.parse(t):null}catch(e){}return {ok:r.ok,status:r.status,data:d}});
  },function(err){clearTimeout(timer);return {ok:false,status:0,err:(err&&err.name==="AbortError")?"timeout":"network"}});
}
function statusToErr(st){return st===429?"rate":(st===400||st===401||st===403||st===404||st===409||st===410||st===422)?"bad":"server"}
function sha256Hex(txt){
  if(!(window.crypto&&crypto.subtle))return Promise.reject(new Error("no-subtle"));
  return crypto.subtle.digest("SHA-256",new TextEncoder().encode(txt)).then(function(b){return Array.prototype.map.call(new Uint8Array(b),function(x){return ("0"+x.toString(16)).slice(-2)}).join("")});
}
/* kind : "advisors" (liste des agences) ou "pack" (pack recours). Renvoie une promesse {ok:true,token} ou {ok:false,err}. */
function verifyCode(kind,code){
  if(!UNLOCK_URL){
    if(!UNLOCK_DEV_MODE)return Promise.resolve({ok:false,err:"off"});
    return sha256Hex(code).then(function(h){return (UNLOCK_DEV_HASHES[kind]||[]).indexOf(h)>-1?{ok:true,token:"dev"}:{ok:false,err:"bad"}},function(){return {ok:false,err:"server"}});
  }
  return fetchJson(UNLOCK_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({kind:kind,code:code})},UNLOCK_TIMEOUT_MS).then(function(r){
    if(r.err)return {ok:false,err:r.err};
    if(r.ok&&r.data&&r.data.ok===true&&typeof r.data.token==="string")return {ok:true,token:r.data.token};
    return {ok:false,err:r.ok?"bad":statusToErr(r.status)};
  });
}
function doUnlock(kind,inputId,errId,btn){
  var X=UNX[S.lang],err=$(errId),code=($(inputId).value||"").trim().toUpperCase();
  err.setAttribute("role","alert");err.textContent="";$(inputId).setAttribute("aria-invalid","false");
  if(!/^[A-Z0-9-]{4,32}$/.test(code)){err.textContent=X.format;$(inputId).setAttribute("aria-invalid","true");$(inputId).focus();return}
  btn.disabled=true;btn.setAttribute("aria-busy","true");err.textContent=X.checking;
  verifyCode(kind,code).then(function(r){
    btn.disabled=false;btn.removeAttribute("aria-busy");
    if(!r.ok){err.textContent=X[r.err]||X.server;$(inputId).setAttribute("aria-invalid","true");return}
    if(kind==="advisors")S.paid=true;else{S.pack=true;S.tok=r.token;PACK_STATE="idle"}
    save();render();
  });
}
/* Les lettres du pack ne sont plus dans cette page : elles sont servies par le Worker (/pack) avec le jeton obtenu après un code valide. */
var PACK=[],PACK_STATE="idle";
var PKX={fr:{load:"Chargement du pack…",err:"Impossible de charger le pack. Vérifiez votre connexion.",retry:"Réessayer",exp:"Votre accès a expiré. Saisissez un nouveau code."},en:{load:"Loading the pack…",err:"Could not load the pack. Check your connection.",retry:"Retry",exp:"Your access has expired. Enter a new code."},ar:{load:"جارٍ تحميل الحزمة…",err:"تعذّر تحميل الحزمة. تحقق من اتصالك.",retry:"إعادة المحاولة",exp:"انتهت صلاحية وصولك. أدخل رمزاً جديداً."}};
function loadPack(){
  if(PACK_STATE==="loading"||PACK_STATE==="ok"||!S.pack||!S.tok||!PACK_URL)return;
  PACK_STATE="loading";
  fetchJson(PACK_URL,{method:"GET",headers:{"Accept":"application/json","Authorization":"Bearer "+S.tok}},UNLOCK_TIMEOUT_MS).then(function(r){
    if(r.ok&&r.data&&Array.isArray(r.data.pack)){PACK=r.data.pack.filter(function(p){return p&&typeof p.id==="string"&&p.t&&typeof p.body==="string"});PACK_STATE="ok"}
    else if(r.status===401||r.status===403){S.pack=false;S.tok="";PACK_STATE="expired";save()}
    else PACK_STATE="err";
    if(S.step===5)render();
  });
}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
function renderRefus(t){
  var L=S.lang,h='<h2>'+t.rfTitle+'</h2><p class="rf-sub">'+t.rfSub+'</p>';
  if(S.mode==="appeal")h+='<div class="book"><p>'+t.rfWarn+'</p></div>';
  if(!S.pack){
    if(PACK_STATE==="expired")h+='<p class="ag-err" role="alert">'+PKX[L].exp+'</p>';
    h+='<ul class="inc">'+t.rfInc.map(function(x){return '<li>'+x+'</li>'}).join("")+'</ul>';
    h+='<div><div class="price">'+t.rfPrice+'</div><p class="rf-sub">'+t.rfPriceSub+'</p></div>';
    h+=PAY_URL2?'<a class="pay" href="'+PAY_URL2+'" target="_blank" rel="noopener">'+t.rfPay+'</a>':d17Html("pack",20);
    h+='<div class="q"><label class="q-label" for="code2">'+t.codeLabel+'</label><div class="code-row"><input class="sel" id="code2" type="text" autocomplete="off" aria-describedby="err2" aria-invalid="false"><button type="button" class="reset" id="unlock2">'+t.unlock+'</button></div><span class="ag-err" id="err2" role="alert"></span></div>';
  }else{
    h+='<div class="act"><button type="button" class="pay wide" data-print="1">'+t.pdfBtn+'</button><p class="rf-sub">'+t.pdfHint+'</p>'+(SITE.email?'<a class="reset" href="mailto:'+SITE.email+'?subject='+encodeURIComponent("Visa Checker - Pack recours")+'">'+t.pdfMail+'</a>':'')+'</div>';
    h+='<h2>'+t.rfAdvTitle+'</h2><ol class="adv">'+t.adv.map(function(x){return '<li>'+x+'</li>'}).join("")+'</ol>';
    h+=anHtml();
    h+=aiHtml();
    h+='<h2>'+t.rfLetTitle+'</h2><p class="rf-sub">'+t.rfNote+'</p>';
    if(PACK_STATE!=="ok"){var K=PKX[L];loadPack();h+='<p class="rf-sub" role="status">'+(PACK_STATE==="err"?K.err:K.load)+'</p>'+(PACK_STATE==="err"?'<button type="button" class="reset" data-pkretry="1">'+K.retry+'</button>':'');$("refus").innerHTML=h;return}
    PACK.forEach(function(p){
      h+='<details class="lt"><summary>'+p.t[L]+'</summary><div class="lt-body"><pre class="letter" id="pk-'+p.id+'">'+esc(p.body)+'</pre><button type="button" class="cp" data-copy="'+p.id+'">'+t.copy+'</button> <button type="button" class="cp" data-pdf="'+p.id+'">'+({fr:"Enregistrer en PDF",en:"Save as PDF",ar:"حفظ بصيغة PDF"})[L]+'</button></div></details>';
    });
  }
  h+='<p class="ag-note">'+t.rfNoGuar+'</p>';
  $("refus").innerHTML=h;
}
function copyLetter(btn){
  var t=UI[S.lang],pre=$("pk-"+btn.dataset.copy);
  function pick(){var r=document.createRange();r.selectNodeContents(pre);var s=window.getSelection();s.removeAllRanges();s.addRange(r);btn.textContent=t.selected}
  function ok(){btn.textContent=t.copied;setTimeout(function(){btn.textContent=t.copy},1800)}
  try{navigator.clipboard.writeText(pre.textContent).then(ok,pick)}catch(e){pick()}
}
function C(id,fr,en,ar,ready){return {id:id,ready:!!ready,n:{fr:fr,en:en,ar:ar}}}
var COUNTRIES=[
 C("fr","France","France","فرنسا",true),
 C("de","Allemagne","Germany","ألمانيا",true),C("it","Italie","Italy","إيطاليا",true),C("es","Espagne","Spain","إسبانيا",true),
 C("be","Belgique","Belgium","بلجيكا",true),C("nl","Pays-Bas","Netherlands","هولندا",true),C("ch","Suisse","Switzerland","سويسرا",true),
 C("at","Autriche","Austria","النمسا",true),C("dk","Danemark","Denmark","الدنمارك",true),C("fi","Finlande","Finland","فنلندا",true),
 C("pt","Portugal","Portugal","البرتغال"),C("gr","Grèce","Greece","اليونان"),C("pl","Pologne","Poland","بولندا"),C("cz","Tchéquie","Czechia","التشيك"),
 C("hu","Hongrie","Hungary","المجر"),C("se","Suède","Sweden","السويد"),C("no","Norvège","Norway","النرويج"),C("mt","Malte","Malta","مالطا"),
 C("lu","Luxembourg","Luxembourg","لوكسمبورغ"),C("hr","Croatie","Croatia","كرواتيا"),C("si","Slovénie","Slovenia","سلوفينيا"),C("sk","Slovaquie","Slovakia","سلوفاكيا"),
 C("lt","Lituanie","Lithuania","ليتوانيا"),C("lv","Lettonie","Latvia","لاتفيا"),C("ee","Estonie","Estonia","إستونيا"),C("is","Islande","Iceland","آيسلندا"),
 C("li","Liechtenstein","Liechtenstein","ليختنشتاين"),C("bg","Bulgarie","Bulgaria","بلغاريا"),C("ro","Roumanie","Romania","رومانيا"),
 C("ca","Canada","Canada","كندا"),C("us","États-Unis","United States","الولايات المتحدة",true),C("gb","Royaume-Uni","United Kingdom","المملكة المتحدة"),
 C("ae","Émirats arabes unis","United Arab Emirates","الإمارات العربية المتحدة"),C("sa","Arabie saoudite","Saudi Arabia","السعودية"),
 C("jp","Japon","Japan","اليابان"),C("au","Australie","Australia","أستراليا"),C("nz","Nouvelle-Zélande","New Zealand","نيوزيلندا"),C("cn","Chine","China","الصين")
];
function G(id,fr,en,ar,h){return {id:id,n:{fr:fr,en:en,ar:ar},h:h||null}}
var GOVS=[
 G("tunis","Tunis","Tunis","تونس"),G("ariana","Ariana","Ariana","أريانة"),G("benarous","Ben Arous","Ben Arous","بن عروس"),G("manouba","Manouba","Manouba","منوبة"),
 G("nabeul","Nabeul","Nabeul","نابل",{fr:"Hammamet, Nabeul, Kélibia",en:"Hammamet, Nabeul, Kelibia",ar:"الحمامات، نابل، قليبية"}),
 G("zaghouan","Zaghouan","Zaghouan","زغوان"),G("bizerte","Bizerte","Bizerte","بنزرت"),G("beja","Béja","Beja","باجة"),G("jendouba","Jendouba","Jendouba","جندوبة"),
 G("kef","Le Kef","Kef","الكاف"),G("siliana","Siliana","Siliana","سليانة"),
 G("sousse","Sousse","Sousse","سوسة",{fr:"Sousse, Port El Kantaoui",en:"Sousse, Port El Kantaoui",ar:"سوسة، بورت القنطاوي"}),
 G("monastir","Monastir","Monastir","المنستير"),G("mahdia","Mahdia","Mahdia","المهدية"),G("sfax","Sfax","Sfax","صفاقس"),G("kairouan","Kairouan","Kairouan","القيروان"),
 G("kasserine","Kasserine","Kasserine","القصرين",{fr:"Kasserine, Feriana",en:"Kasserine, Feriana",ar:"القصرين، فريانة"}),
 G("sidibouzid","Sidi Bouzid","Sidi Bouzid","سيدي بوزيد"),G("gabes","Gabès","Gabes","قابس"),
 G("medenine","Médenine","Medenine","مدنين",{fr:"Djerba, Zarzis, Médenine",en:"Djerba, Zarzis, Medenine",ar:"جربة، جرجيس، مدنين"}),
 G("tataouine","Tataouine","Tataouine","تطاوين"),G("gafsa","Gafsa","Gafsa","قفصة"),G("tozeur","Tozeur","Tozeur","توزر"),G("kebili","Kébili","Kebili","قبلي")
];
/* Main towns shown in brackets after each governorate: [Latin names, Arabic names]. */
var TOWNS={
 tunis:["La Marsa, Carthage, Le Bardo","المرسى، قرطاج، باردو"],ariana:["Raoued, La Soukra, Sidi Thabet","رواد، سكرة، سيدي ثابت"],
 benarous:["Radès, Ezzahra, Hammam Lif","رادس، الزهراء، حمام الأنف"],manouba:["Den Den, Oued Ellil, Tebourba","دندان، وادي الليل، طبربة"],
 nabeul:["Hammamet, Kélibia, Korba, Grombalia","الحمامات، قليبية، قربة، قرمبالية"],zaghouan:["Zriba, Bir Mcherga, El Fahs","الزريبة، بئر مشارقة، الفحص"],
 bizerte:["Menzel Bourguiba, Mateur, Ras Jebel","منزل بورقيبة، ماطر، رأس الجبل"],beja:["Testour, Medjez el-Bab, Nefza","تستور، مجاز الباب، نفزة"],
 jendouba:["Tabarka, Aïn Draham, Bou Salem","طبرقة، عين دراهم، بوسالم"],kef:["Dahmani, Tajerouine, Sakiet Sidi Youssef","الدهماني، تاجروين، ساقية سيدي يوسف"],
 siliana:["Makthar, Bou Arada, Gaâfour","مكثر، بوعرادة، قعفور"],sousse:["Hammam Sousse, Msaken, Kalaa Kebira, Port El Kantaoui","حمام سوسة، مساكن، القلعة الكبرى، بورت القنطاوي"],
 monastir:["Moknine, Ksar Hellal, Jemmal, Skanes","المكنين، قصر هلال، جمال، سكانس"],mahdia:["El Jem, Chebba, Ksour Essef","الجم، الشابة، قصور الساف"],
 sfax:["Sakiet Ezzit, Mahres, Kerkennah","ساقية الزيت، المحرس، قرقنة"],kairouan:["Haffouz, Sbikha, Oueslatia","حفوز، سبيخة، الوسلاتية"],
 kasserine:["Feriana, Sbeitla, Thala","فريانة، سبيطلة، تالة"],sidibouzid:["Regueb, Meknassy, Jelma","الرقاب، المكناسي، جلمة"],
 gabes:["El Hamma, Mareth, Matmata","الحامة، مارث، مطماطة"],medenine:["Djerba, Zarzis, Ben Gardane","جربة، جرجيس، بن قردان"],
 tataouine:["Ghomrassen, Remada, Bir Lahmar","غمراسن، الرميلة، بئر الأحمر"],gafsa:["Métlaoui, Redeyef, Mdhilla","المتلوي، الرديف، المظيلة"],
 tozeur:["Nefta, Degache, Tamerza","نفطة، دقاش، تمغزة"],kebili:["Douz, Souk Lahad, Faouar","دوز، سوق الأحد، الفوار"]
};
GOVS.forEach(function(g){var x=TOWNS[g.id];g.h=x?{fr:x[0],en:x[0],ar:x[1]}:null});

/* ===== Autres pays Schengen : où déposer la demande en Tunisie (vérifié sur les pages officielles le 21-23 oct. 2026). =====
   Pour ajouter un pays : mettez ready:true dans COUNTRIES et ajoutez une entrée ici. site = page officielle, prov = centre de dépôt. */
var PROF={
 de:{prov:"VFS Global",site:"https://visa.vfsglobal.com/one-pager/germany/tunisia/english/",form:"de"},
 nl:{prov:"VFS Global",site:"https://visa.vfsglobal.com/tun/en/nld/",form:"nl"},
 ch:{prov:"VFS Global",site:"https://visa.vfsglobal.com/tun/en/che"},
 at:{prov:"VFS Global",site:"https://visa.vfsglobal.com/one-pager/austria/tunisia/english/"},
 fi:{prov:"VFS Global",site:"https://visa.vfsglobal.com/one-pager/Finland/Tunisia/English/"},
 dk:{prov:"VFS Global",site:"https://visa.vfsglobal.com/tun/en/"},
 es:{prov:"BLS Spain Visa",site:"https://tunisia.blsspainvisa.com"},
 be:{prov:"TLScontact",site:"https://be.tlscontact.com/tn/tun/index.php?l=fr"},
 it:{prov:"",site:"https://ambtunisi.esteri.it"}
};
var FORMN={
 de:{fr:"Remplissez-le sur le portail Videx (videx.diplo.de) et imprimez-le avec son code-barres.",en:"Complete it on the Videx portal (videx.diplo.de) and print it with its barcode.",ar:"املأه على بوابة Videx (videx.diplo.de) واطبعه مع الرمز الشريطي."},
 nl:{fr:"Remplissez le formulaire en ligne vous-même pour obtenir un code unique, puis imprimez-le et signez. N'utilisez pas le formulaire de quelqu'un d'autre.",en:"Complete the online form yourself to get a unique code, then print and sign it. Do not use someone else's form.",ar:"املأ الاستمارة الإلكترونية بنفسك للحصول على رمز فريد، ثم اطبعها ووقّعها. لا تستعمل استمارة شخص آخر."},
 d:{fr:"Utilisez le formulaire indiqué sur le site officiel du centre de dépôt, imprimez-le et signez-le.",en:"Use the form shown on the application centre's official website, then print and sign it.",ar:"استعمل الاستمارة المذكورة على الموقع الرسمي لمركز الإيداع، ثم اطبعها ووقّعها."}
};
var MAIN={fr:" Déposez la demande auprès du pays où vous passez le plus de nuits (ou du pays d'entrée si les séjours sont égaux).",en:" Apply to the country where you will spend the most nights (or your first country of entry if the stays are equal).",ar:" قدّم الطلب إلى الدولة التي ستقضي فيها أكثر الليالي (أو دولة الدخول الأولى إن تساوت المدد)."};
var PX={
 appealOther:{fr:["Recours après un refus","Chaque pays Schengen a sa propre procédure. Suivez les instructions de la décision de refus.","—"],en:["Appeal after a refusal","Each Schengen country has its own procedure. Follow the instructions in the refusal decision."],ar:["الطعن بعد الرفض","لكل دولة شنغن إجراؤها الخاص. اتبع التعليمات الواردة في قرار الرفض."]},
 msg0:{fr:"Commencez par le formulaire de visa officiel.",en:"Start with the official visa application form.",ar:"ابدأ باستمارة التأشيرة الرسمية."},
 link:{fr:"Site officiel du dépôt de demande",en:"Official application page",ar:"الصفحة الرسمية لتقديم الطلب"}
};
var ITEM0={};
/* Points d'attention : documents souvent refusés ou mal préparés (affichés en orange tant qu'ils ne sont pas cochés). */
var ATTN={photos:1,bank:1,insurance:1,flight:1,passport:1};
var STX={
 fr:{ok:"Prêt",warn:"Point d'attention",todo:"À faire",rec:"Conseillé",legend:"Légende",att:function(n){return n+(n>1?" points d'attention":" point d'attention")},step:function(n){return "Étape "+n+" sur 3"},prog:"Avancement du dossier"},
 en:{ok:"Ready",warn:"Watch out",todo:"To do",rec:"Advised",legend:"Legend",att:function(n){return n+(n>1?" points to watch":" point to watch")},step:function(n){return "Step "+n+" of 3"},prog:"File progress"},
 ar:{ok:"جاهز",warn:"انتبه",todo:"للإنجاز",rec:"مُستحسن",legend:"دليل الألوان",att:function(n){return n+" نقاط للانتباه"},step:function(n){return "الخطوة "+n+" من 3"},prog:"تقدّم الملف"}
};
/* Avertissement général (accueil, e-Visa, billets/hôtels) : ne cite aucun site propre à la France. */
var GENDISC={
  fr:"Les conditions d'entrée peuvent évoluer. Confirmez toujours les informations sur le site officiel du pays concerné. Cet outil aide à préparer le dossier et ne garantit pas l'obtention du visa. Il n'est lié à aucune ambassade. Passez uniquement par le portail officiel et méfiez-vous des intermédiaires qui promettent des facilités.",
  en:"Entry requirements can change. Always confirm the information on the official website of the country concerned. This tool helps you prepare your file and does not guarantee a visa. It is not affiliated with any embassy. Use the official portal only, and be wary of intermediaries who promise shortcuts.",
  ar:"قد تتغير شروط الدخول. تأكد دائمًا من المعلومات على الموقع الرسمي للبلد المعني. هذه الأداة تساعدك على تحضير ملفك ولا تضمن الحصول على التأشيرة، وهي غير تابعة لأي سفارة. اعتمد البوابة الرسمية فقط واحذر من الوسطاء الذين يعدون بتسهيلات."
};
function applyCountry0(t){
  var cur=curC(),P=PROF[cur.id],L=S.lang,i;
  ["fv","appt","fee"].forEach(function(id){for(i=0;i<ITEMS.length;i++){if(ITEMS[i].id===id){if(!ITEM0[id])ITEM0[id]={fr:ITEMS[i].fr,en:ITEMS[i].en,ar:ITEMS[i].ar}}}});
  var by={};ITEMS.forEach(function(it){by[it.id]=it});
  if(cur.id==="fr"||!P){["fv","appt","fee"].forEach(function(id){if(ITEM0[id]&&by[id]){by[id].fr=ITEM0[id].fr;by[id].en=ITEM0[id].en;by[id].ar=ITEM0[id].ar}});return t}
  var n=cur.n,fn=FORMN[P.form]||FORMN.d,prov=P.prov;
  by.fv.fr=["Formulaire de demande de visa Schengen ("+n.fr+"), rempli, imprimé et signé",fn.fr+MAIN.fr];
  by.fv.en=["Schengen visa application form ("+n.en+"), completed, printed and signed",fn.en+MAIN.en];
  by.fv.ar=["استمارة طلب تأشيرة شنغن ("+n.ar+")، مملوءة ومطبوعة وموقّعة",fn.ar+MAIN.ar];
  by.appt.fr=[prov?"Rendez-vous au centre de dépôt ("+prov+") et confirmation imprimée":"Rendez-vous ou dépôt selon la procédure de l'ambassade, et confirmation imprimée","Réservez vous-même sur le site officiel, un rendez-vous par personne. Présence en personne et empreintes digitales. Demande jusqu'à 6 mois avant le départ et au moins 15 jours avant."];
  by.appt.en=[prov?"Appointment at the application centre ("+prov+") and printed confirmation":"Appointment or submission following the embassy's procedure, and printed confirmation","Book it yourself on the official website, one appointment per person. You must attend in person and give fingerprints. Apply up to 6 months before departure and at least 15 days before."];
  by.appt.ar=[prov?"موعد في مركز الإيداع ("+prov+") وتأكيد مطبوع":"موعد أو إيداع حسب إجراءات السفارة وتأكيد مطبوع","احجز بنفسك على الموقع الرسمي، موعد لكل شخص. الحضور شخصيًا وبصمات الأصابع مطلوبان. قدّم الطلب قبل السفر بـ6 أشهر كحد أقصى وبـ15 يومًا على الأقل."];
  by.fee.fr=["Frais de visa et frais de service du centre de dépôt","Les montants et le mode de paiement sont indiqués sur le site officiel. Ils changent : confirmez-les avant votre rendez-vous."];
  by.fee.en=["Visa fee and application centre service fee","Amounts and payment method are shown on the official website. They change: confirm them before your appointment."];
  by.fee.ar=["رسوم التأشيرة ورسوم خدمة مركز الإيداع","المبالغ وطريقة الدفع مذكورة على الموقع الرسمي. وهي تتغير: تأكد منها قبل موعدك."];
  var o=Object.assign({},t);
  o.msg0=PX.msg0[L];o.linkFV=PX.link[L]+" · "+n[L];
  o.disc=t.disc.replace("France-Visas et auprès de TLScontact","le site officiel de "+n.fr+" et du centre de dépôt").replace("France-Visas and with TLScontact","the official website of "+n.en+" and the application centre").replace("France-Visas ولدى TLScontact","الموقع الرسمي لدولة "+n.ar+" ومركز الإيداع");
  return o;
}
/* Partner agencies by governorate id. Despina Travel and Events is an example entry: edit or remove it. */
var PARTNERS={
 nabeul:[{id:"despina",name:"Despina Travel and Events",city:"Hammamet",svc:["flight","hotel"],what:{fr:"Réservations d'hôtel et de vol",en:"Hotel and flight reservations",ar:"حجوزات الفنادق والطيران"},adv:{fr:"Conseil pour votre dossier de visa",en:"Advice on your visa file",ar:"نصائح لملف التأشيرة"},contact:"",email:"despinatravelandevents@gmail.com",telegram:"",whatsapp:""}]
};
/* Agences : la liste ci-dessus sert de secours ; partners.json (même dossier) la remplace s'il est valide. */
function cleanPartners(j){
  var out={},n=0;if(!j||typeof j!=="object"||!j.partners||typeof j.partners!=="object")return null;
  function str(v,m){return typeof v==="string"?cleanTxt(v).slice(0,m):""}
  function tri(o,f){var r={};["fr","en","ar"].forEach(function(l){r[l]=str(o&&o[l],120)||f||""});return r}
  Object.keys(j.partners).slice(0,60).forEach(function(g){
    if(!/^[a-z0-9-]{1,30}$/.test(g)||!Array.isArray(j.partners[g]))return;
    var l=[];j.partners[g].slice(0,20).forEach(function(p){
      if(!p||typeof p!=="object"||p.soon||!/^[a-z0-9-]{1,40}$/.test(p.id||"")||!str(p.name,80))return;
      var em=str(p.email,120);if(em&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em))em="";
      var svc=(Array.isArray(p.svc)?p.svc:[]).filter(function(x){return x==="flight"||x==="hotel"});if(!svc.length)return;
      var w=tri(p.what),ad=tri(p.adv);w.ar=w.ar||w.fr;
      l.push({id:p.id,name:str(p.name,80),city:str(p.city,60),svc:svc,what:w,adv:ad,contact:str(p.contact,120),email:em,telegram:str(p.telegram,60).replace(/[^\w@.]/g,""),whatsapp:str(p.whatsapp,30).replace(/[^\d+]/g,"")});n++});
    if(l.length)out[g]=l});
  return n?out:null;
}
function loadPartners(){
  try{var c=new AbortController(),tm=setTimeout(function(){c.abort()},6000);
    fetch("partners.json",{signal:c.signal,cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(j){clearTimeout(tm);var p=cleanPartners(j);if(p){PARTNERS=p;if(S.step===8)render()}}).catch(function(){})}catch(e){}
}
/* Avis : les avis viennent uniquement de reviews.json (vrais clients, avec leur accord). Rien n'est inventé. */
var REVIEWS=[],rvSig="";
var RVT={
 fr:{t:"Avis de nos voyageurs",none:"Vous avez utilisé Visa Checker ? Partagez votre expérience, elle aidera d'autres voyageurs.",cta:"Laisser un avis",of:"sur 5",n:function(n){return n+(n>1?" avis":" avis")},prev:"Avis précédents",next:"Avis suivants",sub:"Visa Checker - Mon avis",body:"Ma note (1 à 5) : \nMon avis : \nMon prénom : \n\nJ'accepte que mon avis soit publié sur le site."},
 en:{t:"Traveller reviews",none:"Used Visa Checker? Share your experience, it will help other travellers.",cta:"Leave a review",of:"out of 5",n:function(n){return n+(n>1?" reviews":" review")},prev:"Previous reviews",next:"Next reviews",sub:"Visa Checker - My review",body:"My rating (1 to 5): \nMy review: \nMy first name: \n\nI agree that my review is published on the site."},
 ar:{t:"آراء المسافرين",none:"هل استعملت Visa Checker؟ شاركنا تجربتك، فهي تساعد مسافرين آخرين.",cta:"اترك رأيك",of:"من 5",n:function(n){return n+" تقييم"},prev:"الآراء السابقة",next:"الآراء التالية",sub:"Visa Checker - رأيي",body:"تقييمي (من 1 إلى 5): \nرأيي: \nاسمي الأول: \n\nأوافق على نشر رأيي في الموقع."}
};
function cleanReviews(j){
  if(!j||!Array.isArray(j.reviews))return [];
  var out=[];
  j.reviews.slice(0,12).forEach(function(r){
    if(!r||typeof r!=="object")return;
    var rt=Math.round(Number(r.rating)),nm=typeof r.name==="string"?cleanTxt(r.name).slice(0,40):"",tx={};
    if(typeof r.text==="string")tx={fr:r.text,en:r.text,ar:r.text};else if(r.text&&typeof r.text==="object")tx=r.text;
    ["fr","en","ar"].forEach(function(l){tx[l]=typeof tx[l]==="string"?cleanTxt(tx[l]).slice(0,320):""});
    if(!(rt>=1&&rt<=5)||!nm||!(tx.fr||tx.en||tx.ar))return;
    out.push({rating:rt,name:nm,text:tx,place:typeof r.place==="string"?cleanTxt(r.place).slice(0,40):""});
  });
  return out;
}
function starsHtml(n){var s="";for(var i=1;i<=5;i++)s+=i<=n?"★":"<i>★</i>";return '<span class="rv-stars" role="img" aria-label="'+n+' / 5" dir="ltr">'+s+'</span>'}
function renderReviews(){
  var el=$("reviews");if(!el)return;
  var on=S.step===0;el.hidden=!on;if(!on)return;
  var sig=S.lang+"|"+REVIEWS.length;if(sig===rvSig&&el.firstChild)return;rvSig=sig;
  var R=RVT[S.lang]||RVT.fr,L=S.lang,n=REVIEWS.length,h='';
  var mail=SITE.email?'<a class="pay rv-cta" href="mailto:'+SITE.email+'?subject='+encodeURIComponent(R.sub)+'&body='+encodeURIComponent(R.body)+'">'+R.cta+'</a>':'';
  if(!n){el.classList.add("empty");el.innerHTML='<h2 id="rv-t">'+R.t+'</h2><p class="rv-empty">'+R.none+'</p><div class="rv-nav solo">'+mail+'</div>';return}
  el.classList.remove("empty");
  var avg=REVIEWS.reduce(function(a,r){return a+r.rating},0)/n;
  h+='<div class="rv-head"><h2 id="rv-t">'+R.t+'</h2><div class="rv-sum">'+starsHtml(Math.round(avg))+'<span dir="ltr">'+avg.toFixed(1)+' '+R.of+'</span><span>· '+R.n(n)+'</span></div></div>';
  h+='<div class="rv-track" id="rv-track" tabindex="0">'+REVIEWS.map(function(r){
    return '<article class="rv-card">'+starsHtml(r.rating)+'<p>'+esc(r.text[L]||r.text.fr||r.text.en||r.text.ar)+'</p><div class="rv-by"><b>'+esc(r.name)+'</b><span>'+esc(r.place)+'</span></div></article>'}).join("")+'</div>';
  h+='<div class="rv-nav"><button type="button" class="rv-b" data-rv="-1" aria-label="'+R.prev+'">‹</button><button type="button" class="rv-b" data-rv="1" aria-label="'+R.next+'">›</button>'+mail+'</div>';
  el.innerHTML=h;
}
function loadReviews(){
  try{var c=new AbortController(),tm=setTimeout(function(){c.abort()},6000);
    fetch("reviews.json",{signal:c.signal,cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(j){clearTimeout(tm);REVIEWS=cleanReviews(j);rvSig="";renderReviews()}).catch(function(){})}catch(e){}
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-rv]");if(!b)return;var t=$("rv-track");if(t)t.scrollBy({left:(b.dataset.rv==="1"?1:-1)*(document.documentElement.dir==="rtl"?-1:1)*Math.min(320,t.clientWidth),behavior:"smooth"})});
/* Traducteurs assermentés : données reprises de la liste officielle du Consulat général de France à Tunis (valide au 10/06/2026). Format : [nom, ville, adresse, téléphones, e-mails, index du téléphone WhatsApp ou -1] */
var TR_SRC={date:"10/06/2026",url:"https://tn.diplomatie.gouv.fr/files/tn/files/Consulat/traducteurs-et-interpretes-assermentes-en-langue-francaise_liste-valide-au-10062026.pdf"};
var TR_CITY={"Tunis":[36.8065,10.1815],"Hammam Lif":[36.73,10.335],"La Soukra":[36.878,10.251],"La Marsa":[36.878,10.325],"Grombalia":[36.599,10.5],"Nabeul":[36.4561,10.7376],"Sousse":[35.8256,10.636],"Béja":[36.7256,9.1817],"Sfax":[34.7406,10.7603],"Djerba":[33.875,10.8575]};
var TR_DATA=[["Ines BEN AMOR","Hammam Lif","17 Rue Houcine Bouzaiene, 1er étage, 2050 Hammam Lif",["94 229 283","71 291 522","55 099 005"],["inesba.translator@mail.com","inesbenamor2016@yahoo.com"],-1],["Hend BEN SALEM","Tunis","63 Avenue Habib Bourguiba, Le Parnasse, bureau 507, 5e étage, 1000 Tunis",["98 215 462","29 913 664"],["Hend.bensalem@gmail.com"],-1],["Chaima GHAZOUANI","Tunis","35 Avenue de Paris, Immeuble Le Versailles, 5e étage, Tunis",["21 611 861","71 254 581"],["chaima_ghazouani@yahoo.fr"],-1],["Amel ZRIBI","Tunis","18 Rue Mahres, Jardins de l'Aouina, 2045 Tunis",["56 476 628","28 647 939"],["Serviceslinguist@gmail.com"],-1],["Badreddine SNOUSSI","Tunis","Résidence Rihab, bloc B, appartement 3, 43 Rue du Lac Malaren, Les Berges du Lac 1, Tunis",["98 320 193","26 750 318","52 279 211"],["snoussibadr@gmail.com"],0],["Hanen BEJAOUI","Tunis","Immeuble El Fatah, 6e étage, bureau 6-3, 71 Rue Jean Jaurès, Tunis",["54 276 914"],["hanenebejaoui@yahoo.fr"],-1],["Meriem BEN MESSAOUD","Tunis","105 Rue El Bacha, 1006 Tunis",["54 182 202"],["meriembenmessaoud15@gmail.com"],-1],["Marwa AYADI","La Soukra","Complexe Golf Center, bloc B, bureau 10, 1er étage, Avenue Fattouma Bourguiba, 2036 La Soukra, Ariana",["22 579 496"],["translation.web.agency@gmail.com"],-1],["Latifa AYADI HAKIM","Tunis","18 bis Rue Ibn El Khaldoun, 1000 Tunis",["71 354 267","71 332 308","92 816 817"],["ayadihakimlatifa@yahoo.fr"],-1],["Kamel LOUMI","Tunis","44 bis Avenue Bab Bnet, 1006 Tunis",["95 108 044"],["etudetradkam@gmail.com"],-1],["Hamida BARHOUMI","","",["98 771 779"],["hamidabarhoumi50@gmail.com"],-1],["Mohamed BEN CHIKHA","Tunis","63 Avenue Habib Bourguiba, Le Parnasse, bureau 301, 1001 Tunis",["22 098 518","25 815 045"],["traduitout@gmail.com"],-1],["Brahim BEN ROMDHANE","Tunis","43-45 Avenue Habib Bourguiba, Le Colisée, 5e étage, B517, 1000 Tunis",["71 241 707","22 696 048"],["Benromdhane.brahim2@gmail.com"],-1],["Lotfi BEN ROMDHANE","","",["54 685 052"],["lotfibr2014@gmail.com"],-1],["Samia BESBES","Tunis","63 Rue Radhia Haddad, Tunis",["71 340 580"],[],-1],["Najoua BETTOUZIA","Tunis","Centre Alyssa, bureau 45, Manar 1, Tunis",["97 299 817"],["Najoua.bettouzia@gmail.com"],-1],["Aymen CHALBI","La Marsa","3 Rue Tahar Ben Achour, 2070 La Marsa",["71 743 632"],[],-1],["Nizar DRIDI","Tunis","37 Rue Mokthar Attia, Tunis",["71 335 262","58 530 756"],["Nizar.dridi@planet.tn"],-1],["Asma KHLASS","Tunis","102 Rue Radhia Haddad (ex rue de Yougoslavie), impasse Guettar, 2e étage, 1001 Tunis",["71 336 946","54 873 329","26 497 217"],["s.traduction@gmail.com"],-1],["Alaeddine MAHOUECHI","","",["55 310 440"],["alamahouechi@gmail.com"],-1],["Ahmed SAID CHABBI","Tunis","28 Avenue Bab Bnet, 1006 Tunis",["71 563 673","28 672 807","98 347 509"],["traductionalios@gmail.com"],-1],["Narjes CHIKHAOUI","Grombalia","Place de la Révolution du 14 janvier, immeuble Bajli, route de Benikhaled, en face de la station Agil, 8030 Grombalia",["93 614 993","72 214 072"],[],-1],["Mouna M'HAMED","Nabeul","Avenue de France, Immeuble Chelbi, 2e étage, bureau 3, 8000 Nabeul",["55 500 360","36 452 350"],["traductionexpress3@gmail.com"],-1],["Emna BEN HAMOUDA","Sousse","14 Avenue de la République, Immeuble Jaiem Trocadéro, Sousse",["22 652 574"],["emnabenh71@yahoo.fr"],-1],["Saïd BEN LATIFA","Sousse","3 Rue Bechir Sfar, Immeuble Chelly, 2e étage, Sousse",["73 219 153"],[],-1],["Samir BOULILA","Béja","3 Rue Ferhat Hached, 9000 Béja",["98 444 038"],["Samirboulila90@gmail.com"],-1],["Anis BEN FREDJ","Sfax","Route de Tunis, km 0,5, Immeuble Zayatine, Médina, Sfax",["96 816 798","27 634 099"],["anis.bf@hotmail.com"],-1],["Asma BOUSSOFFARA","Djerba","Avenue Abdelhamid El Kadhi, 4180 Houmt Souk, Djerba",["75 620 111","97 742 616"],["asma.traductrice.assermentee@gmail.com"],-1],["Chiheb CHAÂBANE","Sfax","12 Avenue Hédi Chaker (au-dessus d'El Arem), 3000 Sfax",["27 838 385"],["chiheb.traducteur@gmail.com"],-1],["Monia DEKKEM","","",["92 604 633","24 731 633"],["dekkemmonia@gmail.com"],-1],["Imen ELFEKI","","",["29 474 721"],["ifeki29@gmail.com"],-1],["Waël KHABOU","Sfax","4 Rue Habib Maazoun, Bab Bhar, Immeuble Bourji, Sfax",["50 424 325","25 424 321"],["Waelkhabou995@gmail.com"],-1]];
var TRT={
 fr:{t:"Traducteurs assermentés en Tunisie",sub:function(d){return "Liste officielle du Consulat général de France à Tunis (valide au "+d+"), pour la traduction vers et depuis le français. Pour un autre pays Schengen, demandez à son ambassade ou à son consulat quelles traductions il accepte."},src:"Source",all:"Toutes les villes",unk:"Ville non précisée",near:"Près de moi",nearOff:"Position refusée ou indisponible.",n:function(n){return n+(n>1?" traducteurs":" traducteur")},call:"Appeler",wa:"WhatsApp",mail:"E-mail",map:"Voir sur la carte",more:function(n){return "Afficher tout ("+n+")"},less:"Réduire",city:"Filtrer par ville",appr:"Distances approximatives, calculées depuis le centre de la ville.",note:"Liste donnée à titre d'information par le consulat : elle ne remplace pas la vérification auprès des autorités locales. Pour corriger ou retirer une fiche, écrivez-nous."},
 en:{t:"Sworn translators in Tunisia",sub:function(d){return "Official list of the Consulate General of France in Tunis (valid on "+d+"), for translation to and from French. For another Schengen country, ask its embassy or consulate which translations it accepts."},src:"Source",all:"All cities",unk:"City not specified",near:"Near me",nearOff:"Location denied or unavailable.",n:function(n){return n+(n>1?" translators":" translator")},call:"Call",wa:"WhatsApp",mail:"E-mail",map:"View on map",more:function(n){return "Show all ("+n+")"},less:"Show less",city:"Filter by city",appr:"Approximate distances, measured from the city centre.",note:"List provided for information by the consulate: it does not replace checking with the local authorities. To correct or remove an entry, write to us."},
 ar:{t:"المترجمون المحلَّفون في تونس",sub:function(d){return "القائمة الرسمية للقنصلية العامة لفرنسا في تونس (سارية بتاريخ "+d+")، للترجمة من الفرنسية وإليها. بالنسبة لدولة شنغن أخرى، اسأل سفارتها أو قنصليتها عن الترجمات المقبولة."},src:"المصدر",all:"كل المدن",unk:"المدينة غير محددة",near:"الأقرب إليّ",nearOff:"تم رفض الموقع أو هو غير متاح.",n:function(n){return n+" مترجم"},call:"اتصال",wa:"واتساب",mail:"بريد إلكتروني",map:"عرض على الخريطة",more:function(n){return "عرض الكل ("+n+")"},less:"عرض أقل",city:"التصفية حسب المدينة",appr:"المسافات تقريبية، محسوبة من وسط المدينة.",note:"القائمة مقدَّمة للإعلام من القنصلية ولا تغني عن التحقق لدى السلطات المحلية. لتصحيح بطاقة أو حذفها، راسلنا."}
};
var TRS={q:"",pos:null,posErr:false,all:false},trSig="";
var TR_ALIAS={"tunis":"Tunis","تونس":"Tunis","lac":"Tunis","menzah":"Tunis","manar":"Tunis","bab bnet":"Tunis","sfax":"Sfax","صفاقس":"Sfax","sousse":"Sousse","سوسة":"Sousse","nabeul":"Nabeul","نابل":"Nabeul","hammamet":"Nabeul","الحمامات":"Nabeul","beja":"Béja","باجة":"Béja","djerba":"Djerba","jerba":"Djerba","جربة":"Djerba","houmt souk":"Djerba","medenine":"Djerba","la marsa":"La Marsa","marsa":"La Marsa","المرسى":"La Marsa","la soukra":"La Soukra","soukra":"La Soukra","ariana":"La Soukra","السكرة":"La Soukra","أريانة":"La Soukra","hammam lif":"Hammam Lif","ben arous":"Hammam Lif","حمام الأنف":"Hammam Lif","grombalia":"Grombalia","قرمبالية":"Grombalia"};
var TRX={
 fr:{ph:"Tapez votre ville…",hint:"Tapez votre ville pour voir les traducteurs assermentés près de chez vous",noRes:function(q){return "Aucun traducteur trouvé pour « "+q+" ». Essayez une ville proche ou le bouton « Près de moi »."}},
 en:{ph:"Type your city…",hint:"Type your city to see sworn translators near you",noRes:function(q){return "No translator found for “"+q+"”. Try a nearby city or the “Near me” button."}},
 ar:{ph:"اكتب مدينتك…",hint:"اكتب مدينتك لتظهر لك قائمة المترجمين المحلَّفين القريبين منك",noRes:function(q){return "لم نجد أي مترجم لـ «"+q+"». جرّب مدينة قريبة أو زر «الأقرب إليّ»."}}
};
function trNorm(v){return String(v||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/[^a-z0-9؀-ۿ ]+/g," ").replace(/\s+/g," ").trim()}
function trAlias(q){for(var k in TR_ALIAS){var n=trNorm(k);if(n===q||(q.length>=3&&n.indexOf(q)===0))return TR_ALIAS[k]}return ""}
function trTel(p){return "+216"+String(p).replace(/\D/g,"")}
function trKm(a,b,c,d){var r=Math.PI/180,x=(c-a)*r,y=(d-b)*r,h=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*r)*Math.cos(c*r)*Math.sin(y/2)*Math.sin(y/2);return 12742*Math.asin(Math.sqrt(h))}
function trResults(){
  var R=TRT[S.lang]||TRT.fr,X=TRX[S.lang]||TRX.fr,q=trNorm(TRS.q),rows=[];
  if(q.length<2&&!TRS.pos)return '<p class="trd-hint"><i aria-hidden="true">👆</i>'+X.hint+'</p>';
  var ac=q.length>=2?trAlias(q):"";
  TR_DATA.forEach(function(r){
    var c=TR_CITY[r[1]],km=(TRS.pos&&c)?trKm(TRS.pos[0],TRS.pos[1],c[0],c[1]):null,sc=0;
    if(q.length>=2){
      if(trNorm(r[1]).indexOf(q)>-1||(ac&&r[1]===ac))sc=1;else if(trNorm(r[2]).indexOf(q)>-1)sc=2;else if(trNorm(r[0]).indexOf(q)>-1)sc=3;else return;
    }
    rows.push({r:r,km:km,sc:sc});
  });
  rows.sort(function(a,b){return a.sc-b.sc||(a.km==null?1e9:a.km)-(b.km==null?1e9:b.km)});
  if(!rows.length)return '<p class="trd-none">'+X.noRes(esc(TRS.q.trim()))+'</p>';
  var total=rows.length,shown=TRS.all?rows:rows.slice(0,6);
  var h='<span class="trd-n">'+R.n(total)+(TRS.pos?' · '+R.appr:'')+(TRS.posErr?' · '+R.nearOff:'')+'</span><div class="trd-list">'+shown.map(function(x){
    var r=x.r,tel=r[3].map(function(p){return '<a href="tel:'+trTel(p)+'" dir="ltr">'+R.call+' '+esc(p)+'</a>'}).join("");
    var wa=r[5]>=0?'<a href="https://wa.me/'+trTel(r[3][r[5]]).slice(1)+'" rel="noopener" target="_blank">'+R.wa+'</a>':'';
    var ml=r[4].length?'<a href="mailto:'+escA(r[4][0])+'">'+R.mail+'</a>':'';
    var mp=r[2]?'<a href="https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(r[2]+", Tunisie")+'" rel="noopener" target="_blank">'+R.map+'</a>':'';
    return '<article class="trd-card"><div class="trd-top"><b>'+esc(r[0])+'</b><span class="trd-city">'+esc(r[1]||R.unk)+(x.km!=null?' <span class="trd-km">· ≈ '+Math.round(x.km)+' km</span>':'')+'</span></div>'+(r[2]?'<p class="trd-adr">'+esc(r[2])+'</p>':'')+'<div class="trd-act">'+tel+wa+ml+mp+'</div></article>'}).join("")+'</div>';
  if(total>6)h+='<button type="button" class="reset trd-more" id="trd-more">'+(TRS.all?R.less:R.more(total))+'</button>';
  return h;
}
function renderTrans(){
  var el=$("trans");if(!el)return;
  var on=S.step===0;el.hidden=!on;if(!on)return;
  var sig=S.lang+"|"+(TRS.pos?1:0);if(sig===trSig&&el.firstChild){var rs=$("trd-res");if(rs)rs.innerHTML=trResults();return}trSig=sig;
  var R=TRT[S.lang]||TRT.fr,X=TRX[S.lang]||TRX.fr,cities=Object.keys(TR_CITY).filter(function(c){return TR_DATA.some(function(r){return r[1]===c})});
  var h='<h2>'+R.t+'</h2><p class="trd-sub">'+R.sub(TR_SRC.date)+'</p>';
  h+='<div class="trd-search"><span class="trd-lens" aria-hidden="true">🔎</span><input id="trd-q" type="search" inputmode="search" autocomplete="off" enterkeyhint="search" list="trd-dl" placeholder="'+escA(X.ph)+'" aria-label="'+escA(X.ph)+'" value="'+escA(TRS.q)+'"><datalist id="trd-dl">'+cities.map(function(c){return '<option value="'+escA(c)+'">'}).join("")+'</datalist></div>';
  h+='<button type="button" class="reset trd-near" id="trd-near" aria-pressed="'+(TRS.pos?"true":"false")+'">📍 '+R.near+'</button>';
  h+='<div class="trd-res" id="trd-res" aria-live="polite">'+trResults()+'</div>';
  h+='<p class="trd-src">'+R.src+' : <a href="'+TR_SRC.url+'" rel="noopener" target="_blank">Consulat général de France à Tunis</a>. '+R.note+(SITE.email?' <a href="mailto:'+SITE.email+'?subject='+encodeURIComponent("Visa Checker - Traducteurs")+'">'+SITE.email+'</a>':'')+'</p>';
  el.innerHTML=h;
}
document.addEventListener("input",function(e){if(e.target&&e.target.id==="trd-q"){TRS.q=e.target.value;TRS.all=false;var rs=$("trd-res");if(rs)rs.innerHTML=trResults()}});
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("#trd-near,#trd-more");if(!b)return;
  if(b.id==="trd-more"){TRS.all=!TRS.all;var rs=$("trd-res");if(rs)rs.innerHTML=trResults();return}
  if(TRS.pos){TRS.pos=null;trSig="";renderTrans();return}
  if(!navigator.geolocation){TRS.posErr=true;trSig="";renderTrans();return}
  navigator.geolocation.getCurrentPosition(function(p){TRS.pos=[p.coords.latitude,p.coords.longitude];TRS.posErr=false;trSig="";renderTrans()},function(){TRS.posErr=true;trSig="";renderTrans()},{timeout:8000,maximumAge:600000})});

/* Bons plans : les offres viennent uniquement de deals.json (accords réels). Une offre expirée disparaît toute seule. */
var DEALS=[],BPN={cat:"",open:false},bpnSig="";
var BPT={
 fr:{t:"Bons plans et réductions partenaires",sub:"Des avantages négociés pour les utilisateurs de Visa Checker : agences de voyages locales, hôtels partenaires, transferts d'argent et cartes pour voyager.",all:"Tout",cat:{agence:"Agences de voyages",hotel:"Hôtels",transfert:"Transferts d'argent",carte:"Cartes et eSIM"},tag:{agence:"Agence",hotel:"Hôtel",transfert:"Transfert",carte:"Carte"},none:"Les premiers bons plans arrivent bientôt. Revenez nous voir !",noneCat:"Aucune offre dans cette catégorie pour le moment.",code:"Code promo",copy:"Copier",copied:"Copié ✓",go:"Profiter de l'offre",until:"Valable jusqu'au ",aff:"Lien partenaire : Visa Checker peut recevoir une commission, sans frais pour vous.",join:"Vous êtes une agence, un hôtel ou un service pour voyageurs ? Devenez partenaire.",joinBtn:"Devenir partenaire",disc:"Découvrir les bons plans",ptop:"Vous êtes une agence, un hôtel, un service ? ",jsub:"Visa Checker - Devenir partenaire",jbody:"Nom de l'établissement : \nVille / pays : \nType (agence, hôtel, transfert d'argent, carte) : \nOffre proposée aux utilisateurs : \nContact : "},
 en:{t:"Partner deals and discounts",sub:"Benefits negotiated for Visa Checker users: local travel agencies, partner hotels, money transfers and travel cards.",all:"All",cat:{agence:"Travel agencies",hotel:"Hotels",transfert:"Money transfers",carte:"Cards and eSIM"},tag:{agence:"Agency",hotel:"Hotel",transfert:"Transfer",carte:"Card"},none:"The first deals are coming soon. Check back!",noneCat:"No offers in this category for now.",code:"Promo code",copy:"Copy",copied:"Copied ✓",go:"Get the offer",until:"Valid until ",aff:"Partner link: Visa Checker may earn a commission, at no cost to you.",join:"Are you an agency, a hotel or a service for travellers? Become a partner.",joinBtn:"Become a partner",disc:"Discover the deals",ptop:"Agency, hotel or service? ",jsub:"Visa Checker - Become a partner",jbody:"Business name: \nCity / country: \nType (agency, hotel, money transfer, card): \nOffer for users: \nContact: "},
 ar:{t:"عروض وتخفيضات الشركاء",sub:"مزايا متفاوض عليها لمستخدمي Visa Checker: وكالات سفر محلية، فنادق شريكة، تحويل الأموال وبطاقات السفر.",all:"الكل",cat:{agence:"وكالات السفر",hotel:"الفنادق",transfert:"تحويل الأموال",carte:"البطاقات وeSIM"},tag:{agence:"وكالة",hotel:"فندق",transfert:"تحويل",carte:"بطاقة"},none:"أولى العروض قادمة قريبًا. عُد لزيارتنا!",noneCat:"لا توجد عروض في هذه الفئة حاليًا.",code:"رمز الخصم",copy:"نسخ",copied:"تم النسخ ✓",go:"استفد من العرض",until:"صالح حتى ",aff:"رابط شريك: قد يتلقى Visa Checker عمولة دون أي كلفة عليك.",join:"هل أنت وكالة أو فندق أو خدمة للمسافرين؟ كن شريكًا.",joinBtn:"كن شريكًا",disc:"اكتشف العروض",ptop:"وكالة أو فندق أو خدمة؟ ",jsub:"Visa Checker - كن شريكًا",jbody:"اسم المؤسسة: \nالمدينة / البلد: \nالنوع (وكالة، فندق، تحويل أموال، بطاقة): \nالعرض المقدَّم للمستخدمين: \nجهة الاتصال: "}
};
function cleanDeals(j){
  if(!j||!Array.isArray(j.deals))return [];
  var out=[],cats={agence:1,hotel:1,transfert:1,carte:1},now=new Date();now.setHours(0,0,0,0);
  function tri(v,m){var o={};if(typeof v==="string")v={fr:v,en:v,ar:v};v=v&&typeof v==="object"?v:{};["fr","en","ar"].forEach(function(l){o[l]=typeof v[l]==="string"?cleanTxt(v[l]).slice(0,m):""});return o}
  j.deals.slice(0,20).forEach(function(d,i){
    if(!d||typeof d!=="object"||!cats[d.category])return;
    var pn=typeof d.partner==="string"?cleanTxt(d.partner).slice(0,60):"",t=tri(d.title,90),ds=tri(d.desc,260),url=typeof d.url==="string"&&/^https:\/\/[^\s"'<>]+$/.test(d.url)?d.url:"";
    if(!pn||!(t.fr||t.en||t.ar))return;
    var code=typeof d.code==="string"&&/^[A-Za-z0-9_.\-]{2,30}$/.test(d.code)?d.code:"";
    var until="";if(typeof d.valid_until==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d.valid_until)){var e=new Date(d.valid_until+"T23:59:59");if(isNaN(e)||e<now)return;until=d.valid_until}
    out.push({id:"d"+i,cat:d.category,partner:pn,t:t,desc:ds,code:code,url:url,until:until,aff:!!d.affiliate,cond:tri(d.conditions,160)});
  });
  return out;
}
function bpnDate(s,L){var p=s.split("-"),d=new Date(+p[0],+p[1]-1,+p[2]);try{return d.toLocaleDateString(L==="ar"?"ar-TN":L==="en"?"en-GB":"fr-FR",{day:"numeric",month:"long",year:"numeric"})}catch(e){return s}}
var BPX={fr:{pick:"Choisissez une catégorie pour découvrir le bon plan"},en:{pick:"Pick a category to discover the deal"},ar:{pick:"اختر فئة لتكتشف العرض"}};
var BPI={agence:'<svg class="fl" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>',hotel:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20V6M3 16h18v4M21 16v-3a3 3 0 0 0-3-3h-7v6"/></svg>',transfert:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h14l-3-3M20 16H6l3 3"/></svg>',carte:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6" width="18" height="12" rx="2"/><path d="M3 10h18M7 15h4"/></svg>'};
function bpnCards(){
  var R=BPT[S.lang]||BPT.fr,X=BPX[S.lang]||BPX.fr,L=S.lang;
  if(!BPN.cat)return '<p class="bpn-hint"><i aria-hidden="true">👆</i>'+X.pick+'</p>';
  var list=DEALS.filter(function(d){return d.cat===BPN.cat});
  if(!list.length)return '<p class="bpn-note">'+R.noneCat+'</p>';
  return list.map(function(d){
    return '<article class="bpn-card" data-c="'+d.cat+'"><div class="bpn-top"><span class="bpn-tag">'+R.tag[d.cat]+'</span><b>'+esc(d.partner)+'</b></div><h3 class="bpn-t">'+esc(d.t[L]||d.t.fr||d.t.en||d.t.ar)+'</h3>'+((d.desc[L]||d.desc.fr)?'<p>'+esc(d.desc[L]||d.desc.fr||d.desc.en)+'</p>':'')+
      (d.code?'<div class="bpn-code"><span>'+R.code+'</span><code dir="ltr">'+esc(d.code)+'</code><button type="button" class="reset" data-bcopy="'+escA(d.code)+'">'+R.copy+'</button></div>':'')+
      ((d.cond[L]||d.cond.fr)?'<p class="bpn-note">'+esc(d.cond[L]||d.cond.fr)+'</p>':'')+
      (d.aff?'<p class="bpn-note">'+R.aff+'</p>':'')+
      '<div class="bpn-foot"><span>'+(d.until?R.until+bpnDate(d.until,L):'')+'</span>'+(d.url?'<a class="pay" href="'+escA(d.url)+'" target="_blank" rel="noopener sponsored">'+R.go+'</a>':'')+'</div></article>'}).join("");
}
function renderBpn(){
  renderPtop();
  var el=$("bpn");if(!el)return;
  var on=S.step===0;el.hidden=!on;if(!on)return;
  var sig=S.lang+"|"+DEALS.length+"|"+BPN.open;if(sig===bpnSig&&el.firstChild){var r0=$("bpn-res");if(r0)r0.innerHTML=bpnCards();return}bpnSig=sig;
  var R=BPT[S.lang]||BPT.fr;
  var join="";
  var h='<h2>'+R.t+'</h2><p class="bpn-sub">'+R.sub+'</p>';
  if(!DEALS.length){el.innerHTML=h+'<p class="bpn-note">'+R.none+'</p>'+join;return}
  if(!BPN.open){el.innerHTML=h+'<button type="button" class="pay bpn-cta bpn-disc" data-bpn-open="1">'+R.disc+'</button>';return}
  var cats=["agence","hotel","transfert","carte"].filter(function(c){return DEALS.some(function(d){return d.cat===c})});
  if(cats.indexOf(BPN.cat)<0)BPN.cat="";
  h+='<div class="bpn-tiles" role="group" aria-label="'+R.t+'">'+cats.map(function(c){return '<button type="button" class="bpn-tile" data-c="'+c+'" data-bpn="'+c+'" aria-pressed="'+(BPN.cat===c)+'"><span class="bpn-ic">'+BPI[c]+'</span>'+R.cat[c]+'</button>'}).join("")+'</div>';
  h+='<div class="bpn-res" id="bpn-res" aria-live="polite">'+bpnCards()+'</div>'+join;
  el.innerHTML=h;
}
function renderPtop(){
  var el=$("ptop");if(!el)return;
  var on=S.step===0&&SITE.email;el.hidden=!on;if(!on)return;
  var R=BPT[S.lang]||BPT.fr,sig=S.lang;if(el.dataset.sig===sig&&el.firstChild)return;el.dataset.sig=sig;
  el.innerHTML='<span class="ptop-t">'+R.ptop+'</span><a class="ptop-b" data-ptop="1" href="mailto:'+SITE.email+'?subject='+encodeURIComponent(R.jsub)+'&body='+encodeURIComponent(R.jbody)+'">'+R.joinBtn+'</a>';
}
function bpnSync(){document.querySelectorAll(".bpn-tile").forEach(function(t){t.setAttribute("aria-pressed",String(t.dataset.bpn===BPN.cat))});var rs=$("bpn-res");if(rs)rs.innerHTML=bpnCards()}
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&BPN.cat){BPN.cat="";bpnSync()}});
function loadDeals(){
  try{var c=new AbortController(),tm=setTimeout(function(){c.abort()},6000);
    fetch("deals.json",{signal:c.signal,cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(j){clearTimeout(tm);DEALS=cleanDeals(j);bpnSig="";renderBpn()}).catch(function(){})}catch(e){}
}
document.addEventListener("click",function(e){
  var sc=e.target.closest&&e.target.closest("[data-spc]");if(sc){var q=sc.dataset.spc.split(":");SPSEL[q[0]]=SPSEL[q[0]]===q[1]?"":q[1];spSync();return}
  var po=e.target.closest&&e.target.closest("[data-bpn-open]");if(po){BPN.open=true;bpnSig="";renderBpn();var tl=document.querySelector(".bpn-tiles");if(tl&&tl.scrollIntoView)tl.scrollIntoView({block:"center",behavior:"smooth"});return}
  var pt=e.target.closest&&e.target.closest("[data-ptop]");if(pt){try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(SITE.email)}catch(x){}var o=pt.textContent;pt.textContent="✓ "+SITE.email;setTimeout(function(){pt.textContent=o},3500);return}
  var f=e.target.closest&&e.target.closest("[data-bpn]");if(f){BPN.cat=(BPN.cat===f.dataset.bpn)?"":f.dataset.bpn;bpnSync();return}
  if(BPN.cat&&!(e.target.closest&&e.target.closest(".bpn-card"))){BPN.cat="";bpnSync();return}
  var b=e.target.closest&&e.target.closest("[data-bcopy]");if(!b)return;
  var R=BPT[S.lang]||BPT.fr,v=b.dataset.bcopy,ok=function(){b.textContent=R.copied;setTimeout(function(){b.textContent=R.copy},1800)};
  try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(v).then(ok,function(){})}else{var t=document.createElement("textarea");t.value=v;document.body.appendChild(t);t.select();document.execCommand("copy");document.body.removeChild(t);ok()}}catch(x){}
});
function nm(o){return o.n[S.lang]}
function curC(){return COUNTRIES.filter(function(c){return c.id===S.country})[0]||COUNTRIES[0]}
function eff(){if(S.purpose==="reunion")S.purpose="tourism";return S.motive==="medical"?"medical":S.purpose}
function flag(cc){return String(cc||"").replace(/./g,function(ch){return String.fromCodePoint(127397+ch.toUpperCase().charCodeAt(0))})}
var open=false,adaptOpen=false;
function adaptHtml(t){return '<details class="adapt"'+(adaptOpen?' open':'')+'><summary>'+t.adapt+'</summary><div class="adapt-body">'+destHtml(t)+panelHtml(t)+'</div></details>'}
function destHtml(t){
  return '<div class="field"><span class="q-label">'+t.s_motive+'</span><div class="mgrid" role="group" aria-label="'+t.s_motive+'">'+["medical","other"].map(function(v){return '<button type="button" class="mcard" data-v="'+v+'" aria-pressed="'+(S.motive===v)+'"><b>'+t.motive[v]+'</b><span>'+t.motiveHint[v]+'</span></button>'}).join("")+'</div></div>';
}
function modeHtml(t){
  var fr=curC().id==="fr";
  return '<div class="mode" role="group" aria-label="'+t.modeTitle+'">'+["check","appeal"].map(function(m){if(m==="appeal"&&!fr){var a=PX.appealOther[S.lang];return '<button type="button" class="mdcard" disabled><b>'+a[0]+'</b><span>'+a[1]+'</span></button>'}return '<button type="button" class="mdcard" data-m="'+m+'"><b>'+t.mode[m][0]+'</b><span>'+t.mode[m][1]+'</span></button>'}).join("")+'</div>';
}
var LOGO_HTML='<span class="logo" data-g="check"><svg class="logo-mk" viewBox="0 0 64 64" aria-hidden="true" focusable="false"><circle cx="32" cy="32" r="32" fill="var(--accent)"/><g class="g g-check"><path d="M37 5.5C17 7 4.5 22 6.2 38.5 7.7 50.5 17.5 58.8 29 59.4 19 54.5 11.8 44.5 12.8 33.2 13.9 20.6 23.5 10.6 37 5.5z" fill="var(--on-accent)"/><path fill="var(--on-accent)" transform="translate(43.5 19.5) rotate(45) scale(.95) translate(-12 -12)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/><path d="M19 39.5l10.5 11.5L53 26" fill="none" stroke="var(--on-accent)" stroke-width="8.2" stroke-linecap="round" stroke-linejoin="round"/></g><g class="g g-plane"><path fill="var(--on-accent)" transform="translate(32 32) rotate(45) scale(1.55) translate(-12 -12)" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></g><g class="g g-bed"><path fill="none" stroke="var(--on-accent)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" transform="translate(32 32) scale(1.9) translate(-12 -12)" d="M4 19V7M4 15h16v4M20 15v-3a3 3 0 0 0-3-3h-6v6"/></g></svg><span class="wm"><b>Visa</b> Checker</span></span>';
function setLogo(g){var b=$("brand");if(!b)return;if(!b.querySelector(".logo")){b.innerHTML=LOGO_HTML;b.setAttribute("aria-label","Visa Checker")}var l=b.querySelector(".logo");if(l.getAttribute("data-g")!==g)l.setAttribute("data-g",g)}
function photoHtml(){
  var tx={fr:["Une voyageuse souriante tient son passeport devant le drapeau européen, la tour Eiffel et le Colisée","Partez l'esprit tranquille.","Un dossier complet, c'est un voyage qui commence bien."],en:["A smiling traveller holds her passport in front of the European flag, the Eiffel Tower and the Colosseum","Travel with peace of mind.","A complete file is a trip that starts well."],ar:["مسافرة مبتسمة تحمل جواز سفرها أمام العلم الأوروبي وبرج إيفل والكولوسيوم","سافر مطمئن البال.","ملف مكتمل يعني رحلة تبدأ بشكل جيد."]}[S.lang];
  return '<img class="hero-img" src="hero-voyage.jpg" width="1200" height="675" alt="'+tx[0]+'" decoding="async" fetchpriority="high"><figcaption><b>'+tx[1]+'</b><span>'+tx[2]+'</span></figcaption>';
}
/* ===== Pays du passeport (Tunisie, Maroc, Algérie) =====
   ORI_READY : destinations dont la liste de pièces est prête pour chaque pays de départ. Maroc et Algérie : vides tant que les listes ne sont pas vérifiées sur sources officielles. */
var ORIS=[{id:"tn",n:{fr:"Tunisie",en:"Tunisia",ar:"تونس"}},{id:"ma",n:{fr:"Maroc",en:"Morocco",ar:"المغرب"}},{id:"dz",n:{fr:"Algérie",en:"Algeria",ar:"الجزائر"}}];
var ORI_READY={ma:["fr","es","it"],dz:["fr","es","it"]};
var ORI_SOON={ma:{fr:"Cette destination n'est pas encore prête pour les voyageurs marocains : la liste des pièces est en cours de vérification sur les sources officielles.",en:"This destination is not ready yet for Moroccan travellers: the document list is being checked against official sources.",ar:"هذه الوجهة غير جاهزة بعد للمسافرين المغاربة: قائمة الوثائق قيد التحقق من المصادر الرسمية."},dz:{fr:"Cette destination n'est pas encore prête pour les voyageurs algériens : la liste des pièces est en cours de vérification sur les sources officielles.",en:"This destination is not ready yet for Algerian travellers: the document list is being checked against official sources.",ar:"هذه الوجهة غير جاهزة بعد للمسافرين الجزائريين: قائمة الوثائق قيد التحقق من المصادر الرسمية."}};
var TN_READY=COUNTRIES.filter(function(c){return c.ready}).map(function(c){return c.id});
/* ===== Listes de pièces par pays du passeport (Maroc, Algérie) : France, Espagne, Italie =====
   Établi le 03/11/2026 d'après les sites officiels (France-Visas, Capago, TLScontact, BLS Espagne, VFS Global, ambassades d'Italie à Rabat et Alger).
   Pas de montants ici : les frais changent, on renvoie au site officiel. À re-vérifier régulièrement. */
var ORI_DATE="03/11/2026";
var ORI_SITE={
 ma:{fr:"https://france-visas.gouv.fr/maroc",es:"https://blsspainmorocco.com/",it:"https://ambrabat.esteri.it/"},
 dz:{fr:"https://france-visas.gouv.fr/algerie",es:"https://algeria.blsspainvisa.com/",it:"https://visa.vfsglobal.com/dza/fr/ita"}
};
var ORI_NOTE={
 fr:"Liste vérifiée en novembre 2026 d'après les sites officiels (France-Visas, centres de dépôt, ambassades). Les règles et les frais changent : confirmez-les avant de déposer. Visa Checker ne garantit pas l'obtention du visa.",
 en:"List checked in November 2026 from official sources (France-Visas, application centres, embassies). Rules and fees change: confirm them before you apply. Visa Checker does not guarantee the visa.",
 ar:"تم التحقق من القائمة في نوفمبر 2026 اعتمادًا على المواقع الرسمية (France-Visas ومراكز الإيداع والسفارات). القواعد والرسوم تتغير: تأكد منها قبل التقديم. لا يضمن Visa Checker الحصول على التأشيرة."
};
var ORI_ITEMS={
 ma:{
  fr:{appt:{
   fr:["Rendez-vous TLScontact (Agadir, Casablanca, Fès, Marrakech, Oujda, Rabat ou Tanger) et confirmation imprimée","Réservez vous-même sur le site de TLScontact, un rendez-vous par personne. Dépôt en personne, avec relevé des empreintes. De 6 mois à 15 jours avant le départ. Vérifiez sur France-Visas le centre dont vous dépendez."],
   en:["TLScontact appointment (Agadir, Casablanca, Fès, Marrakech, Oujda, Rabat or Tangier) and printed confirmation","Book it yourself on the TLScontact website, one appointment per person. Submit in person, with fingerprints. From 6 months to 15 days before departure. Check on France-Visas which centre applies to you."],
   ar:["موعد في TLScontact (أكادير أو الدار البيضاء أو فاس أو مراكش أو وجدة أو الرباط أو طنجة) وتأكيد مطبوع","احجز بنفسك على موقع TLScontact، موعد لكل شخص. الإيداع حضوريًا مع أخذ البصمات. من 6 أشهر إلى 15 يومًا قبل السفر. تحقق في France-Visas من المركز الذي يتبع له ملفك."]},
   fee:{
   fr:["Frais de visa en dirhams (MAD) et frais de service TLScontact","Le visa se paie en dirhams selon le taux en vigueur. Ces frais ne sont pas remboursés en cas de refus. Les montants changent : confirmez-les sur France-Visas et TLScontact."],
   en:["Visa fee in dirhams (MAD) and TLScontact service fee","The visa is paid in dirhams at the current rate. These fees are not refunded if the visa is refused. Amounts change: confirm them on France-Visas and TLScontact."],
   ar:["رسوم التأشيرة بالدرهم (MAD) ورسوم خدمة TLScontact","تُدفع رسوم التأشيرة بالدرهم حسب السعر المعمول به، ولا تُسترجع في حالة الرفض. المبالغ تتغير: تأكد منها على France-Visas وTLScontact."]}},
  es:{appt:{
   fr:["Rendez-vous BLS Espagne (Agadir, Casablanca, Nador, Rabat, Tanger ou Tétouan) et confirmation imprimée","Réservez sur le site de BLS Espagne au Maroc. Dépôt en personne, avec photo et empreintes. À déposer au plus tard 15 jours avant le départ ; l'attente est souvent longue, prévoyez 1 à 3 mois."],
   en:["BLS Spain appointment (Agadir, Casablanca, Nador, Rabat, Tangier or Tetouan) and printed confirmation","Book on the BLS Spain Morocco website. Submit in person, with photo and fingerprints. Apply at least 15 days before departure; waits are often long, plan 1 to 3 months."],
   ar:["موعد في BLS إسبانيا (أكادير أو الدار البيضاء أو الناظور أو الرباط أو طنجة أو تطوان) وتأكيد مطبوع","احجز على موقع BLS إسبانيا في المغرب. الإيداع حضوريًا مع الصورة والبصمات. قدّم قبل السفر بـ15 يومًا على الأقل؛ الانتظار طويل غالبًا، فاحسب شهرًا إلى 3 أشهر."]},
   fee:{
   fr:["Frais de visa en dirhams (MAD) et frais de service BLS","Ils se paient généralement en espèces au centre et ne sont pas remboursés en cas de refus. Les montants changent selon le taux de l'euro : confirmez-les sur le site de BLS."],
   en:["Visa fee in dirhams (MAD) and BLS service fee","They are usually paid in cash at the centre and are not refunded if the visa is refused. Amounts change with the euro rate: confirm them on the BLS website."],
   ar:["رسوم التأشيرة بالدرهم (MAD) ورسوم خدمة BLS","تُدفع عادة نقدًا في المركز ولا تُسترجع في حالة الرفض. المبالغ تتغير حسب سعر الأورو: تأكد منها على موقع BLS."]}},
  it:{appt:{
   fr:["Dépôt auprès du prestataire désigné par l'Italie au Maroc, rendez-vous et confirmation imprimée","Le prestataire et les lieux de dépôt ont changé ces dernières années : vérifiez-les sur le site de l'ambassade d'Italie à Rabat avant de réserver. Dépôt en personne."],
   en:["Submission through the provider appointed by Italy in Morocco, appointment and printed confirmation","The provider and submission places have changed in recent years: check the website of the Italian Embassy in Rabat before booking. Submit in person."],
   ar:["الإيداع لدى المزوّد الذي عيّنته إيطاليا في المغرب، موعد وتأكيد مطبوع","تغيّر المزوّد وأماكن الإيداع في السنوات الأخيرة: تحقق من موقع سفارة إيطاليا في الرباط قبل الحجز. الإيداع حضوريًا."]},
   fee:{
   fr:["Frais de visa et frais de service du prestataire","Les montants changent : confirmez-les sur le site de l'ambassade d'Italie à Rabat et du prestataire. Non remboursés en cas de refus."],
   en:["Visa fee and provider service fee","Amounts change: confirm them on the Italian Embassy in Rabat website and the provider's website. Not refunded if the visa is refused."],
   ar:["رسوم التأشيرة ورسوم خدمة المزوّد","المبالغ تتغير: تأكد منها على موقع سفارة إيطاليا في الرباط وموقع المزوّد. لا تُسترجع في حالة الرفض."]}},
  all:{
   cin:{fr:["Copie de la carte nationale d'identité électronique (CNIE)",""],en:["Copy of the national electronic ID card (CNIE)",""],ar:["نسخة من بطاقة التعريف الوطنية الإلكترونية (CNIE)",""]},
   emp_cnss:{fr:["Attestation CNSS (ou carte CNOPS pour un fonctionnaire)","Montre une activité déclarée et stable."],en:["CNSS certificate (or CNOPS card for a civil servant)","Shows a declared and stable job."],ar:["شهادة الضمان الاجتماعي CNSS (أو بطاقة CNOPS للموظف العمومي)","تثبت نشاطًا مصرّحًا به ومستقرًا."]},
   self_reg:{fr:["Extrait du registre du commerce (modèle 7), statuts et attestation fiscale","Selon votre activité : ajoutez la déclaration fiscale et l'attestation de paiement des impôts."],en:["Trade register extract (model 7), articles of association and tax certificate","Depending on your activity: add the tax return and the tax payment certificate."],ar:["مستخرج السجل التجاري (نموذج 7) والقانون الأساسي وشهادة ضريبية","حسب نشاطك: أضف التصريح الضريبي وشهادة أداء الضرائب."]},
   med_file:{fr:["Dossier médical et rapport de votre médecin au Maroc","Diagnostic et raison du déplacement. Traduction assermentée si le document est en arabe."],en:["Medical file and report from your doctor in Morocco","Diagnosis and reason for travelling. Sworn translation if the document is in Arabic."],ar:["الملف الطبي وتقرير طبيبك في المغرب","التشخيص وسبب السفر. ترجمة محلّفة إن كانت الوثيقة بالعربية."]},
   transl:{
    fr:{fr:["Traduction française des documents en arabe","Exigée pour les pièces rédigées en arabe ; faites-la faire par un traducteur assermenté, c'est la solution la plus sûre."],en:["French translation of documents in Arabic","Required for documents written in Arabic; have it done by a sworn translator, which is the safest option."],ar:["ترجمة فرنسية للوثائق المكتوبة بالعربية","مطلوبة للوثائق بالعربية؛ اطلبها من مترجم محلّف، فهذا أضمن."]},
    es:{fr:["Traduction française ou espagnole des documents en arabe","Les documents doivent être en français ou en espagnol : joignez l'original arabe et sa traduction, faite de préférence par un traducteur assermenté."],en:["French or Spanish translation of documents in Arabic","Documents must be in French or Spanish: attach the Arabic original and its translation, preferably by a sworn translator."],ar:["ترجمة فرنسية أو إسبانية للوثائق بالعربية","يجب أن تكون الوثائق بالفرنسية أو الإسبانية: أرفق الأصل العربي وترجمته، ويُفضّل أن يقوم بها مترجم محلّف."]},
    it:{fr:["Traduction en italien des documents en arabe, apostilles si demandées","Selon la liste de l'ambassade d'Italie à Rabat : documents apostillés et pièces en arabe traduites en italien par un traducteur reconnu. Vérifiez la liste à jour avant de déposer."],en:["Italian translation of documents in Arabic, apostilles if requested","According to the Italian Embassy in Rabat list: apostilled documents and Arabic documents translated into Italian by a recognised translator. Check the current list before applying."],ar:["ترجمة إلى الإيطالية للوثائق بالعربية، مع الأبوستيل إن طُلب","حسب قائمة سفارة إيطاليا في الرباط: وثائق مصادق عليها بالأبوستيل ووثائق عربية مترجمة إلى الإيطالية من مترجم معتمد. تحقق من القائمة الحالية قبل التقديم."]}}}
 },
 dz:{
  fr:{appt:{
   fr:["Rendez-vous Capago (Alger, Oran, Annaba ou Constantine) et confirmation imprimée","Depuis avril 2025, Capago remplace VFS Global et TLScontact en Algérie pour la France. Réservez vous-même sur le site officiel de Capago : les intermédiaires n'ont aucun accès privilégié aux rendez-vous. Le centre dépend de votre lieu de résidence."],
   en:["Capago appointment (Algiers, Oran, Annaba or Constantine) and printed confirmation","Since April 2025, Capago replaces VFS Global and TLScontact in Algeria for France. Book yourself on the official Capago website: intermediaries have no privileged access to appointments. The centre depends on where you live."],
   ar:["موعد في Capago (الجزائر العاصمة أو وهران أو عنابة أو قسنطينة) وتأكيد مطبوع","منذ أفريل 2025 حلّت Capago محل VFS Global وTLScontact في الجزائر بخصوص فرنسا. احجز بنفسك على الموقع الرسمي لـCapago: الوسطاء لا يملكون أي أولوية في المواعيد. يتبع المركز مكان إقامتك."]},
   fee:{
   fr:["Frais de visa et frais de service Capago, en dinars algériens (DZD)","Les frais de visa ne sont pas remboursés en cas de refus. Les montants changent : confirmez-les sur France-Visas et sur le site de Capago avant le rendez-vous."],
   en:["Visa fee and Capago service fee, in Algerian dinars (DZD)","Visa fees are not refunded if the visa is refused. Amounts change: confirm them on France-Visas and the Capago website before your appointment."],
   ar:["رسوم التأشيرة ورسوم خدمة Capago بالدينار الجزائري (DZD)","رسوم التأشيرة لا تُسترجع في حالة الرفض. المبالغ تتغير: تأكد منها على France-Visas وموقع Capago قبل موعدك."]}},
  es:{appt:{
   fr:["Rendez-vous BLS Espagne (Alger ou Oran) et confirmation imprimée","Réservez sur le site de BLS Espagne en Algérie. Dépôt en personne uniquement, si vous voyagez dans les 90 prochains jours, au moins 15 jours avant le départ. Le centre dépend de votre lieu de résidence."],
   en:["BLS Spain appointment (Algiers or Oran) and printed confirmation","Book on the BLS Spain Algeria website. In-person submission only, if you travel within the next 90 days and at least 15 days before departure. The centre depends on where you live."],
   ar:["موعد في BLS إسبانيا (الجزائر العاصمة أو وهران) وتأكيد مطبوع","احجز على موقع BLS إسبانيا في الجزائر. الإيداع حضوريًا فقط، إذا كان سفرك خلال 90 يومًا القادمة وقبل 15 يومًا على الأقل من السفر. يتبع المركز مكان إقامتك."]},
   fee:{
   fr:["Frais de visa et frais de service BLS, en dinars algériens (DZD)","Paiement en espèces au centre, non remboursés en cas de refus. Les montants changent : confirmez-les sur le site de BLS."],
   en:["Visa fee and BLS service fee, in Algerian dinars (DZD)","Paid in cash at the centre, not refunded if the visa is refused. Amounts change: confirm them on the BLS website."],
   ar:["رسوم التأشيرة ورسوم خدمة BLS بالدينار الجزائري (DZD)","تُدفع نقدًا في المركز ولا تُسترجع في حالة الرفض. المبالغ تتغير: تأكد منها على موقع BLS."]}},
  it:{appt:{
   fr:["Rendez-vous VFS Global (Alger, Annaba, Constantine, Oran, Ghardaïa ou Tindouf) et confirmation imprimée","L'ambassade d'Italie indique que la demande se dépose chez VFS Global, en personne. Réservation en ligne sur le site de VFS Global (24 h/24) ou par téléphone au centre d'appels."],
   en:["VFS Global appointment (Algiers, Annaba, Constantine, Oran, Ghardaia or Tindouf) and printed confirmation","The Italian Embassy states the application is submitted at VFS Global, in person. Book online on the VFS Global website (24/7) or by phone with the call centre."],
   ar:["موعد في VFS Global (الجزائر العاصمة أو عنابة أو قسنطينة أو وهران أو غرداية أو تندوف) وتأكيد مطبوع","تذكر سفارة إيطاليا أن الطلب يُودع لدى VFS Global حضوريًا. الحجز عبر الإنترنت على موقع VFS Global (على مدار الساعة) أو هاتفيًا عبر مركز الاتصال."]},
   fee:{
   fr:["Frais de visa et frais de service VFS Global, en dinars algériens (DZD)","Non remboursés en cas de refus. Les montants changent : confirmez-les sur le site de l'ambassade d'Italie à Alger et de VFS Global."],
   en:["Visa fee and VFS Global service fee, in Algerian dinars (DZD)","Not refunded if the visa is refused. Amounts change: confirm them on the Italian Embassy in Algiers and VFS Global websites."],
   ar:["رسوم التأشيرة ورسوم خدمة VFS Global بالدينار الجزائري (DZD)","لا تُسترجع في حالة الرفض. المبالغ تتغير: تأكد منها على موقع سفارة إيطاليا في الجزائر وVFS Global."]}},
  all:{
   cin:{fr:["Copie de la carte nationale d'identité biométrique",""],en:["Copy of the biometric national ID card",""],ar:["نسخة من بطاقة التعريف الوطنية البيومترية",""]},
   emp_cnss:{fr:["Attestation d'affiliation à la sécurité sociale (CNAS)","Montre une activité déclarée et stable."],en:["Social security affiliation certificate (CNAS)","Shows a declared and stable job."],ar:["شهادة الانتساب للضمان الاجتماعي (CNAS)","تثبت نشاطًا مصرّحًا به ومستقرًا."]},
   self_reg:{fr:["Extrait du registre du commerce, NIF et attestation fiscale","Selon votre activité : ajoutez l'affiliation CASNOS et vos dernières déclarations."],en:["Trade register extract, tax ID (NIF) and tax certificate","Depending on your activity: add CASNOS affiliation and your latest returns."],ar:["مستخرج السجل التجاري والرقم الجبائي (NIF) وشهادة جبائية","حسب نشاطك: أضف الانتساب لـCASNOS وآخر تصريحاتك."]},
   med_file:{fr:["Dossier médical et rapport de votre médecin en Algérie","Diagnostic et raison du déplacement. Traduction assermentée si le document est en arabe."],en:["Medical file and report from your doctor in Algeria","Diagnosis and reason for travelling. Sworn translation if the document is in Arabic."],ar:["الملف الطبي وتقرير طبيبك في الجزائر","التشخيص وسبب السفر. ترجمة محلّفة إن كانت الوثيقة بالعربية."]},
   transl:{
    fr:{fr:["Traduction française certifiée des documents en arabe","Exigée pour les pièces rédigées en arabe : faites-la faire par un traducteur certifié."],en:["Certified French translation of documents in Arabic","Required for documents written in Arabic: have it done by a certified translator."],ar:["ترجمة فرنسية معتمدة للوثائق بالعربية","مطلوبة للوثائق المكتوبة بالعربية: اطلبها من مترجم معتمد."]},
    es:{fr:["Traduction française ou espagnole des documents en arabe","Les documents doivent être en français ou en espagnol : les originaux en arabe sont accompagnés d'une traduction."],en:["French or Spanish translation of documents in Arabic","Documents must be in French or Spanish: Arabic originals come with a translation."],ar:["ترجمة فرنسية أو إسبانية للوثائق بالعربية","يجب أن تكون الوثائق بالفرنسية أو الإسبانية: الأصول العربية تُرفق بترجمة."]},
    it:{fr:["Traduction en italien des documents en arabe, si demandée","Vérifiez sur le site de l'ambassade d'Italie à Alger quelles pièces doivent être traduites."],en:["Italian translation of documents in Arabic, if requested","Check on the Italian Embassy in Algiers website which documents must be translated."],ar:["ترجمة إلى الإيطالية للوثائق بالعربية عند الطلب","تحقق من موقع سفارة إيطاليا في الجزائر من الوثائق التي يجب ترجمتها."]}}}
 }
};
/* ===== Maroc et Algérie : Belgique, Pays-Bas, Suisse (vérifié sur les pages officielles le 07/11/2026) =====
   Allemagne, Autriche, Danemark, Finlande : pas encore ajoutés, les pages officielles n'étaient pas toutes lisibles. */
(function(){
  function I(f1,f2,e1,e2,a1,a2){return {fr:[f1,f2],en:[e1,e2],ar:[a1,a2]}}
  function F(p,wf,we,wa,xf,xe,xa){return {fr:["Frais de visa et frais de service "+p,"Les montants changent : confirmez-les sur "+wf+" et sur le site de "+p+". Non remboursés en cas de refus."+(xf||"")],en:["Visa fee and "+p+" service fee","Amounts change: confirm them on "+we+" and on the "+p+" website. Not refunded if the visa is refused."+(xe||"")],ar:["رسوم التأشيرة ورسوم خدمة "+p,"المبالغ تتغير: تأكد منها على "+wa+" وعلى موقع "+p+". لا تُسترجع في حالة الرفض."+(xa||"")]}}
  var TR=I("Traduction des documents en arabe, dans la langue acceptée","Les langues acceptées varient selon le pays : vérifiez la liste officielle avant de déposer. Une traduction faite par un traducteur assermenté est la solution la plus sûre.","Translation of documents in Arabic, in the accepted language","Accepted languages vary by country: check the official list before you apply. A translation by a sworn translator is the safest option.","ترجمة الوثائق المكتوبة بالعربية إلى اللغة المقبولة","تختلف اللغات المقبولة من بلد إلى آخر: تحقق من القائمة الرسمية قبل التقديم. الترجمة لدى مترجم محلّف هي الحل الأكثر أمانًا.");
  var N={
   ma:{
    be:{appt:I("Rendez-vous TLScontact (Rabat ou Casablanca) et confirmation imprimée","TLScontact reçoit les demandes de court séjour pour la Belgique. Rabat : tous les types de visa ; Casablanca : tous sauf les études. Empreintes relevées sur place. Déposez au moins 3 semaines et au plus 6 mois avant le départ ; en haute saison l'attente dépasse 2 semaines.","TLScontact appointment (Rabat or Casablanca) and printed confirmation","TLScontact takes short-stay applications for Belgium. Rabat: all visa types; Casablanca: all except studies. Fingerprints are taken on site. Apply at least 3 weeks and at most 6 months before departure; in high season the wait exceeds 2 weeks.","موعد في TLScontact (الرباط أو الدار البيضاء) وتأكيد مطبوع","تستقبل TLScontact طلبات الإقامة القصيرة لبلجيكا. الرباط: جميع أنواع التأشيرات؛ الدار البيضاء: جميعها عدا الدراسة. تُؤخذ البصمات في المركز. قدّم قبل السفر بـ3 أسابيع على الأقل وبحد أقصى 6 أشهر؛ في فترة الذروة يتجاوز الانتظار أسبوعين."),
        fee:F("TLScontact","le site de l'ambassade de Belgique","the Belgian Embassy website","موقع سفارة بلجيكا")},
    nl:{appt:I("Rendez-vous VFS Global (Rabat ou Tanger) et confirmation imprimée","Réservez vous-même, un rendez-vous par personne. Empreintes relevées en personne (sauf exceptions, par exemple si elles ont été prises dans les 59 derniers mois). Demande jusqu'à 6 mois avant le départ et au moins 15 jours calendaires avant. Vous ne pouvez déposer au Maroc que si vous y résidez.","VFS Global appointment (Rabat or Tangier) and printed confirmation","Book it yourself, one appointment per person. Fingerprints are taken in person (with exceptions, for example if taken within the last 59 months). Apply up to 6 months before departure and at least 15 calendar days before. You can apply in Morocco only if you live there.","موعد في VFS Global (الرباط أو طنجة) وتأكيد مطبوع","احجز بنفسك، موعد لكل شخص. تُؤخذ البصمات حضوريًا (مع استثناءات، مثلًا إذا أُخذت خلال آخر 59 شهرًا). قدّم حتى 6 أشهر قبل السفر وقبل 15 يومًا تقويميًا على الأقل. لا يمكنك الإيداع في المغرب إلا إذا كنت مقيمًا فيه."),
        fee:F("VFS Global","le site de l'ambassade des Pays-Bas","the Netherlands embassy website","موقع سفارة هولندا")},
    ch:{appt:I("Rendez-vous VFS Global Rabat et confirmation imprimée","Remplissez d'abord le formulaire en ligne, puis réservez un rendez-vous par personne chez VFS à Rabat. L'attente peut atteindre 8 semaines : prévoyez large.","VFS Global Rabat appointment and printed confirmation","Complete the online form first, then book one appointment per person with VFS in Rabat. Waits can reach 8 weeks: plan well ahead.","موعد في VFS Global الرباط وتأكيد مطبوع","املأ أولًا النموذج على الإنترنت، ثم احجز موعدًا لكل شخص لدى VFS في الرباط. قد يصل الانتظار إلى 8 أسابيع: احسب وقتًا كافيًا."),
        fee:F("VFS Global","le site de l'ambassade de Suisse","the Swiss Embassy website","موقع سفارة سويسرا")}
   },
   dz:{
    be:{appt:I("Rendez-vous TLScontact Alger et confirmation imprimée","Depuis le 1er juillet 2026, TLScontact reçoit à Alger les demandes pour la Belgique (71 rue Mohamed Belkacemi, El Madania) ; l'ambassade décide. Empreintes relevées au centre.","TLScontact Algiers appointment and printed confirmation","Since 1 July 2026, TLScontact takes applications for Belgium in Algiers (71 rue Mohamed Belkacemi, El Madania); the embassy decides. Fingerprints are taken at the centre.","موعد في TLScontact الجزائر وتأكيد مطبوع","منذ 1 جويلية 2026 تستقبل TLScontact في الجزائر العاصمة طلبات بلجيكا (71 شارع محمد بلقاسمي، المدنية)، والسفارة هي التي تقرر. تُؤخذ البصمات في المركز."),
        fee:F("TLScontact","le site de l'ambassade de Belgique","the Belgian Embassy website","موقع سفارة بلجيكا"," Les frais de service TLScontact se paient dans les 30 minutes après la réservation, sinon le rendez-vous est annulé."," The TLScontact service fee must be paid within 30 minutes of booking, otherwise the appointment is cancelled."," يجب دفع رسوم خدمة TLScontact خلال 30 دقيقة من الحجز وإلا أُلغي الموعد.")},
    nl:{appt:I("Rendez-vous VFS Global Alger et confirmation imprimée","Réservez vous-même, un rendez-vous par personne. Empreintes relevées en personne (sauf exceptions, par exemple si elles ont été prises dans les 59 derniers mois). Demande jusqu'à 6 mois avant le départ et au moins 15 jours calendaires avant.","VFS Global Algiers appointment and printed confirmation","Book it yourself, one appointment per person. Fingerprints are taken in person (with exceptions, for example if taken within the last 59 months). Apply up to 6 months before departure and at least 15 calendar days before.","موعد في VFS Global الجزائر العاصمة وتأكيد مطبوع","احجز بنفسك، موعد لكل شخص. تُؤخذ البصمات حضوريًا (مع استثناءات، مثلًا إذا أُخذت خلال آخر 59 شهرًا). قدّم حتى 6 أشهر قبل السفر وقبل 15 يومًا تقويميًا على الأقل."),
        fee:F("VFS Global","le site de l'ambassade des Pays-Bas","the Netherlands embassy website","موقع سفارة هولندا")},
    ch:{appt:I("Rendez-vous VFS Global Algérie et confirmation imprimée","Remplissez d'abord le formulaire en ligne sur le site de VFS, puis réservez votre rendez-vous, jusqu'à 6 mois avant le voyage. S'il n'y a pas de créneau, une liste d'attente existe.","VFS Global Algeria appointment and printed confirmation","Complete the online form on the VFS website first, then book your appointment, up to 6 months before travel. If there are no slots, a waiting list exists.","موعد في VFS Global الجزائر وتأكيد مطبوع","املأ أولًا النموذج على الإنترنت في موقع VFS، ثم احجز موعدك قبل السفر بـ6 أشهر كحد أقصى. إذا لم تتوفر مواعيد توجد قائمة انتظار."),
        fee:F("VFS Global","le site de l'ambassade de Suisse","the Swiss Embassy website","موقع سفارة سويسرا")}
   }
  };
  Object.keys(N).forEach(function(o){Object.keys(N[o]).forEach(function(d){ORI_ITEMS[o][d]=N[o][d];ORI_ITEMS[o].all.transl[d]=TR})});
  ORI_SITE.ma.be="https://morocco.diplomatie.belgium.be/fr/venir-en-belgique/visa-pour-la-belgique/demandes-de-visa";
  ORI_SITE.ma.nl="https://www.netherlandsworldwide.nl/visa-the-netherlands/schengen-visa/apply-morocco";
  ORI_SITE.ma.ch="https://www.schweiz-marokko.eda.admin.ch/fr/ou-dois-je-deposer-ma-demande-visa-schengen";
  ORI_SITE.dz.be="https://be.tlscontact.com/dz/alg/index.php";
  ORI_SITE.dz.nl="https://visa.vfsglobal.com/dza/en/nld/";
  ORI_SITE.dz.ch="https://visa.vfsglobal.com/dza/en/che";
  ORI_READY.ma=ORI_READY.ma.concat(["be","nl","ch"]);ORI_READY.dz=ORI_READY.dz.concat(["be","nl","ch"]);
})();
/* ===== Maroc : Allemagne, Autriche, Danemark, Finlande ; Algérie : Allemagne, Danemark (vérifié sur les pages officielles et celles des prestataires le 07/11/2026) =====
   Algérie, Autriche et Finlande : pas encore ajoutés (page de l'ambassade illisible, règles contradictoires). */
(function(){
  function I(f1,f2,e1,e2,a1,a2){return {fr:[f1,f2],en:[e1,e2],ar:[a1,a2]}}
  function F(p,wf,we,wa){return {fr:["Frais de visa et frais de service "+p,"Les montants changent : confirmez-les sur "+wf+" et sur le site de "+p+". Non remboursés en cas de refus."],en:["Visa fee and "+p+" service fee","Amounts change: confirm them on "+we+" and on the "+p+" website. Not refunded if the visa is refused."],ar:["رسوم التأشيرة ورسوم خدمة "+p,"المبالغ تتغير: تأكد منها على "+wa+" وعلى موقع "+p+". لا تُسترجع في حالة الرفض."]}}
  var TR=ORI_ITEMS.ma.all.transl.be;
  var M={
   ma:{
    de:{appt:I("Rendez-vous TLScontact Rabat et confirmation imprimée","Selon l'ambassade d'Allemagne, les demandes de visa Schengen se déposent à Rabat et un rendez-vous est toujours nécessaire. Des listes d'attente sont possibles : réservez tôt. Vérifiez sur le site de l'ambassade les règles en vigueur.","TLScontact Rabat appointment and printed confirmation","According to the German Embassy, Schengen visa applications are submitted in Rabat and an appointment is always required. Waiting lists are possible: book early. Check the embassy website for the rules in force.","موعد في TLScontact الرباط وتأكيد مطبوع","حسب سفارة ألمانيا، تُودع طلبات تأشيرة شنغن في الرباط والموعد إلزامي دائمًا. قد توجد قوائم انتظار: احجز مبكرًا. تحقق من موقع السفارة من القواعد السارية."),
        fee:F("TLScontact","le site de l'ambassade d'Allemagne","the German Embassy website","موقع سفارة ألمانيا"),tr:TR},
    at:{appt:I("Rendez-vous VFS Global (Maroc) et confirmation imprimée","VFS Global reçoit les demandes pour l'Autriche ; l'ambassade à Rabat décide pour les résidents du Maroc et de la Mauritanie. Données biométriques relevées au dépôt. Déposez au moins 2 semaines avant le départ ; le traitement dure en général 10 jours ouvrables.","VFS Global appointment (Morocco) and printed confirmation","VFS Global takes the applications for Austria; the embassy in Rabat decides for residents of Morocco and Mauritania. Biometric data is recorded at submission. Apply at least 2 weeks before departure; processing usually takes 10 working days.","موعد في VFS Global (المغرب) وتأكيد مطبوع","تستقبل VFS Global طلبات النمسا، وتقرر السفارة في الرباط بالنسبة للمقيمين في المغرب وموريتانيا. تُسجَّل البيانات البيومترية عند الإيداع. قدّم قبل السفر بأسبوعين على الأقل؛ تستغرق المعالجة عادةً 10 أيام عمل."),
        fee:F("VFS Global","le site de l'ambassade d'Autriche","the Austrian Embassy website","موقع سفارة النمسا"),
        tr:I("Traduction en allemand ou en français des documents qui ne sont ni en allemand, ni en français, ni en anglais","Les documents en arabe doivent être traduits ; une traduction faite par un traducteur assermenté est la plus sûre.","German or French translation of documents that are not in German, French or English","Documents in Arabic must be translated; a translation by a sworn translator is the safest option.","ترجمة إلى الألمانية أو الفرنسية للوثائق التي ليست بالألمانية أو الفرنسية أو الإنجليزية","يجب ترجمة الوثائق بالعربية؛ والترجمة لدى مترجم محلّف هي الأكثر أمانًا.")},
    dk:{appt:I("Rendez-vous VFS Global (Maroc) et confirmation imprimée","Remplissez d'abord la demande en ligne sur le portail danois et payez, puis réservez un rendez-vous chez VFS. Casablanca et Tanger sont citées parmi les centres : vérifiez la liste. L'ambassade a annoncé un traitement plus long (environ 45 jours), car les dossiers du Maroc sont traités dans un centre à l'étranger.","VFS Global appointment (Morocco) and printed confirmation","Complete the online application on the Danish portal and pay first, then book an appointment with VFS. Casablanca and Tangier are named among the centres: check the list. The embassy announced a longer processing time (about 45 days), as Moroccan files are handled at a centre abroad.","موعد في VFS Global (المغرب) وتأكيد مطبوع","املأ أولًا الطلب على الإنترنت في البوابة الدنماركية وادفع، ثم احجز موعدًا لدى VFS. تُذكر الدار البيضاء وطنجة ضمن المراكز: تحقق من القائمة. أعلنت السفارة مدة معالجة أطول (حوالي 45 يومًا) لأن ملفات المغرب تُعالج في مركز خارج البلاد."),
        fee:F("VFS Global","le site de l'ambassade du Danemark","the Danish Embassy website","موقع سفارة الدنمارك"),
        tr:I("Traduction des documents en arabe en anglais, en français ou en danois","D'après la liste de VFS pour le Danemark : documents en anglais, en français ou en danois. Vérifiez la liste à jour avant de déposer.","Translation of documents in Arabic into English, French or Danish","According to the VFS list for Denmark: documents in English, French or Danish. Check the up-to-date list before you apply.","ترجمة الوثائق بالعربية إلى الإنجليزية أو الفرنسية أو الدنماركية","حسب قائمة VFS للدنمارك: وثائق بالإنجليزية أو الفرنسية أو الدنماركية. تحقق من القائمة المحدّثة قبل التقديم.")},
    fi:{appt:I("Rendez-vous VFS Global Rabat et confirmation imprimée","Le centre de demande de visa de la Finlande à Rabat accepte les demandes des résidents légaux du Maroc et de la Mauritanie. Demande au plus tôt 6 mois avant le départ. Réservez via le lien du site de VFS.","VFS Global Rabat appointment and printed confirmation","The Finland visa application centre in Rabat accepts applications from legal residents of Morocco and Mauritania. Apply at the earliest 6 months before departure. Book through the link on the VFS website.","موعد في VFS Global الرباط وتأكيد مطبوع","يقبل مركز طلبات تأشيرة فنلندا في الرباط طلبات المقيمين بصفة قانونية في المغرب وموريتانيا. قدّم قبل السفر بـ6 أشهر كحد أقصى. احجز عبر الرابط في موقع VFS."),
        fee:F("VFS Global","le site de l'ambassade de Finlande","the Finnish Embassy website","موقع سفارة فنلندا"),tr:TR}
   },
   dz:{
    de:{appt:I("Rendez-vous VFS Global Alger et confirmation imprimée","Pour l'Allemagne, VFS Global reçoit à Alger les demandes Schengen de court séjour ; les visas de long séjour se déposent à l'ambassade. Les délais de dépôt dépendent du type de visa : vérifiez sur la page de VFS.","VFS Global Algiers appointment and printed confirmation","For Germany, VFS Global takes short-stay Schengen applications in Algiers; long-stay visas are submitted at the embassy. Filing windows depend on the visa type: check the VFS page.","موعد في VFS Global الجزائر العاصمة وتأكيد مطبوع","بالنسبة لألمانيا تستقبل VFS Global في الجزائر العاصمة طلبات شنغن للإقامة القصيرة؛ وتُودع تأشيرات الإقامة الطويلة لدى السفارة. تختلف آجال الإيداع حسب نوع التأشيرة: تحقق من صفحة VFS."),
        fee:F("VFS Global","le site de l'ambassade d'Allemagne","the German Embassy website","موقع سفارة ألمانيا"),
        tr:I("Traduction des documents en arabe en allemand, en français ou en anglais, selon le type de visa","D'après la page de VFS pour l'Allemagne : certains types de visa demandent l'allemand ou le français, d'autres l'anglais ou le français. Vérifiez la liste à jour.","Translation of documents in Arabic into German, French or English, depending on the visa type","According to the VFS page for Germany: some visa types require German or French, others English or French. Check the up-to-date list.","ترجمة الوثائق بالعربية إلى الألمانية أو الفرنسية أو الإنجليزية حسب نوع التأشيرة","حسب صفحة VFS لألمانيا: تتطلب بعض الأنواع الألمانية أو الفرنسية وأنواع أخرى الإنجليزية أو الفرنسية. تحقق من القائمة المحدّثة.")},
    dk:{appt:I("Rendez-vous VFS Global Alger et confirmation imprimée","Remplissez d'abord la demande en ligne et payez, puis réservez chez VFS à Alger. Empreintes relevées en personne au dépôt. Déposez au plus tôt 90 jours avant le voyage. Les dossiers sont traités à Londres, pas à Alger : le délai est plus long.","VFS Global Algiers appointment and printed confirmation","Complete the online application and pay first, then book with VFS in Algiers. Fingerprints are taken in person at submission. Apply at the earliest 90 days before travel. Files are processed in London, not in Algiers: the wait is longer.","موعد في VFS Global الجزائر العاصمة وتأكيد مطبوع","املأ أولًا الطلب على الإنترنت وادفع، ثم احجز لدى VFS في الجزائر العاصمة. تُؤخذ البصمات حضوريًا عند الإيداع. قدّم قبل السفر بـ90 يومًا كحد أقصى. تُعالج الملفات في لندن لا في الجزائر: المدة أطول."),
        fee:F("VFS Global","le site de l'ambassade du Danemark","the Danish Embassy website","موقع سفارة الدنمارك"),tr:TR}
   }
  };
  Object.keys(M).forEach(function(o){Object.keys(M[o]).forEach(function(d){var x=M[o][d];ORI_ITEMS[o][d]={appt:x.appt,fee:x.fee};ORI_ITEMS[o].all.transl[d]=x.tr;ORI_READY[o].push(d)})});
  ORI_SITE.ma.de="https://www.auswaertiges-amt.de/de/reiseundsicherheit/deutsche-auslandsvertretungen/marokko-224062";
  ORI_SITE.ma.at="https://visa.vfsglobal.com/one-pager/austria/morocco/french/index.html";
  ORI_SITE.ma.dk="https://www.vfsglobal.com/one-pager/denmark/morocco/english/index.html";
  ORI_SITE.ma.fi="https://visa.vfsglobal.com/one-pager/Finland/Morocco/English/";
  ORI_SITE.dz.de="https://visa.vfsglobal.com/one-pager/germany/algeria/english/";
  ORI_SITE.dz.dk="https://um.dk/algeriet/fr/voyage-et-sejour/visas/";
})();
var ITEM_TN={};
var ORI_NOTE2={fr:"Il n'est lié à aucune ambassade.",en:"It is not affiliated with any embassy.",ar:"وهو غير تابع لأي سفارة."};
function applyOriginItems(o){
  var by={};ITEMS.forEach(function(it){by[it.id]=it});
  ["cin","transl","emp_cnss","self_reg","med_file"].forEach(function(id){if(by[id]&&!ITEM_TN[id])ITEM_TN[id]={fr:by[id].fr,en:by[id].en,ar:by[id].ar}});
  if(S.origin==="tn"){
    ["cin","transl","emp_cnss","self_reg","med_file"].forEach(function(id){if(ITEM_TN[id]&&by[id]){by[id].fr=ITEM_TN[id].fr;by[id].en=ITEM_TN[id].en;by[id].ar=ITEM_TN[id].ar}});
    return o;
  }
  var D=ORI_ITEMS[S.origin]||{},d=curC().id,P=D[d],A=D.all||{};
  ["cin","emp_cnss","self_reg","med_file"].forEach(function(id){if(by[id]&&A[id]){by[id].fr=A[id].fr;by[id].en=A[id].en;by[id].ar=A[id].ar}});
  if(by.transl&&A.transl&&A.transl[d]){var x=A.transl[d];by.transl.fr=x.fr;by.transl.en=x.en;by.transl.ar=x.ar}
  if(P){["appt","fee"].forEach(function(id){if(by[id]&&P[id]){by[id].fr=P[id].fr;by[id].en=P[id].en;by[id].ar=P[id].ar}})}
  var r=Object.assign({},o);
  r.disc=ORI_NOTE[S.lang]+" "+ORI_NOTE2[S.lang];
  r.linkFV=(curC().id==="fr"?"France-Visas":PX.link[S.lang])+" · "+(curC().id==="fr"?nm(ORIS.filter(function(x){return x.id===S.origin})[0]):nm(curC()));
  return r;
}
function oriLink(cur){return S.origin==="tn"?(cur.id==="fr"?"https://france-visas.gouv.fr/tunisie":(PROF[cur.id]||{}).site):((ORI_SITE[S.origin]||{})[cur.id]||"")}

/* ===== Textes selon la destination choisie (Belgique, Suisse, Italie…) =====
   Les listes de pièces sont écrites une seule fois (modèle Schengen). Pour une destination autre que la France,
   le nom du pays choisi remplace « France » dans les phrases, et les pièces propres à la France
   (attestation d'accueil CERFA, traduction française, France-Visas) deviennent neutres.
   ITEMS0 = copie d'origine, rétablie à chaque affichage pour pouvoir changer de pays sans résidus. */
var ITEMS0=ITEMS.map(function(it){return {id:it.id,fr:it.fr.slice(),en:it.en.slice(),ar:it.ar.slice()}});
var CFR={
 de:["en Allemagne","l'Allemagne"],it:["en Italie","l'Italie"],es:["en Espagne","l'Espagne"],be:["en Belgique","la Belgique"],
 nl:["aux Pays-Bas","les Pays-Bas"],ch:["en Suisse","la Suisse"],at:["en Autriche","l'Autriche"],dk:["au Danemark","le Danemark"],
 fi:["en Finlande","la Finlande"],pt:["au Portugal","le Portugal"],gr:["en Grèce","la Grèce"],pl:["en Pologne","la Pologne"],
 cz:["en Tchéquie","la Tchéquie"],hu:["en Hongrie","la Hongrie"],se:["en Suède","la Suède"],no:["en Norvège","la Norvège"],
 mt:["à Malte","Malte"],lu:["au Luxembourg","le Luxembourg"],hr:["en Croatie","la Croatie"],si:["en Slovénie","la Slovénie"],
 sk:["en Slovaquie","la Slovaquie"],lt:["en Lituanie","la Lituanie"],lv:["en Lettonie","la Lettonie"],ee:["en Estonie","l'Estonie"],
 is:["en Islande","l'Islande"],li:["au Liechtenstein","le Liechtenstein"],bg:["en Bulgarie","la Bulgarie"],ro:["en Roumanie","la Roumanie"],
 ca:["au Canada","le Canada"],us:["aux États-Unis","les États-Unis"],gb:["au Royaume-Uni","le Royaume-Uni"],
 ae:["aux Émirats arabes unis","les Émirats arabes unis"],sa:["en Arabie saoudite","l'Arabie saoudite"],jp:["au Japon","le Japon"],
 au:["en Australie","l'Australie"],nz:["en Nouvelle-Zélande","la Nouvelle-Zélande"],cn:["en Chine","la Chine"]
};
var CEN_THE={nl:1,us:1,gb:1,ae:1};
function cArt(c){return CFR[c.id]||["en "+c.n.fr,c.n.fr]}
function cDe(art){
  if(/^le /.test(art))return "du "+art.slice(3);
  if(/^la /.test(art))return "de la "+art.slice(3);
  if(/^l'/.test(art))return "de l'"+art.slice(2);
  if(/^les /.test(art))return "des "+art.slice(4);
  return "de "+art;
}
function cEn(c){return (CEN_THE[c.id]?"the ":"")+c.n.en}
function genText(s,l,c){
  if(typeof s!=="string")return s;
  var a=cArt(c);
  if(l==="fr")return s.replace(/en France/g,a[0]).replace(/la France/g,a[1]).replace(/Traduction française assermentée/g,"Traduction assermentée").replace(/traduction française assermentée/g,"traduction assermentée").replace(/sur France-Visas/g,"sur le site officiel").replace(/France-Visas/g,"le site officiel");
  if(l==="en")return s.replace(/in France/g,"in "+cEn(c)).replace(/Sworn French translation/g,"Sworn translation").replace(/on France-Visas/g,"on the official website").replace(/France-Visas/g,"the official website");
  return s.replace(/ترجمة فرنسية محلّفة/g,"ترجمة محلّفة").replace(/فرنسا/g,c.n.ar).replace(/France-Visas/g,"الموقع الرسمي");
}
function restoreItems(){
  ITEMS0.forEach(function(x){
    var it=ITEMS.filter(function(y){return y.id===x.id})[0];
    if(it){it.fr=x.fr.slice();it.en=x.en.slice();it.ar=x.ar.slice()}
  });
}
function sameItem(it,o){return JSON.stringify([it.fr,it.en,it.ar])===JSON.stringify([o.fr,o.en,o.ar])}
function genCountry(o){
  var c=curC();
  if(c.id==="fr")return o;
  var a=cArt(c),de=cDe(a[1]),en=cEn(c),by0={};
  ITEMS0.forEach(function(x){by0[x.id]=x});
  ITEMS.forEach(function(it){
    var pristine=by0[it.id]&&sameItem(it,by0[it.id]);
    if(pristine&&it.id==="transl"){
      it.fr=["Traduction assermentée des documents rédigés en arabe","Souvent exigée. La langue acceptée est indiquée par le centre de dépôt ou l'ambassade "+de+" : confirmez-la sur le site officiel avant de faire traduire."];
      it.en=["Sworn translation of documents written in Arabic","Often required. The accepted language is given by the application centre or the embassy of "+en+": confirm it on the official website before having documents translated."];
      it.ar=["ترجمة محلّفة للوثائق المكتوبة بالعربية","تُطلب غالبًا. اللغة المقبولة يحددها مركز الإيداع أو سفارة "+c.n.ar+": تأكد منها على الموقع الرسمي قبل الترجمة."];
      return;
    }
    if(pristine&&it.id==="invite"){
      it.fr=["Lettre d'invitation ou attestation d'hébergement de l'hôte","Le modèle et les formalités dépendent du pays : confirmez-les sur le site officiel "+de+". Ajoutez la pièce d'identité de l'hôte, son justificatif de domicile "+a[0]+", ses revenus et la preuve du lien de parenté."];
      it.en=["Invitation letter or hosting certificate from your host","The form and formalities depend on the country: confirm them on the official website of "+en+". Add the host's ID, proof of address in "+en+", proof of income and proof of kinship."];
      it.ar=["رسالة دعوة أو شهادة استضافة من المضيف","النموذج والإجراءات يختلفان حسب البلد: تأكد منهما على الموقع الرسمي لدولة "+c.n.ar+". أضف هوية المضيف وإثبات إقامته في "+c.n.ar+" ودخله وإثبات صلة القرابة."];
      return;
    }
    ["fr","en","ar"].forEach(function(l){it[l]=[genText(it[l][0],l,c),genText(it[l][1],l,c)]});
  });
  var r=Object.assign({},o);
  r.msgDone=({fr:"Dossier complet. Vérifiez une dernière fois sur le site officiel "+de+".",en:"File complete. Check once more on the official website of "+en+".",ar:"الملف مكتمل. تحقق مرة أخيرة على الموقع الرسمي لدولة "+c.n.ar+"."})[S.lang];
  r.medNote=genText(r.medNote,S.lang,c);
  r.disc=String(r.disc).replace(/France-Visas, /g,"").replace(/France-Visas و/g,"");
  return r;
}
function applyCountry(t){restoreItems();return genCountry(applyOriginItems(applyCountry0(t)))}
function applyOrigin(){COUNTRIES.forEach(function(c){c.ready=S.origin==="tn"?TN_READY.indexOf(c.id)>=0:(ORI_READY[S.origin]||[]).indexOf(c.id)>=0})}
function oriName(id){var o=ORIS.filter(function(x){return x.id===id})[0];return o?o.n[S.lang]:""}
function oriHtml(t){
  return '<div class="field"><label class="q-label" for="orisel">'+t.s_pass+'</label><div class="orisel"><span class="flag">'+flag(S.origin)+'</span><select class="sel" id="orisel">'+ORIS.map(function(o){return '<option value="'+o.id+'"'+(S.origin===o.id?' selected':'')+'>'+o.n[S.lang]+'</option>'}).join("")+'</select></div></div>';
}
document.addEventListener("change",function(e){
  var q=e.target;if(q&&q.id==="evsel"&&q.value&&evFind(q.value)){S.evc=q.value;S.step=7;save();render();window.scrollTo(0,0);return}
  var b=e.target;if(!b||b.id!=="orisel")return;
  var o=b.value;if(o===S.origin||["tn","ma","dz"].indexOf(o)<0)return;
  S.origin=o;S.country="fr";S.step=0;applyOrigin();save();render();
});
function homeHtml(t){
  var cur=curC(),L=S.lang;
  var h='<div class="panel hcard"><div class="ask"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg><span>'+t.ask+'</span></div>';
  h+=oriHtml(t);
  h+='<div class="field"><span class="q-label" id="destlbl">'+t.s_dest+'</span><button type="button" class="fbtn" id="destbtn" aria-expanded="'+open+'" aria-labelledby="destlbl destbtn"><span class="flag">'+flag(cur.id)+'</span><span class="fname">'+nm(cur)+'</span><svg class="chev" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg></button>';
  if(open){
    var cmp=function(a,b){return nm(a).localeCompare(nm(b),L)};
    var all=COUNTRIES.filter(function(c){return c.ready}).sort(cmp).concat(COUNTRIES.filter(function(c){return !c.ready}).sort(cmp));
    h+='<ul class="clist">'+all.map(function(c){return '<li><button type="button" class="crow" data-c="'+c.id+'"'+(c.id===S.country?' aria-current="true"':'')+'><span class="flag">'+flag(c.id)+'</span><span class="cn">'+nm(c)+'</span>'+(c.ready?'':'<span class="ctag">'+t.cSoon+'</span>')+'</button></li>'}).join("")+'</ul>';
  }
  h+='</div>';
  if(!cur.ready){h+='<div class="book"><span class="slot">'+t.cSoon+'</span><b>'+nm(cur)+'</b><p>'+(S.origin==='tn'?t.soonText:ORI_SOON[S.origin][L])+'</p></div>'}
  h+=evCardHtml();
  h+='</div>';
  h+='<div class="side"><figure class="photo">'+photoHtml()+'</figure>'+(S.origin==='tn'?needsHtml(t):'')+ivCardHtml()+'</div>';
  var whyIcons=["✦","◎","文","↗","✓"];
  h+='<section class="why why-showcase" aria-labelledby="why-title"><div class="why-head"><span class="why-eyebrow">'+(L==="ar"?"لماذا نحن؟":L==="en"?"THE VISA CHECKER ADVANTAGE":"L’AVANTAGE VISA CHECKER")+'</span><h2 id="why-title">'+t.whyTitle+'</h2><p class="why-lead">'+(L==="ar"?"مرافقة أوضح لتحضير ملف تأشيرتك بثقة.":L==="en"?"A clearer way to prepare your visa file with confidence.":"Une façon plus claire de préparer votre dossier visa, en toute confiance.")+'</p></div><ul class="why-grid">'+t.why.map(function(x,i){return '<li class="why-card"><span class="why-icon" aria-hidden="true">'+whyIcons[i%whyIcons.length]+'</span><span class="why-copy">'+x+'</span><span class="why-check" aria-hidden="true">✓</span></li>'}).join("")+'</ul><p class="why-note">'+t.whyNote+'</p></section>';
  return h;
}
/* Sponsors: add entries like {name:"Agence X",url:"https://...",tag:{fr:"Voyages à Tunis",en:"Travel in Tunis",ar:"سفر في تونس"}}. SPONSOR_CONTACT is shown as text under the slots. */
var SPONSORS=[];
var SPONSOR_CONTACT="";
var WORLD=[
 {g:"fh",n:"Booking.com",svc:["hotel"],k:{fr:"Hôtels",en:"Hotels",ar:"فنادق"},u:"https://www.booking.com",w:72,h:72,img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAKpklEQVR42u2ce3BU1R3HP+ece+9mk03C5onBBFEQpFQRxSeCDmJpHRl12lofra9Oobaj1k6n1jrTOo7aVmecEadjh1Y7trVqFbV2QKk6PqBWRQEHQnzwMoEk5EEem2Qf957TP+7uZhMIYEk2IeyZOX/s7r252e/9/n6/7+9xVxhjDBnLfykQAqKxBK/8Zyv/eqeWLduaaGrppDPqMuCEo2hJAcVBm0kVE5hzSjVL5s9k4dnTAdDGIAAhxIBzRCZAWhuk9A/466r1PPrMWmq3NQFgWwrHkshBf+BoW54xJBIecdfDsRVzTqnm9msXcOm8mWmCZIKUBigFTlNrJ0vvf47Va7cSyrMpCDrJE32Ux8OSQiCEwBhDV2+MuOtxw2VzefinVxDMs9HGpIkgjDEm9ca2hlauuONxPvuihYpwAZ42aD0+QBlqKemD1dQe4cK5U3n6/u9SUlyQBkl4WhsBtOyLcMktj7G9vo2SoiBx1+NYWo6taGzrZuE501n54I3YlkIKgcT4jum2h16kbkczJcVBYscYOADxhMdxpYWsWVfHfSvWoKTwWSSl4J9vb2Hl65uoDIeIJzwEx+aKJzwmloRY/uxaNn6yGyUFUmvDo8+uJWBbjHN3c3gOXAqisQTLn3nHf/3e5p1sqK2nMOjgaX3MA+R6muKCPN784HP2NHcgV6/bSl80gZQyR5+Uw7YkLR0R3t64Hbnpkz1YSmDI2VeGfsZowwe1DcjmjghKKXL47J+W1O9pR8ZiCV9V5jDpz0d97UNf3CXneA5maELkADqkqeUgOPiyRiwBlIerx4VfKkjWZMZacjzsAEkp6OyJEYslEEZw0LzFGDAGoyRKCRzLoiDooKTA9fT4A0gIQWdXH4vPP4UrFswiVBD0K5RiaICMp2nt7mHrtiY+3NrA5s+b6E24TCgMIqUYdUYNG0BKSdr39fDLmxZy19LF/1941ZqP6xr408vreWrVejSGUDBAwtOjlkAPi5OWQhDpjXPmrGruWroYbQyup/G+5BZSctrMGh75+ZW8snwpJ1aV0BGJYqnRiyVyuNjT0xdj4RnTMID2DJaSqANsKcWAnfkZ+KVf19OceepkXv39MmbUlBHpjaGkOHoBSoYggkoNaQramHRBPHMDeJ5OBTKkFFhK4rqa0nAhT95zNY6SuNqMipkNK3fNIcxQCEFvT5S+Xn/39kbTDBzcLLEsScLVzJg2iRsvP4f2rr40y456HTSYOUIItu1q4dbfPEfDnnaMkmk0JxTl8a2LTuVH112EtPz3U2BJ6bdhrvv6HFasfBdvFCLaiN8SkzSNB554jdXrttLSG6NxX4TGjghNHT3U7mrltode4pZ7nkEkzbCfdRIhBDOmVHJSVZho3M16X27EAUoV4to6uigOh7CVJGBbBGwLx1YEAxbV1aX87fUNfLB5J1KKdGVTCJ9Blm0xqSrs18vHG0DpSCdSztgM2DrJsHjUZf3G+iTrBoltIJTn+I1LMc580OE4cIR/gHeAdlOqFd7W1YeSEpPl7u7YyOYN2HkWM06uTJtWij0Avb0xdtW3EXAU2e5+Z41BSkksS2FZCpERjYSAprYIp0+dyAVzp2H8Zl1SNGqkFKzfsouGlk4KQ0F0ljsvWQOos6OHjuZOYoV5flohBMIYlK346pQKVvz6agJOanAgRSyDEJIV/3gX1xhGY7BkxAFKfam7b17M95d0I22VzPAFUhvCpQUsOGMqyrZ89mSoa0spVr21mZfe2UK4KB9vFEogWWPQ/HNnHFxQZswmaWNQSvJxXQPLHniOvGAARmn0JmsAedrPt8QQWikNjvaV9+a6Bubf8AieJSktChKLe6NiYtnTQRkg7BfiM0SAf4zhhOoyHr/3GqorJtDe1YdtjU7AzdpVU/5lvxKI9NMJrfvTDCEEoYI8rlw0m9ceW8asKRV09sRQSoxPE0uVOXY37+PTbXsRSqRJ4wQsTq4po6y0KK19UqaUcD2qKibw9G+v54KblhNNeH6b3IwjgLyk8/332lq+96un6OqK9huUATtPUV6UzyXnTOe+H19KuKQwDahtKRKuR01VKb+4/iJ+8vDLlJeEslrQH3ETE8n9xxffpT0SpaKiiLLSEGVlIcrKQxQVBIkkPB574T2u+tmTxGKJASraUn56cc1lZzF5op/RZzNhHXmAkl8m7rnkOTau6+F6Gtf1t6c1CphcFeaNjdtYuWZD0ifp9PnGQFEoyLzZk4lE41ktechsXmioMWKTFIaOrXjjvc8PWHQzBmZNOQ435iGyGNCyF8UO43OpJD1ufADzUh8KAQW2g9E6qyZmMUaWALSnKRDWAB+0v2Y6ANpC7v/mMIU6a6yAYylJPOGx8PyTM1AQ6QOMge54HKFk/zScEKA1xPpASf9AzwOlwLaHBaSsASSEP9AghcBk3nAB2sDOPftYdOZJXL7o9NR88sBzBdTtbMRylF9xFAJcD2Mp9NyzoOp4v8rf1Yn8eBOirRUc54hByhpA8WiCaE+ciBADelxSG/IdmxuXzOXB25eQF7CTOihTgUOkJ8q6TV9QEPBLIngexrHRi78BE4+DeMJHvbISfcIU5JrViN27jxikrJU7Hrrjcu7u6kubiEi6CcuymFRezMTKCRlKWgwQmpaSPL9mA9v3tPtCURtIJNBnnwsTqyDS7bMHIJEAx0FfsAD5wvMIz0v1j8Y2g6ZPnXRoxS0GgeNpLCVp3dfNA0+8Tqgg4PfGtMYEAnB8NcSivs/JvCPxOBQWQ3kl1O+CQGDsm5g/xpLheAexLLP3boxJM8dzPX5w999paO0mXBT0i2bGYBwHLOugnt8EnCNuggy7DjKk56IGbN/Ryv168ynGaGPwtE6XYy0l2d3cwZW3reDVDz+jJAUOgFLIaBSifanm2YHuCKK7iyMtIg07g0SypvPl/i/h3+nkSd3dfTy7ej2/+8ub7G6LUBoO4Wa2hIQfzkXtZsyFF4Pr+uE+FfZDIdixHdHSMracdPLRRTzX43AGaA3+0FRfNEFLew9bdzSy9qMdrFpXy6f1bRSG8igpCg4EJ3kNHAdZV4cuLEbPPj0JsfFFY0MD8u23+h33aDPI9TzCxfn8+dWPWPV+nT8RdhgUMvitnZ7uPpr3dtNrNG7CI1QQoLwkhJecFRpy2Tby/f8ivtiJrq4B20Y0NyN27vCvr9TY0EF+uJa0dURobO38co5RCCwpsfMdwskodkhgMlcggNi7F9XY2G9+jjO0bxotEzMm+WS0rf6vc40xeOZw0toDXdgG2+nnZSoyjLVczCTLEllfxjBST+PkJu1zAOUAGlHTzQE0hNg1BvLzAzmADhZwJk8qyQE0lICVSnLuV2pyAB2oshCPe0wsLeL82VNyAA1eSko6e6IsmT+T8nAoB9Bg9iRcj3BxAT/89jzf1HKwZOS+StHc0cudN13MiZNK/RnJHCzJ/NZW7G7p4vrL5nLrVfPwPI0SMgeQpSQYQf3eTq699Az+cNc3QSQHuQRYg0ufx4IITH1V19O0dPQQzLO5d9li7rx5kd+3y/gdMyvuesQSblocjXeFk3pgTxtDuCifqxbP4fbvzGP2jOpkPX3gj7xZkyuLEfi1nPEOkJSSYMCmpjLMeaedwNfOm8G0mnLAHzJVUu5X5P8fHTzv7+roL4cAAAAASUVORK5CYII="},
 {g:"fh",n:"Trip.com",svc:["flight","hotel"],k:{fr:"Vols et hôtels",en:"Flights & hotels",ar:"طيران وفنادق"},u:"https://www.trip.com",w:72,h:72,img:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAYAAABV7bNHAAAJaElEQVR42u2cf4xcVRXHP/e+92Z2Zn+2XUDZlq4ULEhLkVKBUgMSIMYW1IhIQGrEWIgKIRZUNCklRgmCQEI0tPgrKqFpJaBAGy1N+LG0DbQIbdHimkrDry7dbXe7M7O7M/Pu9Y/zXt/Mdmd32+22u+w7ycvuvLlz593vnHPu9/x4T1lrLf3EWjm0ltdvvQ3PbYQtO2DXu9DRCX15GTMeRClIJmBKA5w6Fc6bBZfNh5nN8r4xMkapAT7bHyBjQQcDX9kOj66Blq3QlQEFeB44euDJxrJYC76BQgEsUF8DC+bCt78Kn5l96NoHBMg3svjuLPxsBTz2NOQLUJMGxynXrvEopVri+5DJQcKD66+En9wEtdURBocAZIyY1Nvvwc3LYcubMKlOzvk+H0lxHFn3/gNw3lnwyHJoboqwOAiQtYLs7vfh2qUCUkMtFIpMCPFc6OwWcFb9EqafLFaiFChjRIWyObj6Nti2E+proegzocR1oKsbzj4D/vIQVKfF52obOKZ7VsLWHVBfN/HAAVlzfZ1gcM9KwcTawMS27IAv3QLppHjyiSxaQa4PnnpY6IAGWLFatj+lmfCitGCxYnUAWOtu4Tk16Y/ubnU44vuCRctWaN0Nev1GcU4hz4lFsOjqhvUbQb+6ffyx4mNFKl/dDnrXOxI+WBuDUhqWeB7segd0R5dQ6xigcoAcDR1doPvysYlVMrG+fEAUY6msSTHzGYo4xhDEAMUAxQDFAI1dcQ+HF+gR8CVjJFk+5C+my6sqxowDgJSCYhFyvUf+RdWpgLEP8T25HgkWXUeKB9WpMQ6QUpKbPnEyzJs1PC04ZA5g4+vQeQBcd+CwRmtJ+140F35wI0yuh98/CX94EqqSxy8UGhIgHVDuM2fAr5Yd+Rdd+R34sGPgwFgpKS81nQSP3CXgAPz0Vnj/Q1j7opRkjoe5DdtJ+77kbQtF+RsexkiaNjx8U/5+OH6wxWkFvX1w1mkCTqEor42BC+YEMZEawz7IIj7BdYZpTwPIYAk5Y8WMdrRKWXtKg5RiCEwzmRg6Vx4G3EfbFNWMKwafUgFFA40NMOeMINMf+IxMD3z/G5LcLhbFv7zwCqxcI87VBLuR48DWN+FAkLn0fQFdK8kBh1eQ7YEF58LtN0JNCh5/VvxQ6IN0v5K38aM8erEY/RDh7nc0wHKHpT0a2vfDM8+XaISWiuS1X4i0AGD3B/DUBik8+kFTQLYHEq5cvLWS8/Vc2RX78rKgmjSkq2Ddi5Lq9FwpDZ8wmYM7QyYXAQFQWwO5rAAd+q3ObpmzJi0/2Ej91vBNzIV6rxwgayNTCCXhCTj1NQJaoQifnQuNk6LmgJdfgw/2wuxPit/p6YMNmyHhwHWLIg1wXekoaWsXTVlwrswTasaGzXDFRbD4KphxipzbsxfWb4LV62BfV1CMMKMMUGjbfj+V9QdQ47CLIryobA5u/bp0UoTylVvhu9fBDV+EVFLA2rAJUlVSHy+Vm++Gv24Q4O/4llCNUJ59ARZeXD6+uQkuOAeuWwh33Aeb34iaEsZkqKGUmIbvi3lkc7D8e7DkGnG++YKYaghuV7eMLRSiv6HfyWTlXD54b+HFomnh4q2Nds0Zp8Af74VzzhRfqfUYBSgkgY4jC61Oi2kVi2JuoUmW7nalR6lTDucJDz/ownC07H5Kick7Oqpv/eJ2cfJjVoMG5FSBf3mvDVathT/97fC3aRMk1l/7F3z5Frj0m7DwZmh5LeoD8g3MOh0uv1A019Gj6IOOloQLe/YF8REdnQKW5w6/eBA2XLR1wJJl0rZTVyuNB0uWwdoVML0J/EBLLz0fnlhfmaONGQ06uLB2uPMBOJCV7bkmffiZAaXg+VfgnT1CBRQwuQH27oN1L8nrsMdn2scDsmlCbmdRw4wq9bHWHpDex737hQwWikfOVcKSVWiWIZns7TvUB4ahilYGi6JoFFqZIYE6Lj6oOzuysCBc7IJzZQvvzorZ5nrF6V92YbSDWisa29sHrmPJFjQKy6RUJ9m8pmjUoJZ3XAAq/dWP6PNatPHUafDgj+DEKaJNdTVw71LZJUtDk5at4GhDJq+4aFoLq6+dzzM3zOGBzy8h5XVTNJVNzmWcStgBtugSIaH/exemfSxi2sYIFXi3Dda9ZPESipOqP+TXC6+mcXIb9MHXzn+U3mKaH65/iLqkj7XO0QfIGOEcvg9+hRTpcMaUplV8Pwo2B9O0MJnXUAufPjMIWoMepzDzcNfDsK/LYF2HT52wjcb6NgqZBEobbE4zf+pz1CUNvnXQWGw/gxuRiYWBp+NImOA4EsWXLmo4Y0oX3FAnYzwv+lsJJN+PYsFwTJiWyfbAbfcInaitVrgK3t5/Gr29KbyqPKDwUnl2tp9NJq9xlH8IOCPSIGNl63ziH5LHKRTlYre9VZ6/SSRgzd/h9Z3RmDd2lo85uPvk4f7fyWdswJL/u1vGlna/+b445VXrhANdvwiaTpR59nRIMPzbJ2D7f8QvFX1NlWto3dfMnc/9hh9fspTGqjY2tX6On7fch6crJ7KGzAcN5WxzPeVdsZ4rmhLOOpwxpdqWyZWfS1VB0hONeOw+uHiexGIJDx5ZJVoy8xPiqK0VHrSnXd5PV5WHGEpZsnlFU207jdV7aO2YRd6HpFtZS92RmljYT1x6ztghxjCwH1IqiMtUlAMyg/gh14VJ9bK9/3uXfMx1ZY4wq1B+vYqahGFvrpH3M42kXKhyLcaq0Qs1hkPyDocI+qZyOnXAFIwvviqdjMAfLDA1VuM5loQjwAwGzrjb5ksLAqVFxf5aO7TmqwEd8rgGKLyFqbR4UJ0e/XqZO17A8Vz489Pw8j8lieZ5sGX76BcVR7SLHevwpDsr4IROvCoJ6dToAjR+TMyKiZWVfezoV1vHnZM+5jEfscQAxQDFAB3PvFN8G8Kg1EInE/GNLJVoRTIBekp91IURS6Q5voEp9aBPnVZe/44lSOUWpCig582OTaySic2bDfry+fIggfiG3hLG7gsml88Hffp0KZtkcvGNvSAYZHKCyenTAx500zVB9cDEAFkjWNx0TcCDjJEmzMVXScua605ccFxXMFh8lWBiTPxwkwicSg83UUr+qa2GlXdD81R52pQ3gTTJc2XNzVMFg9pqwUSpwAcpJeo0/WR4/H6YM1PaU5T6aDvusMVv735Z8+P3CwamhDjHj+ga7iO6Qokf8tYP1PgxgYM/JvD/UCVfvRXiKcEAAAAASUVORK5CYII="},
 {g:"car",n:"DiscoverCars",dom:"discovercars.com",svc:["car"],k:{fr:"Location de voiture",en:"Car rental",ar:"تأجير السيارات"},u:"https://www.discovercars.com/?a_aid=checkmyvisa",bg:"#ffffff",fg:"#005a8c",txt:"DC"}
];
var LOCAL=[
 {g:"ag",n:"Despina Travel and Events",k:{fr:"Hammamet",en:"Hammamet",ar:"الحمامات"},u:"",bg:"#e6efff",fg:"#1e3a8a",txt:"DTE"}
];
function tileHtml(x){
  var ic;
  if(x.img)ic='<span class="tile-ic"><img src="'+x.img+'" alt=""></span>';
  else if(x.dom)ic='<span class="tile-ic" style="--tb:'+x.bg+';--tf:'+x.fg+'"><img class="fav" src="https://www.google.com/s2/favicons?domain='+x.dom+'&sz=128" alt="" loading="lazy"><span class="fbt" aria-hidden="true">'+x.txt+'</span></span>';
  else ic='<span class="tile-ic fb" style="--tb:'+x.bg+';--tf:'+x.fg+'"><span class="fbt" aria-hidden="true">'+x.txt+'</span></span>';
  var inner=ic+'<span class="tile-n">'+x.n+'</span><span class="tile-k">'+x.k[S.lang]+'</span>';
  if(x.u)return '<a class="tile" href="'+x.u+'" target="_blank" rel="noopener noreferrer" aria-label="'+x.n+'">'+inner+'</a>';
  return '<span class="tile tile-static" role="group" aria-label="'+x.n+'">'+inner+'</span>';
}
function tilesHtml(list){return '<div class="tiles">'+list.map(tileHtml).join("")+'</div>'}
var SPT={
 local:{fr:"Partenaires locaux",en:"Local partners",ar:"شركاء محليون"},
 sAg:{fr:"Agences de voyages",en:"Travel agencies",ar:"وكالات السفر"},sIns:{fr:"Assurance voyage",en:"Travel insurance",ar:"تأمين السفر"},sCar:{fr:"Location de voiture",en:"Car rental",ar:"تأجير السيارات"},pick:{fr:"Touchez une catégorie pour voir la liste",en:"Tap a category to see the list",ar:"اختر فئة لعرض القائمة"},soon:{fr:"Bientôt disponible",en:"Coming soon",ar:"قريبًا"},
 cIns:{fr:"Assurance voyage",en:"Travel insurance",ar:"تأمين السفر"},cAg:{fr:"Agences de voyages",en:"Travel agencies",ar:"وكالات السفر"},cCar:{fr:"Location de voiture et transferts aéroport",en:"Car rental and airport transfers",ar:"تأجير السيارات والنقل من المطار"},cFh:{fr:"Vols et hôtels",en:"Flights and hotels",ar:"طيران وفنادق"},
 world:{fr:"Partenaires internationaux",en:"International partners",ar:"شركاء دوليون"},
 note:{fr:"Liens pratiques vers des sites indépendants. Certains sont des liens partenaires : Visa Checker peut recevoir une commission, sans frais pour vous. Pour le visa, choisissez des réservations annulables.",en:"Handy links to independent sites. Some are partner links: Visa Checker may earn a commission at no cost to you. For the visa, choose cancellable bookings.",ar:"روابط مفيدة لمواقع مستقلة. بعضها روابط شركاء: قد يحصل Visa Checker على عمولة دون أي تكلفة عليك. للتأشيرة، اختر حجوزات قابلة للإلغاء."}
};
var ICONS={
 bed:'<svg class="sp-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 20V6M3 16h18v4M21 16v-3a3 3 0 0 0-3-3h-7v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7" cy="12" r="2" fill="none" stroke="currentColor" stroke-width="2"/></svg>',
 plane:'<svg class="sp-ico" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>'
};
/* ===== Demande de documents de voyage (billet d'avion / hôtel) =====
   REQUEST_URL : adresse qui reçoit la demande en POST JSON (Make, n8n, Zapier, Formspree...). Vide = mode test (envoi manuel par bouton).
   Chaque agence a ses contacts (email, telegram, whatsapp). Les données personnelles ne sont pas gardées dans le navigateur. */
var REQUEST_URL="https://visa-proxy.rabehfly.workers.dev";
/* REQUEST_MODE : "opaque" = envoi sans lecture de la réponse (aucun en-tête CORS requis ; on ne connaît que l'échec réseau)
                  "cors"   = envoi JSON et lecture du statut HTTP (le serveur doit renvoyer les en-têtes CORS : voir ARCHITECTURE-SECURITE.md). */
var REQUEST_MODE="cors";
var REQUEST_TIMEOUT_MS=10000,REQUEST_RETRIES=1,REQUEST_COOLDOWN_MS=30000;
var INTL=[]; /* partenaires internationaux de commande : à ajouter un par un (logo, infos, réglages) */
var RQ={sending:false,tries:0,chan:"email",ln:"",fn:"",d1:"",d2:"",city:"",dest:"",cc:"+216",phone:"",tg:"",mail:"",consent:false,done:false,mode:"",failed:false,er:{}};
var RT={
fr:{svc:{flight:"Billet d'avion",hotel:"Réservation d'hôtel"},t8:"Choisissez votre agence",s8:"Choisissez l'une de nos agences, ou un partenaire international.",t9:"Vos informations",s9:"Saisissez-les comme sur votre passeport.",t10a:"Demande envoyée",t10b:"Dernière étape",s10a:"L'agence vous répond bientôt.",s10b:"Envoyez votre demande à l'agence.",
 tabL:"Agences locales",tabI:"Partenaires internationaux",choose:"Choisir cette agence",test:"Agence test",noLocal:"Pas encore d'agence locale pour ce service. Essayez un partenaire international.",anyWhere:"Où que vous soyez, vous recevez votre document. Choisissez l'une des agences ci-dessous.",agN:"Serveur ",
 selfT:"Vous préférez réserver vous-même ?",selfN:"Sites indépendants, sans lien avec Visa Checker. Pour le visa, prenez une réservation annulable.",you:"Agence choisie",
 ln:"Nom (comme sur le passeport)",fn:"Prénom(s) (comme sur le passeport)",d1f:"Date d'aller",d2f:"Date de retour",d1h:"Check-in (arrivée)",d2h:"Check-out (départ)",city:"Ville de destination",phone:"Numéro WhatsApp / téléphone",tg:"Identifiant Telegram (facultatif)",mail:"E-mail (obligatoire)",chan:"Comment voulez-vous être prévenu(e) ?",chanNote:"Le lien de paiement et le document sont toujours envoyés par e-mail. Si vous choisissez WhatsApp, nous vous écrirons seulement pour vous dire de vérifier votre e-mail.",
 ch:{whatsapp:"WhatsApp",telegram:"Telegram",email:"E-mail",sms:"SMS"},
 consent:"J'accepte que ces informations soient transmises à l'agence choisie pour traiter ma demande.",send:"Envoyer ma demande",sending:"Envoi en cours…",
 payNote:"Le document vous est envoyé après paiement. Pour le visa, demandez une réservation annulable.",
 e:{req:"Champ obligatoire",name:"Écrivez en lettres latines, comme sur le passeport.",phone:"Numéro invalide : choisissez l\u2019indicatif du pays, puis saisissez le numéro (ex. 20 123 456).",tg:"Identifiant invalide (5 à 32 caractères : lettres, chiffres, _).",mail:"E-mail invalide.",needTg:"Ajoutez votre identifiant Telegram pour ce canal.",needMail:"Votre e-mail est obligatoire : le lien de paiement et le document vous sont envoyés par e-mail.",past:"La date doit être aujourd'hui ou plus tard.",dFlight:"Le retour doit être le jour de l'aller ou après.",dHotel:"Le check-out doit être après le check-in.",consent:"Cochez la case pour continuer."},
 okT:function(a){return "Demande envoyée"},okTxt:function(c,v){return "Vous recevrez le lien de paiement, puis votre document, par "+c+" ("+v+")."},
 manT:"Envoyez votre demande à l'agence",manTxt:"Cette page n'est pas encore reliée à un serveur (mode test). Utilisez un des boutons : l'agence vous répondra avec le lien de paiement.",failTxt:"L'envoi automatique a échoué. Utilisez un des boutons pour envoyer la demande à l'agence.",
 recap:"Récapitulatif",bWA:"Envoyer par WhatsApp",bMail:"Envoyer par e-mail",bTg:"Ouvrir Telegram (texte copié)",tgHint:"Le texte est copié : collez-le dans la conversation Telegram."},
en:{svc:{flight:"Flight ticket",hotel:"Hotel booking"},t8:"Choose your agency",s8:"Choose one of our agencies, or an international partner.",t9:"Your details",s9:"Enter them exactly as in your passport.",t10a:"Request sent",t10b:"Last step",s10a:"The agency will reply soon.",s10b:"Send your request to the agency.",
 tabL:"Local agencies",tabI:"International partners",choose:"Choose this agency",test:"Test agency",noLocal:"No local agency for this service yet. Try an international partner.",anyWhere:"Wherever you are, you receive your document. Choose one of the agencies below.",agN:"Server ",
 selfT:"Prefer to book yourself?",selfN:"Independent sites, not affiliated with Visa Checker. For the visa, choose a cancellable booking.",you:"Chosen agency",
 ln:"Last name (as in passport)",fn:"First name(s) (as in passport)",d1f:"Departure date",d2f:"Return date",d1h:"Check-in (arrival)",d2h:"Check-out (departure)",city:"Destination city (optional)",phone:"WhatsApp / phone number",tg:"Telegram username (optional)",mail:"E-mail (required)",chan:"How would you like to be notified?",chanNote:"The payment link and the document are always sent by e-mail. If you choose WhatsApp, we will only message you to check your e-mail.",
 ch:{whatsapp:"WhatsApp",telegram:"Telegram",email:"E-mail",sms:"SMS"},
 consent:"I agree that this information is shared with the chosen agency to process my request.",send:"Send my request",sending:"Sending…",
 payNote:"The document is sent after payment. For the visa, ask for a cancellable booking.",
 e:{req:"Required field",name:"Use Latin letters, as in your passport.",phone:"Invalid number: pick the country code, then type the number (e.g. 20 123 456).",tg:"Invalid username (5 to 32 characters: letters, digits, _).",mail:"Invalid e-mail.",needTg:"Add your Telegram username for this channel.",needMail:"Your e-mail is required: the payment link and the document are sent to you by e-mail.",past:"The date must be today or later.",dFlight:"Return must be on or after the departure date.",dHotel:"Check-out must be after check-in.",consent:"Tick the box to continue."},
 okT:function(a){return "Request sent"},okTxt:function(c,v){return "You will receive the payment link, then your document, by "+c+" ("+v+")."},
 manT:"Send your request to the agency",manTxt:"This page is not connected to a server yet (test mode). Use one of the buttons: the agency will reply with the payment link.",failTxt:"Automatic sending failed. Use one of the buttons to send the request to the agency.",
 recap:"Summary",bWA:"Send by WhatsApp",bMail:"Send by e-mail",bTg:"Open Telegram (text copied)",tgHint:"The text is copied: paste it into the Telegram chat."},
ar:{svc:{flight:"تذكرة طيران",hotel:"حجز فندق"},t8:"اختر وكالتك",s8:"اختر إحدى وكالاتنا، أو شريكًا دوليًا.",t9:"بياناتك",s9:"اكتبها تمامًا كما في جواز سفرك.",t10a:"تم إرسال الطلب",t10b:"الخطوة الأخيرة",s10a:"ستردّ عليك الوكالة قريبًا.",s10b:"أرسل طلبك إلى الوكالة.",
 tabL:"وكالات محلية",tabI:"شركاء دوليون",choose:"اختر هذه الوكالة",test:"وكالة تجريبية",noLocal:"لا توجد وكالة محلية لهذه الخدمة بعد. جرّب شريكًا دوليًا.",anyWhere:"أينما كنت، ستستلم وثيقتك. اختر إحدى الوكالات أدناه.",agN:"الخادم ",
 selfT:"تفضّل الحجز بنفسك؟",selfN:"مواقع مستقلة لا علاقة لها بـ Visa Checker. للتأشيرة، اختر حجزًا قابلًا للإلغاء.",you:"الوكالة المختارة",
 ln:"اللقب (كما في جواز السفر)",fn:"الاسم (كما في جواز السفر)",d1f:"تاريخ الذهاب",d2f:"تاريخ العودة",d1h:"الوصول (Check-in)",d2h:"المغادرة (Check-out)",city:"مدينة الوجهة (اختياري)",phone:"رقم واتساب / الهاتف",tg:"معرّف تيليغرام (اختياري)",mail:"البريد الإلكتروني (إلزامي)",chan:"كيف تريد أن نُخطرك؟",chanNote:"يصلك رابط الدفع والوثيقة دائمًا عبر البريد الإلكتروني. إذا اخترت واتساب فسنراسلك فقط لنطلب منك مراجعة بريدك الإلكتروني.",
 ch:{whatsapp:"واتساب",telegram:"تيليغرام",email:"بريد إلكتروني",sms:"رسالة SMS"},
 consent:"أوافق على إرسال هذه المعلومات إلى الوكالة المختارة لمعالجة طلبي.",send:"أرسل طلبي",sending:"جارٍ الإرسال…",
 payNote:"تصلك الوثيقة بعد الدفع. للتأشيرة، اطلب حجزًا قابلًا للإلغاء.",
 e:{req:"حقل إلزامي",name:"اكتب بحروف لاتينية كما في جواز السفر.",phone:"رقم غير صالح: اختر رمز الدولة ثم اكتب الرقم (مثال: 20 123 456).",tg:"معرّف غير صالح (من 5 إلى 32 حرفًا: حروف وأرقام و _).",mail:"بريد إلكتروني غير صالح.",needTg:"أضف معرّف تيليغرام لهذه القناة.",needMail:"البريد الإلكتروني إلزامي: يصلك رابط الدفع والوثيقة عبر البريد الإلكتروني.",past:"يجب أن يكون التاريخ اليوم أو بعده.",dFlight:"يجب أن تكون العودة في يوم الذهاب أو بعده.",dHotel:"يجب أن تكون المغادرة بعد الوصول.",consent:"علّم المربع للمتابعة."},
 okT:function(a){return "تم إرسال الطلب"},okTxt:function(c,v){return "ستصلك رسالة برابط الدفع ثم وثيقتك عبر "+c+" ("+v+")."},
 manT:"أرسل طلبك إلى الوكالة",manTxt:"هذه الصفحة غير مرتبطة بخادم بعد (وضع تجريبي). استعمل أحد الأزرار: ستردّ عليك الوكالة برابط الدفع.",failTxt:"فشل الإرسال التلقائي. استعمل أحد الأزرار لإرسال الطلب إلى الوكالة.",
 recap:"الملخص",bWA:"أرسل عبر واتساب",bMail:"أرسل بالبريد الإلكتروني",bTg:"افتح تيليغرام (تم نسخ النص)",tgHint:"تم نسخ النص: الصقه في محادثة تيليغرام."}
};
function escA(s){return esc(s).replace(/"/g,"&quot;")}
function today(){return new Date().toISOString().slice(0,10)}
function fmtD(v){var m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(v||"");return m?m[3]+"/"+m[2]+"/"+m[1]:v}
function findAgent(id){var k,i,l;for(k in PARTNERS){l=PARTNERS[k];for(i=0;i<l.length;i++){if(l[i].id===id)return l[i]}}for(i=0;i<INTL.length;i++){if(INTL[i].id===id)return INTL[i]}return null}
function rq(st){var R=RT[S.lang];return st===8?R.t8:st===9?R.t9:(RQ.mode==="sent"?R.t10a:R.t10b)}
function rqs(st){var R=RT[S.lang];return st===8?R.s8:st===9?R.s9:(RQ.mode==="sent"?R.s10a:R.s10b)}
var STP={fr:["Service","Agence","Infos","Envoi"],en:["Service","Agency","Details","Send"],ar:["الخدمة","الوكالة","البيانات","الإرسال"]};
var NS={fr:["L'agence reçoit votre demande","Vous recevez le lien de paiement","Vous payez et recevez votre document"],en:["The agency receives your request","You receive the payment link","You pay and receive your document"],ar:["تستلم الوكالة طلبك","يصلك رابط الدفع","تدفع وتستلم وثيقتك"]};
function stepper(n,labels){var Lb=labels||STP[S.lang];return '<ol class="stp" aria-label="'+Lb.join(", ")+'">'+Lb.map(function(x,i){return '<li class="'+(i+1<n?'dn':i+1===n?'on':'')+'"'+(i+1===n?' aria-current="step"':'')+'><i>'+(i+1<n?'✓':i+1)+'</i><span>'+x+'</span></li>'}).join("")+'</ol>'}
function initials(n){return n.split(/\s+/).slice(0,2).map(function(w){return w.charAt(0)}).join("").toUpperCase()}
function avHtml(p){return '<span class="av" aria-hidden="true">'+(p.logo?'<img src="'+p.logo+'" alt="">':initials(p.name))+'</span>'}
function agentCard(p,R,n){return '<div class="ag-card ag-anon"><div class="ag-body"><span class="ag-no">'+R.agN+n+'</span><span class="ag-meta">'+p.what[S.lang]+'</span></div><button type="button" class="pay wide" data-agent="'+p.id+'">'+R.choose+'</button></div>'}
function pickHtml(t){
  var R=RT[S.lang],L=S.lang,pt=S.pt==="intl"?"intl":"local";
  var svc=function(p){return p.svc.indexOf(S.need)>-1};
  var tabs=[["local",R.tabL]];if(INTL.filter(svc).length)tabs.push(["intl",R.tabI]);else pt="local";
  var h=stepper(2)+'<div class="panel"><span class="svc-pill">'+R.svc[S.need]+'</span>'+(tabs.length>1?'<div class="chips seg" role="group" aria-label="'+R.svc[S.need]+'">'+tabs.map(function(x){return '<button type="button" class="chip" data-pt="'+x[0]+'" aria-pressed="'+(pt===x[0])+'">'+x[1]+'</button>'}).join("")+'</div>':'');
  if(pt==="intl"){h+=INTL.filter(svc).map(function(p,i){return agentCard(p,R,i+1)}).join("")}
  else{
    var seen={},list=[];delete PARTNERS._srv;Object.keys(PARTNERS).forEach(function(k){PARTNERS[k].forEach(function(p){if(!seen[p.id]&&svc(p)){seen[p.id]=1;list.push(p)}})});list=list.slice(0,4);
    /* Le client ne voit que « Serveur 1, 2, 3 » (jamais le nom d'une agence). Chaque serveur garde les contacts de l'agence réelle (real/rid servent à l'envoi). Au moins 3 serveurs. */
    if(list.length){var base=list.slice(),srv=[],cnt=Math.max(3,list.length);for(var j=0;j<cnt;j++){var b=base[j%base.length];srv.push(Object.assign({},b,{id:"srv"+(j+1)+"-"+b.id,name:R.agN+(j+1),real:b.name,rid:b.id}))}list=srv;PARTNERS._srv=srv}
    h+=list.length?'<p class="ag-sub srv-sub">'+R.anyWhere+'</p><div class="srv-row">'+list.map(function(p,i){return agentCard(p,R,i+1)}).join("")+'</div>':'<p class="ag-none">'+R.noLocal+'</p>';
  }
  h+='</div>';
  var links=WORLD.filter(function(x){return x.svc.indexOf(S.need)>-1});
  h+='<div class="needs"><h2>'+R.selfT+'</h2><p class="ag-sub">'+R.selfN+'</p>'+tilesHtml(links)+'</div>';
  return h;
}
var A11Y={
  fr:{cons:"Consentement",sum:function(n,l){return n+(n>1?" champs à corriger : ":" champ à corriger : ")+l}},
  en:{cons:"Consent",sum:function(n,l){return n+(n>1?" fields to fix: ":" field to fix: ")+l}},
  ar:{cons:"الموافقة",sum:function(n,l){return "عدد الحقول التي تحتاج تصحيحًا: "+n+" — "+l}}
};
function fErr(k){return (RQ.er&&RQ.er[k])||""}
function phoneFld(R){var cc=RQ.cc||"+216";return '<div class="field"><label class="q-label" for="rq-phone">'+R.phone+'</label><div class="ph-row"><select class="sel ph-cc" id="rq-cc" data-f="cc" dir="ltr" aria-label="'+TXB[S.lang].cc+'" autocomplete="tel-country-code">'+DIAL.map(function(d){return '<option value="'+d[0]+'"'+(d[0]===cc?' selected':'')+'>'+d[0]+'</option>'}).join("")+'</select><input class="sel" id="rq-phone" data-f="phone" type="tel" inputmode="tel" dir="ltr" autocomplete="tel-national" placeholder="20 123 456" value="'+escA(RQ.phone)+'" aria-describedby="fe-phone" aria-required="true" aria-invalid="'+(fErr("phone")?"true":"false")+'"></div><span class="fe" id="fe-phone">'+esc(fErr("phone"))+'</span></div>'}
function destName(){var c=COUNTRIES.filter(function(x){return x.id===RQ.dest})[0];return c?c.n.fr:""}
function destFld(R){var L=S.lang,cmp=function(a,b){return nm(a).localeCompare(nm(b),L)};return '<div class="field"><label class="q-label" for="rq-dest">'+TXB[L].destL+'</label><select class="sel" id="rq-dest" data-f="dest" aria-describedby="fe-dest" aria-required="true" aria-invalid="'+(fErr("dest")?"true":"false")+'"><option value="">'+TXB[L].destPh+'</option>'+COUNTRIES.slice().sort(cmp).map(function(c){return '<option value="'+c.id+'"'+(c.id===RQ.dest?' selected':'')+'>'+esc(nm(c))+'</option>'}).join("")+'</select><span class="fe" id="fe-dest">'+esc(fErr("dest"))+'</span></div>'}
function cityFld(R){var c=COUNTRIES.filter(function(x){return x.id===RQ.dest})[0],L=c?(cityList(c.id)||[]):[];return fld("city",c?TXB[S.lang].cityL(c.n[S.lang]):TXB[S.lang].cityG,"text",'autocomplete="off" list="dl-city" placeholder="'+escA(TXB[S.lang].cityPh)+'"'+(c?'':' disabled'))+'<datalist id="dl-city">'+L.map(function(x){return '<option value="'+escA(x[0])+'"></option>'}).join("")+'</datalist>'}
function fld(id,label,type,extra){var req=/^(ln|fn|d1|d2|phone|city)$/.test(id);return '<div class="field"><label class="q-label" for="rq-'+id+'">'+label+'</label><input class="sel" id="rq-'+id+'" data-f="'+id+'" type="'+type+'" value="'+escA(RQ[id])+'" aria-describedby="fe-'+id+'" aria-invalid="'+(fErr(id)?"true":"false")+'"'+(req?' aria-required="true"':'')+' '+(extra||'')+'><span class="fe" id="fe-'+id+'">'+esc(fErr(id))+'</span></div>'}
function formHtml(t){
  var R=RT[S.lang],a=findAgent(S.agent),hot=S.need==="hotel",td=today(),up='autocapitalize="characters" autocomplete="off" style="text-transform:uppercase"';
  return stepper(3)+'<div class="panel"><div class="ag-card sel-ag ag-anon"><div class="ag-body"><b>'+R.svc[S.need]+'</b></div></div>'
   +'<form class="req-form" id="rqform" novalidate>'
   +'<div class="f-row">'+fld("ln",R.ln,"text",up)+fld("fn",R.fn,"text",up)+'</div>'
   +'<div class="f-row">'+fld("d1",hot?R.d1h:R.d1f,"date",'min="'+td+'"')+fld("d2",hot?R.d2h:R.d2f,"date",'min="'+(RQ.d1||td)+'"')+'</div>'
   +destFld(R)+cityFld(R)
   +phoneFld(R)
   +fld("mail",R.mail,"email",'dir="ltr" autocomplete="email" autocapitalize="off"')
   +'<div class="q"><span class="q-label">'+R.chan+'</span><div class="chips chgrid" role="group" aria-label="'+R.chan+'">'+["email","whatsapp"].map(function(c){return '<button type="button" class="chip" data-chan="'+c+'" aria-pressed="'+(RQ.chan===c)+'">'+R.ch[c]+'</button>'}).join("")+'</div><p class="rf-sub">'+R.chanNote+'</p></div>'
   +'<div class="field"><label class="item"><input type="checkbox" data-f="consent" id="rq-consent" aria-required="true" aria-describedby="fe-consent" aria-invalid="'+(fErr("consent")?"true":"false")+'"'+(RQ.consent?' checked':'')+'><span class="i-body"><span class="i-title">'+R.consent+'</span></span></label><span class="fe" id="fe-consent">'+esc(fErr("consent"))+'</span></div>'
   +'<div class="hp" aria-hidden="true"><label for="rq-website">Website</label><input type="text" id="rq-website" name="website" tabindex="-1" autocomplete="off"></div>'+'<p class="ag-note">'+R.payNote+'</p><span class="fe" id="fe-form" role="alert"></span>'
   +n48()+'<button type="submit" class="pay wide" id="rqsend">'+R.send+'</button></form></div>';
}

/* ===== Villes de destination par pays du visa (la ville doit appartenir au pays choisi). Variantes séparées par « | » ; la première s'affiche.
   Pour ajouter une ville : ajoutez-la à la chaîne du pays. ===== */
var CITIES={
 fr:"Paris,Marseille,Lyon,Nice,Toulouse,Bordeaux,Lille,Strasbourg,Nantes,Montpellier,Cannes,Rennes,Grenoble,Rouen,Annecy,Avignon,Biarritz,Perpignan,Toulon,Dijon,Nîmes|Nimes,Metz,Tours,Reims,Saint-Étienne|Saint-Etienne,Clermont-Ferrand,Le Havre,Brest,Ajaccio,Bastia,Aix-en-Provence,Orléans|Orleans,Angers,Caen,Limoges,Poitiers,Mulhouse,Colmar,La Rochelle,Chamonix,Disneyland Paris|Marne-la-Vallée",
 de:"Berlin,Munich|München|Munchen,Frankfurt,Hambourg|Hamburg,Cologne|Köln|Koln,Düsseldorf|Dusseldorf,Stuttgart,Leipzig,Dresde|Dresden,Nuremberg|Nürnberg|Nurnberg,Hanovre|Hannover,Brême|Bremen,Dortmund,Essen,Bonn,Heidelberg,Fribourg|Freiburg,Mannheim,Karlsruhe,Aix-la-Chapelle|Aachen,Mayence|Mainz,Wiesbaden,Potsdam,Augsbourg|Augsburg,Münster|Munster,Kiel,Rostock,Ulm,Wolfsburg,Bielefeld",
 it:"Rome|Roma,Milan|Milano,Venise|Venice|Venezia,Florence|Firenze,Naples|Napoli,Turin|Torino,Bologne|Bologna,Gênes|Genes|Genova,Vérone|Verona,Pise|Pisa,Palerme|Palermo,Catane|Catania,Bari,Cagliari,Padoue|Padova,Trieste,Bergame|Bergamo,Rimini,Sorrente|Sorrento,Amalfi,Sienne|Siena,Parme|Parma,Lucques|Lucca,Brescia,Modène|Modena,Pérouse|Perugia,Ancône|Ancona,Lecce,Côme|Como,Syracuse|Siracusa,Taormine|Taormina,Capri",
 es:"Madrid,Barcelone|Barcelona,Valence|Valencia,Séville|Seville|Sevilla,Malaga|Málaga,Bilbao,Grenade|Granada,Alicante,Palma de Majorque|Palma|Palma de Mallorca,Tenerife,Las Palmas,Ibiza,Saragosse|Zaragoza,Murcie|Murcia,Saint-Sébastien|San Sebastian|San Sebastián,Cordoue|Cordoba|Córdoba,Marbella,Tolède|Toledo,Salamanque|Salamanca,Saint-Jacques-de-Compostelle|Santiago de Compostela,Gérone|Girona,Benidorm,Cadix|Cadiz|Cádiz,Valladolid,Pampelune|Pamplona,Lanzarote,Minorque|Menorca,Torremolinos,Salou",
 be:"Bruxelles|Brussels,Anvers|Antwerp|Antwerpen,Gand|Ghent|Gent,Bruges|Brugge,Liège|Liege,Charleroi,Namur,Louvain|Leuven,Mons,Ostende|Ostend,Malines|Mechelen,Hasselt,Tournai,Waterloo,Spa,Dinant",
 nl:"Amsterdam,Rotterdam,La Haye|The Hague|Den Haag,Utrecht,Eindhoven,Groningue|Groningen,Maastricht,Haarlem,Leyde|Leiden,Delft,Nimègue|Nijmegen,Breda,Arnhem,Tilburg,Almere,Zwolle,Alkmaar",
 ch:"Zurich|Zürich,Genève|Geneva|Genf|Geneve,Bâle|Basel|Bale,Berne|Bern,Lausanne,Lucerne|Luzern,Lugano,Zermatt,Interlaken,Saint-Gall|St. Gallen,Winterthour|Winterthur,Montreux,Neuchâtel|Neuchatel,Fribourg,Sion,Davos,Saint-Moritz|St. Moritz,Locarno,Verbier",
 at:"Vienne|Vienna|Wien,Salzbourg|Salzburg,Innsbruck,Graz,Linz,Klagenfurt,Hallstatt,Bregenz,Villach,Sankt Pölten|St. Pölten,Kitzbühel|Kitzbuhel",
 dk:"Copenhague|Copenhagen|København|Kobenhavn,Aarhus,Odense,Aalborg,Billund,Esbjerg,Roskilde,Kolding,Helsingør|Helsingor",
 fi:"Helsinki,Espoo,Tampere,Turku,Oulu,Rovaniemi,Vantaa,Lahti,Kuopio,Jyväskylä|Jyvaskyla,Vaasa,Levi,Ivalo",
 pt:"Lisbonne|Lisbon|Lisboa,Porto,Faro,Funchal|Madère|Madeira,Coimbra,Braga,Albufeira,Cascais,Sintra,Évora|Evora,Ponta Delgada|Açores|Azores,Lagos,Aveiro,Guimarães|Guimaraes,Setúbal|Setubal,Fatima|Fátima",
 gr:"Athènes|Athens|Athina,Thessalonique|Thessaloniki|Salonique,Héraklion|Heraklion,Santorin|Santorini,Mykonos,Rhodes,Corfou|Corfu,La Canée|Chania,Patras,Zante|Zakynthos,Kos,Crète|Crete,Nauplie|Nafplio,Volos,Delphes|Delphi,Naxos,Paros",
 pl:"Varsovie|Warsaw|Warszawa,Cracovie|Krakow|Kraków,Gdansk|Gdańsk,Wroclaw|Wrocław,Poznan|Poznań,Lodz|Łódź,Katowice,Szczecin,Lublin,Zakopane,Torun|Toruń,Rzeszow|Rzeszów,Bydgoszcz",
 cz:"Prague|Praha,Brno,Ostrava,Pilsen|Plzeň|Plzen,Olomouc,Karlovy Vary,Český Krumlov|Cesky Krumlov,Liberec,Kutná Hora|Kutna Hora",
 hu:"Budapest,Debrecen,Szeged,Pécs|Pecs,Győr|Gyor,Eger,Miskolc,Hévíz|Heviz,Balatonfüred|Balatonfured,Siófok|Siofok",
 se:"Stockholm,Göteborg|Gothenburg|Gothembourg|Goteborg,Malmö|Malmo,Uppsala,Lund,Kiruna,Umeå|Umea,Linköping|Linkoping,Örebro|Orebro,Västerås|Vasteras,Visby",
 no:"Oslo,Bergen,Trondheim,Stavanger,Tromsø|Tromso,Ålesund|Alesund,Kristiansand,Bodø|Bodo,Lofoten,Narvik",
 mt:"La Valette|Valletta,Sliema,Saint-Julien|St. Julian's|San Giljan,Mdina,Mellieħa|Mellieha,Gozo,Birgu,Marsaskala,Bugibba,Marsaxlokk",
 lu:"Luxembourg,Esch-sur-Alzette,Differdange,Dudelange,Echternach,Vianden,Clervaux",
 hr:"Zagreb,Split,Dubrovnik,Zadar,Pula,Rijeka,Šibenik|Sibenik,Hvar,Opatija,Rovinj,Poreč|Porec,Makarska,Trogir",
 si:"Ljubljana,Maribor,Bled,Piran,Koper,Celje,Portorož|Portoroz,Kranj,Bohinj",
 sk:"Bratislava,Košice|Kosice,Žilina|Zilina,Poprad,Banská Bystrica|Banska Bystrica,Nitra,Prešov|Presov,Trnava",
 lt:"Vilnius,Kaunas,Klaipėda|Klaipeda,Šiauliai|Siauliai,Palanga,Trakai",
 lv:"Riga|Rīga,Jūrmala|Jurmala,Liepāja|Liepaja,Daugavpils,Sigulda,Cēsis|Cesis",
 ee:"Tallinn,Tartu,Pärnu|Parnu,Narva,Kuressaare",
 is:"Reykjavik|Reykjavík,Akureyri,Keflavik|Keflavík,Selfoss,Húsavík|Husavik,Vík|Vik",
 li:"Vaduz,Schaan,Balzers,Triesen,Triesenberg",
 bg:"Sofia,Plovdiv,Varna,Bourgas|Burgas,Bansko,Sunny Beach|Slanchev Bryag,Golden Sands,Veliko Tarnovo,Ruse",
 ro:"Bucarest|Bucharest|București|Bucuresti,Cluj-Napoca|Cluj,Timișoara|Timisoara,Brașov|Brasov,Iași|Iasi,Constanța|Constanta,Sibiu,Oradea,Craiova,Sinaia",
 ca:"Toronto,Montréal|Montreal,Vancouver,Ottawa,Calgary,Québec|Quebec,Edmonton,Winnipeg,Halifax,Victoria,Niagara Falls,Mississauga,Gatineau,Laval,Hamilton,Saskatoon,Regina,Banff,Whistler",
 us:"New York,Los Angeles,Chicago,Miami,San Francisco,Washington|Washington D.C.|Washington DC,Boston,Las Vegas,Orlando,Houston,Dallas,Atlanta,Seattle,San Diego,Philadelphie|Philadelphia,Denver,Phoenix,La Nouvelle-Orléans|New Orleans,Honolulu,Détroit|Detroit,Austin,Nashville,Minneapolis,Portland,Salt Lake City,Tampa",
 gb:"Londres|London,Manchester,Édimbourg|Edimbourg|Edinburgh,Birmingham,Liverpool,Glasgow,Bristol,Leeds,Cardiff,Belfast,Oxford,Cambridge,Newcastle,Southampton,Nottingham,Brighton,Bath,York,Sheffield,Aberdeen",
 ae:"Dubaï|Dubai,Abou Dabi|Abu Dhabi,Charjah|Sharjah,Ajman,Ras Al Khaimah,Fujairah,Al Ain,Umm Al Quwain",
 sa:"Riyad|Riyadh,Djeddah|Jeddah,La Mecque|Mecca|Makkah,Médine|Medine|Medina|Madinah,Dammam,Taëf|Taif,Tabuk,Abha,AlUla|Al Ula,Yanbu,Khobar|Al Khobar,Neom",
 jp:"Tokyo,Osaka|Ōsaka,Kyoto|Kyōto,Nagoya,Sapporo,Fukuoka,Hiroshima,Nara,Yokohama,Kobe|Kōbe,Nagasaki,Naha|Okinawa,Sendai,Kanazawa,Hakone,Nikko|Nikkō,Kamakura",
 au:"Sydney,Melbourne,Brisbane,Perth,Adélaïde|Adelaide,Gold Coast,Canberra,Cairns,Darwin,Hobart,Newcastle",
 nz:"Auckland,Wellington,Christchurch,Queenstown,Rotorua,Dunedin,Hamilton,Napier,Tauranga",
 cn:"Pékin|Beijing|Peking,Shanghai|Shanghaï,Canton|Guangzhou,Shenzhen,Chengdu,Hong Kong|Hongkong,Xi'an|Xian,Hangzhou,Chongqing,Nankin|Nanjing,Wuhan,Macao|Macau,Tianjin,Suzhou,Guilin"
};
function normC(v){return String(v||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-z0-9]+/g," ").trim()}
function cityList(id){var c=CITIES[id];return c?c.split(",").map(function(x){return x.split("|")}):null}
function cityMatch(id,v){var L=cityList(id);if(!L)return v;var n=normC(v),i,j;for(i=0;i<L.length;i++)for(j=0;j<L[i].length;j++)if(normC(L[i][j])===n)return L[i][0];return null}
var DIAL=[["+216","TN"],["+213","DZ"],["+212","MA"],["+218","LY"],["+20","EG"],["+222","MR"],["+221","SN"],["+225","CI"],["+249","SD"],["+33","FR"],["+49","DE"],["+39","IT"],["+34","ES"],["+32","BE"],["+31","NL"],["+41","CH"],["+43","AT"],["+44","GB"],["+1","US/CA"],["+971","AE"],["+966","SA"],["+974","QA"],["+90","TR"],["+961","LB"],["+962","JO"]];
var TXB={
 fr:{cc:"Indicatif du pays",cityL:function(c){return "Ville de destination ("+c+")"},cityBad:function(c){return "Choisissez une ville de "+c+" dans la liste proposée (la destination doit correspondre au pays du visa)."},cityPh:"Commencez à taper…",destL:"Pays de destination",destPh:"Choisir un pays",cityG:"Ville (choisissez d'abord le pays)"},
 en:{cc:"Country dialling code",cityL:function(c){return "Destination city ("+c+")"},cityBad:function(c){return "Choose a city in "+c+" from the list (the destination must match the visa country)."},cityPh:"Start typing…",destL:"Destination country",destPh:"Choose a country",cityG:"City (choose the country first)"},
 ar:{cc:"رمز الدولة",cityL:function(c){return "مدينة الوجهة ("+c+")"},cityBad:function(c){return "اختر مدينة في "+c+" من القائمة (يجب أن تطابق الوجهة بلد التأشيرة)."},cityPh:"ابدأ بالكتابة…",destL:"بلد الوجهة",destPh:"اختر بلداً",cityG:"المدينة (اختر البلد أولاً)"}
};
function normPhoneCC(cc,v){var d=String(v||"").replace(/[\s().\-]/g,"");if(!d)return "";if(/^00/.test(d))d="+"+d.slice(2);else if(d.charAt(0)!=="+")d=(cc||"+216")+d.replace(/^0+/,"");return /^\+[0-9]{8,15}$/.test(d)?d:""}
function normPhone(v){var d=String(v||"").replace(/[\s().\-]/g,"");if(/^00/.test(d))d="+"+d.slice(2);if(/^216[0-9]{8}$/.test(d))d="+"+d;if(/^[0-9]{8}$/.test(d))d="+216"+d;return /^\+[0-9]{8,15}$/.test(d)?d:""}
function normTg(v){return String(v||"").trim().replace(/^https?:\/\/t\.me\//i,"").replace(/^@/,"")}
var SVCFR={flight:"Billet d'avion",hotel:"Réservation d'hôtel"},CHFR={whatsapp:"WhatsApp",telegram:"Telegram",email:"E-mail",sms:"SMS"};
function reqText(){
  var a=findAgent(S.agent),hot=S.need==="hotel",F=RQ;
  var l=["Demande Visa Checker : "+SVCFR[S.need],"Agence : "+a.name,"Pays de destination : "+destName(),"Nom : "+F.ln,"Prénom(s) : "+F.fn,(hot?"Check-in : ":"Date d'aller : ")+fmtD(F.d1),(hot?"Check-out : ":"Date de retour : ")+fmtD(F.d2)];
  if(F.city)l.push("Ville : "+F.city);
  l.push("Téléphone / WhatsApp : "+F.phone);if(F.tg)l.push("Telegram : @"+F.tg);if(F.mail)l.push("E-mail : "+F.mail);
  l.push("Canal pour le paiement et le document : "+CHFR[F.chan]);
  /* Lien de réponse en un clic pour l'agence, selon le canal choisi par le client */
  var reply=F.chan==="whatsapp"&&F.phone?"https://wa.me/"+F.phone.replace(/[^\d]/g,""):F.chan==="telegram"&&F.tg?"https://t.me/"+F.tg:F.chan==="email"&&F.mail?"mailto:"+F.mail:"";
  l.push("Paiement : utilisez uniquement le moyen de paiement sécurisé qui sera indiqué sur le site lorsqu’il sera activé. N’envoyez le document qu’après confirmation effective du paiement.");
  l.push("Modification : 48 h maximum, dates uniquement, jamais le nom ni le prénom.");
  if(reply)l.push("Répondre au client "+"(pour toute question)"+" : "+reply);
  return l.join("\n");
}
function contactFor(){return RQ.chan==="telegram"?"@"+RQ.tg:RQ.chan==="email"?RQ.mail:RQ.phone}
function doneHtml(t){
  var R=RT[S.lang],a=findAgent(S.agent),txt=reqText(),hot=S.need==="hotel",F=RQ,L=S.lang;
  var sh=function(x){return x.replace(/\s*\(.*?\)/g,'')},CHL={fr:'Canal',en:'Channel',ar:'القناة'};
  var rows=[[STP[L][0],R.svc[S.need]],[sh(R.ln),F.ln],[sh(R.fn),F.fn],[sh(hot?R.d1h:R.d1f),fmtD(F.d1)],[sh(hot?R.d2h:R.d2f),fmtD(F.d2)],[R.phone,F.phone]];
  if(F.tg)rows.push([sh(R.tg),"@"+F.tg]);if(F.mail)rows.push([sh(R.mail),F.mail]);rows.push([CHL[L],R.ch[F.chan]]);
  var h=stepper(4);
  if(F.mode==="sent"){
    h+='<div class="ok-hero"><span class="ok-ic" aria-hidden="true">✓</span><b>'+esc(R.okT(a.name))+'</b><p>'+esc(R.okTxt(R.ch[F.chan],contactFor()))+'</p></div>'
     +'<ol class="nxt">'+NS[L].map(function(x,i){return '<li class="'+(i===0?'dn':'')+'"><i>'+(i===0?'✓':i+1)+'</i><span>'+x+'</span></li>'}).join("")+'</ol>';
    h+=d17Later(a);
  }else{
    var enc=encodeURIComponent(txt),b='';
    if(a.email)b+='<a class="pay wide" href="mailto:'+a.email+'?subject='+encodeURIComponent("Visa Checker : "+SVCFR[S.need])+'&body='+enc+'">'+R.bMail+'</a>';
    if(a.whatsapp)b+='<a class="pay wide alt" href="https://wa.me/'+a.whatsapp+'?text='+enc+'" target="_blank" rel="noopener noreferrer">'+R.bWA+'</a>';
    h+='<div class="book"><b>'+R.manT+'</b><p>'+(F.failed?R.failTxt:R.manTxt)+'</p></div><div class="act">'+b+'</div>';
  }
  h+=n48();
  h+='<div class="recap"><h2>'+R.recap+'</h2><dl>'+rows.map(function(r){return '<div><dt>'+esc(r[0])+'</dt><dd>'+esc(r[1])+'</dd></div>'}).join("")+'</dl></div>';
  return h;
}
var ERX={
 fr:{long:"Trop long (60 caractères au maximum).",city:"Caractères non autorisés dans la ville.",date:"Date invalide.",far:"Choisissez une date dans les 18 prochains mois.",stay:"Séjour trop long (365 jours au maximum).",mailLong:"E-mail trop long.",
  dup:"Une demande vient d'être envoyée. Patientez quelques secondes avant d'en envoyer une autre.",
  net:"Pas de connexion. Vérifiez votre réseau puis réessayez.",timeout:"Le serveur met trop de temps à répondre. Réessayez.",invalid:"La demande a été refusée : vérifiez les champs puis réessayez.",rate:"Trop de demandes. Réessayez dans quelques minutes.",server:"Service momentanément indisponible. Réessayez."},
 en:{long:"Too long (60 characters maximum).",city:"Characters not allowed in the city.",date:"Invalid date.",far:"Choose a date within the next 18 months.",stay:"Stay too long (365 days maximum).",mailLong:"E-mail too long.",
  dup:"A request was just sent. Wait a few seconds before sending another one.",
  net:"No connection. Check your network and try again.",timeout:"The server is taking too long to answer. Try again.",invalid:"The request was rejected: check the fields and try again.",rate:"Too many requests. Try again in a few minutes.",server:"Service temporarily unavailable. Try again."},
 ar:{long:"طويل جدًا (60 حرفًا كحد أقصى).",city:"أحرف غير مسموح بها في اسم المدينة.",date:"تاريخ غير صالح.",far:"اختر تاريخًا ضمن الأشهر الـ18 القادمة.",stay:"مدة الإقامة طويلة جدًا (365 يومًا كحد أقصى).",mailLong:"البريد الإلكتروني طويل جدًا.",
  dup:"تم إرسال طلب للتو. انتظر بضع ثوانٍ قبل إرسال طلب آخر.",
  net:"لا يوجد اتصال. تحقق من الشبكة ثم أعد المحاولة.",timeout:"الخادم يتأخر في الرد. أعد المحاولة.",invalid:"تم رفض الطلب: تحقق من الحقول ثم أعد المحاولة.",rate:"طلبات كثيرة. أعد المحاولة بعد دقائق.",server:"الخدمة غير متاحة مؤقتًا. أعد المحاولة."}
};
function isoOk(v){if(!/^\d{4}-\d{2}-\d{2}$/.test(v))return false;var d=new Date(v+"T00:00:00Z");return !isNaN(d)&&d.toISOString().slice(0,10)===v}
function dayDiff(a,b){return Math.round((new Date(b+"T00:00:00Z")-new Date(a+"T00:00:00Z"))/864e5)}
function cleanTxt(v){return String(v||"").replace(/[\u0000-\u001f\u007f]/g,"").replace(/\s+/g," ").trim()}
/* Validation stricte : renvoie {er:{champ:message}, clean:{valeurs nettoyées}} */
function validateRequest(F,need){
  var R=RT[S.lang],E=R.e,X=ERX[S.lang],er={},hot=need==="hotel",td=today(),lim=new Date(Date.now()+548*864e5).toISOString().slice(0,10);
  var ln=cleanTxt(F.ln),fn=cleanTxt(F.fn),city=cleanTxt(F.city),mail=cleanTxt(F.mail).toLowerCase(),tg=normTg(cleanTxt(F.tg)),phone=normPhoneCC(F.cc,F.phone),latin=/^[A-Za-z][A-Za-z' \-]*$/;
  if(!ln)er.ln=E.req;else if(ln.length>60)er.ln=X.long;else if(!latin.test(ln))er.ln=E.name;
  if(!fn)er.fn=E.req;else if(fn.length>60)er.fn=X.long;else if(!latin.test(fn))er.fn=E.name;
  if(!F.d1)er.d1=E.req;else if(!isoOk(F.d1))er.d1=X.date;else if(F.d1<td)er.d1=E.past;else if(F.d1>lim)er.d1=X.far;
  if(!F.d2)er.d2=E.req;else if(!isoOk(F.d2))er.d2=X.date;else if(F.d1&&isoOk(F.d1)){
    if(hot?F.d2<=F.d1:F.d2<F.d1)er.d2=hot?E.dHotel:E.dFlight;else if(dayDiff(F.d1,F.d2)>365)er.d2=X.stay}
  var dc=COUNTRIES.filter(function(x){return x.id===F.dest})[0];
  if(!dc)er.dest=E.req;
  var cmatch=(city&&dc)?cityMatch(dc.id,city):null;
  if(!city)er.city=E.req;else if(city.length>60)er.city=X.long;else if(dc&&cmatch===null)er.city=TXB[S.lang].cityBad(dc.n[S.lang]);
  if(!phone)er.phone=cleanTxt(F.phone)?E.phone:E.req;
  if(tg&&!/^[A-Za-z0-9_]{5,32}$/.test(tg))er.tg=E.tg;
  if(mail){if(mail.length>254)er.mail=X.mailLong;else if(!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(mail))er.mail=E.mail}
  if(F.chan==="telegram"&&!tg&&!er.tg)er.tg=E.needTg;
  if(!mail&&!er.mail)er.mail=E.needMail;
  if(!F.consent)er.consent=E.consent;
  return {er:er,clean:{ln:ln.toUpperCase(),fn:fn.toUpperCase(),city:cmatch||city,mail:mail,tg:tg,phone:phone}};
}
function newId(){try{if(crypto.randomUUID)return crypto.randomUUID()}catch(e){}return "r"+Date.now().toString(36)+Math.random().toString(36).slice(2,10)}
/* Envoi avec délai maximal, nouvelle tentative (erreurs réseau / 5xx) et lecture du statut HTTP en mode "cors". */
function postRequest(payload){
  var attempt=0;
  function once(){
    if(REQUEST_MODE==="cors"){
      return fetchJson(REQUEST_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","Idempotency-Key":payload.requestId},body:JSON.stringify(payload)},REQUEST_TIMEOUT_MS).then(function(r){
        if(r.err)return {ok:false,kind:r.err,retry:true};
        if(r.ok)return {ok:true,kind:"sent"};
        if(r.status===429)return {ok:false,kind:"rate",status:429};
        if(r.status>=400&&r.status<500)return {ok:false,kind:"invalid",status:r.status};
        return {ok:false,kind:"server",status:r.status,retry:true};
      });
    }
    var fd=new URLSearchParams(),k;
    for(k in payload){if(k!=="agency")fd.append(k,payload[k])}
    fd.append("agencyName",payload.agency.name);fd.append("agencyEmail",payload.agency.email);fd.append("agencyTelegram",payload.agency.telegram);fd.append("agencyWhatsapp",payload.agency.whatsapp);
    var ctl=typeof AbortController==="function"?new AbortController():null,timer=ctl&&setTimeout(function(){ctl.abort()},REQUEST_TIMEOUT_MS);
    return fetch(REQUEST_URL,{method:"POST",mode:"no-cors",credentials:"omit",body:fd,signal:ctl?ctl.signal:undefined}).then(function(){clearTimeout(timer);return {ok:true,kind:"sent"}},
      function(err){clearTimeout(timer);return {ok:false,kind:(err&&err.name==="AbortError")?"timeout":"net",retry:true}});
  }
  function run(){return once().then(function(r){
    if(r.ok||!r.retry||attempt>=REQUEST_RETRIES)return r;
    attempt++;return new Promise(function(ok){setTimeout(ok,800*Math.pow(2,attempt-1))}).then(run);
  })}
  return run();
}
function submitReq(){
  if(RQ.sending)return;
  var R=RT[S.lang],X=ERX[S.lang],a=findAgent(S.agent),F=RQ,v=validateRequest(F,S.need),er=v.er,c=v.clean;
  RQ.er=er;
  ["ln","fn","d1","d2","dest","city","phone","tg","mail","consent"].forEach(function(k){var s=$("fe-"+k),i=$("rq-"+k);if(s)s.textContent=er[k]||"";if(i)i.setAttribute("aria-invalid",er[k]?"true":"false")});
  var form=$("fe-form");if(form)form.textContent="";
  var bad=Object.keys(er);
  if(bad.length){
    var hot=S.need==="hotel",LB={ln:R.ln,fn:R.fn,d1:hot?R.d1h:R.d1f,d2:hot?R.d2h:R.d2f,dest:TXB[S.lang].destL,city:TXB[S.lang].cityG,phone:R.phone,tg:R.tg,mail:R.mail,consent:A11Y[S.lang].cons};
    if(form)form.textContent=A11Y[S.lang].sum(bad.length,bad.map(function(k){return LB[k]}).join(", "));
    var f=$("rq-"+bad[0]);if(f)f.focus();return}
  RQ.er={};F.ln=c.ln;F.fn=c.fn;F.city=c.city;F.phone=c.phone;F.tg=c.tg;F.mail=c.mail;
  function fin(mode,failed){F.done=true;F.mode=mode;F.failed=!!failed;F.tries=0;S.step=10;save();render();window.scrollTo(0,0)}
  var hp=$("rq-website");if(hp&&hp.value){fin("sent");return}              /* champ piège rempli par un robot : on fait semblant */
  try{var last=+sessionStorage.getItem("vc-last-send")||0;if(Date.now()-last<REQUEST_COOLDOWN_MS){if(form)form.textContent=X.dup;return}}catch(e){}
  if(!REQUEST_URL){fin("manual");return}
  F.rid=newId();
  var payload={requestId:F.rid,service:S.need,destination:destName(),lastName:c.ln,firstName:c.fn,date1:F.d1,date2:F.d2,city:c.city,phone:c.phone,telegram:c.tg,email:c.mail,channel:F.chan,lang:S.lang,sentAt:new Date().toISOString(),
    agency:{id:a.rid||a.id,name:a.real||a.name,email:a.email||"",telegram:a.telegram||"",whatsapp:a.whatsapp||""},message:reqText()};
  var btn=$("rqsend");RQ.sending=true;btn.disabled=true;btn.setAttribute("aria-busy","true");btn.textContent=R.sending;
  postRequest(payload).then(function(r){
    RQ.sending=false;
    if(r.ok){try{sessionStorage.setItem("vc-last-send",String(Date.now()))}catch(e){}fin("sent");return}
    F.tries=(F.tries||0)+1;
    if(F.tries>=2&&r.kind!=="invalid"&&r.kind!=="rate"){fin("manual",true);return}           /* 2 échecs : on propose l'envoi manuel */
    var b=$("rqsend"),fe=$("fe-form");
    if(b){b.disabled=false;b.removeAttribute("aria-busy");b.textContent=R.send}
    if(fe)fe.textContent=X[r.kind==="net"?"net":r.kind]||X.server;
  });
}
var NEEDART={flight:'<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="ngf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b8cff"/><stop offset=".6" stop-color="#7cc4ff"/><stop offset="1" stop-color="#ffb347"/></linearGradient></defs><rect width="64" height="64" fill="url(#ngf)"/><circle cx="46" cy="44" r="11" fill="#fff3c4" opacity=".9"/><ellipse cx="16" cy="50" rx="16" ry="7" fill="#fff" opacity=".95"/><ellipse cx="50" cy="56" rx="18" ry="7" fill="#fff"/><path class="nt" d="M6 40C16 36 24 30 32 24" stroke="#fff" stroke-width="2.5" stroke-linecap="round" stroke-dasharray="1 6" fill="none"/><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" transform="translate(37 22) rotate(45) scale(1.5) translate(-12 -12)" fill="#fff" stroke="#1d4ed8" stroke-width="1.1" paint-order="stroke"/></svg>',hotel:'<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false"><defs><linearGradient id="nhg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b2a8c"/><stop offset=".55" stop-color="#b24a8f"/><stop offset="1" stop-color="#3b82f6"/></linearGradient></defs><rect width="64" height="64" fill="url(#nhg)"/><g fill="#fff"><circle cx="10" cy="10" r="1.3"/><circle cx="26" cy="7" r="1"/><circle cx="56" cy="9" r="1.3"/><circle cx="38" cy="14" r="1"/></g><circle cx="47" cy="24" r="11" fill="#ffd27a" opacity=".5"/><circle cx="47" cy="24" r="4.5" fill="#fff3c4"/><rect x="7" y="22" width="5" height="32" rx="2" fill="#fff"/><rect x="7" y="38" width="50" height="12" rx="3" fill="#fff"/><rect x="24" y="38" width="33" height="12" rx="3" fill="#ffb347"/><rect x="13" y="31" width="15" height="8" rx="4" fill="#fff3e6"/><rect x="10" y="50" width="4" height="6" rx="1" fill="#fff"/><rect x="50" y="50" width="4" height="6" rx="1" fill="#fff"/></svg>'};
/* Photos réelles (optionnelles) : déposez photo-avion.jpg et photo-hotel.jpg à côté de index.html. Si le fichier est absent, l'illustration reste affichée. */
var NEEDPHOTO={flight:'photo-avion.jpg',hotel:'photo-hotel.jpg'};
document.addEventListener('load',function(e){var i=e.target;if(i&&i.classList&&i.classList.contains('need-ph'))i.classList.add('ok')},true);
document.addEventListener('error',function(e){var i=e.target;if(i&&i.classList&&i.classList.contains('need-ph'))i.remove()},true);
var NEEDGO={fr:'Choisir',en:'Choose',ar:'اختر'};
function needCard(k,label){return '<button type="button" class="sp-chip need-card" data-need="'+k+'"><span class="need-ic">'+NEEDART[k]+'<img class="need-ph" src="'+NEEDPHOTO[k]+'" alt="" width="136" height="136" loading="lazy" decoding="async"></span><span class="need-tx"><b>'+label+'</b><span class="need-go">'+(NEEDGO[S.lang]||NEEDGO.fr)+'</span></span></button>'}
function needsHtml(t){return '<div class="needs"><h2 class="hot">'+t.needTitle+'</h2><p class="ag-sub">'+t.needSub+'</p><div class="sp-chips">'+needCard('flight',t.needFlight)+needCard('hotel',t.needHotel)+'</div></div>'}
var SPSEL={local:"",world:""};
function spGroups(){return [
 {id:"local",title:SPT.local,cats:[["ag",SPT.sAg,SPT.cAg],["ins",SPT.sIns,SPT.cIns],["car",SPT.sCar,SPT.cCar]],list:LOCAL},
 {id:"world",title:SPT.world,cats:[["car",SPT.sCar,SPT.cCar],["fh",SPT.cFh,SPT.cFh]],list:WORLD}]}
function spResult(g){
  var L=S.lang,sel=SPSEL[g.id],c=g.cats.filter(function(x){return x[0]===sel})[0];
  if(!c)return '<p class="sp-hint"><i aria-hidden="true">\uD83D\uDC46</i>'+SPT.pick[L]+'</p>';
  var arr=g.list.filter(function(x){return x.g===sel});
  return '<p class="sp-cat">'+c[2][L]+'</p>'+(arr.length?tilesHtml(arr):'<p class="sp-hint">'+SPT.soon[L]+'</p>');
}
function groupsHtml(){
  var L=S.lang;
  return spGroups().map(function(g){
    return '<div class="spg" data-g="'+g.id+'"><div class="spg-head"><h3 class="sp-grp">'+g.title[L]+'</h3><div class="sp-cats" role="group" aria-label="'+g.title[L]+'">'
      +g.cats.map(function(c){return '<button type="button" class="sp-cb" data-spc="'+g.id+':'+c[0]+'" aria-pressed="'+(SPSEL[g.id]===c[0])+'">'+c[1][L]+'</button>'}).join("")
      +'</div></div><div class="sp-res" id="spr-'+g.id+'" aria-live="polite">'+spResult(g)+'</div></div>';
  }).join("");
}
function spSync(){
  document.querySelectorAll(".sp-cb").forEach(function(b){var p=b.dataset.spc.split(":");b.setAttribute("aria-pressed",String(SPSEL[p[0]]===p[1]))});
  spGroups().forEach(function(g){var el=$("spr-"+g.id);if(el)el.innerHTML=spResult(g)});
}
/* ===== Préparer l'entretien (si convoqué) : bloc repliable sur la liste des pièces ===== */
var IVT={"fr": {"t": "Préparer mon entretien (si je suis convoqué)", "s": "Une convocation n'est pas un refus : le consulat veut simplement vérifier certains points de votre dossier.", "secs": [["Avant l'entretien", ["Relisez tout votre dossier : dates, montants, adresses et noms doivent être identiques partout.", "Emportez le passeport, la convocation, les originaux et une copie de chaque pièce, classés dans l'ordre.", "Préparez les justificatifs de vos attaches en Tunisie : travail, études, famille, biens.", "Arrivez en avance et habillez-vous simplement."]], ["Questions fréquentes", ["Quel est le but de votre voyage ?", "Combien de temps restez-vous et où logerez-vous ?", "Qui paie le voyage ? Quelles sont vos ressources ?", "Que faites-vous dans la vie, et qui vous attend en Tunisie ?", "Avez-vous déjà voyagé ? Avez-vous déjà eu un refus ?", "Connaissez-vous quelqu'un dans le pays de destination ?", "Quand rentrez-vous en Tunisie ?"]], ["Comment répondre", ["Dites la vérité, avec des réponses courtes et claires.", "Vos réponses doivent correspondre exactement à votre dossier.", "N'apprenez pas de texte par cœur : parlez naturellement.", "Si vous ne comprenez pas la question, demandez de la répéter.", "N'inventez jamais : une contradiction est plus grave qu'une réponse simple."]], ["À éviter", ["Un document falsifié ou modifié, même légèrement.", "Des réponses différentes de ce qui est écrit dans votre dossier.", "Une réservation que vous ne pouvez pas expliquer ou justifier.", "Les conseils d'un intermédiaire qui vous dicte quoi répondre."]]], "n": "Ces conseils aident à se préparer. Ils ne garantissent pas l'obtention du visa : la décision revient au consulat."}, "en": {"t": "Prepare for your interview (if you are called)", "s": "Being called in is not a refusal: the consulate just wants to check some points of your file.", "secs": [["Before the interview", ["Reread your whole file: dates, amounts, addresses and names must match everywhere.", "Bring your passport, the summons, the originals and one copy of each document, in order.", "Prepare proof of your ties to Tunisia: job, studies, family, property.", "Arrive early and dress simply."]], ["Frequent questions", ["What is the purpose of your trip?", "How long will you stay and where will you stay?", "Who pays for the trip? What are your resources?", "What do you do for a living, and who is waiting for you in Tunisia?", "Have you travelled before? Have you ever been refused?", "Do you know anyone in the destination country?", "When will you return to Tunisia?"]], ["How to answer", ["Tell the truth, with short and clear answers.", "Your answers must match your file exactly.", "Do not memorise a script: speak naturally.", "If you do not understand a question, ask for it to be repeated.", "Never invent anything: a contradiction is worse than a simple answer."]], ["What to avoid", ["A forged or altered document, even slightly.", "Answers that differ from what your file says.", "A booking you cannot explain or justify.", "Advice from an intermediary who tells you what to answer."]]], "n": "These tips help you prepare. They do not guarantee a visa: the decision belongs to the consulate."}, "ar": {"t": "التحضير للمقابلة (في حال تمت دعوتي)", "s": "الدعوة إلى مقابلة لا تعني الرفض: القنصلية تريد فقط التحقق من بعض نقاط ملفك.", "secs": [["قبل المقابلة", ["أعد قراءة ملفك كاملاً: يجب أن تتطابق التواريخ والمبالغ والعناوين والأسماء في كل الوثائق.", "أحضر جواز السفر ورسالة الاستدعاء والوثائق الأصلية ونسخة من كل وثيقة، مرتبة.", "جهّز ما يثبت ارتباطك بتونس: العمل أو الدراسة أو العائلة أو الممتلكات.", "احضر مبكراً وارتدِ ملابس بسيطة ومرتبة."]], ["الأسئلة الشائعة", ["ما هو الغرض من سفرك؟", "كم ستبقى وأين ستقيم؟", "من يتحمّل تكاليف السفر؟ وما هي مواردك؟", "ما عملك، ومن ينتظرك في تونس؟", "هل سافرت من قبل؟ وهل سبق أن رُفض طلبك؟", "هل تعرف أحداً في بلد الوجهة؟", "متى ستعود إلى تونس؟"]], ["كيف تجيب", ["قل الحقيقة بإجابات قصيرة وواضحة.", "يجب أن تتوافق إجاباتك تماماً مع ملفك.", "لا تحفظ نصاً عن ظهر قلب: تحدّث بشكل طبيعي.", "إن لم تفهم السؤال فاطلب إعادته.", "لا تختلق شيئاً أبداً: التناقض أخطر من إجابة بسيطة."]], ["ما يجب تجنّبه", ["وثيقة مزوّرة أو معدّلة، ولو بشكل بسيط.", "إجابات تختلف عمّا هو مكتوب في ملفك.", "حجز لا تستطيع شرحه أو تبريره.", "نصائح وسيط يخبرك بما يجب أن تقوله."]]], "n": "هذه النصائح تساعدك على التحضير ولا تضمن الحصول على التأشيرة: القرار يعود إلى القنصلية."}};
var IVOPEN=false;
document.addEventListener("toggle",function(e){if(e.target&&e.target.id==="iv-d")IVOPEN=e.target.open},true);
function interviewHtml(){
  var X=IVT[S.lang]||IVT.fr;
  var h='<details class="lt iv" id="iv-d"'+(IVOPEN?' open':'')+'><summary>'+esc(X.t)+'</summary><div class="lt-body"><p class="ag-sub">'+esc(X.s)+'</p>';
  X.secs.forEach(function(sc){h+='<b>'+esc(sc[0])+'</b><ul class="adv">'+sc[1].map(function(i){return '<li>'+esc(i)+'</li>'}).join("")+'</ul>'});
  return h+'<p class="ag-note">'+esc(X.n)+'</p></div></details>';
}
/* ===== Carte « Entraînement à l'entretien » : juste sous « Besoin de documents de voyage ? » ===== */
var IVICON='<svg viewBox="0 0 32 32" aria-hidden="true"><path d="M3 7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4v6a4 4 0 0 1-4 4h-7l-4 3.5V17a4 4 0 0 1-4-4z" fill="#fff"/><path d="M10.6 7.8a2.2 2.2 0 1 1 3.4 1.8c-.9.6-1.2 1-1.2 1.9" fill="none" stroke="#1d4ed8" stroke-width="2" stroke-linecap="round"/><circle cx="12.8" cy="14" r="1.1" fill="#1d4ed8"/><path d="M16 18a3.5 3.5 0 0 1 3.5-3.5H26a3.5 3.5 0 0 1 3.5 3.5v4.5a3.5 3.5 0 0 1-3.5 3.5h-1v3.5l-4.5-3.5h-1A3.5 3.5 0 0 1 16 22.5z" fill="#FFD43B"/><path d="M19.5 20.5l2.2 2.2 4.3-4.4" fill="none" stroke="#7C2D12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var IVC={
 fr:{t:"Préparez votre entretien",s:"Entraînez-vous comme le jour J : un coach virtuel vous pose les questions d'un entretien de visa et vous conseille après chaque réponse. Arrivez serein, prêt à convaincre.",b:"Entraînement à l'entretien",n:"Accès par code · aucun visa garanti"},
 en:{t:"Prepare for your interview",s:"Practise as if it were the big day: a virtual coach asks the questions of a visa interview and gives you tips after each answer. Walk in calm and ready to convince.",b:"Interview practice",n:"Access by code · no visa guaranteed"},
 ar:{t:"حضّر مقابلتك",s:"تدرّب كأنه اليوم الحقيقي: مدرّب افتراضي يطرح عليك أسئلة مقابلة التأشيرة وينصحك بعد كل إجابة. اذهب إلى موعدك هادئًا وجاهزًا للإقناع.",b:"التدريب على المقابلة",n:"الدخول برمز · لا ضمان للتأشيرة"}};
function ivCardHtml(){
  var X=IVC[S.lang]||IVC.fr;
  return '<div class="needs ivn"><h2 class="hot">'+X.t+'</h2><p class="ag-sub">'+X.s+'</p><div class="sp-chips"><button type="button" class="sp-chip iv-cta" data-iv-open><span class="iv-ico">'+IVICON+'</span><span class="iv-lbl">'+X.b+'</span></button></div><p class="ag-sub">'+X.n+'</p></div>';
}
document.addEventListener("click",function(e){var b=e.target.closest&&e.target.closest("[data-iv-open]");if(b&&window.__vcInterview)window.__vcInterview()});
/* ===== États-Unis : pas de liste de pièces, tout se joue à l'entretien ===== */
var USX={
 fr:{t:"États-Unis : tout se joue à l'entretien",i:"Pour le visa visiteur (B1/B2), il n'y a pas de liste de pièces justificatives comme pour Schengen. Votre dossier repose sur le formulaire DS-160 et surtout sur l'entretien à l'ambassade de Tunis.",sh:"Les étapes",st:["Remplir le formulaire DS-160 en ligne.","Payer les frais de visa (le montant est sur le site officiel).","Prendre rendez-vous sur le site officiel de l'ambassade.","Venir à l'entretien."],bh:"À apporter le jour de l'entretien",b:["La confirmation du rendez-vous","La confirmation du formulaire DS-160","Le reçu de paiement des frais de visa","Le passeport actuel et les anciens passeports","Une photo","Une lettre expliquant le motif du voyage et l'itinéraire"],wh:"Attention : la caution",w:"Le consul peut demander une caution remboursable de 5 000 à 15 000 $. Elle se paie seulement après l'entretien, sur demande du consul. Ne payez rien avant et ne passez pas par un intermédiaire.",btn:"S'entraîner à l'entretien",link:"Site officiel (ustraveldocs Tunisie)",n:"Aucun visa n'est garanti : la décision revient au consul. Vérifiez toujours les règles sur le site officiel."},
 en:{t:"United States: everything is decided at the interview",i:"For the visitor visa (B1/B2), there is no list of supporting documents like for Schengen. Your case rests on the DS-160 form and above all on the interview at the Tunis embassy.",sh:"The steps",st:["Fill in the DS-160 form online.","Pay the visa fee (the amount is on the official website).","Book an appointment on the embassy's official website.","Attend the interview."],bh:"What to bring on interview day",b:["Your appointment confirmation","Your DS-160 confirmation","The visa fee payment receipt","Your current and previous passports","A photo","A letter explaining the purpose of your trip and your itinerary"],wh:"Warning: the bond",w:"The consul may ask for a refundable bond of $5,000 to $15,000. It is paid only after the interview, when the consul asks for it. Do not pay anything before that and do not go through an intermediary.",btn:"Practise for the interview",link:"Official website (ustraveldocs Tunisia)",n:"No visa is guaranteed: the consul decides. Always check the rules on the official website."},
 ar:{t:"الولايات المتحدة: كل شيء يُحسم في المقابلة",i:"بالنسبة لتأشيرة الزيارة (B1/B2)، لا توجد قائمة وثائق ثبوتية كما في شنغن. يعتمد ملفك على استمارة DS-160 وخاصة على المقابلة في سفارة تونس.",sh:"المراحل",st:["املأ استمارة DS-160 عبر الإنترنت.","ادفع رسوم التأشيرة (المبلغ على الموقع الرسمي).","احجز موعداً عبر الموقع الرسمي للسفارة.","احضر المقابلة."],bh:"ما يجب إحضاره يوم المقابلة",b:["تأكيد الموعد","تأكيد استمارة DS-160","وصل دفع رسوم التأشيرة","جواز السفر الحالي وجوازات السفر السابقة","صورة","رسالة تشرح الغرض من السفر والبرنامج"],wh:"تنبيه: الكفالة المالية",w:"قد يطلب منك القنصل كفالة مالية قابلة للاسترجاع بين 5000 و15000 دولار. تُدفع فقط بعد المقابلة وبطلب من القنصل. لا تدفع شيئاً قبل ذلك ولا تلجأ إلى وسيط.",btn:"التدرّب على المقابلة",link:"الموقع الرسمي (ustraveldocs تونس)",n:"لا ضمان للتأشيرة: القرار يعود إلى القنصل. تحقق دائماً من القواعد على الموقع الرسمي."}};
function usHtml(){
  var X=USX[S.lang]||USX.fr,ul=function(a){return '<ul class="adv">'+a.map(function(i){return '<li>'+esc(i)+'</li>'}).join("")+'</ul>'};
  return '<section class="group"><div class="g-head"><h2>'+esc(X.t)+'</h2></div><p class="ag-sub">'+esc(X.i)+'</p>'
   +'<h3 class="us-h">'+esc(X.sh)+'</h3><ol class="adv">'+X.st.map(function(i){return '<li>'+esc(i)+'</li>'}).join("")+'</ol>'
   +'<h3 class="us-h">'+esc(X.bh)+'</h3>'+ul(X.b)
   +'<div class="us-warn"><b>'+esc(X.wh)+'</b><p>'+esc(X.w)+'</p></div>'
   +'<div class="needs ivn"><div class="sp-chips"><button type="button" class="sp-chip iv-cta" data-iv-open><span class="iv-ico">'+IVICON+'</span><span class="iv-lbl">'+esc(X.btn)+'</span></button></div></div>'
   +'<p class="ag-sub"><a href="https://ustraveldocs.com/tn/index.html" target="_blank" rel="noopener noreferrer">'+esc(X.link)+'</a></p>'
   +'<p class="ag-note">'+esc(X.n)+'</p></section>';
}
function renderSponsors(t){
  var nt=$("needsTop");if(nt)nt.innerHTML=(S.step>0&&S.step<8&&S.step!==7?needsHtml(t)+(curC().id==="us"||S.step===6?'':ivCardHtml()):'');
  var h='<h2 id="sp-h" class="c">'+t.spTitle+'</h2>'+groupsHtml();
  h+='<p class="sp-join c">'+SPT.note[S.lang]+'</p>';
  $("sponsors").innerHTML=h;
}
function panelHtml(t){
  var e=eff();
  if(e==="reunion"){return chips("purpose",t.s_purpose)+chips("party",t.s_party)+'<div class="book"><b>'+t.reunTitle+'</b><p>'+t.reunText+'</p></div>'}
  if(e==="medical"){return '<div class="book"><b>'+t.gMed+'</b><p>'+t.medNote+'</p></div>'+chips("status",t.s_status)+chips("party",t.s_party)+chips("stay",t.s_stay)+chips("pay",t.s_pay)}
  return chips("purpose",t.s_purpose)+chips("status",t.s_status)+chips("party",t.s_party)+chips("stay",t.s_stay)+chips("pay",t.s_pay);
}
function allAdvisors(){var a=[];for(var k in PARTNERS){if(k==="_srv")continue;PARTNERS[k].forEach(function(p){a.push(p)})}return a}
function advMsg(){var t=UI[S.lang];return "Visa Checker : "+t.advSubject+"\n"+t.advDest+" : "+nm(curC())+"\n"+t.advCase+" : "+(S.refus||"-")}
function renderAgency(t){
  var L=S.lang,list=allAdvisors();
  var h='<h2>'+t.agTitle+'</h2><p class="ag-sub">'+t.agSub+'</p>';
  h+='<div class="q"><label class="q-label" for="refcase">'+t.caseLabel+'</label><textarea class="sel" id="refcase" rows="3" maxlength="300" placeholder="'+esc(t.casePh)+'">'+esc(S.refus||"")+'</textarea><span class="i-note">'+t.caseHint+'</span></div>';
  if(!list.length){h+='<p class="ag-none">'+t.agNone+'</p>'}
  else if(S.paid){
    list.forEach(function(p){
      var m=encodeURIComponent(advMsg());
      h+='<div class="partner"><b>'+p.name+'</b><span class="i-note">'+(p.adv||p.what)[L]+'</span>';
      if(p.contact)h+='<span class="i-note">'+p.contact+'</span>';
      if(p.email)h+='<a class="pay wide" href="mailto:'+p.email+'?subject='+encodeURIComponent("Visa Checker")+'&body='+m+'">'+t.advMail+'</a>';
      if(p.whatsapp)h+='<a class="pay wide" href="https://wa.me/'+String(p.whatsapp).replace(/\D/g,"")+'?text='+m+'" target="_blank" rel="noopener">'+t.advWA+'</a>';
      if(!p.contact&&!p.email&&!p.whatsapp)h+='<span class="i-note">'+t.contactSoon+'</span>';
      h+='</div>';
    });
  }else{
    h+='<div class="locked"><b>'+t.agCount(list.length)+'</b><i></i><i></i></div>';
    h+=PAY_URL?'<a class="pay" href="'+PAY_URL+'" target="_blank" rel="noopener">'+t.payBtn+'</a>':d17Html("adv",10);
    h+='<div class="q"><label class="q-label" for="code">'+t.codeLabel+'</label><div class="code-row"><input class="sel" id="code" type="text" autocomplete="off" aria-describedby="err" aria-invalid="false"><button type="button" class="reset" id="unlock">'+t.unlock+'</button></div><span class="ag-err" id="err" role="alert"></span></div>';
  }
  h+='<p class="ag-note">'+t.agNote+'</p>';
  $("agency").innerHTML=h;
}
/* ===== e-Visa section: countries where Tunisian passports can use an electronic visa or authorisation. =====
   Sources checked on 20 Oct 2026: Henley Passport Index 2026 (via La Presse), Wikipedia "Visa requirements for Tunisian citizens",
   official pages when readable (Oman MFA, Georgia, Azerbaijan ASAN, Pakistan, Sri Lanka, Armenia, UAE ICP).
   To add a country: copy one E(...) block. type = evisa | eta | mixed | cond | check ("check" shows the "to confirm" box). */
function E(id,type,url,host,n,intro,notes){return {id:id,type:type,url:url,host:host,n:n,intro:intro,notes:notes}}
var EV=[
 E("al","evisa","https://e-visa.al","e-visa.al",
  {fr:"Albanie",en:"Albania",ar:"ألبانيا"},
  {fr:"L'Albanie propose une e-visa aux passeports tunisiens (Henley Passport Index 2026).",en:"Albania offers an e-visa to Tunisian passports (Henley Passport Index 2026).",ar:"تتيح ألبانيا تأشيرة إلكترونية لحاملي جواز السفر التونسي (مؤشر هينلي لجوازات السفر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Les titulaires de certains visas à entrées multiples du Royaume-Uni ou de l'espace Schengen peuvent être dispensés de visa, sous conditions d'entrées et de séjours antérieurs. Vérifiez les conditions exactes sur le portail."],
   en:["Stay of 90 days according to our source (indicative).","Holders of certain multiple-entry UK or Schengen visas may be exempt from the visa, subject to earlier entries and stays. Check the exact conditions on the portal."],
   ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","قد يُعفى أصحاب بعض تأشيرات الدخول المتعدد للمملكة المتحدة أو شنغن من التأشيرة، بشروط تتعلق بالدخول والإقامة السابقين. تحقق من الشروط الدقيقة على البوابة."]}),
 E("am","evisa","https://evisa.mfa.am","evisa.mfa.am",
  {fr:"Arménie",en:"Armenia",ar:"أرمينيا"},
  {fr:"L'Arménie propose une e-visa aux passeports tunisiens (Henley 2026 et sources publiques).",en:"Armenia offers an e-visa to Tunisian passports (Henley 2026 and public sources).",ar:"تتيح أرمينيا تأشيرة إلكترونية لحاملي جواز السفر التونسي (مؤشر هينلي 2026 ومصادر عامة)."},
  {fr:["Le portail est géré par le ministère arménien des Affaires étrangères. Il permet de vérifier les conditions selon la nationalité et le type de passeport.","Séjour jusqu'à 120 jours indiqué par une source secondaire (indicatif). Confirmez la durée sur le portail."],
   en:["The portal is run by the Armenian Ministry of Foreign Affairs. It lets you check the conditions by nationality and passport type.","Stay of up to 120 days according to a secondary source (indicative). Confirm the duration on the portal."],
   ar:["تديرها وزارة الخارجية الأرمينية، وتتيح البوابة التحقق من الشروط حسب الجنسية ونوع جواز السفر.","مدة الإقامة حتى 120 يومًا حسب مصدر ثانوي (للاسترشاد). تأكد من المدة على البوابة."]}),
 E("az","check","https://evisa.gov.az","evisa.gov.az",
  {fr:"Azerbaïdjan",en:"Azerbaijan",ar:"أذربيجان"},
  {fr:"Selon nos sources, le voyage passe par une approbation préalable (ASAN Visa).",en:"According to our sources, travel goes through a prior approval (ASAN Visa).",ar:"حسب مصادرنا، يمرّ السفر عبر موافقة مسبقة (ASAN Visa)."},
  {fr:["Traitement standard sous 3 jours ouvrables ; traitement urgent sous 3 heures, même les jours fériés (page officielle).","Le portail renvoie vers la liste officielle des pays éligibles à l'e-visa : consultez-la pour vérifier le cas de la Tunisie.","Ne prenez aucun billet non remboursable avant l'approbation."],
   en:["Standard processing within 3 working days; urgent processing within 3 hours, even on holidays (official page).","The portal links to the official list of countries eligible for the e-visa: check it for Tunisia.","Do not buy any non-refundable ticket before approval."],
   ar:["المعالجة العادية خلال 3 أيام عمل، والمستعجلة خلال 3 ساعات حتى في العطل (الصفحة الرسمية).","تحيل البوابة إلى القائمة الرسمية للدول المؤهلة للتأشيرة الإلكترونية: راجعها للتأكد من حالة تونس.","لا تشترِ تذكرة غير قابلة للاسترداد قبل الموافقة."]}),
 E("bh","mixed","https://www.evisa.gov.bh","evisa.gov.bh",
  {fr:"Bahreïn",en:"Bahrain",ar:"البحرين"},
  {fr:"Bahreïn propose une e-visa ou une visa à l'arrivée aux passeports tunisiens, selon nos sources.",en:"Bahrain offers an e-visa or a visa on arrival to Tunisian passports, according to our sources.",ar:"تتيح البحرين تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي حسب مصادرنا."},
  {fr:["Séjour de 14 jours indiqué par notre source (indicatif).","Préférez demander l'e-visa avant le départ pour éviter une mauvaise surprise à l'aéroport."],
   en:["Stay of 14 days according to our source (indicative).","Prefer to apply for the e-visa before departure to avoid a bad surprise at the airport."],
   ar:["مدة الإقامة 14 يومًا حسب مصدرنا (للاسترشاد).","فضّل طلب التأشيرة الإلكترونية قبل السفر لتفادي أي مفاجأة في المطار."]}),
 E("ge","check","https://www.evisa.gov.ge","evisa.gov.ge",
  {fr:"Géorgie",en:"Georgia",ar:"جورجيا"},
  {fr:"Henley 2026 indique une e-visa pour les Tunisiens, mais ce statut ne figure pas dans toutes nos sources, et le portail ne liste pas les nationalités éligibles sur sa page de présentation.",en:"Henley 2026 lists an e-visa for Tunisians, but this status is not in all our sources, and the portal does not list eligible nationalities on its overview page.",ar:"يذكر مؤشر هينلي 2026 تأشيرة إلكترونية للتونسيين، لكن هذا الوضع غير مذكور في كل مصادرنا، ولا تعرض البوابة الجنسيات المؤهلة في صفحة التعريف."},
  {fr:["Pièces à présenter à la frontière, selon le portail officiel : passeport, justificatif du motif du voyage, preuve d'hébergement, assurance voyage et santé, justificatif de moyens financiers.","La demande en ligne demande des copies numérisées de ces documents."],
   en:["Documents to show at the border, according to the official portal: passport, proof of the purpose of travel, proof of accommodation, travel and health insurance, proof of sufficient funds.","The online application asks for scanned copies of these documents."],
   ar:["الوثائق التي تُعرض على الحدود حسب البوابة الرسمية: جواز السفر، وثيقة تثبت سبب السفر، إثبات الإقامة، تأمين السفر والصحة، إثبات الموارد المالية.","يتطلب الطلب عبر الإنترنت نسخًا ممسوحة ضوئيًا من هذه الوثائق."]}),
 E("kg","evisa","https://www.evisa.e-gov.kg","evisa.e-gov.kg",
  {fr:"Kirghizistan",en:"Kyrgyzstan",ar:"قيرغيزستان"},
  {fr:"Le Kirghizistan propose une e-visa aux passeports tunisiens (Henley 2026 et sources publiques).",en:"Kyrgyzstan offers an e-visa to Tunisian passports (Henley 2026 and public sources).",ar:"تتيح قيرغيزستان تأشيرة إلكترونية لحاملي جواز السفر التونسي (مؤشر هينلي 2026 ومصادر عامة)."},
  {fr:["Séjour de 60 jours indiqué par notre source (indicatif)."],
   en:["Stay of 60 days according to our source (indicative)."],
   ar:["مدة الإقامة 60 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("kr","eta","https://www.k-eta.go.kr","k-eta.go.kr",
  {fr:"Corée du Sud",en:"South Korea",ar:"كوريا الجنوبية"},
  {fr:"La Corée du Sud demande une autorisation électronique de voyage (K-ETA) aux passeports tunisiens : ce n'est pas un visa.",en:"South Korea asks Tunisian passports for an electronic travel authorisation (K-ETA): it is not a visa.",ar:"تطلب كوريا الجنوبية إذن سفر إلكترونيًا (K-ETA) من حاملي جواز السفر التونسي، وهو ليس تأشيرة."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Autorisation valable 3 ans à partir de l'approbation, selon une source secondaire. Confirmez sur le portail.","Faites la demande avant de réserver un billet non remboursable."],
   en:["Stay of 30 days according to our source (indicative).","Authorisation valid for 3 years from approval, according to a secondary source. Confirm on the portal.","Apply before booking a non-refundable ticket."],
   ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","الإذن صالح 3 سنوات من تاريخ الموافقة حسب مصدر ثانوي. تأكد من البوابة.","قدّم الطلب قبل حجز تذكرة غير قابلة للاسترداد."]}),
 E("lk","eta","https://www.eta.gov.lk","eta.gov.lk",
  {fr:"Sri Lanka",en:"Sri Lanka",ar:"سريلانكا"},
  {fr:"Le Sri Lanka exige une autorisation électronique de voyage (ETA) avant l'arrivée.",en:"Sri Lanka requires an electronic travel authorisation (ETA) before arrival.",ar:"تشترط سريلانكا الحصول على تصريح سفر إلكتروني (ETA) قبل الوصول."},
  {fr:["La page officielle indique que tous les étrangers doivent obtenir l'ETA avant d'arriver au Sri Lanka.","La Tunisie ne figure pas dans la liste des 40 pays bénéficiant de l'ETA gratuite sur la page officielle : l'ETA peut donc être payante. Vérifiez les conditions de votre nationalité."],
   en:["The official page says all foreign nationals must obtain the ETA before arriving in Sri Lanka.","Tunisia is not on the official list of 40 countries with a free ETA: the ETA may therefore be paid. Check the conditions for your nationality."],
   ar:["تذكر الصفحة الرسمية أن على جميع الأجانب الحصول على التصريح الإلكتروني (ETA) قبل الوصول إلى سريلانكا.","تونس ليست ضمن قائمة 40 دولة المستفيدة من التصريح المجاني في الصفحة الرسمية، لذا قد يكون التصريح مدفوعًا. تحقق من شروط جنسيتك."]}),
 E("om","cond","https://evisa.rop.gov.om/en/home","evisa.rop.gov.om",
  {fr:"Oman",en:"Oman",ar:"عُمان"},
  {fr:"Selon le ministère omanais des Affaires étrangères, l'entrée sans visa (14 jours) pour les Tunisiens est soumise à des conditions. Sinon, il faut une e-visa de la Royal Oman Police.",en:"According to Oman's Ministry of Foreign Affairs, visa-free entry (14 days) for Tunisians is subject to conditions. Otherwise an e-visa from the Royal Oman Police is needed.",ar:"حسب وزارة الخارجية العُمانية، الدخول دون تأشيرة (14 يومًا) للتونسيين مشروط. وإلا فيلزم الحصول على تأشيرة إلكترونية من شرطة عُمان السلطانية."},
  {fr:["Sans visa pendant 14 jours : seulement pour les résidents d'Oman ou du CCG, ou les titulaires d'un visa valide pour les États-Unis, le Canada, l'Australie, le Royaume-Uni, l'espace Schengen ou le Japon.","Sinon, la demande se fait sur le système e-visa de la Royal Oman Police.","Pièces demandées pour l'entrée : passeport valable au moins 6 mois, billet retour, réservation d'hôtel confirmée, assurance santé et fonds suffisants."],
   en:["Visa-free for 14 days: only for residents of Oman or the GCC, or holders of a valid visa for the United States, Canada, Australia, the United Kingdom, the Schengen area or Japan.","Otherwise, apply on the Royal Oman Police e-visa system.","Documents asked for entry: passport valid for at least 6 months, return ticket, confirmed hotel booking, health insurance and sufficient funds."],
   ar:["الدخول دون تأشيرة لمدة 14 يومًا: فقط للمقيمين في عُمان أو دول مجلس التعاون الخليجي، أو أصحاب تأشيرة سارية للولايات المتحدة أو كندا أو أستراليا أو المملكة المتحدة أو شنغن أو اليابان.","وإلا فيُقدَّم الطلب عبر نظام التأشيرة الإلكترونية لشرطة عُمان السلطانية.","الوثائق المطلوبة للدخول: جواز سفر صالح 6 أشهر على الأقل، تذكرة عودة، حجز فندقي مؤكد، تأمين صحي وأموال كافية."]}),
 E("pk","evisa","https://visa.nadra.gov.pk","visa.nadra.gov.pk",
  {fr:"Pakistan",en:"Pakistan",ar:"باكستان"},
  {fr:"Le Pakistan propose un visa en ligne aux passeports tunisiens, selon nos sources (Henley 2026 et sources publiques).",en:"Pakistan offers an online visa to Tunisian passports, according to our sources (Henley 2026 and public sources).",ar:"تتيح باكستان تأشيرة عبر الإنترنت لحاملي جواز السفر التونسي حسب مصادرنا (مؤشر هينلي 2026 ومصادر عامة)."},
  {fr:["Durée de 3 mois indiquée par notre source (indicatif).","La page officielle précise que l'approbation n'est pas garantie et recommande de ne pas réserver le voyage avant d'avoir un visa valide.","Le système en ligne est ouvert à 175 pays, mais la page officielle n'affiche pas la liste : vérifiez que votre passeport est accepté."],
   en:["Duration of 3 months according to our source (indicative).","The official page states that approval is not guaranteed and advises not to book travel before holding a valid visa.","The online system is open to 175 countries, but the official page does not show the list: check that your passport is accepted."],
   ar:["مدة 3 أشهر حسب مصدرنا (للاسترشاد).","تؤكد الصفحة الرسمية أن الموافقة غير مضمونة وتنصح بعدم حجز السفر قبل الحصول على تأشيرة سارية.","النظام الإلكتروني مفتوح لـ 175 دولة، لكن الصفحة الرسمية لا تعرض القائمة: تأكد من قبول جواز سفرك."]}),
 E("qa","evisa","https://hayya.qa","hayya.qa",
  {fr:"Qatar",en:"Qatar",ar:"قطر"},
  {fr:"Le Qatar propose une e-visa via la plateforme Hayya aux passeports tunisiens (Henley 2026 et sources publiques).",en:"Qatar offers an e-visa through the Hayya platform to Tunisian passports (Henley 2026 and public sources).",ar:"تتيح قطر تأشيرة إلكترونية عبر منصة «حيّاك» لحاملي جواز السفر التونسي (مؤشر هينلي 2026 ومصادر عامة)."},
  {fr:["La demande se fait via la plateforme officielle Hayya.","Les conditions précises (hébergement, billet, durée) sont affichées sur Hayya : confirmez-les avant de payer."],
   en:["The application is made through the official Hayya platform.","The exact conditions (accommodation, ticket, duration) are shown on Hayya: confirm them before paying."],
   ar:["يُقدَّم الطلب عبر منصة «حيّاك» الرسمية.","الشروط الدقيقة (الإقامة، التذكرة، المدة) معروضة على المنصة: تأكد منها قبل الدفع."]}),
 E("ae","check","https://icp.gov.ae","icp.gov.ae",
  {fr:"Émirats arabes unis",en:"United Arab Emirates",ar:"الإمارات العربية المتحدة"},
  {fr:"Les sources divergent : certaines indiquent une e-visa, d'autres une visa à obtenir via un sponsor ou une compagnie aérienne.",en:"Sources disagree: some say an e-visa, others a visa to be obtained through a sponsor or an airline.",ar:"تتضارب المصادر: بعضها يذكر تأشيرة إلكترونية، وبعضها تأشيرة تُستخرج عبر كفيل أو شركة طيران."},
  {fr:["Les demandes passent par la plateforme officielle ICP (services intelligents), qui prévient de n'utiliser que les canaux officiels agréés.","Avant de payer ou d'acheter un billet, confirmez la procédure pour les passeports tunisiens sur le portail ICP ou auprès de votre compagnie aérienne."],
   en:["Applications go through the official ICP platform (smart services), which warns to use only the approved official channels.","Before paying or buying a ticket, confirm the procedure for Tunisian passports on the ICP portal or with your airline."],
   ar:["تتم الطلبات عبر منصة الهيئة الاتحادية للهوية والجنسية والجمارك وأمن المنافذ (ICP) الرسمية، وهي تحذّر من استخدام القنوات الرسمية المعتمدة فقط.","قبل الدفع أو شراء تذكرة، تأكد من الإجراء المعتمد لجوازات السفر التونسية على بوابة ICP أو لدى شركة الطيران."]}),
 E("uz","evisa","https://e-visa.gov.uz","e-visa.gov.uz",
  {fr:"Ouzbékistan",en:"Uzbekistan",ar:"أوزبكستان"},
  {fr:"L'Ouzbékistan propose une e-visa aux passeports tunisiens (Henley 2026 et sources publiques).",en:"Uzbekistan offers an e-visa to Tunisian passports (Henley 2026 and public sources).",ar:"تتيح أوزبكستان تأشيرة إلكترونية لحاملي جواز السفر التونسي (مؤشر هينلي 2026 ومصادر عامة)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Transit sans visa de 5 jours dans les aéroports internationaux, avec un billet de continuation confirmé (source secondaire)."],
   en:["Stay of 30 days according to our source (indicative).","Visa-free transit of 5 days at international airports, with a confirmed onward ticket (secondary source)."],
   ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","عبور بدون تأشيرة لمدة 5 أيام في المطارات الدولية مع تذكرة مواصلة مؤكدة (مصدر ثانوي)."]}),
 E("vn","evisa","https://evisa.gov.vn","evisa.gov.vn",
  {fr:"Vietnam",en:"Vietnam",ar:"فيتنام"},
  {fr:"Le Vietnam propose une e-visa aux passeports tunisiens (Henley 2026 et sources publiques).",en:"Vietnam offers an e-visa to Tunisian passports (Henley 2026 and public sources).",ar:"تتيح فيتنام تأشيرة إلكترونية لحاملي جواز السفر التونسي (مؤشر هينلي 2026 ومصادر عامة)."},
  {fr:["E-visa valable 90 jours, à entrées multiples, selon notre source (indicatif).","De faux sites imitent souvent le portail officiel du Vietnam : saisissez vous-même l'adresse evisa.gov.vn dans votre navigateur."],
   en:["E-visa valid for 90 days, multiple entry, according to our source (indicative).","Fake sites often imitate Vietnam's official portal: type the address evisa.gov.vn yourself in your browser."],
   ar:["تأشيرة إلكترونية صالحة 90 يومًا ومتعددة الدخول حسب مصدرنا (للاسترشاد).","تقلّد مواقع مزيفة كثيرة البوابة الرسمية لفيتنام: اكتب العنوان evisa.gov.vn بنفسك في المتصفح."]}),
 /* ===== Afrique et Amériques / Caraïbes : ajoutés le 30 oct. 2026 (Wikipedia « Visa requirements for Tunisian citizens » ; portails officiels vérifiés quand l'adresse est renseignée) ===== */
 E("ao","evisa",null,null,
  {fr:"Angola",en:"Angola",ar:"أنغولا"},
  {fr:"Angola : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Angola: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"أنغولا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Billet retour, réservation d'hôtel et certificat de vaccination demandés selon notre source.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 30 days according to our source (indicative).","Return ticket, hotel booking and vaccination certificate asked for according to our source.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","تذكرة العودة وحجز الفندق وشهادة التطعيم مطلوبة حسب مصدرنا.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("bw","evisa","https://evisa.gov.bw","evisa.gov.bw",
  {fr:"Botswana",en:"Botswana",ar:"بوتسوانا"},
  {fr:"Botswana : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Botswana: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"بوتسوانا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 3 mois indiqué par notre source (indicatif)."],en:["Stay of 3 months according to our source (indicative)."],ar:["مدة الإقامة 3 أشهر حسب مصدرنا (للاسترشاد)."]}),
 E("bf","mixed",null,null,
  {fr:"Burkina Faso",en:"Burkina Faso",ar:"بوركينا فاسو"},
  {fr:"Burkina Faso : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Burkina Faso: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"بوركينا فاسو: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("bi","mixed",null,null,
  {fr:"Burundi",en:"Burundi",ar:"بوروندي"},
  {fr:"Burundi : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Burundi: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"بوروندي: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 1 mois indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 1 month according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة شهر واحد حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("cm","evisa",null,null,
  {fr:"Cameroun",en:"Cameroon",ar:"الكاميرون"},
  {fr:"Cameroun : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Cameroon: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"الكاميرون: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Visa à l'arrivée possible avec un accord préalable.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Visa on arrival possible with prior approval.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["قد تتاح تأشيرة عند الوصول بموافقة مسبقة.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("td","evisa",null,null,
  {fr:"Tchad",en:"Chad",ar:"تشاد"},
  {fr:"Tchad : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Chad: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"تشاد: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("cd","evisa",null,null,
  {fr:"RD Congo",en:"DR Congo",ar:"جمهورية الكونغو الديمقراطية"},
  {fr:"RD Congo : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"DR Congo: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"جمهورية الكونغو الديمقراطية: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 7 jours indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 7 days according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 7 أيام حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("dj","evisa",null,null,
  {fr:"Djibouti",en:"Djibouti",ar:"جيبوتي"},
  {fr:"Djibouti : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Djibouti: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"جيبوتي: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Billet retour demandé ; passeport valable au moins 6 mois pour le visa à l'arrivée.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","Return ticket required; passport valid for at least 6 months for the visa on arrival.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","تذكرة العودة مطلوبة؛ وجواز سفر صالح 6 أشهر على الأقل للتأشيرة عند الوصول.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("et","mixed","https://www.evisa.gov.et","evisa.gov.et",
  {fr:"Éthiopie",en:"Ethiopia",ar:"إثيوبيا"},
  {fr:"Éthiopie : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Ethiopia: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"إثيوبيا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 ou 90 jours indiqué par notre source (indicatif).","Visa à l'arrivée seulement à l'aéroport d'Addis-Abeba (Bole)."],en:["Stay of 30 or 90 days according to our source (indicative).","Visa on arrival only at Addis Ababa airport (Bole)."],ar:["مدة الإقامة 30 أو 90 يومًا حسب مصدرنا (للاسترشاد).","التأشيرة عند الوصول متاحة فقط في مطار أديس أبابا (بولي)."]}),
 E("ga","evisa",null,null,
  {fr:"Gabon",en:"Gabon",ar:"الغابون"},
  {fr:"Gabon : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Gabon: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"الغابون: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Arrivée obligatoire par l'aéroport de Libreville.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","You must arrive through Libreville airport.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","يجب الوصول عبر مطار ليبرفيل.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("lr","mixed",null,null,
  {fr:"Liberia",en:"Liberia",ar:"ليبيريا"},
  {fr:"Liberia : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Liberia: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"ليبيريا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 3 mois indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 3 months according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 3 أشهر حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("mg","mixed",null,null,
  {fr:"Madagascar",en:"Madagascar",ar:"مدغشقر"},
  {fr:"Madagascar : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Madagascar: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"مدغشقر: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("mz","mixed","https://evisa.gov.mz","evisa.gov.mz",
  {fr:"Mozambique",en:"Mozambique",ar:"موزمبيق"},
  {fr:"Mozambique : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Mozambique: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"موزمبيق: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif)."],en:["Stay of 30 days according to our source (indicative)."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("na","mixed",null,null,
  {fr:"Namibie",en:"Namibia",ar:"ناميبيا"},
  {fr:"Namibie : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Namibia: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"ناميبيا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("ng","evisa",null,null,
  {fr:"Nigeria",en:"Nigeria",ar:"نيجيريا"},
  {fr:"Nigeria : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Nigeria: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"نيجيريا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 30 days according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("ug","evisa","https://visas.immigration.go.ug","visas.immigration.go.ug",
  {fr:"Ouganda",en:"Uganda",ar:"أوغندا"},
  {fr:"Ouganda : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Uganda: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"أوغندا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 3 mois indiqué par notre source (indicatif)."],en:["Stay of 3 months according to our source (indicative)."],ar:["مدة الإقامة 3 أشهر حسب مصدرنا (للاسترشاد)."]}),
 E("rw","mixed","https://www.irembo.gov.rw","irembo.gov.rw",
  {fr:"Rwanda",en:"Rwanda",ar:"رواندا"},
  {fr:"Rwanda : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Rwanda: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"رواندا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif)."],en:["Stay of 30 days according to our source (indicative)."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("st","check",null,null,
  {fr:"Sao Tomé-et-Principe",en:"São Tomé and Príncipe",ar:"ساو تومي وبرينسيبي"},
  {fr:"Sao Tomé-et-Principe : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"São Tomé and Príncipe: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"ساو تومي وبرينسيبي: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("sc","eta",null,null,
  {fr:"Seychelles",en:"Seychelles",ar:"سيشل"},
  {fr:"Seychelles : autorisation de voyage électronique en ligne pour les passeports tunisiens ; ce n'est pas un visa (Wikipedia, octobre 2026).",en:"Seychelles: online electronic travel authorisation for Tunisian passports; it is not a visa (Wikipedia, October 2026).",ar:"سيشل: إذن سفر إلكتروني عبر الإنترنت لحاملي جواز السفر التونسي، وهو ليس تأشيرة (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 3 mois indiqué par notre source (indicatif).","À demander jusqu'à 30 jours avant le départ ; certificat de fièvre jaune si vous venez d'un pays à risque.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 3 months according to our source (indicative).","Apply up to 30 days before departure; yellow fever certificate if you come from an at-risk country.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 3 أشهر حسب مصدرنا (للاسترشاد).","تُطلب حتى 30 يومًا قبل السفر؛ وشهادة الحمى الصفراء إن كنت قادمًا من بلد معرّض.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("sl","mixed",null,null,
  {fr:"Sierra Leone",en:"Sierra Leone",ar:"سيراليون"},
  {fr:"Sierra Leone : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Sierra Leone: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"سيراليون: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours à 3 mois indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 30 days to 3 months according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة من 30 يومًا إلى 3 أشهر حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("so","evisa",null,null,
  {fr:"Somalie",en:"Somalia",ar:"الصومال"},
  {fr:"Somalie : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Somalia: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"الصومال: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Autorisation eTAS à obtenir avant le voyage.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 30 days according to our source (indicative).","eTAS authorisation to obtain before travel.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","يجب الحصول على إذن eTAS قبل السفر.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("ss","evisa",null,null,
  {fr:"Soudan du Sud",en:"South Sudan",ar:"جنوب السودان"},
  {fr:"Soudan du Sud : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"South Sudan: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"جنوب السودان: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Autorisation imprimée à présenter à l'arrivée.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Printed approval to show on arrival.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["يجب تقديم الإذن مطبوعًا عند الوصول.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("tz","mixed","https://visa.immigration.go.tz","visa.immigration.go.tz",
  {fr:"Tanzanie",en:"Tanzania",ar:"تنزانيا"},
  {fr:"Tanzanie : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Tanzania: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"تنزانيا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif)."],en:["Stay of 90 days according to our source (indicative)."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("tg","evisa","https://voyage.gouv.tg","voyage.gouv.tg",
  {fr:"Togo",en:"Togo",ar:"توغو"},
  {fr:"Togo : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Togo: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"توغو: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 15 jours indiqué par notre source (indicatif)."],en:["Stay of 15 days according to our source (indicative)."],ar:["مدة الإقامة 15 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("zm","evisa","https://zamportal.gov.zm","zamportal.gov.zm",
  {fr:"Zambie",en:"Zambia",ar:"زامبيا"},
  {fr:"Zambie : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Zambia: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"زامبيا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif)."],en:["Stay of 90 days according to our source (indicative)."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("zw","evisa","https://www.evisa.gov.zw","evisa.gov.zw",
  {fr:"Zimbabwe",en:"Zimbabwe",ar:"زيمبابوي"},
  {fr:"Zimbabwe : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Zimbabwe: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"زيمبابوي: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 1 mois indiqué par notre source (indicatif)."],en:["Stay of 1 month according to our source (indicative)."],ar:["مدة الإقامة شهر واحد حسب مصدرنا (للاسترشاد)."]}),
 E("ai","check",null,null,
  {fr:"Anguilla",en:"Anguilla",ar:"أنغويلا"},
  {fr:"Anguilla : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Anguilla: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"أنغويلا: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Territoire britannique d'outre-mer.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["British overseas territory.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["إقليم بريطاني ما وراء البحار.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("ag","evisa",null,null,
  {fr:"Antigua-et-Barbuda",en:"Antigua and Barbuda",ar:"أنتيغوا وبربودا"},
  {fr:"Antigua-et-Barbuda : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Antigua and Barbuda: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"أنتيغوا وبربودا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("bs","evisa",null,null,
  {fr:"Bahamas",en:"Bahamas",ar:"جزر البهاما"},
  {fr:"Bahamas : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Bahamas: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"جزر البهاما: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 3 mois indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 3 months according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 3 أشهر حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("bo","check",null,null,
  {fr:"Bolivie",en:"Bolivia",ar:"بوليفيا"},
  {fr:"Bolivie : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Bolivia: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"بوليفيا: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("co","check",null,null,
  {fr:"Colombie",en:"Colombia",ar:"كولومبيا"},
  {fr:"Colombie : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Colombia: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"كولومبيا: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("cu","evisa",null,null,
  {fr:"Cuba",en:"Cuba",ar:"كوبا"},
  {fr:"Cuba : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Cuba: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"كوبا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Assurance voyage obligatoire.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","Travel insurance is mandatory.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","التأمين على السفر إلزامي.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("gy","check",null,null,
  {fr:"Guyana",en:"Guyana",ar:"غيانا"},
  {fr:"Guyana : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Guyana: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"غيانا: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("ms","check",null,null,
  {fr:"Montserrat",en:"Montserrat",ar:"مونتسيرات"},
  {fr:"Montserrat : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Montserrat: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"مونتسيرات: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Territoire britannique d'outre-mer.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["British overseas territory.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["إقليم بريطاني ما وراء البحار.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("kn","evisa",null,null,
  {fr:"Saint-Christophe-et-Niévès",en:"Saint Kitts and Nevis",ar:"سانت كيتس ونيفيس"},
  {fr:"Saint-Christophe-et-Niévès : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Saint Kitts and Nevis: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"سانت كيتس ونيفيس: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Autorisation imprimée à présenter à l'arrivée.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Printed approval to show on arrival.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["يجب تقديم الإذن مطبوعًا عند الوصول.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("tt","evisa",null,null,
  {fr:"Trinité-et-Tobago",en:"Trinidad and Tobago",ar:"ترينيداد وتوباغو"},
  {fr:"Trinité-et-Tobago : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Trinidad and Tobago: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"ترينيداد وتوباغو: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Exemption à l'arrivée possible avec une pré-approbation.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","Waiver on arrival possible with a pre-approval.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","قد يُسمح بالدخول عند الوصول بموافقة مسبقة.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("ve","check",null,null,
  {fr:"Venezuela",en:"Venezuela",ar:"فنزويلا"},
  {fr:"Venezuela : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Venezuela: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"فنزويلا: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 /* ===== Asie, Europe, Océanie : ajoutés le 31 oct. 2026 ===== */
 E("af","evisa",null,null,
  {fr:"Afghanistan",en:"Afghanistan",ar:"أفغانستان"},
  {fr:"Afghanistan : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Afghanistan: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"أفغانستان: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Arrivée obligatoire par l'aéroport international de Kaboul.","Consultez les conseils aux voyageurs de votre pays avant de réserver.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 30 days according to our source (indicative).","You must arrive through Kabul international airport.","Check official travel advice before booking.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","يجب الوصول عبر مطار كابول الدولي.","راجع نصائح السفر الرسمية قبل الحجز.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("bt","evisa",null,null,
  {fr:"Bhoutan",en:"Bhutan",ar:"بوتان"},
  {fr:"Bhoutan : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Bhutan: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"بوتان: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Une taxe de développement durable est facturée par nuit : consultez le portail officiel.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","A sustainable development fee is charged per night: check the official portal.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","تُفرض رسوم تنمية مستدامة عن كل ليلة: راجع البوابة الرسمية.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("kh","mixed","https://www.evisa.gov.kh","evisa.gov.kh",
  {fr:"Cambodge",en:"Cambodia",ar:"كمبوديا"},
  {fr:"Cambodge : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Cambodia: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"كمبوديا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif)."],en:["Stay of 30 days according to our source (indicative)."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد)."]}),
 E("id","mixed","https://evisa.imigrasi.go.id","evisa.imigrasi.go.id",
  {fr:"Indonésie",en:"Indonesia",ar:"إندونيسيا"},
  {fr:"Indonésie : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Indonesia: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"إندونيسيا: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Visa à l'arrivée en ligne (e-VOA) ou à l'aéroport."],en:["Stay of 30 days according to our source (indicative).","Online visa on arrival (e-VOA) or at the airport."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","تأشيرة عند الوصول عبر الإنترنت (e-VOA) أو في المطار."]}),
 E("iq","evisa",null,null,
  {fr:"Irak",en:"Iraq",ar:"العراق"},
  {fr:"Irak : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Iraq: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"العراق: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 30 days according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("kz","check","https://www.vmp.gov.kz","vmp.gov.kz",
  {fr:"Kazakhstan",en:"Kazakhstan",ar:"كازاخستان"},
  {fr:"Kazakhstan : une démarche en ligne semble exister pour les passeports tunisiens, mais ce statut est à confirmer (Wikipedia, octobre 2026).",en:"Kazakhstan: an online procedure seems to exist for Tunisian passports, but this status needs confirming (Wikipedia, October 2026).",ar:"كازاخستان: يبدو أن هناك إجراءً عبر الإنترنت لحاملي جواز السفر التونسي، لكن هذه الحالة تحتاج إلى تأكيد (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Selon notre source, un numéro d'invitation d'un hôte au Kazakhstan est demandé, et l'entrée se fait par les aéroports d'Astana ou d'Almaty."],en:["According to our source, an invitation number from a host in Kazakhstan is required, and entry is through Astana or Almaty airports."],ar:["حسب مصدرنا، يُطلب رقم دعوة من مضيف في كازاخستان، ويتم الدخول عبر مطاري أستانا أو ألماتي."]}),
 E("la","mixed","https://laoevisa.gov.la","laoevisa.gov.la",
  {fr:"Laos",en:"Laos",ar:"لاوس"},
  {fr:"Laos : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Laos: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"لاوس: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 30 jours indiqué par notre source (indicatif).","Seuls certains postes-frontières acceptent l'e-visa."],en:["Stay of 30 days according to our source (indicative).","Only some border crossings accept the e-visa."],ar:["مدة الإقامة 30 يومًا حسب مصدرنا (للاسترشاد).","تقبل بعض المنافذ الحدودية فقط التأشيرة الإلكترونية."]}),
 E("np","mixed","https://nepaliport.immigration.gov.np","nepaliport.immigration.gov.np",
  {fr:"Népal",en:"Nepal",ar:"نيبال"},
  {fr:"Népal : e-visa ou visa à l'arrivée pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Nepal: e-visa or visa on arrival for Tunisian passports (Wikipedia, October 2026).",ar:"نيبال: تأشيرة إلكترونية أو تأشيرة عند الوصول لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Visa en ligne ou à l'arrivée."],en:["Stay of 90 days according to our source (indicative).","Online visa or visa on arrival."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","تأشيرة عبر الإنترنت أو عند الوصول."]}),
 E("tj","evisa",null,null,
  {fr:"Tadjikistan",en:"Tajikistan",ar:"طاجيكستان"},
  {fr:"Tadjikistan : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Tajikistan: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"طاجيكستان: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 60 jours indiqué par notre source (indicatif).","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 60 days according to our source (indicative).","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 60 يومًا حسب مصدرنا (للاسترشاد).","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("md","cond","https://evisa.gov.md","evisa.gov.md",
  {fr:"Moldavie",en:"Moldova",ar:"مولدوفا"},
  {fr:"Moldavie : e-visa sous conditions pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Moldova: e-visa under conditions for Tunisian passports (Wikipedia, October 2026).",ar:"مولدوفا: تأشيرة إلكترونية بشروط لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["E-visa réservée aux titulaires d'un visa ou d'un titre de séjour de l'Union européenne ou de Schengen."],en:["E-visa reserved for holders of a European Union or Schengen visa or residence permit."],ar:["التأشيرة الإلكترونية مخصصة لأصحاب تأشيرة أو إقامة من الاتحاد الأوروبي أو شنغن."]}),
 E("rs","evisa",null,null,
  {fr:"Serbie",en:"Serbia",ar:"صربيا"},
  {fr:"Serbie : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Serbia: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"صربيا: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 90 jours indiqué par notre source (indicatif).","Exemption possible avec certains visas à entrées multiples du Royaume-Uni, des États-Unis ou de l'EEE.","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 90 days according to our source (indicative).","Exemption possible with certain multiple-entry visas from the UK, the US or the EEA.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 90 يومًا حسب مصدرنا (للاسترشاد).","قد يُعفى أصحاب بعض تأشيرات الدخول المتعدد من المملكة المتحدة أو الولايات المتحدة أو المنطقة الاقتصادية الأوروبية.","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]}),
 E("pg","evisa",null,null,
  {fr:"Papouasie-Nouvelle-Guinée",en:"Papua New Guinea",ar:"بابوا غينيا الجديدة"},
  {fr:"Papouasie-Nouvelle-Guinée : e-visa pour les passeports tunisiens (Wikipedia, octobre 2026).",en:"Papua New Guinea: e-visa for Tunisian passports (Wikipedia, October 2026).",ar:"بابوا غينيا الجديدة: تأشيرة إلكترونية لحاملي جواز السفر التونسي (ويكيبيديا، أكتوبر 2026)."},
  {fr:["Séjour de 60 jours indiqué par notre source (indicatif).","Demande en ligne dans la catégorie « Tourist – Own Itinerary ».","L'adresse officielle exacte n'est pas encore vérifiée dans notre liste : cherchez le portail d'un organisme du gouvernement (immigration ou affaires étrangères) et évitez les sites qui ne sont pas gouvernementaux."],en:["Stay of 60 days according to our source (indicative).","Apply online in the “Tourist – Own Itinerary” category.","The exact official address is not yet verified in our list: look for the portal of a government body (immigration or foreign affairs) and avoid non-government sites."],ar:["مدة الإقامة 60 يومًا حسب مصدرنا (للاسترشاد).","يُقدَّم الطلب عبر الإنترنت ضمن فئة «Tourist – Own Itinerary».","لم يُتحقق بعد من العنوان الرسمي الدقيق في قائمتنا: ابحث عن بوابة جهة حكومية (الهجرة أو الخارجية) وتجنب المواقع غير الحكومية."]})
];
var EVT={
 fr:{cardTitle:"e-Visa",cardSub:"Visa électronique : choisissez un pays, voyez les règles et le lien officiel",
  listTitle:"e-Visa pour passeport tunisien",listSub:"Choisissez un pays, par ordre alphabétique, pour voir les règles et le portail officiel.",detailSub:"Règles, lien officiel et documents à préparer.",
  listWarn:"Liste établie d'après des sources publiques consultées les 20 et 30 octobre 2026. Les règles changent souvent : confirmez toujours sur le portail officiel avant de payer.",
  notListed:"Pas d'e-visa pour les passeports tunisiens selon nos sources : Arabie saoudite (la Tunisie ne figure pas dans la liste officielle des pays éligibles) et Égypte (visa consulaire).",
  type:{evisa:"e-Visa",eta:"ETA",mixed:"e-Visa / à l'arrivée",cond:"Sous conditions",check:"À confirmer"},
  confirmBox:"Statut à confirmer : les sources consultées ne sont pas d'accord pour les passeports tunisiens. Vérifiez sur le portail officiel avant de payer ou d'acheter un billet.",
  portalBtn:"Ouvrir le portail officiel",portalSearch:"Chercher le portail officiel",portalAddr:"Adresse officielle :",portalWarn:"Comparez cette adresse avec celle de la barre de votre navigateur : de faux sites imitent ces portails et facturent beaucoup plus cher.",
  notesTitle:"À savoir pour ce pays",prepTitle:"Avant de payer, préparez",prepSub:"Documents souvent demandés pour une e-visa. Chaque pays a sa liste : confirmez sur le portail.",
  prep:[["ev_pass","Passeport valide","Souvent 6 mois après la date d'arrivée, avec des pages vierges."],
   ["ev_scan","Scan couleur du passeport","Page d'identité, nette et sans reflet."],
   ["ev_photo","Photo d'identité numérique","Récente, fond clair, au format demandé par le portail."],
   ["ev_ticket","Billet retour ou de continuation","Prenez une réservation annulable tant que le visa n'est pas accordé."],
   ["ev_stay","Preuve d'hébergement","Réservation d'hôtel annulable ou invitation."],
   ["ev_funds","Preuve de moyens financiers","Relevés bancaires récents."],
   ["ev_ins","Assurance voyage ou santé","Exigée par certains pays, par exemple la Géorgie."],
   ["ev_card","Carte bancaire internationale et e-mail valide","Demandez à votre banque le plafond de paiement à l'étranger de votre carte."]],
  pitTitle:"Pièges à éviter",
  pits:["Utilisez uniquement le portail officiel. Les sites qui l'imitent facturent beaucoup plus cher.","Saisissez le nom, la date de naissance et le numéro de passeport exactement comme sur le passeport : une petite erreur peut faire refuser la demande.","N'achetez pas de billet non remboursable avant l'approbation. Une e-visa approuvée ne garantit pas l'entrée : le contrôle à la frontière décide.","Déposez la demande avec une marge de temps, et gardez l'approbation en PDF et imprimée."],
  srcNote:"Statuts d'après le Henley Passport Index 2026, des pages officielles et des sources publiques consultées les 20 et 30 octobre 2026. Visa Checker n'est pas un site officiel et ne dépose pas la demande à votre place."},
 en:{cardTitle:"e-Visa",cardSub:"Electronic visa: pick a country, see the rules and the official link",
  listTitle:"e-Visa for Tunisian passports",listSub:"Pick a country, in alphabetical order, to see the rules and the official portal.",detailSub:"Rules, official link and documents to prepare.",
  listWarn:"List compiled from public sources checked on 20 and 30 October 2026. Rules change often: always confirm on the official portal before paying.",
  notListed:"No e-visa for Tunisian passports according to our sources: Saudi Arabia (Tunisia is not on the official eligible list) and Egypt (consular visa).",
  type:{evisa:"e-Visa",eta:"ETA",mixed:"e-Visa / on arrival",cond:"Conditional",check:"To confirm"},
  confirmBox:"Status to confirm: the sources we checked disagree for Tunisian passports. Verify on the official portal before paying or buying a ticket.",
  portalBtn:"Open the official portal",portalSearch:"Search for the official portal",portalAddr:"Official address:",portalWarn:"Compare this address with your browser bar: fake sites imitate these portals and charge far more.",
  notesTitle:"Good to know for this country",prepTitle:"Before you pay, get ready",prepSub:"Documents often asked for an e-visa. Each country has its own list: confirm on the portal.",
  prep:[["ev_pass","Valid passport","Often 6 months beyond the arrival date, with blank pages."],
   ["ev_scan","Colour scan of your passport","Photo page, sharp and glare-free."],
   ["ev_photo","Digital passport photo","Recent, light background, in the format the portal asks for."],
   ["ev_ticket","Return or onward ticket","Book a cancellable reservation until the visa is granted."],
   ["ev_stay","Proof of accommodation","Cancellable hotel booking or invitation."],
   ["ev_funds","Proof of funds","Recent bank statements."],
   ["ev_ins","Travel or health insurance","Required by some countries, for example Georgia."],
   ["ev_card","International bank card and a valid e-mail","Ask your bank for your card's limit for payments abroad."]],
  pitTitle:"Pitfalls to avoid",
  pits:["Use only the official portal. Sites that imitate it charge far more.","Enter your name, date of birth and passport number exactly as in your passport: a small error can get the application refused.","Do not buy a non-refundable ticket before approval. An approved e-visa does not guarantee entry: the border check decides.","Apply with time to spare, and keep the approval as a PDF and printed."],
  srcNote:"Statuses based on the Henley Passport Index 2026, official pages and public sources checked on 20 and 30 October 2026. Visa Checker is not an official website and does not file the application for you."},
 ar:{cardTitle:"e-Visa",cardSub:"التأشيرة الإلكترونية: اختر دولة لتعرف الشروط والرابط الرسمي",
  listTitle:"التأشيرة الإلكترونية لجواز السفر التونسي",listSub:"اختر دولة، بالترتيب الأبجدي، لتعرف الشروط والبوابة الرسمية.",detailSub:"الشروط والرابط الرسمي والوثائق التي يجب تحضيرها.",
  listWarn:"القائمة مبنية على مصادر عامة اطُّلع عليها في 20 و30 أكتوبر 2026. القواعد تتغير كثيرًا: تأكد دائمًا من البوابة الرسمية قبل الدفع.",
  notListed:"لا توجد تأشيرة إلكترونية لجوازات السفر التونسية حسب مصادرنا: السعودية (تونس ليست في القائمة الرسمية للدول المؤهلة) ومصر (تأشيرة قنصلية).",
  type:{evisa:"تأشيرة إلكترونية",eta:"إذن إلكتروني",mixed:"إلكترونية / عند الوصول",cond:"بشروط",check:"للتأكيد"},
  confirmBox:"الوضع يحتاج إلى تأكيد: المصادر التي راجعناها غير متفقة بخصوص جوازات السفر التونسية. تحقق من البوابة الرسمية قبل الدفع أو شراء تذكرة.",
  portalBtn:"افتح البوابة الرسمية",portalSearch:"ابحث عن البوابة الرسمية",portalAddr:"العنوان الرسمي:",portalWarn:"قارن هذا العنوان بشريط المتصفح: المواقع المزيفة تقلّد هذه البوابات وتأخذ مبالغ أكبر بكثير.",
  notesTitle:"ما يجب معرفته عن هذه الدولة",prepTitle:"قبل الدفع، جهّز",prepSub:"وثائق تُطلب غالبًا للتأشيرة الإلكترونية. لكل دولة قائمتها: تأكد من البوابة.",
  prep:[["ev_pass","جواز سفر ساري","غالبًا 6 أشهر بعد تاريخ الوصول مع صفحات فارغة."],
   ["ev_scan","مسح ملوّن لجواز السفر","صفحة البيانات واضحة وبدون انعكاس ضوء."],
   ["ev_photo","صورة شخصية رقمية","حديثة وخلفية فاتحة وبالمقاس الذي تطلبه البوابة."],
   ["ev_ticket","تذكرة عودة أو مواصلة","احجز حجزًا قابلًا للإلغاء إلى أن تُمنح التأشيرة."],
   ["ev_stay","إثبات الإقامة","حجز فندق قابل للإلغاء أو دعوة."],
   ["ev_funds","إثبات الموارد المالية","كشوف حساب بنكية حديثة."],
   ["ev_ins","تأمين السفر أو الصحة","تطلبه بعض الدول، مثل جورجيا."],
   ["ev_card","بطاقة بنكية دولية وبريد إلكتروني صالح","اسأل بنكك عن سقف الدفع بالخارج لبطاقتك."]],
  pitTitle:"أخطاء يجب تجنبها",
  pits:["استعمل البوابة الرسمية فقط. المواقع التي تقلّدها تأخذ مبالغ أكبر بكثير.","اكتب الاسم وتاريخ الميلاد ورقم الجواز تمامًا كما في جواز السفر: خطأ صغير قد يؤدي إلى رفض الطلب.","لا تشترِ تذكرة غير قابلة للاسترداد قبل الموافقة. التأشيرة الإلكترونية الموافَق عليها لا تضمن الدخول: المراقبة على الحدود هي التي تقرّر.","قدّم الطلب بوقت كافٍ، واحتفظ بالموافقة بصيغة PDF ومطبوعة."],
  srcNote:"الأوضاع مبنية على مؤشر هينلي لجوازات السفر 2026 وصفحات رسمية ومصادر عامة اطُّلع عليها في 20 و30 أكتوبر 2026. Visa Checker ليس موقعًا رسميًا ولا يقدّم الطلب بدلًا عنك."}
};
var EVICON='<span class="ev3d" aria-hidden="true"><svg viewBox="0 0 48 48"><defs><linearGradient id="evg1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff3e6"/><stop offset="1" stop-color="#bcd5ff"/></linearGradient><radialGradient id="evg2" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7cc6ff"/><stop offset=".6" stop-color="#2f7de1"/><stop offset="1" stop-color="#1b4fa8"/></radialGradient></defs><rect x="6" y="5" width="30" height="38" rx="5" fill="#1e40af"/><rect x="8" y="3" width="30" height="38" rx="5" fill="url(#evg1)" stroke="#fff" stroke-width="1"/><circle cx="23" cy="19" r="10" fill="url(#evg2)"/><g class="evspin" fill="none" stroke="#fff" stroke-width="1.2" opacity=".85"><ellipse cx="23" cy="19" rx="4.2" ry="10"/><path d="M13 19h20M15 13h16M15 25h16"/></g><circle cx="20" cy="15.5" r="2.6" fill="#fff" opacity=".35"/><rect x="14" y="32" width="18" height="3" rx="1.5" fill="#1d4ed8"/><circle cx="37" cy="37" r="8" fill="#1f9d55" stroke="#fff" stroke-width="2"/><path d="M33.2 37l2.7 2.7 4.8-5.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>';
var EVARROW='<svg class="evarrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
/* Arabic alphabetical order ignores the article "ال" and treats hamza forms of alef as alef. */
function evKey(c,L){var n=c.n[L];if(L==="ar"){n=n.replace(/^ال(?=.)/,"").replace(/[\u0623\u0625\u0622]/g,"\u0627")}return n}
function evFind(id){var l=evList();for(var i=0;i<l.length;i++){if(l[i].id===id)return l[i]}return null}
function evEmoji(cc){return cc.replace(/./g,function(ch){return String.fromCodePoint(127397+ch.toUpperCase().charCodeAt(0))})}
function evFlag(cc){return flag(cc)}
/* ===== Outils : calculateur Schengen 90/180 (étape 11), FAQ (12), planning de dépôt + rappels .ics (13) ===== */
var TLS={
fr:{
 t11:"Calculateur Schengen 90/180",s11:"Combien de jours vous reste-t-il dans l'espace Schengen ?",
 t12:"Questions fréquentes",s12:"Réponses courtes, par pays de destination.",
 t13:"Planifier mon dépôt",s13:"Dates clés, délai de rendez-vous et rappels dans votre agenda.",
 c11:"Calculateur 90/180",d11:"Jours restants dans l'espace Schengen",c12:"Questions fréquentes",d12:"Réponses par pays",c13:"Planifier mon dépôt",d13:"Dates clés et rappels .ics",
 rule:"Règle : sur toute période de 180 jours glissants, 90 jours de séjour maximum (jours d'entrée et de sortie compris). Calcul indicatif : seul le garde-frontière fait foi. Vos dates restent sur cet appareil.",
 stays:"Mes séjours passés ou en cours",inL:"Entrée",outL:"Sortie",add:"Ajouter un séjour",del:"Supprimer ce séjour",plan:"Date d'entrée prévue",
 used:"Jours déjà utilisés sur les 180 derniers jours : {n}",left:"Jours restants à cette date : {n}",
 max:"Séjour maximal à partir du {d} : {n} jours. Sortie au plus tard le {e}.",
 none:"Aucun jour disponible à cette date. Prochaine entrée possible le {d} (séjour de {n} jours maximum).",
 over:"Attention : vos séjours dépassent 90 jours sur 180 (dépassement constaté le {d}).",
 bad:"Une date de sortie précède son entrée.",need:"Renseignez au moins la date d'entrée prévue.",
 faqC:"Pays de destination",faqG:"Général",
 trav:"Date de départ prévue",ctry:"Pays de destination",
 win:"Dépôt possible dès le {d} (6 mois avant le départ).",late:"Dernier jour conseillé pour déposer : {d} (15 jours avant le départ).",
 rdv:"Délai de rendez-vous constaté : environ {n} jours (mis à jour le {u}). Prenez rendez-vous au plus tard le {d}.",
 rdv0:"Délai de rendez-vous non renseigné pour ce pays. Consultez le site de {p}.",
 past:"La date de départ est trop proche ou passée : vérifiez les délais d'urgence.",
 ics:"Télécharger les rappels (.ics)",icsNote:"Les rappels s'ajoutent à votre agenda (téléphone, Google, Outlook). Il n'y a pas de notification envoyée par le site.",
 evOpen:"Ouverture possible des dépôts",evLate:"Dernier jour conseillé pour déposer",evRdv:"Prendre rendez-vous (visa {c})",evChk:"Vérifier les créneaux de rendez-vous ({c})",
 site:"Site officiel",back:"Retour"
},
en:{
 t11:"Schengen 90/180 calculator",s11:"How many days do you have left in the Schengen area?",
 t12:"Frequently asked questions",s12:"Short answers, by destination country.",
 t13:"Plan my application",s13:"Key dates, appointment delay and calendar reminders.",
 c11:"90/180 calculator",d11:"Days left in the Schengen area",c12:"FAQ",d12:"Answers by country",c13:"Plan my application",d13:"Key dates and .ics reminders",
 rule:"Rule: in any rolling 180-day period you may stay up to 90 days (entry and exit days count). Indicative only: the border officer's decision prevails. Your dates stay on this device.",
 stays:"My past or current stays",inL:"Entry",outL:"Exit",add:"Add a stay",del:"Remove this stay",plan:"Planned entry date",
 used:"Days already used in the last 180 days: {n}",left:"Days left on that date: {n}",
 max:"Maximum stay from {d}: {n} days. Leave by {e} at the latest.",
 none:"No day available on that date. Next possible entry: {d} (maximum stay {n} days).",
 over:"Warning: your stays exceed 90 days in 180 (overstay found on {d}).",
 bad:"An exit date is before its entry date.",need:"Enter at least the planned entry date.",
 faqC:"Destination country",faqG:"General",
 trav:"Planned departure date",ctry:"Destination country",
 win:"You can apply from {d} (6 months before departure).",late:"Last recommended day to apply: {d} (15 days before departure).",
 rdv:"Observed appointment delay: about {n} days (updated {u}). Book by {d} at the latest.",
 rdv0:"Appointment delay not available for this country. Check the {p} website.",
 past:"The departure date is too close or in the past: check urgent-processing options.",
 ics:"Download reminders (.ics)",icsNote:"Reminders are added to your calendar (phone, Google, Outlook). The site does not send notifications.",
 evOpen:"Applications may open",evLate:"Last recommended day to apply",evRdv:"Book appointment ({c} visa)",evChk:"Check appointment slots ({c})",
 site:"Official website",back:"Back"
},
ar:{
 t11:"حاسبة شنغن 90/180",s11:"كم يوماً بقي لك في فضاء شنغن؟",
 t12:"الأسئلة الشائعة",s12:"إجابات قصيرة حسب بلد الوجهة.",
 t13:"خطّط لتقديم ملفك",s13:"التواريخ المهمة وأجل الموعد وتذكيرات في تقويمك.",
 c11:"حاسبة 90/180",d11:"الأيام المتبقية في فضاء شنغن",c12:"الأسئلة الشائعة",d12:"إجابات حسب البلد",c13:"خطّط لتقديم ملفك",d13:"تواريخ مهمة وتذكيرات .ics",
 rule:"القاعدة: خلال أي فترة 180 يوماً متحركة يمكنك الإقامة 90 يوماً كحد أقصى (يُحتسب يوما الدخول والخروج). الحساب إرشادي فقط والقرار لعون الحدود. تبقى تواريخك على هذا الجهاز.",
 stays:"إقاماتي السابقة أو الحالية",inL:"الدخول",outL:"الخروج",add:"إضافة إقامة",del:"حذف هذه الإقامة",plan:"تاريخ الدخول المتوقع",
 used:"الأيام المستعملة خلال آخر 180 يوماً: {n}",left:"الأيام المتبقية في هذا التاريخ: {n}",
 max:"أقصى مدة إقامة ابتداءً من {d}: {n} يوماً. المغادرة في {e} على الأكثر.",
 none:"لا توجد أيام متاحة في هذا التاريخ. أقرب دخول ممكن: {d} (أقصى إقامة {n} يوماً).",
 over:"تنبيه: إقاماتك تتجاوز 90 يوماً خلال 180 يوماً (تجاوز بتاريخ {d}).",
 bad:"تاريخ خروج يسبق تاريخ دخوله.",need:"أدخل على الأقل تاريخ الدخول المتوقع.",
 faqC:"بلد الوجهة",faqG:"عام",
 trav:"تاريخ السفر المتوقع",ctry:"بلد الوجهة",
 win:"يمكنك التقديم ابتداءً من {d} (6 أشهر قبل السفر).",late:"آخر يوم مُوصى به للتقديم: {d} (15 يوماً قبل السفر).",
 rdv:"أجل الموعد المُلاحَظ: حوالي {n} يوماً (آخر تحديث {u}). احجز في {d} على الأكثر.",
 rdv0:"أجل الموعد غير متوفر لهذا البلد. راجع موقع {p}.",
 past:"تاريخ السفر قريب جداً أو انقضى: راجع خيارات المعالجة المستعجلة.",
 ics:"تنزيل التذكيرات (.ics)",icsNote:"تُضاف التذكيرات إلى تقويمك (الهاتف، Google، Outlook). الموقع لا يرسل إشعارات.",
 evOpen:"بداية إمكانية إيداع الملف",evLate:"آخر يوم مُوصى به للإيداع",evRdv:"حجز موعد (تأشيرة {c})",evChk:"تفقّد مواعيد متاحة ({c})",
 site:"الموقع الرسمي",back:"رجوع"
}};
var FAQG={
fr:[["Quand déposer ma demande ?","Au plus tôt 6 mois avant le départ et idéalement au moins 15 jours avant. Ajoutez le délai d'attente du rendez-vous."],
 ["Où déposer mon dossier ?","Dans le pays qui est votre destination principale (séjour le plus long) ou, à durée égale, le premier pays d'entrée. Le dépôt se fait auprès du consulat ou de son prestataire."],
 ["Quel est le délai de traitement ?","En règle générale jusqu'à 15 jours calendaires, pouvant aller jusqu'à 45 jours dans certains cas. Ne réservez rien de non remboursable avant la décision."],
 ["Quels sont les frais ?","Le tarif consulaire Schengen est de 90 € pour un adulte, 45 € pour un enfant de 6 à 11 ans, gratuit en dessous de 6 ans. Le prestataire ajoute ses propres frais de service."],
 ["Quelle assurance voyage ?","Une assurance couvrant au minimum 30 000 € de frais médicaux et de rapatriement, valable dans tout l'espace Schengen pour toute la durée du séjour."],
 ["Quelles conditions pour le passeport ?","Valable au moins 3 mois après la date de sortie prévue, délivré depuis moins de 10 ans, avec au moins 2 pages vierges."],
 ["Que faire en cas de refus ?","Lisez les motifs sur la lettre de refus. Un recours est possible avec un délai souvent de 15 à 30 jours selon le pays : respectez la date indiquée sur votre lettre."]],
en:[["When should I apply?","No earlier than 6 months before departure, ideally at least 15 days before. Add the appointment waiting time."],
 ["Where do I apply?","In the country that is your main destination (longest stay) or, if equal, your first country of entry. Applications go through the consulate or its service provider."],
 ["How long does processing take?","Usually up to 15 calendar days, up to 45 days in some cases. Do not book anything non-refundable before the decision."],
 ["What are the fees?","The Schengen consular fee is €90 for adults, €45 for children aged 6 to 11, free under 6. The service provider adds its own service fee."],
 ["Which travel insurance?","Cover of at least €30,000 for medical costs and repatriation, valid across the Schengen area for the whole stay."],
 ["Passport requirements?","Valid at least 3 months after your planned exit date, issued within the last 10 years, with at least 2 blank pages."],
 ["What if I am refused?","Read the reasons on the refusal letter. An appeal is possible, often within 15 to 30 days depending on the country: follow the date on your letter."]],
ar:[["متى أقدّم طلبي؟","قبل السفر بستة أشهر كحد أقصى، والأفضل 15 يوماً على الأقل. أضف مدة انتظار الموعد."],
 ["أين أقدّم ملفي؟","في بلد وجهتك الرئيسية (أطول إقامة) أو عند التساوي أول بلد تدخله. يتم الإيداع لدى القنصلية أو مزوّد الخدمة."],
 ["كم تستغرق المعالجة؟","عادة حتى 15 يوماً، وقد تصل إلى 45 يوماً في بعض الحالات. لا تحجز شيئاً غير قابل للاسترجاع قبل القرار."],
 ["ما هي الرسوم؟","رسوم شنغن القنصلية 90 أورو للبالغ، 45 أورو للطفل من 6 إلى 11 سنة، ومجانية دون 6 سنوات. ويضيف مزوّد الخدمة رسوم خدمته."],
 ["أي تأمين سفر؟","تأمين لا يقل عن 30 000 أورو للمصاريف الطبية والإعادة إلى الوطن، صالح في كامل فضاء شنغن طوال الإقامة."],
 ["شروط جواز السفر؟","صالح 3 أشهر على الأقل بعد تاريخ الخروج المتوقع، صادر منذ أقل من 10 سنوات، وبه صفحتان فارغتان على الأقل."],
 ["ماذا لو رُفض طلبي؟","اقرأ أسباب الرفض في الرسالة. الطعن ممكن وغالباً خلال 15 إلى 30 يوماً حسب البلد: التزم بالتاريخ المذكور في رسالتك."]]
};
var SCH={trips:[],plan:"",loaded:false},PLN={trav:"",c:"",rdv:null,rdvTried:false};
var SCH_KEY="sch-trips-v1";
function schLoad(){if(SCH.loaded)return;SCH.loaded=true;try{var a=JSON.parse(localStorage.getItem(SCH_KEY)||"[]");if(Array.isArray(a))SCH.trips=a.filter(function(x){return x&&typeof x.a==="string"&&typeof x.b==="string"}).slice(0,40).map(function(x){return{a:isoOk(x.a)?x.a:"",b:isoOk(x.b)?x.b:""}})}catch(e){}if(!SCH.trips.length)SCH.trips=[{a:"",b:""}];SCH.plan=today()}
function schSave(){try{localStorage.setItem(SCH_KEY,JSON.stringify(SCH.trips))}catch(e){}}
function dnum(v){return Math.round(Date.parse(v+"T00:00:00Z")/864e5)}
function dstr(n){return new Date(n*864e5).toISOString().slice(0,10)}
function tFill(s,o){return s.replace(/\{(\w+)\}/g,function(m,k){return o[k]!=null?o[k]:m})}
function schCalc(){
  var L=TLS[S.lang],days={},bad=false,i,t,d;
  SCH.trips.forEach(function(x){if(x.a&&x.b&&isoOk(x.a)&&isoOk(x.b)){var a=dnum(x.a),b=dnum(x.b);if(b<a){bad=true;return}if(b-a>3650)return;for(d=a;d<=b;d++)days[d]=1}else if((x.a&&!x.b)||(!x.a&&x.b)){}});
  function cnt(e){var c=0,k;for(k=e-179;k<=e;k++)if(days[k])c++;return c}
  var over=null,keys=Object.keys(days).map(Number).sort(function(a,b){return a-b});
  for(i=0;i<keys.length;i++){if(cnt(keys[i])>90){over=keys[i];break}}
  if(!SCH.plan||!isoOk(SCH.plan))return{bad:bad,over:over,need:true};
  var E=dnum(SCH.plan),used=cnt(E-1);
  function maxFrom(e){var k,n=0,c;var add={};for(k=0;k<181;k++){var day=e+k;add[day]=1;c=0;var j;for(j=day-179;j<=day;j++)if(days[j]||add[j])c++;if(c>90)break;n++}return n}
  var m=maxFrom(E),r={bad:bad,over:over,used:used,left:Math.max(0,90-used),max:m};
  if(m>0)r.exit=dstr(E+m-1);else{for(i=1;i<=400;i++){var mm=maxFrom(E+i);if(mm>0){r.next=dstr(E+i);r.nextMax=mm;break}}}
  return r;
}
function schHtml(L){
  schLoad();var r=schCalc(),h='<div class="panel tool"><p class="ag-note">'+esc(L.rule)+'</p>';
  h+='<div class="q-label" id="sc-h">'+esc(L.stays)+'</div><div role="group" aria-labelledby="sc-h" class="sc-list">';
  SCH.trips.forEach(function(x,i){
    h+='<div class="sc-row"><label>'+esc(L.inL)+'<input type="date" class="sel" data-sc="a" data-i="'+i+'" value="'+escA(x.a)+'"></label><label>'+esc(L.outL)+'<input type="date" class="sel" data-sc="b" data-i="'+i+'" value="'+escA(x.b)+'"></label>'
     +'<button type="button" class="reset" data-sc-del="'+i+'" aria-label="'+escA(L.del)+'">\u2715</button></div>'});
  h+='</div><button type="button" class="reset" data-sc-add="1">+ '+esc(L.add)+'</button>';
  h+='<label class="sc-plan">'+esc(L.plan)+'<input type="date" class="sel" id="sc-plan" value="'+escA(SCH.plan)+'"></label>';
  h+='<div id="sc-res" class="sc-res" role="status" aria-live="polite">'+schResHtml(L,r)+'</div></div>';
  return h;
}
function schResHtml(L,r){
  var h="";
  if(r.bad)h+='<p class="i-warn">\u26A0 '+esc(L.bad)+'</p>';
  if(r.over!=null)h+='<p class="i-warn">\u26A0 '+esc(tFill(L.over,{d:fmtD(dstr(r.over))}))+'</p>';
  if(r.need)return h+'<p class="ag-note">'+esc(L.need)+'</p>';
  var pct=Math.min(100,Math.round(r.used/90*100));
  h+='<div class="bar'+(r.left===0?"":" done")+'" role="progressbar" aria-valuemin="0" aria-valuemax="90" aria-valuenow="'+Math.min(90,r.used)+'" aria-label="'+escA(tFill(L.used,{n:r.used}))+'"><i style="width:'+pct+'%"></i></div>';
  h+='<p><b><bdi dir="ltr">'+esc(tFill(L.used,{n:r.used}))+'</bdi></b></p><p><b>'+esc(tFill(L.left,{n:r.left}))+'</b></p>';
  if(r.max>0)h+='<p class="sc-ok">\u2713 '+esc(tFill(L.max,{d:fmtD(SCH.plan),n:r.max,e:fmtD(r.exit)}))+'</p>';
  else h+='<p class="i-warn">\u26A0 '+esc(r.next?tFill(L.none,{d:fmtD(r.next),n:r.nextMax}):L.none.split(".")[0]+".")+'</p>';
  return h;
}
function faqHtml(L){
  var id=PLN.c||(curC().ready?curC().id:"fr"),G=FAQG[S.lang],h='<div class="panel tool"><label class="q-label" for="faq-c">'+esc(L.faqC)+'</label><select class="sel" id="faq-c">';
  COUNTRIES.filter(function(c){return c.ready}).forEach(function(c){h+='<option value="'+c.id+'"'+(c.id===id?' selected':'')+'>'+esc(nm(c))+'</option>'});
  h+='</select>';
  var p=id==="fr"?{prov:"France-Visas / TLScontact",site:"https://france-visas.gouv.fr/tunisie"}:(PROF[id]||null);
  var items=G.slice();
  if(p){var q={fr:["Où et comment déposer pour ce pays ?","Via "+p.prov+". Consultez toujours le site officiel pour la liste à jour des pièces et des tarifs."],en:["Where and how do I apply for this country?","Through "+p.prov+". Always check the official website for the current document list and fees."],ar:["أين وكيف أقدّم لهذا البلد؟","عبر "+p.prov+". راجع دائماً الموقع الرسمي للقائمة والرسوم المحدّثة."]}[S.lang];items.unshift(q)}
  h+='<div class="faq">';
  items.forEach(function(x,i){h+='<details class="lt"><summary>'+esc(x[0])+'</summary><p>'+esc(x[1])+'</p></details>'});
  h+='</div>';
  if(p&&p.site)h+='<p><a href="'+escA(p.site)+'" target="_blank" rel="noopener noreferrer">'+esc(L.site)+' \u2197</a></p>';
  return h+'</div>';
}
function rdvLoad(){if(PLN.rdvTried)return;PLN.rdvTried=true;try{var c=new AbortController(),tm=setTimeout(function(){c.abort()},6000);fetch("rdv.json",{signal:c.signal,cache:"no-cache"}).then(function(r){return r.ok?r.json():null}).then(function(j){clearTimeout(tm);if(j&&typeof j==="object"&&j.items&&typeof j.items==="object"){PLN.rdv=j;if(S.step===13)planRes()}}).catch(function(){})}catch(e){}}
function planData(){
  var L=TLS[S.lang],id=PLN.c||(curC().ready?curC().id:"fr");
  if(!PLN.trav||!isoOk(PLN.trav))return null;
  var T=dnum(PLN.trav),o={id:id,T:T,open:dstr(T-183),late:dstr(T-15),past:T-dnum(today())<15};
  var it=PLN.rdv&&PLN.rdv.items&&PLN.rdv.items[id];
  if(it&&typeof it.days==="number"&&it.days>=0&&it.days<400){o.days=Math.round(it.days);o.upd=String(PLN.rdv.updated||"").slice(0,10);o.book=dstr(T-15-o.days)}
  return o;
}
function planRes(){var el=$("plan-res");if(el)el.innerHTML=planResHtml(TLS[S.lang])}
function planResHtml(L){
  var o=planData();if(!o)return '<p class="ag-note">'+esc({fr:"Renseignez votre date de départ prévue.",en:"Enter your planned departure date.",ar:"أدخل تاريخ السفر المتوقع."}[S.lang])+'</p>';
  var c=COUNTRIES.filter(function(x){return x.id===o.id})[0],p=o.id==="fr"?{prov:"TLScontact"}:(PROF[o.id]||{prov:"?"}),h="";
  h+='<p>'+esc(tFill(L.win,{d:fmtD(o.open)}))+'</p><p>'+esc(tFill(L.late,{d:fmtD(o.late)}))+'</p>';
  if(o.days!=null)h+='<p><b>'+esc(tFill(L.rdv,{n:o.days,u:fmtD(o.upd),d:fmtD(o.book)}))+'</b></p>';else h+='<p class="ag-note">'+esc(tFill(L.rdv0,{p:p.prov}))+'</p>';
  if(o.past)h+='<p class="i-warn">\u26A0 '+esc(L.past)+'</p>';
  h+='<button type="button" class="pay" data-ics="1">'+esc(L.ics)+'</button><p class="ag-note">'+esc(L.icsNote)+'</p>';
  return h;
}
function planHtml(L){
  rdvLoad();var id=PLN.c||(curC().ready?curC().id:"fr");
  var h='<div class="panel tool"><label class="q-label" for="pl-c">'+esc(L.ctry)+'</label><select class="sel" id="pl-c">';
  COUNTRIES.filter(function(c){return c.ready}).forEach(function(c){h+='<option value="'+c.id+'"'+(c.id===id?' selected':'')+'>'+esc(nm(c))+'</option>'});
  h+='</select><label class="q-label" for="pl-t">'+esc(L.trav)+'</label><input type="date" class="sel" id="pl-t" value="'+escA(PLN.trav)+'" min="'+today()+'">';
  h+='<div id="plan-res" class="sc-res" role="status" aria-live="polite">'+planResHtml(L)+'</div></div>';
  return h;
}
function toolsHtml(t){var L=TLS[S.lang];return S.step===11?schHtml(L):S.step===12?faqHtml(L):planHtml(L)}
var TICON={11:'<path d="M5 4h14v16H5z M8 8h8 M8 12h3 M13 12h3 M8 16h3 M13 16h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',12:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M9.5 9.5a2.5 2.5 0 115 0c0 1.6-2.5 2-2.5 3.5M12 17h.01" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',13:'<rect x="4" y="5" width="16" height="15" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 3v4M16 3v4M4 10h16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>'};
function toolsCardsHtml(){var L=TLS[S.lang],h='<div class="toolcards">';[11,12,13].forEach(function(n){h+='<button type="button" class="evcard toolcard" data-tool="'+n+'"><span class="evico"><svg viewBox="0 0 24 24" aria-hidden="true">'+TICON[n]+'</svg></span><span class="evtxt"><b>'+L["c"+n]+'</b><span>'+L["d"+n]+'</span></span>'+EVARROW+'</button>'});return h+'</div>'}
function icsEsc(s){return String(s).replace(/\\/g,"\\\\").replace(/;/g,"\;").replace(/,/g,"\\,").replace(/\r?\n/g,"\\n")}
function icsDl(){
  var o=planData();if(!o)return;var L=TLS[S.lang],c=COUNTRIES.filter(function(x){return x.id===o.id})[0],cn=nm(c),stamp=new Date().toISOString().replace(/[-:]/g,"").slice(0,15)+"Z";
  var ev=[[o.open,L.evOpen,0],[o.late,L.evLate,1]];
  if(o.days!=null)ev.push([o.book,tFill(L.evRdv,{c:cn}),2]);
  var out=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//Visa Checker//FR","CALSCALE:GREGORIAN"];
  ev.forEach(function(e,i){
    var d=e[0].replace(/-/g,""),nx=dstr(dnum(e[0])+1).replace(/-/g,"");
    out.push("BEGIN:VEVENT","UID:vc-"+o.id+"-"+d+"-"+i+"@visa-checker","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+d,"DTEND;VALUE=DATE:"+nx,"SUMMARY:"+icsEsc("Visa Checker - "+e[1]),
      "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+icsEsc(e[1]),"TRIGGER:PT9H","END:VALARM","END:VEVENT")});
  var s=Math.max(dnum(today())+1,dnum(o.late)-13),e2=dnum(o.late);
  if(e2>=dnum(today())){var cnt=Math.min(30,Math.max(1,e2-s+1));
    out.push("BEGIN:VEVENT","UID:vc-"+o.id+"-chk@visa-checker","DTSTAMP:"+stamp,"DTSTART;VALUE=DATE:"+dstr(s).replace(/-/g,""),"DTEND;VALUE=DATE:"+dstr(s+1).replace(/-/g,""),"RRULE:FREQ=DAILY;COUNT="+cnt,"SUMMARY:"+icsEsc("Visa Checker - "+tFill(L.evChk,{c:cn})),
      "BEGIN:VALARM","ACTION:DISPLAY","DESCRIPTION:"+icsEsc(tFill(L.evChk,{c:cn})),"TRIGGER:PT9H","END:VALARM","END:VEVENT")}
  out.push("END:VCALENDAR");
  var blob=new Blob([out.join("\r\n")+"\r\n"],{type:"text/calendar;charset=utf-8"}),a=document.createElement("a");
  a.href=URL.createObjectURL(blob);a.download="visa-rappels-"+o.id+".ics";document.body.appendChild(a);a.click();
  setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1000);
}
document.addEventListener("click",function(e){
  var t=e.target.closest&&e.target.closest("[data-tool]");
  if(t){S.step=+t.dataset.tool;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  if(S.step<11)return;
  if(e.target.closest("[data-ics]")){icsDl();return}
  if(e.target.closest("[data-sc-add]")){if(SCH.trips.length<40){SCH.trips.push({a:"",b:""});schSave();render();var ins=document.querySelectorAll('[data-sc="a"]');if(ins.length)ins[ins.length-1].focus()}return}
  var d=e.target.closest("[data-sc-del]");
  if(d){SCH.trips.splice(+d.dataset.scDel,1);if(!SCH.trips.length)SCH.trips=[{a:"",b:""}];schSave();render();return}
});
document.addEventListener("input",function(e){
  var el=e.target;if(S.step<11||!el.dataset)return;
  if(el.dataset.sc){var i=+el.dataset.i;if(SCH.trips[i]){SCH.trips[i][el.dataset.sc]=isoOk(el.value)?el.value:"";schSave();var r=$("sc-res");if(r)r.innerHTML=schResHtml(TLS[S.lang],schCalc())}return}
  if(el.id==="sc-plan"){SCH.plan=isoOk(el.value)?el.value:"";var r2=$("sc-res");if(r2)r2.innerHTML=schResHtml(TLS[S.lang],schCalc());return}
  if(el.id==="pl-t"){PLN.trav=isoOk(el.value)?el.value:"";planRes();return}
});
document.addEventListener("change",function(e){
  var el=e.target;if(S.step<11)return;
  if(el.id==="faq-c"||el.id==="pl-c"){PLN.c=el.value;render();var n=$(el.id);if(n)n.focus()}
});


/* ===== Générateur de lettre sur mesure (IA, via le Worker /letter, réservé au pack) ===== */
var LETTER_URL="https://visa-proxy.rabehfly.workers.dev/letter";
var AIS={f:{language:"fr",purpose:"tourism",profile:"employee",country:"",dateFrom:"",dateTo:"",job:"",income:"",budget:"",lodging:"",ties:"",notes:""},busy:false,err:"",res:""};
var AIX={
fr:{title:"Lettre de motivation sur mesure (IA)",intro:"Renseignez votre situation : l'IA rédige un brouillon que vous relisez et corrigez. Ne saisissez jamais de numéro de passeport. Votre texte est envoyé à un service d'intelligence artificielle tiers pour écrire la lettre ; notre serveur ne le conserve pas.",
 lang:"Langue de la lettre",purpose:"Motif du voyage",prof:"Votre situation",country:"Pays de destination",from:"Départ prévu",to:"Retour prévu",job:"Profession et employeur / établissement",income:"Revenu mensuel (ex. 1800 dinars)",budget:"Budget du séjour (ex. 1500 euros)",lodging:"Hébergement (hôtel, chez un proche…)",ties:"Attaches en Tunisie (famille, logement, travail…)",notes:"Précisions utiles (facultatif)",go:"Générer la lettre",busy:"Rédaction en cours…",
 reqErr:"Renseignez la situation, le pays et des dates valides (retour après le départ).",auth:"Votre accès a expiré. Saisissez un nouveau code.",rate:"Limite du jour atteinte. Réessayez demain.",fail:"La génération a échoué. Réessayez dans un instant.",resT:"Votre lettre (brouillon IA)",warn:"Brouillon : vérifiez chaque fait, complétez les [crochets] et signez vous-même.",
 purposes:{tourism:"Tourisme",family:"Visite familiale ou amicale",business:"Affaires",medical:"Soins médicaux"},profs:{employee:"Salarié(e)",self:"Indépendant(e)",student:"Étudiant(e)",retired:"Retraité(e)",other:"Autre"},copy:"Copier",pdf:"Enregistrer en PDF"},
en:{title:"Tailor-made cover letter (AI)",intro:"Describe your situation: the AI writes a draft that you review and correct. Never enter a passport number. Your text is sent to a third-party artificial intelligence service to write the letter; our server does not keep it.",
 lang:"Letter language",purpose:"Purpose of travel",prof:"Your situation",country:"Destination country",from:"Planned departure",to:"Planned return",job:"Job and employer / school",income:"Monthly income (e.g. 1800 dinars)",budget:"Trip budget (e.g. 1500 euros)",lodging:"Accommodation (hotel, with a relative…)",ties:"Ties to Tunisia (family, home, work…)",notes:"Useful details (optional)",go:"Generate the letter",busy:"Writing…",
 reqErr:"Fill in your situation, the country and valid dates (return after departure).",auth:"Your access has expired. Enter a new code.",rate:"Daily limit reached. Try again tomorrow.",fail:"Generation failed. Try again shortly.",resT:"Your letter (AI draft)",warn:"Draft: check every fact, fill in the [brackets] and sign it yourself.",
 purposes:{tourism:"Tourism",family:"Family or friends visit",business:"Business",medical:"Medical care"},profs:{employee:"Employee",self:"Self-employed",student:"Student",retired:"Retired",other:"Other"},copy:"Copy",pdf:"Save as PDF"},
ar:{title:"رسالة تحفيز مخصّصة (ذكاء اصطناعي)",intro:"صف وضعيتك: يكتب الذكاء الاصطناعي مسودة تراجعها وتصحّحها. لا تدخل أبداً رقم جواز السفر. يُرسل نصك إلى خدمة ذكاء اصطناعي تابعة لطرف ثالث لكتابة الرسالة ولا يحتفظ به خادمنا.",
 lang:"لغة الرسالة",purpose:"سبب السفر",prof:"وضعيتك",country:"بلد الوجهة",from:"تاريخ السفر المتوقع",to:"تاريخ العودة المتوقع",job:"المهنة والمؤجّر / المؤسسة",income:"الدخل الشهري (مثال: 1800 دينار)",budget:"ميزانية الرحلة (مثال: 1500 أورو)",lodging:"الإقامة (فندق، عند قريب…)",ties:"الروابط في تونس (عائلة، سكن، عمل…)",notes:"تفاصيل مفيدة (اختياري)",go:"إنشاء الرسالة",busy:"جارٍ الكتابة…",
 reqErr:"أدخل وضعيتك والبلد وتواريخ صحيحة (العودة بعد السفر).",auth:"انتهت صلاحية وصولك. أدخل رمزاً جديداً.",rate:"بلغتَ الحد اليومي. أعد المحاولة غداً.",fail:"فشل الإنشاء. أعد المحاولة بعد قليل.",resT:"رسالتك (مسودة بالذكاء الاصطناعي)",warn:"مسودة: تحقق من كل معلومة وأكمل ما بين [الأقواس] ووقّع بنفسك.",
 purposes:{tourism:"سياحة",family:"زيارة عائلية أو أصدقاء",business:"أعمال",medical:"علاج طبي"},profs:{employee:"موظف",self:"عمل حر",student:"طالب",retired:"متقاعد",other:"آخر"},copy:"نسخ",pdf:"حفظ بصيغة PDF"}};
function aiOpts(o,v){return Object.keys(o).map(function(k){return '<option value="'+k+'"'+(k===v?' selected':'')+'>'+esc(o[k])+'</option>'}).join("")}
function aiResHtml(){
  var X=AIX[S.lang],h="";
  if(AIS.err)h+='<p class="ag-err" role="alert">'+esc(AIS.err)+'</p>';
  if(AIS.busy)h+='<p class="rf-sub" role="status">'+esc(X.busy)+'</p>';
  if(AIS.res)h+='<p class="rf-sub">'+esc(X.warn)+'</p><details class="lt" open><summary>'+esc(X.resT)+'</summary><div class="lt-body"><pre class="letter" id="pk-ai">'+esc(AIS.res)+'</pre><button type="button" class="cp" data-copy="ai">'+esc(X.copy)+'</button> <button type="button" class="cp" data-pdf="ai">'+esc(X.pdf)+'</button></div></details>';
  return h;
}
function aiHtml(){
  var X=AIX[S.lang],f=AIS.f;
  function inp(k,l,ph){return '<label class="q-label" for="ai-'+k+'">'+esc(l)+'</label><input class="sel" id="ai-'+k+'" data-ai="'+k+'" type="text" maxlength="160" autocomplete="off" value="'+escA(f[k])+'">'}
  var h='<section class="aibox"><h2>'+esc(X.title)+'</h2><p class="rf-sub">'+esc(X.intro)+'</p>';
  h+='<label class="q-label" for="ai-language">'+esc(X.lang)+'</label><select class="sel" id="ai-language" data-ai="language">'+aiOpts({fr:"Français",en:"English"},f.language)+'</select>';
  h+='<label class="q-label" for="ai-purpose">'+esc(X.purpose)+'</label><select class="sel" id="ai-purpose" data-ai="purpose">'+aiOpts(X.purposes,f.purpose)+'</select>';
  h+='<label class="q-label" for="ai-profile">'+esc(X.prof)+'</label><select class="sel" id="ai-profile" data-ai="profile">'+aiOpts(X.profs,f.profile)+'</select>';
  h+=inp("country",X.country)+'<label class="q-label" for="ai-dateFrom">'+esc(X.from)+'</label><input class="sel" id="ai-dateFrom" data-ai="dateFrom" type="date" value="'+escA(f.dateFrom)+'">';
  h+='<label class="q-label" for="ai-dateTo">'+esc(X.to)+'</label><input class="sel" id="ai-dateTo" data-ai="dateTo" type="date" value="'+escA(f.dateTo)+'">';
  h+=inp("job",X.job)+inp("income",X.income)+inp("budget",X.budget)+inp("lodging",X.lodging)+inp("ties",X.ties)+inp("notes",X.notes);
  h+='<button type="button" class="pay" data-ai-go="1"'+(AIS.busy?' disabled':'')+'>'+esc(X.go)+'</button><div id="ai-res" role="status" aria-live="polite">'+aiResHtml()+'</div></section>';
  return h;
}
function aiShow(){var el=$("ai-res");if(el)el.innerHTML=aiResHtml();var b=document.querySelector("[data-ai-go]");if(b)b.disabled=AIS.busy}
document.addEventListener("input",function(e){var k=e.target.dataset&&e.target.dataset.ai;if(k&&AIS.f.hasOwnProperty(k))AIS.f[k]=e.target.value});
document.addEventListener("change",function(e){var k=e.target.dataset&&e.target.dataset.ai;if(k&&AIS.f.hasOwnProperty(k))AIS.f[k]=e.target.value});
document.addEventListener("click",function(e){
  if(!(e.target.closest&&e.target.closest("[data-ai-go]"))||AIS.busy)return;
  var X=AIX[S.lang],f=AIS.f;
  if(!f.country.trim()||!isoOk(f.dateFrom)||!isoOk(f.dateTo)||f.dateTo<f.dateFrom){AIS.err=X.reqErr;aiShow();return}
  AIS.err="";AIS.res="";AIS.busy=true;aiShow();
  var body={};Object.keys(f).forEach(function(k){body[k]=cleanTxt(f[k])});
  fetchJson(LETTER_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","Authorization":"Bearer "+S.tok},body:JSON.stringify(body)},35000).then(function(r){
    AIS.busy=false;
    if(r.ok&&r.data&&r.data.ok&&typeof r.data.letter==="string")AIS.res=r.data.letter;
    else if(r.status===401){S.pack=false;S.tok="";PACK_STATE="expired";save();render();return}
    else AIS.err=r.status===429?X.rate:X.fail;
    aiShow();
  });
});


/* ===== Analyseur de lettre de refus (IA, via le Worker /analyze, réservé au pack) ===== */
var ANALYZE_URL="https://visa-proxy.rabehfly.workers.dev/analyze";
var ANS={reason:"",situation:"",busy:false,err:"",res:""};
var ANX={
fr:{title:"Analyseur de lettre de refus (IA)",intro:"Recopiez le motif de refus et décrivez votre situation : l'IA explique le motif, liste les pièces à corriger, propose un plan d'action et un brouillon de recours. Votre texte est envoyé à un service d'intelligence artificielle tiers ; notre serveur ne le conserve pas. N'écrivez jamais de numéro de passeport ni d'identité.",reason:"Motif de refus (comme sur le papier remis)",sit:"Votre situation en quelques lignes",go:"Analyser mon refus",busy:"Analyse en cours…",reqErr:"Indiquez le motif et votre situation (quelques mots suffisent).",auth:"Votre accès a expiré. Saisissez un nouveau code.",rate:"Limite du jour atteinte. Réessayez demain.",fail:"L'analyse a échoué. Réessayez dans un instant.",resT:"Votre analyse (brouillon IA)",warn:"Aide à la préparation, pas un avis juridique. Vérifiez chaque point. Aucun résultat n'est garanti : seul le consulat décide.",copy:"Copier"},
en:{title:"Refusal letter analyzer (AI)",intro:"Copy the refusal reason and describe your situation: the AI explains the reason, lists documents to fix, suggests an action plan and an appeal draft. Your text is sent to a third-party artificial intelligence service; our server does not keep it. Never write a passport or ID number.",reason:"Refusal reason (as on the paper you received)",sit:"Your situation in a few lines",go:"Analyze my refusal",busy:"Analyzing…",reqErr:"Enter the reason and your situation (a few words are enough).",auth:"Your access has expired. Enter a new code.",rate:"Daily limit reached. Try again tomorrow.",fail:"Analysis failed. Try again shortly.",resT:"Your analysis (AI draft)",warn:"Preparation aid, not legal advice. Check every point. No result is guaranteed: only the consulate decides.",copy:"Copy"},
ar:{title:"محلل رسالة الرفض (ذكاء اصطناعي)",intro:"انسخ سبب الرفض وصف وضعيتك: يشرح الذكاء الاصطناعي السبب ويحدد الوثائق التي يجب تصحيحها ويقترح خطة عمل ومسودة طعن. يُرسل نصك إلى خدمة ذكاء اصطناعي تابعة لطرف ثالث ولا يحتفظ به خادمنا. لا تكتب أبداً رقم جواز السفر أو الهوية.",reason:"سبب الرفض (كما في الورقة المسلّمة)",sit:"وضعيتك في بضعة أسطر",go:"حلّل رفضي",busy:"جارٍ التحليل…",reqErr:"أدخل السبب ووضعيتك (كلمات قليلة تكفي).",auth:"انتهت صلاحية وصولك. أدخل رمزاً جديداً.",rate:"بلغتَ الحد اليومي. أعد المحاولة غداً.",fail:"فشل التحليل. أعد المحاولة بعد قليل.",resT:"تحليلك (مسودة بالذكاء الاصطناعي)",warn:"مساعدة على التحضير وليست استشارة قانونية. تحقق من كل نقطة. لا نتيجة مضمونة: القنصلية وحدها تقرر.",copy:"نسخ"}};
function anResHtml(){
  var X=ANX[S.lang],h="";
  if(ANS.err)h+='<p class="ag-err" role="alert">'+esc(ANS.err)+'</p>';
  if(ANS.busy)h+='<p class="rf-sub" role="status">'+esc(X.busy)+'</p>';
  if(ANS.res)h+='<p class="rf-sub">'+esc(X.warn)+'</p><details class="lt" open><summary>'+esc(X.resT)+'</summary><div class="lt-body"><pre class="letter" id="pk-an">'+esc(ANS.res)+'</pre><button type="button" class="cp" data-copy="an">'+esc(X.copy)+'</button></div></details>';
  return h;
}
function anHtml(){
  var X=ANX[S.lang];
  return '<section class="aibox"><h2>'+esc(X.title)+'</h2><p class="rf-sub">'+esc(X.intro)+'</p>'
   +'<label class="q-label" for="an-reason">'+esc(X.reason)+'</label><textarea class="sel" id="an-reason" data-an="reason" rows="3" maxlength="600">'+esc(ANS.reason)+'</textarea>'
   +'<label class="q-label" for="an-sit">'+esc(X.sit)+'</label><textarea class="sel" id="an-sit" data-an="situation" rows="5" maxlength="1500">'+esc(ANS.situation)+'</textarea>'
   +'<button type="button" class="pay" data-an-go="1"'+(ANS.busy?' disabled':'')+'>'+esc(X.go)+'</button><div id="an-res" role="status" aria-live="polite">'+anResHtml()+'</div></section>';
}
function anShow(){var el=$("an-res");if(el)el.innerHTML=anResHtml();var b=document.querySelector("[data-an-go]");if(b)b.disabled=ANS.busy}
document.addEventListener("input",function(e){var k=e.target.dataset&&e.target.dataset.an;if(k&&ANS.hasOwnProperty(k))ANS[k]=e.target.value});
document.addEventListener("click",function(e){
  if(!(e.target.closest&&e.target.closest("[data-an-go]"))||ANS.busy)return;
  var X=ANX[S.lang];
  if(cleanTxt(ANS.reason).length<3||cleanTxt(ANS.situation).length<10){ANS.err=X.reqErr;anShow();return}
  ANS.err="";ANS.res="";ANS.busy=true;anShow();
  var body={lang:S.lang,reason:ANS.reason.slice(0,600),situation:ANS.situation.slice(0,1500)};
  fetchJson(ANALYZE_URL,{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json","Authorization":"Bearer "+S.tok},body:JSON.stringify(body)},40000).then(function(r){
    ANS.busy=false;
    if(r.ok&&r.data&&r.data.ok&&typeof r.data.analysis==="string")ANS.res=r.data.analysis;
    else if(r.status===401){S.pack=false;S.tok="";PACK_STATE="expired";save();render();return}
    else ANS.err=r.status===429?X.rate:X.fail;
    anShow();
  });
});

/* ===== Autres services : bientôt disponibles (aucun paiement possible) ===== */
var SOONX={
fr:{h:"Bientôt disponible",badge:"Bientôt",items:[["Relecture humaine de votre recours","Un conseiller relit votre lettre de recours et vous renvoie ses corrections.","45 DT"],["Vérification finale avant dépôt","Envoyez vos documents en photo : pièces manquantes ou incohérentes signalées.","15 DT"]]},
en:{h:"Coming soon",badge:"Soon",items:[["Human review of your appeal","An advisor reads your appeal letter and sends back corrections.","45 DT"],["Final check before filing","Send your documents as photos: missing or inconsistent items are flagged.","15 DT"]]},
ar:{h:"قريباً",badge:"قريباً",items:[["مراجعة بشرية لطعنك","يقرأ مستشار رسالة الطعن ويرسل لك التصحيحات.","45 دينار"],["تدقيق نهائي قبل الإيداع","أرسل وثائقك بالصور: يتم تنبيهك إلى الناقص أو غير المتناسق.","15 دينار"]]}};
function soonHtml(){
  var X=SOONX[S.lang];
  return '<h2>'+esc(X.h)+'</h2><ul class="inc">'+X.items.map(function(i){return '<li><b>'+esc(i[0])+'</b> <span class="evtag">'+esc(X.badge)+'</span><br>'+esc(i[1])+' <b>'+esc(i[2])+'</b></li>'}).join("")+'</ul>';
}

function evCardHtml(){var x=EVT[S.lang];return '<button type="button" class="evcard" id="evbtn"><span class="evico">'+EVICON+'</span><span class="evtxt"><b>'+x.cardTitle+'</b><span>'+x.cardSub+'</span></span>'+EVARROW+'</button>'}
var EVCONT={md:"eu",rs:"eu",af:"as",bt:"as",id:"as",iq:"as",kh:"as",kz:"as",la:"as",np:"as",tj:"as",pg:"oc",ao:"af",bf:"af",bi:"af",bw:"af",cd:"af",cm:"af",dj:"af",et:"af",ga:"af",lr:"af",mg:"af",mz:"af",na:"af",ng:"af",rw:"af",sc:"af",sl:"af",so:"af",ss:"af",st:"af",td:"af",tg:"af",tz:"af",ug:"af",zm:"af",zw:"af",ag:"ame",ai:"ame",bo:"ame",bs:"ame",co:"ame",cu:"ame",gy:"ame",kn:"ame",ms:"ame",tt:"ame",ve:"ame",al:"eu",am:"eu",az:"eu",ge:"eu",bh:"as",kg:"as",kr:"as",lk:"as",om:"as",pk:"as",qa:"as",ae:"as",uz:"as",vn:"as"};
var EVCN={
 fr:{eu:"Europe / Caucase",af:"Afrique",ame:"Amériques et Caraïbes",as:"Asie",oc:"Océanie"},
 en:{eu:"Europe / Caucasus",af:"Africa",ame:"Americas and Caribbean",as:"Asia",oc:"Oceania"},
 ar:{eu:"أوروبا / القوقاز",af:"أفريقيا",ame:"الأمريكتان ومنطقة الكاريبي",as:"آسيا",oc:"أوقيانوسيا"}
};
var evk="";var EVCK=["eu","af","ame","as","oc"];
var EVO={fr:"Ces conditions sont celles d'un passeport tunisien. Pour un passeport marocain ou algérien, elles peuvent différer : vérifiez sur le portail officiel avant de payer.",en:"These conditions are for a Tunisian passport. For a Moroccan or Algerian passport they may differ: check the official portal before paying.",ar:"هذه الشروط خاصة بجواز السفر التونسي. قد تختلف بالنسبة لجواز السفر المغربي أو الجزائري: تحقق من البوابة الرسمية قبل الدفع."};
var EVCI={
 af:'<g transform="translate(-2.95 -1.15) scale(1.092)"><g transform="translate(1.6 1.6) scale(.205)" fill="currentColor"><path d="M30 10 48 7l15 6 10 4 6 9 3 10 10 12-3 12-9 8-5 14-9 12-8 5-8-8-4-14-5-14-9-4-10-6-4-10 4-10 8-12 12-8Z"/></g><path d="M19.5 2.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor"/></g>',
 ame:'<g transform="translate(-1.66 -1.15) scale(1.057)"><g transform="translate(.6 1.2) scale(.215)" fill="currentColor"><path d="M10 14 30 7l19 3 10 9-4 12-9 8-2 8 4 8 12 2 10 8-4 12-12 14-6 8-5-12-4-16-2-12-4-8-8-8-10-8Z"/><circle cx="70" cy="38" r="3.6"/><circle cx="79" cy="43.5" r="3.6"/><circle cx="88" cy="49" r="3.6"/></g><path d="M20.5 2.4l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor"/></g>',
 eu:'<g transform="translate(-2.88 -0.40) scale(1.034)"><path fill="currentColor" fill-rule="evenodd" d="M12 1.6l.9 4.2h.9l.5 4.4h.7l1.2 3.8h.6L18.6 22.4h-3.1l-.9-3.2H9.4l-.9 3.2H5.4L8.6 14h.6l1.2-3.8h.7l.5-4.4h.9zM10.1 17.2h3.8l-.5-1.9h-2.8z"/><path d="M20.8 2.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor"/></g>',
 as:'<g transform="translate(-1.88 -0.42) scale(1.044)"><path fill="currentColor" fill-rule="evenodd" d="M12 1.8l4.6 3.6H7.4zM5.2 9.4L12 5.2l6.8 4.2zM3 15.2l9-5.4 9 5.4zM5.6 16.2h12.8V22H5.6zM10.6 22v-3.6a1.4 1.4 0 0 1 2.8 0V22z"/><path d="M21 3.6l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor"/></g>',
 oc:'<g transform="translate(-0.74 -0.44) scale(0.995)"><path fill="currentColor" d="M12.2 9.2c-1.9-3.2-5.8-3.6-8.2-1.6 3-.7 5.4.2 8.2 1.6zM12.2 9.2c1.9-3.2 5.8-3.6 8.2-1.6-3-.7-5.4.2-8.2 1.6zM12 9c-.9-3 0-5.8 2.8-7-.9 2-1 4.2-1.2 7zM12 9c-1.9-1.9-3.1-4.6-1.4-6.8.1 2.9.5 4.9 1.4 6.8zM11 9.6c.9 3.8.8 7.4-.2 10.4h2.2c-.6-3.2-.1-6.9.9-10.4z"/><path fill="currentColor" d="M2 20.6c2-1.4 3.6-1.4 5.5 0s3.6 1.4 5.5 0 3.6-1.4 5.5 0c1.3.9 2.6 1.2 3.5 1V23H2z"/><path d="M21 2.2l.7 1.9 1.9.7-1.9.7-.7 1.9-.7-1.9-1.9-.7 1.9-.7z" fill="currentColor"/></g>'
};
var EVCX={
 fr:{back:"Tous les continents",soon:"Aucun pays e-Visa dans cette région pour le moment. La liste sera complétée.",sel:"Choisir un pays",selp:"Choisissez dans la liste…",pick:"Choisissez un continent, puis un pays (ordre alphabétique).",n:["pays","pays"]},
 en:{back:"All continents",soon:"No e-Visa country in this region yet. The list will be completed.",sel:"Choose a country",selp:"Choose from the list…",pick:"Pick a continent, then a country (alphabetical order).",n:["country","countries"]},
 ar:{back:"كل القارات",soon:"لا توجد دول للتأشيرة الإلكترونية في هذه المنطقة حاليًا. ستُستكمل القائمة.",sel:"اختر دولة",selp:"اختر من القائمة…",pick:"اختر قارة ثم دولة (بالترتيب الأبجدي).",n:["دولة","دول"]}
};
/* ===== e-Visa selon le passeport (ajouté le 08/11/2026) =====
   La liste EV ci-dessus décrit le passeport TUNISIEN. Pour les passeports marocain (ma) et algérien (dz), la liste est différente :
   EVORI.<origine> = { id_pays : [type, séjour] } où type = evisa | eta | mixed | cond | check et séjour = "90d" (jours) ou "3m" (mois), ou "" si inconnu.
   Sources : Wikipedia « Visa requirements for Moroccan citizens » et « ... Algerian citizens » (2026), consultées le 08/11/2026.
   Les pays absents de EV mais présents ici sont définis dans EVNEW (url = portail officiel si connu, sinon null : le site propose alors une recherche).
   Pour ajouter un pays à un passeport : une ligne dans EVORI.ma ou EVORI.dz. Pour un pays nouveau : un bloc dans EVNEW + son continent dans EVCONT. */
var EVNEW=[
 {id:"au",n:{fr:"Australie",en:"Australia",ar:"أستراليا"},url:"https://immi.homeaffairs.gov.au",host:"immi.homeaffairs.gov.au",c:"oc"},
 {id:"ca",n:{fr:"Canada",en:"Canada",ar:"كندا"},url:"https://www.canada.ca/en/immigration-refugees-citizenship/services/visit-canada/eta.html",host:"canada.ca",c:"ame"},
 {id:"cv",n:{fr:"Cap-Vert",en:"Cape Verde",ar:"الرأس الأخضر"},url:null,host:null,c:"af"},
 {id:"gq",n:{fr:"Guinée équatoriale",en:"Equatorial Guinea",ar:"غينيا الاستوائية"},url:null,host:null,c:"af"},
 {id:"fj",n:{fr:"Fidji",en:"Fiji",ar:"فيجي"},url:null,host:null,c:"oc"},
 {id:"gh",n:{fr:"Ghana",en:"Ghana",ar:"غانا"},url:"https://evisa.immigration.gov.gh",host:"evisa.immigration.gov.gh",c:"af"},
 {id:"in",n:{fr:"Inde",en:"India",ar:"الهند"},url:"https://indianvisaonline.gov.in/evisa/tvoa.html",host:"indianvisaonline.gov.in",c:"as"},
 {id:"ir",n:{fr:"Iran",en:"Iran",ar:"إيران"},url:"https://evisa.mfa.ir",host:"evisa.mfa.ir",c:"as"},
 {id:"il",n:{fr:"Israël",en:"Israel",ar:"إسرائيل"},url:null,host:null,c:"as"},
 {id:"jp",n:{fr:"Japon",en:"Japan",ar:"اليابان"},url:"https://www.evisa.mofa.go.jp",host:"evisa.mofa.go.jp",c:"as"},
 {id:"jo",n:{fr:"Jordanie",en:"Jordan",ar:"الأردن"},url:null,host:null,c:"as"},
 {id:"ly",n:{fr:"Libye",en:"Libya",ar:"ليبيا"},url:null,host:null,c:"af"},
 {id:"mw",n:{fr:"Malawi",en:"Malawi",ar:"ملاوي"},url:null,host:null,c:"af"},
 {id:"mr",n:{fr:"Mauritanie",en:"Mauritania",ar:"موريتانيا"},url:null,host:null,c:"af"},
 {id:"mm",n:{fr:"Myanmar (Birmanie)",en:"Myanmar",ar:"ميانمار"},url:"https://evisa.moip.gov.mm",host:"evisa.moip.gov.mm",c:"as"},
 {id:"ni",n:{fr:"Nicaragua",en:"Nicaragua",ar:"نيكاراغوا"},url:null,host:null,c:"ame"},
 {id:"za",n:{fr:"Afrique du Sud",en:"South Africa",ar:"جنوب أفريقيا"},url:null,host:null,c:"af"},
 {id:"sr",n:{fr:"Suriname",en:"Suriname",ar:"سورينام"},url:null,host:null,c:"ame"},
 {id:"ye",n:{fr:"Yémen",en:"Yemen",ar:"اليمن"},url:null,host:null,c:"as"},
 {id:"ci",n:{fr:"Côte d'Ivoire",en:"Côte d'Ivoire",ar:"كوت ديفوار"},url:null,host:null,c:"af"},
 {id:"ls",n:{fr:"Lesotho",en:"Lesotho",ar:"ليسوتو"},url:null,host:null,c:"af"},
 {id:"th",n:{fr:"Thaïlande",en:"Thailand",ar:"تايلاند"},url:"https://www.thaievisa.go.th",host:"thaievisa.go.th",c:"as"},
 {id:"vu",n:{fr:"Vanuatu",en:"Vanuatu",ar:"فانواتو"},url:null,host:null,c:"oc"},
 {id:"tr",n:{fr:"Turquie",en:"Türkiye",ar:"تركيا"},url:"https://www.evisa.gov.tr",host:"evisa.gov.tr",c:"eu"}
];
EVNEW.forEach(function(c){c.only=true;c.intro=null;c.notes=null;c.type="evisa";EVCONT[c.id]=c.c;EV.push(c)});
var EVORI={
 ma:{af:["evisa",""],al:["evisa","90d"],ag:["evisa",""],am:["evisa","120d"],au:["evisa",""],bs:["evisa","3m"],bh:["mixed","14d"],bt:["evisa","90d"],bo:["evisa","30d"],bw:["evisa","3m"],bi:["mixed","1m"],kh:["mixed","30d"],cm:["evisa",""],ca:["cond",""],cv:["eta","90d"],td:["evisa",""],cu:["evisa","90d"],cd:["evisa","7d"],dj:["evisa","90d"],gq:["evisa",""],et:["mixed","90d"],fj:["evisa",""],gh:["eta","90d"],gy:["evisa",""],"in":["evisa","30d"],id:["mixed","30d"],ir:["evisa","30d"],iq:["evisa","30d"],il:["check",""],jp:["cond",""],jo:["mixed",""],kg:["evisa","60d"],la:["mixed","30d"],ly:["evisa",""],mg:["mixed","90d"],mw:["evisa","90d"],mr:["evisa","30d"],mz:["mixed","30d"],mm:["evisa","28d"],na:["evisa","3m"],np:["mixed","90d"],ni:["evisa",""],ng:["evisa","30d"],pk:["evisa","3m"],pg:["evisa","60d"],qa:["evisa",""],kn:["evisa","30d"],rs:["evisa","90d"],sc:["eta","3m"],sl:["mixed","3m"],so:["evisa","30d"],za:["evisa",""],ss:["evisa",""],kr:["eta","90d"],lk:["eta","30d"],sr:["cond","90d"],tj:["cond","60d"],tz:["mixed","90d"],tt:["evisa","90d"],ug:["evisa","3m"],ae:["check",""],uz:["evisa","30d"],ve:["evisa",""],ye:["cond",""],zw:["evisa","1m"],ai:["evisa",""],ms:["evisa",""]},
 dz:{af:["evisa",""],al:["evisa",""],ag:["evisa","30d"],am:["evisa","120d"],az:["evisa","30d"],au:["evisa",""],bs:["evisa",""],bh:["mixed","14d"],bt:["evisa","90d"],bo:["mixed","30d"],bw:["evisa","3m"],bf:["evisa",""],kh:["mixed","30d"],cm:["evisa",""],td:["evisa",""],co:["evisa",""],cd:["evisa","7d"],ci:["evisa","3m"],cu:["evisa","90d"],dj:["evisa","90d"],gq:["evisa",""],et:["mixed","90d"],fj:["evisa",""],ga:["evisa","90d"],ge:["evisa","30d"],ir:["mixed","30d"],iq:["evisa","30d"],jo:["mixed","30d"],jp:["cond",""],kz:["evisa",""],kg:["evisa","60d"],ls:["evisa","14d"],lr:["evisa",""],mg:["mixed","60d"],mw:["evisa","90d"],md:["evisa",""],mz:["mixed","30d"],mm:["evisa","28d"],na:["evisa",""],np:["mixed","90d"],ng:["evisa","90d"],pk:["evisa","30d"],pg:["evisa","60d"],qa:["evisa",""],kn:["evisa",""],st:["evisa",""],sc:["eta","3m"],sl:["evisa","3m"],so:["evisa","30d"],za:["evisa",""],ss:["evisa",""],lk:["eta","30d"],sr:["cond","90d"],tj:["mixed","60d"],tz:["mixed","90d"],th:["evisa","60d"],tg:["evisa","15d"],tt:["evisa",""],tr:["cond",""],ug:["evisa","3m"],ae:["check",""],uz:["evisa","30d"],vu:["evisa",""],ve:["evisa",""],vn:["evisa","90d"],zm:["evisa","90d"],zw:["mixed","3m"],ms:["evisa",""]}
};
var EVADJ={ma:{fr:"marocains",en:"Moroccan",ar:"المغربي",src:"Moroccan"},dz:{fr:"algériens",en:"Algerian",ar:"الجزائري",src:"Algerian"}};
var EVTO={
 ma:{
  fr:{listTitle:"e-Visa pour passeport marocain",listSub:"Choisissez un pays, par ordre alphabétique, pour voir les règles et le portail officiel.",
   listWarn:"Liste établie d'après Wikipedia (« Visa requirements for Moroccan citizens », 2026) et des sources publiques, consultées le 8 novembre 2026. Les règles changent souvent : confirmez toujours sur le portail officiel avant de payer.",
   notListed:"Cette liste ne reprend que les pays où une e-visa ou une autorisation en ligne est possible pour un passeport marocain. Ailleurs, le visa se demande au consulat ou dans un centre de dépôt.",
   confirmBox:"Statut à confirmer : nos sources ne sont pas assez claires pour les passeports marocains. Vérifiez sur le portail officiel avant de payer ou d'acheter un billet.",
   srcNote:"Statuts d'après Wikipedia (« Visa requirements for Moroccan citizens », 2026) et des sources publiques consultées le 8 novembre 2026. Visa Checker n'est pas un site officiel et ne dépose pas la demande à votre place."},
  en:{listTitle:"e-Visa for Moroccan passports",listSub:"Pick a country, in alphabetical order, to see the rules and the official portal.",
   listWarn:"List compiled from Wikipedia (\"Visa requirements for Moroccan citizens\", 2026) and public sources, checked on 8 November 2026. Rules change often: always confirm on the official portal before paying.",
   notListed:"This list only covers countries where an e-visa or an online authorisation is possible for a Moroccan passport. Elsewhere, the visa is requested at the consulate or an application centre.",
   confirmBox:"Status to confirm: our sources are not clear enough for Moroccan passports. Verify on the official portal before paying or buying a ticket.",
   srcNote:"Statuses based on Wikipedia (\"Visa requirements for Moroccan citizens\", 2026) and public sources checked on 8 November 2026. Visa Checker is not an official website and does not file the application for you."},
  ar:{listTitle:"التأشيرة الإلكترونية لجواز السفر المغربي",listSub:"اختر دولة، بالترتيب الأبجدي، لتعرف الشروط والبوابة الرسمية.",
   listWarn:"القائمة مبنية على ويكيبيديا (Visa requirements for Moroccan citizens، 2026) ومصادر عامة اطُّلع عليها في 8 نوفمبر 2026. القواعد تتغير كثيرًا: تأكد دائمًا من البوابة الرسمية قبل الدفع.",
   notListed:"تضم هذه القائمة فقط الدول التي تتيح تأشيرة إلكترونية أو إذنًا عبر الإنترنت لحاملي جواز السفر المغربي. في غيرها تُطلب التأشيرة لدى القنصلية أو مركز الإيداع.",
   confirmBox:"الوضع يحتاج إلى تأكيد: مصادرنا غير واضحة بما يكفي بخصوص جوازات السفر المغربية. تحقق من البوابة الرسمية قبل الدفع أو شراء تذكرة.",
   srcNote:"الأوضاع مبنية على ويكيبيديا (Visa requirements for Moroccan citizens، 2026) ومصادر عامة اطُّلع عليها في 8 نوفمبر 2026. Visa Checker ليس موقعًا رسميًا ولا يقدّم الطلب بدلًا عنك."}
 },
 dz:{
  fr:{listTitle:"e-Visa pour passeport algérien",listSub:"Choisissez un pays, par ordre alphabétique, pour voir les règles et le portail officiel.",
   listWarn:"Liste établie d'après Wikipedia (« Visa requirements for Algerian citizens », 2026) et des sources publiques, consultées le 8 novembre 2026. Les règles changent souvent : confirmez toujours sur le portail officiel avant de payer.",
   notListed:"Cette liste ne reprend que les pays où une e-visa ou une autorisation en ligne est possible pour un passeport algérien. Ailleurs, le visa se demande au consulat ou dans un centre de dépôt. Quelques démarches en ligne très ciblées ne sont pas reprises (par exemple pour des résidents de certains pays) : Koweït, Philippines, Singapour.",
   confirmBox:"Statut à confirmer : nos sources ne sont pas assez claires pour les passeports algériens. Vérifiez sur le portail officiel avant de payer ou d'acheter un billet.",
   srcNote:"Statuts d'après Wikipedia (« Visa requirements for Algerian citizens », 2026) et des sources publiques consultées le 8 novembre 2026. Visa Checker n'est pas un site officiel et ne dépose pas la demande à votre place."},
  en:{listTitle:"e-Visa for Algerian passports",listSub:"Pick a country, in alphabetical order, to see the rules and the official portal.",
   listWarn:"List compiled from Wikipedia (\"Visa requirements for Algerian citizens\", 2026) and public sources, checked on 8 November 2026. Rules change often: always confirm on the official portal before paying.",
   notListed:"This list only covers countries where an e-visa or an online authorisation is possible for an Algerian passport. Elsewhere, the visa is requested at the consulate or an application centre. A few very targeted online procedures are left out (for example for residents of certain countries): Kuwait, the Philippines, Singapore.",
   confirmBox:"Status to confirm: our sources are not clear enough for Algerian passports. Verify on the official portal before paying or buying a ticket.",
   srcNote:"Statuses based on Wikipedia (\"Visa requirements for Algerian citizens\", 2026) and public sources checked on 8 November 2026. Visa Checker is not an official website and does not file the application for you."},
  ar:{listTitle:"التأشيرة الإلكترونية لجواز السفر الجزائري",listSub:"اختر دولة، بالترتيب الأبجدي، لتعرف الشروط والبوابة الرسمية.",
   listWarn:"القائمة مبنية على ويكيبيديا (Visa requirements for Algerian citizens، 2026) ومصادر عامة اطُّلع عليها في 8 نوفمبر 2026. القواعد تتغير كثيرًا: تأكد دائمًا من البوابة الرسمية قبل الدفع.",
   notListed:"تضم هذه القائمة فقط الدول التي تتيح تأشيرة إلكترونية أو إذنًا عبر الإنترنت لحاملي جواز السفر الجزائري. في غيرها تُطلب التأشيرة لدى القنصلية أو مركز الإيداع. لم تُدرج بعض الإجراءات الإلكترونية المحدودة جدًا (مثل المخصصة لمقيمي دول معينة): الكويت والفلبين وسنغافورة.",
   confirmBox:"الوضع يحتاج إلى تأكيد: مصادرنا غير واضحة بما يكفي بخصوص جوازات السفر الجزائرية. تحقق من البوابة الرسمية قبل الدفع أو شراء تذكرة.",
   srcNote:"الأوضاع مبنية على ويكيبيديا (Visa requirements for Algerian citizens، 2026) ومصادر عامة اطُّلع عليها في 8 نوفمبر 2026. Visa Checker ليس موقعًا رسميًا ولا يقدّم الطلب بدلًا عنك."}
 }
};
/* Remarques propres à un pays et à un passeport : clé "origine:pays". */
var EVEXTRA={
 "ma:ca":{fr:["Ce n'est pas une e-visa : c'est une autorisation de voyage électronique (AVE), réservée aux voyageurs par avion qui ont eu un visa canadien ces 10 dernières années ou qui ont un visa américain de non-immigrant valide. Sinon, le visa se demande de la façon habituelle."],en:["This is not an e-visa: it is an electronic travel authorisation (eTA), only for people travelling by air who held a Canadian visa in the last 10 years or hold a valid US non-immigrant visa. Otherwise, the visa is requested the usual way."],ar:["هذه ليست تأشيرة إلكترونية بل إذن سفر إلكتروني (eTA) خاص بالمسافرين جوًا ممن حصلوا على تأشيرة كندية خلال آخر 10 سنوات أو يحملون تأشيرة أمريكية سارية لغير المهاجرين. وإلا تُطلب التأشيرة بالطريقة المعتادة."]},
 "ma:jp":{fr:["E-visa pour un court séjour touristique, ouverte seulement aux personnes qui résident dans certains pays figurant sur le site officiel. Sinon, le visa se demande à l'ambassade."],en:["E-visa for a short tourist stay, only for people who live in certain countries listed on the official website. Otherwise, apply at the embassy."],ar:["تأشيرة إلكترونية لإقامة سياحية قصيرة، مخصصة فقط لمن يقيمون في دول معينة مذكورة على الموقع الرسمي. وإلا قدّم الطلب لدى السفارة."]},
 "dz:jp":{fr:["E-visa pour un court séjour, ouverte seulement aux personnes qui résident dans certains pays figurant sur le site officiel. Sinon, le visa se demande à l'ambassade."],en:["E-visa for a short stay, only for people who live in certain countries listed on the official website. Otherwise, apply at the embassy."],ar:["تأشيرة إلكترونية لإقامة قصيرة، مخصصة فقط لمن يقيمون في دول معينة مذكورة على الموقع الرسمي. وإلا قدّم الطلب لدى السفارة."]},
 "ma:ye":{fr:["Selon notre source, l'e-visa n'est ouverte qu'à des cas précis : groupes d'au moins 10 personnes, voyages d'affaires et transit. Vérifiez la situation de sécurité avant tout projet de voyage."],en:["According to our source, the e-visa is only open to specific cases: groups of 10 or more, business trips and transit. Check the security situation before planning any trip."],ar:["حسب مصدرنا، التأشيرة الإلكترونية مخصصة لحالات محددة: المجموعات من 10 أشخاص فأكثر والرحلات التجارية والعبور. تحقق من الوضع الأمني قبل التخطيط لأي سفر."]},
 "ma:sr":{fr:["Selon notre source, le passeport marocain n'a pas besoin de visa, mais il faut payer en ligne, avant l'arrivée, un droit d'entrée de 50 USD ou EUR. Une e-visa à entrées multiples existe aussi."],en:["According to our source, Moroccan passports need no visa, but an entrance fee of USD or EUR 50 must be paid online before arrival. A multiple-entry e-visa also exists."],ar:["حسب مصدرنا، لا يحتاج حامل الجواز المغربي إلى تأشيرة، لكن يجب دفع رسم دخول قدره 50 دولارًا أو يورو عبر الإنترنت قبل الوصول. وتوجد أيضًا تأشيرة إلكترونية متعددة الدخول."]},
 "dz:sr":{fr:["Selon notre source, le passeport algérien n'a pas besoin de visa, mais il faut payer en ligne, avant l'arrivée, un droit d'entrée de 50 USD ou EUR. Une e-visa à entrées multiples existe aussi."],en:["According to our source, Algerian passports need no visa, but an entrance fee of USD or EUR 50 must be paid online before arrival. A multiple-entry e-visa also exists."],ar:["حسب مصدرنا، لا يحتاج حامل الجواز الجزائري إلى تأشيرة، لكن يجب دفع رسم دخول قدره 50 دولارًا أو يورو عبر الإنترنت قبل الوصول. وتوجد أيضًا تأشيرة إلكترونية متعددة الدخول."]},
 "ma:tj":{fr:["Selon notre source, l'entrée sans visa de 14 jours ne vaut que pour les titulaires de passeport de 55 ans et plus. Les autres demandent l'e-visa (60 jours)."],en:["According to our source, the 14-day visa-free entry only applies to passport holders aged 55 and over. Everyone else applies for the e-visa (60 days)."],ar:["حسب مصدرنا، الدخول دون تأشيرة لمدة 14 يومًا مخصص لمن بلغ 55 سنة فأكثر. أما الآخرون فيطلبون التأشيرة الإلكترونية (60 يومًا)."]},
 "dz:tr":{fr:["E-visa possible seulement pour certains voyageurs : selon l'âge et s'ils ont un visa ou un titre de séjour Schengen, américain, britannique ou irlandais en cours de validité. Sinon, le visa se demande au consulat."],en:["E-visa only possible for some travellers: depending on age and on holding a valid Schengen, US, UK or Irish visa or residence permit. Otherwise, apply at the consulate."],ar:["التأشيرة الإلكترونية متاحة لبعض المسافرين فقط: حسب العمر وحيازة تأشيرة أو إقامة سارية لشنغن أو الولايات المتحدة أو بريطانيا أو أيرلندا. وإلا تُطلب التأشيرة لدى القنصلية."]},
 "ma:td":{fr:["Notre source indique une exemption de visa à partir du 1er janvier 2027 : vérifiez la règle en vigueur avant de payer."],en:["Our source mentions a visa exemption from 1 January 2027: check the rule in force before paying."],ar:["يشير مصدرنا إلى إعفاء من التأشيرة اعتبارًا من 1 يناير 2027: تحقق من القاعدة السارية قبل الدفع."]},
 "dz:af":{fr:["Notre source précise que l'e-visa n'est valable que si elle est délivrée par une mission approuvée par les autorités actuelles, et que l'arrivée se fait par l'aéroport de Kaboul. Vérifiez les conseils aux voyageurs de votre pays avant tout projet."],en:["Our source says the e-visa is only valid if issued by a mission approved by the current authorities, and that you must arrive at Kabul airport. Check travel advice before planning any trip."],ar:["يذكر مصدرنا أن التأشيرة الإلكترونية لا تصح إلا إذا أصدرتها بعثة معتمدة لدى السلطات الحالية، وأن الوصول يكون عبر مطار كابول. راجع نصائح السفر قبل التخطيط لأي رحلة."]},
 "ma:af":{fr:["Notre source précise que l'arrivée se fait par l'aéroport de Kaboul. Vérifiez les conseils aux voyageurs de votre pays avant tout projet."],en:["Our source says you must arrive at Kabul airport. Check travel advice before planning any trip."],ar:["يذكر مصدرنا أن الوصول يكون عبر مطار كابول. راجع نصائح السفر قبل التخطيط لأي رحلة."]},
 "ma:il":{fr:["Notre source mentionne une e-visa, mais nous n'avons pas pu la confirmer sur un portail officiel. Passez par le consulat ou par la page officielle du ministère de l'Intérieur avant tout achat."],en:["Our source mentions an e-visa, but we could not confirm it on an official portal. Check with the consulate or the official page of the Ministry of the Interior before buying anything."],ar:["يذكر مصدرنا تأشيرة إلكترونية، لكننا لم نتمكن من تأكيدها على بوابة رسمية. تحقق لدى القنصلية أو من الصفحة الرسمية لوزارة الداخلية قبل أي شراء."]},
 "ma:ae":{fr:["Notre source indique une demande en ligne via les services intelligents, mais les sources ne sont pas d'accord sur les passeports marocains. Utilisez uniquement le portail officiel ICP ou une compagnie aérienne agréée."],en:["Our source mentions an online application through the smart services, but sources disagree for Moroccan passports. Use only the official ICP portal or an approved airline."],ar:["يذكر مصدرنا طلبًا عبر الإنترنت من خلال الخدمات الذكية، لكن المصادر غير متفقة بخصوص الجواز المغربي. استعمل فقط بوابة الهيئة الاتحادية الرسمية أو شركة طيران معتمدة."]},
 "dz:ae":{fr:["Notre source indique une demande en ligne via les services intelligents, mais les sources ne sont pas d'accord sur les passeports algériens. Utilisez uniquement le portail officiel ICP ou une compagnie aérienne agréée."],en:["Our source mentions an online application through the smart services, but sources disagree for Algerian passports. Use only the official ICP portal or an approved airline."],ar:["يذكر مصدرنا طلبًا عبر الإنترنت من خلال الخدمات الذكية، لكن المصادر غير متفقة بخصوص الجواز الجزائري. استعمل فقط بوابة الهيئة الاتحادية الرسمية أو شركة طيران معتمدة."]},
 "ma:mr":{fr:["Notre source indique une e-visa de 30 jours. Les règles entre pays voisins changent : vérifiez-les avant de payer."],en:["Our source mentions a 30-day e-visa. Rules between neighbouring countries change: check them before paying."],ar:["يذكر مصدرنا تأشيرة إلكترونية لمدة 30 يومًا. القواعد بين الدول المجاورة تتغير: تحقق منها قبل الدفع."]}
};
function evOri(){return EVORI[S.origin]||null}
function evList(){
  var o=evOri();
  if(!o)return EV.filter(function(c){return !c.only});
  return EV.filter(function(c){return !!o[c.id]});
}
function evType(c){var o=evOri();return o&&o[c.id]?o[c.id][0]:c.type}
function evX(){
  var L=S.lang,b=EVT[L],ov=(EVTO[S.origin]||{})[L];
  if(!ov)return b;
  var r={},k;for(k in b)r[k]=b[k];for(k in ov)r[k]=ov[k];return r;
}
function evStay(code){
  if(!code)return null;
  var n=parseInt(code,10),m=/m$/.test(code);
  return {fr:m?(n+" mois"):(n+" jours"),en:m?(n+(n>1?" months":" month")):(n+" days"),ar:m?(n===1?"شهر واحد":n+" أشهر"):(n<=10?n+" أيام":n+" يومًا")};
}
function evIntro(c){
  var o=evOri();
  if(!o)return c.intro;
  var a=EVADJ[S.origin],t=o[c.id][0],n=c.n;
  var T={
   evisa:{fr:"e-visa pour les passeports "+a.fr,en:"e-visa for "+a.en+" passports",ar:"تأشيرة إلكترونية لجواز السفر "+a.ar},
   mixed:{fr:"e-visa ou visa à l'arrivée pour les passeports "+a.fr,en:"e-visa or visa on arrival for "+a.en+" passports",ar:"تأشيرة إلكترونية أو عند الوصول لجواز السفر "+a.ar},
   eta:{fr:"autorisation électronique de voyage (ETA) pour les passeports "+a.fr+", qui n'est pas un visa",en:"electronic travel authorisation (ETA) for "+a.en+" passports, which is not a visa",ar:"إذن سفر إلكتروني (ETA) لجواز السفر "+a.ar+"، وهو ليس تأشيرة"},
   cond:{fr:"démarche en ligne possible sous conditions pour les passeports "+a.fr,en:"online procedure possible under conditions for "+a.en+" passports",ar:"إجراء إلكتروني ممكن بشروط لجواز السفر "+a.ar},
   check:{fr:"statut à confirmer pour les passeports "+a.fr,en:"status to confirm for "+a.en+" passports",ar:"الوضع يحتاج إلى تأكيد لجواز السفر "+a.ar}
  }[t];
  return {fr:n.fr+" : "+T.fr+" (Wikipedia, novembre 2026).",en:n.en+": "+T.en+" (Wikipedia, November 2026).",ar:n.ar+": "+T.ar+" (ويكيبيديا، نوفمبر 2026)."};
}
function evNotes(c){
  var o=evOri();
  if(!o)return c.notes;
  var a=EVADJ[S.origin],st=evStay(o[c.id][1]),ex=EVEXTRA[S.origin+":"+c.id],r={fr:[],en:[],ar:[]};
  if(c.notes&&c.notes.fr){
    c.notes.fr.forEach(function(s,i){
      if(/tunisi|^S[ée]jour|^Stay/i.test(s))return;
      r.fr.push(s);r.en.push(c.notes.en[i]);r.ar.push(c.notes.ar[i]);
    });
  }
  if(st){
    r.fr.unshift("Séjour indiqué par notre source : "+st.fr+" (indicatif).");
    r.en.unshift("Stay shown by our source: "+st.en+" (indicative).");
    r.ar.unshift("مدة الإقامة حسب مصدرنا: "+st.ar+" (للاسترشاد).");
  }
  if(ex){r.fr=ex.fr.concat(r.fr);r.en=ex.en.concat(r.en);r.ar=ex.ar.concat(r.ar)}
  var g={fr:"Ces conditions concernent un passeport "+a.fr.replace(/s$/,"")+". Confirmez les règles et les frais sur le portail officiel avant de payer.",en:"These conditions are for "+(/^[AEIOU]/.test(a.en)?"an ":"a ")+a.en+" passport. Confirm the rules and fees on the official portal before paying.",ar:"هذه الشروط خاصة بجواز السفر "+a.ar+". تأكد من القواعد والرسوم على البوابة الرسمية قبل الدفع."};
  r.fr.push(g.fr);r.en.push(g.en);r.ar.push(g.ar);
  return r;
}
function evListHtml(){
  var x=evX(),L=S.lang,X=EVCX[L],EVL=evList();
  var h='<div class="evwrap"><div class="book"><p>'+x.listWarn+'</p></div>';
  var EPL={fr:"Pays du passeport",en:"Passport country",ar:"بلد جواز السفر"};
  h+='<div class="field"><span class="q-label" id="evolab">'+EPL[L]+'</span><div class="evopick" role="group" aria-labelledby="evolab" style="display:flex;gap:8px;flex-wrap:wrap;margin-top:6px">'+ORIS.map(function(o){var on=S.origin===o.id;return '<button type="button" class="evo-b" data-evo="'+o.id+'" aria-pressed="'+on+'" style="flex:1 1 30%;min-height:48px;display:flex;align-items:center;justify-content:center;gap:8px;padding:8px 10px;border-radius:10px;cursor:pointer;font:'+(on?'700':'500')+' 15px inherit;color:var(--ink);background:var(--surface);border:'+(on?'2px solid var(--accent)':'1px solid var(--line)')+'"><span class="flag">'+flag(o.id)+'</span><span>'+o.n[L]+'</span></button>'}).join("")+'</div></div>';
  h+='<div class="field"><label class="q-label" for="evsel">'+EVCX[L].sel+'</label><select class="sel" id="evsel"><option value="">'+EVCX[L].selp+'</option>'+EVCK.map(function(k){var cl=EVL.filter(function(c){return EVCONT[c.id]===k}).sort(function(a,b){return evKey(a,L).localeCompare(evKey(b,L),L)});return cl.length?'<optgroup label="'+EVCN[L][k]+'">'+cl.map(function(c){return '<option value="'+c.id+'">'+c.n[L]+'</option>'}).join("")+'</optgroup>':""}).join("")+'</select></div>';
  if(!evk||!EVCN[L][evk]){
    var SH={fr:{eu:"Europe",af:"Afrique",ame:"Amériques",as:"Asie",oc:"Océanie"},en:{eu:"Europe",af:"Africa",ame:"Americas",as:"Asia",oc:"Oceania"},ar:{eu:"أوروبا",af:"أفريقيا",ame:"الأمريكتان",as:"آسيا",oc:"أوقيانوسيا"}};
    var tot=EVL.length;
    h+='<p class="ag-sub c">'+X.pick+'</p><div class="cring" role="group" aria-label="'+x.cardTitle+'"><div class="chub"><b>'+x.cardTitle+'</b><small>'+tot+' '+X.n[tot>1?1:0]+'</small></div>';
    ["eu","af","ame","as","oc"].forEach(function(k,i){
      var n=EVL.filter(function(c){return EVCONT[c.id]===k}).length;
      h+='<button type="button" class="cring-b" data-evk="'+k+'" data-k="'+k+'" style="--i:'+i+'" aria-label="'+EVCN[L][k]+(n?', '+n+' '+X.n[n>1?1:0]:'')+'"><svg viewBox="0 0 24 24" aria-hidden="true">'+EVCI[k]+'</svg><span>'+SH[L][k]+'</span>'+(n?'<i class="cbadge">'+n+'</i>':'')+'</button>';
    });
    return h+'</div><p class="ag-note">'+x.notListed+'</p></div>';
  }
  var list=EVL.filter(function(c){return EVCONT[c.id]===evk}).sort(function(a,b){return evKey(a,L).localeCompare(evKey(b,L),L)});
  h+='<p><button type="button" class="evrow" data-evk="" style="max-width:100%"><span class="cn">'+X.back+'</span></button></p>';
  h+='<h2 style="margin:14px 0 8px;font-size:1.1rem">'+EVCN[L][evk]+'</h2>';
  if(!list.length)return h+'<p class="ag-sub">'+X.soon+'</p><p class="ag-note">'+x.notListed+'</p></div>';
  h+='<ul class="evlist">';
  list.forEach(function(c){h+='<li><button type="button" class="evrow" data-ev="'+c.id+'"><span class="flag">'+evFlag(c.id)+'</span><span class="cn">'+c.n[L]+'</span><span class="evtag'+(evType(c)==="check"?' warn':'')+'">'+x.type[evType(c)]+'</span>'+EVARROW+'</button></li>'});
  return h+'</ul><p class="ag-note">'+x.notListed+'</p></div>';
}
function evDetailHtml(t){
  var x=evX(),L=S.lang,c=evFind(S.evc),ty=evType(c);
  var h='<div class="evwrap"><div class="panel evdetail"><div class="evhead"><span class="flag">'+evFlag(c.id)+'</span><div class="evhd"><b class="evname">'+c.n[L]+'</b><span class="evtag'+(ty==="check"?' warn':'')+'">'+x.type[ty]+'</span></div></div>';
  h+='<p class="evintro">'+evIntro(c)[L]+'</p>';
  if(ty==="check")h+='<div class="book"><p>'+x.confirmBox+'</p></div>';
  var evu=c.url||('https://www.google.com/search?q='+encodeURIComponent('site officiel e-visa '+c.n.fr+' gouvernement'));
  h+='<a class="pay wide" href="'+evu+'" target="_blank" rel="noopener noreferrer">'+(c.url?x.portalBtn:x.portalSearch)+'</a>';
  h+=(c.host?'<p class="evaddr">'+x.portalAddr+' <span class="evhost" dir="ltr">'+c.host+'</span></p><p class="rf-sub">'+x.portalWarn+'</p>':'')+'</div>';
  h+='<section class="group"><h2>'+x.notesTitle+'</h2><ul class="adv">'+evNotes(c)[L].map(function(n){return '<li>'+n+'</li>'}).join("")+'</ul></section>';
  h+=needsHtml(t);
  h+='<section class="group"><h2>'+x.prepTitle+'</h2><p class="ag-sub">'+x.prepSub+'</p>';
  x.prep.forEach(function(p){var on=!!S.done[p[0]];h+='<label class="item'+(on?' on':'')+'"><input type="checkbox" data-id="'+p[0]+'"'+(on?' checked':'')+'><span class="i-body"><span class="i-title">'+p[1]+'</span><span class="i-note">'+p[2]+'</span></span></label>'});
  h+='</section><section class="group"><h2>'+x.pitTitle+'</h2><ul class="adv">'+x.pits.map(function(n){return '<li>'+n+'</li>'}).join("")+'</ul></section>';
  return h+'<p class="ag-note">'+x.srcNote+'</p></div>';
}
function evTitle(){var c=evFind(S.evc);return c?c.n[S.lang]+" · e-Visa":""}
/* ===== Mise à jour ciblée du DOM =====
   render() continue de produire du HTML, mais patchHTML() compare le résultat au DOM existant et ne modifie que les
   nœuds texte et les attributs qui changent : le focus, la sélection, le défilement et les saisies ne sont plus perdus.
   Les éléments portant data-id / data-c / data-agent / id servent de clés pour réutiliser les bons nœuds dans les listes. */
var KEEP_CLS={rv:1,"in":1};
function keyOf(n){return n.nodeType===1?(n.getAttribute("data-id")||n.getAttribute("data-c")||n.getAttribute("data-agent")||n.id||null):null}
function sameNode(a,b){
  if(a.nodeType!==b.nodeType)return false;
  if(a.nodeType!==1)return true;
  if(a.nodeName!==b.nodeName)return false;
  var ka=keyOf(a),kb=keyOf(b);
  return ka===kb||(!ka&&!kb);
}
function syncAttrs(a,b){
  var i,n,v,reveal=a.hasAttribute("data-rv"),cur=a.getAttribute("class")||"",keep=[];
  if(reveal)cur.split(/\s+/).forEach(function(c){if(KEEP_CLS[c])keep.push(c)});
  var want=((b.getAttribute("class")||"")+(keep.length?" "+keep.join(" "):"")).trim();
  if(cur!==want){if(want)a.setAttribute("class",want);else a.removeAttribute("class")}
  for(i=0;i<b.attributes.length;i++){
    n=b.attributes[i].name;v=b.attributes[i].value;
    if(n==="class"||(n==="style"&&reveal))continue;
    if(a.getAttribute(n)!==v)a.setAttribute(n,v);
  }
  for(i=a.attributes.length-1;i>=0;i--){
    n=a.attributes[i].name;
    if(n==="class"||n==="data-rv"||(n==="style"&&reveal))continue;
    if(!b.hasAttribute(n))a.removeAttribute(n);
  }
}
function syncControl(a,b){
  var t=a.nodeName,focus=document.activeElement===a,v;
  if(t==="INPUT"){
    if(a.type==="checkbox"||a.type==="radio"){v=b.hasAttribute("checked");if(a.checked!==v)a.checked=v}
    else if(!focus){v=b.getAttribute("value")||"";if(a.value!==v)a.value=v}
  }else if(t==="TEXTAREA"){
    if(!focus){v=b.textContent;if(a.value!==v)a.value=v}
  }else if(t==="SELECT"){
    var opts=b.querySelectorAll("option"),want=-1,i;
    for(i=0;i<opts.length;i++){if(opts[i].hasAttribute("selected")){want=i;break}}
    if(want<0)want=0;
    if(a.selectedIndex!==want)a.selectedIndex=want;
  }
}
function morphNode(a,b){
  if(a.nodeType!==1){if(a.nodeValue!==b.nodeValue)a.nodeValue=b.nodeValue;return}
  syncAttrs(a,b);
  if(a.nodeName!=="TEXTAREA")morphChildren(a,b);
  if(a.nodeName==="INPUT"||a.nodeName==="TEXTAREA"||a.nodeName==="SELECT")syncControl(a,b);
}
function morphChildren(from,to){
  var live={},i,n=to.childNodes.length;
  for(i=0;i<from.childNodes.length;i++){var k0=keyOf(from.childNodes[i]);if(k0&&!live[k0])live[k0]=from.childNodes[i]}
  for(i=0;i<n;i++){
    var nb=to.childNodes[i],na=from.childNodes[i],k=keyOf(nb);
    if(k&&live[k]&&live[k]!==na){from.insertBefore(live[k],na||null);na=live[k]}
    if(!na){from.appendChild(nb.cloneNode(true));continue}
    if(!sameNode(na,nb)){from.replaceChild(nb.cloneNode(true),na);continue}
    morphNode(na,nb);
  }
  while(from.childNodes.length>n)from.removeChild(from.lastChild);
}
function patchHTML(el,html){var t=document.createElement("template");t.innerHTML=html;morphChildren(el,t.content)}
/* Les conteneurs de rendu reçoivent un « innerHTML » qui applique patchHTML : le reste du code n'a pas à changer. */
(function(){
  var d=Object.getOwnPropertyDescriptor(Element.prototype,"innerHTML");
  ["h1","stepper","home","mode","dest","panel","req","tools","evisa","list","agency","refus","sponsors","dock","nav","links","legal"].forEach(function(id){
    var el=document.getElementById(id);if(!el)return;
    Object.defineProperty(el,"innerHTML",{configurable:true,get:function(){return d.get.call(el)},set:function(h){patchHTML(el,String(h))}});
  });
})();
var prevStep;
function focusStepHeading(){
  var d=$("lg");if(d&&d.open)return;
  var h=$("h1");if(!h)return;
  window.scrollTo(0,0);
  try{h.focus({preventScroll:true})}catch(x){h.focus()}
}
function render(){
  applyOrigin();
  var cur=curC(),ready=cur.ready;
  var t=applyCountry(UI[S.lang]);
  if(cur.id!=="fr"&&S.mode==="appeal")S.mode="check";
  if(!ready&&S.step>0&&S.step<6)S.step=0;if(S.step===2||S.step===3)S.step=4;
  if(S.step===7&&!evFind(S.evc))S.step=6;if(S.step>13||S.step<0)S.step=0;if(S.step>=8&&S.step<=10&&!S.need)S.step=0;if(S.step>=9&&S.step<=10&&!findAgent(S.agent))S.step=8;if(S.step===10&&!RQ.done)S.step=9;
  var st=S.step,e=eff();
  document.documentElement.lang=S.lang;
  document.documentElement.dir=S.lang==="ar"?"rtl":"ltr";
  setLogo(st>=8&&st<=10?(S.need==="flight"?"plane":S.need==="hotel"?"bed":"check"):"check");$("stamp").hidden=true;
  if(st===0){$("h1").innerHTML=t.sloganA+'<span class="acc">'+t.sloganB+'</span>'}else{$("h1").textContent=[0,t.modeTitle,t.destTitle,t.pTitle,t.dTitle,S.mode==="appeal"?t.apTitle:t.hTitle,EVT[S.lang].listTitle,evTitle(),rq(8),rq(9),rq(10),TLS[S.lang].t11,TLS[S.lang].t12,TLS[S.lang].t13][st]}
  $("sub").textContent=st===0?t.homeSub2:[0,t.modeSub,t.destSub,t.pSub,t.dSub,S.mode==="appeal"?t.apSub:t.hSub,EVT[S.lang].listSub,EVT[S.lang].detailSub,rqs(8),rqs(9),rqs(10),TLS[S.lang].s11,TLS[S.lang].s12,TLS[S.lang].s13][st];document.body.dataset.step=st;
  $("disc").textContent=(st===0||st>=6)?GENDISC[S.lang]:t.disc;renderLegal();renderBpn();renderTrans();renderReviews();$("homeBtn").hidden=st===0;$("homeBtn").setAttribute("aria-label",HOMEL[S.lang]);$("homeBtn").title=HOMEL[S.lang];$("reset").textContent=t.reset;$("reset").hidden=st!==4;
  ["fr","en","ar"].forEach(function(l){$("l-"+l).setAttribute("aria-pressed",S.lang===l)});
  $("links").innerHTML=(!ready||st<4||st>5||S.mode==="appeal")?"":'<a href="'+oriLink(cur)+'" target="_blank" rel="noopener noreferrer">'+t.linkFV+'</a>';
  var showSt=st>=4&&st<=5&&!(st===5&&S.mode==="appeal");$("stepper").hidden=!showSt;
  if(showSt){$("stepper").innerHTML='<div class="st-row"><span class="st-num">'+STX[S.lang].step(st-2)+' · '+t.stepNames[st-2]+'</span><span class="pill"><span class="flag">'+flag(cur.id)+'</span>'+nm(cur)+(S.motive==="medical"?' · '+t.motive.medical:'')+'</span></div>'+stepper(st-2,[t.stepNames[0],t.stepNames[2],t.stepNames[3]])}
  $("home").hidden=st!==0;if(st===0){$("home").innerHTML=homeHtml(t)}
  $("mode").hidden=st!==1;if(st===1)$("mode").innerHTML=modeHtml(t);
  $("dest").hidden=st!==2;if(st===2)$("dest").innerHTML=destHtml(t);
  $("panel").hidden=st!==3;if(st===3)$("panel").innerHTML=panelHtml(t);
  $("req").hidden=st<8||st>10;$("tools").hidden=st<11;if(st>=11)$("tools").innerHTML=toolsHtml(t);if(st===8)$("req").innerHTML=pickHtml(t);if(st===9)$("req").innerHTML=formHtml(t);if(st===10)$("req").innerHTML=doneHtml(t);$("evisa").hidden=st<6||st>7;if(st===6)$("evisa").innerHTML=evListHtml();if(st===7)$("evisa").innerHTML=evDetailHtml(t);
  $("docs").hidden=st!==4;$("help").hidden=st!==5;$("agency").hidden=true;$("refus").hidden=false;
  if(st===4){
    var vis=(e==="reunion"?RITEMS:ITEMS).filter(function(i){return i.w(Object.assign({},S,{purpose:e}))});
    var req=vis.filter(function(i){return !i.opt}),doneReq=req.filter(function(i){return S.done[i.id]}).length;
    var pct=req.length?Math.round(doneReq/req.length*100):0,left=req.length-doneReq;
    $("barfill").style.width=pct+"%";$("bar").className="bar"+(left===0?" done":"");
    var bar=$("bar");bar.setAttribute("role","progressbar");bar.setAttribute("aria-valuemin","0");bar.setAttribute("aria-valuemax","100");bar.setAttribute("aria-valuenow",pct);bar.setAttribute("aria-label",STX[S.lang].prog);
    var nAttn=req.filter(function(i){return !S.done[i.id]&&ATTN[i.id]&&i[S.lang][1]}).length;
    $("pnum").innerHTML='<bdi dir="ltr">'+doneReq+" / "+req.length+" · "+pct+" %</bdi>"+(nAttn&&left?' <span class="stt warn">\u26A0 '+nAttn+'</span>':'');$("pnum").title=nAttn?STX[S.lang].att(nAttn):"";
    $("pmsg").textContent=left===0?t.msgDone:(doneReq===0?t.msg0:t.msgN(left));
    var h="";
    ORDER.forEach(function(g){
      var gi=vis.filter(function(i){return i.g===g});if(!gi.length)return;
      var gd=gi.filter(function(i){return S.done[i.id]}).length;
      h+='<section class="group"><div class="g-head"><h2>'+((g==="purpose"&&e==="medical")?t.gMed:t.groups[g])+'</h2><span class="g-count">'+gd+'/'+gi.length+'</span></div>';
      gi.forEach(function(i){
        var c=i[S.lang],on=!!S.done[i.id],X=STX[S.lang],warn=!on&&!i.opt&&ATTN[i.id]&&c[1];
        h+='<label class="item'+(on?' on':warn?' warn':'')+'"><input type="checkbox" data-id="'+i.id+'"'+(on?' checked':'')+'><span class="i-body">'
          +(on?'<span class="stt ok">\u2713 '+X.ok+'</span>':warn?'<span class="stt warn">\u26A0 '+X.warn+'</span>':'')
          +(i.opt?'<span class="stt rec">'+X.rec+'</span>':'')
          +'<span class="i-title">'+c[0]+'</span>'+(c[1]?'<span class="'+(warn?'i-warn':'i-note')+'">'+c[1]+'</span>':'')+'</span></label>';
      });
      h+='</section>';
    });
    var X=STX[S.lang];
    var legend='<ul class="legend" aria-label="'+X.legend+'"><li><i class="lg ok"></i>'+X.ok+'</li><li><i class="lg warn"></i>'+X.warn+'</li><li><i class="lg todo"></i>'+X.todo+'</li></ul>';
    $("list").innerHTML=adaptHtml(t)+legend+h+interviewHtml();
    if(cur.id==="us")$("list").innerHTML=usHtml();
  }
  if(st===5){renderRefus(t)}
  renderSponsors(t);$("sponsors").hidden=st>=8;
  $("dock").hidden=!(st===0&&ready);
  if(st===0&&ready)$("dock").innerHTML='<div class="dock-in"><span class="flag">'+flag(S.origin)+'</span><span class="arrow" aria-hidden="true">\u2192</span><span class="flag">'+flag(cur.id)+'</span><span class="dname">'+nm(cur)+'</span><button type="button" class="pay" data-go="1">'+t.start+'</button></div>';
  $("nav").hidden=st===0;
  if(st>0){$("nav").innerHTML='<button type="button" class="reset" data-go="-1">'+t.back+'</button>'+(st===4&&cur.id!=="us"?'<button type="button" class="pay" data-go="1">'+t.next+'</button>':'')}
  if(typeof prevStep==="number"&&prevStep!==S.step)focusStepHeading();
  prevStep=S.step;
  if(S.origin!=="tn"){["bpn","trans","sponsors"].forEach(function(id){var x=$(id);if(x)x.hidden=true})}
}
function go(n){if(S.step>=11){S.step=0;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}if(S.step>=8){S.step=S.step===8?(S.back||0):(S.step===9?8:0);save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}if(S.step>=6){S.step=S.step===7?6:0;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}if(n<0&&S.mode==="appeal"&&S.step===5)n=-4;if(n<0&&S.mode!=="appeal"&&S.step===4)n=-3;S.step=Math.max(0,Math.min(5,S.step+n));save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}}
document.addEventListener("click",function(e){
  if(e.target.id==="unlock"){doUnlock("advisors","code","err",e.target);return}
  if(e.target.id==="unlock2"){doUnlock("pack","code2","err2",e.target);return}
  var cb=e.target.closest(".cp");
  if(cb&&cb.dataset.pdf==null){copyLetter(cb);return}
  var nd=e.target.closest("[data-need]");
  if(nd){S.need=nd.dataset.need;S.back=S.step;S.step=8;RQ.done=false;RQ.d1="";RQ.d2="";save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var pb=e.target.closest("[data-pt]");
  if(pb){S.pt=pb.dataset.pt;save();render();return}
  var ab=e.target.closest("[data-agent]");
  if(ab){S.agent=ab.dataset.agent;S.step=9;RQ.done=false;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var cn=e.target.closest("[data-chan]");
  if(cn){RQ.chan=cn.dataset.chan;document.querySelectorAll("[data-chan]").forEach(function(b){b.setAttribute("aria-pressed",b===cn)});return}
  if(e.target.closest("[data-tgcopy]")){try{navigator.clipboard.writeText(reqText())}catch(x){}return}
  var gb=e.target.closest("[data-go]");
  if(gb){go(parseInt(gb.dataset.go,10));return}
  if(e.target.closest("#start")){go(1);return}
  if(e.target.closest("#evbtn")){evk="";S.step=6;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var eo=e.target.closest("[data-evo]");
  if(eo){var oo=eo.dataset.evo;if(oo!==S.origin&&["tn","ma","dz"].indexOf(oo)>=0){S.origin=oo;S.country="fr";applyOrigin();evk="";save();render()}return}
  var ek=e.target.closest("[data-evk]");
  if(ek){evk=ek.dataset.evk;render();window.scrollTo(0,0);return}
  var evr=e.target.closest(".evrow");
  if(evr){S.evc=evr.dataset.ev;S.step=7;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  if(e.target.closest("#destbtn")){open=!open;render();$("destbtn").focus();return}
  var cr=e.target.closest(".crow");
  if(cr){S.country=cr.dataset.c;open=false;save();render();$("destbtn").focus();return}
  var md=e.target.closest(".mdcard");
  if(md){S.mode=md.dataset.m;S.step=S.mode==="appeal"?5:4;save();render();window.scrollTo(0,0);try{$("h1").focus({preventScroll:true})}catch(x){}return}
  var mc=e.target.closest(".mcard");
  if(mc){S.motive=mc.dataset.v;save();render();return}
  var c=e.target.closest(".chip");
  if(c){S[c.dataset.q]=c.dataset.v;if(c.dataset.q==="purpose"&&c.dataset.v==="family")S.stay="hosted";save();render();return}
});
document.addEventListener("toggle",function(e){if(e.target.classList&&e.target.classList.contains("adapt"))adaptOpen=e.target.open},true);
document.addEventListener("change",function(e){
  if(e.target.id==="gov"){S.gov=e.target.value;save();render();$("gov").focus();return}
  if(e.target.id==="pgov"){S.pgov=e.target.value;save();render();$("pgov").focus();return}
  var id=e.target.dataset&&e.target.dataset.id;
  if(id){if(e.target.checked)S.done[id]=1;else delete S.done[id];save();render();
    var again=document.querySelector('input[data-id="'+id+'"]');if(again)again.focus()}
});
document.addEventListener("click",function(e){var t=e.target;if(t&&t.tagName==="INPUT"&&t.type==="date"&&typeof t.showPicker==="function"){try{t.showPicker()}catch(x){}}});
document.addEventListener("input",function(e){var f=e.target.dataset&&e.target.dataset.f;if(f){RQ[f]=e.target.type==="checkbox"?e.target.checked:e.target.value;if(f==="dest"){RQ.city="";if(RQ.er){delete RQ.er.dest;delete RQ.er.city}render();var ds=$("rq-dest");if(ds)ds.focus();return}
  if(RQ.er&&RQ.er[f]){delete RQ.er[f];var se=$("fe-"+f);if(se)se.textContent="";e.target.setAttribute("aria-invalid","false");
    if(!Object.keys(RQ.er).length){var fm=$("fe-form");if(fm)fm.textContent=""}}}});
document.addEventListener("submit",function(e){if(e.target.id==="rqform"){e.preventDefault();submitReq()}});


/* ===== Pages légales ===== */
/* À COMPLÉTER avant le lancement : laissez vide ce que vous ne voulez pas afficher. */
var SITE={name:"Visa Checker",owner:"",status:"",address:"",email:"visacheckercontact@gmail.com",phone:"",domain:"checkmyvisa.org",host:"GitHub Pages / Cloudflare"};
var LGL={
fr:{m:"Mentions légales",c:"Confidentialité",x:"Fermer",d:"Dernière mise à jour : octobre 2026. Ce texte est un modèle de bonne foi, pas un avis juridique : faites-le relire par un professionnel avant le lancement.",
 mt:[["Éditeur du site",function(){return L(["Site : "+SITE.name+(SITE.domain?" ("+SITE.domain+")":""),SITE.owner&&"Responsable : "+SITE.owner,SITE.status&&"Statut : "+SITE.status,SITE.address&&"Adresse : "+SITE.address,SITE.email&&"E-mail : "+SITE.email,SITE.phone&&"Téléphone : "+SITE.phone,SITE.host&&"Hébergeur : "+SITE.host])}],
 ["Nature du service","Visa Checker est un outil d'aide à la préparation des dossiers de visa. Le site n'est lié à aucune ambassade, à TLScontact ni à France-Visas. Il ne dépose pas de demande de visa et ne garantit jamais l'obtention d'un visa : la décision appartient uniquement aux autorités. Vérifiez toujours les pièces exigées sur les sites officiels."],
 ["Agences et partenaires","Les billets, réservations d'hôtel et autres documents sont fournis par des agences et des partenaires indépendants. Leurs prix, délais et prestations relèvent de leur seule responsabilité. Le paiement se fait auprès de l'agence choisie, pas auprès de Visa Checker. Pour un dossier de visa, demandez uniquement des réservations réellement annulables."],
 ["Liens externes et partenaires","Le site renvoie vers des sites tiers. Certains liens peuvent être des liens partenaires : nous pouvons alors percevoir une commission, sans coût supplémentaire pour vous."],
 ["Propriété intellectuelle","Les noms, logos et marques des tiers cités appartiennent à leurs propriétaires et sont utilisés uniquement pour les identifier. Le contenu et le code du site sont protégés ; toute reprise nécessite notre accord."],
 ["Responsabilité","Les informations sont données à titre indicatif et peuvent évoluer. Nous ne pouvons être tenus responsables d'un refus de visa, d'une erreur de saisie du client ou d'un changement de règle des autorités."]],
 ct:[["Qui est responsable de vos données ?",function(){return "Le responsable est l'éditeur indiqué dans les mentions légales."+(SITE.email?" Contact : "+SITE.email+".":"")}],
 ["Quelles données collectons-nous ?","Quand vous demandez un billet d'avion ou une réservation : nom et prénom comme sur le passeport, dates de voyage, ville de destination, numéro de téléphone ou WhatsApp (avec l'indicatif du pays) et e-mail, et le canal choisi pour être prévenu(e). N'envoyez jamais de copie de passeport ni de numéro de carte bancaire par ce formulaire."],
 ["Pourquoi ?","Uniquement pour traiter votre demande, la transmettre à l'agence choisie et vous envoyer le lien de paiement puis le document. Nous ne vendons pas vos données."],
 ["Qui les reçoit ?","L'agence que vous choisissez, et les services techniques qui acheminent la demande : Cloudflare (serveur relais) puis Make (automatisation, serveurs situés dans l'Union européenne). Ces destinataires ne les utilisent que pour exécuter votre demande. Si vous utilisez le générateur de lettre, les informations saisies sont envoyées à Anthropic (service d'IA) pour rédiger le texte ; notre serveur ne les conserve pas."],
 ["Combien de temps ?","Le temps nécessaire au traitement de votre demande et à nos obligations légales, puis suppression. Vous pouvez demander la suppression plus tôt."],
 ["Stockage sur votre appareil et services tiers","Le site n'utilise pas de cookies publicitaires. Votre progression et, si vous les saisissez, les dates du calculateur Schengen sont enregistrées sur votre appareil (stockage local) et ne sont pas envoyées. Un code de déblocage saisi est vérifié par notre serveur, qui conserve seulement son empreinte chiffrée. Les polices et certaines icônes de partenaires sont chargées depuis des serveurs tiers (par exemple Google), qui voient alors votre adresse IP."],
 ["Vos droits","Vous pouvez demander l'accès, la rectification, la suppression de vos données ou vous opposer à leur traitement en nous écrivant"+" (voir l'e-mail dans les mentions légales). En Tunisie, ces droits sont encadrés par la loi organique n° 2004-63 du 27 juillet 2004 ; vous pouvez aussi saisir l'Instance nationale de protection des données personnelles (INPDP)."]]},
en:{m:"Legal notice",c:"Privacy",x:"Close",d:"Last updated: October 2026. This text is a good-faith template, not legal advice: have a professional review it before launch.",
 mt:[["Site publisher",function(){return L(["Site: "+SITE.name+(SITE.domain?" ("+SITE.domain+")":""),SITE.owner&&"Responsible: "+SITE.owner,SITE.status&&"Status: "+SITE.status,SITE.address&&"Address: "+SITE.address,SITE.email&&"E-mail: "+SITE.email,SITE.phone&&"Phone: "+SITE.phone,SITE.host&&"Host: "+SITE.host])}],
 ["Nature of the service","Visa Checker is a tool that helps you prepare visa files. The site is not affiliated with any embassy, TLScontact or France-Visas. It does not submit visa applications and never guarantees a visa: the decision belongs solely to the authorities. Always check the required documents on official websites."],
 ["Agencies and partners","Tickets, hotel bookings and other documents are provided by independent agencies and partners. Their prices, delays and services are their sole responsibility. You pay the chosen agency, not Visa Checker. For a visa file, only ask for genuinely cancellable bookings."],
 ["External and partner links","The site links to third-party sites. Some links may be partner links: we may then earn a commission at no extra cost to you."],
 ["Intellectual property","Third-party names, logos and trademarks belong to their owners and are used only to identify them. The site's content and code are protected; any reuse needs our consent."],
 ["Liability","Information is indicative and may change. We cannot be held responsible for a visa refusal, a data-entry error by the client, or a rule change by the authorities."]],
 ct:[["Who is responsible for your data?",function(){return "The controller is the publisher named in the legal notice."+(SITE.email?" Contact: "+SITE.email+".":"")}],
 ["What data do we collect?","When you request a flight ticket or hotel booking: first and last name as in your passport, travel dates, destination city, phone or WhatsApp number and e-mail, and the channel chosen to be notified. Never send a passport copy or card number through this form."],
 ["Why?","Only to process your request, pass it to the chosen agency and send you the payment link and then the document. We do not sell your data."],
 ["Who receives it?","The agency you choose, and the technical services that route the request: Cloudflare (relay server) then Make (automation, servers in the European Union). They use it only to carry out your request. If you use the letter generator, what you type is sent to Anthropic (AI service) to write the text; our server does not keep it."],
 ["How long?","As long as needed to process your request and meet our legal duties, then deletion. You can ask for earlier deletion."],
 ["Storage on your device and third-party services","The site uses no advertising cookies. Your progress and, if you enter them, the Schengen calculator dates are saved on your device (local storage) and are never sent. An unlock code you enter is checked by our server, which keeps only its encrypted fingerprint. Fonts and some partner icons load from third-party servers (for example Google), which then see your IP address."],
 ["Your rights","You can ask for access, correction or deletion of your data, or object to its processing, by writing to us (see the e-mail in the legal notice). In Tunisia these rights are governed by Organic Law No. 2004-63 of 27 July 2004; you may also contact the national personal data protection authority (INPDP)."]]},
ar:{m:"الإشعار القانوني",c:"الخصوصية",x:"إغلاق",d:"آخر تحديث: أكتوبر 2026. هذا النص نموذج بحسن نية وليس استشارة قانونية: اطلب من مختص مراجعته قبل الإطلاق.",
 mt:[["ناشر الموقع",function(){return L(["الموقع: "+SITE.name+(SITE.domain?" ("+SITE.domain+")":""),SITE.owner&&"المسؤول: "+SITE.owner,SITE.status&&"الصفة: "+SITE.status,SITE.address&&"العنوان: "+SITE.address,SITE.email&&"البريد الإلكتروني: "+SITE.email,SITE.phone&&"الهاتف: "+SITE.phone,SITE.host&&"الاستضافة: "+SITE.host])}],
 ["طبيعة الخدمة","Visa Checker أداة تساعد على تحضير ملفات التأشيرة. الموقع غير تابع لأي سفارة أو TLScontact أو France-Visas. لا يقدّم طلبات التأشيرة ولا يضمن الحصول عليها أبدًا: القرار للسلطات وحدها. تحقق دائمًا من الوثائق المطلوبة في المواقع الرسمية."],
 ["الوكالات والشركاء","تُقدَّم التذاكر وحجوزات الفنادق وغيرها من الوثائق من طرف وكالات وشركاء مستقلين. الأسعار والآجال والخدمات من مسؤوليتهم وحدهم. يتم الدفع للوكالة المختارة وليس لـ Visa Checker. في ملف التأشيرة، اطلب فقط حجوزات قابلة للإلغاء فعلًا."],
 ["الروابط الخارجية والشركاء","يحيل الموقع إلى مواقع أخرى. قد تكون بعض الروابط روابط شراكة، وقد نحصل على عمولة دون أي تكلفة إضافية عليك."],
 ["الملكية الفكرية","أسماء الجهات الأخرى وشعاراتها وعلاماتها ملك لأصحابها وتُستعمل للتعريف بها فقط. محتوى الموقع وشيفرته محميان، وأي استعمال يتطلب موافقتنا."],
 ["المسؤولية","المعلومات إرشادية وقد تتغير. لا نتحمل مسؤولية رفض التأشيرة أو خطأ في إدخال بيانات العميل أو تغيير القواعد من السلطات."]],
 ct:[["من المسؤول عن بياناتك؟",function(){return "المسؤول هو ناشر الموقع المذكور في الإشعار القانوني."+(SITE.email?" للتواصل: "+SITE.email+".":"")}],
 ["ما البيانات التي نجمعها؟","عند طلب تذكرة طيران أو حجز فندق: الاسم واللقب كما في جواز السفر، وتواريخ السفر، ومدينة الوجهة، ورقم الهاتف أو واتساب والبريد الإلكتروني، والقناة المختارة لإخطارك. لا ترسل أبدًا نسخة من الجواز أو رقم بطاقة بنكية عبر هذا النموذج."],
 ["لماذا؟","فقط لمعالجة طلبك وإرساله إلى الوكالة المختارة وإرسال رابط الدفع ثم الوثيقة إليك. لا نبيع بياناتك."],
 ["من يستلمها؟","الوكالة التي تختارها، والخدمات التقنية التي تنقل الطلب: Cloudflare (خادم وسيط) ثم Make (الأتمتة، خوادم داخل الاتحاد الأوروبي). لا تستعملها إلا لتنفيذ طلبك. وإذا استعملت مولّد الرسائل فإن ما تدخله يُرسل إلى Anthropic (خدمة ذكاء اصطناعي) لكتابة النص ولا يحتفظ به خادمنا."],
 ["كم المدة؟","المدة اللازمة لمعالجة طلبك وللوفاء بالتزاماتنا القانونية، ثم تُحذف. يمكنك طلب الحذف قبل ذلك."],
 ["التخزين على جهازك والخدمات الخارجية","لا يستعمل الموقع ملفات تعريف ارتباط إعلانية. يُحفظ تقدّمك وتواريخ حاسبة شنغن (إن أدخلتها) على جهازك (التخزين المحلي) ولا تُرسل أبداً. يتحقق خادمنا من رمز الفتح الذي تدخله ولا يحتفظ إلا ببصمته المشفّرة. تُحمَّل الخطوط وبعض أيقونات الشركاء من خوادم خارجية (مثل Google) ترى عنوان IP الخاص بك."],
 ["حقوقك","يمكنك طلب الاطلاع على بياناتك أو تصحيحها أو حذفها أو الاعتراض على معالجتها بمراسلتنا (انظر البريد في الإشعار القانوني). في تونس تنظّم هذه الحقوق القانون الأساسي عدد 63 لسنة 2004 المؤرخ في 27 جويلية 2004، ويمكنك أيضًا اللجوء إلى الهيئة الوطنية لحماية المعطيات الشخصية (INPDP)."]]}
};
var HOMEL={fr:"Accueil",en:"Home",ar:"الرئيسية"};
document.addEventListener("click",function(e){if(e.target.closest("#homeBtn")){S.step=0;save();render();window.scrollTo(0,0)}});
function L(a){return a.filter(Boolean).join("<br>")}
var lgOpener=null,lgIsOpen=false;
function renderLegal(){
  var g=LGL[S.lang];
  $("legal").innerHTML=["m","c"].map(function(k){
    var on=lgIsOpen&&lgOpener&&lgOpener.dataset&&lgOpener.dataset.legal===k;
    return '<button type="button" data-legal="'+k+'" aria-haspopup="dialog" aria-controls="lg" aria-expanded="'+(on?"true":"false")+'">'+g[k]+'</button>';
  }).join("");
}
/* Fond inerte pendant que la modale est ouverte : masqué aux lecteurs d'écran (aria-hidden) et non focalisable (inert). */
function setBackground(hidden){
  Array.prototype.forEach.call(document.querySelectorAll(".wrap,#dock,.deco"),function(el){
    if(hidden){el.setAttribute("aria-hidden","true");el.inert=true}else{el.removeAttribute("aria-hidden");el.inert=false}
  });
}
function lgFocusables(){
  return Array.prototype.filter.call($("lg").querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'),function(el){return el.getClientRects().length>0});
}
function openLegal(k,opener){
  var g=LGL[S.lang],items=k==="m"?g.mt:g.ct,b="",d=$("lg");
  items.forEach(function(it){var v=typeof it[1]==="function"?it[1]():esc(it[1]);b+="<h3>"+esc(it[0])+"</h3><p>"+v+"</p>"});
  $("lg-t").textContent=k==="m"?g.m:g.c;$("lg-x").textContent=g.x;$("lg-b").innerHTML=b+'<p class="lg-d">'+esc(g.d)+"</p>";
  lgOpener=opener||document.activeElement;lgIsOpen=true;
  if(lgOpener&&lgOpener.setAttribute)lgOpener.setAttribute("aria-expanded","true");
  d.setAttribute("aria-modal","true");d.setAttribute("aria-hidden","false");
  if(d.showModal){if(!d.open)d.showModal()}else d.setAttribute("open","");
  setBackground(true);document.documentElement.classList.add("modal-open");
  d.querySelector(".lg-in").scrollTop=0;$("lg-x").focus();
}
function afterCloseLegal(){
  if(!lgIsOpen)return;
  lgIsOpen=false;
  var d=$("lg"),op=lgOpener;lgOpener=null;
  d.setAttribute("aria-hidden","true");
  setBackground(false);document.documentElement.classList.remove("modal-open");
  if(op&&op.setAttribute){op.setAttribute("aria-expanded","false");try{op.focus()}catch(e){}}
}
function closeLegal(){var d=$("lg");if(d.close&&d.open)d.close();else d.removeAttribute("open");afterCloseLegal()}
(function(){
  var d=$("lg");
  d.setAttribute("aria-hidden","true");
  d.addEventListener("cancel",function(e){e.preventDefault();closeLegal()});     /* touche Échap */
  d.addEventListener("close",afterCloseLegal);                                  /* fermeture native */
  d.addEventListener("keydown",function(e){
    if(e.key==="Escape"||e.key==="Esc"){e.preventDefault();closeLegal();return}
    if(e.key!=="Tab")return;
    var f=lgFocusables();
    if(!f.length){e.preventDefault();return}
    var first=f[0],last=f[f.length-1],act=document.activeElement;
    if(e.shiftKey&&(act===first||!d.contains(act))){e.preventDefault();last.focus()}
    else if(!e.shiftKey&&(act===last||!d.contains(act))){e.preventDefault();first.focus()}
  });
})();
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-legal]");if(b){openLegal(b.dataset.legal,b);return}
  if(e.target.id==="lg-x"||e.target.id==="lg")closeLegal();
});
function printPack(){
  document.querySelectorAll("#refus details").forEach(function(d){d.open=true});
  document.body.classList.add("print-pack");
  var done=function(){document.body.classList.remove("print-pack");window.removeEventListener("afterprint",done)};
  window.addEventListener("afterprint",done);
  window.print();
}
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-print]"))printPack()});
document.addEventListener("click",function(e){if(e.target.closest&&e.target.closest("[data-pkretry]")){PACK_STATE="idle";render();return}});
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-pdf]");if(!b)return;
  var d=b.closest("details");if(!d)return;
  d.classList.add("pr-one");document.body.classList.add("print-pack","print-one");
  var done=function(){document.body.classList.remove("print-pack","print-one");d.classList.remove("pr-one");window.removeEventListener("afterprint",done)};
  window.addEventListener("afterprint",done);window.print();
});
document.addEventListener("input",function(e){if(e.target.id==="refcase"){S.refus=e.target.value;save()}});
/* Mouvement : décor, apparition au défilement, rejeu à chaque changement d'étape */
(function(){
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;
  document.body.insertAdjacentHTML("afterbegin",'<div class="deco" aria-hidden="true"><i></i><i></i><span class="plane">'+ICONS.plane+'</span></div>');
  if(reduce||!("IntersectionObserver" in window))return;
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}})},{threshold:.08,rootMargin:"0px 0px -4% 0px"});
  var SEL=".needs,#sponsors>*,.tile,.ag-card,.recap,.item,.partner,.book,.nxt li";
  function scan(){document.querySelectorAll(SEL).forEach(function(el){if(el.dataset.rv)return;el.dataset.rv=1;var sib=Array.prototype.indexOf.call(el.parentNode.children,el);el.style.transitionDelay=Math.min(sib,6)*60+"ms";el.classList.add("rv");io.observe(el)})}
  var tm;new MutationObserver(function(){clearTimeout(tm);tm=setTimeout(scan,30)}).observe(document.body,{childList:true,subtree:true});
  var h=document.querySelector("header"),last=document.body.dataset.step;
  new MutationObserver(function(){var n=document.body.dataset.step;if(n!==last){last=n;h.classList.remove("enter");void h.offsetWidth}}).observe(document.body,{attributes:true,attributeFilter:["data-step"]});
  scan();
})();
/* Menu des destinations : taper A, B, E... saute au premier pays qui commence par cette lettre */
var jumpBuf="",jumpTm;
document.addEventListener("keydown",function(e){
  if(!open||e.ctrlKey||e.metaKey||e.altKey||e.key.length!==1)return;
  if(e.key===" "&&!jumpBuf)return;
  var a=document.activeElement;
  if(!a||!(a.id==="destbtn"||(a.closest&&a.closest(".clist"))))return;
  function nz(v){return String(v).normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim()}
  jumpBuf+=e.key;clearTimeout(jumpTm);jumpTm=setTimeout(function(){jumpBuf=""},700);
  var q=nz(jumpBuf);if(!q)return;
  var rows=document.querySelectorAll(".clist .crow");
  for(var i=0;i<rows.length;i++){
    if(nz(rows[i].querySelector(".cn").textContent).indexOf(q)===0){
      rows[i].focus();rows[i].scrollIntoView({block:"nearest"});e.preventDefault();break;
    }
  }
});
["fr","en","ar"].forEach(function(l){$("l-"+l).onclick=function(){S.lang=l;save();render()}});
$("reset").onclick=function(){S.done={};save();render()};
loadPartners();loadReviews();loadDeals();
(function(){var b=document.getElementById("totop");if(!b)return;
  function chk(){b.classList.toggle("on",(window.pageYOffset||document.documentElement.scrollTop)>400)}
  window.addEventListener("scroll",chk,{passive:true});chk();
  b.addEventListener("click",function(){var r=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches;window.scrollTo({top:0,behavior:r?"auto":"smooth"})});
})();
render();
window.__vcCtx=function(){try{var c=curC();return{id:c.id,fr:c.n.fr,name:c.n[S.lang]||c.n.fr,ready:!!c.ready}}catch(e){return null}};
})();
