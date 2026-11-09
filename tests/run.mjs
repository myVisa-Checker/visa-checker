#!/usr/bin/env node
// Tests de base de Visa Checker. Aucune dépendance : node tests/run.mjs
// Vérifie la syntaxe des scripts, la validité des JSON, les fichiers référencés, la cohérence de version
// et le rendu de la section e-Visa pour les trois passeports (tn, ma, dz) dans les trois langues.
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import vm from "node:vm";

let pass = 0, fail = 0;
const ok = (name, cond, detail = "") => { if (cond) { pass++; console.log("  ok   " + name); } else { fail++; console.log("  FAIL " + name + (detail ? " : " + detail : "")); } };
const read = (f) => readFileSync(f, "utf8");

console.log("Syntaxe JavaScript");
for (const f of ["visa-app.js", "visa-chat.js", "visa-pwa.js", "sw.js", "worker/visa-chat-worker.js", "bump-version.mjs"]) {
  try { execFileSync(process.execPath, ["--check", f], { stdio: "pipe" }); ok(f, true); } catch (e) { ok(f, false, String(e.stderr || e.message).split("\n")[0]); }
}

console.log("JSON");
for (const f of ["manifest.json", "partners.json", "rdv.json", "reviews.json", "deals.json", "version.json"]) {
  try { JSON.parse(read(f)); ok(f, true); } catch (e) { ok(f, false, e.message); }
}

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
for (const f of ["visa-app.js", "visa-chat.js", "visa-pwa.js", "index.html", "worker/visa-chat-worker.js", "data.js", "app.js"]) ok("aucune clé secrète dans " + f, !secretRe.test(read(f)));
const workerCode = read("worker/visa-chat-worker.js").split("\n").filter((l) => !/^\s*\/\//.test(l)).join("\n");
ok("PAY_MOCK n'est pas activé en dur dans le Worker (commentaires ignorés)", !/PAY_MOCK\s*=\s*["']?1/.test(workerCode));

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
  ok("règles de transparence partenaires", p.includes("Aucune commission ne peut influencer") && p.includes("faux documents"));
}
const productApp = read("visa-app.js");
console.log("Moteur de checklist et couverture");
ok("marque du parcours neutre selon le passeport", productApp.includes('stamp:"Voyageurs"') && productApp.includes('stamp:"Travellers"') && productApp.includes('stamp:"المسافرون"'));
ok("interface sans promesse de liste exacte ou exhaustive", !/liste exacte des documents|exact list of documents|القائمة الدقيقة للوثائق/.test(productApp));
ok("disclaimer de préparation indicatif pour les destinations tunisiennes hors France", productApp.includes("Cette checklist est un outil indicatif de préparation") && productApp.includes("not an exhaustive official list"));
const coverage = read("guide/couverture-provisoire.md");
ok("matrice provisoire corrigée à 22 parcours Schengen", coverage.includes("22 combinaisons") && coverage.includes("7 destinations Schengen") && coverage.includes("5 destinations Schengen"));
ok("matrice distingue parcours présents et validation officielle", coverage.includes("pas une validation officielle") && coverage.includes("Cela ne vaut pas certification de l'exhaustivité"));
ok("catégories partenaires intégrées au parcours", ["SPT.sTr", "SPT.sDoc", "SPT.sEsim"].every((x) => productApp.includes(x)));
ok("accès au programme partenaires depuis l'accueil", productApp.includes('href="partenaires.html"'));
const ivStart = productApp.indexOf("var IVT=");
const ivEnd = productApp.indexOf("\nvar IVOPEN", ivStart);
const ivText = productApp.slice(ivStart, ivEnd > ivStart ? ivEnd : ivStart + 6000);
ok("conseils d'entretien non limités à la Tunisie", !/Tunisie|Tunisia|تونس/.test(ivText));

console.log("\n" + pass + " réussis, " + fail + " échoués");
process.exit(fail ? 1 : 0);
