import Txn from '../metric/txn';
import { ReqInfo } from '../util/types';
import Context from './context';

describe('Context', () => {
  it('setCurTxn should invoke passed callback for invalid txn', () => {
    const cb = jest.fn();
    cb.mockImplementation(() => {
      expect(context.getCurTxn()).toBeUndefined();
      return 10
    })
    const context = new Context();
    expect(context.getCurTxn()).toBeUndefined();
    const result = context.setCurTxn(null, cb)
    expect(result).toBe(10);
    expect(context.getCurTxn()).toBeUndefined();
    expect(cb).toHaveBeenCalledTimes(1);

  });

  it('setCurTxn should update curtxn context inside cb handler for valid txn', () => {
    const txn = new Txn({} as ReqInfo);
    const cb = jest.fn();
    cb.mockImplementation(() => {
      expect(context.getCurTxn()).toEqual(txn);
      return 100;
    })
    const context = new Context();
    expect(context.getCurTxn()).toBeUndefined();
    const result = context.setCurTxn(txn, cb);
    expect(result).toBe(100);
    expect(context.getCurTxn()).toBeUndefined();
    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('setCurTxn should throw error if cb throws error', () => {
    expect.assertions(5);
    const txn = new Txn({} as ReqInfo);
    const err = new TypeError();
    const cb = jest.fn();
    cb.mockImplementation(() => {
      expect(context.getCurTxn()).toEqual(txn);
      throw err;
    })
    const context = new Context();
    expect(context.getCurTxn()).toBeUndefined();
    try {
      context.setCurTxn(txn, cb);
    } catch (e) {
      expect(e).toEqual(err);
    }
    expect(context.getCurTxn()).toBeUndefined();
    expect(cb).toHaveBeenCalledTimes(1);
  });
});
