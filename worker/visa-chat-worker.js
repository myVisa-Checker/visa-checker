// Worker « visa-chat » : assistant Visa Checker + entraînement à l'entretien (payant, par code).
// À déployer sur Cloudflare (Workers & Pages > visa-chat > Edit code). Ce fichier n'est PAS servi par le site.
// Variables Cloudflare : GEMINI_API_KEY (secret), GEMINI_MODEL, INTERVIEW_CODES (secret, codes séparés par des virgules).
// KV nommé USAGE (Bindings) : limite par code, codes générés après paiement, commandes.
// Paiement Konnect (cartes, e-Dinar, Flouci...) : KONNECT_API_KEY (secret), KONNECT_WALLET_ID, PRICE_MILLIMES (ex. 15000 = 15 DT),
//   KONNECT_BASE (par défaut : bac à sable), SITE_URL, PAY_MOCK=1 (TEST ONLY : paiement simulé, ne jamais laisser en production).

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

const DEFAULT_SITE = "https://checkmyvisa.org/"; // surchargé par la variable SITE_URL
const IV_MAX = 40; // messages par code (utilisé seulement si le KV « USAGE » est relié)
const ORIGINS = ["https://checkmyvisa.org", "https://www.checkmyvisa.org", "https://myvisa-checker.github.io"];
const DEFAULT_KBASE = "https://api.sandbox.konnect.network/api/v2"; // production : https://api.konnect.network/api/v2
const ALPHA = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const rid = (n) => Array.from(crypto.getRandomValues(new Uint8Array(n)), (b) => ALPHA[b % ALPHA.length]).join("");
const TTL = 60 * 60 * 24 * 30;

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
      const SITE = env.SITE_URL || DEFAULT_SITE;
      const KBASE = env.KONNECT_BASE || DEFAULT_KBASE;

      // ----- Paiement : création d'une commande -----
      if (body.action === "pay_create") {
        const amount = parseInt(env.PRICE_MILLIMES || "0", 10);
        if (!env.USAGE || !amount) return out({ error: "config" }, 500);
        const orderId = rid(16);
        if (env.PAY_MOCK === "1") {
          await env.USAGE.put("order:" + orderId, orderId, { expirationTtl: TTL });
          return out({ payUrl: SITE + "?pay=1&mock=1", ref: orderId });
        }
        if (!env.KONNECT_API_KEY || !env.KONNECT_WALLET_ID) return out({ error: "config" }, 500);
        const r = await fetch(KBASE + "/payments/init-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-api-key": env.KONNECT_API_KEY },
          body: JSON.stringify({
            receiverWalletId: env.KONNECT_WALLET_ID, token: "TND", amount, type: "immediate",
            description: "Visa Checker - entrainement entretien", orderId, lifespan: 30,
            successUrl: SITE + "?pay=1", failUrl: SITE + "?pay=fail",
          }),
        });
        const d = await r.json().catch(() => ({}));
        if (!d.paymentRef || !d.payUrl) return out({ error: "gateway" }, 502);
        await env.USAGE.put("order:" + d.paymentRef, orderId, { expirationTtl: TTL });
        return out({ payUrl: d.payUrl, ref: d.paymentRef });
      }

      // ----- Paiement : vérification puis génération du code -----
      if (body.action === "pay_check") {
        const ref = String(body.ref || "").replace(/[^A-Za-z0-9_-]/g, "").slice(0, 64);
        if (!ref || !env.USAGE) return out({ error: "bad" }, 400);
        const done = await env.USAGE.get("ref:" + ref);
        if (done) return out({ paid: true, code: done });
        const orderId = await env.USAGE.get("order:" + ref);
        if (!orderId) return out({ paid: false, error: "unknown" });
        let paid = false;
        if (env.PAY_MOCK === "1") paid = true;
        else {
          const r = await fetch(KBASE + "/payments/" + ref, { headers: { "x-api-key": env.KONNECT_API_KEY } });
          const d = await r.json().catch(() => ({}));
          const p = d.payment || d;
          paid = p.status === "completed" && (p.orderId == null || p.orderId === orderId);
        }
        if (!paid) return out({ paid: false });
        const code = "IV-" + rid(4) + "-" + rid(4);
        await env.USAGE.put("mint:" + code, "1");
        await env.USAGE.put("ref:" + ref, code);
        return out({ paid: true, code });
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

      const model = env.GEMINI_MODEL || "gemini-2.5-flash";
      const r = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-goog-api-key": env.GEMINI_API_KEY,
          },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: interview ? SYSTEM_INTERVIEW : SYSTEM }] },
            contents: msgs,
            generationConfig: { maxOutputTokens: 1500 },
          }),
        }
      );
      const data = await r.json().catch(() => ({}));
      if (!r.ok || data.error) console.log("Gemini error", r.status, JSON.stringify(data.error || data).slice(0, 300));
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("");
      if (interview && env.USAGE && text) await env.USAGE.put(usageKey, String(used + 1));
      const raw = text || "Désolé, je n'ai pas pu répondre. Réessaie dans un instant.";
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
