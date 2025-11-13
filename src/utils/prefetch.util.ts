import { ConfigEnum } from '../enum.ts';


export const enum TheUtilAddPrefetchRelEnum {
  PRELOAD = 'preload',
  PREFETCH = 'prefetch',
  PRERENDER = 'prerender',
  SUBRESOURCE = 'subresource',
}

export const enum TheUtilAddPrefetchAsEnum {
  AUDIO = 'audio',
  DOCUMENT = 'document',
  EMBED = 'embed',
  FETCH = 'fetch',
  FONT = 'font',
  IMAGE = 'image',
  OBJECT = 'object',
  SCRIPT = 'script',
  STYLE = 'style',
  TRACK = 'track',
  WORKER = 'worker',
  VIDEO = 'video',
}

export const enum TheUtilAddPrefetchMediaTypeEnum {
  ALL = 'all',
  PRINT = 'print',
  SCREEN = 'screen',
}

/**
 * Options for {@link theUtilAddPrefetch}.
 */
export interface TheUtilAddPrefetchOptions {
  /**
   * Target URL of the resource to preload or prefetch.
   */
  href: string;

  /**
   * Relationship type (e.g. "preload", "prefetch").
   */
  rel: TheUtilAddPrefetchRelEnum | string;

  /**
   * Resource type (e.g. "script", "style", "image").
   */
  as: TheUtilAddPrefetchAsEnum | string;

  /**
   * Optional MIME type of the resource.
   */
  type?: string;

  /**
   * Whether to add the `crossorigin` attribute.
   */
  crossorigin?: boolean;

  /**
   * Optional media query (e.g. "screen", "print").
   */
  media?: TheUtilAddPrefetchMediaTypeEnum | string;
}

/**
 * Injects a `<link>` element into the document head for preloading/prefetching resources.
 * Does nothing if:
 * - `document` is not available (e.g. on the server), or
 * - `href` / `rel` / `as` is missing, or
 * - an element with the same `href` already exists.
 *
 * @param data - Prefetch options.
 */
export const theUtilAddPrefetch = (data: TheUtilAddPrefetchOptions): void => {
  try {
    if (typeof document === 'undefined') return;

    if (!data?.href || !data?.rel || !data?.as || document.querySelector(`[href="${data.href}"]`)) {
      return;
    }

    const preloadLink = document.createElement('link');
    preloadLink.href = data.href;
    preloadLink.rel = data.rel;
    preloadLink.as = data.as;

    if (data.type) {
      preloadLink.type = data.type;
    }

    if (data.crossorigin) {
      preloadLink.setAttribute('crossorigin', '');
    }

    if (data.media) {
      preloadLink.setAttribute('media', data.media);
    }

    document.head.appendChild(preloadLink);
  } catch (e) {
    console.warn(`${ConfigEnum.LOG_PREFIX} Cannot prefetch: ${data.href}.`, e);
  }
};
