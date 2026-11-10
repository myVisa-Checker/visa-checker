# Workers Cloudflare

## API d'éligibilité — déploiement Wrangler

Le Worker d'éligibilité est autonome et peut être déployé depuis la racine du dépôt :

```bash
npx wrangler deploy --config worker/wrangler.toml
```

- Code : `worker/visa-rules-worker.js`
- Configuration : `worker/wrangler.toml`
- Nom Cloudflare : `visa-checker-eligibility`
- Routes : `GET /health`, `GET /v1/rules`, `POST /v1/check`
- Pas de KV, de secret ni de stockage de numéro de passeport requis.

Le Worker applique uniquement le jeu de règles documenté dans le README racine. Toute nationalité ou destination hors dataset est signalée comme inconnue ; aucune dispense de visa n'est supposée. Les contrôles de passeport sont indicatifs et ne remplacent pas les exigences publiées par les autorités.

## Workers existants — proxy et assistants

Les deux Workers historiques sont versionnés ici. Ils ne sont pas déployés par la configuration Wrangler racine. Pour ces deux services, utilisez leur configuration Cloudflare existante et conservez les liaisons et secrets déjà configurés.

| Fichier | Worker | Rôle | KV |
|---|---|---|---|
| `visa-proxy-worker.js` | `visa-proxy` | Demandes agences, codes et jetons du pack recours, lettre IA, analyseur de refus, liens de confirmation | `KV` |
| `visa-chat-worker.js` | `visa-chat` | Assistants Joury et Aicha, entraînement à l'entretien, formulaire partenaires | `USAGE` |

Variables/secrets utilisés par ces Workers historiques :
- `visa-proxy` : `MAKE_URL`, `SECRET`, `ADMIN_KEY`, `GEMINI_API_KEY` (secrets) ; `GEMINI_MODEL`, `AGENCIES`, `ALLOWED_ORIGIN`, `SITE` (optionnels).
- `visa-chat` : `GEMINI_API_KEY`, `INTERVIEW_CODES`, `PARTNER_WEBHOOK` (secrets).

Ne jamais enregistrer de secrets dans GitHub.

## Tests

Depuis la racine du dépôt, avec Node.js 18 ou plus récent :

```bash
node tests/run.mjs
```

La suite inclut des tests d'exécution du Worker d'éligibilité.
