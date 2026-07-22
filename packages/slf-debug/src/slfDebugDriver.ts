import debug, { Debugger } from 'debug';
import { Event } from 'slf';

function paramFormatter(param: unknown) {
  if (param instanceof Error) {
    return param.stack || param.message;
  }
  return param;
}

function formatEventParams(event: Event): [string, ...Array<unknown>] {
  const params: Array<unknown> = [];
  const level = event.level.toUpperCase();
  const date = new Date(event.timeStamp).toISOString();

  event.params.forEach((param: unknown) => params.push(paramFormatter(param)));

  const firstParam = params[0];
  return typeof firstParam === 'string' ? [`${date} ${level} ${firstParam}`, ...params.slice(1)] : [`${date} ${level}`, ...params];
}

const loggers: Record<string, Debugger> = {};

const getLogger = (name: string): Debugger => {
  const logger = loggers[name];

  if (logger) {
    return logger;
  }

  const newLogger = debug(name);
  loggers[name] = newLogger;
  return newLogger;
};

const slfDebugDriver = (event: Event) => {
  const log = getLogger(event.name);
  log(...formatEventParams(event));
};

export default slfDebugDriver;
