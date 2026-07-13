import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorageState } from './useLocalStorageState';
import { SCHEMA_VERSION } from '../utils/localStorage';

const isString = (raw: unknown): raw is string => typeof raw === 'string';
const isStringArray = (raw: unknown): raw is string[] =>
  Array.isArray(raw) && raw.every((item) => typeof item === 'string');

describe('useLocalStorageState', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('initializes with the default value when nothing is stored', () => {
    const { result } = renderHook(() => useLocalStorageState('greeting', 'hello', { validate: isString }));
    expect(result.current[0]).toBe('hello');
  });

  it('persists updates and survives a simulated reload (new hook instance)', () => {
    const { result, unmount } = renderHook(() => useLocalStorageState('greeting', 'hello', { validate: isString }));
    act(() => result.current[1]('bonjour'));
    expect(result.current[0]).toBe('bonjour');
    unmount();

    const { result: reloaded } = renderHook(() => useLocalStorageState('greeting', 'hello', { validate: isString }));
    expect(reloaded.current[0]).toBe('bonjour');
  });

  it('supports a functional updater', () => {
    const { result } = renderHook(() => useLocalStorageState<string[]>('list', [], { validate: isStringArray }));
    act(() => result.current[1](prev => [...prev, 'x']));
    act(() => result.current[1](prev => [...prev, 'y']));
    expect(result.current[0]).toEqual(['x', 'y']);
  });

  it('falls back to the default value when stored JSON is corrupted', () => {
    window.localStorage.setItem(`angieScientific:v${SCHEMA_VERSION}:greeting`, '{not json');
    const { result } = renderHook(() => useLocalStorageState('greeting', 'hello', { validate: isString }));
    expect(result.current[0]).toBe('hello');
  });

  it('falls back to the default value when stored data fails validation', () => {
    window.localStorage.setItem(`angieScientific:v${SCHEMA_VERSION}:list`, JSON.stringify({ nope: true }));
    const { result } = renderHook(() => useLocalStorageState<string[]>('list', [], { validate: isStringArray }));
    expect(result.current[0]).toEqual([]);
  });

  it('migrates a legacy key on first read and writes it under the new versioned key', () => {
    window.localStorage.setItem('old_lang_key', 'es');
    const { result } = renderHook(() => useLocalStorageState('language', 'fr', {
      validate: isString,
      legacyKey: 'old_lang_key',
      parseLegacy: (raw) => raw,
    }));

    expect(result.current[0]).toBe('es');
    expect(window.localStorage.getItem(`angieScientific:v${SCHEMA_VERSION}:language`)).toBe('"es"');
  });

  it('ignores an unparsable legacy value and uses the default', () => {
    window.localStorage.setItem('old_key', 'garbage');
    const { result } = renderHook(() => useLocalStorageState<string[]>('list', [], {
      validate: isStringArray,
      legacyKey: 'old_key',
      parseLegacy: () => undefined,
    }));
    expect(result.current[0]).toEqual([]);
  });

  it('reset() clears storage and restores the default value', () => {
    const { result } = renderHook(() => useLocalStorageState('greeting', 'hello', { validate: isString }));
    act(() => result.current[1]('bonjour'));
    expect(result.current[0]).toBe('bonjour');

    act(() => result.current[2]());
    expect(result.current[0]).toBe('hello');
    expect(window.localStorage.getItem(`angieScientific:v${SCHEMA_VERSION}:greeting`)).toBeNull();
  });
});
