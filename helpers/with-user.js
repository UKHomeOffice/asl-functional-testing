module.exports = settings => browser => username => {
  browser.url('/logout');
  browser.setValue('[name=username]', username);
  if (!settings.users[username]) {
    throw new Error(`Could not find user: ${username}`);
  }
  browser.setValue('[name=password]', settings.users[username]);
  browser.click('[name=login]');
};
