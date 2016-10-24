import { Logger } from '..';

describe('Logger', () => {
  let _log = undefined;
  before(() => {
    console.log('log log');
    _log = Logger.getLogger(__filename);
  });

  describe('#log', () => {
    it('should warn if no logger is installed', (done) => {
      const clog = console.log;
      console.log = function (data) {
        if (data === 'Warning SLF: No LoggerFactory installed') {
          console.log = clog;
          done();
        } else {
          clog.apply(undefined, arguments);
        }
      };
      Logger.getLogger(__filename);
      _log.debug('aloha');
    });
    it('should exist', () => {
      _log.log('debug', 'aloha');
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
