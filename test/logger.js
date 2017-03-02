import { Logger, LoggerFactory } from '..';

describe('Logger', () => {
  let _log = undefined;
  before(() => {
    _log = Logger.getLogger(__filename);
  });
  afterEach(() => {
    LoggerFactory.setFactory(null);
  });

  describe('#log', () => {
    it('should exist', () => {
      _log.log('debug', 'should exist');
    });
    it('should queue if no factory is installed', (done) => {
      Logger.getLogger(__filename);
      _log.debug('aloha');
      LoggerFactory.setFactory(() => {
        done();
      });
    });
  });
  describe('#debug', () => {
    it('should exist', () => {
      _log.debug('debug');
    });
  });
  describe('#info', () => {
    it('should exist', () => {
      _log.info('debug');
    });
  });
  describe('#warn', () => {
    it('should exist', () => {
      _log.warn('debug');
    });
  });
  describe('#error', () => {
    it('should exist', () => {
      _log.error('debug');
    });
  });
  describe('#critical', () => {
    it('should exist', () => {
      _log.critical('debug');
    });
  });

});
