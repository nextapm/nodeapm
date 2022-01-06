import logger from '../util/logger';
import { MethodInfo } from '../util/types';
import { checkAndWrapFunction } from './wrapper';
import httpModuleInfo from './modules/http';

const coreModules = {
  http: httpModuleInfo,
};

let instrumented = false;

export const instrument = () => {
  Object.keys(coreModules).forEach((moduleName) => {
    try {
      logger.info(`Instrumenting module:: ${moduleName}`);
      const actualModule =
        moduleName === 'global' ? global : require(moduleName);
      coreModules[moduleName].forEach((eachMethod: MethodInfo) => {
        checkAndWrapFunction(actualModule, eachMethod, moduleName);
      });
    } catch (err) {
      logger.error(`unable to instrument ${moduleName}`, err);
    }
  });
};

export const init = () => {
  if (!instrumented) {
    instrument();
    instrumented = true;
  }
};
