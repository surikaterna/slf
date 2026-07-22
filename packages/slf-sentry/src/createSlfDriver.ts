import slfDebug from 'slf-debug';
import createSlfSentryDebugDriver from './createSlfSentryDebugDriver.js';
import { CreateSlfSentryLoggerOptions } from './createSlfSentryDriver.js';

const createSlfDriver = (sentryUrl?: string, options?: CreateSlfSentryLoggerOptions) => {
  if (!sentryUrl) {
    return slfDebug;
  }

  return createSlfSentryDebugDriver(sentryUrl, options);
};

export default createSlfDriver;
