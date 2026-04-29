import { captureException, captureMessage, init, setTag, SeverityLevel, withScope } from '@sentry/node';
import { Event } from 'slf';

export interface CreateSlfSentryLoggerOptions {
  /**
   * Enables Sentry SDK debug mode.
   * By default, debug mode is enabled in `fat` and `dev` environments.
   */
  debug?: boolean;
  /**
   * Minimum log level that will be sent to Sentry. The value must exist in `levels`.
   * Defaults to `error`.
   */
  level?: string;
  /**
   * Sentry environment name.
   * Defaults to the `SENTRY_ENV` environment variable, or `dev` if it is not set.
   */
  environment?: string;
  /**
   * Ordered log levels from highest to lowest priority. Used to compare event levels against `level`.
   * Defaults to only `error`.
   */
  levels?: Array<string>;
  /** Release identifier attached to reported Sentry events. */
  release?: string;
  /** Optional predicate to skip sending matching events. */
  shouldIgnore?: (event: Event) => boolean;
  /** Tags added to Sentry events for filtering and grouping. */
  tags?: Record<string, string | number | boolean>;
}

let isInitialized = false;

/**
 * Creates an SLF driver that forwards matching events to Sentry.
 *
 * If `level` is not included in `levels`, the driver logs a warning and
 * drops all events instead of sending anything to Sentry.
 */
export default function createSlfSentryDriver(
  sentryUrl: string,
  { debug, environment = process.env.SENTRY_ENV ?? 'dev', level = 'error', levels = ['error'], release, shouldIgnore, tags }: CreateSlfSentryLoggerOptions = {}
) {
  const levelIndex = levels.indexOf(level);
  const isInvalidLevel = levelIndex === -1;

  if (isInvalidLevel) {
    console.warn('SLF: Invalid Sentry log level "%s". Allowed levels: %s. Sentry logging is disabled.', level, levels.join(', '));
  }

  if (!isInitialized) {
    try {
      if (tags) {
        Object.entries(tags).forEach(([key, value]) => {
          setTag(key, value);
        });
      }
      init({
        dsn: sentryUrl,
        tracesSampleRate: 1.0,
        debug: debug ?? ['fat', 'dev'].includes(environment.toLowerCase()),
        environment,
        release
      });
      isInitialized = true;
    } catch (err) {
      console.warn('Failed to initialize logging to Sentry with the given url: %s', sentryUrl);
      console.error(err);
    }
  }

  function getErrorIfAny(event: Event): Error | undefined {
    return event.params.find((param: unknown) => param instanceof Error) as Error | undefined;
  }

  function checkIsEventLevelSameOrAbove(eventLogLevel: string): boolean {
    if (isInvalidLevel) {
      return false;
    }

    const eventLevelIndex = levels.indexOf(eventLogLevel);

    if (eventLevelIndex === -1) {
      return false;
    }

    return levelIndex <= eventLevelIndex;
  }

  function checkIsIgnoredError(event: Event): boolean {
    try {
      return shouldIgnore?.(event) ?? false;
    } catch (err) {
      return false;
    }
  }

  return (event: Event) => {
    if (!checkIsEventLevelSameOrAbove(event.level)) {
      return;
    }

    if (checkIsIgnoredError(event)) {
      return;
    }

    if (!(event.name && event.level && event.params)) {
      // @ts-expect-error TS2345 Sentry CaptureContext and SLF Event should be compatible
      captureMessage(JSON.stringify(event.params), event);
      return;
    }

    const error = getErrorIfAny(event);

    withScope((scope) => {
      scope.setLevel(event.level as SeverityLevel);

      const params = event.params;
      const msg = params.slice(0, 1)[0] as string;
      const extras: Array<unknown> = params.slice(1);

      extras.forEach((extra, index) => {
        scope.setExtra(`param-${index + 1}`, extra);
      });

      if (error) {
        scope.setExtra('error-msg', msg);
        captureException(error);
      } else {
        captureMessage(msg);
      }
    });
  };
}
