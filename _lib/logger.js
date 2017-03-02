'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Logger = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _loggerFactory = require('./logger-factory');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Logger = exports.Logger = function () {
  function Logger(name, sink, chain) {
    _classCallCheck(this, Logger);

    this._name = name;
    this._sink = sink;
    this._chain = chain;
  }

  _createClass(Logger, [{
    key: '_log',
    value: function _log(level, params) {
      var _this = this;

      var event = this._buildLogEvent(level, params);
      var i = 0;
      // apply middlewares
      var next = function next(err, evt) {
        if (err) {
          _this._sink(_this._buildLogEvent('error', [err]));
        }

        if (_this._chain && _this._chain[i]) {
          _this._chain[i++](evt, next);
        } else {
          // sink to logger impl
          _this._sink(evt);
        }
      };
      // start middleware chain
      next(null, event);
    }
  }, {
    key: '_buildLogEvent',
    value: function _buildLogEvent(level, params) {
      var event = {
        name: this._name,
        level: level,
        params: params,
        timeStamp: new Date()
      };
      return event;
    }
  }], [{
    key: 'getLogger',
    value: function getLogger() {
      var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '/';

      return _loggerFactory.LoggerFactory.getLogger(name);
    }
  }]);

  return Logger;
}();

var LP = Logger.prototype;
LP.debug = function () {
  for (var _len = arguments.length, params = Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }

  this._log('debug', params);
};
LP.info = function () {
  for (var _len2 = arguments.length, params = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    params[_key2] = arguments[_key2];
  }

  this._log('info', params);
};
LP.warn = function () {
  for (var _len3 = arguments.length, params = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    params[_key3] = arguments[_key3];
  }

  this._log('warn', params);
};
LP.error = function () {
  for (var _len4 = arguments.length, params = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    params[_key4] = arguments[_key4];
  }

  this._log('error', params);
};
LP.critical = function () {
  for (var _len5 = arguments.length, params = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    params[_key5] = arguments[_key5];
  }

  this._log('critital', params);
};

LP.log = function () {
  for (var _len6 = arguments.length, params = Array(_len6), _key6 = 0; _key6 < _len6; _key6++) {
    params[_key6] = arguments[_key6];
  }

  var level = params[0];
  if (['debug', 'info', 'warn', 'error', 'critical'].indexOf(level) !== -1) {
    this[level].apply(this, params.slice(1));
  } else {
    this.info.apply(this, params);
  }
};