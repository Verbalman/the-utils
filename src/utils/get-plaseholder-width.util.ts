/**
 * Calculate the rendered width (in pixels) of an input element's placeholder text.
 *
 * ✔ SSR-safe (returns 0 on server)
 * ✔ Cross-browser (Firefox, Safari, Chrome)
 * ✔ Uses computed styles for accurate measurement
 *
 * @param {HTMLInputElement | HTMLTextAreaElement | null} inputEl
 * The input or textarea element whose placeholder width should be measured.
 *
 * @returns {number} The width of the placeholder text in pixels.
 */
export const theUtilGetPlaceholderWidth = (
  inputEl: HTMLInputElement | HTMLTextAreaElement | null
): number => {
  // SSR safety
  if (typeof window === 'undefined' || typeof document === 'undefined') return 0;

  if (!inputEl?.placeholder) return 0;

  const computedStyles = window.getComputedStyle(inputEl);

  const span = document.createElement('span');
  span.textContent = inputEl.placeholder;

  // Copy necessary style properties
  span.style.font = computedStyles.font;
  span.style.fontSize = computedStyles.fontSize;
  span.style.fontWeight = computedStyles.fontWeight;
  span.style.fontFamily = computedStyles.fontFamily;
  span.style.letterSpacing = computedStyles.letterSpacing;
  span.style.whiteSpace = 'pre';

  // Hidden but measurable
  span.style.position = 'absolute';
  span.style.visibility = 'hidden';
  span.style.top = '-9999px';
  span.style.left = '-9999px';

  document.body.appendChild(span);

  const width = span.offsetWidth;

  document.body.removeChild(span);

  return width;
};
