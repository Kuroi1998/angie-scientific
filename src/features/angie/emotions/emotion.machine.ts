import type { AngieMode, Emotion, Outcome } from './emotion.types';

/**
 * Emotion driven purely by the state machine's current mode — used when the
 * avatar should reflect *what Angie is doing* (thinking, celebrating, warning)
 * rather than the tone of the last dialogue line.
 */
export function emotionForMode(mode: AngieMode, fallback: Emotion): Emotion {
  switch (mode) {
    case 'thinking':
      return 'thinking';
    case 'listening':
      return 'attentive';
    case 'responding':
      return 'explaining';
    case 'celebrating':
      return 'celebrating';
    case 'warning':
      return 'worried';
    case 'encouraging':
      return 'encouraging';
    case 'resting':
      return 'sleepy';
    case 'greeting':
      return 'happy';
    default:
      return fallback;
  }
}

/**
 * Fallback emotion for trigger call sites that have no matching dialogue
 * variant (and therefore no author-picked emotion) — e.g. a raw outcome from
 * app logic. Streak length nudges success toward pride/celebration.
 */
export function emotionForOutcome(outcome: Outcome, streak = 0): Emotion {
  if (outcome === 'failure') return 'worried';
  if (outcome === 'neutral') return 'neutral';
  if (streak >= 3) return 'celebrating';
  if (streak >= 1) return 'proud';
  return 'happy';
}
