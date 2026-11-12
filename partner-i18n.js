/* Page « Partenaires » : traduction français / anglais / arabe.
   La langue est celle choisie à l'accueil (enregistrée dans le navigateur par le site) ; à défaut, celle du navigateur.
   Le français est la langue source : chaque texte français sert de clé. Les valeurs envoyées à l'équipe (options, oui/non)
   restent en français : seuls les textes affichés sont traduits. */
(function () {
  "use strict";
  var LANGS = ["fr", "en", "ar"];

  function pick() {
    var l = "";
    try {
      var m = /[?&]lang=(fr|en|ar)\b/.exec(location.search || "");
      if (m) l = m[1];
    } catch (e) {}
    if (!l) {
      try {
        var raw = localStorage.getItem("dossier-schengen-v2");
        var o = raw ? JSON.parse(raw) : null;
        if (o && o.d && LANGS.indexOf(o.d.lang) >= 0) l = o.d.lang;
      } catch (e) {}
    }
    if (!l) {
      try {
        var nav = String((navigator.languages && navigator.languages[0]) || navigator.language || "").slice(0, 2).toLowerCase();
        if (LANGS.indexOf(nav) >= 0) l = nav;
      } catch (e) {}
    }
    return l || "fr";
  }

  var D = {
    en: {
      "Partenaires | CheckMyVisa": "Partners | CheckMyVisa",
      "Devenez partenaire de CheckMyVisa : agences de voyages, hôtels, transport, assurance et services utiles aux voyageurs. Remplissez votre demande en quelques minutes.": "Become a CheckMyVisa partner: travel agencies, hotels, transport, insurance and services useful to travellers. Fill in your request in a few minutes.",
      "Navigation principale": "Main navigation", "Accueil": "Home", "Partenaires": "Partners", "Contact": "Contact", "Confidentialité": "Privacy", "À propos": "About", "Conditions d'utilisation": "Terms of use",
      "Réseau professionnel": "Professional network",
      "Construisons un meilleur parcours voyageur.": "Let's build a better traveller journey.",
      "Nous développons un réseau de professionnels fiables pour aider les voyageurs à préparer leur séjour : agences de voyages, hôtels, transporteurs, assurances et services numériques.": "We are building a network of reliable professionals to help travellers prepare their trip: travel agencies, hotels, carriers, insurers and digital services.",
      "Devenir partenaire": "Become a partner",
      "Vous représentez une entreprise utile aux voyageurs ? Choisissez votre profil, puis remplissez votre demande : elle nous parvient par e-mail et chaque proposition est examinée avant toute publication. Aucun partenariat ni avantage commercial n'est présumé.": "Do you represent a business that is useful to travellers? Choose your profile, then fill in your request: it reaches us by e-mail and every proposal is reviewed before anything is published. No partnership or commercial advantage is assumed.",
      "Les étapes": "The steps", "Choisissez votre profil": "Choose your profile", "Remplissez la demande": "Fill in the request", "Nous vous répondons par e-mail": "We reply by e-mail",
      "Agence de voyages": "Travel agency", "Billets, réservations et accompagnement voyage.": "Tickets, bookings and travel support.",
      "Hôtel et hébergement": "Hotel and accommodation", "Hôtels, résidences, maisons d'hôtes et riads.": "Hotels, residences, guesthouses and riads.",
      "Transport et mobilité": "Transport and mobility", "Transferts aéroport, location de véhicules, chauffeurs.": "Airport transfers, vehicle rental, drivers.",
      "Assurance et services digitaux": "Insurance and digital services", "Assurance voyage, eSIM, transfert d'argent, cartes.": "Travel insurance, eSIM, money transfer, cards.",
      "Autre activité": "Other activity", "Un autre service utile aux voyageurs ? Présentez-le-nous.": "Another service useful to travellers? Tell us about it.",
      "Continuer": "Continue",
      "CheckMyVisa est un service d'information indépendant. Les partenaires restent responsables de leurs prestations, tarifs et conditions.": "CheckMyVisa is an independent information service. Partners remain responsible for their services, prices and conditions.",
      "Demande de partenariat": "Partnership request", "Fermer la fenêtre": "Close the window", "Annuler": "Cancel", "Envoyer ma demande": "Send my request",
      "Tunisie": "Tunisia", "Maroc": "Morocco", "Algérie": "Algeria", "France": "France", "Autre pays": "Other country",
      "Référencement gratuit sur le site": "Free listing on the site", "Bon plan ou réduction pour les voyageurs": "Deal or discount for travellers", "Lien partenaire avec commission": "Partner link with commission", "Autre, à discuter": "Other, to be discussed",
      "Licence ou numéro d'enregistrement": "Licence or registration number", "Registre du commerce, licence d'agence de voyages ou IATA.": "Trade register, travel agency licence or IATA.",
      "Services proposés": "Services offered", "Billets d'avion": "Flight tickets", "Réservations d'hôtel": "Hotel bookings", "Assurance voyage": "Travel insurance", "Accompagnement du dossier de voyage": "Help with the travel file", "Voyages organisés": "Organised tours", "Transferts et location de voiture": "Transfers and car rental",
      "Réservations annulables pour un dossier de visa ?": "Cancellable bookings for a visa file?", "Villes ou pays où vous intervenez": "Cities or countries where you operate",
      "Type d'établissement": "Type of establishment", "Hôtel": "Hotel", "Résidence ou appart-hôtel": "Residence or apart-hotel", "Maison d'hôtes ou riad": "Guesthouse or riad", "Auberge": "Hostel", "Autre": "Other",
      "Classement": "Rating", "Non classé": "Unrated", "1 étoile": "1 star", "2 étoiles": "2 stars", "3 étoiles": "3 stars", "4 étoiles": "4 stars", "5 étoiles": "5 stars",
      "Adresse de l'établissement": "Address of the establishment", "Lien Google Maps ou Booking": "Google Maps or Booking link",
      "Annulation gratuite possible (réservation pour visa) ?": "Free cancellation possible (booking for a visa)?", "Tarif à partir de (par nuit)": "Price from (per night)", "Ex. 120 DT": "E.g. 120 TND",
      "Type de service": "Type of service", "Transferts aéroport": "Airport transfers", "Location de voitures": "Car rental", "Chauffeur privé": "Private driver", "Transport interurbain": "Intercity transport",
      "Villes ou aéroports desservis": "Cities or airports served", "Taille de la flotte": "Fleet size", "Ex. 12 véhicules": "E.g. 12 vehicles",
      "eSIM ou internet voyage": "eSIM or travel internet", "Transfert d'argent": "Money transfer", "Carte bancaire ou paiement voyage": "Bank card or travel payment",
      "Agrément ou licence": "Approval or licence", "Assureur, banque, opérateur ou établissement de paiement agréé.": "Authorised insurer, bank, operator or payment institution.", "Pays couverts": "Countries covered",
      "Votre type d'activité": "Your type of activity",
      "facebook.com/votrepage": "facebook.com/yourpage", "@votrecompte ou lien": "@youraccount or link", "WhatsApp Business ou Telegram": "WhatsApp Business or Telegram", "+216 ... ou @compte": "+216 ... or @account", "Autre lien (YouTube, X, Google Maps...)": "Other link (YouTube, X, Google Maps...)",
      "Nom de l'entreprise": "Company name", "Pays": "Country", "Ville": "City", "Site web": "Website", "https://www.votre-site.com": "https://www.your-site.com", "Si vous en avez un.": "If you have one.",
      "Présentez votre activité": "Describe your business", "Ce que vous proposez, depuis quand, pour quels voyageurs (20 caractères minimum).": "What you offer, since when, for which travellers (20 characters minimum).",
      "Avantage proposé aux voyageurs": "Benefit offered to travellers", "Ex. -10 % avec un code, tarif négocié, service offert": "E.g. 10% off with a code, negotiated rate, free service", "Facultatif.": "Optional.",
      "Type de collaboration souhaité": "Preferred type of collaboration",
      "Nom et prénom": "Full name", "Fonction": "Job title", "E-mail": "E-mail", "Téléphone ou WhatsApp": "Phone or WhatsApp",
      "Votre entreprise": "Your company", "Présence en ligne": "Online presence", "Ajoutez ceux que vous avez : cela accélère la vérification de votre entreprise.": "Add the ones you have: it speeds up the verification of your company.",
      "Votre logo": "Your logo", "Retirer": "Remove", "Aperçu du logo": "Logo preview",
      "PNG, JPG ou WebP, fond transparent de préférence, 5 Mo maximum : le logo est réduit automatiquement (512 px). Le SVG n'est pas accepté ; exportez-le en PNG.": "PNG, JPG or WebP, preferably with a transparent background, 5 MB maximum: the logo is resized automatically (512 px). SVG is not accepted; export it as PNG.",
      "Votre activité": "Your business", "Votre proposition": "Your proposal", "Votre contact": "Your contact details",
      "J'accepte que CheckMyVisa me contacte au sujet de cette demande et, après validation et accord écrit, publie le nom et le logo de mon entreprise.": "I agree that CheckMyVisa may contact me about this request and, after validation and written agreement, publish my company's name and logo.",
      "Ne pas remplir": "Do not fill",
      "Champ obligatoire.": "Required field.", "Adresse de site invalide (ex. https://www.exemple.com).": "Invalid website address (e.g. https://www.example.com).", "Lien ou identifiant invalide.": "Invalid link or username.",
      "Choisissez au moins une option.": "Choose at least one option.", "Adresse invalide.": "Invalid address.", "Décrivez votre activité en 20 caractères au moins.": "Describe your business in at least 20 characters.",
      "Adresse e-mail invalide.": "Invalid e-mail address.", "Numéro invalide (ex. +216 20 000 000).": "Invalid number (e.g. +216 20 000 000).", "Votre accord est nécessaire pour envoyer la demande.": "Your agreement is required to send the request.",
      "Le logo n'est pas prêt, choisissez-le à nouveau.": "The logo is not ready, please choose it again.", "Format non accepté. Utilisez un fichier PNG, JPG ou WebP.": "Format not accepted. Use a PNG, JPG or WebP file.",
      "Fichier trop lourd (5 Mo maximum).": "File too large (5 MB maximum).", "Image illisible. Essayez un autre fichier.": "Unreadable image. Try another file.", "Image illisible.": "Unreadable image.",
      "Logo trop lourd même après réduction. Choisissez une image plus simple.": "Logo still too large after resizing. Choose a simpler image.",
      "Un champ est à corriger.": "One field needs to be corrected.", "{0} champs sont à corriger.": "{0} fields need to be corrected.",
      "Envoi en cours…": "Sending…", "Choisir…": "Choose…", "Oui": "Yes", "Non": "No",
      "Demande envoyée": "Request sent",
      "Merci {0} ! Nous examinons chaque demande et vous répondons à {1}. Aucun partenariat n'est présumé tant que vous n'avez pas reçu notre confirmation écrite.": "Thank you {0}! We review every request and will reply to {1}. No partnership is assumed until you have received our written confirmation.",
      "Fermer": "Close", "Trop de demandes": "Too many requests",
      "Veuillez réessayer dans une heure, ou écrivez-nous à {0}.": "Please try again in an hour, or write to us at {0}.",
      "Dernière étape : envoyez par e-mail": "Last step: send by e-mail",
      "L'envoi automatique n'est pas disponible pour le moment. Votre demande est prête : ouvrez votre messagerie puis envoyez-la à {0}.": "Automatic sending is not available at the moment. Your request is ready: open your mail app and send it to {0}.",
      "L'envoi automatique n'est pas disponible pour le moment. Votre demande est prête : ouvrez votre messagerie, <b>joignez votre logo</b> puis envoyez-la à {0}.": "Automatic sending is not available at the moment. Your request is ready: open your mail app, <b>attach your logo</b> and send it to {0}.",
      "Ouvrir ma messagerie": "Open my mail app", "Copier la demande": "Copy the request", "Texte de la demande": "Request text", "Modifier ma demande": "Edit my request",
      "Demande copiée. Collez-la dans votre e-mail.": "Request copied. Paste it into your e-mail.", "Copie impossible : sélectionnez le texte ci-dessous.": "Copy failed: select the text below."
    },
    ar: {
      "Partenaires | CheckMyVisa": "الشركاء | CheckMyVisa",
      "Devenez partenaire de CheckMyVisa : agences de voyages, hôtels, transport, assurance et services utiles aux voyageurs. Remplissez votre demande en quelques minutes.": "كن شريكًا لـ CheckMyVisa: وكالات السفر والفنادق والنقل والتأمين والخدمات المفيدة للمسافرين. املأ طلبك في دقائق قليلة.",
      "Navigation principale": "التنقل الرئيسي", "Accueil": "الرئيسية", "Partenaires": "الشركاء", "Contact": "اتصل بنا", "Confidentialité": "الخصوصية", "À propos": "من نحن", "Conditions d'utilisation": "شروط الاستخدام",
      "Réseau professionnel": "شبكة مهنية",
      "Construisons un meilleur parcours voyageur.": "لنبنِ معًا رحلة أفضل للمسافر.",
      "Nous développons un réseau de professionnels fiables pour aider les voyageurs à préparer leur séjour : agences de voyages, hôtels, transporteurs, assurances et services numériques.": "نعمل على بناء شبكة من المهنيين الموثوقين لمساعدة المسافرين على التحضير لرحلتهم: وكالات السفر والفنادق وشركات النقل وشركات التأمين والخدمات الرقمية.",
      "Devenir partenaire": "كن شريكًا",
      "Vous représentez une entreprise utile aux voyageurs ? Choisissez votre profil, puis remplissez votre demande : elle nous parvient par e-mail et chaque proposition est examinée avant toute publication. Aucun partenariat ni avantage commercial n'est présumé.": "هل تمثّل شركة مفيدة للمسافرين؟ اختر ملفك ثم املأ طلبك: يصلنا عبر البريد الإلكتروني ويُراجَع كل اقتراح قبل أي نشر. لا نفترض وجود أي شراكة أو امتياز تجاري.",
      "Les étapes": "المراحل", "Choisissez votre profil": "اختر ملفك", "Remplissez la demande": "املأ الطلب", "Nous vous répondons par e-mail": "نردّ عليك بالبريد الإلكتروني",
      "Agence de voyages": "وكالة سفر", "Billets, réservations et accompagnement voyage.": "تذاكر وحجوزات ومرافقة في السفر.",
      "Hôtel et hébergement": "فندق وإقامة", "Hôtels, résidences, maisons d'hôtes et riads.": "فنادق وإقامات ودور ضيافة ورياضات.",
      "Transport et mobilité": "النقل والتنقل", "Transferts aéroport, location de véhicules, chauffeurs.": "التوصيل من المطار وإليه وتأجير السيارات والسائقون.",
      "Assurance et services digitaux": "التأمين والخدمات الرقمية", "Assurance voyage, eSIM, transfert d'argent, cartes.": "تأمين السفر وeSIM وتحويل الأموال والبطاقات.",
      "Autre activité": "نشاط آخر", "Un autre service utile aux voyageurs ? Présentez-le-nous.": "خدمة أخرى مفيدة للمسافرين؟ عرّفنا بها.",
      "Continuer": "متابعة",
      "CheckMyVisa est un service d'information indépendant. Les partenaires restent responsables de leurs prestations, tarifs et conditions.": "CheckMyVisa خدمة معلومات مستقلة. يظل الشركاء مسؤولين عن خدماتهم وأسعارهم وشروطهم.",
      "Demande de partenariat": "طلب شراكة", "Fermer la fenêtre": "إغلاق النافذة", "Annuler": "إلغاء", "Envoyer ma demande": "إرسال طلبي",
      "Tunisie": "تونس", "Maroc": "المغرب", "Algérie": "الجزائر", "France": "فرنسا", "Autre pays": "بلد آخر",
      "Référencement gratuit sur le site": "إدراج مجاني في الموقع", "Bon plan ou réduction pour les voyageurs": "عرض أو تخفيض للمسافرين", "Lien partenaire avec commission": "رابط شريك بعمولة", "Autre, à discuter": "أخرى، قابلة للنقاش",
      "Licence ou numéro d'enregistrement": "الرخصة أو رقم التسجيل", "Registre du commerce, licence d'agence de voyages ou IATA.": "السجل التجاري أو رخصة وكالة السفر أو IATA.",
      "Services proposés": "الخدمات المقدَّمة", "Billets d'avion": "تذاكر الطيران", "Réservations d'hôtel": "حجوزات الفنادق", "Assurance voyage": "تأمين السفر", "Accompagnement du dossier de voyage": "مرافقة ملف السفر", "Voyages organisés": "رحلات منظَّمة", "Transferts et location de voiture": "التوصيل وتأجير السيارات",
      "Réservations annulables pour un dossier de visa ?": "حجوزات قابلة للإلغاء لملف التأشيرة؟", "Villes ou pays où vous intervenez": "المدن أو البلدان التي تعملون فيها",
      "Type d'établissement": "نوع المنشأة", "Hôtel": "فندق", "Résidence ou appart-hôtel": "إقامة أو شقق فندقية", "Maison d'hôtes ou riad": "دار ضيافة أو رياض", "Auberge": "نُزُل", "Autre": "أخرى",
      "Classement": "التصنيف", "Non classé": "غير مصنَّف", "1 étoile": "نجمة واحدة", "2 étoiles": "نجمتان", "3 étoiles": "3 نجوم", "4 étoiles": "4 نجوم", "5 étoiles": "5 نجوم",
      "Adresse de l'établissement": "عنوان المنشأة", "Lien Google Maps ou Booking": "رابط Google Maps أو Booking",
      "Annulation gratuite possible (réservation pour visa) ?": "هل الإلغاء المجاني ممكن (حجز لأجل التأشيرة)؟", "Tarif à partir de (par nuit)": "السعر ابتداءً من (لليلة)", "Ex. 120 DT": "مثال: 120 دينارًا",
      "Type de service": "نوع الخدمة", "Transferts aéroport": "التوصيل من المطار وإليه", "Location de voitures": "تأجير السيارات", "Chauffeur privé": "سائق خاص", "Transport interurbain": "النقل بين المدن",
      "Villes ou aéroports desservis": "المدن أو المطارات المخدومة", "Taille de la flotte": "حجم الأسطول", "Ex. 12 véhicules": "مثال: 12 مركبة",
      "eSIM ou internet voyage": "eSIM أو إنترنت السفر", "Transfert d'argent": "تحويل الأموال", "Carte bancaire ou paiement voyage": "بطاقة مصرفية أو دفع للسفر",
      "Agrément ou licence": "الاعتماد أو الترخيص", "Assureur, banque, opérateur ou établissement de paiement agréé.": "شركة تأمين أو مصرف أو مشغِّل أو مؤسسة دفع معتمدة.", "Pays couverts": "البلدان المشمولة",
      "Votre type d'activité": "نوع نشاطك",
      "facebook.com/votrepage": "facebook.com/yourpage", "@votrecompte ou lien": "@حسابك أو رابط", "WhatsApp Business ou Telegram": "WhatsApp Business أو Telegram", "+216 ... ou @compte": "+216 ... أو @الحساب", "Autre lien (YouTube, X, Google Maps...)": "رابط آخر (YouTube وX وGoogle Maps...)",
      "Nom de l'entreprise": "اسم الشركة", "Pays": "البلد", "Ville": "المدينة", "Site web": "الموقع الإلكتروني", "https://www.votre-site.com": "https://www.your-site.com", "Si vous en avez un.": "إن وُجد.",
      "Présentez votre activité": "عرِّف بنشاطك", "Ce que vous proposez, depuis quand, pour quels voyageurs (20 caractères minimum).": "ما تقدّمه، ومنذ متى، ولأي مسافرين (20 حرفًا على الأقل).",
      "Avantage proposé aux voyageurs": "الميزة المعروضة للمسافرين", "Ex. -10 % avec un code, tarif négocié, service offert": "مثال: خصم 10٪ برمز، سعر تفاوضي، خدمة مجانية", "Facultatif.": "اختياري.",
      "Type de collaboration souhaité": "نوع التعاون المرغوب",
      "Nom et prénom": "الاسم الكامل", "Fonction": "الوظيفة", "E-mail": "البريد الإلكتروني", "Téléphone ou WhatsApp": "الهاتف أو واتساب",
      "Votre entreprise": "شركتك", "Présence en ligne": "الحضور على الإنترنت", "Ajoutez ceux que vous avez : cela accélère la vérification de votre entreprise.": "أضف ما لديك: ذلك يسرّع التحقق من شركتك.",
      "Votre logo": "شعارك", "Retirer": "إزالة", "Aperçu du logo": "معاينة الشعار",
      "PNG, JPG ou WebP, fond transparent de préférence, 5 Mo maximum : le logo est réduit automatiquement (512 px). Le SVG n'est pas accepté ; exportez-le en PNG.": "PNG أو JPG أو WebP، يُفضَّل بخلفية شفافة، 5 ميغابايت كحد أقصى: يُصغَّر الشعار تلقائيًا (512 بكسل). لا يُقبل SVG؛ صدِّره بصيغة PNG.",
      "Votre activité": "نشاطك", "Votre proposition": "اقتراحك", "Votre contact": "بيانات الاتصال",
      "J'accepte que CheckMyVisa me contacte au sujet de cette demande et, après validation et accord écrit, publie le nom et le logo de mon entreprise.": "أوافق على أن تتصل بي CheckMyVisa بخصوص هذا الطلب، وبعد المراجعة والموافقة الكتابية أن تنشر اسم شركتي وشعارها.",
      "Ne pas remplir": "لا تملأ",
      "Champ obligatoire.": "حقل إلزامي.", "Adresse de site invalide (ex. https://www.exemple.com).": "عنوان موقع غير صالح (مثال: https://www.example.com).", "Lien ou identifiant invalide.": "رابط أو معرّف غير صالح.",
      "Choisissez au moins une option.": "اختر خيارًا واحدًا على الأقل.", "Adresse invalide.": "عنوان غير صالح.", "Décrivez votre activité en 20 caractères au moins.": "صِف نشاطك في 20 حرفًا على الأقل.",
      "Adresse e-mail invalide.": "عنوان بريد إلكتروني غير صالح.", "Numéro invalide (ex. +216 20 000 000).": "رقم غير صالح (مثال: +216 20 000 000).", "Votre accord est nécessaire pour envoyer la demande.": "موافقتك ضرورية لإرسال الطلب.",
      "Le logo n'est pas prêt, choisissez-le à nouveau.": "الشعار غير جاهز، يرجى اختياره من جديد.", "Format non accepté. Utilisez un fichier PNG, JPG ou WebP.": "صيغة غير مقبولة. استخدم ملف PNG أو JPG أو WebP.",
      "Fichier trop lourd (5 Mo maximum).": "الملف كبير جدًا (5 ميغابايت كحد أقصى).", "Image illisible. Essayez un autre fichier.": "الصورة غير قابلة للقراءة. جرّب ملفًا آخر.", "Image illisible.": "الصورة غير قابلة للقراءة.",
      "Logo trop lourd même après réduction. Choisissez une image plus simple.": "الشعار ما زال كبيرًا بعد التصغير. اختر صورة أبسط.",
      "Un champ est à corriger.": "هناك حقل واحد يحتاج إلى تصحيح.", "{0} champs sont à corriger.": "هناك {0} حقول تحتاج إلى تصحيح.",
      "Envoi en cours…": "جارٍ الإرسال…", "Choisir…": "اختر…", "Oui": "نعم", "Non": "لا",
      "Demande envoyée": "تم إرسال الطلب",
      "Merci {0} ! Nous examinons chaque demande et vous répondons à {1}. Aucun partenariat n'est présumé tant que vous n'avez pas reçu notre confirmation écrite.": "شكرًا {0}! نراجع كل طلب وسنردّ عليك على {1}. لا نفترض وجود أي شراكة ما لم تتلقَّ تأكيدنا الكتابي.",
      "Fermer": "إغلاق", "Trop de demandes": "طلبات كثيرة جدًا",
      "Veuillez réessayer dans une heure, ou écrivez-nous à {0}.": "يرجى المحاولة بعد ساعة، أو راسلنا على {0}.",
      "Dernière étape : envoyez par e-mail": "الخطوة الأخيرة: أرسل الطلب بالبريد الإلكتروني",
      "L'envoi automatique n'est pas disponible pour le moment. Votre demande est prête : ouvrez votre messagerie puis envoyez-la à {0}.": "الإرسال التلقائي غير متاح حاليًا. طلبك جاهز: افتح بريدك الإلكتروني ثم أرسله إلى {0}.",
      "L'envoi automatique n'est pas disponible pour le moment. Votre demande est prête : ouvrez votre messagerie, <b>joignez votre logo</b> puis envoyez-la à {0}.": "الإرسال التلقائي غير متاح حاليًا. طلبك جاهز: افتح بريدك الإلكتروني و<b>أرفِق شعارك</b> ثم أرسله إلى {0}.",
      "Ouvrir ma messagerie": "افتح بريدي الإلكتروني", "Copier la demande": "انسخ الطلب", "Texte de la demande": "نص الطلب", "Modifier ma demande": "تعديل طلبي",
      "Demande copiée. Collez-la dans votre e-mail.": "تم نسخ الطلب. الصقه في رسالتك الإلكترونية.", "Copie impossible : sélectionnez le texte ci-dessous.": "تعذّر النسخ: حدّد النص أدناه."
    }
  };

  var lang = pick();
  var dict = D[lang] || null;

  function t(s) { if (!dict || s == null) return s; var k = String(s); return Object.prototype.hasOwnProperty.call(dict, k) ? dict[k] : s; }
  /* Texte à trous : {0}, {1}… sont remplacés (les valeurs sont déjà échappées par l'appelant). */
  function f(s, args) {
    var out = t(s);
    for (var i = 0; i < (args || []).length; i++) out = out.split("{" + i + "}").join(args[i]);
    return out;
  }
  /* Traduit une phrase, ou chacune de ses parties séparées par « · » (ex. « Votre activité · Agence de voyages »). */
  function tp(s) {
    if (!dict) return s;
    var k = String(s).trim();
    if (!k) return s;
    if (Object.prototype.hasOwnProperty.call(dict, k)) return dict[k];
    if (k.indexOf(" · ") > 0) return k.split(" · ").map(function (x) { return t(x); }).join(" · ");
    return s;
  }
  function keepSpaces(orig, tr) {
    var a = /^\s*/.exec(orig)[0], b = /\s*$/.exec(orig)[0];
    return a + tr + b;
  }

  var ATTRS = ["placeholder", "aria-label", "alt", "title", "content"];
  function apply(root) {
    if (!dict) return;
    root = root || document.body;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n, nodes = [];
    while ((n = w.nextNode())) {
      var p = n.parentNode && n.parentNode.nodeName;
      if (p === "SCRIPT" || p === "STYLE") continue;
      nodes.push(n);
    }
    nodes.forEach(function (x) {
      var v = x.nodeValue, tr = tp(v);
      if (tr !== v && String(v).trim()) x.nodeValue = keepSpaces(v, String(tr).trim());
    });
    var els = root.querySelectorAll ? root.querySelectorAll("*") : [];
    Array.prototype.forEach.call(els, function (el) {
      ATTRS.forEach(function (a) {
        if (a === "content" && el.nodeName !== "META") return;
        if (!el.hasAttribute(a)) return;
        if (el.nodeName === "META" && el.getAttribute("name") !== "description") return;
        var v = el.getAttribute(a), tr = tp(v);
        if (tr !== v) el.setAttribute(a, tr);
      });
    });
  }

  function init() {
    document.documentElement.setAttribute("lang", lang);
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    if (!dict) return;
    document.title = t(document.title);
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t(meta.getAttribute("content")));
    apply(document.body);
  }

  window.PF = { lang: lang, dir: lang === "ar" ? "rtl" : "ltr", t: t, f: f, tp: tp, apply: apply, init: init };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
