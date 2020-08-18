const Reporter = require('../../reporter');

module.exports = {
  hostname: process.env.SELENIUM_HOST || 'localhost',
  port: 4444,
  path: '/wd/hub',
  specs: [],
  exclude: [],
  maxInstances: 2,
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: []
    }
  }],
  headless: true,
  logLevel: 'silent',
  bail: 0,
  baseUrl: 'http://localhost:8080',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  framework: 'mocha',
  reporters: [ Reporter ],
  mochaOpts: {
    timeout: 1800000
  },
  slow: 30000
};
