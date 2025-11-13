/**
 * Determines whether the provided value is an async function.
 *
 * This utility safely checks if the given value is an instance of
 * `AsyncFunction` by obtaining its constructor via `Object.getPrototypeOf`
 * instead of relying on direct global access — making it fully cross-browser
 * and SSR-safe.
 *
 * @template T
 * @param {T} fn - The value to check.
 * @returns {boolean} `true` if the value is an async function, otherwise `false`.
 *
 * @example
 * ```ts
 * async function test() {}
 * theUtilIsAsyncFunction(test); // true
 * ```
 *
 * @example
 * ```ts
 * function syncFn() {}
 * theUtilIsAsyncFunction(syncFn); // false
 * ```
 */
export function theUtilIsAsyncFunction<T>(fn: T): boolean {
  if (typeof fn !== 'function') return false;

  // Avoid throwing in SSR environments
  const AsyncFunction = Object.getPrototypeOf(async () => {}).constructor;

  return fn.constructor === AsyncFunction;
}
