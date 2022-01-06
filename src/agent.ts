import Config from './state/config';
import Txn from './metric/txn';
import { getReqInfo, isAllowedUrl, isFunction } from './util/helper';
import logger from './util/logger';
import InstanceInfo from './state/insinfo';
import { ErrorInfo } from './util/types';
import Context from './state/context';
import { IncomingMessage, ServerResponse } from 'node:http';
import MetricStore from './metric/store';

let agent: Agent;

class Agent {
  config: Config;
  context: Context;
  insinfo: InstanceInfo;
  metricStore: MetricStore;

  constructor() {
    this.config = new Config();
    this.insinfo = new InstanceInfo();
    this.context = new Context();
    this.metricStore = new MetricStore();
  }

  static getAgent() {
    if (!agent) {
      agent = new Agent();
    }
    return agent;
  }

  isDataCollectionAllowed() {
    if (!this.config.isConfiguredProperly()) {
      return false;
    }
    return this.insinfo.isDataCollectionAllowed();
  }

  getCurTxn() {
    return this.context.getCurTxn();
  }

  // if agent code breaks then it will break the function call chain
  createWebTxnContext(
    req: IncomingMessage,
    res: ServerResponse,
    cb: () => void
  ) {
    const txn = this.checkAndCreateTxn(req, res);
    if (txn) {
      return this.context.setCurTxn(txn, cb);
    }

    return cb();
  }

  checkAndCreateTxn(req: IncomingMessage, res: ServerResponse) {
    try {
      if (!req || !res || !isFunction(res.on)) {
        logger.error('Invalid nextjs req/res');
        return null;
      }
      if (!this.isDataCollectionAllowed()) {
        logger.error('Data collection suspended');
        return null;
      }
      if (!isAllowedUrl(req?.url)) {
        logger.debug('Url skipped');
        return null;
      }
      const reqInfo = getReqInfo(req);
      const txn = new Txn(reqInfo);
      res.on('finish', async () => {
        const agent = Agent.getAgent();
        agent.endWebTxn(txn, res);
      });
      return txn;
    } catch (err) {
      logger.error('[checkAndCreateTxn]', err);
    }
    return null;
  }

  checkAndTrackException(e: ErrorInfo) {
    if (this.getCurTxn()) {
      this.getCurTxn().addException(e);
    }
  }

  endWebTxn(txn: Txn, res: ServerResponse) {
    if (!txn) {
      logger.error('[endTxn] Invalid txn');
      return;
    }

    try {
      txn.end(res);
      this.metricStore.processTxn(txn);
    } catch (err) {
      logger.error('[endWebTxn] unable to end txn', err)
    }
  }

  getConfig() {
    return this.config;
  }

  getInsInfo() {
    return this.insinfo;
  }
  
  getMetricStore() {
    return this.metricStore;
  }
}

export default Agent;
