import { AgentState } from './constants';

export interface ReqInfo {
  url: string;
  method: string;
  queryParam: string;
}

export interface TxnData {
  url: string;
  start: number;
  rt: number;
  method: string;
  status: number;
  type: number;
  errors: Map<string, number>;
}

export interface AgentInfo {
  // eslint-disable-next-line camelcase
  agent_version: string;
}

export interface AgentData {
  info: AgentInfo;
  txn: TxnData;
}

export interface CollectorData {
  code: AgentState
}

export interface CollectorRes {
  isSuccess: boolean;
  data: CollectorData
}

export interface ErrorInfo extends Error {
  nodeApmProcessed?: boolean;
  code?: string;
}

export interface MethodInfo {
  name: string;
  extract?: (obj, args) => void;
  wrapper?: (original, functionInfo: MethodInfo) => any;
}

export interface AgentConfigParams {
  licenseKey: string;
  projectId: string;
}
