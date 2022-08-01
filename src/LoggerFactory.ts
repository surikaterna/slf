import { Logger } from './logger';

export const Level = global.Level || ( global['Level'] = {
  Debug: 1,
  Info: 2,
  Warn: 3,
  Error: 4,
  Critical: 5
});

const __slf = global.__slf || ( global['__slf'] = {
    _chain: [],
    _queued: [],
    _factory: null,
    _logLevel: null,
    hasWarned: false
  });


export class LoggerFactory {
  static getLogger(name) {
    let sink;
    if (__slf._factory) {
      sink = __slf._factory;
    } else if (!__slf.hasWarned) {
      __slf.hasWarned = true;
      console.log('Warning SLF: No LoggerFactory installed');
    }
    if (!sink) {
      sink = function (...args) {
        if (__slf._factory) {
          __slf._factory(...args);
        } else {
          __slf._queued[__slf._queued.length % 100] = args;
        }
      };
    }
    return new Logger(name, sink, __slf._chain, LoggerFactory._getLogLevel());
  }
  static setFactory(factory, level = null) {
    if (__slf._factory && factory) {
      console.log('Warning SLF: Replacing installed LoggerFactory', __slf._factory, factory);
    }
    if (!factory) {
      __slf._queued.length = 0;
    }
    __slf._factory = factory;
    if (__slf._factory && __slf._queued.length > 0) {
      console.log('***** dumping Q');
      __slf._queued.forEach(evt => {
        __slf._factory(evt);
      });
      __slf._queued.length = 0;
    }

    if (!__slf._logLevel) {
      __slf._logLevel = LoggerFactory._getLogLevel(level);
    }
  }
  /**
   * middleware has function(event, next)
   * next should be called next(err, event);
   */
  static use(middleware) {
    __slf._chain.push(middleware);
  }

  static _getLogLevel(level = undefined) {
    let envLevel = process.env.SLF_LOG_LEVEL
    if (envLevel) {
      envLevel = envLevel.charAt(0).toUpperCase() + envLevel.slice(1).toLowerCase();
    }
    return __slf._logLevel || level || Level[envLevel] || Level.Debug;
  }
}
