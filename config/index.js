const defaults = require('./defaults');
const local = require('./load-local-config');

const env = process.env.DRONE_DEPLOY_TO || process.env.TEST_ENV || (process.env.CI ? 'dev' : 'local');

const selenium = process.env.SELENIUM_HOST || (process.env.CI ? 'selenium' : 'localhost');

exports.config = Object.assign(local(env, defaults), { host: selenium });
