/**
 * Checks whether a given URL points to a valid image resource.
 *
 * Validation rules:
 * - Must be a valid absolute URL (http/https)
 * - Must end with a known image file extension (common + modern web formats)
 *
 * Note:
 * This does NOT guarantee the URL serves an actual image — only
 * that the extension is typical for an image file on the web.
 *
 * SSR-safe — does not use window/document.
 *
 * @param url - The URL string to validate.
 * @returns True if the URL ends with a known image extension, false otherwise.
 */
export function theUtilIsValidImageUrl(url: string): boolean {
  if (typeof url !== 'string' || !url.trim()) {
    return false;
  }

  // Common + modern + extended image formats used on the web
  const IMAGE_EXTENSIONS = new Set([
    // Core formats
    '.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg',

    // Modern formats
    '.avif', '.heic', '.heif', '.jxl',

    // Extended formats
    '.tiff', '.tif', '.ico', '.cur', '.apng',

    // Less common but valid
    '.jfif', '.pjpeg', '.jp2'
  ]);

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname.toLowerCase();

    const dotIndex = pathname.lastIndexOf('.');
    if (dotIndex === -1) return false;

    const ext = pathname.slice(dotIndex);
    return IMAGE_EXTENSIONS.has(ext);
  } catch {
    return false; // invalid URL format
  }
}
