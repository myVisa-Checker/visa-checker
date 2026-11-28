import { STATUS_LABELS } from './constants.js';

export function explainItem(i) {
  const src = i.source && i.source.url ? ` Source : ${i.source.name} (${i.source.url}).` : ' Source officielle à identifier.';
  const rel = i.reliability === 'verified' ? ` Règle vérifiée le ${i.lastVerified}.`
    : i.reliability === 'outdated' ? ' Règle obsolète : revérifiez avant de vous fier à ce résultat.'
    : ' Règle non vérifiée : ceci n’est pas une information officielle.';
  return `${i.title} — ${STATUS_LABELS[i.status]}. ${i.message}${rel}${src}`;
}

// Contexte et garde-fous à fournir à un assistant IA : il ne peut s'appuyer que sur ces éléments.
export function buildAiPrompt(profile, items) {
  const facts = items.map((i) => ({ id: i.id, title: i.title, status: i.status, message: i.message,
    reliability: i.reliability, lastVerified: i.lastVerified, source: i.source }));
  return [
    'Tu es l’assistant SafeLanding. Explique en langage simple, en français.',
    'N’invente AUCUNE règle d’immigration. Appuie-toi uniquement sur les éléments ci-dessous.',
    'Si reliability n’est pas "verified", dis que l’information n’est pas officielle et renvoie à la source.',
    'Ne présente jamais une hypothèse comme une règle officielle. Signale ce qui exige une vérification humaine.',
    `Profil : ${JSON.stringify({ nationality: profile.nationality, destination: profile.destination, transit: profile.transit })}`,
    `Éléments : ${JSON.stringify(facts)}`,
  ].join('\n');
}

const CERTAINTY = /(obligatoire|pas besoin de visa|exempt[ée]?|dispens[ée]|aucun visa)/i;
// Contrôle heuristique d'une réponse d'IA : URL hors sources connues, certitude sans règle vérifiée.
export function guardAiAnswer(answer, items) {
  const issues = [], text = String(answer || '');
  const allowed = new Set(items.map((i) => i.source && i.source.url).filter(Boolean));
  for (const u of text.match(/https?:\/\/[^\s)]+/g) || []) if (!allowed.has(u)) issues.push(`URL non référencée : ${u}`);
  if (CERTAINTY.test(text) && !items.some((i) => i.reliability === 'verified')) issues.push('Affirmation catégorique sans aucune règle vérifiée.');
  return { ok: issues.length === 0, issues };
}

// Module 2 : adapte les éléments d'arrivée au contrat de buildAiPrompt/guardAiAnswer (aucun second mécanisme IA).
export function arrivalToAiItems(arrival) {
  return arrival.phases.flatMap((ph) => ph.items).map((i) => ({ id: i.id, title: i.title,
    status: i.kind === 'official' ? 'official' : 'practical_advice', message: i.text, reliability: i.reliability === 'practical' ? 'unverified' : i.reliability,
    lastVerified: i.lastVerified, source: i.source }));
}
