# Nextapm

Monitor the nodejs application built in any framework and supports node version 14 and above.

# Installation
```
npm i nodeapm
```

# Instrument

Include the nodeapm module in the fire line of application start file.
```
const nodeapm = require('nodeapm'); // should be in first line
...your app imports...

nodeapm.config({
  licenseKey: '<licenseKey>',
  projectId: '<projectId>'
})
...your app logic...

```

For Typescript/ES6 application use import rather than require.
```
import { config } from 'nodeapm'; // should be in first line
...your app imports...

config({
  licenseKey: '$licenseKey',
  projectId: '$projectId'
})
...your app logic...
```

# Track Exceptions

Inorder to track exception, use following agent api.

```
const nodeapm = require('nodeapm');
... your app imports...

try {
  ...your app code ...
} catch (e) {
  nodeapm.trackException(e);
}
```

```
import { trackException } from 'nodeapm';
... your app imports...

try {
  ...your app code ...
} catch (e) {
  trackException(e);
}
```

# Restart/ Redeploy
Finally restart/redeploy the application and perform transaction and check metrics in [https://app.nextapm.dev](https://app.nextapm.dev) dashboard


