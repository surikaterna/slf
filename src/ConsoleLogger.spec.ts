import { Logger, ConsoleLogger, LoggerFactory } from '..';
import should from 'should';

var clog = console.log;

describe('ConsoleLogger', () => {
  after(() => {
    LoggerFactory.setFactory(undefined);
  });
  describe('#debug', () => {
    it('should log to console', () => {
      let data;
      console.log = function (...args) { data = args; };
      LoggerFactory.setFactory(ConsoleLogger);
      const log = Logger.getLogger(__filename);
      log.debug('aloha');
      console.log = clog;
      data.length.should.equal(2);
    });
  });
});
