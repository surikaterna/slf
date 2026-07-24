import { defineConfig, type Options } from 'tsdown';

export function createTsdownConfig(overrideOptions: Options = {}) {
  return defineConfig(() => {
    const defaultOptions: Options = {
      entry: ['src/index.ts'],
      outDir: 'dist',
      format: ['cjs', 'esm'],
      dts: true,
      clean: true,
      sourcemap: true,
      minify: false,
      splitting: false
    };

    return {
      ...defaultOptions,
      ...overrideOptions
    };
  });
}
