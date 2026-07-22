import { Event, Level, Logger, LoggerFactory } from './index.js';

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
        expect.fail();
      }
      log.log('debug', 'should exist');
    });
    it('should queue if no factory is installed', async () => {
      await new Promise<void>((resolve) => {
        Logger.getLogger(__filename);
        log.debug('aloha');
        log.info('aloha');
        log.warn('aloha');
        const events: Array<Event> = [];
        LoggerFactory.setFactory((event: Event) => {
          events.push(event);
          if (events.length === 3) {
            const [debug, info, warn] = events;
            expect(debug.level).toBe('debug');
            expect(debug.params[0]).toBe('aloha');
            expect(info.level).toBe('info');
            expect(info.params[0]).toBe('aloha');
            expect(warn.level).toBe('warn');
            expect(warn.params[0]).toBe('aloha');
            resolve();
          }
        });
      });
    });
    it('should not queue if level is higher level', async () => {
      await new Promise<void>((resolve, reject) => {
        Logger.getLogger(__filename);
        log.debug('aloha');
        log.info('aloha');
        log.warn('aloha');
        const events: Array<Event> = [];
        LoggerFactory.setFactory((event: Event) => {
          if (event.level === 'debug') {
            reject(new Error('debug event should not be queued'));
            return;
          }
          events.push(event);
          if (events.length === 2) {
            const [info, warn] = events;
            expect(info.level).toBe('info');
            expect(info.params[0]).toBe('aloha');
            expect(warn.level).toBe('warn');
            expect(warn.params[0]).toBe('aloha');
            resolve();
          }
        }, Level.Info);
      });
    });
  });
  describe('#debug', () => {
    it('should exist', () => {
      if (!('debug' in log)) {
        expect.fail();
      }
    });
  });
  describe('#info', () => {
    it('should exist', () => {
      if (!('info' in log)) {
        expect.fail();
      }
    });
  });
  describe('#warn', () => {
    it('should exist', () => {
      if (!('warn' in log)) {
        expect.fail();
      }
    });
  });
  describe('#error', () => {
    it('should exist', () => {
      if (!('error' in log)) {
        expect.fail();
      }
    });
  });
  describe('#critical', () => {
    it('should exist', () => {
      if (!('critical' in log)) {
        expect.fail();
      }
    });
  });
});
