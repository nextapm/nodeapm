import { AsyncLocalStorage } from 'async_hooks';
import Txn from '../metric/txn';
import logger from '../util/logger';

class Context {
  asyncLocalStorage: AsyncLocalStorage<Txn>;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage();
  }

  getCurTxn() {
    return this.asyncLocalStorage.getStore();
  }

  setCurTxn(txn: Txn, cb: () => void) {
    if (!txn) {
      logger.error('[setCurTxn] Invalid txn');
      return cb();
    }
    let cbCalled = false;
    // if run method throw error then it will break the function call chain
    // if callback throws error then we need pass to caller
    try {
      return this.asyncLocalStorage.run(txn, () => {
        cbCalled = true;
        return cb();
      });
    } catch (err) {
      if (cbCalled) {
        throw err;
      }
    }

    return cb();
  }
}

export default Context;
