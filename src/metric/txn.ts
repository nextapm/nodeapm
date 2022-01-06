import { ServerResponse } from 'http';
import { ErrorInfo, ReqInfo } from '../util/types';
import { getErrName, getNormalizedUrl } from '../util/helper';

class Txn {
  url: string;
  method: string;
  startTime: number;
  endTime: number;
  status: number;
  rt: number;
  completed: boolean;
  excInfo: Map<string, number>;

  constructor(reqInfo: ReqInfo) {
    this.url = getNormalizedUrl(reqInfo?.url);
    this.method = reqInfo?.method;
    this.startTime = Date.now();
    this.endTime = -1;
    this.status = 200;
    this.rt = 0;
    this.completed = false;
    this.excInfo = {} as Map<string, number>;
  }

  end(res: ServerResponse) {
    this.completed = true;
    this.endTime = Date.now();
    this.status = res?.statusCode || this.status;
    this.rt = this.endTime - this.startTime;
  }

  addException(err: ErrorInfo) {
    if (!(err instanceof Error)) {
      return;
    }
    if (err && !err.nodeApmProcessed) {
      const name = getErrName(err);
      const count = this.excInfo[name] || 0;
      this.excInfo[name] = count + 1;
      err.nodeApmProcessed = true;
    }
  }

  isCompleted() {
    return this.completed;
  }

  isErrorTxn() {
    return this.status >= 400;
  }
}

export default Txn;
