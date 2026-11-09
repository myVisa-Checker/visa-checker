# Déploiement Cloudflare — Visa Checker

Ce document prépare le déploiement sans publier le Worker ni modifier les secrets.

## Architecture actuelle

- Le site statique est versionné dans ce dépôt ; l'hébergement réel doit être confirmé dans GitHub Pages / DNS.
- Le Worker API est worker/visa-chat-worker.js.
- wrangler.toml déclare le Worker et le Durable Object VisaCheckerCounter.
- Le KV existant USAGE reste requis pour vérifier les codes d'entretien émis. Son identifiant réel n'est volontairement pas inventé ni commité.
- Le Worker refuse les requêtes si le binding RATE_LIMITER est absent.
- L'assistant reste bloqué tant que DATA_PROCESSING_APPROVED n'est pas défini à 1.
- L'entretien reste bloqué tant que INTERVIEW_ENABLED n'est pas défini à 1.

## Pré-requis avant mise en production

1. Confirmer le compte Cloudflare, le service Worker, le domaine API et l'origine du site.
2. Vérifier que le Worker existant visa-chat correspond bien à ce dépôt.
3. Récupérer l'identifiant du namespace KV USAGE déjà en production. Ne pas créer un nouveau namespace sans plan de migration des codes existants.
4. Vérifier que les codes émis utilisent bien les clés mint:<code> dans ce KV.
5. Faire valider base légale, confidentialité, conservation, sous-traitants et transferts internationaux avant DATA_PROCESSING_APPROVED=1.
6. Garder l'entretien désactivé tant que paiement, conditions et support ne sont pas prêts.

## Secrets et variables Cloudflare

Secrets (jamais dans Git) :
- GEMINI_API_KEY : clé API du fournisseur IA.
- INTERVIEW_CODES : uniquement si des codes fixes sont utilisés, séparés par des virgules.

Variables non secrètes :
- GEMINI_MODEL : modèle validé et disponible.
- DATA_PROCESSING_APPROVED=0 pendant la revue ; passer à 1 uniquement après validation documentée.
- INTERVIEW_ENABLED=0 jusqu'à activation réelle de l'offre.

Bindings :
- RATE_LIMITER : Durable Object class VisaCheckerCounter, déclaré dans wrangler.toml.
- USAGE : binding vers le namespace KV existant. Ajouter son véritable identifiant dans la configuration de déploiement après l'avoir récupéré dans Cloudflare. Ne pas inventer de valeur.

## Migration Durable Object

La migration v1 de wrangler.toml crée la classe SQLite VisaCheckerCounter. Avant le premier déploiement :
- vérifier dans Cloudflare que le Worker n'a pas déjà une migration portant le tag v1 ;
- si v1 est déjà utilisé, ne pas réutiliser ce tag pour une autre classe ; créer un tag adapté ;
- sauvegarder et vérifier la configuration existante ;
- appliquer d'abord sur un environnement de préproduction et vérifier la création du Durable Object.

Les noms des objets du rate limiter sont dérivés d'un SHA-256 de l'IP ou du code. La valeur brute n'est pas utilisée comme identifiant Durable Object. Limites actuelles : 20 requêtes par 10 minutes et par IP, plus 40 consommations par code d'entretien.

## Commandes après vérification des bindings

    npx wrangler whoami
    npx wrangler deploy --dry-run
    npx wrangler deploy

Le dry-run valide la configuration et le bundle, mais ne valide pas les secrets, le KV ou le comportement réel du Durable Object. Ne lancer deploy qu'après revue de la migration et des bindings.

## En-têtes du site statique

Toutes les pages HTML ont une CSP via une balise meta. Le fichier _headers définit les en-têtes HTTP recommandés pour Cloudflare Pages. GitHub Pages ignore _headers : si le site reste sur GitHub Pages, ces valeurs ne seront pas envoyées comme en-têtes HTTP. Il faudra migrer l'hébergement statique vers Cloudflare Pages ou configurer des règles de transformation de réponse dans Cloudflare devant l'origine actuelle.

La CSP n'est pas répétée dans _headers pour éviter une seconde politique globale qui pourrait casser le script inline hashé de la page d'accueil ou les connexions API. Toute CSP HTTP doit être testée page par page.

## Vérifications après déploiement (non exécutées depuis Git)

- Vérifier les en-têtes HTTP réels sur accueil, guides, Planner et Radar.
- Vérifier OPTIONS, POST, origine non autorisée, JSON invalide et payload trop volumineux.
- Vérifier qu'un Worker sans RATE_LIMITER renvoie 503 sans contacter Gemini.
- Vérifier le rate limit depuis plusieurs requêtes et plusieurs instances.
- Vérifier la limite atomique du quota avec des requêtes simultanées pour un même code.
- Vérifier que check ne consomme pas de quota.
- Vérifier qu'aucune réponse contenant des données utilisateur n'est mise en cache.

## Sécurité et limites

- Ne jamais commiter .dev.vars, secrets, clés API, identifiants KV ou données clients.
- Ne pas activer publicité, paiement ou entretien payant pendant cette préparation.
- Le rate limiting est un contrôle d'abus, pas une protection anti-DDoS ; activer aussi les protections Cloudflare au niveau de la zone.
- Le test de compteur valide la logique atomique simulée, pas la disponibilité réelle de Cloudflare.
