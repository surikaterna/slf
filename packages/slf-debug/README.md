# slf-debug

SLF driver that sends logs to [`debug`](https://www.npmjs.com/package/debug).

## Install

```bash
npm install slf slf-debug debug
```

## Quick start

```ts
import debug from 'debug';
import { LoggerFactory } from 'slf';
import slfDebug from 'slf-debug';

debug.enable('api:*');
LoggerFactory.setFactory(slfDebug);

const log = LoggerFactory.getLogger('api:users');
log.info('User loaded: %s', '123');
```

## Enable logs with `DEBUG`

The driver uses the SLF logger name as its `debug` namespace. Set `DEBUG` before starting your application to select which names produce output:

```bash
DEBUG=api:* npm start
```

This enables logs from `api:users` and other `api:*` loggers. Use `DEBUG=*` to enable all namespaces, or a comma-separated list such as `DEBUG=api:*,worker:billing:*` to enable several. Without a matching `DEBUG` namespace (or a call to `debug.enable()` as shown above), the debug driver produces no output.

`DEBUG` controls which logger names are enabled; `SLF_LOG_LEVEL` independently sets the minimum log level (for example, `SLF_LOG_LEVEL=info DEBUG=api:* npm start`).

## Behavior

- Reuses one `debug` logger per SLF logger name.
- Prepends each message with ISO timestamp and uppercase level.
- If first param is a string, it is combined with the prefix.
- If params contain `Error`, stack/message is used for better readability.

Example output shape:

```text
2026-04-27T09:30:00.000Z INFO User loaded: 123
```

## Recommended namespaces

Use structured logger names so `debug.enable()` filters are useful:

- `api:*`
- `worker:billing:*`
- `http:request`
