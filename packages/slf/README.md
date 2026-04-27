# slf

Simple Logging Facade for Node.js applications.

## Install

```bash
npm install slf
```

## Quick start

```ts
import { ConsoleLogger, LoggerFactory } from 'slf';

LoggerFactory.setFactory(ConsoleLogger);

const log = LoggerFactory.getLogger('app:startup');

log.info('Boot complete');
log.warn('Configuration is missing optional key: %s', 'featureX');
```

## Log levels

Available levels:

- `debug`
- `info`
- `warn`
- `error`
- `critical`

Set a minimum level when configuring the factory:

```ts
import { ConsoleLogger, Level, LoggerFactory } from 'slf';

LoggerFactory.setFactory(ConsoleLogger, Level.Info);
```

Or set the level via environment variable:

```bash
SLF_LOG_LEVEL=debug
```

Supported values should be lower case: `debug`, `info`, `warn`, `error`, `critical`.

## Logger API

Create a logger:

```ts
import { LoggerFactory } from 'slf';

const log = LoggerFactory.getLogger('service:payments');
```

Write logs:

```ts
log.debug('Debug message');
log.info('Info message');
log.warn('Warn message');
log.error('Error message');
```

Generic method:

```ts
log.log('warn', 'Low disk space: %d%%', 9);
log.log('This defaults to info');
```

## Middleware

You can intercept and modify log events:

```ts
import { LoggerFactory } from 'slf';

LoggerFactory.use((event, next) => {
  event.params = ['[my-service]', ...event.params];
  next(null, event);
});
```

## Writing a custom driver

A factory receives one or more events:

```ts
import { Event, LoggerFactory } from 'slf';

const customFactory = (...events: Event[]) => {
  for (const event of events) {
    // send event to your logging backend
  }
};

LoggerFactory.setFactory(customFactory);
```

Each event has:

- `name`: logger name
- `level`: lowercase log level string
- `params`: original log arguments
- `timeStamp`: epoch milliseconds
