/*global browser*/
const withUser = require('./with-user');
const downloadFile = require('./download-file');
const waitForSync = require('./wait-for-sync');
const waitForSuccess = require('./wait-for-success');
const selectMany = require('./select-many');

module.exports = (config) => {
  browser.setTimeout({ implicit: 500 });
  browser.addCommand('withUser', withUser(config));
  browser.addCommand('downloadFile', downloadFile(config));
  browser.addCommand('waitForSync', waitForSync(config));
  browser.addCommand('waitForSuccess', waitForSuccess(config));
  browser.addCommand('selectMany', selectMany(config));
};
