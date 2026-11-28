// Registre extensible : ajouter une destination = ajouter un pack (aucune modification du moteur).
export function createRegistry(packs = []) {
  const byCountry = new Map();
  for (const pack of packs) {
    if (!pack || !pack.id || !Array.isArray(pack.countries) || !Array.isArray(pack.rules)) {
      throw new Error('Pack de règles invalide');
    }
    for (const c of pack.countries) {
      if (byCountry.has(c)) throw new Error(`Pays ${c} défini dans deux packs`);
      byCountry.set(c, pack);
    }
  }
  return { get: (iso) => byCountry.get(iso) || null, countries: () => [...byCountry.keys()] };
}
