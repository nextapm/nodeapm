import { AgentState, AgentStateInfo, DEFAULT_COLLECTOR } from './constants';
import {
  getCollectorBaseUrl,
  getReqInfo,
  getResCodeMessage,
  isEmpty,
  isFunction,
  getErrName,
  isAllowedUrl,
  getNormalizedUrl
} from './helper';

describe('HelperUtil', () => {
  it('isEmpty', () => {
    expect(isEmpty('')).toBeTruthy();
    expect(isEmpty(null)).toBeTruthy();
    expect(isEmpty(undefined)).toBeTruthy();
    expect(isEmpty('something')).toBeFalsy();
  });

  it('isFunction', () => {
    expect(isFunction('')).toBeFalsy();
    expect(isFunction(null)).toBeFalsy();
    expect(isFunction(undefined)).toBeFalsy();
    expect(isFunction('something')).toBeFalsy();
    expect(isFunction(isFunction)).toBeTruthy();
  });

  it('getReqInfo should return valid extracted info for valid req object', () => {
    const url = '/login';
    const method = 'POST';
    expect(getReqInfo({ url, method } as any)).toEqual({
      url,
      method,
      queryParam: '',
    });
  });

  it('getReqInfo should return valid queryparam from valid url', () => {
    const queryParam = 'name=chan';
    const uri = '/login';
    const url = `${uri}?${queryParam}`;
    const method = 'POST';
    expect(getReqInfo({ url, method } as any)).toEqual({
      url: uri,
      method,
      queryParam,
    });
  });

  it('getReqInfo should return empty info if req object not valid', () => {
    expect(getReqInfo(null)).toEqual({
      url: '',
      method: '',
      queryParam: '',
    });
  });

  it('getErrName should return name of error object', () => {
    const code = 10001;
    const err = new Error();
    err['code'] = code;
    expect(getErrName(null)).toBe('Error');
    expect(getErrName(new Error())).toBe('Error');
    expect(getErrName(new TypeError())).toBe('TypeError');
    expect(getErrName(err)).toBe(code.toString());
  });

  it('getCollectorBaseUrl should return default domain if NEXTAPM_HOST not configured', () => {
    process.env.NEXTAPM_HOST = '';
    expect(getCollectorBaseUrl()).toBe(DEFAULT_COLLECTOR);
  });

  it('getCollectorBaseUrl should return NEXTAPM_HOST if configured', () => {
    const domain = 'http://localhost:3000';
    process.env.NEXTAPM_HOST = domain;
    expect(getCollectorBaseUrl()).toBe(domain);
  });

  it('getCollectorBaseUrl should prefix https if NEXTAPM_HOST only has hostname', () => {
    const domain = 'localhost:3000';
    process.env.NEXTAPM_HOST = domain;
    expect(getCollectorBaseUrl()).toBe(`https://${domain}`);
  });

  it('getResCodeMessage should return passed value if not valid agent state', () => {
    expect(getResCodeMessage(null)).toBeNull();
  });

  it('getResCodeMessage should return agent state message for valid state', () => {
    expect(getResCodeMessage(AgentState.ACTIVE)).toBe(AgentStateInfo[AgentState.ACTIVE]);
    expect(getResCodeMessage(AgentState.SUSPEND)).toBe(AgentStateInfo[AgentState.SUSPEND]);
    expect(getResCodeMessage(AgentState.DELETE)).toBe(AgentStateInfo[AgentState.DELETE]);
    expect(getResCodeMessage(AgentState.INVALID_AGENT)).toBe(AgentStateInfo[AgentState.INVALID_AGENT]);
  });

  it('isAllowed should return false for invalid urls', () => {
    expect(isAllowedUrl(null)).toBeFalsy();
    expect(isAllowedUrl('')).toBeFalsy();
    expect(isAllowedUrl('/a/home.js')).toBeFalsy();
    expect(isAllowedUrl('/a/home.css')).toBeFalsy();
    expect(isAllowedUrl('/a/home.gif')).toBeFalsy();
    expect(isAllowedUrl('/a/home.jpg')).toBeFalsy();
    expect(isAllowedUrl('/a/home.jpeg')).toBeFalsy();
    expect(isAllowedUrl('/a/home.bmp')).toBeFalsy();
    expect(isAllowedUrl('/a/home.png')).toBeFalsy();
    expect(isAllowedUrl('/a/home.ico')).toBeFalsy();
    expect(isAllowedUrl('/api/checkout')).toBeTruthy();
  });

  it('getNormalizedUrl should replace numbers as *', () => {
    expect(getNormalizedUrl('')).toBe('');
    expect(getNormalizedUrl('/api')).toBe('/api');
    expect(getNormalizedUrl('/api/123')).toBe('/api/*');
    expect(getNormalizedUrl('/api/123bcf')).toBe('/api/123bcf');
    expect(getNormalizedUrl('/api/1234/abcd')).toBe('/api/*/abcd');
    expect(getNormalizedUrl('/api/1234/abcd/4567')).toBe('/api/*/abcd/*');
    expect(getNormalizedUrl('/api/1234/abcd/4567abd')).toBe('/api/*/abcd/4567abd');
  });
});
