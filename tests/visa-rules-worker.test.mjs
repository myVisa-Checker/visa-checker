import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const source = await readFile(new URL("../worker/visa-rules-worker.js", import.meta.url), "utf8");
const encoded = Buffer.from(source, "utf8").toString("base64");
const { default: worker } = await import("data:text/javascript;base64," + encoded);
const origin = "https://checkmyvisa.org";

async function request(path, { method = "GET", body, headers = {} } = {}) {
  return worker.fetch(new Request("https://worker.test" + path, {
    method,
    headers: { Origin: origin, ...headers, ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
    body: body === undefined ? undefined : JSON.stringify(body)
  }), { ALLOWED_ORIGIN: origin });
}

const health = await request("/health");
assert.equal(health.status, 200);
assert.equal((await health.json()).ok, true);

const rules = await request("/v1/rules");
assert.equal(rules.status, 200);
const rulesBody = await rules.json();
assert.ok(rulesBody.nationalities.TN);
assert.ok(rulesBody.destinations.SCHENGEN);

const valid = await request("/v1/check", {
  method: "POST",
  body: {
    nationality: "TN",
    destination: "SCHENGEN",
    departureDate: "2027-06-01",
    returnDate: "2027-06-14",
    passportIssueDate: "2024-01-01",
    passportExpiry: "2027-12-31",
    blankPages: 2
  }
});
assert.equal(valid.status, 200);
const validBody = await valid.json();
assert.equal(validBody.visaRequirement, "visa_required");
assert.equal(validBody.result, "visa_required");
assert.equal(validBody.passportAssessment, "basic_checks_passed");

const invalidPassport = await request("/v1/check", {
  method: "POST",
  body: {
    nationality: "TN",
    destination: "FR",
    departureDate: "2027-06-01",
    returnDate: "2027-06-14",
    passportIssueDate: "2010-01-01",
    passportExpiry: "2027-07-01",
    blankPages: 0
  }
});
const invalidBody = await invalidPassport.json();
assert.equal(invalidBody.passportAssessment, "review_required");
assert.ok(invalidBody.issues.includes("passport_validity_below_destination_rule"));
assert.ok(invalidBody.issues.includes("passport_issued_more_than_10_years_before_travel"));
assert.ok(invalidBody.issues.includes("insufficient_blank_pages"));

const unknown = await request("/v1/check", {
  method: "POST",
  body: { nationality: "TN", destination: "JP" }
});
assert.equal((await unknown.json()).status, "unknown");

const unsupported = await request("/v1/check", {
  method: "POST",
  body: { nationality: "XX", destination: "SCHENGEN" }
});
assert.equal((await unsupported.json()).error, "unsupported_nationality");

const malformed = await request("/v1/check", { method: "POST", headers: { "Content-Type": "application/json" }, body: "not-json" }).catch(() => null);
// Request helper serializes JSON; explicitly exercise malformed input separately.
const badJson = await worker.fetch(new Request("https://worker.test/v1/check", {
  method: "POST", headers: { Origin: origin, "Content-Type": "application/json" }, body: "{"
}), { ALLOWED_ORIGIN: origin });
assert.equal(badJson.status, 400);

const denied = await worker.fetch(new Request("https://worker.test/health", {
  headers: { Origin: "https://evil.example" }
}), { ALLOWED_ORIGIN: origin });
assert.equal(denied.status, 403);

const missing = await request("/does-not-exist");
assert.equal(missing.status, 404);

console.log("Visa rules Worker: 9 groupes de vérifications réussis.");
