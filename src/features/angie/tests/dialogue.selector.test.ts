import { describe, expect, it } from 'vitest';
import { pickDialogueVariant, selectDialogue } from '../dialogue/dialogue.selector';
import type { DialogueRegistry, DialogueVariant } from '../dialogue/dialogue.types';

const variants: DialogueVariant[] = [
  { id: 'a', text: 'A', emotion: 'happy' },
  { id: 'b', text: 'B', emotion: 'happy' },
  { id: 'c', text: 'C', emotion: 'happy' },
];

describe('pickDialogueVariant', () => {
  it('prefers a never-used variant over ones already in history', () => {
    const history = ['a', 'b', 'a', 'b'];
    const picked = pickDialogueVariant(variants, history);
    expect(picked?.id).toBe('c');
  });

  it('falls back to the least-recently-used variant once all have appeared', () => {
    const history = ['a', 'c', 'b', 'a', 'c'];
    const picked = pickDialogueVariant(variants, history);
    expect(picked?.id).toBe('b');
  });

  it('never repeats the same variant twice in a row when alternatives exist', () => {
    let history: string[] = [];
    const seen: string[] = [];
    for (let i = 0; i < 20; i += 1) {
      const picked = pickDialogueVariant(variants, history);
      if (!picked) throw new Error('expected a variant');
      seen.push(picked.id);
      history = [...history, picked.id];
    }
    for (let i = 1; i < seen.length; i += 1) {
      expect(seen[i]).not.toBe(seen[i - 1]);
    }
  });

  it('returns the only variant when there is just one, regardless of history', () => {
    const single = [variants[0]];
    expect(pickDialogueVariant(single, ['a', 'a', 'a'])?.id).toBe('a');
  });

  it('returns null for an empty variant list', () => {
    expect(pickDialogueVariant([], [])).toBeNull();
  });
});

describe('selectDialogue', () => {
  const registry: DialogueRegistry = {
    fr: { 'greetings.firstVisit': variants },
    es: { 'greetings.firstVisit': variants },
  };

  it('resolves a registered key for the requested language', () => {
    expect(selectDialogue(registry, 'fr', 'greetings.firstVisit', [])).not.toBeNull();
  });

  it('returns null for an unregistered key instead of inventing content', () => {
    expect(selectDialogue(registry, 'fr', 'nonexistent.key', [])).toBeNull();
  });
});
