"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Implementation of a tiny logging provider using the console.log
 */
var _log = function _log(event) {
  // pretty print
  console.log(event);
};

var factory = function factory() {
  return (/* name */_log
  );
};

exports.ConsoleLogger = factory;