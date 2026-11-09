# Architecture — suivi des rendez-vous visa

Statut : conception validée, service non activé. Ce document définit les conditions techniques et éditoriales avant toute promesse d'alerte.

## 1. Règle produit

Visa Checker peut aider un voyageur à suivre l'ouverture de créneaux uniquement lorsqu'une source autorisée et suffisamment fiable existe pour le pays et le prestataire concernés. Le site ne doit jamais présenter une estimation, une ancienne donnée ou une erreur technique comme une disponibilité réelle.

Aujourd'hui, `rdv.json` contient des valeurs `null` : aucun délai ni créneau en temps réel n'est disponible. Le calendrier existant est un outil de planification personnelle, pas un système de surveillance.

## 2. Architecture cible

1. **Registre des sources** — une entrée par pays et prestataire : organisme, URL officielle, méthode d'accès autorisée, fréquence permise, fuseau horaire, date de validation et responsable de la vérification.
2. **Adaptateurs de source** — un adaptateur isolé par API officielle, flux public ou intégration contractuellement autorisée. Pas de contournement de CAPTCHA, de file d'attente, de connexion, de limite d'accès ou de mesure anti-robot. Pas de scraping si les conditions du fournisseur ne l'autorisent pas.
3. **Planificateur serveur** — déclenchement Cloudflare Cron selon la fréquence autorisée par chaque source. Les erreurs et les réponses ambiguës deviennent un état inconnu, jamais « aucun créneau ».
4. **Normalisation** — convertir les réponses en un format interne commun, avec horodatage UTC, source, pays, prestataire, type de rendez-vous et niveau de confiance.
5. **Déduplication** — ne notifier qu'un changement réellement confirmé et nouveau. Une même disponibilité ne doit pas déclencher des alertes répétées.
6. **Abonnements** — stockage serveur des abonnements après confirmation de l'adresse e-mail. Consentement explicite, désinscription simple, suppression et durée de conservation définie.
7. **Notifications** — fournisseur e-mail transactionnel choisi et configuré séparément. Les notifications indiquent la source et l'heure de vérification, et invitent l'utilisateur à confirmer le créneau sur le portail officiel.

## 3. Contrat de données normalisé

Chaque observation doit contenir au minimum :

- `countryCode`, `providerId`, `appointmentType`
- `status` : `available`, `unavailable`, `unknown`, `source_error`
- `observedAt` : horodatage UTC
- `sourceUrl` et `sourceMethod`
- `validUntil` ou une règle explicite de fraîcheur
- `evidenceId` interne permettant l'audit et la déduplication

Une observation expirée devient `unknown`. Une erreur réseau, un changement de page ou une réponse non comprise ne doit jamais être interprété comme une absence de créneau.

## 4. Modèle minimal des abonnements

- Identifiant aléatoire non prédictible
- Adresse e-mail vérifiée
- Pays, prestataire et type de rendez-vous suivis
- Date de consentement, langue, état actif/désinscrit
- Date de dernière notification et clé de déduplication

Ne jamais demander ni stocker le numéro de passeport, les identifiants du compte consulaire, les documents de voyage ou les données de paiement pour cette fonction. Protéger les adresses e-mail, limiter les tentatives, appliquer une vérification anti-abus et définir une politique de suppression.

## 5. États visibles dans l'interface

- **Surveillance disponible** : source autorisée et contrôle récent opérationnels ; l'utilisateur peut créer une alerte.
- **Source indisponible** : aucune intégration validée ; lien vers le portail officiel uniquement.
- **Données anciennes** : dernière observation trop ancienne ; aucune affirmation de disponibilité.
- **Vérification en cours / erreur** : état technique inconnu ; ne pas envoyer de notification de disponibilité.

Une alerte n'est jamais une réservation. Le voyageur doit ouvrir le portail officiel, vérifier le créneau et réserver lui-même. Aucune garantie de rendez-vous ne doit être promise.

## 6. Conditions de mise en production

Ne pas activer le bouton « Créer une alerte » tant que les points suivants ne sont pas tous validés :

- [ ] Au moins une source officielle ou contractuellement autorisée, documentée et testée.
- [ ] Autorisation et fréquence de consultation confirmées.
- [ ] Adaptateur résistant aux changements et capable de retourner `unknown`.
- [ ] Planificateur serveur, stockage et déduplication déployés.
- [ ] Adresse e-mail vérifiée, consentement, désinscription et suppression opérationnels.
- [ ] Fournisseur de notification configuré et testé.
- [ ] Politique de confidentialité mise à jour et conservation définie.
- [ ] Tests de panne, de données périmées, de doublons et de désinscription réussis.

## 7. Première intégration

Commencer par un seul pays et un seul prestataire, choisi après validation de l'accès autorisé à sa source. Ne pas annoncer une couverture mondiale avant d'avoir répété le processus et validé chaque intégration individuellement.
