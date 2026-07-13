import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveCssFont } from './resolveCssFont';

describe('resolveCssFont', () => {
  let style: HTMLStyleElement;

  beforeEach(() => {
    style = document.createElement('style');
    style.textContent = ":root { --test-title: 'Orbitron', sans-serif; }";
    document.head.appendChild(style);
  });

  afterEach(() => {
    document.head.removeChild(style);
  });

  it('replaces a defined var(--token) with its computed value', () => {
    const result = resolveCssFont('bold 12px var(--test-title)');
    expect(result).toContain('Orbitron');
    expect(result).toContain('sans-serif');
    expect(result.startsWith('bold 12px ')).toBe(true);
  });

  it('falls back to the default family for an undefined variable', () => {
    expect(resolveCssFont('9px var(--does-not-exist)')).toBe('9px sans-serif');
  });

  it('uses the var() fallback argument when provided and the variable is undefined', () => {
    expect(resolveCssFont('9px var(--does-not-exist, monospace)')).toBe('9px monospace');
  });

  it('leaves a font string with no var() untouched', () => {
    expect(resolveCssFont('bold 12px Arial')).toBe('bold 12px Arial');
  });

  it('never leaves a var( token in the output', () => {
    expect(resolveCssFont('10px var(--test-title)')).not.toContain('var(');
  });
});
