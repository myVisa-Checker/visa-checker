# Visa Checker — plan de monétisation et conformité publicitaire

Document de travail interne — branche `amelioration`
Dernière révision : 9 novembre 2026

## Objectif

Préparer Visa Checker à une éventuelle demande Google AdSense sans sacrifier la confiance des voyageurs, et bâtir des revenus complémentaires cohérents avec le positionnement retenu : un service destiné aux voyageurs individuels, centré sur la préparation et la vérification de documents de voyage/visa. Visa Checker n'est ni une administration, ni un consulat, ni un centre de dépôt, ni une agence qui vend des voyages.

Aucune modification de ce document ne garantit l'acceptation par AdSense. Seul Google décide après examen du site et du compte.

## 1. État observé dans le dépôt au 09/11/2026

- Pages déjà présentes : accueil, guides, À propos, Contact, confidentialité et conditions d'utilisation.
- Un guide éditorial principal est actuellement référencé dans le sitemap.
- La politique de confidentialité décrit déjà Google AdSense, les cookies publicitaires et un consentement pour les visiteurs de l'EEE, du Royaume-Uni et de la Suisse.
- La recherche dans les fichiers de la branche n'a pas trouvé de CMP publicitaire intégrée, de balise AdSense ni de fichier `ads.txt`.
- La politique affirme donc qu'un message de consentement est présenté, alors qu'aucune implémentation correspondante n'a été identifiée dans le code inspecté. Cette affirmation doit être corrigée ou l'interface de consentement doit être réellement déployée avant toute diffusion publicitaire.
- Les métadonnées, certains textes et le contenu éditorial restent centrés sur la Tunisie/France et des prestations d'agences, alors que le positionnement produit retenu est celui d'un service pour particuliers, multi-origines et multi-destinations.
- Des blocs de réservation, partenaires/agences et demandes de réservation subsistent dans l'application. Ils doivent être réévalués et retirés ou remplacés s'ils ne correspondent plus à l'offre individuelle de Visa Checker.

Cet état est une inspection statique des fichiers, pas un audit juridique, un test navigateur complet ni une décision Google.

## 2. Conditions de préparation AdSense

### Contenu et qualité

1. Développer des guides originaux, utiles et substantiels, rédigés et relus par l'équipe Visa Checker.
2. Pour chaque guide : préciser le pays de résidence/origine, la destination, le type de visa, la date de vérification, les limites du guide et les liens directs vers les sources officielles.
3. Ne pas publier comme « disponible » une checklist dont les exigences, formulaires, frais et prestataires n'ont pas été vérifiés.
4. Ajouter des pages de contenu utiles : étapes de demande, préparation des justificatifs, erreurs fréquentes, explication des procédures et glossaire. Éviter les pages quasi identiques générées en série.
5. Ne pas inventer un nombre minimum d'articles ou un seuil de trafic : la documentation Google consultée insiste sur la qualité et l'originalité, sans fixer de quota universel d'articles dans les critères cités.

### Transparence et identité

1. Indiquer clairement l'éditeur, un moyen de contact fonctionnel et la mission du service.
2. Répéter sans ambiguïté que Visa Checker est indépendant et n'a aucun pouvoir sur les décisions consulaires.
3. Ne jamais utiliser de logo, nom ou présentation laissant croire à une affiliation officielle avec une ambassade, un gouvernement, France-Visas ou un centre de dépôt.
4. Séparer clairement les contenus éditoriaux, les annonces, les liens affiliés et les services payants.
5. Divulguer les commissions d'affiliation à proximité des liens concernés.

### Pages et navigation

- Conserver et maintenir : À propos, Contact, Confidentialité, Conditions d'utilisation et Guides.
- Ajouter une vraie page « Politique des cookies / gérer mes préférences » si elle est nécessaire au fonctionnement retenu, ou intégrer cette fonction clairement à la politique de confidentialité.
- Vérifier que tous les liens du menu et du pied de page fonctionnent dans les trois langues.
- Éliminer les pages vides, les liens provisoires, les offres « bientôt » qui ressemblent à des services déjà disponibles et les boutons trompeurs.

### Consentement et confidentialité

1. Avant d'activer les annonces, choisir et configurer une CMP adaptée au trafic international.
2. Pour les annonces personnalisées destinées aux visiteurs de l'EEE, du Royaume-Uni et de la Suisse, Google exige une CMP certifiée par Google et intégrée au TCF de l'IAB. En 2026, les nouvelles chaînes de consentement TCF doivent respecter la version TCF 2.3.
3. Ne pas charger les balises publicitaires avant que les signaux de consentement requis soient disponibles, notamment lorsque le consentement à l'accès/stockage sur l'appareil n'a pas été donné.
4. Permettre aux visiteurs de revoir ou retirer leurs choix de consentement.
5. Mettre à jour la politique de confidentialité pour décrire exactement les fournisseurs, cookies, finalités, transferts et mécanismes réellement utilisés. Ne jamais affirmer qu'une CMP ou un bandeau fonctionne s'il n'est pas installé et testé.

Option de départ à étudier : la CMP de Google dans AdSense « Confidentialité et messages », ou une autre CMP présente dans la liste Google des CMP certifiées. Le choix final doit être vérifié au moment de l'intégration.

### Mise en place technique AdSense — seulement après accord et obtention des identifiants

- Confirmer le domaine final, son contrôle et son fonctionnement HTTPS.
- Ajouter le site dans AdSense et effectuer la vérification de propriété avec la méthode proposée par Google.
- Attendre le statut « Ready » avant de servir des annonces.
- Ajouter le vrai fichier `ads.txt` à la racine avec l'identifiant éditeur exact fourni par AdSense. Ne jamais publier un identifiant fictif ou un exemple.
- Charger le script publicitaire uniquement sur les pages et dans les conditions autorisées.
- Vérifier les annonces sur mobile, ordinateur, français, anglais et arabe, y compris le comportement RTL.

## 3. Où afficher les annonces — et où les éviter

### Emplacements à privilégier

- Articles et guides éditoriaux originaux.
- Pages explicatives qui contiennent suffisamment de contenu informatif.
- Emplacements discrets après une section de guide ou en fin d'article.

### Emplacements à éviter dans notre produit

- Assistant IA et conversations privées.
- Téléversement ou analyse d'une lettre de refus.
- Écrans de paiement, de code d'accès ou de confirmation.
- Étapes interactives de la checklist où une annonce pourrait être confondue avec une action ou un document.
- Toute zone où l'annonce gênerait la lecture, provoquerait un clic accidentel ou ressemblerait à un bouton.

Les règles Google interdisent notamment les clics artificiels, les incitations à cliquer, les placements trompeurs et les annonces sur des pages non adaptées au contenu publicitaire. Ne jamais demander aux visiteurs de cliquer sur les annonces pour soutenir le projet.

## 4. Modèle de revenus recommandé

Priorité aux revenus directement liés à la valeur fournie aux particuliers :

### A. Audit de dossier premium — priorité haute

Un voyageur paie pour une vérification approfondie de cohérence et de complétude de son dossier, avec une liste des points à corriger. Le service doit préciser son périmètre, son délai et ses limites. Ne pas promettre l'obtention du visa et ne pas se présenter comme un conseil juridique si le service n'est pas fourni par un professionnel habilité.

### B. Pack de préparation après refus — priorité haute

Vendre un pack clairement décrit : explication structurée des motifs de refus, liste des éléments à examiner, modèles de lettres et aide à la préparation d'un nouveau dossier. Signaler que les voies et délais de recours doivent être confirmés sur la notification et auprès des autorités compétentes.

### C. Entraînement à l'entretien — priorité moyenne/haute

Simulation d'entretien, questions adaptées au motif du voyage et retour pédagogique. Paiement à la session ou par forfait de sessions.

### D. Alertes de rendez-vous — priorité moyenne

Abonnement facultatif pour être averti lorsqu'une disponibilité est détectée, si les sources et méthodes de collecte sont autorisées. Ne jamais vendre un rendez-vous, contourner les protections des centres, promettre une place ou prétendre avoir un accès privilégié.

### E. Affiliation utile — priorité moyenne

Liens vers des prestataires réellement pertinents pour le dossier : assurance voyage, traduction assermentée, photographie conforme, éventuellement services de transport/hébergement uniquement si cela reste cohérent avec le besoin du voyageur. Chaque lien rémunéré doit être signalé clairement. Comparer les offres sur des critères objectifs et ne pas laisser la commission dicter les recommandations.

### F. Guides et modèles téléchargeables — priorité complémentaire

Guides approfondis, listes imprimables et modèles personnalisables. Les ressources gratuites doivent rester utiles ; ne pas transformer chaque information essentielle en contenu payant.

### G. Sponsoring clairement identifié — priorité complémentaire

Partenariats avec des prestataires fiables, présentés comme « sponsorisés ». Les partenaires ne doivent pas pouvoir acheter une meilleure position dans les conseils officiels ou modifier les conclusions d'une checklist.

## 5. Ordre de priorité

1. Corriger le décalage entre le positionnement individuel et les anciens blocs agences/réservations.
2. Corriger les textes de confidentialité qui décrivent un consentement publicitaire non encore identifié dans le code.
3. Enrichir les contenus éditoriaux originaux et les sources officielles.
4. Vérifier le domaine final, les pages, le sitemap, les liens et les performances.
5. Choisir et intégrer une CMP certifiée adaptée au trafic EEE/Royaume-Uni/Suisse.
6. Préparer AdSense, vérifier la propriété du site et demander l'examen.
7. N'ajouter les balises publicitaires et le fichier ads.txt qu'avec les identifiants réels et après les étapes AdSense nécessaires.
8. Développer en parallèle l'audit premium, le pack après refus et l'entraînement à l'entretien : ils ne dépendent pas de l'approbation AdSense.

## 6. Références officielles Google consultées

- Critères d'éligibilité AdSense : https://support.google.com/adsense/answer/9724
- Propriété du site pour AdSense : https://support.google.com/adsense/answer/91205
- Gestion et examen des sites AdSense : https://support.google.com/adsense/answer/12131223
- Règlement du programme AdSense : https://support.google.com/adsense/answer/48182
- Divulgations de confidentialité des éditeurs : https://support.google.com/publisherpolicies/answer/10437794
- CMP certifiées pour l'EEE, le Royaume-Uni et la Suisse : https://support.google.com/adsense/answer/13554116
- Intégration IAB TCF 2.3 : https://support.google.com/adsense/answer/9804260
- Guide ads.txt : https://support.google.com/adsense/answer/12171612

Les politiques peuvent évoluer. Revalider ces références au moment de la demande AdSense et avant chaque changement important de configuration.
