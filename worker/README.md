# Workers Cloudflare

Les deux Workers de Visa Checker sont versionnés ici. **Cloudflare ne lit pas ce dépôt** : après chaque modification, ouvrez le Worker dans Cloudflare > Edit code, remplacez tout le contenu par le fichier correspondant, puis Deploy. Les secrets et liaisons KV existants ne changent pas.

| Fichier | Worker | Rôle | KV |
|---|---|---|---|
| `visa-proxy-worker.js` | `visa-proxy` | Demandes agences (via Make), codes et jetons du pack recours, lettre IA, analyseur de refus, liens « Confirmer et payer » 48 h | `KV` |
| `visa-chat-worker.js` | `visa-chat` | Assistants Joury et Aicha (Gemini), entraînement à l'entretien par code, formulaire partenaires (`/partner`) | `USAGE` |

## Variables et secrets attendus

Ne jamais écrire de valeur dans ce dépôt.

- `visa-proxy` : `MAKE_URL`, `SECRET`, `ADMIN_KEY`, `GEMINI_API_KEY` (secrets) ; `GEMINI_MODEL`, `AGENCIES`, `ALLOWED_ORIGIN`, `SITE` (optionnels). Détail dans l'en-tête du fichier.
- `visa-chat` : `GEMINI_API_KEY`, `INTERVIEW_CODES`, `PARTNER_WEBHOOK` (secrets). Le modèle est écrit en dur dans le code.

## Tests

`node tests/run.mjs` vérifie la syntaxe des deux fichiers et quelques règles de sécurité simples.
