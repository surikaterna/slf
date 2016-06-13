import { Logger } from '..';

describe('Logger', () => {
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

      const log = Logger.getLogger(__filename);
      log.debug('aloha');
    });
  });
});
