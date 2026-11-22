# Host & Go — Dossier de conception technique

## Statut

Ce dossier rassemble les décisions produit, les fondations d'architecture,
les règles de sécurité, le modèle de données et les exemples techniques
récupérables dans le contexte disponible de cette session.

Il s'agit d'une spécification de conception. Ce dossier ne constitue pas
une application intégralement implémentée, testée ou déployée.

## Vision

Host & Go est une fonctionnalité de CheckMyVisa.org qui met en relation
des voyageurs et des hôtes à l'étranger pour des expériences d'immersion
culturelle et d'hospitalité.

Les activités envisagées peuvent inclure :
- jardinage ;
- aide dans une ferme ;
- cuisine ;
- entretien et maintenance ;
- échange linguistique ;
- aide à la vie familiale.

Selon les conditions convenues, l'hébergement, les repas, de l'argent
de poche ou des pourboires peuvent être proposés.

Host & Go est un service de mise en relation et de préparation au voyage.
Il ne délivre aucune autorisation de séjour, de travail ou d'entrée
sur un territoire.

## Décisions produit confirmées

- La publication des offres par les hôtes est gratuite au lancement.
- La création, la publication et le renouvellement des offres sont gratuits.
- L'inscription, la recherche et les candidatures des voyageurs sont gratuites
  au lancement.
- Toute monétisation future nécessitera une décision distincte.
- Aucun paiement entre hôte et voyageur n'est traité dans le MVP.
- Aucune messagerie interne n'est prévue dans le MVP.
- Aucun passeport n'est collecté pendant la découverte.
- Un utilisateur peut être à la fois hôte et voyageur.
- Les coordonnées ne sont partagées qu'après acceptation réciproque
  des mêmes conditions finales, consentements explicites et contrôles
  de conformité réussis.
- Les offres et utilisateurs peuvent être signalés, suspendus ou bloqués.
- La modération humaine est obligatoire pour les situations ambiguës.

## Pays initiaux

Les pays suivants sont identifiés pour la recherche réglementaire :

- Rwanda
- Afrique du Sud
- Kenya
- Tanzanie
- Ouganda
- Sénégal
- Ghana

Statut initial de chaque pays : `RESEARCH`.
Aucun pays ne doit être considéré comme juridiquement vérifié sur la seule
base de cette liste.

## Architecture

Le MVP adopte un monolithe modulaire.
Les microservices prématurés sont exclus.

Cloudflare Workers est envisagé pour le backend.
D1/SQLite reste une option provisoire, à confirmer après vérification
des garanties transactionnelles, de concurrence et de cohérence nécessaires.

Le serveur est l'autorité pour :
- l'authentification ;
- l'autorisation ;
- la conformité ;
- la modération ;
- la publication ;
- les candidatures ;
- les consentements ;
- le partage des coordonnées.

Principe de sécurité : refus par défaut.

## Publication

Une offre ne peut être visible que si toutes les conditions suivantes
sont réunies :

- modération approuvée ;
- conformité validée ;
- pays vérifié ;
- publication active.

Voir `examples/publication-eligibility.ts`.

## Sécurité et conformité

Voir :
- `docs/architecture-foundation.md`
- `docs/security-and-compliance.md`
- `docs/data-model-and-api.md`

## Plan de réalisation

Voir `docs/implementation-plan.md` et `docs/build-index.md`.

## Provenance et limites

Voir `docs/limitations-and-provenance.md`.
