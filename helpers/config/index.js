try {
  require('dotenv').config();
} catch (e) {}

const defaults = require('./defaults');
const env = process.env.TEST_ENV || 'local';
const helpers = require('../install');

module.exports = settings => {
  const config = {
    ...defaults,
    defaultUser: 'holc',
    users: {
      'newuser': process.env.KEYCLOAK_PASSWORD,
      'holc': process.env.KEYCLOAK_PASSWORD,
      'ntco': process.env.KEYCLOAK_PASSWORD,
      'basicntco': process.env.KEYCLOAK_PASSWORD,
      'read': process.env.KEYCLOAK_PASSWORD,
      'basic': process.env.KEYCLOAK_PASSWORD,
      'blocked': process.env.KEYCLOAK_PASSWORD,
      'piltransfer': process.env.KEYCLOAK_PASSWORD,
      'pharmaadmin': process.env.KEYCLOAK_PASSWORD,
      'email-change-before@example.com': process.env.KEYCLOAK_PASSWORD,
      'email-change-after@example.com': process.env.KEYCLOAK_PASSWORD,
      'password-change@example.com': process.env.KEYCLOAK_PASSWORD,
      'asrusuper': process.env.KEYCLOAK_PASSWORD,
      'asruadmin': process.env.KEYCLOAK_PASSWORD,
      'asrusupport': process.env.KEYCLOAK_PASSWORD,
      'licensing': process.env.KEYCLOAK_PASSWORD,
      'inspector': process.env.KEYCLOAK_PASSWORD
    },
    baseUrl: settings.urls[env],
    ...settings
  };
  if (config.headless) {
    config.capabilities[0]['goog:chromeOptions'] = { args: ['--headless', '--disable-gpu'] };
  }
  if (config.sample !== false) {
    config.mochaOpts.require = require.resolve('./sample');
  }
  config.before = (...args) => {
    helpers(config);
    if (typeof settings.before === 'function') {
      settings.before(...args);
    }
  };
  return { config };
};
