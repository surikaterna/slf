import { Logger, ConsoleLogger, LoggerFactory } from '../lib';

var clog = console.log;

describe('ConsoleLogger', () => {
  afterEach(() => {
    LoggerFactory.setFactory(undefined);
  });
  describe('#debug', () => {
    it('should log to console', () => {
      let data;
      console.log = function (...args) {
        data = args;
      };
      LoggerFactory.setFactory(ConsoleLogger);
      const log = Logger.getLogger(__filename);
      log.debug('aloha');
      console.log = clog;
      expect(data.length).toBe(2);
    });
  });
});
