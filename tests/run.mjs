#!/usr/bin/env node
// Tests de base de Visa Checker. Aucune dépendance : node tests/run.mjs
// Vérifie la syntaxe des scripts, la validité des JSON, les fichiers référencés, la cohérence de version
// et le rendu de la section e-Visa pour les trois passeports (tn, ma, dz) dans les trois langues.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name + (detail ? " : " + detail : "")); } };
const read = (f) => readFileSync(f, "utf8");

console.log("Syntaxe JavaScript");
for (const f of ["visa-app.js", "visa-chat.js", "visa-pwa.js", "planner.js", "sw.js", "worker/visa-chat-worker.js", "bump-version.mjs"]) {
  try { if (f === "worker/visa-chat-worker.js") execFileSync(process.execPath, ["--input-type=module", "--check"], { input: read(f), stdio: ["pipe", "pipe", "pipe"] }); else execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); ok(f, true); } catch (e) { ok(f, false, String(e.stderr || e.message).split("\n")[0]); }
}

console.log("JSON");
for (const f of ["manifest.json", "partners.json", "rdv.json", "reviews.json", "deals.json", "version.json"]) {
  try { JSON.parse(read(f)); ok(f, true); } catch (e) { ok(f, false, e.message); }
}

console.log("Liens et ressources locaux de toutes les pages HTML");
const html = read("index.html");
const htmlPages = [
  "index.html", "planner.html", "partenaires.html", "a-propos.html", "contact.html",
  "confidentialite.html", "conditions.html", "radar.html",
  "guide/index.html", "guide/documents-visa-schengen-france-tunisie.html", "guide/demande-visa-france-tunisie-etapes.html", "guide/ressources-financieres-garant-assurance-schengen.html"
];
for (const page of htmlPages) {
  ok(page + " : CSP présente", /Content-Security-Policy/.test(read(page)));
  const source = read(page);
  const refs = [...source.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((m) => m[1]);
  for (const ref of [...new Set(refs)]) {
    if (/^(https?:|data:|mailto:|tel:|\/\/|#|javascript:)/i.test(ref)) continue;
    const clean = ref.split(/[?#]/)[0];
    if (!clean) continue;
    const target = resolve(dirname(page), clean.endsWith("/") ? clean + "index.html" : clean);
    ok(page + " → " + ref, existsSync(target), target);
    ok(page + " : pas de chemin local absolu", !clean.startsWith("/"));
  }
}

console.log("Sitemap");
const urls = [...read("sitemap.xml").matchAll(/<loc>https:\/\/checkmyvisa\.org\/([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const u of urls) { const p = u === "" ? "index.html" : u.endsWith("/") ? u + "index.html" : u; ok("sitemap : " + (u || "/"), existsSync(p)); }

console.log("Version");
const vj = JSON.parse(read("version.json")).version;
const sw = (read("sw.js").match(/const VERSION = "([^"]*)"/) || [])[1];
ok("sw.js et version.json ont la même version", vj === sw, vj + " / " + sw);

console.log("Sécurité (contrôles simples)");
ok("fichier _headers pour Cloudflare Pages présent", existsSync("_headers"));
if (existsSync("_headers")) {
  const edgeHeaders = read("_headers");
  for (const h of ["X-Content-Type-Options: nosniff", "X-Frame-Options: DENY", "Referrer-Policy:", "Permissions-Policy:", "Strict-Transport-Security:"]) ok("en-tête edge " + h, edgeHeaders.includes(h));
  ok("_headers documente la limite GitHub Pages", edgeHeaders.includes("GitHub Pages ignores _headers"));
}
ok("documentation de déploiement Cloudflare présente", existsSync("docs/cloudflare-deployment.md"));
ok("tests de concurrence Durable Object présents", existsSync("tests/durable-object.test.mjs"));
ok("CI GitHub Actions configurée sur amelioration", existsSync(".github/workflows/ci.yml") && read(".github/workflows/ci.yml").includes("branches: [amelioration]"));
ok("CSP présente dans index.html", /Content-Security-Policy/.test(html));
ok("CSP interdit les objets et les formulaires externes", /object-src 'none'/.test(html) && /form-action 'none'/.test(html));
const secretRe = /(AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
for (const f of ["visa-app.js", "visa-chat.js", "visa-pwa.js", "index.html", "worker/visa-chat-worker.js", "data.js", "app.js"]) ok("aucune clé secrète dans " + f, !secretRe.test(read(f)));
const workerCode = read("worker/visa-chat-worker.js").split("\n").filter((l) => !/^\s*\/\//.test(l)).join("\n");
ok("PAY_MOCK n'est pas activé en dur dans le Worker (commentaires ignorés)", !/PAY_MOCK\s*=\s*["']?1/.test(workerCode));
ok("Worker refuse les origines web non autorisées", /if \(origin && !ORIGINS\.includes\(origin\)\)/.test(workerCode));
ok("Worker exige KV pour valider les codes émis", /if \(!env\.USAGE\)/.test(workerCode));
ok("Worker exige le Durable Object avant de traiter les requêtes", /if \(!env\.RATE_LIMITER\)/.test(workerCode));
ok("rate limiting distribué par identifiant IP", /counterRequest\(env, "rate:" \+ ip, "consume", RATE_MAX, RATE_WINDOW\)/.test(workerCode));
ok("quota entretien atomique par code", /counterRequest\(env, quotaName, "consume", IV_MAX\)/.test(workerCode));
ok("contrôle de code sans consommation de quota", /body\.check === true/.test(workerCode) && /counterRequest\(env, quotaName, "check", IV_MAX\)/.test(workerCode));
ok("compteurs protégés par transaction Durable Object", /this\.state\.storage\.transaction\(async \(txn\)/.test(workerCode));
ok("rate limit IP appliqué avant la validation des modes", workerCode.includes('const ip = request.headers.get("CF-Connecting-IP")') && /counterRequest\(env, "rate:" \+ ip, "consume", RATE_MAX, RATE_WINDOW\)/.test(workerCode));
ok("identifiants Durable Object hachés avant stockage", workerCode.includes('crypto.subtle.digest("SHA-256"'));
ok("Worker ajoute X-Frame-Options et Permissions-Policy", workerCode.includes('"X-Frame-Options": "DENY"') && workerCode.includes('"Permissions-Policy": "camera=(), microphone=(), geolocation=()"'));
ok("Worker ajoute CSP et HSTS sur toutes les réponses", workerCode.includes('"Content-Security-Policy": "default-src') && workerCode.includes('"Strict-Transport-Security": "max-age=31536000"'));
ok("aucune Map locale utilisée pour le rate limiting", !/const hits = new Map\(\)/.test(workerCode));
ok("configuration Wrangler et migration Durable Object présentes", /class_name = "VisaCheckerCounter"/.test(read("wrangler.toml")) && /new_sqlite_classes = \["VisaCheckerCounter"\]/.test(read("wrangler.toml")));
ok("entraînement payant désactivé par défaut sans validation explicite", /interview && env\.INTERVIEW_ENABLED !== "1"/.test(workerCode));
ok("Worker refuse de traiter sans clé Gemini", /if \(!env\.GEMINI_API_KEY\)/.test(workerCode));
ok("Worker limite la sortie du modèle", /maxOutputTokens: 700/.test(workerCode));
ok("réponses Worker non mises en cache", /Cache-Control": "no-store/.test(workerCode));
ok("Worker ajoute les en-têtes anti-MIME-sniffing et Referrer-Policy", /X-Content-Type-Options": "nosniff"/.test(workerCode) && /Referrer-Policy": "no-referrer"/.test(workerCode));
ok("Worker rejette les messages malformés au lieu de les filtrer", /const invalidMessage = body\.messages\.some/.test(workerCode) && /if \(invalidMessage\) return out\(\{ error: "invalid_messages" \}, 400\)/.test(workerCode));
ok("D17 retiré et passerelles Konnect/Flouci prévues sans activation prématurée", !/D17/.test(read("visa-app.js")) && /payment-konnect/.test(read("visa-app.js")) && /payment-flouci/.test(read("visa-app.js")) && /Aucun paiement n'est demandé/.test(read("visa-app.js")));
ok("Transmission des demandes partenaires désactivée", /var REQUEST_URL=""/.test(read("visa-app.js")));
ok("Déblocage payant désactivé", /var UNLOCK_URL=""/.test(read("visa-app.js")) && /var PACK_URL=""/.test(read("visa-app.js")));
ok("Aucun partenaire exemple publié", Object.keys(JSON.parse(read("partners.json")).partners || {}).length === 0);
ok("Worker verrouillé sans validation de traitement des données", /env\.DATA_PROCESSING_APPROVED !== "1"/.test(workerCode));
const manifest = JSON.parse(read("manifest.json"));
ok("identifiant PWA compatible avec un déploiement en sous-chemin", manifest.id.startsWith("./"));

console.log("Contraste des couleurs de marque (brand.css, WCAG AA = 4,5)");
{
  const css = read("brand.css");
  const grab = (re) => { const m = css.match(re); const o = {}; if (m) for (const x of m[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/g)) o[x[1]] = x[2].trim(); return o; };
  const light = grab(/:root\{([\s\S]*?)\n\}/), dark = { ...light, ...grab(/:root\[data-theme="dark"\]\{([\s\S]*?)\n\}/) };
  const res = (map, v, d = 0) => { v = v.trim(); const m = v.match(/^var\((--[a-z0-9-]+)\)$/); return m && d < 8 ? res(map, map[m[1]] || "", d + 1) : v; };
  const rgb = (h) => { h = h.replace("#", ""); if (h.length === 3) h = [...h].map((c) => c + c).join(""); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16) / 255); };
  const lum = (h) => { const [r, g, b] = rgb(h).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4)); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
  const pairs = [["--ink", "--bg"], ["--ink", "--surface"], ["--muted", "--bg"], ["--muted", "--surface"], ["--accent", "--surface"], ["--accent-ink", "--surface"], ["--on-accent", "--accent"]];
  for (const [name, map] of [["clair", light], ["sombre", dark]]) for (const [f, g] of pairs) {
    const a = res(map, map[f] || ""), b = res(map, map[g] || "");
    if (!/^#[0-9a-f]{3,6}$/i.test(a) || !/^#[0-9a-f]{3,6}$/i.test(b)) { ok(name + " " + f + " sur " + g, false, "valeur illisible : " + a + " / " + b); continue; }
    const r = ratio(a, b); ok(name + " " + f + " sur " + g + " = " + r.toFixed(1), r >= 4.5);
  }
}

console.log("Section e-Visa (tn, ma, dz × fr, en, ar)");
const src = read("visa-app.js").split("\n");
const a = src.findIndex((l) => l.startsWith("/* ===== e-Visa section"));
const b = src.findIndex((l) => l.startsWith("function evTitle"));
const ORIS = [{ id: "tn", n: { fr: "Tunisie", en: "Tunisia", ar: "تونس" } }, { id: "ma", n: { fr: "Maroc", en: "Morocco", ar: "المغرب" } }, { id: "dz", n: { fr: "Algérie", en: "Algeria", ar: "الجزائر" } }];
const ctx = { document: { addEventListener() {} }, window: { addEventListener() {} }, ORIS, S: { lang: "fr", origin: "tn", done: {}, evc: "" }, FLAGS: {}, flag: (c) => c, needsHtml: () => "", console };
vm.createContext(ctx);
let loaded = true;
try { vm.runInContext(src.slice(a, b + 1).join("\n") + "\nthis.api={evList,evListHtml,evDetailHtml,EVORI,EV,EVCONT};", ctx); } catch (e) { loaded = false; ok("chargement du bloc e-Visa", false, e.message); }
if (loaded) {
  const api = ctx.api;
  for (const o of ["tn", "ma", "dz"]) for (const L of ["fr", "en", "ar"]) {
    ctx.S.origin = o; ctx.S.lang = L;
    let bad = [];
    try { const h = api.evListHtml(); if (/undefined|NaN/.test(h)) bad.push("liste"); } catch (e) { bad.push("liste : " + e.message); }
    for (const c of api.evList()) {
      ctx.S.evc = c.id;
      try { const h = api.evDetailHtml({}); if (/undefined|NaN|null/.test(h)) bad.push(c.id); } catch (e) { bad.push(c.id + " : " + e.message); }
      if (!api.EVCONT[c.id]) bad.push(c.id + " sans continent");
    }
    ok("e-Visa " + o + "/" + L + " (" + api.evList().length + " pays)", bad.length === 0, bad.slice(0, 5).join(", "));
  }
  for (const o of ["ma", "dz"]) { const miss = Object.keys(api.EVORI[o]).filter((id) => !api.EV.some((c) => c.id === id)); ok("EVORI." + o + " : tous les pays sont définis", miss.length === 0, miss.join(",")); }
}

console.log("Programme partenaires");
const partnerPage = "partenaires.html";
ok("page partenaires présente", existsSync(partnerPage));
if (existsSync(partnerPage)) {
  const p = read(partnerPage);
  ok("contact partenariat opérationnel", p.includes("visacheckercontact@gmail.com") && p.includes("mailto:visacheckercontact@gmail.com"));
  ok("présentation des principales catégories", ["Assurance voyage", "Traduction", "Services documentaires", "eSIM", "Conseil spécialisé"].every((x) => p.includes(x)));
  ok("partenariat gratuit sans commission", p.includes("référencement est gratuit") && p.includes("aucune commission") && p.includes("faux documents"));
}
const productApp = read("visa-app.js");
console.log("Moteur de checklist et couverture");
ok("marque du parcours neutre selon le passeport", productApp.includes('stamp:"Voyageurs"') && productApp.includes('stamp:"Travellers"') && productApp.includes('stamp:"المسافرون"'));
ok("interface sans promesse de liste exacte ou exhaustive", !/liste exacte des documents|exact list of documents|القائمة الدقيقة للوثائق/.test(productApp));
ok("disclaimer France-Visas personnalisé et caractère non officiel", productApp.includes("la liste personnalisée générée par France-Visas fait foi") && productApp.includes("the personalised France-Visas checklist is authoritative") && productApp.includes("القائمة الشخصية الصادرة عن France-Visas المرجع المعتمد"));
ok("photos : fond blanc interdit et fond clair", productApp.includes("blanc interdit") && productApp.includes("white is not allowed") && productApp.includes("الأبيض ممنوع") && !/fond blanc ou très clair|white or very light background|خلفية بيضاء أو فاتحة جدًا/.test(productApp));
ok("traduction assermentée non présentée comme obligatoire partout", productApp.includes("Do not present a sworn translation as universally mandatory") && productApp.includes("لا تعتبر الترجمة المحلّفة شرطًا عامًا"));
ok("ressources sans exigence générique de 3 mois ni RIB", !productApp.includes("Relevés bancaires des 3 derniers mois et RIB") && !productApp.includes("Bank statements for the last 3 months and your RIB"));
ok("transport conditionnel selon la liste personnalisée", /id:"flight",g:"stay",w:any,opt:1/.test(productApp) && productApp.includes("Transport evidence or itinerary, if requested"));
const coverage = read("guide/couverture-provisoire.md");
ok("matrice provisoire corrigée à 22 parcours Schengen", coverage.includes("22 combinaisons") && coverage.includes("7 destinations Schengen") && coverage.includes("5 destinations Schengen"));
ok("matrice distingue parcours présents et validation officielle", coverage.includes("pas une validation officielle ou exhaustive") && coverage.includes("ne signifie pas que toutes les pièces") && coverage.includes("validation officielle"));
ok("catégories partenaires intégrées au parcours", ["SPT.sTr", "SPT.sDoc", "SPT.sEsim"].every((x) => productApp.includes(x)));
ok("accès au programme partenaires depuis l'accueil", productApp.includes('href="partenaires.html"'));
const ivStart = productApp.indexOf("var IVT=");
const ivEnd = productApp.indexOf("\nvar IVOPEN", ivStart);
const ivText = productApp.slice(ivStart, ivEnd > ivStart ? ivEnd : ivStart + 6000);
ok("conseils d'entretien non limités à la Tunisie", !/Tunisie|Tunisia|تونس/.test(ivText));

console.log("Visa Journey Planner");
const plannerPage = read("planner.html");
const plannerScript = read("planner.js");
ok("planner appointment date input has valid closing markup", /<input id="appointment" type="date">/.test(plannerPage));
ok("planner multilingue FR/EN/AR", ["fr:", "en:", "ar:"].every((x) => plannerScript.includes(x)));
ok("planner sauvegarde localement sans compte", plannerScript.includes("localStorage.setItem") && plannerScript.includes("vc-journey-plan-v1"));
ok("planner affiche une progression accessible", plannerPage.includes('id="progress-track"') && plannerPage.includes('role="progressbar"') && plannerScript.includes('setAttribute("aria-valuenow"'));
ok("planner conserve les tâches cochées lors d’une mise à jour", plannerScript.includes("previousDone=plan&&plan.done?plan.done:{}"));
ok("planner valide les dates enregistrées", plannerScript.includes("function validDate") && plannerScript.includes("validDate(saved.departure)"));
ok("planner permet de modifier les échéances et les conserve", plannerScript.includes("dateInput.type=\"date\"") && plannerScript.includes("task.due=dateInput.value") && plannerScript.includes("adjustDate"));
ok("planner refuse une échéance enregistrée après le départ", plannerScript.includes("validDate(x.due)&&x.due<=saved.departure"));
ok("planner exporte un calendrier ICS", plannerScript.includes("BEGIN:VCALENDAR") && plannerScript.includes("text/calendar"));
ok("planner affiche un lien vers la source officielle", productApp.includes("if(p.site)h+=") && productApp.includes("france-visas.gouv.fr/tunisie"));
ok("planner ne collecte pas de numéro de passeport", !/<input[^>]*(?:passport|passeport)/i.test(plannerPage));
ok("planner précise que les dates ne sont pas officielles", plannerScript.includes("not official processing deadlines") && plannerScript.includes("pas des délais officiels"));
ok("planner n'utilise aucune bibliothèque distante", !/<script[^>]+src=["']https?:/i.test(plannerPage));
ok("planner possède les métadonnées de partage social", plannerPage.includes('property="og:title"') && plannerPage.includes('name="twitter:card"'));
ok("planner enregistre le service worker même en accès direct", plannerScript.includes('navigator.serviceWorker.register("./sw.js"'));
ok("planner mémorise la langue choisie", plannerScript.includes('vc-planner-lang-v1'));
ok("service worker précache les fichiers du planner", /"planner.html"[\s\S]*"planner.js"/.test(read("sw.js")));
ok("service worker ne renvoie la page d’accueil que pour une navigation", /return req\.mode === "navigate" \? await caches\.match\("\.\/"\) : null/.test(read("sw.js")));

console.log("Suivi des rendez-vous — sécurité et fiabilité");
const monitoring = read("docs/appointment-monitoring-architecture.md");
const rdvData = JSON.parse(read("rdv.json"));
ok("architecture de suivi documentée", monitoring.includes("Architecture cible") && monitoring.includes("Conditions de mise en production"));
ok("aucune disponibilité fictive dans les données actuelles", Object.values(rdvData.items).every((x) => x.days === null));
ok("les erreurs et données périmées restent inconnues", monitoring.includes("`source_error`") && monitoring.includes("Une observation expirée devient `unknown`"));
ok("aucun contournement des protections des portails", monitoring.includes("Pas de contournement de CAPTCHA"));
ok("alertes soumises à une source autorisée", monitoring.includes("contractuellement autorisée") && monitoring.includes("source officielle"));
ok("protection des données personnelles prévue", monitoring.includes("Ne jamais demander ni stocker le numéro de passeport") && monitoring.includes("Adresse e-mail vérifiée"));
ok("aucune alerte sans validation complète", monitoring.includes("Ne pas activer le bouton « Créer une alerte »"));

console.log("\n" + pass + " réussis, " + fail + " échoués");

process.exit(fail ? 1 : 0);
