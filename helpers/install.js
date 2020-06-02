/*global browser*/
const withUser = require('./with-user');
const downloadFile = require('./download-file');
const waitForSync = require('./wait-for-sync');

module.exports = (config) => {
  browser.setTimeout({ implicit: 3000 });
  browser.addCommand('withUser', withUser(config));
  browser.addCommand('downloadFile', downloadFile(config));
  browser.addCommand('waitForSync', waitForSync(config));
};
