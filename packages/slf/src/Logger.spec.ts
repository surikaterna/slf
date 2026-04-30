import { Event, Level, Logger, LoggerFactory } from '.';

describe('Logger', () => {
  let log: Logger;
  const resetLoggerFactoryWarningState = () => {
    const state = (LoggerFactory as any).state;
    if (state.warningTimeout) {
      clearTimeout(state.warningTimeout);
      state.warningTimeout = null;
    }
    state.hasWarned = false;
  };

  beforeAll(() => {
    log = Logger.getLogger(__filename);
  });

  afterEach(() => {
    resetLoggerFactoryWarningState();
    vi.useRealTimers();
    vi.restoreAllMocks();
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
        LoggerFactory.setFactory((event) => {
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

  describe('LoggerFactory constructor defaults', () => {
    it('should set default factory only when factory is not set', () => {
      const firstEvents: Event[] = [];
      const firstFactory = (...events: Event[]) => {
        firstEvents.push(...events);
      };

      const secondEvents: Event[] = [];
      const secondFactory = (...events: Event[]) => {
        secondEvents.push(...events);
      };

      new LoggerFactory(firstFactory);
      new LoggerFactory(secondFactory);

      log.info('constructor-default');
      expect(firstEvents.length).toBe(1);
      expect(secondEvents.length).toBe(0);
    });

    it('should replace static factory via setFactory', () => {
      const firstEvents: Event[] = [];
      const firstFactory = (...events: Event[]) => {
        firstEvents.push(...events);
      };

      const secondEvents: Event[] = [];
      const secondFactory = (...events: Event[]) => {
        secondEvents.push(...events);
      };

      new LoggerFactory(firstFactory);
      LoggerFactory.setFactory(secondFactory);

      log.info('set-factory-replace');
      expect(firstEvents.length).toBe(0);
      expect(secondEvents.length).toBe(1);
    });
  });

  describe('LoggerFactory warning behavior', () => {
    it('should schedule warning when no factory is installed', () => {
      vi.useFakeTimers();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      Logger.getLogger('schedule-warning');

      expect(consoleSpy).not.toHaveBeenCalled();
      vi.runAllTimers();
      expect(consoleSpy).toHaveBeenCalledWith('SLF: No LoggerFactory installed');
    });

    it('should cancel scheduled warning when factory is installed', () => {
      vi.useFakeTimers();
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      Logger.getLogger('cancel-warning');
      LoggerFactory.setFactory(() => undefined);

      vi.runAllTimers();
      expect(consoleSpy).not.toHaveBeenCalledWith('SLF: No LoggerFactory installed');
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
