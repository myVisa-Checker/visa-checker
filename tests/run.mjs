#!/usr/bin/env node
// Tests de base de CheckMyVisa. Aucune dépendance : node tests/run.mjs
// Vérifie la syntaxe des scripts, la validité des JSON, les fichiers référencés, la cohérence de version
// et le rendu de la section e-Visa pour les trois passeports (tn, ma, dz) dans les trois langues.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import vm from "node:vm";

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name + (detail ? " : " + detail : "")); } };
const read = (f) => readFileSync(f, "utf8");

console.log("Syntaxe JavaScript");
for (const f of ["visa-app.js", "joury.js", "redact.js", "avatar3d.js", "partner-form.js", "visa-pwa.js", "sw.js", "worker/visa-chat-worker.js", "worker/visa-proxy-worker.js", "bump-version.mjs"]) {
  try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); ok(f, true); } catch (e) { ok(f, false, String(e.stderr || e.message).split("\n")[0]); }
}

console.log("JSON");
for (const f of ["manifest.json", "partners.json", "rdv.json", "deals.json", "version.json"]) {
  try { JSON.parse(read(f)); ok(f, true); } catch (e) { ok(f, false, e.message); }
}

console.log("Paiement (préparation Konnect / Flouci)");
const payJs = read("visa-app.js"), payHtml = read("index.html");
ok("ancienne méthode D17 retirée", !/\bD17\b/.test(payJs));
ok("aucun montant fixe dans le parcours de paiement", !/SVC_PRICE|Payer 10 DT|Pay 10 TND/.test(payJs));
ok("Konnect et Flouci affichés comme moyens à venir", /paymentMethodsHtml/.test(payJs) && /Konnect/.test(payJs) && /flouci/.test(payJs));
ok("adresse de facturation annoncée sans collecte prématurée", /Adresse de facturation/.test(payJs) && /Aucune adresse ni donnée bancaire n’est collectée/.test(payJs));
ok("styles des deux moyens de paiement présents", /pay-konnect/.test(payHtml) && /pay-flouci/.test(payHtml));

console.log("Fichiers référencés par index.html");
const html = read("index.html");
const refs = [...html.matchAll(/(?:src|href)="([^"#?]+)(?:\?[^"]*)?"/g)].map((m) => m[1])
  .filter((r) => !/^(https?:|data:|mailto:|tel:|\/\/)/.test(r));
for (const r of [...new Set(refs)]) ok(r, r === "/" || existsSync(r.replace(/^\//, "")));

console.log("Sitemap");
const urls = [...read("sitemap.xml").matchAll(/<loc>https:\/\/checkmyvisa\.org\/([^<]*)<\/loc>/g)].map((m) => m[1]);
for (const u of urls) { const p = u === "" ? "index.html" : u.endsWith("/") ? u + "index.html" : u; ok("sitemap : " + (u || "/"), existsSync(p)); }

console.log("Version");
const vj = JSON.parse(read("version.json")).version;
const sw = (read("sw.js").match(/const VERSION = "([^"]*)"/) || [])[1];
ok("sw.js et version.json ont la même version", vj === sw, vj + " / " + sw);

console.log("Sécurité (contrôles simples)");
ok("CSP présente dans index.html", /Content-Security-Policy/.test(html));
ok("CSP interdit les objets et les formulaires externes", /object-src 'none'/.test(html) && /form-action 'none'/.test(html));
const secretRe = /(AIza[0-9A-Za-z_-]{30,}|sk-[A-Za-z0-9]{20,}|-----BEGIN [A-Z ]*PRIVATE KEY-----)/;
for (const f of ["visa-app.js", "joury.js", "visa-pwa.js", "index.html", "worker/visa-chat-worker.js", "worker/visa-proxy-worker.js"]) ok("aucune clé secrète dans " + f, !secretRe.test(read(f)));
const workerCode = read("worker/visa-chat-worker.js").split("\n").filter((l) => !/^\s*\/\//.test(l)).join("\n");
ok("aucun prestataire de paiement n'est codé en dur", !/KONNECT|FLOUCI|D17|PAY_MOCK/.test(workerCode));
ok("création et vérification de paiement désactivées explicitement", /body\.action === "pay_create" \|\| body\.action === "pay_check"/.test(workerCode) && /payment_unavailable/.test(workerCode));
ok("accès par codes existants conservé", /INTERVIEW_CODES/.test(workerCode) && /mint:/.test(workerCode));
ok("limite KV documentée comme best-effort", /KV n'offre pas d'incrément atomique/.test(read("worker/visa-chat-worker.js")));

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

const jouryHtml = read("joury.html"), jouryJs = read("joury.js"), worker = read("worker/visa-chat-worker.js");
ok("ancienne bulle Assistant CheckMyVisa retirée", !/id="vc-btn"/.test(html) && !/id="vc-box"/.test(html));
const appSrc = read("visa-app.js");
ok("accès Joury et Aicha depuis l'accueil", /vc-hero-assistant/.test(appSrc) && /joury\.html/.test(appSrc) && /view-dossier\.html/.test(appSrc));
ok("ancien bouton flottant Joury retiré (HTML et CSS)", !/joury-fab/.test(html));
ok("Aicha dispose d’un import documentaire", /id="aichaFile"/.test(jouryHtml) && /id="aichaAnalyse"/.test(jouryHtml));
ok("accès entretien Aicha contrôlé par code", /id="aichaCode"/.test(jouryHtml) && /mode:"interview",check:true/.test(jouryJs));
ok("modes Joury et Aicha séparés", /mode:mode\|\|""/.test(jouryJs) && /joury-refusal/.test(jouryJs) && /aicha-review/.test(jouryJs));
ok("prompts spécialisés présents dans le Worker", /SYSTEM_JOURY_REFUSAL/.test(worker) && /SYSTEM_AICHA_REVIEW/.test(worker) && /Tu es Aicha/.test(worker));

console.log("Checklist personnalisée et détection des pièces manquantes");
const checklistJs = read("visa-app.js");
const checklistHtml = read("index.html");
ok("détection dynamique des documents obligatoires manquants", /var missing=req\.filter\(function\(i\)\{return !S\.done\[i\.id\]\}\)/.test(checklistJs) && /missing\.map\(function\(i\)\{return '<li>'\+i\[S\.lang\]\[0\]/.test(checklistJs));
ok("état vide explicite quand toutes les pièces sont cochées", /allDone:"Tous les documents obligatoires sont cochés"/.test(checklistJs));
ok("aucun score de préparation ni pourcentage dans le rendu checklist", !/aria-valuenow|pct\+" %|Avancement du dossier|File progress/.test(checklistJs.slice(checklistJs.indexOf("function render(){"), checklistJs.indexOf("function go("))) && !/id="barfill"/.test(checklistHtml));
ok("liste des pièces manquantes annoncée aux technologies d'assistance", /role="status" aria-live="polite"/.test(checklistJs) && /\.missing-docs/.test(checklistHtml));


console.log("Assistants : suppression des anciens accès séparés");
const assistantJs = read("visa-app.js");
ok("ancienne carte Entraînement entretien retirée", !/function ivCardHtml\(/.test(assistantJs) && !/\+ivCardHtml\(\)/.test(assistantJs));
ok("ancienne carte AI Visa Recovery retirée", !/function recoveryCardHtml\(/.test(assistantJs) && !/\+recoveryCardHtml\(\)/.test(assistantJs));
ok("ancien bloc entretien autonome retiré de la checklist", !/\+interviewHtml\(\)/.test(assistantJs));
ok("ancien bouton entretien autonome (dont USA) retiré", !assistantJs.includes("data-iv-open") && !assistantJs.includes("IVICON"));
ok("espace Joury/Aicha conserve ses deux cartes", (jouryHtml.match(/class="action assistant-card /g) || []).length === 2);

console.log("Worker visa-proxy (versionné dans le dépôt)");
const proxy = read("worker/visa-proxy-worker.js");
const proxyCode = proxy.split("\n").filter((l) => !/^\s*(\/\/|\/?\*)/.test(l)).join("\n");
ok("PACK du recours et des 4 motivations présent", /const PACK = \[/.test(proxy) && ["recours", "m_employee", "m_self", "m_student", "m_retired"].every((id) => proxy.includes('"id":"' + id + '"')));
ok("aucun reste du fournisseur IA abandonné (ANTHROPIC, x-api-key)", !/ANTHROPIC|x-api-key|AI_MODEL/.test(proxyCode));
ok("aucune route du Radar RDV supprimé", !/\/radar|RADAR_/.test(proxyCode));
ok("origines par défaut : domaine officiel seulement", /DEFAULT_ORIGINS = "https:\/\/checkmyvisa\.org,https:\/\/www\.checkmyvisa\.org"/.test(proxy));
ok("chaque route payante vérifie l'origine et le jeton", (proxyCode.match(/checkToken\(env, tok, "pack"\)/g) || []).length >= 3);
ok("visa-chat : ancien domaine github.io retiré des origines", !/github\.io/.test(read("worker/visa-chat-worker.js")));

console.log("Service worker : précache");
const swSrc = read("sw.js");
const pre = [...(swSrc.match(/const PRECACHE = \[([\s\S]*?)\];/) || ["", ""])[1].matchAll(/"([^"]+)"/g)].map((m) => m[1]);
ok("liste de précache lue", pre.length > 10, String(pre.length));
for (const u of pre) ok("précache : " + u, u === "./" ? existsSync("index.html") : existsSync(u));
for (const f of ["visa-app.js", "visa-pwa.js", "avatar3d.js", "redact.js"]) ok("précache contient " + f, pre.includes(f));

console.log("Pages : CSP, 404, fichiers hérités");
for (const f of ["index.html", "joury.html", "aicha.html", "partenaires.html", "a-propos.html", "guide-visa.html", "faq.html", "contact.html", "conditions.html", "confidentialite.html"]) {
  const h = read(f);
  ok("CSP dans " + f, /Content-Security-Policy/.test(h) && /object-src 'none'/.test(h) && /script-src 'self'/.test(h));
}
// Pages view-* : CSP avec empreinte (sha256) de chaque script inline. Si un script inline change,
// ce test échoue et indique qu'il faut recalculer l'empreinte (sinon le navigateur bloquerait le script).
for (const f of ["view-dossier.html", "view-joury.html", "view-entretien.html", "view-recours.html"]) {
  const h = read(f);
  const csp = (h.match(/http-equiv="Content-Security-Policy" content="([^"]*)"/) || [])[1] || "";
  ok("CSP dans " + f, /object-src 'none'/.test(csp) && /script-src 'self'/.test(csp) && !/script-src[^;]*'unsafe-inline'/.test(csp) && !/connect-src[^;]*\*/.test(csp));
  const inline = [...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1].replace(/\r\n/g, "\n"));
  const missing = inline.filter((code) => !csp.includes("'sha256-" + createHash("sha256").update(code, "utf8").digest("base64") + "'"));
  ok("empreintes des scripts inline à jour dans " + f, missing.length === 0, missing.length + " script(s) sans empreinte");
  ok("noindex dans " + f, /name="robots" content="noindex"/.test(h));
}
ok("404.html présente", existsSync("404.html"));
for (const f of ["app.js", "data.js", "style.css", "visa-chat.js", "chat-loader.js", "LISEZMOI.txt", "icon-192.png", "icon-512.png", "maskable-512.png", "apple-touch-icon.png", "icons/radar-rdv.webp"]) ok("fichier hérité absent : " + f, !existsSync(f));
ok("index.html : canonical et og:image", /rel="canonical"/.test(html) && /property="og:image"/.test(html));
ok("index.html : plus de règles CSS de l'ancienne bulle", !/#vc-(btn|box|head|msgs)/.test(html));

console.log("Worker visa-rules : tests d'exécution");
try {
  execFileSync(process.execPath, ["tests/visa-rules-worker.test.mjs"], { stdio: "inherit" });
  ok("visa-rules-worker : API, règles, validation et CORS", true);
} catch (e) {
  ok("visa-rules-worker : API, règles, validation et CORS", false, String(e.stderr || e.message).split("\n")[0]);
}

console.log("\n" + pass + " réussis, " + fail + " échoués");

process.exit(fail ? 1 : 0);
