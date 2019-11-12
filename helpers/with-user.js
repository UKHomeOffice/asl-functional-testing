const assert = require('assert');

module.exports = settings => browser => username => {
  username = username || settings.defaultUser;
  browser.url('/logout');
  try {
    browser.waitForVisible('[name=username]', 10000);
  } catch (e) {
    browser.refresh();
    browser.waitForVisible('[name=username]', 10000);
  }
  browser.setValue('[name=username]', username);
  if (!settings.users[username]) {
    throw new Error(`Could not find user: ${username}`);
  }
  browser.setValue('[name=password]', settings.users[username]);
  browser.click('[name=login]');
  const errorMessage = browser.$('.alert-error');
  if (errorMessage) {
    const errorText = errorMessage.getText();
    assert.fail(`Login error found: ${errorText}`);
  }
  browser.waitForVisible('h1*=Hello', 60000);
};
