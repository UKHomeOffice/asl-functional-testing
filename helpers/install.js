/*global browser*/
const withUser = require('./with-user');
const downloadFile = require('./download-file');
const waitForSync = require('./wait-for-sync');
const waitForSuccess = require('./wait-for-success');
const selectMany = require('./select-many');
const autocomplete = require('./autocomplete');
const completeRichText = require('./complete-rich-text');

module.exports = (config) => {
  browser.setTimeout({ implicit: 500 });
  browser.addCommand('autocomplete', autocomplete(config));
  browser.addCommand('withUser', withUser(config));
  browser.addCommand('downloadFile', downloadFile(config));
  browser.addCommand('waitForSync', waitForSync(config));
  browser.addCommand('waitForSuccess', waitForSuccess(config));
  browser.addCommand('selectMany', selectMany(config));

  // true as third argument extends element - i.e. `browser.$(selector).completeRichText('words')`
  browser.addCommand('completeRichText', completeRichText(config), true);
};
