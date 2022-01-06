import { write } from './loggerstream';

enum LOGLEVEL {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}
 
const configuredLevel = parseInt(process.env.NEXTAPM_LOG_LEVEL);
const logLevel = configuredLevel > 0 ? configuredLevel : 3;

const log = (level: LOGLEVEL, msg: string, obj: any) => {
  if (level <= logLevel) {
    write(LOGLEVEL[level], msg, obj);
  }
};

const debug = (msg: string, data?: any) => {
  log(LOGLEVEL.DEBUG, msg, data);
};

const info = (msg: string, data?: any) => {
  log(LOGLEVEL.INFO, msg, data);
};

const warn = (msg: string, data?: any) => {
  log(LOGLEVEL.WARN, msg, data);
};

const error = (msg: string, e?: Error) => {
  log(LOGLEVEL.ERROR, msg, e);
};

export default {
  debug,
  info,
  warn,
  error,
};
