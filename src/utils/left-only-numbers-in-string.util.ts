
/**
 * Extracts the leading numeric value from a string and returns it as a normalized string.
 *
 * Uses `parseFloat` under the hood:
 * - `"123abc"` → `"123"`
 * - `"  01.20 "` → `"1.2"`
 * - `"abc"` → `"abc"` (unchanged, because it is not parseable as a number)
 *
 * @param str - Source string.
 * @returns Parsed number as string or the original string if not parseable.
 */
export const theUtilLeftOnlyNumbersInString = (str: string): string => {
  if (!str) return str;

  const parsed = Number.parseFloat(str);
  return Number.isNaN(parsed) ? str : parsed.toString();
}
