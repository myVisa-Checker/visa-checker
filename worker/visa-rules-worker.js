/**
 * CheckMyVisa eligibility API.
 * Advisory rules only: never represents a visa grant or replaces an authority decision.
 * No passport number or document image is accepted or stored.
 */
const VERSION = "2026-11-11";
const COUNTRIES = {
  TN: { name: "Tunisie", passportName: "Tunisian" },
  MA: { name: "Maroc", passportName: "Moroccan" },
  DZ: { name: "Algérie", passportName: "Algerian" }
};
const DESTINATIONS = {
  SCHENGEN: {
    name: "Espace Schengen",
    rules: { TN: "visa_required", MA: "visa_required", DZ: "visa_required" },
    official: "https://home-affairs.ec.europa.eu/policies/schengen-borders-and-visa/visa-policy_en",
    passport: { minValidityAfterExitDays: 90, maxIssueAgeYears: 10, blankPages: 2 },
    note: "Visa de court séjour généralement requis pour ces nationalités. Vérifier les règles du pays principal de destination."
  },
  FR: {
    name: "France",
    rules: { TN: "visa_required", MA: "visa_required", DZ: "visa_required" },
    official: "https://france-visas.gouv.fr/",
    passport: { minValidityAfterExitDays: 90, maxIssueAgeYears: 10, blankPages: 2 },
    note: "Règles Schengen pour un court séjour. Le type de visa et la procédure dépendent du motif."
  }
};
const corsHeaders = (origin, env) => {
  const allowed = String(env.ALLOWED_ORIGIN || "https://checkmyvisa.org,https://www.checkmyvisa.org")
    .split(",").map(x => x.trim()).filter(Boolean);
  const ok = allowed.includes(origin);
  return {
    "Access-Control-Allow-Origin": ok ? origin : allowed[0],
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin"
  };
};
const json = (data, status, cors) => new Response(JSON.stringify(data), {
  status, headers: { ...cors, "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" }
});
function validDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const d = new Date(value + "T00:00:00.000Z");
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== value ? null : d;
}
function addDays(date, days) { const d = new Date(date); d.setUTCDate(d.getUTCDate() + days); return d; }
function addYears(date, years) { const d = new Date(date); d.setUTCFullYear(d.getUTCFullYear() + years); return d; }
function check(payload) {
  const nationality = String(payload?.nationality || "").toUpperCase();
  const destination = String(payload?.destination || "").toUpperCase();
  if (!COUNTRIES[nationality]) return { error: "unsupported_nationality", supported: Object.keys(COUNTRIES) };
  if (!DESTINATIONS[destination]) return { error: "destination_not_in_curated_dataset", status: "unknown", officialSources: ["https://www.iatatravelcentre.com/", "https://www.mfa.gov.tn/"] };
  const rule = DESTINATIONS[destination], requirement = rule.rules[nationality] || "unknown";
  const departure = validDate(payload.departureDate);
  const returnDate = validDate(payload.returnDate);
  const passportExpiry = validDate(payload.passportExpiry);
  const passportIssue = validDate(payload.passportIssueDate);
  const issues = [];
  if (!departure || !returnDate || returnDate < departure) issues.push("dates_invalid");
  if (!passportExpiry) issues.push("passport_expiry_missing_or_invalid");
  if (!passportIssue) issues.push("passport_issue_date_missing_or_invalid");
  if (departure && returnDate && passportExpiry) {
    if (passportExpiry < addDays(returnDate, rule.passport.minValidityAfterExitDays)) issues.push("passport_validity_below_destination_rule");
  }
  if (departure && passportIssue && passportIssue < addYears(departure, -rule.passport.maxIssueAgeYears)) issues.push("passport_issued_more_than_10_years_before_travel");
  const blanks = Number(payload.blankPages);
  if (!Number.isInteger(blanks) || blanks < 0) issues.push("blank_pages_missing_or_invalid");
  else if (blanks < rule.passport.blankPages) issues.push("insufficient_blank_pages");
  return {
    apiVersion: 1, rulesVersion: VERSION,
    nationality: { code: nationality, name: COUNTRIES[nationality].name },
    destination: { code: destination, name: rule.name },
    visaRequirement: requirement,
    result: requirement === "visa_required" ? "visa_required" : "unknown",
    passportAssessment: issues.length ? "review_required" : "basic_checks_passed",
    passportChecks: { minValidityAfterExitDays: rule.passport.minValidityAfterExitDays, maxIssueAgeYears: rule.passport.maxIssueAgeYears, blankPagesRequired: rule.passport.blankPages },
    issues, officialSource: rule.official, note: rule.note,
    disclaimer: "Information indicative et non décisionnelle. Les règles peuvent changer. Vérifiez auprès de l'autorité officielle avant tout achat ou départ."
  };
}
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const cors = corsHeaders(origin, env);
    const url = new URL(request.url);
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (origin && cors["Access-Control-Allow-Origin"] !== origin) return json({ error: "origin_not_allowed" }, 403, cors);
    if (url.pathname === "/health" && request.method === "GET") return json({ ok: true, service: "visa-checker-eligibility", rulesVersion: VERSION }, 200, cors);
    if (url.pathname === "/v1/rules" && request.method === "GET") {
      return json({ version: VERSION, nationalities: COUNTRIES, destinations: Object.fromEntries(Object.entries(DESTINATIONS).map(([k,v]) => [k,{name:v.name,officialSource:v.official,passport:v.passport,rules:v.rules}])) }, 200, cors);
    }
    if (url.pathname === "/v1/check" && request.method === "POST") {
      const length = Number(request.headers.get("Content-Length") || 0);
      if (length > 12000) return json({ error: "payload_too_large" }, 413, cors);
      let body;
      try { body = await request.json(); } catch { return json({ error: "invalid_json" }, 400, cors); }
      if (!body || typeof body !== "object" || Array.isArray(body)) return json({ error: "invalid_payload" }, 400, cors);
      return json(check(body), 200, cors);
    }
    return json({ error: "not_found" }, 404, cors);
  }
};
