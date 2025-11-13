/**
 * Raw input type for {@link theUtilParseBooleanQuery}.
 *
 * Typically this is the result of `URLSearchParams.get()`, which can be
 * a string or `null`.
 */
export type TheUtilBooleanQueryInput = string | null | undefined;

/**
 * Allowed default value type for {@link theUtilParseBooleanQuery}.
 */
export type TheUtilBooleanQueryDefault = boolean | undefined;

/**
 * Result type of {@link theUtilParseBooleanQuery}.
 */
export type TheUtilBooleanQueryResult = boolean | undefined;

/**
 * Safely parses a boolean value from a query-string parameter.
 *
 * Only the string values `"true"` and `"false"` (case-insensitive) are
 * treated as valid boolean values.
 *
 * - `"true"`  → `true`
 * - `"false"` → `false`
 * - Anything else (including `null`, `undefined`, empty string, or any
 *   other value) returns `defaultValue`.
 *
 * This util is designed to work with values from `URLSearchParams.get()`
 * and is safe to use in all modern browsers.
 *
 * @example
 * const search = new URLSearchParams('?debug=true&show=false&other=1');
 *
 * theUtilParseBooleanQuery(search.get('debug'), false); // true
 * theUtilParseBooleanQuery(search.get('show'), true);   // false
 * theUtilParseBooleanQuery(search.get('other'), false); // false (fallback)
 * theUtilParseBooleanQuery(search.get('missing'), true); // true (fallback)
 *
 * @param value - Raw value from query string, usually `URLSearchParams.get(...)`.
 * @param defaultValue - Fallback value when the input cannot be parsed.
 *   If not provided, `undefined` will be returned for invalid values.
 *
 * @returns `true` or `false` when parsed, otherwise `defaultValue`.
 */
export function theUtilParseBooleanQuery(
  value: TheUtilBooleanQueryInput,
  defaultValue?: TheUtilBooleanQueryDefault,
): TheUtilBooleanQueryResult {
  if (typeof value !== 'string') return defaultValue;

  const trimmed = value.trim();
  if (!trimmed) return defaultValue;

  const normalized = trimmed.toLowerCase();
  if (normalized === 'true') return true;
  if (normalized === 'false') return false;

  return defaultValue;
}
