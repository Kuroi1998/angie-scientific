import { describe, expect, it } from 'vitest';
import { matchIntentText } from '../intents/intent.matcher';
import { FALLBACK_TEXT } from '../intents/intent.registry';
import type { AngieSituation } from '../context/situation.types';

const situation: AngieSituation = {
  currentTab: 'fusion',
  language: 'fr',
  theme: 'dark',
  learningLevel: 'discovery',
  discoveredElementsCount: 3,
  successfulReactionsCount: 1,
  solvedRiddlesCount: 0,
  unlockedBadgesCount: 0,
  completedQuestsCount: 0,
  experiencePoints: 40,
  isFirstVisit: false,
  sessionStartedAt: 0,
  mascotEnabled: true,
  reducedMotion: false,
};

const baseArgs = { language: 'fr' as const, situation, fusion: null, gasEquations: null };

const FR_CASES: Array<[string, string]> = [
  ['Merci beaucoup', 'Avec plaisir'],
  ['Donne-moi un exemple', 'Hydrogene'],
  ['peux-tu simplifier', 'version courte'],
  ['va y avoir un indice ?', 'indice'],
];

describe('matchIntentText (fr)', () => {
  it.each(FR_CASES)('matches %s to a response containing "%s"', (input, expectedSubstring) => {
    const reply = matchIntentText(input, 'fr', baseArgs);
    expect(reply.toLowerCase()).toContain(expectedSubstring.toLowerCase());
  });

  it('never invents a fusion result when none has been computed yet', () => {
    const reply = matchIntentText('verifie mon resultat', 'fr', baseArgs);
    expect(reply).toContain('pas encore de resultat');
  });

  it('reads the real fusion result instead of guessing when one is available', () => {
    const withFusion = {
      ...baseArgs,
      fusion: {
        reactant1: 'H',
        reactant2: 'O',
        productSymbol: 'H2O',
        stable: true,
        dH: -285.8,
        reactionType: 'synthesis',
        updatedAt: 0,
      },
    };
    const reply = matchIntentText('verifie mon resultat', 'fr', withFusion);
    expect(reply).toContain('H2O');
    expect(reply).toContain('stable');
  });

  it('falls back to a clear "did not understand" message for gibberish input', () => {
    const reply = matchIntentText('xkzqw plonk zzz', 'fr', baseArgs);
    expect(reply).toBe(FALLBACK_TEXT.fr);
  });
});

describe('matchIntentText (es)', () => {
  it('matches Spanish keywords independently of the French set', () => {
    const esArgs = { ...baseArgs, language: 'es' as const };
    const reply = matchIntentText('gracias', 'es', esArgs);
    expect(reply).not.toBe(FALLBACK_TEXT.es);
    expect(reply.toLowerCase()).toContain('gusto');
  });
});
