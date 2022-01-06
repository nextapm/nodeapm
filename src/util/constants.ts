export const DEFAULT_COLLECTOR = 'https://data.nextapm.dev';

export const MAX_TXN_LIMIT_PER_MINUTE = 100;

export enum AgentState {
  ACTIVE = 100,
  SUSPEND = 200,
  DELETE = 300,
  INVALID_AGENT = 400,
}

export const AgentStateInfo = {
  100: 'ACTIVATE',
  200: 'SUSPENDED',
  300: 'DELETED',
  400: 'INVALID'
}

export enum AgentReq {
  CONNECT = '/api/agent/connect',
  DATA = '/api/agent/data'
}