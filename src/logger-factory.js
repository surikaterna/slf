import { Logger } from './logger';
let _factory;
const _chain = [];
const _queued = [];
const NOOP = function (...args) { };

let hasWarned = false;

export class LoggerFactory {
  static getLogger(name) {
    let sink;
    if (_factory) {
      sink = _factory;
    } else if (!hasWarned) {
      hasWarned = true;
      console.log('Warning SLF: No LoggerFactory installed');
    }
    if (!sink) {
      sink = function (...args) {
        if (_factory) {
          _factory(...args);
        } else {
          _queued[_queued.length % 100] = args;
        }
      };
    }
    return new Logger(name, sink, _chain);
  }
  static setFactory(factory) {
    if (_factory && factory) {
      console.log('Warning SLF: Replacing installed LoggerFactory', _factory, factory);
    }
    if (!factory) {
      _queued.length = 0;
    }
    _factory = factory;
    if (_factory && _queued.length > 0) {
      _queued.forEach(evt => {
        _factory(evt);
      });
      _queued.length = 0;
    }
  }
  /**
   * middleware has function(event, next)
   * next should be called next(err, event);
   */
  static use(middleware) {
    _chain.push(middleware);
  }
}
