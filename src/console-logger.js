/**
 * Implementation of a tiny logging provider using the console.log
 */
const _log = function (event) {
  // pretty print
  console.log(event);
};

const factory = (/* name */) => _log;

export { factory as ConsoleLogger };
