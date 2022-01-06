import Agent from '../agent';
import { AgentState } from '../util/constants';
import TxnAggregator from './aggregator';
import MetricStore from './store';
import Txn from './txn';

describe('MetricStore', () => {
  it('processTxn should not process non completed txn', () => {
    const txn = new Txn(null);
    const store = new MetricStore();
    expect(store.processTxn(txn)).toBeFalsy();
  }); 
  
  it('processTxn should not process if agent is not active state', () => {
    const agent = Agent.getAgent();
    const txn = new Txn(null);
    txn.end(null);

    const store = new MetricStore();

    agent.getInsInfo().updateState(AgentState.DELETE);
    expect(store.processTxn(txn)).toBeFalsy();

    agent.getInsInfo().updateState(AgentState.SUSPEND);
    expect(store.processTxn(txn)).toBeFalsy();

    agent.getInsInfo().updateState(AgentState.INVALID_AGENT);
    expect(store.processTxn(txn)).toBeFalsy();
  });

  it('processTxn should process txn if agent is active state', () => {
    const url = '/logout';
    let method = 'POST';
    const agent = Agent.getAgent();
    agent.config.setLicenseKey('a1b2c3d4');
    agent.config.setProjectId('a1b2c3d4');
    const txn = new Txn({ url, method } as any);
    txn.end({ statusCode : 200 } as any);

    const store = new MetricStore();

    expect(store.txnMetricStore).toEqual({});
    agent.getInsInfo().updateState(AgentState.ACTIVE);
    expect(store.processTxn(txn)).toBeTruthy();
    expect(Object.keys(store.txnMetricStore).length).toBe(1);
    const txnAggregator1 = new TxnAggregator(txn);
    expect(store.txnMetricStore[`${method} - ${url}`]).toEqual(txnAggregator1);

    method = 'GET';
    const txn2 = new Txn({ url, method } as any);
    txn2.end({ statusCode : 400 } as any);

    expect(store.processTxn(txn2)).toBeTruthy();
    expect(Object.keys(store.txnMetricStore).length).toBe(2);
    const txnAggregator2 = new TxnAggregator(txn2);
    expect(store.txnMetricStore[`${method} - ${url}`]).toEqual(txnAggregator2);

    expect(store.getTxnMetrics()).toEqual(expect.arrayContaining([
      txnAggregator1.getAsJSON(),
      txnAggregator2.getAsJSON()
    ]));

    store.clear();
    expect(Object.keys(store.txnMetricStore).length).toBe(0);
  });

  it('processTxn should aggregate same txn', () => {
    const url = '/logout';
    const method = 'POST';
    const agent = Agent.getAgent();
    agent.config.setLicenseKey('a1b2c3d4');
    agent.config.setProjectId('a1b2c3d4');
    const txn = new Txn({ url, method } as any);
    txn.end({ statusCode : 200 } as any);

    const store = new MetricStore();

    expect(store.txnMetricStore).toEqual({});
    agent.getInsInfo().updateState(AgentState.ACTIVE);
    expect(store.processTxn(txn)).toBeTruthy();
    expect(Object.keys(store.txnMetricStore).length).toBe(1);
    const txnAggregator = new TxnAggregator(txn);
    expect(store.txnMetricStore[`${method} - ${url}`]).toEqual(txnAggregator);

    const txn2 = new Txn({ url, method } as any);
    txn2.end({ statusCode : 400 } as any);

    expect(store.processTxn(txn2)).toBeTruthy();
    expect(Object.keys(store.txnMetricStore).length).toBe(1);
    txnAggregator.aggregate(txn2);
    expect(store.txnMetricStore[`${method} - ${url}`]).toEqual(txnAggregator);

    store.clear();
    expect(Object.keys(store.txnMetricStore).length).toBe(0);
  });
});
