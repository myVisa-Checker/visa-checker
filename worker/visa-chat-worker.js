// Worker « visa-chat » : assistant Visa Checker + entraînement à l'entretien (payant, par code).
// À déployer sur Cloudflare (Workers & Pages > visa-chat > Edit code). Ce fichier n'est PAS servi par le site.
// Variables Cloudflare : GEMINI_API_KEY (secret), GEMINI_MODEL (facultatif), INTERVIEW_CODES (secret, codes séparés par des virgules).
// KV nommé USAGE (Bindings) : limite par code, codes générés après paiement, commandes.
// Paiement Konnect (à activer uniquement après finalisation du partenariat) : KONNECT_API_KEY, KONNECT_WALLET_ID, PRICE_MILLIMES, KONNECT_BASE, SITE_URL. Aucun paiement simulé.

const SYSTEM = `Tu es l'assistant de Visa Checker, un service indépendant d'aide à la préparation des dossiers de visa et à la compréhension des formalités de voyage.
Règles :
- Réponds dans la langue de l'utilisateur : français, anglais ou arabe. Sois bref, clair et pratique (150 mots maximum).
- Réponds en texte simple, sans markdown décoratif.
- Les formalités dépendent du passeport, du pays de destination, du motif et de la durée du séjour. Si une information manque, pose une seule question courte avant de conseiller.
- Ne suppose jamais que l'utilisateur est tunisien ou qu'il demande un visa pour la France.
- Donne la priorité aux sources officielles du pays de destination. Signale clairement quand une règle doit être vérifiée ou quand tu n'as pas de source fiable.
- Ne présente jamais une liste indicative comme une liste officielle ou exhaustive et n'invente ni document, ni frais, ni délai, ni lien.
- Ne promets jamais l'obtention d'un visa : seule l'autorité compétente décide.
- Tu ne remplis pas et ne déposes pas la demande à la place du client.
- Ne demande jamais de numéro de passeport, de données bancaires ou d'autres informations sensibles.
- Si la question sort du sujet, ramène poliment vers la préparation du voyage et des formalités de visa.`;

const SYSTEM_INTERVIEW = `Tu es un simulateur d'entretien de visa pour Visa Checker. Le client est un voyageur qui s'entraîne avant un entretien consulaire. Adapte les questions à sa nationalité, sa destination et son motif de voyage.
Tu joues un agent consulaire exigeant mais correct.
Déroulement :
- Le client décrit d'abord sa situation (destination, motif, dates, métier, qui paie).
- Pose UNE seule question courte à la fois, adaptée à sa destination et à son motif (but du voyage, durée, logement, qui paie, travail et attaches dans son pays de résidence, voyages passés, refus précédents, famille ou connaissances sur place, retour).
- Après chaque réponse du client : 1) un retour en 1 ou 2 phrases : ce qui est clair, ce qui est flou ou pourrait contredire son dossier ; 2) une meilleure formulation basée UNIQUEMENT sur les informations qu'il a données ; 3) la question suivante.
- Après 6 questions, ou s'il le demande, fais un résumé : points forts, points à corriger, pièces à revérifier.
Règles strictes :
- N'invente jamais d'informations à la place du client. Ne lui donne pas de réponses toutes faites à réciter.
- Ne l'aide jamais à cacher un refus précédent, à mentir ou à présenter un document faux.
- Ne promets jamais l'obtention d'un visa : le consulat décide.
- Ne donne aucun montant de frais.
- Rappelle une fois, au début, de ne pas écrire son numéro de passeport.
- Réponds dans la langue du client (français, anglais ou arabe), en texte simple sans markdown, avec des tirets "-" pour les listes, 150 mots maximum.
- Si la question sort du sujet de l'entretien de visa, ramène poliment vers l'entraînement.`;

const IV_MAX = 40; // messages par code (utilisé seulement si le KV « USAGE » est relié)
const ORIGINS = ["https://checkmyvisa.org", "https://www.checkmyvisa.org", "https://myvisa-checker.github.io"];
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const rid = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ALPHA[b % ALPHA.length]).join("");
const TTL = 60 * 60 * 24 * 30;
const FALLBACK = "Désolé, je n'ai pas pu répondre. Réessaie dans un instant.";

// Limite de l'assistant gratuit : RL_MAX messages par RL_WINDOW et par visiteur (adresse IP).
// Le compteur est gardé en mémoire du Worker (aucune écriture dans le KV : le quota gratuit du KV reste pour l'entraînement payant).
// C'est une limite « souple » : Cloudflare peut faire tourner plusieurs instances du Worker, chacune compte de son côté.
const RL_MAX = 20, RL_WINDOW = 10 * 60 * 1000;
const RATE_MSG = "Trop de messages d'affilée. Réessaie dans quelques minutes. / Too many messages, please try again in a few minutes. / رسائل كثيرة، أعد المحاولة بعد دقائق.";
const hits = new Map();
function limited(ip) {
  const now = Date.now();
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now - v.t > RL_WINDOW) hits.delete(k);
    if (hits.size > 5000) hits.clear();
  }
  const h = hits.get(ip);
  if (!h || now - h.t > RL_WINDOW) { hits.set(ip, { t: now, n: 1 }); return false; }
  h.n++;
  return h.n > RL_MAX;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    // Refuser explicitement les origines web non autorisées au lieu de leur renvoyer
    // un en-tête CORS appartenant à un autre domaine.
    if (origin && !ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: "origin" }), {
        status: 403,
        headers: { "Content-Type": "application/json", "Vary": "Origin" },
      });
    }
    const cors = {
      ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    const out = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...cors, "Content-Type": "application/json" },
      });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return out({ error: "POST only" }, 405);

    try {
      const contentType = request.headers.get("Content-Type") || "";
      if (!contentType.toLowerCase().includes("application/json")) {
        return out({ error: "content_type" }, 415);
      }
      const maxBodyBytes = 24 * 1024;
      const declaredLength = Number(request.headers.get("Content-Length") || 0);
      if (declaredLength > maxBodyBytes) return out({ error: "body_too_large" }, 413);
      const rawBody = await request.text();
      if (new TextEncoder().encode(rawBody).byteLength > maxBodyBytes) {
        return out({ error: "body_too_large" }, 413);
      }
      let body;
      try { body = JSON.parse(rawBody); } catch { return out({ error: "invalid_json" }, 400); }
      if (!body || typeof body !== "object" || Array.isArray(body)) {
        return out({ error: "invalid_body" }, 400);
      }
      const interview = body.mode === "interview";

      // Paiements désactivés jusqu'à validation d'un partenaire et configuration de production.
      // Les anciens appels frontend reçoivent une réponse explicite, sans contacter Konnect.
      if (body.action === "pay_create" || body.action === "pay_check") {
        return out({ error: "payments_unavailable" }, 503);
      }

      // ----- Entraînement : accès par code -----
      let usageKey = "", used = 0;
      if (interview) {
        const codes = String(env.INTERVIEW_CODES || "").split(",").map((s) => s.trim()).filter(Boolean);
        const code = String(body.code || "").trim();
        const listed = codes.includes(code);
        const minted = !listed && code && env.USAGE ? await env.USAGE.get("mint:" + code) : null;
        if (!code || (!listed && !minted)) return out({ error: "code" }, 403);
        if (env.USAGE) {
          usageKey = "iv:" + code;
          used = parseInt((await env.USAGE.get(usageKey)) || "0", 10) || 0;
          if (used >= IV_MAX) return out({ error: "limit" }, 429);
        }
        if (body.check) return out({ ok: true, left: env.USAGE ? IV_MAX - used : null });
      }

      if (!Array.isArray(body.messages) || body.messages.length > 32) {
        return out({ error: "invalid_messages" }, 400);
      }
      const msgs = body.messages
        .filter((m) => m && typeof m === "object" &&
          (m.role === "user" || m.role === "assistant") &&
          typeof m.text === "string" && m.text.trim().length > 0)
        .slice(interview ? -16 : -8)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.text.slice(0, interview ? 700 : 500) }],
        }));
      while (msgs.length && msgs[0].role !== "user") msgs.shift();
      if (!msgs.length) return out({ error: "empty" }, 400);
      if (!interview && limited(request.headers.get("CF-Connecting-IP") || "?")) return out({ error: "rate", reply: RATE_MSG }, 429);

      const model = env.GEMINI_MODEL || "gemini-3.5-flash-lite";
      const ctl = new AbortController();
      const tm = setTimeout(() => ctl.abort(), 20000); // délai maximum : 20 secondes
      let r;
      try {
        r = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
          {
            method: "POST",
            signal: ctl.signal,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": env.GEMINI_API_KEY || "",
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: interview ? SYSTEM_INTERVIEW : SYSTEM }] },
              contents: msgs,
              generationConfig: { maxOutputTokens: 2500 },
            }),
          }
        );
      } catch (e) {
        clearTimeout(tm);
        console.log("Gemini fetch failed", e && e.name, e && e.message);
        return out({ reply: FALLBACK });
      }
      const data = await r.json().catch(() => ({}));
      clearTimeout(tm);
      if (!r.ok || data.error) console.log("Gemini error", r.status, JSON.stringify(data.error || data).slice(0, 300));
      const cand = data?.candidates?.[0];
      const text = cand?.content?.parts?.map((p) => p.text || "").join("");
      if (!text) console.log("Gemini empty reply", r.status, cand && cand.finishReason, data && data.promptFeedback && data.promptFeedback.blockReason);
      if (interview && env.USAGE && text) await env.USAGE.put(usageKey, String(used + 1));

      const raw = text || FALLBACK;
      const reply = raw
        .replace(/\*\*/g, "")
        .replace(/^#+\s*/gm, "")
        .replace(/^\s*[\*\-]\s+/gm, "• ");
      return out({ reply });
    } catch (e) {
      console.log("Worker error", e && e.message);
      return out({ reply: "Une erreur est survenue. Réessaie plus tard." }, 500);
    }
  },
};