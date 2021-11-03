import { LoggerFactory, LEVEL } from './logger-factory';

export class Logger {
  constructor(name, sink, chain, logLevel) {
    this._name = name;
    this._sink = sink;
    this._chain = chain;
    this._logLevel = logLevel;
  }
  static getLogger(name = '/') {
    return LoggerFactory.getLogger(name);
  }
  _log(level, params) {
    if (LEVEL[level] < this._logLevel) {
      return;
    }
    const event = this._buildLogEvent(level, params);
    let i = 0;
    // apply middlewares
    const next = (err, evt) => {
      if (err) {
        this._sink(this._buildLogEvent('error', [err]));
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
      timeStamp: new Date()
    };
    return event;
  }
}

const LP = Logger.prototype;
LP.debug = function (...params) {
  this._log('debug', params);
};
LP.info = function (...params) {
  this._log('info', params);
};
LP.warn = function (...params) {
  this._log('warn', params);
};
LP.error = function (...params) {
  this._log('error', params);
};
LP.critical = function (...params) {
  this._log('critital', params);
};

LP.log = function (...params) {
  const level = params[0];
  if (['debug', 'info', 'warn', 'error', 'critical'].indexOf(level) !== -1) {
    this[level].apply(this, params.slice(1));
  } else {
    this.info.apply(this, params);
  }
};
