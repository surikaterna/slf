import { Logger } from './logger';

export enum Level {
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Critical = 5
}

interface Slf {
  _chain: Middleware[];
  _queued: Event[];
  _factory: Factory | null;
  _logLevel: Level | null;
  hasWarned: boolean;
}

const __slf: Slf = {
  _chain: [],
  _queued: [],
  _factory: null,
  _logLevel: null,
  hasWarned: false
};

export interface Event {
  timeStamp: number;
  params: any[];
  name: string;
  level: string;
}

export interface Factory {
  (...events: Event[]): void;
}

export interface NextFunc {
  (error: Error | null, event: Event): void;
}

export interface Middleware {
  (event: Event, next: NextFunc): void;
}

export class LoggerFactory {
  static getLogger(name: string) {
    let sink;
    if (__slf._factory) {
      sink = __slf._factory;
    } else if (!__slf.hasWarned) {
      __slf.hasWarned = true;
      console.log('Warning SLF: No LoggerFactory installed');
    }
    if (!sink) {
      sink = (...args: Event[]) => {
        if (__slf._factory) {
          __slf._factory(...args);
        } else {
          __slf._queued[__slf._queued.length % 100] = args[0];
        }
      };
    }
    return new Logger(name, sink, __slf._chain, LoggerFactory.getLogLevel());
  }
  static setFactory(factory: Factory, level?: string) {
    if (__slf._factory && factory) {
      console.log('Warning SLF: Replacing installed LoggerFactory', __slf._factory, factory);
    }
    if (!factory) {
      __slf._queued.length = 0;
    }
    __slf._factory = factory;
    if (__slf._factory && __slf._queued.length > 0) {
      console.log('***** dumping Q');
      __slf._queued.forEach((evt) => {
        __slf._factory?.(evt);
      });
      __slf._queued.length = 0;
    }

    if (!__slf._logLevel) {
      __slf._logLevel = LoggerFactory.getLogLevel(level);
    }
  }
  /**
   * middleware has function(event, next)
   * next should be called next(err, event);
   */
  static use(middleware: Middleware) {
    __slf._chain.push(middleware);
  }

  private static getLogLevel(level?: string) {
    let envLevel = process.env.SLF_LOG_LEVEL as keyof typeof Level | undefined;
    if (envLevel) {
      envLevel = (envLevel.charAt(0).toUpperCase() + envLevel.slice(1).toLowerCase()) as keyof typeof Level;
    }
    return __slf._logLevel || (level && Level[level as keyof typeof Level]) || (envLevel && Level[envLevel]) || Level.Debug;
  }
}
