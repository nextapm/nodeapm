import Txn from './txn';

class TxnAggregator {
  url: string;
  method: string;
  rt: number;
  minrt: number;
  maxrt: number;
  errorrt: number;
  count: number;
  errcount: number;
  errCodeInfo: Map<number, number>;
  excInfo: Map<string, number>;

  constructor(txn: Txn) {
    this.url = txn.url;
    this.method = txn.method;
    this.rt = 0;
    this.minrt = 0;
    this.maxrt = 0;
    this.errorrt = 0;
    this.count = 0;
    this.errcount = 0;
    this.excInfo = txn.excInfo;
    this.errCodeInfo = {} as Map<number, number>;

    if (txn.isErrorTxn()) {
      this.errorrt = txn.rt;
      this.errcount = 1;
      this.errCodeInfo[txn.status] = 1;
    } else {
      this.rt = txn.rt;
      this.minrt = txn.rt;
      this.maxrt = txn.rt;
      this.count = 1;
    }
  }

  aggregate(txn: Txn) {
    this.aggregateExceptions(txn);
    if (txn.isErrorTxn()) {
      this.errorrt += txn.rt;
      this.errcount += 1;
      this.aggregateErrCodes(txn);
      return;
    }

    this.count += 1;
    this.rt += txn.rt;
    this.minrt = this.minrt < txn.rt ? this.minrt : txn.rt;
    this.maxrt = this.maxrt > txn.rt ? this.maxrt : txn.rt;
  }

  aggregateErrCodes(txn: Txn) {
    if (txn.status < 400) {
      return;
    }
    if (this.errCodeInfo[txn.status]) {
      this.errCodeInfo[txn.status] += 1;
    } else {
      this.errCodeInfo[txn.status] = 1;
    }
  }

  aggregateExceptions(txn: Txn) {
    Object.keys(txn.excInfo).map((eachExc: string) => {
      if (this.excInfo[eachExc]) {
        this.excInfo[eachExc] += txn.excInfo[eachExc];
      } else {
        this.excInfo[eachExc] = txn.excInfo[eachExc];
      }
    });
  }

  getAsJSON() {
    return {
      url: this.url,
      method: this.method,
      rt: this.rt,
      minrt: this.minrt,
      maxrt: this.maxrt,
      errorrt: this.errorrt,
      count: this.count,
      errcount: this.errcount,
      errors: this.errCodeInfo,
      exceptions: this.excInfo,
    };
  }
}

export default TxnAggregator;
