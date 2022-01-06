import { AgentState } from '../util/constants';
import logger from '../util/logger';

class InstanceInfo {
  state: AgentState;
  connected: boolean;

  constructor() {
    this.connected = false;
    this.state = AgentState.ACTIVE;
  }

  isDataCollectionAllowed() {
    return this.state === AgentState.ACTIVE;
  }

  isConnected() {
    return this.connected;
  }

  setIsConnected(connected: boolean) {
    this.connected = !!connected;
  }

  getState() {
    return this.state;
  }

  updateState(curState: AgentState) {
    if (!curState) {
      logger.debug('[updateState] invalid state');
      return;
    }
    this.state = curState;
  }
}

export default InstanceInfo;
    



