// Worker « visa-chat » : assistant Visa Checker + entraînement par code.
// Le paiement est désactivé jusqu'au choix officiel du prestataire.
// Variables Cloudflare : GEMINI_API_KEY (secret), INTERVIEW_CODES (secret), PARTNER_WEBHOOK (secret, demandes de partenariat).
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

const SYSTEM_JOURY_REFUSAL = `Tu es Joury, l’assistante spécialisée de Visa Checker pour l’analyse des refus de visa. Le service concerne principalement les demandeurs tunisiens qui sollicitent un visa pour la France.
Mission : produire un rapport personnalisé avec des rubriques claires : décision et motifs, analyse de chaque motif, preuves visibles dans les pièces, éléments manquants, corrections prioritaires et services Visa Checker adaptés. Ne transforme pas ce rapport en conversation générale.
- Si aucune notification de refus n’est jointe, demande d’abord au demandeur de la téléverser. Demande ensuite uniquement les pièces complémentaires utiles au motif détecté.
- Relève les motifs, codes ou articles exactement tels qu’ils apparaissent. Ne les invente jamais.
- Relie chaque motif uniquement aux informations réellement visibles dans les pièces fournies. Cite le nom du document et les éléments observés, sans répéter de données personnelles sensibles.
- Sépare clairement les faits lus, l’interprétation prudente, les incohérences possibles, les pièces manquantes et les points impossibles à vérifier.
- Prépare un rapport personnalisé : résumé du refus, analyse motif par motif, éléments du dossier concernés, faiblesses documentaires, plan d’action priorisé et services Visa Checker pertinents (vérification documentaire avec Aicha, entraînement à l’entretien avec Aicha, accompagnement recours si disponible).
- N’invente ni délai ni voie de recours. Invite à vérifier la notification officielle et les règles de l’autorité compétente.
- Ne conseille jamais de mentir, de modifier un document ou de cacher un refus.
- Réponds en français, anglais ou arabe selon la langue du demandeur. Texte simple et clair, maximum 400 mots. Ne promets jamais l’obtention d’un visa.`;

const SYSTEM_AICHA_REVIEW = `Tu es Aicha, l’assistante spécialisée de Visa Checker pour la vérification documentaire avant le dépôt d’une demande de visa.
Mission : contrôler concrètement les pièces fournies, et non donner des conseils généraux.
- Si aucun document n’est joint, demande au demandeur de téléverser les pièces et d’indiquer le type de visa et le pays de destination.
- Examine chaque document séparément puis compare les informations entre les pièces : identité (sans répéter les numéros), dates, montants, employeur, hébergement, itinéraire, durée, signatures et cohérence.
- Pour chaque anomalie, indique le document concerné et l’élément visible qui la justifie. Distingue les faits observés, les incohérences possibles, les informations illisibles et les points à confirmer.
- Signale les pièces manquantes uniquement si l’exigence est établie pour le type de visa indiqué. Sinon, indique qu’elle doit être confirmée auprès de la source officielle.
- Produis un rapport : documents examinés, constats vérifiables, incohérences, pièces manquantes, corrections concrètes et éléments restant à confirmer.
- Ne prétends jamais certifier l’authenticité d’un document, détecter avec certitude une fraude ou garantir la conformité officielle. N’invente aucune donnée et ne conseille jamais de falsifier un document.
- Réponds dans la langue du demandeur (français, anglais ou arabe), en texte simple et clair, maximum 350 mots.`;

const SYSTEM_INTERVIEW = `Tu es Aicha, coach de préparation aux entretiens de visa pour Visa Checker. Le client est un voyageur tunisien qui s'entraîne avant un entretien consulaire, notamment pour un visa français.
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

// ----- Demandes de partenariat (route POST /partner) -----
// Variable Cloudflare : PARTNER_WEBHOOK (secret) = adresse du webhook Make qui envoie l'e-mail à Visa Checker.
// Sans cette variable, la route répond 503 « partner_unavailable » et la page propose l'envoi par e-mail (secours).
// Le Worker ne stocke rien : il contrôle la demande, vérifie le logo puis la transmet au webhook.
const PARTNER_TO = "visacheckercontact@gmail.com";
const PARTNER_MAX_BODY = 450000;      // octets de la requête
const PARTNER_LOGO_MAX = 300000;      // caractères de la data URL du logo
const PR_MAX = 5, PR_WINDOW = 60 * 60 * 1000; // 5 demandes par heure et par visiteur (limite souple, en mémoire)
const phits = new Map();
const PARTNER_CATS = { agence: "Agence de voyages", hotel: "Hôtel et hébergement", transport: "Transport et mobilité", assurance: "Assurance et services digitaux", autre: "Autre activité" };
function partnerLimited(ip) {
  const now = Date.now();
  if (phits.size > 2000) { for (const [k, v] of phits) if (now - v.t > PR_WINDOW) phits.delete(k); if (phits.size > 2000) phits.clear(); }
  const h = phits.get(ip);
  if (!h || now - h.t > PR_WINDOW) { phits.set(ip, { t: now, n: 1 }); return false; }
  h.n++;
  return h.n > PR_MAX;
}
const pc = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, max);
const pcm = (v, max) => String(v == null ? "" : v).replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]+/g, " ").replace(/\r\n?/g, "\n").replace(/[ \t]+/g, " ").replace(/\n{3,}/g, "\n\n").trim().slice(0, max);
function pUrl(v) {
  v = pc(v, 300); if (!v) return "";
  try { const u = new URL(v); return /^https?:$/.test(u.protocol) && u.hostname.includes(".") ? u.href.slice(0, 300) : null; } catch { return null; }
}
function pSocial(v) {
  v = pc(v, 200); if (!v) return "";
  if (/^https?:\/\//i.test(v)) return pUrl(v);
  return /^[+@\w][\w .@\-()+\/:]{1,199}$/.test(v) ? v : null;
}
// Vérifie que le logo est bien une image PNG, JPEG ou WebP (type annoncé = signature réelle du fichier).
function pLogo(l) {
  if (l == null) return { ok: true, logo: null };
  const m = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+\/]+={0,2})$/.exec(String((l && l.dataUrl) || ""));
  if (!m || String(l.dataUrl).length > PARTNER_LOGO_MAX) return { ok: false };
  let head;
  try { head = atob(m[2].slice(0, 24)); } catch { return { ok: false }; }
  const sig = m[1] === "image/png" ? head.startsWith("\x89PNG\r\n\x1a\n")
    : m[1] === "image/jpeg" ? head.startsWith("\xff\xd8\xff")
    : head.startsWith("RIFF") && head.slice(8, 12) === "WEBP";
  if (!sig) return { ok: false };
  const ext = m[1] === "image/png" ? "png" : m[1] === "image/jpeg" ? "jpg" : "webp";
  return { ok: true, logo: { filename: "logo." + ext, mime: m[1], base64: m[2] } };
}
function partnerPayload(b) {
  if (!b || typeof b !== "object") return null;
  const cat = PARTNER_CATS[b.category] ? b.category : "";
  const company = pc(b.company, 120), country = pc(b.country, 40), city = pc(b.city, 80);
  const description = pcm(b.description, 1200);
  const c = b.contact && typeof b.contact === "object" ? b.contact : {};
  const contact = { name: pc(c.name, 100), role: pc(c.role, 80), email: pc(c.email, 254), phone: pc(c.phone, 30) };
  if (!cat || !company || !country || !city || description.length < 20 || !contact.name) return null;
  if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(contact.email) || !/^\+?\d[\d\s().\-]{6,24}$/.test(contact.phone)) return null;
  if (b.consent !== true) return null;
  const website = pUrl(b.website); if (website === null) return null;
  const social = {};
  for (const k of ["facebook", "instagram", "tiktok", "linkedin", "whatsapp", "other"]) {
    const r = pSocial(b.social && b.social[k]); if (r === null) return null; if (r) social[k] = r;
  }
  const details = {};
  const d = b.details && typeof b.details === "object" ? b.details : {};
  for (const k of Object.keys(d).slice(0, 12)) {
    const key = pc(k, 30), v = d[k];
    details[key] = Array.isArray(v) ? v.slice(0, 10).map((x) => pc(x, 80)).filter(Boolean).join(", ") : pc(v, 300);
  }
  const lg = pLogo(b.logo); if (!lg.ok) return null;
  return { cat, label: PARTNER_CATS[cat], company, country, city, website, social, details, description, offer: pc(b.offer, 200), model: pc(b.model, 100), contact, logo: lg.logo };
}
function partnerText(p) {
  const L = ["Nouvelle demande de partenariat Visa Checker", "", "Profil : " + p.label, "Entreprise : " + p.company, "Lieu : " + p.city + ", " + p.country];
  if (p.website) L.push("Site web : " + p.website);
  for (const [k, v] of Object.entries(p.social)) L.push("Réseau " + k + " : " + v);
  L.push("");
  for (const [k, v] of Object.entries(p.details)) if (v) L.push(k + " : " + v);
  L.push("", "Présentation :", p.description);
  if (p.offer) L.push("", "Avantage proposé : " + p.offer);
  if (p.model) L.push("Collaboration souhaitée : " + p.model);
  L.push("", "Contact : " + p.contact.name + (p.contact.role ? " (" + p.contact.role + ")" : ""), "E-mail : " + p.contact.email, "Téléphone : " + p.contact.phone);
  L.push("", p.logo ? "Logo : voir la pièce jointe (" + p.logo.filename + ")." : "Logo : non fourni.");
  return L.join("\n");
}
async function handlePartner(request, env, out) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  if (partnerLimited(ip)) return out({ error: "rate" }, 429);
  const len = parseInt(request.headers.get("Content-Length") || "0", 10);
  if (len > PARTNER_MAX_BODY) return out({ error: "invalid" }, 413);
  const raw = await request.text();
  if (raw.length > PARTNER_MAX_BODY) return out({ error: "invalid" }, 413);
  let b; try { b = JSON.parse(raw); } catch { return out({ error: "invalid" }, 400); }
  if (b && typeof b.hp === "string" && b.hp.trim()) return out({ ok: true, partner: true }); // robot : on fait semblant, sans rien envoyer
  const p = partnerPayload(b);
  if (!p) return out({ error: "invalid" }, 400);
  if (!env.PARTNER_WEBHOOK) return out({ error: "partner_unavailable" }, 503);
  const r = await fetch(env.PARTNER_WEBHOOK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: PARTNER_TO,
      replyTo: p.contact.email,
      subject: "Demande de partenariat - " + p.label + " - " + p.company + " (" + p.city + ", " + p.country + ")",
      text: partnerText(p),
      logo: p.logo,
      data: p,
    }),
  });
  if (!r.ok) return out({ error: "partner_unavailable" }, 502);
  return out({ ok: true, partner: true });
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

    // Demandes de partenariat : route dédiée, séparée de l'assistant
    if (new URL(request.url).pathname === "/partner") {
      try { return await handlePartner(request, env, out); } catch (e) { return out({ error: "partner_unavailable" }, 500); }
    }

    try {
      const body = await request.json();
      const mode = String(body.mode || "");
      const interview = mode === "interview";
      const assistantSystem = mode === "joury-refusal" ? SYSTEM_JOURY_REFUSAL : mode === "aicha-review" ? SYSTEM_AICHA_REVIEW : interview ? SYSTEM_INTERVIEW : SYSTEM;
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

      const attachments = Array.isArray(body.attachments) ? body.attachments : [];
      if (attachments.length > 3) return out({ error: "attachments" }, 400);
      let attachmentBytes = 0;
      for (const file of attachments) {
        const mime = String(file && file.mimeType || "");
        const data = String(file && file.data || "");
        if (!["application/pdf", "image/jpeg", "image/png"].includes(mime) || !/^[A-Za-z0-9+/]+={0,2}$/.test(data)) {
          return out({ error: "attachments" }, 400);
        }
        attachmentBytes += Math.floor(data.length * 3 / 4);
      }
      if (attachmentBytes > 15 * 1024 * 1024) return out({ error: "attachments" }, 413);

      const msgs = (body.messages || []).slice(interview ? -16 : -8).map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: String(m.text || "").slice(0, interview ? 700 : 500) }],
      }));
      if (attachments.length) {
        if (interview) return out({ error: "attachments" }, 400);
        let lastUser = -1;
        for (let i = msgs.length - 1; i >= 0; i--) if (msgs[i].role === "user") { lastUser = i; break; }
        if (lastUser < 0) return out({ error: "empty" }, 400);
        for (const file of attachments) {
          msgs[lastUser].parts.push({ inlineData: { mimeType: file.mimeType, data: file.data } });
        }
      }
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
              systemInstruction: { parts: [{ text: assistantSystem }] },
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