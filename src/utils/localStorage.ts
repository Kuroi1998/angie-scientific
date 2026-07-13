// Low-level, versioned localStorage access. Nothing here trusts the browser:
// storage may be unavailable (privacy mode), full (quota), or hold corrupted
// JSON from a previous version of the app — every function degrades to a
// safe no-op/undefined instead of throwing.
//
// Keys are namespaced as `angieScientific:v{SCHEMA_VERSION}:{key}` so a future
// incompatible change can bump SCHEMA_VERSION and start clean without ever
// reading old, differently-shaped data back into the app.

const NAMESPACE = 'angieScientific';
export const SCHEMA_VERSION = 1;

function buildKey(key: string): string {
  return `${NAMESPACE}:v${SCHEMA_VERSION}:${key}`;
}

let cachedAvailability: boolean | null = null;

/** Whether window.localStorage can actually be written to right now. Cached per session. */
export function isStorageAvailable(): boolean {
  if (cachedAvailability !== null) return cachedAvailability;
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      cachedAvailability = false;
      return false;
    }
    const probeKey = `${NAMESPACE}:__probe__`;
    window.localStorage.setItem(probeKey, '1');
    window.localStorage.removeItem(probeKey);
    cachedAvailability = true;
  } catch {
    cachedAvailability = false;
  }
  return cachedAvailability;
}

/** Reads and JSON-parses a versioned key, validating its shape. Returns undefined on any failure. */
export function readStoredValue<T>(key: string, validate: (raw: unknown) => raw is T): T | undefined {
  if (!isStorageAvailable()) return undefined;
  try {
    const raw = window.localStorage.getItem(buildKey(key));
    if (raw === null) return undefined;
    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

/** Serializes and writes a versioned key. Returns false if storage is unavailable or the write failed (e.g. quota). */
export function writeStoredValue<T>(key: string, value: T): boolean {
  if (!isStorageAvailable()) return false;
  try {
    window.localStorage.setItem(buildKey(key), JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeStoredValue(key: string): void {
  if (!isStorageAvailable()) return;
  try {
    window.localStorage.removeItem(buildKey(key));
  } catch {
    // Storage errors here are non-actionable; leaving the stale key behind is harmless.
  }
}

/** Reads a legacy (pre-versioning) raw string key, for one-time migration. */
export function readLegacyValue(legacyKey: string): string | null {
  if (!isStorageAvailable()) return null;
  try {
    return window.localStorage.getItem(legacyKey);
  } catch {
    return null;
  }
}

/** Removes every key under this app's versioned namespace — used by the "reset all local data" action. */
export function clearAllStoredValues(): void {
  if (!isStorageAvailable()) return;
  try {
    const prefix = `${NAMESPACE}:`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(prefix)) keysToRemove.push(k);
    }
    keysToRemove.forEach(k => window.localStorage.removeItem(k));
  } catch {
    // Best-effort cleanup; nothing to recover from here.
  }
}
