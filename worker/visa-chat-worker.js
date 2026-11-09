// Worker « visa-chat » : assistant Visa Checker + entraînement par code.
// Le paiement est désactivé jusqu'au choix officiel du prestataire.
// Variables Cloudflare : GEMINI_API_KEY (secret), INTERVIEW_CODES (secret).
// KV nommé USAGE (Bindings) : codes d'accès existants et quotas d'entraînement.
// Le quota KV est un contrôle best-effort : KV n'offre pas d'incrément atomique ni de cohérence forte.

const SYSTEM = `Tu es l'assistant de Visa Checker, un site qui aide les voyageurs tunisiens à vérifier leur dossier de visa pour la France.
Règles :
- Réponds dans la langue de l'utilisateur (français, anglais ou arabe), en réponses courtes et claires.
- Réponds en texte simple, sans markdown (pas de ** ni de #), avec des tirets "-" pour les listes et 150 mots maximum.
- Tu parles uniquement des visas pour la France et des documents à préparer.
- Ne promets jamais l'obtention d'un visa : le consulat décide, même si le dossier est complet.
- Ne donne aucun montant de frais : renvoie vers le site officiel France-Visas.
- Tu ne remplis pas la demande de visa à la place du client.
- Si la question sort du sujet, ramène poliment vers les visas.`;

const SYSTEM_INTERVIEW = `Tu es un simulateur d'entretien de visa pour Visa Checker. Le client est un voyageur tunisien qui s'entraîne avant un entretien consulaire (surtout les États-Unis, parfois un autre pays).
Tu joues un agent consulaire exigeant mais correct.
Déroulement :
- Le client décrit d'abord sa situation (destination, motif, dates, métier, qui paie).
- Pose UNE seule question courte à la fois, adaptée à sa destination et à son motif (but du voyage, durée, logement, qui paie, travail et attaches en Tunisie, voyages passés, refus précédents, famille ou connaissances sur place, retour).
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
    const cors = {
      "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
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
      const body = await request.json();
      const interview = body.mode === "interview";
      // Aucun prestataire n'est sélectionné pour le moment : pas de création ni validation de paiement.
      if (body.action === "pay_create" || body.action === "pay_check") {
        return out({ error: "payment_unavailable" }, 503);
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

      const msgs = (body.messages || []).slice(interview ? -16 : -8).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.text || "").slice(0, interview ? 700 : 500) }],
      }));
      while (msgs.length && msgs[0].role !== "user") msgs.shift();
      if (!msgs.length) return out({ error: "empty" }, 400);
      if (!interview && limited(request.headers.get("CF-Connecting-IP") || "?")) return out({ error: "rate", reply: RATE_MSG }, 429);

      const model = "gemini-3.5-flash-lite"; // écrit en dur : ignore la variable GEMINI_MODEL
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