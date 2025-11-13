
/**
 * Generates a UUID v4 string.
 * https://developer.mozilla.org/en-US/docs/Web/API/Crypto
 *
 * Uses `crypto.randomUUID()` when available (modern browsers / Node 19+),
 * otherwise falls back to a Math.random-based implementation (NOT cryptographically secure).
 *
 * @returns UUID v4 string.
 */
export function theUtilGenerateUUID(): string {
  const g = globalThis as any;
  const cryptoObj = g?.crypto;

  if (cryptoObj?.randomUUID) {
    return cryptoObj.randomUUID();
  }

  // Fallback (non-cryptographic)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c: string) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
