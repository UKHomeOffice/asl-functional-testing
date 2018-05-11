const fs = require('fs');
const path = require('path');
const mkdir = require('mkdirp');
const assert = require('assert');

const AWS = require('aws-sdk');

module.exports = settings => {
  if (!settings.screenshots) {
    return browser => () => {};
  }

  const now = (new Date()).toISOString();

  const saveScreenshot = (data, url) => {
    const file = url === '/' ? 'index' : url.replace('/', '');
    const filename = `${file}.png`;
    const binary = Buffer.from(data, 'base64');

    // if running locally then save locally
    if (settings.env === 'local' && settings.screenshots.path) {
      const dir = path.resolve(process.cwd(), settings.screenshots.path);
      mkdir.sync(dir);
      fs.writeFileSync(path.resolve(dir, filename), binary, 'binary');
    }

    // if s3 is configured then save to there
    if (settings.screenshots.s3 && settings.screenshots.s3.accessKey) {
      assert(settings.screenshots.s3.bucket, 'Bucket name is required');
      assert(settings.screenshots.s3.prefix, 'S3 prefix path is required');
      const s3 = new AWS.S3({
        credentials: {
          accessKeyId: settings.screenshots.s3.accessKey,
          secretAccessKey: settings.screenshots.s3.secret
        },
        region: settings.screenshots.s3.region
      });
      var params = {
        Body: binary,
        Bucket: settings.screenshots.s3.bucket,
        Key: path.join(settings.screenshots.s3.prefix, settings.env, now, filename)
      };
      return new Promise((resolve, reject) => {
        s3.putObject(params, err => err ? reject(err) : resolve());
      });
    }
  };

  return browser => () => {
    browser.withUser(settings.screenshots.user);
    const promises = settings.screenshots.urls.map(u => {
      browser.url(u);
      const data = browser.screenshot();
      return saveScreenshot(data.value, u);
    });
    return Promise.all(promises);
  };
};
