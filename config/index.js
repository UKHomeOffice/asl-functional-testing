const defaults = require('./defaults');
const local = require('./load-local-config');

const env = process.env.DRONE_DEPLOY_TO || process.env.TEST_ENV || (process.env.CI ? 'dev' : 'local');

const ci = process.env.CI ? { host: 'selenium' } : {};

exports.config = Object.assign(local(env, defaults), ci);
