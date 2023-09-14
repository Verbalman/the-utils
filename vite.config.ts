// @ts-ignore
import { defineConfig, defineConfigEnv } from 'vite';
import { resolve } from 'path';
// @ts-ignore
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      formats: ['es', 'umd', 'cjs'],
      entry: resolve(__dirname, `src/main.ts`),
      name: 'TheUtils',
      filename: 'the-utils'
    },
  },
  plugins: [
    dts(),
  ],
});
