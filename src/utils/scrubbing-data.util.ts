/**
 * Scrubs sensitive data by replacing a value at the given key/index in supported data structures.
 * Supports:
 * - `string` → replaces entirely with a mask (default `'********'`)
 * - `Array` → replaces value at index; optional expansion with filler
 * - `Map` → replaces value by key; optional create-if-missing
 * - `Set` → replaces matching value; optional add-if-missing
 * - `Object` → replaces property value; optional create-if-missing
 *
 * @template D Type of the data structure
 * @template K Type of the key/index
 * @template V Type of the replacement value
 *
 * @param data The source data to scrub.
 * @param key The key/index/element to scrub.
 * @param mask The replacement value (must match the target value type).
 * @param options Additional behavior control depending on type.
 *
 * @example
 * // Object: replace existing key
 * theUtilScrubbingData({ a: 1 }, 'a', 99); // { a: 99 }
 *
 * @example
 * // Object: create missing key
 * theUtilScrubbingData({ a: 1 }, 'b', 2, { createIfMissing: true }); // { a: 1, b: 2 }
 *
 * @example
 * // Array: replace at index
 * theUtilScrubbingData([1, 2, 3], 1, 999); // [1, 999, 3]
 *
 * @example
 * // Array: expand with filler
 * theUtilScrubbingData([], 3, 7, { allowExpand: true, filler: 0 }); // [0, 0, 0, 7]
 *
 * @example
 * // Map: create missing
 * theUtilScrubbingData(new Map([['x', 10]]), 'y', 20, { createIfMissing: true }); // Map { 'x'=>10, 'y'=>20 }
 *
 * @example
 * // Set: replace value
 * theUtilScrubbingData(new Set([1, 2, 3]), 2, 99); // Set {1, 99, 3}
 *
 * @example
 * // Set: add when missing
 * theUtilScrubbingData(new Set([1, 2, 3]), 99, 100, { setWhenMissing: true }); // Set {1, 2, 3, 100}
 */

// Options per type
type MapObjOptions = { createIfMissing?: boolean };
type SetOptions = { setWhenMissing?: boolean };
type ArrayOptions<T> = { allowExpand?: boolean; filler?: T };

// Overloads
export function theUtilScrubbingData(
  data: string,
  key: PropertyKey,
  mask?: string,
  options?: never,
): string;

export function theUtilScrubbingData<T>(
  data: T[],
  key: number,
  mask: T,
  options?: ArrayOptions<T>,
): T[];

export function theUtilScrubbingData<K, V>(
  data: Map<K, V>,
  key: K,
  mask: V,
  options?: MapObjOptions,
): Map<K, V>;

export function theUtilScrubbingData<T>(
  data: Set<T>,
  key: T,
  mask: T,
  options?: SetOptions,
): Set<T>;

export function theUtilScrubbingData<O extends Record<PropertyKey, any>, K extends keyof O>(
  data: O,
  key: K,
  mask: O[K],
  options?: MapObjOptions,
): O;

// Implementation
export function theUtilScrubbingData(
  data: any,
  key: any,
  mask?: any,
  options?: any,
): any {
  try {
    // string → mask (defaulting)
    if (typeof data === 'string') {
      return mask ?? '********';
    }

    // Array → replace at index; optionally expand
    if (Array.isArray(data) && typeof key === 'number') {
      const { allowExpand = false, filler } = (options ?? {}) as ArrayOptions<any>;
      if (key < 0) return data;

      const arr = data.slice();
      if (key >= arr.length) {
        if (!allowExpand) return data;
        // expand and backfill with `filler` (or undefined if not provided)
        arr.length = key + 1;
        for (let i = 0; i < arr.length; i++) {
          if (typeof arr[i] === 'undefined') arr[i] = filler;
        }
      }
      arr[key] = mask;
      return arr;
    }

    // Map → set if exists, or create if missing (option)
    if (data instanceof Map) {
      const { createIfMissing = false } = (options ?? {}) as MapObjOptions;
      const cloned = new Map(data as Map<any, any>);
      if (cloned.has(key) || createIfMissing) {
        cloned.set(key, mask);
      }
      return cloned;
    }

    // Set → replace if present; or add if missing (option)
    if (data instanceof Set) {
      const { setWhenMissing = false } = (options ?? {}) as SetOptions;
      const cloned = new Set(data as Set<any>);
      if (cloned.has(key)) {
        cloned.delete(key);
        cloned.add(mask);
      } else if (setWhenMissing) {
        cloned.add(mask);
      }
      return cloned;
    }

    // Plain object → replace own prop; or create if missing (option)
    if (data && typeof data === 'object') {
      const { createIfMissing = false } = (options ?? {}) as MapObjOptions;
      const hasOwn = Object.prototype.hasOwnProperty.call(data, key);
      if (hasOwn || createIfMissing) {
        return {
          ...(data as object),
          [key]: mask,
        };
      }
      return data;
    }

    return data;
  } catch {
    return data;
  }
}
