import { LoggerFactory } from './logger-factory';

const LOGGING_LEVELS = {
  TRACE: 1,
  DEBUG: 2,
  INFO: 3,
  WARN: 4,
  ERROR: 5,
  CRITICAL: 6
};

export class Logger {
  constructor(name, sink, chain) {
    this._name = name;
    this._sink = sink;
    this._chain = chain;
  }
  static getLogger(name = '/') {
    return LoggerFactory.getLogger(name);
  }
  _log(level, params) {
    const event = this._buildLogEvent(level, params);
    let i = 0;
    // apply middlewares
    const next = (err, evt) => {
      if (err) {
        this._sink(this._buildLogEvent(LOGGING_LEVELS.ERROR, [err]));
      }

      if (this._chain && this._chain[i]) {
        this._chain[i++](evt, next);
      } else {
        // sink to logger impl
        this._sink(evt);
      }
    };
    // start middleware chain
    next(null, event);
  }
  _buildLogEvent(level, params) {
    const event = {
      name: this._name,
      level,
      params,
      time: new Date()
    };
    return event;
  }
}
const LP = Logger.prototype;
LP.debug = function (...params) {
  this._log(LOGGING_LEVELS.DEBUG, params);
};
LP.info = function (...params) {
  this._log(LOGGING_LEVELS.INFO, params);
};
LP.warn = function (...params) {
  this._log(LOGGING_LEVELS.WARN, params);
};
LP.error = function (...params) {
  this._log(LOGGING_LEVELS.ERROR, params);
};
LP.critical = function (...params) {
  this._log(LOGGING_LEVELS.CRITICAL, params);
};

