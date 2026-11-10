# Visa Checker

Application web statique (PWA) multilingue pour préparer les dossiers de voyage et consulter des informations indicatives sur les visas. Le dépôt contient également un Worker Cloudflare séparé pour les contrôles d'éligibilité et de validité du passeport.

Site public : https://checkmyvisa.org

## Déploiement Cloudflare

### 1. Site web — Cloudflare Pages

Depuis la racine du dépôt :

```bash
npx wrangler pages deploy . --project-name visa-checker
```

Le fichier racine `wrangler.toml` est la configuration Pages (`pages_build_output_dir = "."`). Le dossier racine contient le site statique existant.

### 2. API d'éligibilité — Cloudflare Worker

Depuis la racine du dépôt :

```bash
npx wrangler deploy --config worker/wrangler.toml
```

Le Worker utilise `worker/visa-rules-worker.js`. Sa configuration est isolée dans `worker/wrangler.toml` afin de ne pas confondre le déploiement Pages et le déploiement Worker.

Routes :
- `GET /health` — état du service.
- `GET /v1/rules` — nationalités, destinations et paramètres de contrôle connus.
- `POST /v1/check` — évaluation indicative d'une combinaison nationalité/destination et de dates/validité du passeport.

Exemple de corps JSON :

```json
{
  "nationality": "TN",
  "destination": "SCHENGEN",
  "departureDate": "2027-06-01",
  "returnDate": "2027-06-14",
  "passportIssueDate": "2024-01-01",
  "passportExpiry": "2027-12-31",
  "blankPages": 2
}
```

**Limites importantes :** le jeu de règles intégré est volontairement restreint à TN/MA/DZ et à SCHENGEN/FR. Les destinations absentes retournent `unknown`, jamais une exemption inventée. Les résultats sont informatifs, non décisionnels, et ne remplacent pas les autorités consulaires. Le Worker ne demande ni ne stocke de numéro de passeport ou d'image de document. L'interface principale n'est pas encore connectée à l'URL publique du Worker : après le premier déploiement du Worker, cette URL devra être configurée dans l'application avant d'activer le parcours utilisateur.

## Tests

Aucune dépendance externe. Avec Node.js 18 ou plus récent :

```bash
node tests/run.mjs
```

Le script vérifie la syntaxe des scripts existants, les fichiers et JSON référencés, plusieurs contrôles de sécurité, la cohérence PWA, les contenus e-Visa et les réponses principales du Worker d'éligibilité.

GitHub Actions conserve uniquement le déclenchement manuel (`workflow_dispatch`) ; aucun test automatique n'est lancé à chaque push.

## Structure

- `index.html` + `visa-app.js` : application principale.
- `joury.html`, `aicha.html` + scripts associés : assistants.
- `partenaires.html` + `partner-form.js` : espace partenaires.
- `sw.js`, `visa-pwa.js`, `manifest.json` : PWA.
- `worker/visa-rules-worker.js` : API indicative d'éligibilité et contrôles passeport.
- `worker/visa-proxy-worker.js`, `worker/visa-chat-worker.js` : Workers existants pour les fonctions proxy et assistants.
- `worker/wrangler.toml` : configuration de déploiement de l'API d'éligibilité.
- `wrangler.toml` : configuration Cloudflare Pages à la racine.
- `tests/` : tests de régression.

## Données personnelles et sécurité

Ne jamais ajouter de clés API, secrets, numéros de passeport ou scans de documents dans le dépôt. Les règles sont indicatives et doivent être vérifiées auprès de sources officielles avant tout voyage.
