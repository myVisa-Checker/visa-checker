// Signalement d'un changement réglementaire : file locale, à relire par un humain (aucun envoi réseau).
export function createChangeReport({ ruleId, packId = '', note }, now = new Date()) {
  const n = typeof note === 'string' ? note.trim() : '';
  if (!/^[a-z0-9_:.-]{1,80}$/i.test(ruleId || '')) throw new Error('Règle inconnue');
  if (n.length < 5 || n.length > 500) throw new Error('Décrivez le changement (5 à 500 caractères).');
  return { ruleId, packId: String(packId).slice(0, 40), note: n, createdAt: now.toISOString() };
}
