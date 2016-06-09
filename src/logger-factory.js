import { Logger } from './logger';
let _factory;
export class LoggerFactory {
  static getLogger(name) {
    let logger;
    if (!_factory) {
      console.log('Warning SLF: No LoggerFactory installed');
      logger = new Logger();
    } else {
      logger = _factory(name);
    }
    return logger;
  }
  static setFactory(factory) {
    if (_factory) {
      console.log('Warning SLF: Replacing installed LoggerFactory', _factory, factory);
    }
    _factory = factory;
  }
}
