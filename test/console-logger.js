import { Logger, ConsoleLogger, LoggerFactory } from '..';

describe('ConsoleLogger', () => {
  after(() => {
    LoggerFactory.setFactory(undefined);
  });
  describe('#debug', () => {
    it('should log to console', (done) => {
      LoggerFactory.setFactory(ConsoleLogger);
      const log = Logger.getLogger(__filename);
      log.debug('aloha');
      done();
    });
  });
});
