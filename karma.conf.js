const testFilePattern =  process.argv[process.argv.length-1];

module.exports = function (config) {
  const _config = {
    basePath: '',
    frameworks: ['jasmine', 'karma-typescript'],
    files: [

      // BugSplat source file pattern
      { pattern: "src/*.ts" },

      // BugSplat test file pattern
      { pattern: testFilePattern },

      // TestBed Initialization
      'test/init.ts',

      // Polyfills
      'node_modules/core-js/client/shim.js',      

      // zone.js
      'node_modules/zone.js/dist/zone.js',
      'node_modules/zone.js/dist/long-stack-trace-zone.js',
      'node_modules/zone.js/dist/proxy.js',
      'node_modules/zone.js/dist/sync-test.js',
      'node_modules/zone.js/dist/jasmine-patch.js',
      'node_modules/zone.js/dist/async-test.js',
      'node_modules/zone.js/dist/fake-async-test.js',

      // RxJs
      { pattern: 'node_modules/rxjs/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/rxjs/**/*.js.map', included: false, watched: false },

      // Paths loaded via module imports:
      // Angular itself
      { pattern: 'node_modules/@angular/**/*.js', included: false, watched: false },
      { pattern: 'node_modules/@angular/**/*.js.map', included: false, watched: false },
    ],
    preprocessors: {
      './src/*.ts': ['karma-typescript'],
      './test/*.ts': ['karma-typescript']
    },
    karmaTypescriptConfig: {
      compilerOptions: {
        "outDir": "./dist/test",
        "sourceMap": true,
        "noImplicitAny": false,
        "experimentalDecorators": true,
        "module": "commonjs",
        "target": "es5",
        "jsx": "react",
        "allowJs": true,
        "types": [
          "jasmine"
        ],
        "lib": [
            "es2015",
            "dom"
        ]
      },
      "exclude": ["node_modules"]
    },
    plugins: [
      require('karma-jasmine'),
      require('karma-typescript'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-jasmine-html-reporter')
    ],
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  }

  if (process.env.TRAVIS) {
    _config.browsers = ['Firefox'];
    _config.singleRun = true;
  }

  config.set(_config);
};