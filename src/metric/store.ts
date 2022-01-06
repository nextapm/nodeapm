import Agent from '../agent';
import { MAX_TXN_LIMIT_PER_MINUTE } from '../util/constants';
import logger from '../util/logger';
import TxnAggregator from './aggregator';
import Txn from './txn';

class MetricStore {
  txnMetricStore;

  constructor() {
    this.txnMetricStore = {} as Map<string, TxnAggregator>;
  }

  processTxn(txn: Txn) {
    if (!txn || !txn.isCompleted()) {
      logger.error('[processTxn] non completed txn');
      return;
    }

    const agent = Agent.getAgent();
    if (!agent.isDataCollectionAllowed()) {
      logger.error('[processTxn] Data collection suspended');
      return false;
    }

    const txnPrefix = txn.method + ' - ' + txn.url;
    if (this.txnMetricStore[txnPrefix]) {
      const aggregator: TxnAggregator = this.txnMetricStore[txnPrefix];
      aggregator.aggregate(txn);
      return true;
    }

    if (
      Object.keys(this.txnMetricStore).length >= MAX_TXN_LIMIT_PER_MINUTE
    ) {
      logger.error('[processTxn] Metric store overloaded');
      return false;
    }

    const txnAggregator = new TxnAggregator(txn);
    this.txnMetricStore[txnPrefix] = txnAggregator;
    return true;
  }

  getTxnMetrics() {
    const txnMetricArray = [];

    Object.keys(this.txnMetricStore).map((txnPrefix) => {
      const txnmetric: TxnAggregator = this.txnMetricStore[txnPrefix];
      txnMetricArray.push(txnmetric.getAsJSON());
    });

    return txnMetricArray;
  }

  clear() {
    this.txnMetricStore = {};
  }
}

export default MetricStore;
