const assert = require('assert');

module.exports = settings => browser => async username => {
  username = username || settings.defaultUser;

  const doLogin = async () => {
    await browser.url('/logout');
    try {
      await browser.waitForVisible('[name=username]', 10000);
    } catch (e) {
      await browser.refresh();
      await browser.waitForVisible('[name=username]', 10000);
    }
    await browser.setValue('[name=username]', username);
    if (!settings.users[username]) {
      throw new Error(`Could not find user: ${username}`);
    }
    await browser.setValue('[name=password]', settings.users[username]);
    await browser.click('[name=login]');
    const errorMessage = await browser.$$('.alert-error');
    if (errorMessage.length) {
      const errorText = errorMessage[0].getText();
      assert.fail(`Login error found: ${errorText}`);
    }
    return browser.waitForVisible('h1*=Hello', 10000);
  };

  const tryLogin = async (count = 0) => {
    if (count === 3) {
      throw new Error('Login failed 3 times');
    }
    try {
      return doLogin();
    } catch (e) {
      console.log(`Login failed, retrying (${count + 1}).`);
      return tryLogin(count + 1);
    }
  };

  return tryLogin(0);

};
