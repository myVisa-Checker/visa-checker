/* Ausbildung : fiche détaillée d'un métier et annuaire d'entreprises (rendu HTML pur, aucune requête réseau).
   Règle produit : toute donnée sans source officielle s'affiche « Non confirmé » ; aucune valeur n'est inventée. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.AusFiche = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  const safeUrl = (u) => (typeof u === "string" && /^https:\/\//.test(u) ? u : "");
  const pick = (obj, lang) => (obj && (obj[lang] || obj.fr)) || null;
  const titleOf = (o, lang) => o["title_" + lang] || o.title_fr;
  const fmtDate = (iso, lang) => {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso || ""); if (!m) return iso || "";
    try { return new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])).toLocaleDateString(lang === "ar" ? "ar-TN-u-nu-latn" : lang === "en" ? "en-GB" : "fr-FR", {day: "numeric", month: "long", year: "numeric", timeZone: "UTC"}); }
    catch (e) { return iso; }
  };
  const num = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  function link(src, label) {
    const u = safeUrl(src && src.url); if (!u) return "";
    return `<a href="${esc(u)}" target="_blank" rel="noopener noreferrer">${esc(label || src.title)}</a>`;
  }
  function render(ctx) {
    const {o, data, companies, I, chosen} = ctx, t = I.t, lang = I.lang, f = o.fiche || {};
    const nc = () => `<span class="nc">${esc(t("nc"))}</span>`;
    const row = (label, valueHtml) => `<div class="frow"><dt>${esc(label)}</dt><dd>${valueHtml}</dd></div>`;
    const txt = (obj) => { const s = pick(obj, lang); return s ? esc(s) : nc(); };
    const used = new Set(); if (f.source) used.add(f.source);
    const regulated = o.training_type !== "dual";

    // A. Présentation
    const names = [["f.de", o.title_de], ["f.fr", o.title_fr], ["f.en", o.title_en], ["f.ar", o.title_ar]]
      .map(([k, v]) => row(t(k), `<span lang="${k === "f.de" ? "de" : k.slice(2)}" dir="${k === "f.ar" ? "rtl" : "ltr"}">${esc(v)}</span>`)).join("");
    const tasks = f.tasks && f.tasks[lang] && f.tasks[lang].length ? `<ul>${f.tasks[lang].map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : nc();
    const secA = `<h3>${esc(t("f.secA"))}</h3><dl class="fl">${names}</dl><p>${txt(f.summary)}</p><h4>${esc(t("f.tasks"))}</h4>${tasks}`;

    // B. Formation
    const pflege = o.id === "pflegefachkraft";
    const rowsB = [
      row(t("f.dur"), esc(I.duration(o.duration_months))),
      row(t("f.type"), esc(t(regulated ? "f.type.reg" : "f.type.dual"))),
      row(t("f.body"), f.body ? esc(f.body) : nc()),
      row(t("f.ord"), f.ordinance ? esc(f.ordinance) : nc()),
      row(t("f.admission"), pflege ? txt(f.admission) : nc()),
      row(t("f.german"), nc()),
      row(t("f.skills"), nc()),
      row(t("f.diploma"), nc())
    ];
    const structure = pflege && f.structure ? `<p>${txt(f.structure)}</p>` : "";
    const reform = o.id === "baecker" ? `<p class="reform">${esc(t("f.reform"))}</p>` : "";
    const secB = `<h3>${esc(t("f.secB"))}</h3><dl class="fl">${rowsB.join("")}</dl>${structure}${reform}`;

    // C. Argent
    let payHtml;
    if (Array.isArray(f.pay) && f.pay.length) {
      used.add("bibb_pay_2025");
      payHtml = f.pay.map((p) => `<table class="paytab"><caption>${esc(t("f.pay.scope", {s: p.scope}))}${p.row ? ` · <bdi lang="de">${esc(p.row)}</bdi>` : ""}</caption><thead><tr>${p.years.map((_, i) => `<th scope="col">${esc(t("f.pay.year", {n: i + 1}))}</th>`).join("")}</tr></thead><tbody><tr>${p.years.map((v) => `<td>${num(v)}&nbsp;€</td>`).join("")}</tr></tbody></table>`).join("") + `<p class="muted">${esc(t("f.pay.note"))}</p>`;
    } else payHtml = f.pay_text ? `<p>${txt(f.pay_text)}</p>` : nc();
    const secC = `<h3>${esc(t("f.secC"))}</h3><dl class="fl">${row(t("f.pay"), payHtml)}${row(t("f.after"), nc())}${row(t("f.costs"), pflege ? esc(pick({fr: "Formation gratuite, matériel fourni (source ministère de la Santé).", en: "Tuition free, materials provided (Ministry of Health).", ar: "التكوين مجاني والمواد مقدَّمة (وزارة الصحة)."}, lang)) : nc())}${row(t("f.gross"), Array.isArray(f.pay) && f.pay.length ? esc(t("f.gross.t")) : nc())}</dl>`;

    // D. Perspectives
    const secD = `<h3>${esc(t("f.secD"))}</h3><dl class="fl">${row(t("f.career"), pflege && f.outlook ? txt(f.outlook) : nc())}${row(t("f.sectors"), nc())}${row(t("f.pros"), nc())}${row(t("f.cons"), nc())}</dl>`;

    // E. Candidature depuis la Tunisie
    const g = data.general || {}, order = ["visa_contract", "visa_language", "visa_funds", "visa_after", "visa_search", "diploma", "recognition", "age", "apply", "where"];
    const rowsE = order.filter((k) => g[k]).map((k) => { used.add(g[k].source); return row(t("f.g." + k), txt(g[k].text)); }).join("");
    const secE = `<h3>${esc(t("f.secE"))}</h3><dl class="fl">${rowsE}${row(t("f.docs"), esc(t("f.docs.t")))}</dl><p class="warn">${esc(t("f.warn"))}</p>`;

    // F. Entreprises
    const list = (companies && companies.companies || []).filter((c) => (c.occupations || []).includes(o.id));
    const co = list.length ? list.map((c) => {
      const site = safeUrl(c.recruitment_url), direct = safeUrl(c.direct_url);
      return `<article class="co"><h4>${esc(c.name)}</h4><p class="muted">${esc(c.location || "")}</p><p>${txt(c.note)}</p><ul class="costat"><li><strong>${esc(t("f.co.listed"))}</strong></li><li>${esc(t("f.co.status", {x: c.offer_status === "open" ? t("f.co.confirmed") : t("f.co.unverified")}))}</li><li>${esc(t("f.co.intake", {x: c.intake_year || t("nc")}))}</li><li>${esc(t("f.intl", {x: t("nc")}))}</li></ul><p class="colinks">${site ? `<a class="btn secondary small" href="${esc(site)}" target="_blank" rel="noopener noreferrer">${esc(t("f.co.site"))}</a>` : ""}${direct ? ` <a class="btn secondary small" href="${esc(direct)}" target="_blank" rel="noopener noreferrer">${esc(t("f.co.apply"))}</a>` : ""}</p><p class="muted">${esc(t("f.co.verified", {d: fmtDate(companies.verified_on, lang)}))}</p></article>`;
    }).join("") : `<p>${esc(t("f.co.none"))}</p>`;
    const secF = `<h3>${esc(t("f.secF"))}</h3>${co}`;

    // Sources
    const srcs = [...used].map((id) => data.sources && data.sources[id]).filter(Boolean).map((s) => `<li>${link(s)}</li>`).join("");
    const secS = `<h3>${esc(t("f.src"))}</h3><ul class="srcs">${srcs}</ul><p class="muted">${esc(t("f.checked", {d: fmtDate(data.verified_on, lang)}))}</p><p class="muted">${esc(t("f.disc"))}</p>`;

    const on = chosen && chosen.has(o.id);
    return `<div class="fiche-top"><button type="button" class="btn secondary small" id="ficheBack">${esc(t("f.back"))}</button><button type="button" class="btn primary small" id="ficheChoose" aria-pressed="${on ? "true" : "false"}">${esc(t(on ? "f.chosen" : "f.choose"))}</button></div><h2 id="ficheH" tabindex="-1">${esc(titleOf(o, lang))}</h2><p class="de">${esc(o.title_de)}</p>${secA}${secB}${secC}${secD}${secE}${secF}${secS}`;
  }
  return Object.freeze({render, titleOf, fmtDate});
});
