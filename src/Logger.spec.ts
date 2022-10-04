import { Event, Level, Logger, LoggerFactory } from '.';

describe('Logger', () => {
  let log: Logger;
  beforeAll(() => {
    log = Logger.getLogger(__filename);
  });
  afterEach(() => {
    LoggerFactory.setFactory(null);
  });

  describe('#log', () => {
    it('should exist', () => {
      if (!('log' in log)) {
        fail();
      }
      log.log('debug', 'should exist');
    });
    it('should queue if no factory is installed', (done) => {
      Logger.getLogger(__filename);
      log.debug('aloha');
      log.info('aloha');
      log.warn('aloha');
      const events: Array<Event> = [];
      LoggerFactory.setFactory((event) => {
        events.push(event);
        if (events.length === 3) {
          const [debug, info, warn] = events;
          expect(debug.level).toBe('debug');
          expect(debug.params[0]).toBe('aloha');
          expect(info.level).toBe('info');
          expect(info.params[0]).toBe('aloha');
          expect(warn.level).toBe('warn');
          expect(warn.params[0]).toBe('aloha');
          done();
        }
      });
    });
    it('should not queue if level is higher level', (done) => {
      Logger.getLogger(__filename);
      log.debug('aloha');
      log.info('aloha');
      log.warn('aloha');
      const events: Array<Event> = [];
      LoggerFactory.setFactory((event) => {
        if (event.level === 'debug') {
          return fail();
        }
        events.push(event);
        if (events.length === 2) {
          const [info, warn] = events;
          expect(info.level).toBe('info');
          expect(info.params[0]).toBe('aloha');
          expect(warn.level).toBe('warn');
          expect(warn.params[0]).toBe('aloha');
          done();
        }
      }, Level.Info);
    });
  });
  describe('#debug', () => {
    it('should exist', () => {
      if (!('debug' in log)) {
        fail();
      }
    });
  });
  describe('#info', () => {
    it('should exist', () => {
      if (!('info' in log)) {
        fail();
      }
    });
  });
  describe('#warn', () => {
    it('should exist', () => {
      if (!('warn' in log)) {
        fail();
      }
    });
  });
  describe('#error', () => {
    it('should exist', () => {
      if (!('error' in log)) {
        fail();
      }
    });
  });
  describe('#critical', () => {
    it('should exist', () => {
      if (!('critical' in log)) {
        fail();
      }
    });
  });
});
