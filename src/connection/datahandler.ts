import Agent from '../agent'
import { AgentReq, AgentState } from '../util/constants';
import { getResCodeMessage } from '../util/helper';
import logger from '../util/logger';
import { sendReq } from './reqhandler';
import { handleResponse } from './reshandler';

const getDataWithTime = (data) => {
  return {
    info: {
      time: Date.now()
    },
    data,
  }
}
    
export const processCollectedData = async () => {
  const agent = Agent.getAgent();
  const insinfo = agent.insinfo;
  const state = insinfo.getState();
  const metricStore = agent.getMetricStore();

  logger.info(`[processCollectedData] ${getResCodeMessage(state)}`);

  if (state === AgentState.ACTIVE) {
    const txnMetrics = metricStore.getTxnMetrics();
    logger.info(`[processCollectedData] sending metrics size ${txnMetrics.length}`)
    handleResponse(await sendReq(AgentReq.DATA, getDataWithTime(txnMetrics)));
    return;
  }
      

  if (state === AgentState.SUSPEND) {
    handleResponse(await sendReq(AgentReq.DATA, getDataWithTime([])));
  }

}