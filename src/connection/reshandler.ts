import Agent from '../agent';
import { AgentStateInfo } from '../util/constants';
import logger from '../util/logger';
import { CollectorRes } from '../util/types';

export const handleResponse = (resData: CollectorRes) => {
  try {
    if (!resData || !resData.data) {
      logger.debug('[handleResponse] invalid response data');
      return false;
    }
    if (!resData.data.code || !AgentStateInfo[resData.data.code]) {
      logger.debug('[handleResponse] invalid response code');
      return false;
    }
    const agent = Agent.getAgent();
    const insinfo = agent.getInsInfo();
    const data = resData.data;
    if (insinfo.getState() !== data.code) {
      logger.info(`[handleResponse] received code ${data.code}`);
      insinfo.updateState(data.code)
    }
    return true;
  } catch (e) {
    logger.error('[handleResponse] failed', e);
  }
  return false;
}


