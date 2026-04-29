import { captureException, captureMessage, setTag, withScope } from '@sentry/node';
import { Event } from 'slf';
import createSlfSentryDriver from './createSlfSentryDriver';

vi.mock('@sentry/node', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  init: vi.fn(),
  setTag: vi.fn(),
  withScope: vi.fn((cb: (scope: { setExtra: (k: string, v: unknown) => void; setLevel: (level: string) => void }) => void) => {
    cb({
      setExtra: vi.fn(),
      setLevel: vi.fn()
    });
  })
}));

describe('#createSlfSentryDriver', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should warn and send nothing if configured level is invalid', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);

    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'invalid-level',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'error',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(warnSpy).toHaveBeenCalledWith('SLF: Invalid Sentry log level "%s". Allowed levels: %s. Sentry logging is disabled.', 'invalid-level', 'info, warn, error');
    expect(captureException).not.toHaveBeenCalled();
    expect(captureMessage).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('should not send to Sentry if the event log level is not found in levels', () => {
    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'warn',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'debug',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(captureException).not.toHaveBeenCalled();
    expect(captureMessage).not.toHaveBeenCalled();
  });

  it('should send message when event level is same or above configured level', () => {
    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'warn',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'warn',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(setTag).not.toHaveBeenCalled();
    expect(withScope).toHaveBeenCalled();
    expect(captureMessage).toHaveBeenCalledWith('test message');
    expect(captureException).not.toHaveBeenCalled();
  });
});
