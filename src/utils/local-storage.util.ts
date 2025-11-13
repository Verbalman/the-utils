import { ConfigEnum } from '../enum';

/**
 * Shape of the stored value in `localStorage` when using
 * {@link theUtilWriteLocalStorageWithExpiry} and {@link theUtilReadLocalStorageWithExpiry}.
 */
interface LocalStorageItem<T> {
  value: T;
  expiry: number;
}

/**
 * Writes a value to `localStorage` with a time-to-live (TTL).
 *
 * @typeParam T - Type of the stored value (must be JSON-serializable).
 *
 * @param key - Storage key.
 * @param value - Value to store.
 * @param ttl - Time-to-live in milliseconds (default: 2 hours).
 */
export const theUtilWriteLocalStorageWithExpiry = (
  key: string,
  value: any,
  ttl: number = 7200000
): void => {
  try {
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error(`${ConfigEnum.LOG_PREFIX} WriteLocalStorageWithExpiry. Error:`, e);
  }
};

/**
 * Reads a value from `localStorage` that was stored with {@link theUtilWriteLocalStorageWithExpiry}.
 * If the value is expired or cannot be parsed, it returns `null` and removes the key.
 *
 * @typeParam T - Expected type of the stored value.
 *
 * @param key - Storage key.
 * @returns The parsed value or `null` if missing/expired/invalid.
 */
export const theUtilReadLocalStorageWithExpiry = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr) as LocalStorageItem<T>;
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }

    return item.value;
  } catch (e) {
    console.error(`${ConfigEnum.LOG_PREFIX} ReadLocalStorageWithExpiry. Error:`, e);
    return null;
  }
};
