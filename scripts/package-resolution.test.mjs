import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-legacy';

const root = fileURLToPath(new URL('../', import.meta.url));
const packages = ['slf', 'slf-debug', 'slf-sentry'];

test('published package resolution', async (t) => {
  const fixture = mkdtempSync(join(tmpdir(), 'slf-resolution-'));
  t.after(() => rmSync(fixture, { recursive: true, force: true }));
  const modules = join(fixture, 'node_modules');
  mkdirSync(modules);

  for (const name of packages) {
    const output = execFileSync('npm', ['pack', `./packages/${name}`, '--ignore-scripts', '--json', '--pack-destination', fixture], { cwd: root, encoding: 'utf8' });
    const [{ filename }] = JSON.parse(output);
    const destination = join(modules, name);
    mkdirSync(destination);
    execFileSync('tar', ['-xzf', join(fixture, filename), '--strip-components=1', '-C', destination]);
  }
  for (const name of ['debug', '@sentry', '@types']) {
    symlinkSync(join(root, 'node_modules', name), join(modules, name), 'dir');
  }

  await t.test('legacy fallback resolves to CommonJS declarations', () => {
    for (const name of packages) {
      const manifest = JSON.parse(readFileSync(join(modules, name, 'package.json'), 'utf8'));
      assert.equal(manifest.types, './dist/index.d.cts');
      const result = ts.resolveModuleName(name, join(fixture, 'consumer.ts'), { moduleResolution: ts.ModuleResolutionKind.Node10 }, ts.sys);
      assert.ok(result.resolvedModule?.resolvedFileName.endsWith('/index.d.cts'), name);
    }
  });

  for (const format of ['cjs', 'mjs']) {
    await t.test(`${format} runtime exports`, () => {
      const source = format === 'cjs' ? "const slf = require('slf'); const debug = require('slf-debug'); const sentry = require('slf-sentry');" : "import * as slf from 'slf'; import * as debug from 'slf-debug'; import * as sentry from 'slf-sentry';";
      const file = join(fixture, `runtime.${format}`);
      writeFileSync(
        file,
        `${source}
        const assert = (condition) => { if (!condition) throw new Error('Missing runtime export'); };
        assert(typeof slf.LoggerFactory.getLogger === 'function');
        assert(typeof slf.Logger === 'function');
        assert(typeof ${format === 'cjs' ? 'debug' : 'debug.default'} === 'function');
        assert(typeof sentry.default === 'function');
        assert(typeof sentry.createSlfSentryDebugDriver === 'function');
      `
      );
      execFileSync(process.execPath, [file], { cwd: fixture, stdio: 'pipe' });
    });
  }

  const source = `import { LoggerFactory, Level, type Event } from 'slf';
    import debug from 'slf-debug';
    import { type CreateSlfSentryLoggerOptions } from 'slf-sentry';
    const logger = LoggerFactory.getLogger('consumer');
    logger.info('smoke test');
    const driver: (...events: Event[]) => void = debug;
    const options: CreateSlfSentryLoggerOptions = { shouldIgnore: (event) => event.level === 'debug' };
    LoggerFactory.setFactory(driver, Level.Info);
  `;

  for (const [compiler, mode, extension] of [
    ['typescript-legacy', 'node', 'ts'],
    ['typescript-legacy', 'nodenext', 'cts'],
    ['typescript-legacy', 'nodenext', 'mts'],
    ['typescript', 'nodenext', 'cts'],
    ['typescript', 'nodenext', 'mts']
  ]) {
    await t.test(`${compiler}: ${mode} ${extension} consumer`, () => {
      const directory = join(fixture, `${compiler}-${mode}-${extension}`);
      mkdirSync(directory);
      writeFileSync(join(directory, `consumer.${extension}`), source);
      writeFileSync(
        join(directory, 'tsconfig.json'),
        JSON.stringify({
          compilerOptions: {
            target: 'ES2022',
            module: mode === 'node' ? 'commonjs' : 'nodenext',
            moduleResolution: mode,
            esModuleInterop: true,
            strict: true,
            noEmit: true,
            types: []
          },
          files: [`consumer.${extension}`]
        })
      );
      const compilerRoot = dirname(join(root, 'node_modules', compiler, 'package.json'));
      try {
        execFileSync(process.execPath, [join(compilerRoot, 'bin/tsc'), '-p', directory], { cwd: fixture, encoding: 'utf8' });
      } catch (error) {
        assert.fail(error.stdout || error.message);
      }
    });
  }
});
