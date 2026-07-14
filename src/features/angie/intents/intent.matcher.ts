import { FALLBACK_TEXT, INTENT_REGISTRY } from './intent.registry';
import type { IntentRespondArgs } from './intent.types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export function getIntentById(id: string) {
  return INTENT_REGISTRY.find((intent) => intent.id === id) ?? null;
}

/**
 * Keyword-overlap scoring, no LLM: counts how many registered keywords for
 * each intent appear as substrings of the normalized input, picks the
 * highest score. Below the match threshold, returns the fallback text
 * rather than guessing — Angie must never invent an answer.
 */
export function matchIntentText(rawText: string, language: 'fr' | 'es', args: IntentRespondArgs): string {
  const normalized = normalize(rawText);
  let bestScore = 0;
  let bestId: string | null = null;

  for (const intent of INTENT_REGISTRY) {
    const keywords = intent.keywords[language];
    const score = keywords.reduce((count, keyword) => (normalized.includes(normalize(keyword)) ? count + 1 : count), 0);
    if (score > bestScore) {
      bestScore = score;
      bestId = intent.id;
    }
  }

  if (!bestId || bestScore === 0) return FALLBACK_TEXT[language];
  const intent = getIntentById(bestId);
  return intent ? intent.respond(args).text : FALLBACK_TEXT[language];
}
