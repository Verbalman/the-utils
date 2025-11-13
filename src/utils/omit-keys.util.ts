/**
 * Returns a shallow copy of the object without the specified keys.
 *
 * @typeParam T - Source object type.
 * @typeParam K - Keys to omit from the source object.
 *
 * @param obj - Source object.
 * @param keys - Array of keys to remove from the object.
 * @returns A new object without the specified keys.
 */
export function theUtilOmitKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result: Partial<T> = { ...obj };
  for (const key of keys) {
    delete (result as T)[key];
  }
  return result as Omit<T, K>;
}
