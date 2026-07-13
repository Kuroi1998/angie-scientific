import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  readStoredValue,
  writeStoredValue,
  removeStoredValue,
  readLegacyValue,
  clearAllStoredValues,
  SCHEMA_VERSION,
} from './localStorage';

const isStringArray = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every((item) => typeof item === 'string');

describe('localStorage utils', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('round-trips a value through write then read', () => {
    writeStoredValue('myKey', ['a', 'b']);
    expect(readStoredValue('myKey', isStringArray)).toEqual(['a', 'b']);
  });

  it('namespaces and versions the underlying storage key', () => {
    writeStoredValue('language', 'fr');
    expect(window.localStorage.getItem(`angieScientific:v${SCHEMA_VERSION}:language`)).toBe('"fr"');
  });

  it('returns undefined for a missing key', () => {
    expect(readStoredValue('missing', isStringArray)).toBeUndefined();
  });

  it('returns undefined for corrupted (non-JSON) data instead of throwing', () => {
    window.localStorage.setItem(`angieScientific:v${SCHEMA_VERSION}:broken`, '{not valid json');
    expect(() => readStoredValue('broken', isStringArray)).not.toThrow();
    expect(readStoredValue('broken', isStringArray)).toBeUndefined();
  });

  it('returns undefined when the stored value fails validation', () => {
    window.localStorage.setItem(`angieScientific:v${SCHEMA_VERSION}:wrongShape`, JSON.stringify({ not: 'an array' }));
    expect(readStoredValue('wrongShape', isStringArray)).toBeUndefined();
  });

  it('reads a legacy unversioned key verbatim', () => {
    window.localStorage.setItem('angie_sci_lang', 'es');
    expect(readLegacyValue('angie_sci_lang')).toBe('es');
  });

  it('removes a key', () => {
    writeStoredValue('toRemove', 'x');
    removeStoredValue('toRemove');
    expect(readStoredValue('toRemove', (v): v is string => typeof v === 'string')).toBeUndefined();
  });

  it('returns false instead of throwing when the write fails (e.g. quota exceeded)', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('QuotaExceededError');
    });
    expect(() => writeStoredValue('anything', 'value')).not.toThrow();
    expect(writeStoredValue('anything', 'value')).toBe(false);
    spy.mockRestore();
  });

  it('clearAllStoredValues only removes keys under this app\'s namespace', () => {
    writeStoredValue('a', 1);
    writeStoredValue('b', 2);
    window.localStorage.setItem('unrelated-app-key', 'keep-me');

    clearAllStoredValues();

    expect(readStoredValue('a', (v): v is number => typeof v === 'number')).toBeUndefined();
    expect(readStoredValue('b', (v): v is number => typeof v === 'number')).toBeUndefined();
    expect(window.localStorage.getItem('unrelated-app-key')).toBe('keep-me');
  });
});
