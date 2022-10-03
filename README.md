# slf

Surikat Log Facade

## Install

```bash
npm install --save slf
```

## API

Get a logger

```javascript
import { LoggerFactory } from 'slf';

const log = LoggerFactory.getLogger('name');

const log = LoggerFactory.getLogger('name:subname:subsubname');
```

### Logging

```javascript
log('Hello!'); // As level info
log.log('info', 'Hello!'); // as level info
log.log('Hello!'); // as level info (implicit)

log.trace('My Trace');
log.debug('My Debug');
log.info('My Info');
log.warn('My Warning');
log.error('My Error');
log.critical('My Critical Error');
```

### Formatting

Using util.format(...)

- %s - String.
- %d - Number (both integer and float).
- %j - JSON. Replaced with the string '[Circular]' if the argument contains circular references.
- %% - single percent sign ('%'). This does not consume an argument.

```javascript
log.info('My Formatted %s', 'Message') >> 'My Formatted Message';
log.info('My Formatted %d', 123) >> 'My Formatted 123';
log.info('My Formatted %d', 123) >> 'My Formatted 123';
```

Json Formatting

```javascript
log.info({ a: 'aloha' }) >> { a: 'aloha' };
log.info('My Formatted %d', 123) >> 'My Formatted 123';
log.info('My Formatted %d', 123) >> 'My Formatted 123';
```

## Configuring a Provider

```javascript
LoggerFactory.setFactory(<factory-function>);
LoggerFacotry.setFactory(ConsoleLogger);
```

### Log Levels

When setting a factory provider, you can also set a level to ensure not to send logs if the level is too low.

Get levels

```javascript
import { Level } from 'slf';
```

Set Level

```javascript
LoggerFacotry.setFactory(ConsoleLogger, Level.Info);
```

**Hierarchy**

- Critical
- Error
- Warn
- Info
- Debug

## Writing a Provider

SLF is nothing without a backing logging implementation.
The most tiny implementation of a console.log based implementation is shipped with SLF

### API

factory-function has the following signature:

```javascript
function(loggerName) {
  return function(event) {
    //do something with logEvent
  }
}
event = {
  timeStamp: 123456767,
  params: [],
  name: 'logger:name'
  level: 'error'
}
```
