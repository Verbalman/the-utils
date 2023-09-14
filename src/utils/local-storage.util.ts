import { ConfigEnum } from '../enum';

export const writeLocalStorageWithExpiry = (key: string, value: any, ttl: number = 7200000) => {
  try {
    const now = new Date();

    const item = {
      value: value,
      expiry: now.getTime() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error(`${ConfigEnum.LOG_PREFIX} WriteLocalStorageWithExpiry. Error:`, e);
  }
};

export const readLocalStorageWithExpiry = <T>(key: string): T | null => {
  try {
    const itemStr = localStorage.getItem(key);

    if (!itemStr) {
      return null;
    }

    const item = JSON.parse(itemStr);
    const now = new Date();

    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  } catch (e) {
    console.error(`${ConfigEnum.LOG_PREFIX} ReadLocalStorageWithExpiry. Error:`, e);
    return null;
  }
};
