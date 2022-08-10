import { Logger, LoggerFactory } from '.';

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
      LoggerFactory.setFactory((event) => {
        expect(event.params[0]).toBe('aloha');
        expect(event.level).toBe('debug');
        done();
      });
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
