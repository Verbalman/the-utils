# @the-utils

Small, framework-agnostic collection of TypeScript utility functions with:
- Strong typings & JSDoc
- Cross-browser safe implementations
- Simple, predictable naming with `theUtil*` prefix
- Ready to use in any JS stack (React, Next.js, Vue, Nuxt, Angular, Node, etc.)

---


## Installation

```bash
npm install @the-oleg/the-utils
# or
yarn add @the-oleg/the-utils
# or
pnpm add @the-oleg/the-utils
```

---


## Usage

### ES Modules

```typescript
import {
  theUtilGenerateUUID,
  theUtilOmitKeys,
  theUtilAddPrefetch,
  theUtilWriteLocalStorageWithExpiry,
  theUtilReadLocalStorageWithExpiry,
  theUtilLeftOnlyNumbersInString,
  theUtilScrubbingData,
} from '@the-oleg/the-utils';

const id = theUtilGenerateUUID();
```

### CommonJS

```typescript
const {
  theUtilGenerateUUID,
  theUtilOmitKeys,
  theUtilAddPrefetch,
  theUtilWriteLocalStorageWithExpiry,
  theUtilReadLocalStorageWithExpiry,
  theUtilLeftOnlyNumbersInString,
  theUtilScrubbingData,
} = require('@the-oleg/the-utils');

const id = theUtilGenerateUUID();
```

---


## API Reference

### theUtilGenerateUUID

```typescript
function theUtilGenerateUUID(): string;
```

Generates a UUID v4 string.
- Uses `crypto.randomUUID()` when available (modern browsers / Node 19+)
- Falls back to a Math.random-based implementation if `crypto` is not available
(fallback is **not cryptographically secure**)

```typescript
const id = theUtilGenerateUUID();
// "b2c5f5b8-3a0a-4d13-a713-9f0c1f76c05d"
```

---

### theUtilOmitKeys

```typescript
function theUtilOmitKeys<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K>;
```

Creates a **shallow copy** of an object without the specified keys.

```typescript
const user = { id: 1, name: 'Test', password: 'secret' };

const safe = theUtilOmitKeys(user, ['password']);
// { id: 1, name: 'Test' }
```

TypeScript keeps correct typing:

```typescript
const result = theUtilOmitKeys(user, ['password']);
//    ^? { id: number; name: string; }
```

---

### theUtilAddPrefetch

```typescript
interface AddPrefetchOptions {
  href: string;
  rel: string; // e.g. "preload" | "prefetch"
  as: string;  // e.g. "script" | "style" | "image"
  type?: string;
  crossorigin?: boolean;
  media?: string;
}

function theUtilAddPrefetch(options: AddPrefetchOptions): void;
```

Injects a `<link>` tag into `document.head` for resource preloading/prefetching.
Safe for SSR: if `document` is not available it simply does nothing.
- Does nothing if:
  - `document` is undefined (server-side)
  - `href`, `rel` or `as` is missing 
  - A `<link>` with the same href already exists

```typescript
theUtilAddPrefetch({
  href: '/assets/main.css',
  rel: 'preload',
  as: 'style',
});
```

This will append something like:

```html
<link rel="preload" as="style" href="/assets/main.css">
```

to <head> in the browser.

---

### theUtilWriteLocalStorageWithExpiry

```typescript
function theUtilWriteLocalStorageWithExpiry<T>(
  key: string,
  value: T,
  ttl?: number, // ms, default: 2 hours
): void;
```

Writes a value to `localStorage` with an expiry time (TTL).
- Internally stores `{ value, expiry }`
- Catches and logs errors (e.g. when `localStorage` is unavailable)

```typescript
// Store user token for 1 hour
theUtilWriteLocalStorageWithExpiry('userToken', 'abc123', 60 * 60 * 1000);
```

### theUtilReadLocalStorageWithExpiry

```typescript
function theUtilReadLocalStorageWithExpiry<T>(key: string): T | null;
```

Reads a value previously stored with `theUtilWriteLocalStorageWithExpiry`.
- Returns:
  - parsed value if present and not expired
  - `null` if missing, expired, or parsing failed
- Automatically removes expired items from `localStorage`

```typescript
const token = theUtilReadLocalStorageWithExpiry<string>('userToken');

if (!token) {
  // token missing or expired
}
```

---

### theUtilLeftOnlyNumbersInString

```typescript
function theUtilLeftOnlyNumbersInString(str: string): string;
```

Extracts the leading numeric value from a string using `parseFloat`
and returns it as a normalized string.
- `"123abc"` → `"123"`
- `" 01.20 "` → `"1.2"`
- `"abc"` → `"abc"` (string is unchanged if not parseable)

```typescript
theUtilLeftOnlyNumbersInString('  01.20 uah');
// "1.2"

theUtilLeftOnlyNumbersInString('abc');
// "abc"
```

---

### theUtilScrubbingData

Overloaded helper to immutably “scrub” a value in different data structures.

Signatures

```typescript
// string → mask entire string
function theUtilScrubbingData(
  data: string,
  key: PropertyKey,
  mask?: string,
): string;

// array → replace by index
function theUtilScrubbingData<T>(
  data: T[],
  key: number,
  mask: T,
  options?: { allowExpand?: boolean; filler?: T },
): T[];

// Map → replace by key (optionally create if missing)
function theUtilScrubbingData<K, V>(
  data: Map<K, V>,
  key: K,
  mask: V,
  options?: { createIfMissing?: boolean },
): Map<K, V>;

// Set → replace value (or add if missing)
function theUtilScrubbingData<T>(
  data: Set<T>,
  key: T,
  mask: T,
  options?: { setWhenMissing?: boolean },
): Set<T>;

// object → replace property (optionally create if missing)
function theUtilScrubbingData<O extends Record<PropertyKey, any>, K extends keyof O>(
  data: O,
  key: K,
  mask: O[K],
  options?: { createIfMissing?: boolean },
): O;
```

**Behavior**
- Always returns a **new instance** (does not mutate original)
- Catches errors and returns original data as a fallback


#### Examples

Scrub object field

```typescript
const payload = { email: 'user@example.com', token: 'secret' };

const scrubbed = theUtilScrubbingData(payload, 'token', '***');
// { email: 'user@example.com', token: '***' }
```

Create missing field

```typescript
const user = { id: 1 };

const withMaskedEmail = theUtilScrubbingData(
  user,
  'email',
  'hidden@example.com',
  { createIfMissing: true },
);
// { id: 1, email: 'hidden@example.com' }
```

Scrub array by index

```typescript
const arr = [1, 2, 3];

theUtilScrubbingData(arr, 1, 999);
// [1, 999, 3]
```

Expand array with filler

```typescript
theUtilScrubbingData([], 3, 7, { allowExpand: true, filler: 0 });
// [0, 0, 0, 7]
```

Scrub Map

```typescript
const m = new Map<string, string>([['password', 'secret']]);

theUtilScrubbingData(m, 'password', '***');
// Map { 'password' => '***' }
```

Scrub Set

```typescript
const s = new Set([1, 2, 3]);

theUtilScrubbingData(s, 2, 999);
// Set { 1, 999, 3 }
```

---


## TypeScript & Tooling

- Written in **TypeScript** 
- Bundled with **Vite** + `vite-plugin-dts` 
- Exposes:
  - ESM: `module` field 
  - CommonJS: `main` field 
  - Types: `types` field + `exports["."].types`
- Works with any bundler (Vite, Webpack, Turbopack, etc.)

---


## Browser / Environment Notes

- `theUtilAddPrefetch` does nothing if `document` is not defined (SSR-safe).
- `theUtilGenerateUUID`:
  - uses `globalThis.crypto.randomUUID()` when available 
  - falls back to a non-cryptographic implementation otherwise
- `localStorage` helpers catch errors (e.g. when disabled or unavailable) and log
using a consistent prefix: `@the-oleg/the-utils:`.

---


## License

MIT © Oleg Kasianets

