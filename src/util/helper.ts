import { IncomingMessage } from 'http';
import { AgentState, AgentStateInfo, DEFAULT_COLLECTOR } from './constants';
import logger from './logger';
import { ErrorInfo, ReqInfo } from './types';

export const isEmpty = (str: string) => {
  return str === undefined || str === null || str === '';
};

export const isNonEmptyStr = (str: string) => {
  return typeof str === 'string' && str !== '';
};

export const isFunction = (fn) => {
  return typeof fn === 'function';
};

export const getReqInfo = (req: IncomingMessage) => {
  const reqInfo: ReqInfo = { url: '', method: '', queryParam: '' };
  if (req) {
    reqInfo.method = req.method || '';
    if (req.url) {
      const index = req.url.indexOf('?');
      if (index < 0) {
        reqInfo.url = req.url;
      } else {
        reqInfo.url = req.url.substring(0, index);
        reqInfo.queryParam = req.url.substring(index + 1);
      }
    }
  }
  return reqInfo;
};

export const getErrName = (err: ErrorInfo) => {
  if (!isEmpty(err?.name) && err.name !== 'Error') {
    return err.name.toString();
  }

  if (!isEmpty(err?.code)) {
    return err.code.toString();
  }

  return 'Error';
};

export const getCollectorBaseUrl = () => {
  if (!process.env.NEXTAPM_HOST) {
    return DEFAULT_COLLECTOR;
  }
  const host = process.env.NEXTAPM_HOST;
  if (host?.startsWith('http')) {
    return host;
  }
  return `https://${host}`;
};

export const getResCodeMessage = (rescode: AgentState) => {
  if (AgentStateInfo[rescode]) {
    return AgentStateInfo[rescode]
  }
  return rescode;
}

export const isAllowedUrl = (url: string) => {
  if (!isNonEmptyStr(url)) {
    return false;
  }

  if (url.match(/.*(.js|.css|.gif|.jpg|.jpeg|.bmp|.png|.ico)$/)) {
    return false;
  }

  return true;
}

export const getNormalizedUrl = (url: string) => {
  if (isNonEmptyStr(url)) {
    return url.replace(/\/\d+(?=\/|$)/g, '/*');
  }

  return url;
}