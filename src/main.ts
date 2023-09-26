import { generateUUID } from './utils/generate-uuid.util';
import { leftOnlyNumbersInString } from './utils/getOnlyNumbersInSrting.util';
import { readLocalStorageWithExpiry, writeLocalStorageWithExpiry } from './utils/local-storage.util';
import { addPrefetch } from './utils/prefetch.util';

export default {
  writeLocalStorageWithExpiry,
  readLocalStorageWithExpiry,

  addPrefetch,

  generateUUID,

  leftOnlyNumbersInString,
};
