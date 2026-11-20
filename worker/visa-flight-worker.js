/**
 * CheckMyVisa — Worker « visa-flight » : réservation de vol temporaire (PNR en mode Hold) via l'API Duffel.
 *
 * Routes (POST, JSON) :
 *   /flight/search  -> offres compatibles Hold pour l'itinéraire demandé
 *   /flight/book    -> crée la commande Hold ; renvoie PNR + date limite de paiement
 *
 * Secret (Cloudflare > Settings > Variables and secrets) :
 *   DUFFEL_API_KEY   duffel_test_... (Sandbox) puis duffel_live_... (production)
 * Variable optionnelle :
 *   ALLOWED_ORIGIN   adresses séparées par des virgules (défaut : checkmyvisa.org et www)
 * Liaison KV optionnelle « KV » : limite de débit par IP (sans elle, aucune limite n'est appliquée).
 *
 * Déploiement : « Edit code » dans Cloudflare (comme les autres Workers) ou
 *   npx wrangler deploy --config worker/wrangler.flight.toml
 */

const DUFFEL_API = "https://api.duffel.com";
const DEFAULT_ORIGINS = "https://checkmyvisa.org,https://www.checkmyvisa.org";
const MAX_OFFERS = 8;

class HttpError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/* ------------------------------ Duffel ------------------------------------ */

async function duffel(env, path, { method = "GET", body } = {}) {
  if (!env.DUFFEL_API_KEY) {
    console.error("DUFFEL_API_KEY manquante");
    throw new HttpError(503, "Service momentanément indisponible.", "not_configured");
  }
  const res = await fetch(DUFFEL_API + path, {
    method,
    headers: {
      Authorization: `Bearer ${env.DUFFEL_API_KEY}`,
      "Duffel-Version": "v2",
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = payload?.errors?.[0];
    console.error("Duffel", res.status, JSON.stringify(payload?.errors ?? payload)); // jamais de données passager ici
    throw new HttpError(
      res.status === 400 || res.status === 422 ? 422 : 502,
      err?.message || "Le fournisseur de vols a renvoyé une erreur.",
      err?.code
    );
  }
  return payload.data;
}

/* ------------------------------ Validation -------------------------------- */

const IATA = /^[A-Z]{3}$/;
const NAME = /^[A-Z][A-Z' -]{0,48}$/;
const PHONE_E164 = /^\+[1-9]\d{6,14}$/;
const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;

const normName = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toUpperCase()
    .trim()
    .replace(/\s+/g, " ");

function parseDate(s) {
  if (typeof s !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(s + "T00:00:00Z");
  return Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== s ? null : d;
}

function validateSearch(b) {
  const origin = String(b?.origin ?? "").toUpperCase().trim();
  const destination = String(b?.destination ?? "").toUpperCase().trim();
  if (!IATA.test(origin) || !IATA.test(destination)) throw new HttpError(422, "Codes aéroport invalides.", "airport");
  if (origin === destination) throw new HttpError(422, "Départ et arrivée doivent être différents.", "airport");
  const dep = parseDate(b?.departure_date);
  if (!dep) throw new HttpError(422, "Date aller invalide.", "date");
  if (dep.getTime() < Date.now() - 86400000) throw new HttpError(422, "La date aller est passée.", "date");
  let ret = null;
  if (b?.return_date) {
    ret = parseDate(b.return_date);
    if (!ret) throw new HttpError(422, "Date retour invalide.", "date");
    if (ret < dep) throw new HttpError(422, "Le retour doit suivre l'aller.", "date");
  }
  return { origin, destination, departure_date: b.departure_date, return_date: ret ? b.return_date : null };
}

function validatePassenger(p) {
  const given_name = normName(p?.given_name);
  const family_name = normName(p?.family_name);
  if (!NAME.test(given_name) || !NAME.test(family_name)) throw new HttpError(422, "Nom ou prénom invalide.", "name");
  if (!["m", "f"].includes(p?.gender)) throw new HttpError(422, "Genre requis.", "gender");
  const born = parseDate(p?.born_on);
  if (!born || born > new Date()) throw new HttpError(422, "Date de naissance invalide.", "born_on");
  const email = String(p?.email ?? "").trim();
  if (!EMAIL.test(email)) throw new HttpError(422, "E-mail invalide.", "email");
  const phone_number = String(p?.phone_number ?? "").replace(/[\s.-]/g, "");
  if (!PHONE_E164.test(phone_number)) throw new HttpError(422, "Téléphone invalide.", "phone");
  return {
    title: p.gender === "m" ? "mr" : "ms",
    gender: p.gender,
    given_name,
    family_name,
    born_on: p.born_on,
    email,
    phone_number,
  };
}

/* ------------------------------ Mise en forme ----------------------------- */

const isHoldable = (o) => o?.payment_requirements?.requires_instant_payment === false;

const summarizeSlices = (slices = []) =>
  slices.map((s) => ({
    origin: s.origin?.iata_code,
    destination: s.destination?.iata_code,
    segments: (s.segments ?? []).map((g) => ({
      carrier: g.marketing_carrier?.name ?? g.marketing_carrier?.iata_code,
      flight_number: `${g.marketing_carrier?.iata_code ?? ""}${g.marketing_carrier_flight_number ?? ""}`,
      from: g.origin?.iata_code,
      to: g.destination?.iata_code,
      departing_at: g.departing_at,
      arriving_at: g.arriving_at,
    })),
  }));

const summarizeOffer = (o) => ({
  id: o.id,
  owner: o.owner?.name,
  total_amount: o.total_amount,
  total_currency: o.total_currency,
  payment_required_by: o.payment_requirements?.payment_required_by ?? null,
  slices: summarizeSlices(o.slices),
});

/* ------------------------------ Limite de débit --------------------------- */

/** Best-effort (KV sans incrément atomique). Ne bloque jamais si KV est absente ou en erreur. */
async function limited(env, req, bucket, max, ttl) {
  if (!env.KV) return false;
  try {
    const ip = req.headers.get("CF-Connecting-IP") || "x";
    const key = `fh:${bucket}:${ip}`;
    const n = parseInt((await env.KV.get(key)) || "0", 10);
    if (n >= max) return true;
    await env.KV.put(key, String(n + 1), { expirationTtl: ttl });
  } catch (e) {
    console.error("rate-limit", e?.message);
  }
  return false;
}

/* ------------------------------ Handlers ---------------------------------- */

async function search(req, env) {
  if (await limited(env, req, "search", 12, 600)) throw new HttpError(429, "Trop de recherches. Réessayez dans quelques minutes.", "rate");
  const q = validateSearch(await req.json().catch(() => null));
  const slices = [{ origin: q.origin, destination: q.destination, departure_date: q.departure_date }];
  if (q.return_date) slices.push({ origin: q.destination, destination: q.origin, departure_date: q.return_date });

  const data = await duffel(env, "/air/offer_requests?return_offers=true&supplier_timeout=15000", {
    method: "POST",
    body: { data: { slices, passengers: [{ type: "adult" }], cabin_class: "economy" } },
  });
  const all = data.offers ?? [];
  const offers = all
    .filter(isHoldable)
    .sort((a, b) => parseFloat(a.total_amount) - parseFloat(b.total_amount))
    .slice(0, MAX_OFFERS)
    .map(summarizeOffer);
  return { ok: true, total_found: all.length, hold_count: offers.length, offers };
}

async function book(req, env) {
  if (await limited(env, req, "book", 4, 3600)) throw new HttpError(429, "Trop de réservations. Réessayez plus tard.", "rate");
  const body = await req.json().catch(() => null);
  const offerId = String(body?.offer_id ?? "");
  if (!/^off_[A-Za-z0-9]+$/.test(offerId)) throw new HttpError(422, "Offre invalide.", "offer");
  const passenger = validatePassenger(body?.passenger);

  const offer = await duffel(env, `/air/offers/${offerId}`); // re-vérification : disponibilité + Hold + id passager
  if (!isHoldable(offer)) throw new HttpError(409, "Cette offre n'est plus réservable sans paiement.", "not_holdable");

  const order = await duffel(env, "/air/orders", {
    method: "POST",
    body: {
      data: {
        type: "hold",
        selected_offers: [offerId],
        passengers: [{ id: offer.passengers[0].id, ...passenger }],
      },
    },
  });
  return {
    ok: true,
    pnr: order.booking_reference,
    payment_required_by: order.payment_status?.payment_required_by ?? null,
    total_amount: order.total_amount,
    total_currency: order.total_currency,
    passenger: { given_name: passenger.given_name, family_name: passenger.family_name },
    slices: summarizeSlices(order.slices),
  };
}

/* ------------------------------ Routeur ----------------------------------- */

export default {
  async fetch(req, env) {
    const list = String(env.ALLOWED_ORIGIN || DEFAULT_ORIGINS).split(",").map((x) => x.trim()).filter(Boolean);
    const origin = req.headers.get("Origin") || "";
    const allowed = list.includes(origin) ? origin : list[0];
    const out = (body, status = 200) =>
      new Response(JSON.stringify(body), {
        status,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "Access-Control-Allow-Origin": allowed,
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "600",
          Vary: "Origin",
        },
      });

    if (req.method === "OPTIONS") return out({}, 204);
    const { pathname } = new URL(req.url);
    try {
      if (req.method !== "POST") return out({ ok: false, error: "method" }, 405);
      if (origin !== allowed) return out({ ok: false, error: "origin" }, 403);
      if (pathname === "/flight/search") return out(await search(req, env));
      if (pathname === "/flight/book") return out(await book(req, env));
      return out({ ok: false, error: "not_found" }, 404);
    } catch (e) {
      if (e instanceof HttpError) return out({ ok: false, error: e.message, code: e.code }, e.status);
      console.error(e?.message);
      return out({ ok: false, error: "Erreur interne." }, 500);
    }
  },
};
