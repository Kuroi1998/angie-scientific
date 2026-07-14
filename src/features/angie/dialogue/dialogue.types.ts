import type { Emotion } from '../state/angie.types';

export interface DialogueVariant {
  /** Unique across the whole registry, e.g. "greetings.morning.1". */
  id: string;
  text: string;
  emotion: Emotion;
}

/** One category file (per language) exports a bank keyed by situation id. */
export type DialogueBank = Record<string, DialogueVariant[]>;

export type DialogueLanguage = 'fr' | 'es';

export type DialogueRegistry = Record<DialogueLanguage, Record<string, DialogueVariant[]>>;
