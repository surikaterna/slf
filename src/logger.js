import { LoggerFactory } from './logger-factory';

export class Logger {
  static getLogger(name = '/') {
    return LoggerFactory.getLogger(name);
  }
  debug() {
  }
  info() {
  }
  warn() {
  }
  error() {
  }
  critical() {
  }
}
