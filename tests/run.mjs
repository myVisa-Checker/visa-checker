#!/usr/bin/env node
// Tests de base de CheckMyVisa. Aucune dépendance : node tests/run.mjs
// Vérifie la syntaxe des scripts, la validité des JSON, les fichiers référencés, la cohérence de version
// et le rendu de la section e-Visa pour les trois passeports (tn, ma, dz) dans les trois langues.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import vm from "node:vm";
import { posix } from "node:path";

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name + (detail ? " : " + detail : "")); } };
const read = (f) => readFileSync(f, "utf8");

console.log("Syntaxe JavaScript");
for (const f of ["vc-shared.js", "view-dossier-app.js", "view-joury-app.js", "view-entretien-app.js", "i18n/view-common.js", "i18n/view-dossier.js", "i18n/view-joury.js", "i18n/view-entretien.js", "visa-app.js", "flight-hold.js", "vols.js", "hotels.js", "joury.js", "redact.js", "avatar3d.js", "partner-form.js", "visa-pwa.js", "sw.js", "worker/visa-chat-worker.js", "worker/visa-proxy-worker.js", "worker/visa-flight-worker.js", "bump-version.mjs", "ausbildung/app.js","hostgo.js", "hostgo-hote.js", "hostgo-draft.js", "hostgo-offres.js", "hostgo-config.js", "ausbildung/career-matcher.js", "ausbildung/tests/matcher.test.js"]) {
  try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); ok(f, true); } catch (e) { ok(f, false, String(e.stderr || e.message).split("\n")[0]); }
}

console.log("JSON");
for (const f of ["manifest.json", "rdv.json", "deals.json", "version.json", "ausbildung/data/occupations.json", "ausbildung/data/companies.json", "ausbildung/schemas/occupation.schema.json"]) {
  try { JSON.parse(read(f)); ok(f, true); } catch (e) { ok(f, false, e.message); }
}

console.log("Paiement (préparation Konnect / Flouci)");
const payJs = read("visa-app.js"), payHtml = read("index.html");
ok("ancienne méthode D17 retirée", !/\bD17\b/.test(payJs));
ok("aucun montant fixe dans le parcours de paiement", !/SVC_PRICE|Payer 10 DT|Pay 10 TND/.test(payJs));
ok("Konnect et Flouci affichés comme moyens à venir", /paymentMethodsHtml/.test(payJs) && /Konnect/.test(payJs) && /flouci/.test(payJs));
ok("adresse de facturation annoncée sans collecte prématurée", /Adresse de facturation/.test(payJs) && /Aucune adresse ni donnée bancaire n’est collectée/.test(payJs));
const payCss = read("vc.css");
ok("styles des deux moyens de paiement présents", /pay-konnect/.test(payCss) && /pay-flouci/.test(payCss));

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

console.log("Réservation de vol temporaire (module flight-hold)");
{
  const fh = read("flight-hold.js"), fw = read("worker/visa-flight-worker.js");
  const url = (fh.match(/var FLIGHT_URL = "([^"]*)"/) || [])[1];
  ok("module désactivé tant que FLIGHT_URL est vide (ou en https)", url === "" || /^https:\/\//.test(url), String(url));
  ok("vol Duffel réservé au propriétaire (FLIGHT_LIVE false, ?fh=test mémorisé)", /var FLIGHT_LIVE = false;/.test(fh) && /vc-owner-flight/.test(fh) && /ownerFlight\(\)/.test(read("visa-app.js")));
  ok("billet d'avion : plus d'agences ni de serveurs, uniquement vols.html (Duffel)", !/S\.need==="flight"&&window\.VCFlightHold/.test(read("visa-app.js")) && /nd\.dataset\.need==="flight"\)\{location\.href="\.\/vols\.html"/.test(read("visa-app.js")));
  ok("Worker : filtre Hold et commande de type hold", /requires_instant_payment === false/.test(fw) && /type: "hold"/.test(fw));
  ok("Worker : contrôle d'origine et clé en secret", /origin !== allowed/.test(fw) && /env\.DUFFEL_API_KEY/.test(fw) && !/duffel_(test|live)_[A-Za-z0-9]{10,}/.test(fw));
  ok("Worker : aucune donnée passager dans les journaux", !/console\.(log|error)\([^)]*(passenger|given_name|family_name|email|phone)/.test(fw));
  ok("Worker : échéance sauvegardée en KV et statut hold/expired/issued", /holdStatus/.test(fw) && /fh:order:/.test(fw) && /\/flight\/status/.test(fw) && /"expired"/.test(fw));
  ok("récapitulatif : échéance, compte à rebours et statut « expirée » en FR/EN/AR", (fh.match(/stExpired:/g) || []).length === 3 && (fh.match(/untilT:/g) || []).length === 3 && /function paint/.test(fh));
  ok("CSP autorise le Worker visa-flight", /connect-src[^"]*visa-flight\.rabehfly\.workers\.dev/.test(html));
  ok("clic « Billet d'avion » ouvre vols.html (si le module est actif)", /data-need[\s\S]{0,40}|nd\.dataset\.need==="flight"/.test(read("visa-app.js")) && /vols\.html/.test(read("visa-app.js")));
  ok("vols.html : CSP autorise le Worker visa-flight, scripts locaux seulement", /connect-src[^"]*visa-flight\.rabehfly\.workers\.dev/.test(read("vols.html")) && !/<script(?![^>]*src=)/.test(read("vols.html")));
  ok("Worker : /flight/places et classe de cabine validée", /\/flight\/places/.test(fw) && /CABINS/.test(fw));
  ok("vols.js : FR/EN/AR et page inactive tant que le module est caché", (read("vols.js").match(/untilT:/g) || []).length === 3 && /FH\.enabled\(\)/.test(read("vols.js")));
  ok("fichiers du module dans le cache hors ligne", /"flight-hold\.js"/.test(read("sw.js")) && /"flight-hold\.css"/.test(read("sw.js")));
  ok("récapitulatif : mention « non émis » et date limite présentes en FR/EN/AR", (fh.match(/badge:/g) || []).length === 3 && (fh.match(/doc:/g) || []).length === 3);
}

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
ok("liste des pièces manquantes annoncée aux technologies d'assistance", /role="status" aria-live="polite"/.test(checklistJs) && /\.missing-docs/.test(read("vc.css")));


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
ok("les lettres payantes ne sont plus dans le code public", !/const PACK = \[/.test(proxy) && !proxy.includes('"id":"m_employee"') && !proxy.includes("Commission de recours contre les décisions de refus"));
ok("formulaire /admin/pack présent, sans script", /path === "\/admin\/pack"/.test(proxy) && /form-action 'self'/.test(proxy));
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
// Pages Aïcha, Joury, Saden : traduites en EN/AR (plus de data-fr-only), scripts externes, dictionnaires complets.
console.log("Traductions des pages Aïcha, Joury et Saden");
for (const [f, dic] of [["view-dossier.html", "view-dossier"], ["view-joury.html", "view-joury"], ["view-entretien.html", "view-entretien"]]) {
  const h = read(f);
  ok("plus de data-fr-only dans " + f, !/data-fr-only/.test(h));
  ok("dictionnaires chargés par " + f, h.includes('i18n/view-common.js') && h.includes("i18n/" + dic + ".js"));
  ok("aucun script inline dans " + f, ![...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].length);
  const entries = {}; vm.runInNewContext(read("i18n/view-common.js") + "\n" + read("i18n/" + dic + ".js"), { VC: { add: (o) => Object.assign(entries, o) } });
  const bad = Object.entries(entries).filter(([k, v]) => !Array.isArray(v) || v.length !== 2 || !v[0] || !v[1] || (/[\u0600-\u06FF]/.test(v[0]) && v[0] !== v[1]) || !/[\u0600-\u06FF]/.test(v[1]) && !/^[\w <>"=/\u2190-\u2193.:-]+$/.test(v[1]));
  ok("dictionnaire " + dic + " : " + Object.keys(entries).length + " entrées EN et AR complètes", bad.length === 0, bad.slice(0, 2).map((e) => e[0]).join(" | "));
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

console.log("Workers visa-proxy et visa-chat : durcissements (exécution)");
try {
  execFileSync(process.execPath, ["tests/workers-hardening.test.mjs"], { stdio: "inherit" });
  ok("workers-hardening : codes, limites, validation, verrous", true);
} catch (e) {
  ok("workers-hardening : codes, limites, validation, verrous", false, String(e.stderr || e.message).split("\n")[0]);
}

console.log("Worker visa-proxy : rendez-vous en direct (exécution)");
try {
  execFileSync(process.execPath, ["tests/rdv-worker.test.mjs"], { stdio: "inherit" });
  ok("rdv-worker : signalements, confirmation à 3 appareils, délais, limites", true);
} catch (e) {
  ok("rdv-worker : signalements, confirmation à 3 appareils, délais, limites", false, String(e.stderr || e.message).split("\n")[0]);
}
ok("hostgo.html : CSP, script externe, sitemap et cache hors ligne", /script-src 'self'/.test(read("hostgo.html")) && !/<script>[^<]/.test(read("hostgo.html")) && /hostgo\.html/.test(read("sitemap.xml")) && /hostgo\.html/.test(read("sw.js")) && /hostgo\.css/.test(read("sw.js")) && /hostgo-teaser\.css/.test(read("sw.js")) && /hostgo-teaser\.css/.test(read("index.html")));
ok("vitrine Host & Go : modèle d'accueil branché, sans les six profils", /id="hg-tpl"/.test(read("index.html")) && /getElementById\("hg-tpl"\)/.test(read("visa-app.js")) && !/Host &amp; Work|Étudiant/.test(read("index.html").split('id="hg-tpl"')[1].split("</template>")[0]));
ok("Host & Go : deux rôles (Hôte, Voyageur / Worker) puis six thèmes d'échange", /data-role="host"/.test(read("hostgo.html")) && /data-role="traveler-worker"/.test(read("hostgo.html")) && ["family","farm","garden","guesthouse","exchange","pets"].every((id) => read("hostgo.js").includes('id: "' + id + '"')) && !/Étudiant|Professionnel/i.test(read("hostgo.html") + read("hostgo.js")));
ok("Host & Go : parcours voyageur (formules, compte sans mot de passe ni carte, /contact, liens légaux, cache hors ligne, sitemap, lien depuis le rôle)", !/type="password"|type="tel"|cc-number|cardnumber/i.test(read("hostgo-voyageur.html")) && /href="\.\/conditions\.html"/.test(read("hostgo-voyageur.html")) && /href="\.\/confidentialite\.html"/.test(read("hostgo-voyageur.html")) && /visa-chat\.rabehfly\.workers\.dev\/contact/.test(read("hostgo-voyageur.js")) && read("worker/visa-chat-worker.js").includes("Partenariat / Autre demande") && read("hostgo-voyageur.js").includes('SUBJECT = "Partenariat / Autre demande"') && ["hostgo-voyageur.html","hostgo-voyageur.css","hostgo-voyageur.js"].every((f) => read("sw.js").includes(f)) && /hostgo-voyageur\.html/.test(read("sitemap.xml")) && /hostgo-voyageur\.html/.test(read("hostgo.js")) && !/workaway|Go & Host|go&host/i.test(read("hostgo-voyageur.html") + read("hostgo-voyageur.js") + read("hostgo-voyageur.css")) && !/id="hg-form"/.test(read("hostgo.html")));
ok("Host & Go : inscription hôte (sans mot de passe, liens légaux, /contact, cache hors ligne, sitemap)", !/type="password"|type="tel"/.test(read("hostgo-hote.html")) && /href="\.\/conditions\.html"/.test(read("hostgo-hote.html")) && /href="\.\/confidentialite\.html"/.test(read("hostgo-hote.html")) && !/id="terms"[^>]*>[^]*href="#terms"/.test(read("hostgo-hote.html")) && /visa-chat\.rabehfly\.workers\.dev\/contact/.test(read("hostgo-hote.js")) && /hostgo-hote\.html/.test(read("sw.js")) && /hostgo-hote\.html/.test(read("sitemap.xml")) && /hostgo-hote\.html/.test(read("hostgo.html")) && !/Go & Host|go&host|workaway/i.test(read("hostgo-hote.html") + read("hostgo-hote.js") + read("hostgo-hote.css")) && ["st1","st2","ac","ty","pl","av","st3","cx","lg","st4","am","ad","oi","ph","st5"].every((i) => read("hostgo-hote.html").includes('id="' + i + '"')));
ok("images Host & Go présentes et listées dans le cache hors ligne", ["hero","voyageur","hote"].every((n) => existsSync("images/hostgo/" + n + ".webp") && read("sw.js").includes("images/hostgo/" + n + ".webp")));
ok("Host & Go : six thèmes illustrés en bas de page (FR/EN/AR) et images en cache hors ligne", ["famille","ferme","jardin","hotes","echange","animaux"].every((n) => existsSync("images/hostgo/theme-" + n + ".webp") && read("sw.js").includes("images/hostgo/theme-" + n + ".webp") && read("hostgo.html").includes("theme-" + n + ".webp")) && ["Vie en famille","Fermes et agriculture","Jardinage et nature","Maisons d'hôtes","Échange culturel et linguistique","Animaux et gardiennage"].every((t) => read("hostgo.js").includes(t)));

console.log("Worker visa-flight : routes hôtels (exécution)");
try {
  execFileSync(process.execPath, ["tests/hotels-worker.test.mjs"], { stdio: "inherit" });
  ok("hotels-worker : villes, recherche, chambres annulables, réservation fermée par défaut", true);
} catch (e) {
  ok("hotels-worker : villes, recherche, chambres annulables, réservation fermée par défaut", false, String(e.stderr || e.message).split("\n")[0]);
}
try {
  execFileSync(process.execPath, ["tests/flight-book-guard.test.mjs"], { stdio: "inherit" });
  ok("flight-book-guard : interrupteur d'urgence et Turnstile sur /flight/book", true);
} catch (e) {
  ok("flight-book-guard : interrupteur d'urgence et Turnstile sur /flight/book", false, String(e.stderr || e.message).split("\n")[0]);
}
try {
  execFileSync(process.execPath, ["tests/chat-worker-guard.test.mjs"], { stdio: "inherit" });
  ok("chat-worker-guard : Turnstile sur assistants IA, /partner et /contact", true);
} catch (e) {
  ok("chat-worker-guard : Turnstile sur assistants IA, /partner et /contact", false, String(e.stderr || e.message).split("\n")[0]);
}
{
  const hh = read("hotels.html"), hj = read("hotels.js"), swc = read("sw.js");
  ok("hotels.html : CSP autorise le Worker visa-flight, scripts locaux seulement", /connect-src[^"]*visa-flight\.rabehfly\.workers\.dev/.test(hh) && !/<script(?![^>]*src=)/.test(hh));
  ok("hotels.js : FR/EN/AR et page inactive tant que le module est caché", (hj.match(/confirm:/g) || []).length === 3 && (hj.match(/whyT:/g) || []).length === 3 && /FH\.enabled\(\)/.test(hj));
  ok("hotels.js : réservation d'hôtel annoncée « bientôt » si le Worker la ferme", /booking_disabled/.test(hj) && (hj.match(/soon:/g) || []).length === 3);
  ok("hotels : fichiers dans le cache hors ligne", ["hotels.html", "hotels.js", "hotels.css", "images/hero-hotels.jpg"].every((f) => swc.includes('"' + f + '"') && existsSync(f)));
  ok("« Réservation d'hôtel » ouvre hotels.html seulement pour le propriétaire", /need==="hotel"&&ownerFlight\(\)\)\{location\.href="\.\/hotels\.html"/.test(read("visa-app.js")));
}

console.log("Ausbildung Career Matcher (module intégré dans /ausbildung/)");
try {
  execFileSync(process.execPath, ["ausbildung/tests/matcher.test.js"], { stdio: "inherit" });
  execFileSync(process.execPath, ["ausbildung/tests/i18n.test.js"], { stdio: "inherit" });
  execFileSync(process.execPath, ["ausbildung/tests/data.test.js"], { stdio: "inherit" });
  ok("ausbildung : moteur, catalogue, schéma et vocabulaire du questionnaire", true);
} catch (e) {
  ok("ausbildung : moteur, catalogue, schéma et vocabulaire du questionnaire", false, String(e.stderr || e.message).split("\n")[0]);
}
{
  const ah = read("ausbildung/index.html"), aa = read("ausbildung/app.js"), swa = read("sw.js"), idx = read("index.html"), cmn = read("visa-app.js");
  const csp = (ah.match(/http-equiv="Content-Security-Policy" content="([^"]*)"/) || [])[1] || "";
  ok("ausbildung/index.html : CSP stricte, aucun script inline, aucune ressource externe", /script-src 'self'/.test(csp) && /object-src 'none'/.test(csp) && /form-action 'none'/.test(csp) && !/script-src[^;]*'unsafe-inline'/.test(csp) && !/<script(?![^>]*\bsrc=)/.test(ah) && !/(?:src|href)="https?:\/\/(?!checkmyvisa\.org)/.test(ah.replace(/<link rel="canonical"[^>]*>/, "")));
  ok("ausbildung/index.html : aucune requête réseau vers un tiers (connect-src 'self')", /connect-src 'self'(;|")/.test(csp));
  const aref = [...ah.matchAll(/(?:src|href)="(\.{1,2}\/[^"#?]*)(?:\?[^"]*)?"/g)].map((m) => m[1]);
  const missingA = [...new Set(aref)].filter((r) => !existsSync(posix.normalize("ausbildung/" + r)));
  ok("ausbildung/index.html : fichiers référencés présents", missingA.length === 0, missingA.join(", "));
  ok("ausbildung/app.js : catalogue chargé en relatif, aucun envoi de données", /fetch\("\.\/data\/occupations\.json"\)/.test(aa) && !/method\s*:\s*["']POST|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|document\.cookie/.test(aa));
  ok("ausbildung : plus dans la navigation du haut (accueil et pages), accès par la carte d'accueil et le pied de page", !/<li><a href="[^"]*">Ausbildung<\/a><\/li>/.test(idx) && ["a-propos.html", "contact.html", "faq.html", "guide-visa.html", "partenaires.html", "ausbildung/index.html"].every((f) => !/<li><a href="[^"]*">Ausbildung<\/a><\/li>/.test(read(f))) && /<div class="links">[^\n]*href="\.\/ausbildung\/">Ausbildung<\/a>/.test(idx));
  ok("ausbildung : question « expérience » en cases à cocher (réponses multiples, « Aucune expérience » exclusive)", /\{id:"experience",values:\[[^\]]*\],multi:true\}/.test(aa) && /\{id:"education",values:\[[^\]]*\]\}/.test(aa) && /"training"/.test(aa.match(/\{id:"experience",values:\[[^\]]*\]/)[0]) && /t\.value === "none"/.test(aa));
  ok("ausbildung : libellés de navigation FR/EN/AR de l'accueil", (cmn.match(/"\.\/ausbildung\/":"Ausbildung"/g) || []).length === 3);
  const tpl = idx.slice(idx.indexOf('<template id="aus-tpl">'), idx.indexOf("</template>"));
  ok("accueil : carte Ausbildung active (carte entière cliquable vers ./ausbildung/ en FR, EN et AR, plus de « bientôt »)", (tpl.match(/<a class="aus-in aus-link" lang="(?:fr|en|ar)"[^>]* href="\.\/ausbildung\/"><img /g) || []).length === 3 && !/BIENTÔT|COMING SOON|قريباً<\/p>/.test(tpl));
  ok("accueil : carte Ausbildung compacte, images présentes, texte alternatif non vide et mises en cache hors ligne", ["images/ausbildung-card-480.webp", "images/ausbildung-card-800.webp"].every((f) => existsSync(f) && swa.includes('"' + f + '"')) && (tpl.match(/ alt="[^"]{20,}"/g) || []).length === 3 && !/aus-cta|aus-steps|aus-word/.test(tpl + read("vc.css")));
  ok("ausbildung : fichiers du module dans le cache hors ligne", ["ausbildung/", "ausbildung/ausbildung.css", "ausbildung/career-matcher.js", "ausbildung/app.js", "ausbildung/i18n.js", "ausbildung/fiche.js", "ausbildung/data/occupations.json", "ausbildung/data/companies.json"].every((f) => swa.includes('"' + f + '"')));
  ok("service worker : catalogue Ausbildung servi hors ligne (règle JSON dédiée)", /isAusbildungData/.test(swa) && /ausbildung\\\/data/.test(swa));
  ok("ausbildung : passerelle vers le dossier visa et impression du résultat", /id="toVisa" href="\.\.\/\?accueil=1"/.test(ah) && /id="print"/.test(ah) && /window\.print\(\)/.test(aa) && /@media print/.test(read("ausbildung/ausbildung.css")));
  ok("guide Ausbildung : page, carte dans Guide, précache, sitemap, CSP", existsSync("guide-ausbildung.html") && /guide-ausbildung\.html/.test(read("guide-visa.html")) && /"guide-ausbildung\.html"/.test(swa) && /guide-ausbildung\.html/.test(read("sitemap.xml")) && /script-src 'self'/.test(read("guide-ausbildung.html")));
  ok("ausbildung : page dans le sitemap", /checkmyvisa\.org\/ausbildung\//.test(read("sitemap.xml")));
}

{
  const oh = read("hostgo-offres.html"), oj = read("hostgo-offres.js");
  ok("Host & Go offres : page sans script en ligne, noindex tant que l'API n'est pas déployée, CSP limitée au Worker visa-hostgo", !/<script(?![^>]*\bsrc=)/.test(oh) && /name="robots" content="noindex"/.test(oh) && /connect-src 'self' https:\/\/visa-hostgo\.rabehfly\.workers\.dev/.test(oh) && !/unsafe-eval/.test(oh));
  ok("Host & Go offres : textes d'offres insérés en textContent (pas d'innerHTML ni eval)", !/innerHTML|insertAdjacentHTML|document\.write|eval\(|new Function/.test(oj));
  ok("Host & Go offres : adresse de l'API identique au Worker et aux routes testées", /workers\.dev\/hg"/.test(oj) && ["/offers", "/session", "/unlock", "/report", "/contact"].every((x) => oj.includes(x)));
  ok("Host & Go offres : disponible hors ligne (cache) mais absent du sitemap tant qu'il n'est pas ouvert", read("sw.js").includes('"hostgo-offres.js"') && !read("sitemap.xml").includes("hostgo-offres"));
}
try {
  execFileSync(process.execPath, ["tests/hostgo-worker.test.mjs"], { stdio: "inherit" });
  ok("hostgo-worker : offres, filtres, signalement, modération, accès gratuit et déblocage", true);
} catch (e) {
  ok("hostgo-worker : offres, filtres, signalement, modération, accès gratuit et déblocage", false, String(e.stderr || e.message).split("\n")[0]);
}
try {
  execFileSync(process.execPath, ["tests/hostgo-draft.test.mjs"], { stdio: "inherit" });
  ok("hostgo-draft : sauvegarde progressive, reprise, protection des données, anti-doublon", true);
} catch (e) {
  ok("hostgo-draft : sauvegarde progressive, reprise, protection des données, anti-doublon", false, String(e.stderr || e.message).split("\n")[0]);
}
{
  const hh = read("hostgo-hote.html"), hj = read("hostgo-hote.js");
  ok("Host & Go hôte : module de brouillon chargé avant le formulaire, en script externe, et mis en cache hors ligne", hh.indexOf("hostgo-draft.js") > 0 && hh.indexOf("hostgo-draft.js") < hh.indexOf("hostgo-hote.js") && read("sw.js").includes('"hostgo-draft.js"'));
  ok("Host & Go hôte : API derrière un drapeau éteint par défaut, configuration chargée avant le formulaire, CSP et cache à jour", /apiEnabled:\s*false/.test(read("hostgo-config.js")) && hh.indexOf("hostgo-config.js") > 0 && hh.indexOf("hostgo-config.js") < hh.indexOf("hostgo-hote.js") && /connect-src[^"]*visa-hostgo\.rabehfly\.workers\.dev/.test(hh) && read("sw.js").includes('"hostgo-config.js"') && /noindex/.test(read("hostgo-offres.html")));
  ok("Host & Go hôte : envoi API avec identifiant de demande, délai, jeton hors localStorage, photos vérifiées par signature", /CFG\.apiEnabled/.test(hj) && /sid: sid/.test(hj) && /TIMEOUT = 15000/.test(hj) && /AbortController/.test(hj) && /sniff\(/.test(hj) && /PH_TOTAL/.test(hj) && !/localStorage\.setItem\("hg_manage"/.test(hj));
  ok("Host & Go hôte : bandeau de reprise et état de sauvegarde présents", /id="draft-banner"/.test(hh) && /id="draft-status"[^>]*aria-live="polite"/.test(hh) && /id="draft-resume"/.test(hh) && /id="draft-restart"/.test(hh));
  ok("Host & Go hôte : textes du brouillon en FR, EN et AR", ["fr", "en", "ar"].every((l) => new RegExp("\\b" + l + ": \\{ title:").test(hj)));
  ok("Host & Go hôte : envoi sans doublon (verrou, identifiant de demande, parties déjà envoyées ignorées)", /if \(sending\) return/.test(hj) && /Réf\. demande/.test(hj) && /planParts/.test(hj) && /rememberSent/.test(hj));
  ok("Host & Go hôte : aucun consentement ni photo écrit dans le stockage", !/localStorage\.setItem\([^)]*(terms|marketing)/.test(hj) && !/hg_host_draft[^;]*(terms|marketing)/.test(hj));
}

console.log("\n" + pass + " réussis, " + fail + " échoués");

process.exit(fail ? 1 : 0);
