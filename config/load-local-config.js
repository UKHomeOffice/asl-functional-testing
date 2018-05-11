/* global browser */
const path = require('path');
const helpers = require('../helpers');

module.exports = (env, defaults) => {

  let local;
  const config = defaults;

  if (process.env.CONFIG_PATH) {
    try {
      local = require(process.env.CONFIG_PATH);
    } catch (e) {
      throw new Error(`Could not load config file from ${process.env.CONFIG_PATH}`);
    }
  }

  if (!local) {
    return config;
  }

  if (local.urls && local.urls[env]) {
    config.baseUrl = local.urls[env];
  } else {
    throw new Error(`Could not find test url for environment: ${env}`);
  }

  if (local.specs) {
    const specs = [].concat(local.specs).map(p => path.resolve(process.cwd(), p));
    config.specs = specs;
  }

  const loadHelpers = helpers({ ...local, env });

  config.before = () => loadHelpers(browser);
  config.after = fails => fails === 0 && browser.takeScreenshots();

  return Object.assign(config, local.wdio);

};
