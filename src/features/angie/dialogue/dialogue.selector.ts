import { lastUsedIndex } from './dialogue.history';
import type { DialogueRegistry, DialogueLanguage, DialogueVariant } from './dialogue.types';

/**
 * Anti-repetition pick: never-used variants rank first (lastIndex === -1),
 * otherwise the least-recently-used wins. Random only breaks ties between
 * equally-fresh candidates, so this is never a plain Math.random() draw.
 */
export function pickDialogueVariant(variants: DialogueVariant[], history: string[]): DialogueVariant | null {
  if (variants.length === 0) return null;
  if (variants.length === 1) return variants[0];

  const scored = variants.map((variant) => ({ variant, lastIndex: lastUsedIndex(variant.id, history) }));
  const minIndex = Math.min(...scored.map((entry) => entry.lastIndex));
  const candidates = scored.filter((entry) => entry.lastIndex === minIndex);
  return candidates[Math.floor(Math.random() * candidates.length)].variant;
}

/**
 * key is "category.situation", e.g. "fusion.success" or "greetings.firstVisit".
 * Returns null when the key isn't registered — callers must handle that
 * gracefully (skip the trigger) rather than inventing text on the spot.
 */
export function selectDialogue(
  registry: DialogueRegistry,
  language: DialogueLanguage,
  key: string,
  history: string[],
): DialogueVariant | null {
  const variants = registry[language]?.[key];
  if (!variants || variants.length === 0) return null;
  return pickDialogueVariant(variants, history);
}
