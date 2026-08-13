/**
 * localStorage wrappers that report failures instead of hiding them.
 * Browsers throw on access in private/blocked-storage modes and on quota
 * overflow, so every call site needs to know whether persistence worked.
 */

/**
 * @param {string} key
 * @param {*} fallback returned when the key is absent or unreadable
 * @param {(value: *) => boolean} [isValid] shape check for the parsed value
 * @returns {{ value: *, error: Error | null }}
 */
export function readJSON(key, fallback, isValid) {
  try {
    const saved = localStorage.getItem(key);
    if (saved === null) return { value: fallback, error: null };

    const parsed = JSON.parse(saved);
    if (isValid && !isValid(parsed)) {
      throw new Error(`Stored value for "${key}" has an unexpected shape`);
    }
    return { value: parsed, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[storage] Failed to read "${key}" from localStorage:`, error);
    return { value: fallback, error };
  }
}

/**
 * @param {string} key
 * @param {string} fallback
 * @returns {{ value: string, error: Error | null }}
 */
export function readString(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return { value: saved === null ? fallback : saved, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[storage] Failed to read "${key}" from localStorage:`, error);
    return { value: fallback, error };
  }
}

/**
 * @param {string} key
 * @param {string} value
 * @returns {Error | null} the failure, or null when the write succeeded
 */
export function writeRaw(key, value) {
  try {
    localStorage.setItem(key, value);
    return null;
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[storage] Failed to persist "${key}" to localStorage:`, error);
    return error;
  }
}

/**
 * @param {string} key
 * @param {*} value
 * @returns {Error | null} the failure, or null when the write succeeded
 */
export function writeJSON(key, value) {
  let serialized;
  try {
    serialized = JSON.stringify(value);
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    console.error(`[storage] Failed to serialize "${key}":`, error);
    return error;
  }
  return writeRaw(key, serialized);
}
