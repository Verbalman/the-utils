import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    lib: {
      formats: ['es', 'umd', 'cjs'],
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'TheUtils',
      fileName: 'the-utils'
    }
  },
  plugins: [
    dts(),
  ],
});
