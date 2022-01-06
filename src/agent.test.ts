import Agent from './agent';
import Txn from './metric/txn';
import { AgentState } from './util/constants';

describe('Agent', () => {
  it('getAgent should return singleton agent instance', () => {
    const agent = Agent.getAgent();
    const agent2 = Agent.getAgent();
    expect(agent).toEqual(agent2);
  })

  it('checkAndCreateTxn should return null for invalid input', () => {
    const agent = Agent.getAgent();
    agent.insinfo.updateState(AgentState.ACTIVE);
    expect(agent.checkAndCreateTxn(null, null)).toBeNull();
    expect(agent.checkAndCreateTxn(10 as any, 20 as any)).toBeNull();
    expect(agent.checkAndCreateTxn({} as any, {} as any)).toBeNull();
  });

  it('checkAndCreateTxn should return null if agent state is not active', () => {
    const agent = Agent.getAgent();
    agent.insinfo.updateState(AgentState.SUSPEND);
    expect(agent.checkAndCreateTxn({} as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/something' } as any, { on: jest.fn() } as any)).toBeNull();

    agent.insinfo.updateState(AgentState.DELETE);
    expect(agent.checkAndCreateTxn({} as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/something' } as any, { on: jest.fn() } as any)).toBeNull();

    agent.insinfo.updateState(AgentState.INVALID_AGENT);
    expect(agent.checkAndCreateTxn({} as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/something' } as any, { on: jest.fn() } as any)).toBeNull();
  });

  it('checkAndCreateTxn should return null if url is not valid', () => {
    const agent = Agent.getAgent();
    agent.insinfo.updateState(AgentState.ACTIVE);
    expect(agent.checkAndCreateTxn({ url: '' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.js' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.css' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.jpg' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.jpeg' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.bmp' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.png' } as any, { on: jest.fn() } as any)).toBeNull();
    expect(agent.checkAndCreateTxn({ url: '/static/a.ico' } as any, { on: jest.fn() } as any)).toBeNull();
  });

  it('checkAndCreateTxn should return txn object for valid input', () => {
    const url = '/product/checkout'
    const agent = Agent.getAgent();
    agent.config.setLicenseKey('a1b2c3d4');
    agent.config.setProjectId('a1b2c3d4');
    agent.insinfo.updateState(AgentState.ACTIVE);
    const txn = agent.checkAndCreateTxn({ url } as any, { on: jest.fn() } as any);
    expect(txn).not.toBeNull();
    expect(txn).toBeInstanceOf(Txn);
  });
});
