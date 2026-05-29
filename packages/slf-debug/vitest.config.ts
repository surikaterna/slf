import { defineConfig } from 'vitest/config';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      slf: resolve(__dirname, '../slf/src/index.ts')
    }
  },
  test: {
    globals: true,
    include: ['src/**/*.spec.ts'],
    setupFiles: ['./vitest-setup.ts']
  }
});
