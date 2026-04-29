import { Event } from 'slf';
import slfDebug from 'slf-debug';
import createSlfSentryDriver from './createSlfSentryDriver';
import createSlfSentryDebugDriver from './createSlfSentryDebugDriver';

vi.mock('slf-debug', () => ({
  default: vi.fn()
}));

vi.mock('./createSlfSentryDriver', () => ({
  default: vi.fn()
}));

describe('#createSlfSentryDebugDriver', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should create the Sentry driver only once and reuse it for each event', () => {
    const slfSentry = vi.fn();
    vi.mocked(createSlfSentryDriver).mockReturnValue(slfSentry);

    const driver = createSlfSentryDebugDriver('https://sentry.example.com');
    const event = {} as Event;

    driver(event);
    driver(event);

    expect(createSlfSentryDriver).toHaveBeenCalledTimes(1);
    expect(createSlfSentryDriver).toHaveBeenCalledWith('https://sentry.example.com', undefined);
    expect(slfDebug).toHaveBeenCalledTimes(2);
    expect(slfDebug).toHaveBeenNthCalledWith(1, event);
    expect(slfDebug).toHaveBeenNthCalledWith(2, event);
    expect(slfSentry).toHaveBeenCalledTimes(2);
    expect(slfSentry).toHaveBeenNthCalledWith(1, event);
    expect(slfSentry).toHaveBeenNthCalledWith(2, event);
  });
});
