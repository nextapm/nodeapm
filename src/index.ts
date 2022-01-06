import Agent from './agent';
import packageInfo from '../package.json';
import { schedule } from './connection';
import { init as initInstrument } from './instrument';
import { AgentConfigParams } from './util/types';

export const trackException = (err: Error) => {
  if (!err) {
    return;
  }
  const agent = Agent.getAgent();
  agent.checkAndTrackException(err);
};

export const config = (options: AgentConfigParams) => {
  if (!options) {
    return;
  }
  const { licenseKey, projectId } = options;
  const agent = Agent.getAgent();
  const config = agent.getConfig();
  config.setLicenseKey(licenseKey);
  config.setProjectId(projectId);
};

const init = () => {
  const agent = Agent.getAgent();
  const config = agent.getConfig();
  config.setVersion(packageInfo.version);
  initInstrument();
  schedule();
}

init();