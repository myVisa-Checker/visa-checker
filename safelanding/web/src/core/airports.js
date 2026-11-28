// Registre des aéroports : même principe que registry.js (pays), clé = code IATA.
export function createAirportRegistry(packs = []) {
  const by = new Map();
  for (const a of packs) {
    if (!a || !/^[A-Z]{3}$/.test(a.iata) || !/^[A-Z]{2}$/.test(a.country) || !a.name) throw new Error('Pack aéroport invalide');
    if (by.has(a.iata)) throw new Error(`Aéroport ${a.iata} défini deux fois`);
    by.set(a.iata, { steps: [], transfers: [], ...a });
  }
  return { get: (iata) => by.get(iata) || null, list: () => [...by.keys()] };
}
