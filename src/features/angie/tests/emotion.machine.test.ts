import { describe, expect, it } from 'vitest';
import { emotionForMode, emotionForOutcome } from '../emotions/emotion.machine';

describe('emotionForMode', () => {
  it('maps known modes to a dedicated emotion', () => {
    expect(emotionForMode('thinking', 'neutral')).toBe('thinking');
    expect(emotionForMode('celebrating', 'neutral')).toBe('celebrating');
    expect(emotionForMode('warning', 'neutral')).toBe('worried');
    expect(emotionForMode('resting', 'neutral')).toBe('sleepy');
  });

  it('falls back to the provided emotion for modes without a dedicated mapping', () => {
    expect(emotionForMode('speaking', 'happy')).toBe('happy');
    expect(emotionForMode('idle', 'curious')).toBe('curious');
  });
});

describe('emotionForOutcome', () => {
  it('returns worried for a failure regardless of streak', () => {
    expect(emotionForOutcome('failure', 5)).toBe('worried');
  });

  it('returns neutral for a neutral outcome', () => {
    expect(emotionForOutcome('neutral')).toBe('neutral');
  });

  it('escalates success emotion with streak length', () => {
    expect(emotionForOutcome('success', 0)).toBe('happy');
    expect(emotionForOutcome('success', 1)).toBe('proud');
    expect(emotionForOutcome('success', 3)).toBe('celebrating');
  });
});
