import { getCollectorBaseUrl } from '../util/helper';
import logger from '../util/logger';

class Config {
  version: string;
  licenseKey: string;
  projectId: string;
  collector: string;
  logPayload: boolean;

  constructor() {
    this.version = '1.0.0';
    this.licenseKey = process.env.NEXTAPM_LICENSE_KEY;
    this.projectId = process.env.NEXTAPM_PROJECT_ID;
    this.collector = getCollectorBaseUrl();
    this.logPayload = !!process.env.NEXTAPM_LOG_PAYLOAD;
  }

  isConfiguredProperly() {
    if (!this.licenseKey) {
      logger.error(
        'configure license key in NEXTAPM_LICENSE_KEY environment variable'
      );
      return false;
    }
    if (!this.projectId) {
      logger.error(
        'configure project id in NEXTAPM_PROJECT_ID environment variable'
      );
      return false;
    }
    return true;
  }

  getLicenseKey() {
    return this.licenseKey;
  }

  setLicenseKey(licenseKey: string) {
    this.licenseKey = licenseKey;
  }

  getProjectId() {
    return this.projectId;
  }

  setProjectId(projectId: string) {
    this.projectId = projectId;
  }

  getCollector() {
    return this.collector;
  }

  isLogPayload() {
    return this.logPayload;
  }

  getVersion() {
    return this.version;
  }

  setVersion(curVersion: string) {
    this.version = curVersion;
  }
}

export default Config;