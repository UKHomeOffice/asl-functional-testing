const withUser = require('./with-user');
const screenshots = require('./screenshots');

module.exports = settings => browser => {
  browser.addCommand('withUser', withUser(settings)(browser));
  browser.addCommand('takeScreenshots', screenshots(settings)(browser));
  return browser;
};
