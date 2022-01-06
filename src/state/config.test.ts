import Config from './config';

describe('Config', () => {
  it('Config instance should be initialized from environment values', () => {
    const licenseKey = 'abc2y8qsifhjdsa9w0e';
    const projectId = 'skdjj2938u9ksdwuieiu';
    process.env.NEXTAPM_LICENSE_KEY = licenseKey;
    process.env.NEXTAPM_PROJECT_ID = projectId;
    process.env.NEXTAPM_LOG_PAYLOAD = '1';
    const config = new Config();
    expect(config.getLicenseKey()).toBe(licenseKey);
    expect(config.getProjectId()).toBe(projectId);
    expect(config.getVersion()).toBe('1.0.0');
    expect(config.isLogPayload()).toBeTruthy();
    expect(config.isConfiguredProperly()).toBeTruthy();
    process.env.NEXTAPM_LICENSE_KEY = '';
    process.env.NEXTAPM_PROJECT_ID = '';
    process.env.NEXTAPM_LOG_PAYLOAD = '';
  });

  it('isConfiguredProperly should return false if license key empty', () => {
    process.env.NEXTAPM_LICENSE_KEY = '';
    const config = new Config();
    expect(config.isConfiguredProperly()).toBeFalsy();
  });

  it('isConfiguredProperly should return false if project id empty', () => {
    process.env.NEXTAPM_LICENSE_KEY = 'abc';
    process.env.NEXTAPM_PROJECT_ID = '';
    const config = new Config();
    expect(config.isConfiguredProperly()).toBeFalsy();
    process.env.NEXTAPM_LICENSE_KEY = '';
  });

  it('Collector url should be data.nextapm.dev if NEXTAPM_HOST not configured', () => {
    process.env.NEXTAPM_HOST = '';
    const config = new Config();
    expect(config.getCollector()).toBe('https://data.nextapm.dev');
  });

  it('Collector url should be NEXTAPM_HOST if configured', () => {
    process.env.NEXTAPM_HOST = 'localhost:3000';
    const config1 = new Config();
    expect(config1.getCollector()).toBe('https://localhost:3000');
    process.env.NEXTAPM_HOST = 'http://localhost:3000';
    const config2 = new Config();
    expect(config2.getCollector()).toBe('http://localhost:3000');
  });
});
