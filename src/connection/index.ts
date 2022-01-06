import Agent from '../agent';
import { AgentReq } from '../util/constants';
import { sendReq } from './reqhandler';
import { handleResponse } from './reshandler';
import { processCollectedData } from './datahandler';
import logger from '../util/logger';
import os from 'os';

const getConnectPayload = (agent: Agent) => ({
  agent_info: {
    hostname: os.hostname(),
    host_type: os.platform(),
    agent_version: agent.getConfig().getVersion(),
  },
  environment: {
    os_version: os.release(),
    machine_name: os.hostname(),
    node_version: process.version,
    os: os.platform(),
    osarch: os.arch(),
  }
});

const sendConnect = async (agent: Agent) => {
  const payload = getConnectPayload(agent);
  const resData = await sendReq(AgentReq.CONNECT, payload);
  const success =  handleResponse(resData);
  agent.getInsInfo().setIsConnected(success);
}

const checkAndCommunicate = async () => {
  const agent = Agent.getAgent();
  try {
    if (!agent.config.isConfiguredProperly()) {
      return;
    }

    if (!agent.insinfo.isConnected()) {
      sendConnect(agent);
      return;
    }

    processCollectedData()
  } catch (e) {
    logger.error('[process] error', e);
  } finally {
    agent.getMetricStore().clear();
  }
}

export const schedule = () => {
  setInterval(() => {
    checkAndCommunicate();
  }, 60*1000).unref();
}