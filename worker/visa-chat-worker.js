// Worker « visa-chat » : assistant Visa Checker + entraînement à l'entretien (payant, par code).
// À déployer sur Cloudflare (Workers & Pages > visa-chat > Edit code). Ce fichier n'est PAS servi par le site.
// Variables Cloudflare : GEMINI_API_KEY (secret), GEMINI_MODEL (facultatif), INTERVIEW_CODES (secret, codes séparés par des virgules).
// KV USAGE : registre des codes générés après validation du paiement.
// Durable Object RATE_LIMITER : compteurs distribués et quotas atomiques.
// Paiements : intégration reportée. Aucun fournisseur ni endpoint de paiement actif pour le moment ; Flouci sera évalué séparément.

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


const ORIGINS = ["https://checkmyvisa.org", "https://www.checkmyvisa.org", "https://myvisa-checker.github.io"];
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const rid = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ALPHA[b % ALPHA.length]).join("");
const TTL = 60 * 60 * 24 * 30;
const FALLBACK = "Désolé, je n'ai pas pu répondre. Réessaie dans un instant.";

// Compteurs distribués par Durable Object : rate limit IP et quota par code.
const IV_MAX = 40;
const RATE_MAX = 20, RATE_WINDOW = 10 * 60 * 1000;
const RATE_MSG = "Trop de messages d'affilée. Réessaie dans quelques minutes. / Too many messages, please try again in a few minutes. / رسائل كثيرة، أعد المحاولة بعد دقائق.";

async function counterRequest(env, name, action, limit, windowMs = 0) {
  if (!env.RATE_LIMITER) return { unavailable: true };
  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(name));
    const opaqueName = Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, "0")).join("");
    const id = env.RATE_LIMITER.idFromName("counter:" + opaqueName);
    const stub = env.RATE_LIMITER.get(id);
    const response = await stub.fetch("https://counter.internal/consume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, limit, windowMs }),
    });
    if (!response.ok) return { unavailable: true };
    return await response.json();
  } catch (error) {
    console.log("Counter unavailable", error && error.message);
    return { unavailable: true };
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    // Refuser explicitement les origines web non autorisées au lieu de leur renvoyer
    // un en-tête CORS appartenant à un autre domaine.
    if (origin && !ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ error: "origin" }), {
        status: 403,
        headers: { ...security, "Content-Type": "application/json", "Cache-Control": "no-store", "Vary": "Origin" },
      });
    }
    const security = {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
      "Referrer-Policy": "no-referrer",
      "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
      "Strict-Transport-Security": "max-age=31536000",
      "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    };
    const cors = {
      ...security,
      ...(origin ? { "Access-Control-Allow-Origin": origin } : {}),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin",
    };
    const out = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store, max-age=0" },
      });

    if (request.method === "OPTIONS") return new Response(null, { headers: cors });
    if (request.method !== "POST") return out({ error: "POST only" }, 405);

    // Verrou de conformité : ne traiter aucun contenu utilisateur tant que
    // les formalités de protection des données et les transferts internationaux
    // n'ont pas été validés. Activation explicite uniquement après validation.
    if (env.DATA_PROCESSING_APPROVED !== "1") {
      return out({
        error: "privacy_review_pending",
        reply: "L'assistant est temporairement indisponible pendant la validation de nos formalités de protection des données. / The assistant is temporarily unavailable while our data-protection requirements are being reviewed. / المساعد غير متاح مؤقتًا أثناء مراجعة متطلبات حماية البيانات."
      }, 503);
    }

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
      // Fonction payante en préparation : activation distincte, explicite et désactivée par défaut.
      if (interview && env.INTERVIEW_ENABLED !== "1") return out({ error: "interview_unavailable" }, 503);
      if (!env.RATE_LIMITER) return out({ error: "rate_limiter_unavailable" }, 503);

      // Rate limit distribué par IP pour TOUS les modes, y compris l'entretien.
      const ip = request.headers.get("CF-Connecting-IP") || "unknown";
      const rate = await counterRequest(env, "rate:" + ip, "consume", RATE_MAX, RATE_WINDOW);
      if (rate.unavailable) return out({ error: "rate_limiter_unavailable" }, 503);
      if (!rate.allowed) return out({ error: "rate", reply: RATE_MSG, retryAfter: rate.retryAfter }, 429);

      // Paiements désactivés jusqu'à validation d'un partenaire et configuration de production.
      if (body.action === "pay_create" || body.action === "pay_check") {
        return out({ error: "payments_unavailable" }, 503);
      }

      // ----- Entraînement : validation du code -----
      let quotaName = "";
      if (interview) {
        if (!env.USAGE) return out({ error: "usage_unavailable" }, 503);
        const codes = String(env.INTERVIEW_CODES || "").split(",").map((s) => s.trim()).filter(Boolean);
        const code = String(body.code || "").trim();
        const listed = codes.includes(code);
        const minted = !listed && code ? await env.USAGE.get("mint:" + code) : null;
        if (!code || (!listed && !minted)) return out({ error: "code" }, 403);
        quotaName = "quota:" + code;
        if (body.check === true) {
          const quota = await counterRequest(env, quotaName, "check", IV_MAX);
          if (quota.unavailable) return out({ error: "quota_unavailable" }, 503);
          if (!quota.allowed) return out({ error: "limit", left: 0 }, 429);
          return out({ ok: true, left: quota.left });
        }
      }

      if (!Array.isArray(body.messages) || body.messages.length < 1 || body.messages.length > 32) {
        return out({ error: "invalid_messages" }, 400);
      }
      // Reject malformed entries instead of silently filtering a partial payload.
      const invalidMessage = body.messages.some((m) =>
        !m || typeof m !== "object" || Array.isArray(m) ||
        !["user", "assistant"].includes(m.role) ||
        typeof m.text !== "string" || !m.text.trim() || m.text.length > 4000
      );
      if (invalidMessage) return out({ error: "invalid_messages" }, 400);
      const msgs = body.messages
        .slice(interview ? -16 : -8)
        .map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.text.slice(0, interview ? 700 : 500) }],
        }));
      while (msgs.length && msgs[0].role !== "user") msgs.shift();
      if (!msgs.length) return out({ error: "empty" }, 400);
      if (interview) {
        const quota = await counterRequest(env, quotaName, "consume", IV_MAX);
        if (quota.unavailable) return out({ error: "quota_unavailable" }, 503);
        if (!quota.allowed) return out({ error: "limit", left: 0 }, 429);
      }

      if (!env.GEMINI_API_KEY) return out({ error: "service_unavailable", reply: FALLBACK }, 503);
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
              generationConfig: { maxOutputTokens: 700 },
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

// Durable Object : compteur atomique, partagé entre toutes les instances du Worker.
// Chaque nom (IP ou code) est routé vers un objet stable ; les transactions sérialisent
// les requêtes concurrentes et empêchent les dépassements de quota.
export class VisaCheckerCounter {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405 });
    let body;
    try { body = await request.json(); } catch { return new Response("Bad request", { status: 400 }); }
    const { action, limit, windowMs = 0 } = body || {};
    if (!["check", "consume"].includes(action) ||
        !Number.isInteger(limit) || limit < 1 || limit > 10000 ||
        !Number.isInteger(windowMs) || windowMs < 0 || windowMs > 86400000) {
      return Response.json({ error: "invalid_counter_request" }, { status: 400 });
    }

    const result = await this.state.storage.transaction(async (txn) => {
      const now = Date.now();
      let current = await txn.get("counter");
      if (!current || (windowMs > 0 && now - current.startedAt >= windowMs)) {
        current = { startedAt: now, count: 0 };
      }
      const remainingMs = windowMs > 0 ? Math.max(0, windowMs - (now - current.startedAt)) : 0;
      if (current.count >= limit) {
        return { allowed: false, left: 0, retryAfter: Math.ceil(remainingMs / 1000) };
      }
      if (action === "consume") {
        current.count += 1;
        await txn.put("counter", current);
      } else if (!await txn.get("counter")) {
        await txn.put("counter", current);
      }
      return { allowed: true, left: Math.max(0, limit - current.count), retryAfter: 0 };
    });
    return Response.json(result, {
      headers: { "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" },
    });
  }
}
