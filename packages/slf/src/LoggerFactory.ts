import { Logger } from './Logger';
import { capitalize } from './utils';

export enum Level {
  Debug = 1,
  Info = 2,
  Warn = 3,
  Error = 4,
  Critical = 5
}

const checkIfLevelKey = (key: any): key is keyof typeof Level => Object.keys(Level).includes(key);
const checkIfLevelBelow = (event: Event, level: Level = Level.Debug): boolean => {
  const levelKey = capitalize(event.level);
  return level > Level[levelKey];
}

export interface Event {
  timeStamp: number;
  params: any[];
  name: string;
  level: Lowercase<keyof typeof Level>;
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

interface Slf {
  chain: Middleware[];
  queued: Event[][];
  factory: Factory | null;
  logLevel: Level | null;
  hasWarned: boolean;
  warningTimeout: ReturnType<typeof setTimeout> | null;
}

export class LoggerFactory {
  private static state: Slf = {
    chain: [],
    queued: [],
    factory: null,
    logLevel: null,
    hasWarned: false,
    warningTimeout: null
  };

  private static scheduleNoFactoryWarning() {
    if (LoggerFactory.state.hasWarned || LoggerFactory.state.warningTimeout) {
      return;
    }

    LoggerFactory.state.warningTimeout = setTimeout(() => {
      LoggerFactory.state.warningTimeout = null;
      if (!LoggerFactory.state.factory && !LoggerFactory.state.hasWarned) {
        LoggerFactory.state.hasWarned = true;
        console.warn('SLF: No LoggerFactory installed');
      }
    }, 0);
  }

  private static cancelNoFactoryWarning() {
    if (!LoggerFactory.state.warningTimeout) {
      return;
    }

    clearTimeout(LoggerFactory.state.warningTimeout);
    LoggerFactory.state.warningTimeout = null;
  }

  private static provideToFactory(events: Event[], level: Level = Level.Debug) {
    const filteredEvents = events.filter((e) => !checkIfLevelBelow(e, level));
    // events is empty if all are below set level
    if (filteredEvents.length > 0) {
      LoggerFactory.state.factory?.(...filteredEvents);
    }
  }

  constructor(factory?: Factory | null, level?: Level) {
    if (factory && !LoggerFactory.state.factory) {
      LoggerFactory.setFactory(factory, level);
    }
  }

  static getLogger(name: string) {
    let sink;
    if (LoggerFactory.state.factory) {
      sink = LoggerFactory.state.factory;
    } else {
      LoggerFactory.scheduleNoFactoryWarning();
    }
    if (!sink) {
      sink = (...args: Event[]) => {
        if (LoggerFactory.state.factory) {
          LoggerFactory.provideToFactory(args, LoggerFactory.getLogLevel());
        } else {
          LoggerFactory.state.queued[LoggerFactory.state.queued.length % 100] = args;
        }
      };
    }
    return new Logger(name, sink, LoggerFactory.state.chain, LoggerFactory.getLogLevel());
  }
  static setFactory(factory: Factory | null, level?: Level) {
    if (factory) {
      LoggerFactory.cancelNoFactoryWarning();
    }

    if (LoggerFactory.state.factory && factory) {
      console.warn('SLF: Replacing installed LoggerFactory', LoggerFactory.state.factory, factory);
    }
    if (!factory) {
      LoggerFactory.state.queued.length = 0;
    }
    LoggerFactory.state.factory = factory;
    if (LoggerFactory.state.factory && LoggerFactory.state.queued.length > 0) {
      console.log('SLF: Sinking queue to factory');
      LoggerFactory.state.queued.forEach((evt) => LoggerFactory.provideToFactory(evt, level));
      LoggerFactory.state.queued.length = 0;
    }

    if (!LoggerFactory.state.logLevel) {
      LoggerFactory.state.logLevel = LoggerFactory.getLogLevel(level);
    }
  }
  /**
   * middleware has function(event, next)
   * next should be called next(err, event);
   */
  static use(middleware: Middleware) {
    LoggerFactory.state.chain.push(middleware);
  }

  private static getLogLevel(level?: Level | undefined): Level {
    let envString: string | undefined = process.env.SLF_LOG_LEVEL;
    let envLevel: keyof typeof Level | undefined;

    if (envString) {
      const capitalized = capitalize(envString);
      if (checkIfLevelKey(capitalized)) {
        envLevel = capitalized;
      }
    }
    return LoggerFactory.state.logLevel || level || (envLevel && Level[envLevel]) || Level.Debug;
  }
}
