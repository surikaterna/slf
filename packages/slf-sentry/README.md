# slf-sentry

SLF driver for Sentry, with optional fan-out to `slf-debug`.

## Install

```bash
npm install slf slf-debug slf-sentry debug @sentry/node
```

## Quick start

```ts
import debug from 'debug';
import { LoggerFactory } from 'slf';
import createSlfDriver from 'slf-sentry';

debug.enable('api:*');

LoggerFactory.setFactory(
  createSlfDriver(process.env.SENTRY_DSN, {
    environment: process.env.NODE_ENV || 'dev',
    level: 'warn',
    levels: ['warn', 'error', 'critical']
  })
);

const log = LoggerFactory.getLogger('api:orders');
log.warn('Order total mismatch', { orderId: 'o-123' });
```

## Exports

- default export: `createSlfDriver(sentryUrl?, options?)`
  - no `sentryUrl`: returns plain `slf-debug` driver
  - with `sentryUrl`: returns combined driver (`slf-debug` + Sentry)
- named export: `createSlfSentryDebugDriver(sentryUrl, options?)`
- named export: `createSlfSentryDriver(sentryUrl, options?)`

## Options

`CreateSlfSentryLoggerOptions`:

- `debug?: boolean`
- `environment?: string` (default: `process.env.SENTRY_ENV ?? 'dev'`)
- `level?: string` (default: `'error'`)
- `levels?: string[]` (default: `['error']`)
- `release?: string`
- `shouldIgnore?: (event) => boolean`
- `tags?: Record<string, string | number | boolean>`

## What gets sent to Sentry

- Events with levels not in configured threshold are ignored.
- If an `Error` exists in params, it is sent via `captureException`.
- Otherwise, first param is used as message via `captureMessage`.
- Remaining params are attached as Sentry extras (`param-1`, `param-2`, ...).
