const { OAuthClientCredentialsClient, SymbolsApiClient } = require('@bugsplat/symbol-upload');
const fs = require('fs');
const path = require('path');
const packageJson = require('../package.json');
require('dotenv').config();

(async () => {
    const clientId = process.env.SYMBOL_UPLOAD_CLIENT_ID;
    if (!clientId) {
        throw new Error('Please set SYMBOL_UPLOAD_CLIENT_ID in .env file');
    }

    const clientSecret = process.env.SYMBOL_UPLOAD_CLIENT_SECRET;
    if (!clientSecret) {
        throw new Error('Please set SYMBOL_UPLOAD_CLIENT_SECRET in .env file');
    }

    const database = packageJson.database;
    const application = packageJson.name;
    const version = process.argv[2] === 'dev' ? `${packageJson.version}-dev` : packageJson.version;

    const buildDirectory = `./dist/${application}`;
    const files = fs.readdirSync(buildDirectory)
        .filter(file => file.endsWith('.js.map'))
        .map(file => {
            const filePath = `${buildDirectory}/${file}`;
            const stat = fs.statSync(filePath);
            const name = path.basename(filePath);
            const size = stat.size;
            return {
                name,
                size,
                file: fs.createReadStream(filePath)
            };
        });

    const bugsplat = await OAuthClientCredentialsClient.createAuthenticatedClient(clientId, clientSecret);
    const symbolsApiClient = new SymbolsApiClient(bugsplat);
    await symbolsApiClient.deleteSymbols(
        database,
        application,
        version
    );
    await symbolsApiClient.postSymbols(
        database,
        application,
        version,
        files
    );
    console.log(`Source maps uploaded to BugSplat ${database}-${application}-${version} successfully!`);
})().catch(error => console.error(error));