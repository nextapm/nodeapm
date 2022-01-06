import Agent from '../../agent';
import { isFunction } from '../../util/helper';

const wrapHandler = (handler) => {
  if (!isFunction(handler)) {
    return handler;
  }
  return function(req, res) {
    const agent = Agent.getAgent();
    return agent.createWebTxnContext(req, res, function() {
      try {
        return handler(req, res);
      } catch (err) {
        agent.checkAndTrackException(err);
        throw err;
      }
    });
  }
}
const wrapServer = (actual) => {
  return function(handler) {
    const wrapped = wrapHandler(handler);
    return actual(wrapped);
  }
}

const moduleInfo = [
  {
    name: 'createServer',
    wrapper: wrapServer,
  },
];

export default moduleInfo;
