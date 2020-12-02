const assert = require('assert');

module.exports = settings => function (username, selector = 'h1*=Hello') {
  username = username || settings.defaultUser;

  const doLogin = () => {
    this.deleteCookies();
    this.url('/logout');
    this.$('[name=username]').waitForDisplayed({ timeout: 10000 });
    this.$('[name=username]').setValue(username);
    if (!settings.users[username]) {
      console.error(`Could not find user: ${username}`);
    }
    this.$('[name=password]').setValue(settings.users[username] || settings.defaultPassword);
    this.$('[name=login]').click();
    const errorMessage = this.$$('.alert-error');
    if (errorMessage.length) {
      const errorText = errorMessage[0].getText();
      assert.fail(`Login error found: ${errorText}`);
    }
    this.$(selector).waitForDisplayed({ timeout: 10000 });
  };

  const tryLogin = (count = 0) => {
    if (count === 3) {
      throw new Error('Login failed 3 times');
    }
    try {
      doLogin();
    } catch (e) {
      console.error(`Login failed with message "${e.message}", retrying (${count + 1}).`);
      tryLogin(count + 1);
    }
  };

  tryLogin(0);

};
