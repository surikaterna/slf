import debug from 'debug';
import { LoggerFactory } from 'slf';
import slfDebugDriver from './slfDebugDriver';

describe('AA', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    LoggerFactory.setFactory(null);
  });

  it('a', () => {
    const debugLogSpy = vi.spyOn(debug, 'log').mockImplementation(() => undefined);

    LoggerFactory.setFactory(slfDebugDriver);
    const alog = LoggerFactory.getLogger('AA:a');
    const blog = LoggerFactory.getLogger('AA:b');
    alog.error(new Error('oops'));
    alog.error('Hello', { world: true });
    blog.info('Hello', { world: false });
    alog.error('Bye %o', { world: true });

    expect(debugLogSpy).toHaveBeenCalledTimes(4);
  });
});
