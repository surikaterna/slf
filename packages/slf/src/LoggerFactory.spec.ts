import { Event, LoggerFactory, Middleware } from './LoggerFactory';

describe('LoggerFactory middleware', () => {
  const registered: Middleware[] = [];

  afterEach(() => {
    registered.forEach((middleware) => LoggerFactory.remove(middleware));
    registered.length = 0;
    LoggerFactory.setFactory(null);
  });

  it('registers each middleware reference only once', () => {
    const events: Event[] = [];
    LoggerFactory.setFactory((event) => events.push(event));
    const log = LoggerFactory.getLogger('test');
    const middleware: Middleware = (event, next) => {
      event.params.push('once');
      next(null, event);
    };
    registered.push(middleware);

    LoggerFactory.use(middleware);
    LoggerFactory.use(middleware);
    log.info('message');

    expect(events[0].params).toEqual(['message', 'once']);
  });

  it('removes middleware from existing loggers and allows re-registration', () => {
    const events: Event[] = [];
    LoggerFactory.setFactory((event) => events.push(event));
    const log = LoggerFactory.getLogger('test');
    const first: Middleware = (event, next) => {
      event.params.push('first');
      next(null, event);
    };
    const second: Middleware = (event, next) => {
      event.params.push('second');
      next(null, event);
    };
    registered.push(first, second);

    LoggerFactory.use(first);
    LoggerFactory.use(second);
    expect(LoggerFactory.remove(first)).toBe(true);
    expect(LoggerFactory.remove(first)).toBe(false);
    log.info('after removal');

    LoggerFactory.use(first);
    log.info('after re-registration');

    expect(events.map((event) => event.params)).toEqual([
      ['after removal', 'second'],
      ['after re-registration', 'second', 'first']
    ]);
  });
});
