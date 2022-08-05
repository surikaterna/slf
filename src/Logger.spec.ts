import { Logger, LoggerFactory } from './';

describe('Logger', () => {
  let log: Logger | undefined = undefined;
  beforeAll(() => {
    log = Logger.getLogger(__filename);
  });
  afterEach(() => {
    LoggerFactory.setFactory(null);
  });

  describe('#log', () => {
    it('should exist', () => {
      log?.log('debug', 'should exist');
    });
    it('should queue if no factory is installed', (done) => {
      Logger.getLogger(__filename);
      log?.debug('aloha');
      LoggerFactory.setFactory(() => {
        done();
      });
    });
  });
  describe('#debug', () => {
    it('should exist', () => {
      log?.debug('debug');
    });
  });
  describe('#info', () => {
    it('should exist', () => {
      log?.info('debug');
    });
  });
  describe('#warn', () => {
    it('should exist', () => {
      log?.warn('debug');
    });
  });
  describe('#error', () => {
    it('should exist', () => {
      log?.error('debug');
    });
  });
  describe('#critical', () => {
    it('should exist', () => {
      log?.critical('debug');
    });
  });
});
