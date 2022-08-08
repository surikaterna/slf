import { Event, Factory, Level, LoggerFactory, Middleware, NextFunc } from './LoggerFactory';
import { capitalize } from './utils';

interface LogFunc {
  (...value: any[]): void;
}

type LogFunctionKey = Exclude<keyof typeof Logger.prototype, 'log'>;

const checkIfLogFuncKey = (key: any): key is LogFunctionKey =>
  Object.keys(Logger.prototype)
    .filter((key) => key !== 'log')
    .includes(key);

interface LogLevelFunc {
  /** Log at provided level. */
  (level: LogFunctionKey, ...params: any[]): void;
  /** Log at info level */
  (...params: any[]): void;
}

export class Logger {
  constructor(private name: string, private sink: Factory, private chain: Middleware[], private logLevel: Level) {}

  static getLogger(name = '/'): Logger {
    return LoggerFactory.getLogger(name);
  }

  log: LogLevelFunc = (level?: LogFunctionKey, ...params) => {
    if (level) {
      const levelKey = capitalize(level);
      if (Level[levelKey] < this.logLevel) {
        return;
      }
      const event = this.buildLogEvent(level, params);
      let i = 0;
      // apply middlewares
      const next: NextFunc = (err, evt) => {
        if (err) {
          this.sink(this.buildLogEvent('error', [err]));
        }

        if (this.chain && this.chain[i]) {
          this.chain[i++](evt, next);
        } else {
          // sink to logger impl
          this.sink(evt);
        }
      };
      // start middleware chain
      next(null, event);
    } else {
      const level = params[0];
      if (checkIfLogFuncKey(level)) {
        this[level].apply(this, params.slice(1));
      } else {
        this.info.apply(this, params);
      }
    }
  };

  private buildLogEvent(level: string, params: any[]) {
    const event: Event = {
      name: this.name,
      level,
      params,
      timeStamp: new Date().valueOf()
    };
    return event;
  }

  /** Log fine grained informational events that are most useful to debug an application. */
  debug: LogFunc = (...params) => {
    this.log('debug', ...params);
  };
  /** Log informational messages that highlight the progress of the application at a coarse grained level. */
  info: LogFunc = (...params) => {
    this.log('info', ...params);
  };
  /** Log potentially harmful situations. */
  warn: LogFunc = (...params) => {
    this.log('warn', ...params);
  };
  /** Log error events that might still allow the application to continue running. */
  error: LogFunc = (...params) => {
    this.log('error', ...params);
  };
  /** Log very severe error events that will presumably lead the application to abort- */
  critical: LogFunc = (...params) => {
    this.log('critital', ...params);
  };
}
