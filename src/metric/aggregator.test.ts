import { Agent } from 'node:http';
import TxnAggregator from './aggregator';
import Txn from './txn';

describe('Aggregator', () => {
  it('TxnAggregator should be initialized count as 1 for non error txn', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 200 } as any);
    txn.rt = 100;
    const aggregator = new TxnAggregator(txn);

    expect(aggregator.rt).toBe(txn.rt);
    expect(aggregator.maxrt).toBe(txn.rt);
    expect(aggregator.minrt).toBe(txn.rt);
    expect(aggregator.errorrt).toBe(0);
    expect(aggregator.errcount).toBe(0);
    expect(aggregator.errCodeInfo).toEqual({});
    expect(aggregator.count).toBe(1);
  }); 
  
  it('TxnAggregator should be initialized errcount as 1 for error txn', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 400 } as any);
    txn.rt = 100;
    const aggregator = new TxnAggregator(txn);

    expect(aggregator.rt).toBe(0);
    expect(aggregator.maxrt).toBe(0);
    expect(aggregator.minrt).toBe(0);
    expect(aggregator.errorrt).toBe(txn.rt);
    expect(aggregator.errcount).toBe(1);
    expect(aggregator.errCodeInfo).toEqual({ 400: 1 });
    expect(aggregator.count).toBe(0);
  }); 

  it('aggregate should not accumulate rt, minrt, maxrt for err txn', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 200 } as any);
    txn.rt = 30;
    txn.excInfo = { 'Error' : 2 } as any;
    const aggregator = new TxnAggregator(txn);

    const txn2 = new Txn({
      url,
      method,
    } as any);
    txn2.end({ statusCode: 400 } as any);
    txn2.rt = 40;
    txn2.excInfo = { 'Error' : 1 } as any;
    aggregator.aggregate(txn2);
    expect(aggregator.getAsJSON()).toEqual({
      url,
      method,
      rt: 30,
      minrt: 30,
      maxrt: 30,
      errorrt: 40,
      count: 1,
      errcount: 1,
      errors: { 400: 1 },
      exceptions: { 'Error': 3},
    });
  });

  it('aggregate should accumulate rt, update minrt, maxrt for non err txn', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 200 } as any);
    txn.rt = 30;
    txn.excInfo = { 'Error' : 1 } as any;
    const aggregator = new TxnAggregator(txn);

    const txn2 = new Txn({
      url,
      method,
    } as any);
    txn2.end({ statusCode: 200 } as any);
    txn2.rt = 40;
    txn2.excInfo = { 'Error' : 1 } as any;
    aggregator.aggregate(txn2);
    expect(aggregator.getAsJSON()).toEqual({
      url,
      method,
      rt: 70,
      minrt: 30,
      maxrt: 40,
      errorrt: 0,
      count: 2,
      errcount: 0,
      errors: {},
      exceptions: { 'Error': 2 },
    });

    const txn3 = new Txn({
      url,
      method,
    } as any);
    txn3.end({ statusCode: 200 } as any);
    txn3.rt = 20;
    txn3.excInfo = { 'Error' : 1 } as any;
    aggregator.aggregate(txn3);
    expect(aggregator.getAsJSON()).toEqual({
      url,
      method,
      rt: 90,
      minrt: 20,
      maxrt: 40,
      errorrt: 0,
      count: 3,
      errcount: 0,
      errors: {},
      exceptions: { 'Error': 3 },
    });
  });

  it('aggregateErrCodes should not process non error codes', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 200 } as any);
    const aggregator = new TxnAggregator(txn);

    aggregator.aggregateErrCodes(txn);
    expect(aggregator.errCodeInfo).toEqual({});
  });

  it('aggregateErrCodes should not process non error codes', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 200 } as any);
    const aggregator = new TxnAggregator(txn);

    aggregator.aggregateErrCodes(txn);
    expect(aggregator.errCodeInfo).toEqual({});
  });

  it('aggregateErrCodes should increment error code stats for valid error codes', () => {
    const url = '/checkout';
    const method = 'POST';
    const txn = new Txn({
      url,
      method,
    } as any);
    txn.end({ statusCode: 400 } as any);
    const aggregator = new TxnAggregator(txn);

    aggregator.aggregateErrCodes(txn);
    expect(aggregator.errCodeInfo).toEqual({ 400: 2});
  });

  it('aggregateExceptions should accumulate exception info', () => {
    const txn = new Txn(null);
    txn.excInfo = {
      'TypeError': 2,
      'Error': 1,
    } as any;
    const aggregator = new TxnAggregator(txn);

    const txn2 = new Txn(null);
    txn2.excInfo = {
      'TypeError': 2,
      'SomeError': 3
    } as any;

    aggregator.aggregateExceptions(txn2);
    expect(aggregator.excInfo).toEqual({ 
      'TypeError': 4,
      'Error': 1,
      'SomeError': 3
    });
  });
});
