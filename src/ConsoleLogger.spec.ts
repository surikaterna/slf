import { Logger, ConsoleLogger, LoggerFactory } from '.';
import { Event } from './LoggerFactory';

let clog = console.log;

describe('ConsoleLogger', () => {
  afterAll(() => {
    LoggerFactory.setFactory(null);
  });
  describe('#debug', () => {
    it('should log to console', () => {
      let data: Event[] | undefined;
      console.log = function (...args) {
        data = args;
      };
      LoggerFactory.setFactory(ConsoleLogger);
      const log = Logger.getLogger(__filename);
      log.debug('aloha');
      console.log = clog;
      expect(data?.length).toBe(2);
    });
  });
});
