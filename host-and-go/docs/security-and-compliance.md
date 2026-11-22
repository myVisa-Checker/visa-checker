# Sécurité, conformité et gouvernance

## 1. Modèle de menace

Menaces principales :
- accès horizontal non autorisé à un profil ou une offre ;
- usurpation d'identité ;
- création d'offres trompeuses ;
- manipulation de statuts côté navigateur ;
- partage prématuré de coordonnées ;
- contournement de la modération ;
- falsification d'acceptations ;
- rejeu de requêtes ;
- abus automatisé ;
- fuite de données personnelles ;
- comptes hôtes ou voyageurs malveillants ;
- règles réglementaires obsolètes ou mal interprétées.

## 2. Contrôle d'accès

Chaque opération doit vérifier :
1. l'identité de l'utilisateur ;
2. son rôle ;
3. son autorisation sur la ressource ;
4. l'état actuel de la ressource ;
5. les préconditions métier.

Ne jamais se fier à un identifiant fourni par le client pour prouver
la propriété d'un objet.

Protéger explicitement contre les vulnérabilités IDOR/BOLA.

## 3. Authentification

Exigences de conception :
- hachage de mot de passe avec Argon2id ;
- sessions avec jetons opaques et aléatoires ;
- stockage du hash du jeton de session ;
- cookies `Secure`, `HttpOnly` et `SameSite` appropriés ;
- protection CSRF ;
- vérification de l'adresse email ;
- réinitialisation de mot de passe avec jeton à usage unique ;
- limitation des tentatives ;
- rotation et révocation des sessions ;
- MFA obligatoire pour les comptes administrateurs.

Les secrets ne doivent jamais être stockés dans le dépôt.

## 4. Validation des entrées

Toutes les données entrantes doivent être validées côté serveur.

Appliquer :
- schémas stricts ;
- limites de taille ;
- listes de valeurs autorisées ;
- normalisation ;
- encodage de sortie ;
- requêtes SQL paramétrées ;
- limitation de débit ;
- contrôle des fichiers si des uploads sont ajoutés ultérieurement.

Ne jamais accepter directement un statut métier fourni par le client.

## 5. Conformité par pays

Chaque règle doit documenter :
- pays concerné ;
- nationalité concernée ;
- résidence ;
- durée ;
- activité exacte ;
- rémunération ;
- avantages en nature ;
- hébergement ;
- repas ;
- autorisation éventuelle ;
- source officielle ;
- date de consultation ;
- date de dernière vérification ;
- date d'expiration ;
- périmètre de validité ;
- responsable de la vérification.

États de pays :
- `RESEARCH`
- `VERIFIED`
- `RESTRICTED`
- `EXPIRED`

Décisions du moteur :
- `CLEARED`
- `BLOCKED`
- `HUMAN_REVIEW`

Si une source manque, est périmée, contradictoire ou ne couvre pas
l'activité exacte, le système doit bloquer ou demander une revue humaine.

Aucune règle ne doit être inventée pour transformer un pays en pays vérifié.

## 6. Activité et droit au travail

Le terme « bénévolat » ou « échange culturel » ne garantit pas qu'une
activité soit autorisée par le droit local ou le statut migratoire
du voyageur.

L'évaluation doit tenir compte de la réalité de l'activité et des
avantages reçus, et non seulement de son intitulé marketing.

En cas d'ambiguïté, appliquer `HUMAN_REVIEW`.

## 7. Partage des coordonnées

Les coordonnées restent privées jusqu'à ce que :
- les deux parties aient accepté les mêmes conditions versionnées ;
- les deux consentements soient explicites ;
- la conformité soit valide ;
- la modération soit approuvée ;
- les comptes et l'offre ne soient pas suspendus ou bloqués.

La décision est calculée côté serveur et journalisée.

## 8. Confidentialité

Collecter le minimum nécessaire.

Ne pas collecter de passeport pendant la découverte.

Séparer les données de profil public des données privées.

Restreindre l'accès aux données personnelles selon le rôle et le besoin.

Définir une politique de conservation et de suppression avant lancement.

## 9. Modération

Fonctions obligatoires :
- signalement d'un utilisateur ;
- signalement d'une offre ;
- blocage ;
- suspension ;
- examen humain ;
- motif de décision ;
- historique des actions ;
- procédure de recours à définir.

## 10. Audit

Chaque action sensible doit produire un événement d'audit :
- acteur ;
- action ;
- objet ;
- état précédent ;
- nouvel état ;
- horodatage ;
- motif ;
- contexte technique pertinent.

Les événements d'audit ne doivent pas être modifiables par les utilisateurs
ordinaires.

## 11. Notifications

Les notifications ne doivent jamais déclencher seules une transition métier.

Une erreur d'envoi ne doit pas annuler une acceptation déjà enregistrée.

## 12. Conditions de lancement

Ne pas lancer un pays tant que ses règles applicables n'ont pas été
vérifiées avec des sources officielles pertinentes.

Ne pas présenter le service comme une garantie de visa, de travail,
d'entrée ou de séjour.
