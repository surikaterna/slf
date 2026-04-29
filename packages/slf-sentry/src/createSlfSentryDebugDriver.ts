import { Event } from 'slf';
import slfDebug from 'slf-debug';
import createSlfSentryDriver, { CreateSlfSentryLoggerOptions } from './createSlfSentryDriver';

const createSlfSentryDebugDriver = (sentryUrl: string, options?: CreateSlfSentryLoggerOptions) => {
  const slfSentry = createSlfSentryDriver(sentryUrl, options);

  return (event: Event) => {
    slfDebug(event);
    slfSentry(event);
  };
};

export default createSlfSentryDebugDriver;
