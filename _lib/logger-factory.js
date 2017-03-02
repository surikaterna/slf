'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LoggerFactory = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _logger = require('./logger');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _factory = void 0;
var _chain = [];
var NOOP = function NOOP() {};

var LoggerFactory = exports.LoggerFactory = function () {
  function LoggerFactory() {
    _classCallCheck(this, LoggerFactory);
  }

  _createClass(LoggerFactory, null, [{
    key: 'getLogger',
    value: function getLogger(name) {
      var sink = NOOP;
      if (_factory) {
        sink = _factory(name);
      } else {
        console.log('Warning SLF: No LoggerFactory installed');
      }
      return new _logger.Logger(name, sink, _chain);
    }
  }, {
    key: 'setFactory',
    value: function setFactory(factory) {
      if (_factory) {
        console.log('Warning SLF: Replacing installed LoggerFactory', _factory, factory);
      }
      if (!factory) {
        console.log('Warning SLF: Removing LoggerFactory; passed undefined to setFactory');
      }
      _factory = factory;
    }
    /**
     * middleware has function(event, next)
     * next should be called next(err, event);
     */

  }, {
    key: 'use',
    value: function use(middleware) {
      _chain.push(middleware);
    }
  }]);

  return LoggerFactory;
}();