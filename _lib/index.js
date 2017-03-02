'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _logger = require('./logger');

Object.defineProperty(exports, 'Logger', {
  enumerable: true,
  get: function get() {
    return _logger.Logger;
  }
});

var _loggerFactory = require('./logger-factory');

Object.defineProperty(exports, 'LoggerFactory', {
  enumerable: true,
  get: function get() {
    return _loggerFactory.LoggerFactory;
  }
});

var _consoleLogger = require('./console-logger');

Object.defineProperty(exports, 'ConsoleLogger', {
  enumerable: true,
  get: function get() {
    return _consoleLogger.ConsoleLogger;
  }
});