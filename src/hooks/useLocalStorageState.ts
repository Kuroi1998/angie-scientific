import { useCallback, useState } from 'react';
import { readStoredValue, writeStoredValue, removeStoredValue, readLegacyValue } from '../utils/localStorage';

interface UseLocalStorageStateOptions<T> {
  /** Narrows `unknown` JSON to T; values that fail validation are treated as absent (default is used instead). */
  validate: (raw: unknown) => raw is T;
  /** Pre-versioning key this value used to live under, if any (e.g. "angie_sci_lang"). */
  legacyKey?: string;
  /** Parses the raw legacy string value into T; only consulted when `legacyKey` is set and present. */
  parseLegacy?: (raw: string) => T | undefined;
}

/**
 * Typed, validated, versioned localStorage-backed state. Falls back to
 * `defaultValue` when storage is unavailable, empty, corrupted, or holds a
 * value that fails `validate`. Never throws.
 */
export function useLocalStorageState<T>(
  key: string,
  defaultValue: T,
  options: UseLocalStorageStateOptions<T>
): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const [value, setValue] = useState<T>(() => {
    const stored = readStoredValue<T>(key, options.validate);
    if (stored !== undefined) return stored;

    if (options.legacyKey) {
      const legacyRaw = readLegacyValue(options.legacyKey);
      if (legacyRaw !== null) {
        const migrated = options.parseLegacy ? options.parseLegacy(legacyRaw) : undefined;
        if (migrated !== undefined && options.validate(migrated)) {
          writeStoredValue(key, migrated);
          return migrated;
        }
      }
    }

    return defaultValue;
  });

  const setPersisted = useCallback((next: T | ((prev: T) => T)) => {
    setValue(prev => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(prev) : next;
      writeStoredValue(key, resolved);
      return resolved;
    });
  }, [key]);

  const reset = useCallback(() => {
    removeStoredValue(key);
    setValue(defaultValue);
  }, [key, defaultValue]);

  return [value, setPersisted, reset];
}
