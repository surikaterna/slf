interface Event {
  timeStamp: number;
  params: unknown[];
  name: string;
  level: string;
}

interface Factory {
  (...events: Event[]): void;
}

interface LogFunc {
  (...value: unknown[]): void;
}

interface LogLevelFunc {
  /** Log at provided level. */
  (level: Exclude<keyof Logger, 'log'>, ...value: unknown[]): void;
  /** Log at info level */
  (...value: unknown[]): void;
}

interface Middleware {
  (event: Event, next: NextFunc): void;
}

interface NextFunc {
  (error: Error | null, event: Event): void;
}

export function ConsoleLogger(event: Event): void;

export class Logger {
  constructor(name: string, sink: Factory, chain: Middleware[]);
  static getLogger(name: string): Logger;

  /** Log very severe error events that will presumably lead the application to abort- */
  critical: LogFunc;
  /** Log fine grained informational events that are most useful to debug an application. */
  debug: LogFunc;
  /** Log error events that might still allow the application to continue running. */
  error: LogFunc;
  /** Log informational messages that highlight the progress of the application at a coarse grained level. */
  info: LogFunc;
  log: LogLevelFunc;
  /** Log potentially harmful situations. */
  warn: LogFunc;
}

export class LoggerFactory {
  static getLogger(name: string): Logger;
  static setFactory(factory: Factory): void;
  static use(middleware: Middleware): void;
}
