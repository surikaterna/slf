import { Event } from 'slf';

const sentryMocks = vi.hoisted(() => ({
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

vi.mock('@sentry/node', () => ({
  captureException: sentryMocks.captureException,
  captureMessage: sentryMocks.captureMessage,
  init: sentryMocks.init,
  setTag: sentryMocks.setTag,
  withScope: sentryMocks.withScope
}));

async function loadCreateSlfSentryDriver() {
  const module = await import('./createSlfSentryDriver');

  return module.default;
}

describe('#createSlfSentryDriver', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it('should warn and send nothing if configured level is invalid', async () => {
    const createSlfSentryDriver = await loadCreateSlfSentryDriver();
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
    expect(sentryMocks.captureException).not.toHaveBeenCalled();
    expect(sentryMocks.captureMessage).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('should not send to Sentry if the event log level is not found in levels', async () => {
    const createSlfSentryDriver = await loadCreateSlfSentryDriver();
    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'warn',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'debug',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(sentryMocks.captureException).not.toHaveBeenCalled();
    expect(sentryMocks.captureMessage).not.toHaveBeenCalled();
  });

  it('should send message when event level is same or above configured level', async () => {
    const createSlfSentryDriver = await loadCreateSlfSentryDriver();
    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'warn',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'warn',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(sentryMocks.setTag).not.toHaveBeenCalled();
    expect(sentryMocks.withScope).toHaveBeenCalled();
    expect(sentryMocks.captureMessage).toHaveBeenCalledWith('test message');
    expect(sentryMocks.captureException).not.toHaveBeenCalled();
  });

  it('should send when event level is above configured level', async () => {
    const createSlfSentryDriver = await loadCreateSlfSentryDriver();
    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'warn',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'error',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(sentryMocks.withScope).toHaveBeenCalled();
    expect(sentryMocks.captureMessage).toHaveBeenCalledWith('test message');
    expect(sentryMocks.captureException).not.toHaveBeenCalled();
  });

  it('should not send when event level is below configured level', async () => {
    const createSlfSentryDriver = await loadCreateSlfSentryDriver();
    const driver = createSlfSentryDriver('https://sentry.example.com', {
      level: 'warn',
      levels: ['info', 'warn', 'error']
    });

    driver({
      level: 'info',
      name: 'test-event',
      params: ['test message']
    } as Event);

    expect(sentryMocks.withScope).not.toHaveBeenCalled();
    expect(sentryMocks.captureMessage).not.toHaveBeenCalled();
    expect(sentryMocks.captureException).not.toHaveBeenCalled();
  });
});
