// Tests d'exécution des routes hôtels du Worker visa-flight (Duffel Stays). Aucun réseau : fetch simulé. Lancé par tests/run.mjs.
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const src = await readFile(new URL("../worker/visa-flight-worker.js", import.meta.url), "utf8");
const w = (await import("data:text/javascript;base64," + Buffer.from(src, "utf8").toString("base64"))).default;
const ORIGIN = "https://checkmyvisa.org";
const soon = new Date(Date.now() + 10 * 86400000).toISOString();
const past = new Date(Date.now() - 86400000).toISOString();
const calls = [];
globalThis.fetch = async (url, init = {}) => {
  const u = String(url), path = u.replace("https://api.duffel.com", "");
  calls.push({ path, method: init.method || "GET", body: init.body ? JSON.parse(init.body) : null });
  const ok = (data) => new Response(JSON.stringify({ data }), { status: 200 });
  if (path.startsWith("/places/suggestions")) return ok([
    { type: "city", name: "Paris", iata_country_code: "FR", latitude: 48.85, longitude: 2.35 },
    { type: "airport", name: "Orly", city_name: "Paris", iata_country_code: "FR", latitude: 48.72, longitude: 2.37 },
    { type: "airport", name: "Sans coordonnées", iata_country_code: "FR" },
  ]);
  if (path === "/stays/search") return ok({ results: [
    { id: "ssr_00000000000000B", cheapest_rate_total_amount: "900.00", cheapest_rate_currency: "EUR", accommodation: { name: "Cher", rating: 5, review_score: 9.1, review_count: 80, photos: [{ url: "https://img.test/b.jpg" }], location: { address: { city_name: "Paris", line_one: "1 rue B" }, geographic_coordinates: { latitude: 48.86, longitude: 2.34 } } } },
    { id: "ssr_00000000000000A", cheapest_rate_total_amount: "620.00", cheapest_rate_currency: "EUR", accommodation: { name: "Louvre", rating: 3, photos: [{ url: "http://insecure.test/a.jpg" }], location: { address: { city_name: "Paris" }, geographic_coordinates: { latitude: 48.8606, longitude: 2.3376 } } } },
    { id: "ssr_00000000000000C", cheapest_rate_total_amount: "0", cheapest_rate_currency: "EUR", accommodation: { name: "Sans prix" } },
  ] });
  if (path.endsWith("/actions/fetch_all_rates")) return ok({ accommodation: { name: "Louvre", rating: 3, location: { address: { line_one: "1 rue A", postal_code: "75001", city_name: "Paris" } }, rooms: [{ name: "Double", beds: [{ type: "double", count: 1 }], photos: [{ url: "https://img.test/r.jpg" }], rates: [
    { id: "rat_0000000000000X", total_amount: "700.00", total_currency: "EUR", board_type: "breakfast", cancellation_timeline: [{ before: soon, refund_amount: "700.00", currency: "EUR" }] },
    { id: "rat_0000000000000Y", total_amount: "620.00", total_currency: "EUR", cancellation_timeline: [{ before: soon, refund_amount: "300.00", currency: "EUR" }] },
    { id: "rat_0000000000000Z", total_amount: "650.00", total_currency: "EUR", cancellation_timeline: [{ before: past, refund_amount: "650.00", currency: "EUR" }] },
  ] }] } });
  if (path === "/stays/quotes") return ok({ id: "quo_00000000000001", total_amount: "700.00", total_currency: "EUR", check_in_date: "2027-03-01", check_out_date: "2027-03-07", cancellation_timeline: calls.nonRefundable ? [] : [{ before: soon, refund_amount: "700.00", currency: "EUR" }], accommodation: { name: "Louvre" } });
  if (path === "/stays/bookings") return ok({ reference: "HTLREF1", status: "confirmed", check_in_date: "2027-03-01", check_out_date: "2027-03-07", accommodation: { name: "Louvre", phone_number: "+33100000000", location: { address: { line_one: "1 rue A", city_name: "Paris" } } } });
  return new Response(JSON.stringify({ errors: [{ message: "nope" }] }), { status: 404 });
};

const env = () => ({ DUFFEL_API_KEY: "duffel_test_x" });
const call = (e, path, body) => w.fetch(new Request("https://w.test" + path, { method: "POST", headers: { Origin: ORIGIN, "Content-Type": "application/json", "CF-Connecting-IP": "9.9.9.9" }, body: JSON.stringify(body) }), e);
const j = async (r) => r.json();
const ymd = (n) => new Date(Date.now() + n * 86400000).toISOString().slice(0, 10);
const good = { lat: 48.85, lng: 2.35, check_in: ymd(30), check_out: ymd(36), adults: 2, children: [5] };

// places : villes avec coordonnées, doublons et lieux sans coordonnées écartés
{
  const r = await call(env(), "/hotel/places", { query: "pari" }), d = await j(r);
  assert.equal(r.status, 200);
  assert.equal(d.places.length, 1, "un seul « Paris » (doublon et lieu sans coordonnées écartés)");
  assert.deepEqual(d.places[0], { city: "Paris", country: "FR", lat: 48.85, lng: 2.35 });
}
// search : validation
for (const [name, bad] of [
  ["latitude absente", { ...good, lat: undefined }], ["latitude hors limites", { ...good, lat: 91 }], ["date passée", { ...good, check_in: ymd(-3), check_out: ymd(2) }],
  ["départ avant arrivée", { ...good, check_out: ymd(29) }], ["plus de 28 nuits", { ...good, check_out: ymd(60) }], ["âge d'enfant 18", { ...good, children: [18] }],
  ["0 adulte", { ...good, adults: 0 }], ["7 adultes", { ...good, adults: 7 }],
]) assert.equal((await call(env(), "/hotel/search", bad)).status, 422, name);
// search : tri par prix, distance, https seulement, résultat sans prix écarté
{
  calls.length = 0;
  const r = await call(env(), "/hotel/search", good), d = await j(r);
  assert.equal(r.status, 200);
  assert.deepEqual(d.hotels.map((h) => h.name), ["Louvre", "Cher"]);
  assert.equal(d.hotels[0].photo, null, "photo http refusée");
  assert.equal(d.hotels[1].photo, "https://img.test/b.jpg");
  assert.equal(d.hotels[0].nights, 6);
  assert.ok(d.hotels[0].distance_km > 0 && d.hotels[0].distance_km < 10);
  const sent = calls.find((c) => c.path === "/stays/search").body.data;
  assert.equal(sent.rooms, 1);
  assert.deepEqual(sent.guests, [{ type: "adult" }, { type: "adult" }, { type: "child", age: 5 }]);
}
// rates : uniquement les chambres remboursables intégralement avec une date encore à venir
{
  assert.equal((await call(env(), "/hotel/rates", { search_result_id: "../etc" })).status, 422);
  const d = await j(await call(env(), "/hotel/rates", { search_result_id: "ssr_00000000000000A" }));
  assert.deepEqual(d.rates.map((x) => x.rate_id), ["rat_0000000000000X"]);
  assert.equal(d.rates[0].free_until, soon);
  assert.equal(d.hotel.address, "1 rue A, 75001, Paris");
}
// book : fermée par défaut, aucun appel Duffel
const guest = { given_name: "Sami", family_name: "Ben Ali" };
const bookBody = { rate_id: "rat_0000000000000X", guests: [guest], email: "sami@example.com", phone_number: "+216 58 000 000" };
{
  calls.length = 0;
  const r = await call(env(), "/hotel/book", bookBody), d = await j(r);
  assert.equal(r.status, 503); assert.equal(d.code, "booking_disabled");
  assert.equal(calls.length, 0, "aucun appel Duffel tant que HOTEL_BOOKING n'est pas 1");
}
// book : ouverte → devis puis réservation ; validation ; chambre devenue non remboursable
{
  const e = { ...env(), HOTEL_BOOKING: "1" };
  assert.equal((await call(e, "/hotel/book", { ...bookBody, email: "x" })).status, 422);
  assert.equal((await call(e, "/hotel/book", { ...bookBody, guests: [] })).status, 422);
  assert.equal((await call(e, "/hotel/book", { ...bookBody, phone_number: "0658" })).status, 422);
  calls.length = 0;
  const r = await call(e, "/hotel/book", bookBody), d = await j(r);
  assert.equal(r.status, 200); assert.equal(d.reference, "HTLREF1"); assert.equal(d.free_until, soon);
  assert.deepEqual(calls.map((c) => c.path), ["/stays/quotes", "/stays/bookings"]);
  assert.equal(calls[1].body.data.guests[0].family_name, "BEN ALI");
  assert.equal(calls[1].body.data.payment, undefined, "paiement par le solde Duffel, jamais de carte client");
  calls.length = 0; calls.nonRefundable = true;
  const r2 = await call(e, "/hotel/book", bookBody);
  assert.equal(r2.status, 409);
  assert.deepEqual(calls.map((c) => c.path), ["/stays/quotes"], "pas de réservation si la chambre n'est plus annulable");
}
console.log("hotels-worker : ok");
