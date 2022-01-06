import { ErrorInfo } from '../util/types';
import Txn from './txn';

describe('Txn', () => {
  it('endTxn should update rt and completed status', () => {
    const txn = new Txn(null);
    expect(txn.isCompleted()).toBeFalsy();
    expect(txn.endTime).toBe(-1);
    txn.end(null);
    expect(txn.isCompleted()).toBeTruthy();
    expect(txn.endTime).not.toBe(-1);
  });

  it('addException should not throw error for invalid err object', () => {
    const txn = new Txn(null);
    expect(() => txn.addException(null)).not.toThrowError();
  });

  it('addException should not update excinfo for processed error', () => {
    const txn = new Txn(null);
    expect(txn.excInfo).toEqual({});
    const e: ErrorInfo = new Error();
    e.nodeApmProcessed = true;
    expect(() => txn.addException(e)).not.toThrowError();
    expect(txn.excInfo).toEqual({});
  });

  it('addException should update excinfo for valid error', () => {
    const txn = new Txn(null);
    expect(txn.excInfo).toEqual({});
    const e1: ErrorInfo = new TypeError();
    expect(() => txn.addException(e1)).not.toThrowError();
    expect(txn.excInfo).toEqual({ 'TypeError': 1});
    const e2: ErrorInfo = new TypeError();
    expect(() => txn.addException(e2)).not.toThrowError();
    expect(txn.excInfo).toEqual({ 'TypeError': 2});
    const e3: ErrorInfo = new Error();
    expect(() => txn.addException(e3)).not.toThrowError();
    expect(txn.excInfo).toEqual({ 'TypeError': 2, 'Error': 1});
  });

  it('addException should not throw error for invalid err object', () => {
    const txn = new Txn(null);
    expect(() => txn.addException(null)).not.toThrowError();
  });

  it('isErrorTxn should return true if status is greater than 400', () => {
    const txn = new Txn(null);
    txn.status = 400;
    expect(txn.isErrorTxn()).toBeTruthy();
    txn.status = 200;
    expect(txn.isErrorTxn()).toBeFalsy();
    txn.status = 404;
    expect(txn.isErrorTxn()).toBeTruthy();
    txn.status = 500;
    expect(txn.isErrorTxn()).toBeTruthy();
  });
});
