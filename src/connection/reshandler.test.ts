import Agent from '../agent';
import { AgentState } from '../util/constants';
import { handleResponse } from './reshandler';

describe('ResHandler', () => {
  it('handleResponse should return false for invalid data', () => {
    expect(handleResponse(null)).toBeFalsy();
    expect(handleResponse(10 as any)).toBeFalsy();
    expect(handleResponse('' as any)).toBeFalsy();
    expect(handleResponse({} as any)).toBeFalsy();
    expect(handleResponse({ data : 10 } as any)).toBeFalsy();
    expect(handleResponse({ data : { code: -1} } as any)).toBeFalsy();
  });

  it('handleResponse should return true for valid data', () => {
    const agent = Agent.getAgent();

    expect(handleResponse({ data : { code: AgentState.ACTIVE }} as any)).toBeTruthy();
    expect(agent.getInsInfo().getState()).toBe(AgentState.ACTIVE);

    expect(handleResponse({ data : { code: AgentState.SUSPEND }} as any)).toBeTruthy();
    expect(agent.getInsInfo().getState()).toBe(AgentState.SUSPEND);

    expect(handleResponse({ data : { code: AgentState.DELETE }} as any)).toBeTruthy();
    expect(agent.getInsInfo().getState()).toBe(AgentState.DELETE);

    expect(handleResponse({ data : { code: AgentState.INVALID_AGENT }} as any)).toBeTruthy();
    expect(agent.getInsInfo().getState()).toBe(AgentState.INVALID_AGENT);
    
  });
});
