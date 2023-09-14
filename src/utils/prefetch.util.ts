import { ConfigEnum } from '../enum';

export const enum AddPrefetchRelEnum {
  PRELOAD = 'preload',
  PREFETCH = 'prefetch',
  PRERENDER = 'prerender',
  SUBRESOURCE = 'subresource',
}

export const enum AddPrefetchAsEnum {
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

export const enum AddPrefetchMediaTypeEnum {
  ALL = 'all',
  PRINT = 'print',
  SCREEN = 'screen'
}

export interface AddPrefetchOptions {
  href: string;
  rel: AddPrefetchRelEnum | string;
  as: AddPrefetchAsEnum | string;
  type?: string;
  crossorigin?: boolean;
  media?: AddPrefetchMediaTypeEnum | string;
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload
 *
 * @param data
 */
export const addPrefetch = (data: AddPrefetchOptions): void => {
  try {
    if (!data?.href || !data?.rel || !data?.as || document.querySelector(`[href="${data.href}"]`)) {
      return;
    }

    const preloadLink = document.createElement("link");
    preloadLink.href = data.href;
    preloadLink.rel = data.rel;
    preloadLink.as = data.as;

    if (data?.type) {
      preloadLink.type = data.type;
    }

    if (data?.crossorigin) {
      preloadLink.setAttribute('crossorigin', '');
    }

    if (data?.media) {
      preloadLink.setAttribute('media', data.media);
    }

    document.head.appendChild(preloadLink);
  } catch (e) {
    console.warn(`${ConfigEnum.LOG_PREFIX} Cannot prefetch:`, data.href);
  }
};
