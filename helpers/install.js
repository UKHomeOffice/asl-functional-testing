/*global browser*/
const withUser = require('./with-user');
const downloadFile = require('./download-file');
const waitForSync = require('./wait-for-sync');
const selectMany = require('./select-many');

module.exports = (config) => {
  browser.addCommand('withUser', withUser(config));
  browser.addCommand('downloadFile', downloadFile(config));
  browser.addCommand('waitForSync', waitForSync(config));
  browser.addCommand('selectMany', selectMany(config));
};
