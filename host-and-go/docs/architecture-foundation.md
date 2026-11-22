# Architecture fondatrice — Host & Go

## 1. Objectif

Construire un service fiable de mise en relation entre voyageurs et hôtes,
avec des contrôles de conformité, de modération et de consentement
avant toute mise en relation directe.

Le système doit privilégier la sécurité des personnes, la traçabilité
des décisions et la cohérence des états métier.

## 2. Architecture générale

Architecture retenue pour le MVP : monolithe modulaire.

Modules fonctionnels :
1. Identité et authentification
2. Profils hôtes
3. Profils voyageurs
4. Gestion des offres
5. Conformité par pays
6. Recherche et éligibilité
7. Candidatures
8. Acceptation des conditions
9. Consentements
10. Partage des coordonnées
11. Modération et signalements
12. Administration
13. Notifications
14. Audit et observabilité

Les modules peuvent partager une base de données au MVP, mais leurs
responsabilités et interfaces doivent rester séparées.

Aucun découpage en microservices n'est requis à ce stade.

## 3. Environnement envisagé

- Backend : Cloudflare Workers.
- Stockage relationnel envisagé : Cloudflare D1 / SQLite.
- Configuration et secrets : environnement Cloudflare.
- Tests : exécution locale et validation manuelle.
- Déploiement : procédure manuelle.

Le choix de D1 est provisoire. Il faut confirmer que ses garanties
transactionnelles et ses limites conviennent aux opérations critiques.

## 4. Autorité serveur

Aucune donnée envoyée par le navigateur ne doit suffire à autoriser :
- la publication d'une offre ;
- l'acceptation d'une candidature ;
- le changement d'un statut de conformité ;
- la validation d'un consentement ;
- la révélation de coordonnées ;
- une action administrative.

Les décisions sont recalculées ou vérifiées côté serveur.

Les identifiants d'objet ne constituent jamais une preuve d'autorisation.

## 5. Parcours vertical MVP

USER REGISTRATION
→ EMAIL VERIFICATION
→ HOST PROFILE
→ FREE OFFER DRAFT
→ MODERATION
→ COUNTRY COMPLIANCE
→ PUBLICATION
→ PUBLIC SEARCH

La recherche publique ne retourne que les offres satisfaisant toutes
les conditions de visibilité.

## 6. Modifications d'offres

Chaque modification matérielle crée une nouvelle version immuable.

Une modification matérielle comprend notamment :
- pays ;
- dates ou durée ;
- activité ;
- rémunération ou avantage en nature ;
- hébergement ;
- repas ;
- conditions de participation ;
- responsabilités demandées.

Lorsqu'une nouvelle version est créée :
1. conserver l'ancienne version ;
2. créer la nouvelle version ;
3. invalider les validations liées à l'ancienne version pour la nouvelle ;
4. relancer la modération ;
5. relancer l'analyse de conformité ;
6. masquer l'offre pendant la réévaluation si nécessaire.

L'historique ne doit pas être effacé.

## 7. Candidatures et conditions

Une candidature référence une version précise de l'offre.

Les conditions présentées aux deux parties sont figées dans un instantané
immuable et versionné.

Une modification des conditions crée une nouvelle version et nécessite
de nouvelles acceptations.

Les acceptations antérieures restent dans l'historique mais ne valident
pas la nouvelle version.

## 8. Partage des coordonnées

Le partage des coordonnées est calculé côté serveur.

Il est autorisé uniquement lorsque :
- l'offre est toujours admissible ;
- la candidature est valide ;
- les deux parties ont accepté la même version des conditions ;
- les deux parties ont donné leur consentement explicite ;
- les contrôles de conformité sont valides ;
- aucun compte ou objet n'est bloqué ou suspendu.

Le navigateur ne peut jamais transmettre un simple booléen
`contact_ready` pour déclencher le partage.

## 9. Notifications

Les notifications informent les utilisateurs.
Elles ne constituent jamais la source de vérité d'un état métier.

Une notification peut être retardée, dupliquée ou échouer sans modifier
la validité de la candidature ou du consentement.

Prévoir une file d'attente transactionnelle de type outbox.

## 10. Administration

Les actions administratives doivent :
- être authentifiées ;
- être autorisées selon un rôle ;
- être journalisées ;
- inclure un motif ;
- conserver l'état antérieur et le nouvel état ;
- être protégées contre les modifications non autorisées.

## 11. Principes non négociables

- Refus par défaut.
- Historique conservé.
- Contrôles côté serveur.
- Consentement explicite.
- Versions immuables.
- Aucun contournement de conformité.
- Aucune promesse de visa ou de droit au travail.
- Modération et signalement obligatoires.
