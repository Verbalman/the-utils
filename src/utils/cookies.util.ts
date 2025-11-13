/**
 * Options for setting a cookie.
 */
export interface TheUtilCookieSetOptions {
  /**
   * Number of days until the cookie expires.
   * Ignored if `expires` or `maxAgeSeconds` is provided.
   */
  daysToExpire?: number;

  /**
   * Exact expiration date for the cookie.
   * Can be a Date instance or a string that can be parsed by `new Date(...)`.
   */
  expires?: Date | string;

  /**
   * Max-Age attribute in seconds.
   * If set, this has higher priority than `daysToExpire`.
   */
  maxAgeSeconds?: number;

  /**
   * Cookie path. Defaults to '/' in most common use cases.
   */
  path?: string;

  /**
   * Cookie domain. Optional.
   */
  domain?: string;

  /**
   * Indicates that the cookie should only be transmitted over secure protocols.
   */
  secure?: boolean;

  /**
   * SameSite attribute.
   */
  sameSite?: 'Strict' | 'Lax' | 'None';
}

/**
 * Safely escapes a cookie name for use in a regular expression.
 *
 * @param {string} name - Cookie name to escape.
 * @returns {string} Escaped cookie name safe for RegExp.
 * @internal
 */
const _escapeCookieNameForRegExp = (name: string): string =>
  name.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

/**
 * Extracts a cookie value by its name in a safe, cross-browser way.
 *
 * - Works in all modern browsers.
 * - Avoids SSR errors by checking `document`.
 * - Decodes URI-encoded cookie values.
 *
 * @param {string} name - The name of the cookie to retrieve.
 * @returns {string} The decoded cookie value, or an empty string if not found.
 *
 * @example
 * theUtilGetCookieByName('token'); // => "abc123"
 */
export const theUtilGetCookieByName = (name: string): string => {
  if (typeof document === 'undefined' || !document.cookie) {
    return '';
  }

  const escapedName = _escapeCookieNameForRegExp(name);
  const pattern = new RegExp(`(?:^|;\\s*)${escapedName}=([^;]*)`);
  const match = document.cookie.match(pattern);

  return match ? decodeURIComponent(match[1]) : '';
};

/**
 * Sets a cookie with the given name, value and optional attributes.
 *
 * - Automatically encodes name and value.
 * - Supports `expires`, `maxAgeSeconds`, `daysToExpire`, `path`, `domain`, `secure`, `sameSite`.
 * - Safe in SSR environments (no-op when `document` is undefined).
 *
 * @param {string} name - Cookie name.
 * @param {string} value - Cookie value.
 * @param {TheUtilCookieSetOptions} [options] - Additional cookie attributes.
 *
 * @example
 * theUtilSetCookie('token', 'abc123', { daysToExpire: 7, path: '/' });
 *
 * @example
 * theUtilSetCookie('lang', 'en', {
 *   maxAgeSeconds: 60 * 60 * 24,
 *   sameSite: 'Lax',
 *   secure: true
 * });
 */
export const theUtilSetCookie = (
  name: string,
  value: string,
  options: TheUtilCookieSetOptions = {}
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const encodedName = encodeURIComponent(name);
  const encodedValue = encodeURIComponent(value);
  const parts: string[] = [`${encodedName}=${encodedValue}`];

  // Max-Age has priority over daysToExpire
  if (typeof options.maxAgeSeconds === 'number') {
    parts.push(`Max-Age=${Math.floor(options.maxAgeSeconds)}`);
  }

  let expires: string | undefined;

  if (options.expires instanceof Date) {
    expires = options.expires.toUTCString();
  } else if (typeof options.expires === 'string') {
    const date = new Date(options.expires);
    if (!Number.isNaN(date.getTime())) {
      expires = date.toUTCString();
    }
  } else if (typeof options.daysToExpire === 'number') {
    const date = new Date();
    date.setTime(
      date.getTime() + options.daysToExpire * 24 * 60 * 60 * 1000
    );
    expires = date.toUTCString();
  }

  if (expires) {
    parts.push(`Expires=${expires}`);
  }

  if (options.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  if (options.secure) {
    parts.push('Secure');
  }

  if (options.sameSite) {
    parts.push(`SameSite=${options.sameSite}`);
  }

  document.cookie = parts.join('; ');
};

/**
 * Deletes a cookie by its name.
 *
 * Internally sets the cookie with an expiration date in the past.
 * If you set cookies with a specific path or domain, provide the same values
 * so deletion works correctly.
 *
 * @param {string} name - Cookie name to delete.
 * @param {{ path?: string; domain?: string }} [options] - Optional path and domain.
 *
 * @example
 * theUtilDeleteCookie('token');
 *
 * @example
 * theUtilDeleteCookie('session', { path: '/', domain: '.example.com' });
 */
export const theUtilDeleteCookie = (
  name: string,
  options?: { path?: string; domain?: string }
): void => {
  if (typeof document === 'undefined') {
    return;
  }

  const encodedName = encodeURIComponent(name);
  const parts: string[] = [`${encodedName}=`];

  // Expire in the past
  parts.push('Expires=Thu, 01 Jan 1970 00:00:00 GMT');

  if (options?.path) {
    parts.push(`Path=${options.path}`);
  }

  if (options?.domain) {
    parts.push(`Domain=${options.domain}`);
  }

  document.cookie = parts.join('; ');
};
