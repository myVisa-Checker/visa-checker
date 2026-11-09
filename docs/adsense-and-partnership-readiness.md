# AdSense et partenariats — préparation au lancement

Dernière mise à jour : 9 novembre 2026  
Branche de travail : `amelioration`

Ce document est un plan de préparation. Il ne constitue ni une approbation Google, ni une validation juridique, ni la preuve qu'un partenaire a signé un accord.

## 1. Google AdSense — état et règles de mise en œuvre

### État actuel
- Google AdSense n'est pas activé.
- Aucun script publicitaire, identifiant éditeur, bloc d'annonce ou fichier `ads.txt` ne doit être ajouté tant que le compte éditeur et son identifiant ne sont pas disponibles.
- Le site utilise le domaine canonique `https://checkmyvisa.org/`. La propriété et la configuration DNS/HTTPS doivent être vérifiées dans les outils du domaine avant la candidature.
- Les pages Confidentialité et Conditions indiquent que la publicité n'est pas active et décrivent le principe d'une activation ultérieure avec consentement approprié.

### Pré-requis avant candidature
1. Publier plusieurs guides réellement originaux, rédigés et relus par un humain, apportant des réponses concrètes et actualisées. Éviter les pages minces, répétitives ou produites en masse.
2. Ajouter sur chaque guide : auteur ou responsable éditorial identifiable, date de publication et de mise à jour, sources officielles pertinentes, limites de l'information et lien de correction.
3. Renforcer la navigation : accès évident à Accueil, Guides, Planner, À propos, Contact, Confidentialité et Conditions.
4. Vérifier que toutes les pages publiques sont accessibles, utiles, cohérentes, sans liens cassés, contenu de démonstration, partenaires fictifs ou fonctionnalités annoncées comme actives alors qu'elles sont désactivées.
5. Confirmer l'identité de l'éditeur, ses coordonnées professionnelles et la maîtrise du domaine.
6. Vérifier la politique de confidentialité après choix du compte AdSense, des formats publicitaires, des prestataires de mesure et de la CMP.
7. Pour les visiteurs de l'EEE, du Royaume-Uni et de la Suisse, utiliser une CMP certifiée par Google et intégrée au TCF de l'IAB lorsque des annonces personnalisées sont servies.
8. Soumettre le site dans AdSense et attendre le statut « Ready » avant d'afficher la moindre annonce.

### Politique de placement
- Pas d'annonces dans les formulaires, les étapes de checklist, les zones de décision ou à proximité de boutons pouvant être confondus avec une publicité.
- Pas de publicité qui masque le contenu ou perturbe l'usage mobile.
- Les annonces doivent être clairement distinctes du contenu éditorial.
- Ne jamais cliquer sur ses propres annonces, demander des clics, ni inciter artificiellement les visiteurs à cliquer.
- Commencer avec un petit nombre d'emplacements, puis mesurer l'expérience utilisateur.

### Fichier ads.txt
Créer `/ads.txt` uniquement après réception de la ligne personnalisée fournie dans le compte AdSense. Ne jamais inventer un identifiant éditeur ni publier un exemple `pub-000...`. Après publication, vérifier que `https://checkmyvisa.org/ads.txt` répond en HTTP 200 et que Google peut l'explorer.

## 2. Plan éditorial nécessaire avant AdSense

Le répertoire Guides est encore trop limité pour considérer le site prêt à une candidature. Développer progressivement, sans contenu générique dupliqué, des guides comme :
- comprendre les étapes d'une demande de visa Schengen et les rôles des différents intervenants ;
- préparer les justificatifs financiers selon le profil, avec sources officielles et limites ;
- assurance voyage : garanties, exclusions et critères de vérification ;
- traductions, légalisation et formats de documents selon les autorités concernées ;
- préparer un rendez-vous sans acheter de créneau ni passer par un intermédiaire non autorisé ;
- organiser un dossier étudiant, salarié, indépendant ou retraité ;
- comprendre les motifs fréquents de refus sans promettre une issue favorable ;
- organiser son calendrier de préparation avec le Visa Journey Planner.

Chaque guide doit préciser le pays, le type de visa, le public concerné, la date de vérification et les sources officielles. Ne pas publier un guide si les sources ne permettent pas de confirmer les informations.

## 3. Partenariats — modèle commercial

### Catégories prioritaires
1. Assurances voyage autorisées et adaptées aux destinations.
2. Traducteurs professionnels / assermentés selon les exigences locales.
3. Services photo, impression et numérisation.
4. eSIM et télécommunications.
5. Transport, hébergement et location de véhicules.
6. Professionnels qualifiés du droit ou de l'immigration, uniquement dans leur champ d'autorisation.

### Modèles possibles
- lien affilié : commission éventuelle sur une vente, avec divulgation à proximité du lien ;
- mise en relation : prospect transmis uniquement après information claire et accord approprié ;
- partenariat B2B direct : conditions, responsabilités, territoire, rémunération, données et résiliation définis par écrit.

### Contrôle obligatoire avant publication
- identité juridique et coordonnées vérifiables ;
- existence de l'entreprise et zones réellement desservies ;
- autorisations, agréments ou qualifications requis ;
- prix, conditions, exclusions, remboursements et réclamations ;
- politique de confidentialité et sécurité des données ;
- absence de promesse de visa, de faux documents, de fausses réservations ou de revente de rendez-vous ;
- contrat ou accord écrit et déclaration de tout intérêt commercial.

Aucune fiche partenaire ni transmission de données ne doit être activée avant validation. Le fichier `partners.json` reste vide tant qu'aucun partenaire n'a franchi cette procédure.

## 4. Séquence de lancement

- [ ] Valider l'identité éditoriale et les informations légales de l'éditeur.
- [ ] Développer et relire les guides originaux.
- [ ] Vérifier domaine, HTTPS, navigation, liens et pages légales.
- [ ] Choisir une CMP adaptée au trafic et confirmer sa certification Google/TCF si nécessaire.
- [ ] Créer le compte AdSense et ajouter le site pour examen.
- [ ] Attendre le statut « Ready ».
- [ ] Ajouter la ligne ads.txt personnalisée et vérifier son accessibilité.
- [ ] Installer le code publicitaire uniquement après validation.
- [ ] Sélectionner les premiers partenaires, contrôler leurs documents et signer les accords.
- [ ] Publier les fiches partenaires et liens commerciaux avec divulgation claire.
- [ ] Réactiver les formulaires de mise en relation seulement après validation juridique et technique du traitement des données.

## 5. Sources officielles à reconsulter avant activation
- AdSense — critères d'éligibilité : https://support.google.com/adsense/answer/9724
- AdSense — préparation des pages : https://support.google.com/adsense/answer/7299563
- AdSense — contenu requis dans la politique de confidentialité : https://support.google.com/adsense/answer/1348695
- Google — exigences CMP pour les éditeurs EEE/Royaume-Uni/Suisse : https://support.google.com/adsense/answer/13554116
- AdSense — guide ads.txt : https://support.google.com/adsense/answer/12171612
- AdSense — gestion et examen des sites : https://support.google.com/adsense/answer/12131223

Les règles et exigences peuvent évoluer. Revalider les pages officielles avant toute soumission.
