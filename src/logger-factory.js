import { Logger } from './logger';
const __slf = global.__slf || ( global['__slf'] = {
    _chain: [],
    _queued: [],
    _factory: null,
    hasWarned: false
  });

/*let _factory;
const _chain = [];
const _queued = [];
*/

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
    return new Logger(name, sink, __slf._chain);
  }
  static setFactory(factory) {
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
  }
  /**
   * middleware has function(event, next)
   * next should be called next(err, event);
   */
  static use(middleware) {
    __slf._chain.push(middleware);
  }
}
