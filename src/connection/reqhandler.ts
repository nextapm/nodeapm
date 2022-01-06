import Agent from '../agent'
import logger from '../util/logger';
import { CollectorRes } from '../util/types';
import fetch from 'node-fetch';

export const sendReq = async (pathUri: string, data={}): Promise<CollectorRes> => {
  try {
    const agent = Agent.getAgent();
    const config = agent.getConfig();
    const queryParam = `licenseKey=${config.getLicenseKey()}&projectId=${config.getProjectId()}`;
    const url = `${config.getCollector()}${pathUri}?${queryParam}`;
    logger.info(`[sendReq] ${pathUri}`, config.isLogPayload() ? data : {});
    const res = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    logger.debug(`[sendReq] http response code ${res.status}`);
    const resData = await res.json();
    logger.info(`[sendReq] response ${pathUri} ${JSON.stringify(resData)}`);
    return resData;
  } catch (err) {
    logger.error('[sendReq] failed', err);
  }
  return {} as CollectorRes;
}