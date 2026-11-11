// Worker « visa-chat » : assistant CheckMyVisa + entraînement par code.
// Le paiement est désactivé jusqu'au choix officiel du prestataire.
// Variables Cloudflare : GEMINI_API_KEY (secret), INTERVIEW_CODES (secret), PARTNER_WEBHOOK (secret, demandes de partenariat).
// KV nommé USAGE (Bindings) : codes d'accès existants et quotas d'entraînement.
// Le quota KV est un contrôle best-effort : KV n'offre pas d'incrément atomique ni de cohérence forte.

const SYSTEM = `Tu es l'assistant de CheckMyVisa, un site qui aide les voyageurs de toutes nationalités à vérifier leur dossier de visa pour la France.
Règles :
- Réponds dans la langue de l'utilisateur (français, anglais ou arabe), en réponses courtes et claires.
- Réponds en texte simple, sans markdown (pas de ** ni de #), avec des tirets "-" pour les listes et 150 mots maximum.
- Tu parles uniquement des visas pour la France et des documents à préparer.
- Ne promets jamais l'obtention d'un visa : le consulat décide, même si le dossier est complet.
- Ne donne aucun montant de frais : renvoie vers le site officiel France-Visas.
- Tu ne remplis pas la demande de visa à la place du client.
- Si la question sort du sujet, ramène poliment vers les visas.`;

const SYSTEM_JOURY_REFUSAL = `Tu es Joury, l’assistante IA de CheckMyVisa, exclusivement spécialisée dans l’analyse et le traitement des refus de visa. Tu n’es pas avocate et ne prétends pas fournir un avis juridique professionnel. Si la demande ne concerne pas un refus de visa, explique brièvement ton périmètre et recentre-la sur un refus. Le service s'adresse aux demandeurs de toutes nationalités (notamment tunisienne, marocaine et algérienne) ; adapte l'analyse au passeport et au pays de résidence indiqués.
Mission : produire un rapport personnalisé avec des rubriques claires : décision et motifs, analyse de chaque motif, preuves visibles dans les pièces, éléments manquants, corrections prioritaires et services CheckMyVisa adaptés. Ne transforme pas ce rapport en conversation générale.
- Si aucune notification de refus n’est jointe, demande d’abord au demandeur de la téléverser. Demande ensuite uniquement les pièces complémentaires utiles au motif détecté.
- Relève les motifs, codes ou articles exactement tels qu’ils apparaissent. Ne les invente jamais.
- Relie chaque motif uniquement aux informations réellement visibles dans les pièces fournies. Cite le nom du document et les éléments observés, sans répéter de données personnelles sensibles.
- Sépare clairement les faits lus, l’interprétation prudente, les incohérences possibles, les pièces manquantes et les points impossibles à vérifier.
- Prépare un rapport personnalisé : résumé du refus, analyse motif par motif, éléments du dossier concernés, faiblesses documentaires, plan d’action priorisé et services CheckMyVisa pertinents (vérification documentaire avec Aicha, entraînement à l’entretien avec Aicha, accompagnement recours si disponible).
- Adapte l'analyse à la mission demandée : analyse des motifs, contrôle de cohérence entre pièces, évaluation qualitative des points de vigilance, examen prudent des options de recours, préparation d'une nouvelle demande ou plan d'action.
- Pour le risque, utilise uniquement des niveaux qualitatifs (faible, modéré, important) avec justification observable. Ne calcule jamais une probabilité d'obtention du visa.
- Pour chaque motif, indique précisément quelles preuves ajouter et pourquoi elles répondent au motif. Les relevés bancaires sur une période cohérente, justificatifs de revenus, attestation employeur/congés, titre de propriété ou bail et preuves d’attaches familiales sont des exemples possibles selon les faits, jamais des obligations universelles.\n- Explique quoi écrire dans la lettre : formule un argument factuel personnalisé répondant directement au motif, cite la preuve correspondante et signale les faits manquants par [à préciser]. Ne fabrique aucune explication.\n- Pour chaque constat, indique le document source et distingue clairement fait observé, interprétation et point à confirmer.
- Pour chaque motif, réponds systématiquement à trois questions : quel passage exact de la décision est concerné ; quelles pièces concrètes et authentiques peuvent répondre à ce motif dans ce dossier ; quel argument factuel peut être formulé dans la lettre. Explique le lien entre chaque pièce proposée et le motif, et précise la période ou le type de justificatif uniquement lorsque le contexte le justifie.
- Pour la lettre de recours, propose une structure personnalisée (référence de décision, rappel factuel, réponse séparée à chaque motif, liste des annexes, demande finale). Rédige un projet avec champs [à compléter] lorsque des faits manquent. Ne présente jamais un modèle générique comme un recours prêt à envoyer.
- Ne qualifie jamais un recours de recevable ou de gagnable sans vérifier la juridiction, l'autorité, la date de notification et les règles officielles applicables. Les statuts « Solide », « À consolider » ou « Risqué » sont des appréciations documentaires indicatives, pas une prédiction de décision.
- Si le pays, l'autorité ou le type de visa n'est pas identifiable, pose une question ciblée avant toute conclusion juridique ou procédurale.
- Les procédures, voies de recours et délais peuvent changer : ne les affirme pas sans base officielle vérifiable. Invite à contrôler la notification et le site de l'autorité compétente.
- N’invente ni délai ni voie de recours. Invite à vérifier la notification officielle et les règles de l’autorité compétente.
- Ne conseille jamais de mentir, de modifier un document ou de cacher un refus.
- Réponds en français, anglais ou arabe selon la langue du demandeur. Texte simple et clair, maximum 400 mots. Ne promets jamais l’obtention d’un visa.`;

const SYSTEM_AICHA_REVIEW = `Tu es Aicha, l’assistante spécialisée de CheckMyVisa pour la vérification documentaire avant le dépôt d’une demande de visa.
Mission : contrôler concrètement les pièces fournies, et non donner des conseils généraux.
- Si aucun document n’est joint, demande au demandeur de téléverser les pièces et d’indiquer le type de visa et le pays de destination.
- Examine chaque document séparément puis compare les informations entre les pièces : identité (sans répéter les numéros), dates, montants, employeur, hébergement, itinéraire, durée, signatures et cohérence.
- Pour chaque anomalie, indique le document concerné et l’élément visible qui la justifie. Distingue les faits observés, les incohérences possibles, les informations illisibles et les points à confirmer.
- Signale les pièces manquantes uniquement si l’exigence est établie pour le type de visa indiqué. Sinon, indique qu’elle doit être confirmée auprès de la source officielle.
- Produis un rapport : documents examinés, constats vérifiables, incohérences, pièces manquantes, corrections concrètes et éléments restant à confirmer.
- Ne prétends jamais certifier l’authenticité d’un document, détecter avec certitude une fraude ou garantir la conformité officielle. N’invente aucune donnée et ne conseille jamais de falsifier un document.
- Réponds dans la langue du demandeur (français, anglais ou arabe), en texte simple et clair, maximum 350 mots.`;

const SYSTEM_INTERVIEW = `Tu es Aicha, coach de préparation aux entretiens de visa pour CheckMyVisa. Le client est un voyageur (de n'importe quelle nationalité : tunisienne, marocaine, algérienne ou autre) qui s'entraîne avant un entretien consulaire ; adapte-toi au passeport et au pays de résidence qu'il indique.
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
const ORIGINS = ["https://checkmyvisa.org", "https://www.checkmyvisa.org"];
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
// Variable Cloudflare : PARTNER_WEBHOOK (secret) = adresse du webhook Make qui envoie l'e-mail à CheckMyVisa.
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
  const L = ["Nouvelle demande de partenariat CheckMyVisa", "", "Profil : " + p.label, "Entreprise : " + p.company, "Lieu : " + p.city + ", " + p.country];
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


/* ----- API métier CheckMyVisa : endpoints dédiés aux trois assistants ----- */
const API_FILE_MAX = 5 * 1024 * 1024;
const API_FILE_COUNT_MAX = 10;
const API_TOTAL_MAX = 14 * 1024 * 1024; // marge sous la limite d'entrée inline Gemini
const API_MIMES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

function apiFileSignature(bytes, mime) {
  if (mime === "application/pdf") return bytes.length >= 5 && String.fromCharCode(...bytes.slice(0, 5)) === "%PDF-";
  if (mime === "image/jpeg") return bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  if (mime === "image/png") return bytes.length >= 8 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47 && bytes[4] === 0x0d && bytes[5] === 0x0a && bytes[6] === 0x1a && bytes[7] === 0x0a;
  if (mime === "image/webp") return bytes.length >= 12 && String.fromCharCode(...bytes.slice(0, 4)) === "RIFF" && String.fromCharCode(...bytes.slice(8, 12)) === "WEBP";
  return false;
}
function apiBase64(bytes) {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
}
async function apiReadPayload(request) {
  const len = Number(request.headers.get("Content-Length") || 0);
  if (len > API_TOTAL_MAX + 1024 * 1024) return { error: "payload_too_large", status: 413 };
  const type = request.headers.get("Content-Type") || "";
  let body, rawFiles = [];
  if (/^multipart\/form-data\b/i.test(type)) {
    const form = await request.formData();
    const raw = form.get("payload");
    try { body = raw ? JSON.parse(String(raw)) : {}; } catch { return { error: "invalid_payload", status: 400 }; }
    rawFiles = form.getAll("files").concat(form.getAll("file")).filter((f) => f && typeof f.arrayBuffer === "function");
  } else if (/^application\/json\b/i.test(type)) {
    try { body = await request.json(); } catch { return { error: "invalid_payload", status: 400 }; }
    rawFiles = Array.isArray(body && body.attachments) ? body.attachments : [];
  } else {
    return { error: "unsupported_content_type", status: 415 };
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return { error: "invalid_payload", status: 400 };
  if (rawFiles.length > API_FILE_COUNT_MAX) return { error: "too_many_files", status: 400 };
  const files = [];
  let total = 0;
  for (const f of rawFiles) {
    let mime, filename, bytes;
    if (f && typeof f.arrayBuffer === "function") {
      mime = String(f.type || "").toLowerCase();
      filename = pc(f.name || "document", 120);
      if (f.size > API_FILE_MAX) return { error: "file_too_large", status: 413 };
      bytes = new Uint8Array(await f.arrayBuffer());
    } else {
      mime = String(f && f.mimeType || "").toLowerCase();
      filename = pc(f && f.filename || "document", 120);
      const data = String(f && f.data || "");
      if (!/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(data)) return { error: "invalid_file", status: 400 };
      let binary;
      try { binary = atob(data); } catch { return { error: "invalid_file", status: 400 }; }
      bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      if (bytes.length > API_FILE_MAX) return { error: "file_too_large", status: 413 };
    }
    if (!API_MIMES.includes(mime) || !apiFileSignature(bytes, mime)) return { error: "invalid_file_type", status: 400 };
    total += bytes.length;
    if (total > API_TOTAL_MAX) return { error: "total_files_too_large", status: 413 };
    files.push({ mimeType: mime, data: apiBase64(bytes), filename });
  }
  return { body, files };
}
async function apiGemini(env, system, userText, files, history) {
  if (!env.GEMINI_API_KEY) return { error: "ai_unavailable", status: 503 };
  const parts = [{ text: String(userText || "").slice(0, 18000) }];
  for (const f of files || []) parts.push({ inlineData: { mimeType: f.mimeType, data: f.data } });
  const contents = Array.isArray(history) && history.length
    ? history.slice(-12).map((m) => ({ role: m && m.role === "assistant" ? "model" : "user", parts: [{ text: String(m && m.text || "").slice(0, 1200) }] })).concat([{ role: "user", parts }])
    : [{ role: "user", parts }];
  const model = String(env.MODEL || env.GEMINI_MODEL || "gemini-3.5-flash-lite").trim();
  const ctl = new AbortController();
  const tm = setTimeout(() => ctl.abort(), 30000);
  try {
    const r = await fetch("https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent", {
      method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": env.GEMINI_API_KEY },
      body: JSON.stringify({ systemInstruction: { parts: [{ text: system }] }, contents, generationConfig: { maxOutputTokens: 2500 } })
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || data.error) return { error: "ai_request_failed", status: 502 };
    const reply = data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim();
    return reply ? { reply } : { error: "empty_ai_reply", status: 502 };
  } catch (e) {
    return { error: e && e.name === "AbortError" ? "ai_timeout" : "ai_unavailable", status: 503 };
  } finally {
    clearTimeout(tm);
  }
}
async function handleVisaApi(request, env, out, pathname) {
  const parsed = await apiReadPayload(request);
  if (parsed.error) return out({ error: parsed.error }, parsed.status);
  const body = parsed.body, files = parsed.files;
  const ip = request.headers.get("CF-Connecting-IP") || "?";
  if (limited(ip)) return out({ error: "rate", reply: RATE_MSG }, 429);

  if (pathname === "/api/analyze-refusal") {
    const context = [
      "Analyse une décision officielle de refus de visa et le dossier initial transmis.",
      "Contexte déclaré : " + pcm(body.context, 7000),
      "Nombre de documents fournis : " + files.length + ".",
      "La notification de refus est le document de référence : relève chaque motif, code et article exactement comme il apparaît, sans en ajouter.",
      "Formate chaque motif en cinq lignes distinctes : une ligne MOTIF: [texte exact ou résumé fidèle], une ligne EXPLICATION: [sens simple et lien aux preuves], une ligne SEVERITE: [High, Medium ou Low], une ligne PIECES A JOINDRE: [pièces précises et justification], une ligne ARGUMENT A ECRIRE: [argument factuel personnalisé]. Sépare les blocs par une ligne vide. N’invente aucun motif.",
      "Ajoute une ligne initiale « ÉVALUATION DU RECOURS: À examiner / À consolider / Risque élevé » uniquement si les informations permettent une appréciation prudente, puis justifie-la en quelques phrases. Sinon écris « ÉVALUATION DU RECOURS: Non évaluable ».",
      "Propose des preuves pertinentes uniquement selon les faits : relevés bancaires couvrant une période cohérente, preuve de revenus réguliers, attestation employeur et congés, titre de propriété ou bail, preuves d'attaches familiales, invitation ou hébergement documenté. Ce sont des exemples à adapter, jamais des exigences automatiques.",
      "Distingue faits lus, interprétation, contradiction possible et information manquante. Cite le nom du fichier si possible sans reproduire de données sensibles.",
      "Donne un plan de correction priorisé et un exemple de paragraphe argumentatif personnalisé, uniquement à partir des faits fournis. N'invente ni loi, ni délai, ni voie de recours, ni jurisprudence.",
      "Si pays, autorité, date ou type de décision sont inconnus, demande les précisions nécessaires avant toute conclusion sur la recevabilité.",
      "Classe la situation comme à examiner, à consolider ou risque élevé avec justification. Ne garantis jamais le succès et termine par les vérifications officielles à faire."
    ].join("\\n");
    const result = await apiGemini(env, SYSTEM_JOURY_REFUSAL, context, files);
    return out(result.reply ? { reply: result.reply } : { error: result.error }, result.status || 200);
  }

  if (pathname === "/api/analyze-dossier") {
    const context = [
      "Analyse un dossier de demande de visa à partir des seules pièces jointes et informations ci-dessous.",
      "Contexte : " + JSON.stringify({
        passportCountry: pc(body.passportCountry || body.passport, 80),
        destination: pc(body.destination || body.dest, 80),
        purpose: pc(body.purpose, 80),
        occupation: pc(body.occupation || body.status, 80),
        departure: pc(body.departure || body.dep, 30),
        returnDate: pc(body.returnDate || body.ret, 30),
        passportExpiry: pc(body.passportExpiry || body.expiry, 30)
      }),
      "Nombre de documents joints : " + files.length + ".",
      "Produis un rapport structuré : documents examinés, faits observés par document, incohérences possibles, pièces manquantes seulement si l'exigence est établie, corrections prioritaires et points à confirmer.",
      "Commence par « Score indicatif de conformité : NN/100 » uniquement si les pièces fournissent assez d’éléments pour une estimation prudente. Ce score évalue la complétude et la lisibilité apparentes du dossier, jamais la probabilité d’obtenir un visa. Si les éléments sont insuffisants, écris « Score : non évaluable ».",
      "Ne répète pas les numéros de passeport ou autres données sensibles. Ne prétends pas certifier l'authenticité ni garantir l'obtention du visa."
    ].join("\n");
    const result = await apiGemini(env, SYSTEM_AICHA_REVIEW, context, files);
    return out(result.reply ? { reply: result.reply } : { error: result.error }, result.status || 200);
  }

  if (pathname === "/api/generate-appeal") {
    const prompt = [
      "Prépare un projet de lettre de recours ou de demande de réexamen à partir des informations fournies.",
      "Pays/autorité : " + pc(body.authority || body.destination || "non précisé", 120),
      "Date de décision : " + pc(body.refusalDate || body.date, 40),
      "Référence : " + pc(body.reference, 100),
      "Motifs exacts de refus : " + pcm(body.refusalText || body.motifs, 7000),
      "Faits complémentaires communiqués : " + pcm(body.facts || body.additionalFacts, 5000),
      "Identité/adresse fournies : " + pcm(body.identity || body.address, 1000),
      "Langue demandée : " + pc(body.language || "français", 30),
      "Documents joints : " + files.length + ".",
      "N'invente aucun fait, texte juridique, délai ou voie de recours. Si une donnée manque, laisse un champ [à compléter]. Distingue les faits des arguments et recommande de vérifier le délai et l'autorité sur la notification officielle. Ne promets aucun résultat."
    ].join("\n");
    const appealSystem = "Tu es Joury, assistante de rédaction spécialisée dans les projets de recours après refus de visa. Rédige une lettre formelle, claire et respectueuse à partir des seuls faits et documents fournis. Pour chaque motif cité, réponds directement à l'argument de l'autorité avec une preuve précise et explique quelle pièce jointe l'étaye. Si une preuve manque, indique [pièce à fournir] et propose une catégorie pertinente sans prétendre qu'elle est légalement obligatoire. N'invente jamais de fait, d'article, de jurisprudence, de délai, d'autorité ou de voie de recours. Utilise [à compléter] pour toute donnée absente. Rappelle de vérifier le destinataire et le délai sur la notification officielle.";
    const result = await apiGemini(env, appealSystem, prompt, files);
    return out(result.reply ? { reply: result.reply } : { error: result.error }, result.status || 200);
  }

  if (pathname === "/api/interview-feedback") {
    const codes = String(env.INTERVIEW_CODES || "").split(",").map((s) => s.trim()).filter(Boolean);
    const code = String(body.code || "").trim();
    const listed = codes.includes(code);
    const minted = !listed && code && env.USAGE ? await env.USAGE.get("mint:" + code) : null;
    if (!code || (!listed && !minted)) return out({ error: "code" }, 403);
    let usageKey = "", used = 0;
    if (env.USAGE) {
      usageKey = "iv:" + code;
      used = parseInt((await env.USAGE.get(usageKey)) || "0", 10) || 0;
      if (used >= IV_MAX) return out({ error: "limit" }, 429);
    }
    const answer = pcm(body.answer, 3000);
    if (!answer) return out({ error: "empty_answer" }, 400);
    const prompt = [
      "Évalue la réponse du candidat à la question d'entretien ci-dessous.",
      "Question : " + pcm(body.question, 1000),
      "Réponse du candidat : " + answer,
      "Contexte déclaré : " + pcm(body.context, 1500),
      "Retourne un feedback concis en trois rubriques explicites : Clarté, Précision, Niveau de certitude. Explique les points solides et les éléments à clarifier, puis propose une reformulation fidèle aux seuls faits fournis. Ne déduis pas la sincérité ou la véracité à partir du style. Ne pose pas la question suivante, elle est gérée par l'interface.",
      "Ne crée aucune information, ne conseille jamais de mentir ou de cacher un refus."
    ].join("\n");
    const result = await apiGemini(env, SYSTEM_INTERVIEW + "\n\nPour cet endpoint, donne uniquement le feedback et la reformulation de la réponse. Ne pose pas la question suivante : elle est gérée par l'interface.", prompt, []);
    if (!result.reply) return out({ error: result.error }, result.status || 502);
    if (env.USAGE) await env.USAGE.put(usageKey, String(used + 1));
    return out({ reply: result.reply, left: env.USAGE ? Math.max(0, IV_MAX - used - 1) : null });
  }
  return out({ error: "not_found" }, 404);
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
    const pathname = new URL(request.url).pathname;
    if (pathname === "/api/analyze-refusal" || pathname === "/api/analyze-dossier" || pathname === "/api/generate-appeal" || pathname === "/api/interview-feedback") {
      if (request.method !== "POST") return out({ error: "POST only" }, 405);
      try { return await handleVisaApi(request, env, out, pathname); }
      catch (e) { console.log("Visa API route failed", pathname, e && e.message); return out({ error: "api_unavailable" }, 500); }
    }
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
        if (limited(request.headers.get("CF-Connecting-IP") || "?")) return out({ error: "rate", reply: RATE_MSG }, 429);
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

      const model = String(env.MODEL || env.GEMINI_MODEL || "gemini-3.5-flash-lite").trim();
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
              systemInstruction: { parts: [{ text: assistantSystem + "\n\nContexte déclaré par le demandeur (ne rien déduire si absent) : nationalité/passeport = " + String(body.nationality || body.passportCountry || "non indiqué").slice(0, 80) + "; pays de résidence = " + String(body.residenceCountry || body.country || "non indiqué").slice(0, 80) + ". Adapte les explications à ces informations uniquement." }] },
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
      if (interview && env.USAGE && r.ok && !data.error && text) await env.USAGE.put(usageKey, String(used + 1));

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