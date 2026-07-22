import { LoggerFactory } from 'slf';
import slfDebugDriver from './slfDebugDriver.js';

describe('AA', () => {
  it('a', () => {
    LoggerFactory.setFactory(slfDebugDriver);
    const alog = LoggerFactory.getLogger('AA:a');
    const blog = LoggerFactory.getLogger('AA:b');
    alog.error(new Error('oops'));
    alog.error('Hello', { world: true });
    blog.info('Hello', { world: false });
    alog.error('Bye %o', { world: true });
  });
});
