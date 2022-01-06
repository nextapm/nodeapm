import { AgentState } from '../util/constants';
import InstanceInfo from './insinfo';

describe('InstanceInfo', () => {
  it('isDataCollectionAllowed should return true only active state', () => {
    const insinfo = new InstanceInfo();
    expect(insinfo.isDataCollectionAllowed()).toBeTruthy();
    insinfo.updateState(AgentState.SUSPEND);
    expect(insinfo.isDataCollectionAllowed()).toBeFalsy();
    insinfo.updateState(AgentState.DELETE);
    expect(insinfo.isDataCollectionAllowed()).toBeFalsy();
    insinfo.updateState(AgentState.INVALID_AGENT);
    expect(insinfo.isDataCollectionAllowed()).toBeFalsy();
    insinfo.updateState(AgentState.ACTIVE);
    expect(insinfo.isDataCollectionAllowed()).toBeTruthy();
  });

  it('updateState should not throw error and update for invalid input', () => {
    const insinfo = new InstanceInfo();
    insinfo.updateState(null);
    expect(insinfo.getState()).toBe(AgentState.ACTIVE);
  })

  it('updateState should update for valid input', () => {
    const insinfo = new InstanceInfo();
    insinfo.updateState(AgentState.DELETE);
    expect(insinfo.getState()).toBe(AgentState.DELETE);
    insinfo.updateState(AgentState.INVALID_AGENT);
    expect(insinfo.getState()).toBe(AgentState.INVALID_AGENT);
  })
});
