const packageJson = require('../../package.json');

export const environment = {
  production: true,
  bugsplat: {
    database: packageJson.database,
    application: packageJson.name,
    version: packageJson.version
  }
};