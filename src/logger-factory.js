import { Logger } from './logger';
let _factory;
const _chain = [];
const NOOP = function () {};

export class LoggerFactory {
  static getLogger(name) {
    let sink = NOOP;
    if (_factory) {
      sink = _factory(name);
    } else {
      console.log('Warning SLF: No LoggerFactory installed');
    }
    return new Logger(name, sink, _chain);
  }
  static setFactory(factory) {
    if (_factory) {
      console.log('Warning SLF: Replacing installed LoggerFactory', _factory, factory);
    }
    if(!factory) {
      console.log('Warning SLF: Removing LoggerFactory; passed undefined to setFactory');
    }
    _factory = factory;
  }
  /**
   * middleware has function(event, next)
   * next should be called next(err, event);
   */
  static use(middleware) {
    _chain.push(middleware);
  }
}
