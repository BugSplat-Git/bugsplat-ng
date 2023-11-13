const packageJson = require('../../../../package.json');

export const environment = {
  production: true,
  bugsplat: {
    database: 'fred',
    application: packageJson.name,
    version: packageJson.version
  }
};
