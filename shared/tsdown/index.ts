import { defineConfig, type UserConfig } from 'tsdown';

export function createTsdownConfig(overrideOptions: UserConfig = {}) {
  return defineConfig(() => {
    const defaultOptions: UserConfig = {
      entry: ['src/index.ts'],
      outDir: 'dist',
      format: ['cjs', 'esm'],
      dts: true,
      clean: true,
      sourcemap: true,
      minify: false,
      unbundle: true
    };

    return {
      ...defaultOptions,
      ...overrideOptions
    };
  });
}
