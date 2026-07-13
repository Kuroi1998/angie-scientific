import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { resolveCssColor, isResolvedCssColor } from './resolveCssColor';

describe('resolveCssColor', () => {
  let style: HTMLStyleElement;

  beforeEach(() => {
    style = document.createElement('style');
    style.textContent = ':root { --test-cyan: #00f3ff; --test-empty: ; }';
    document.head.appendChild(style);
  });

  afterEach(() => {
    document.head.removeChild(style);
  });

  it('passes through a direct hex color', () => {
    expect(resolveCssColor('#00ffff')).toBe('#00ffff');
  });

  it('passes through rgb()/rgba() colors', () => {
    expect(resolveCssColor('rgb(0, 255, 255)')).toBe('rgb(0, 255, 255)');
    expect(resolveCssColor('rgba(0, 255, 255, 0.5)')).toBe('rgba(0, 255, 255, 0.5)');
  });

  it('passes through hsl() colors', () => {
    expect(resolveCssColor('hsl(180, 100%, 50%)')).toBe('hsl(180, 100%, 50%)');
  });

  it('resolves a var(--token) that is defined on :root', () => {
    expect(resolveCssColor('var(--test-cyan)')).toBe('#00f3ff');
  });

  it('falls back when the variable is not defined', () => {
    expect(resolveCssColor('var(--does-not-exist)', '#123456')).toBe('#123456');
  });

  it('uses the var() fallback argument when the variable is undefined', () => {
    expect(resolveCssColor('var(--does-not-exist, #abcdef)')).toBe('#abcdef');
  });

  it('falls back on an empty string', () => {
    expect(resolveCssColor('', '#ffffff')).toBe('#ffffff');
  });

  it('falls back on undefined input', () => {
    expect(resolveCssColor(undefined, '#ffffff')).toBe('#ffffff');
  });

  it('falls back on null input', () => {
    expect(resolveCssColor(null, '#ffffff')).toBe('#ffffff');
  });

  it('never returns a raw var() expression', () => {
    const result = resolveCssColor('var(--neon-cyan)');
    expect(result.startsWith('var(')).toBe(false);
  });
});

describe('isResolvedCssColor', () => {
  it('accepts hex, rgb, rgba, hsl and named colors', () => {
    expect(isResolvedCssColor('#fff')).toBe(true);
    expect(isResolvedCssColor('#00f3ff')).toBe(true);
    expect(isResolvedCssColor('rgb(1,2,3)')).toBe(true);
    expect(isResolvedCssColor('rgba(1,2,3,0.5)')).toBe(true);
    expect(isResolvedCssColor('hsl(1,2%,3%)')).toBe(true);
    expect(isResolvedCssColor('cyan')).toBe(true);
  });

  it('rejects var() expressions and empty strings', () => {
    expect(isResolvedCssColor('var(--neon-cyan)')).toBe(false);
    expect(isResolvedCssColor('')).toBe(false);
    expect(isResolvedCssColor('   ')).toBe(false);
  });
});
