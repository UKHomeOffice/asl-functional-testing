# ASL Functional Testing

Provides some simple wrappers for writing functional tests in wdio

## Usage

Create a config file in your project with the following content:

```js
module.exports = {
  // path to your test files
  specs: './tests/functional/specs/**/*.js',
  // the usernames and passwords for any users used in your tests
  users: {
    'username': 'password'
  },
  // the urls for your different environments
  urls: {
    local: 'http://localhost:8080',
    dev: '<dev url>',
    preprod: '<preprod url>'
  }
};
```

Add the following as a script to the scripts section in your package.json:

```
asl-test ./path/to/you/config
```

Run that script.

## Test helpers

There is currently a single helper function defined for logging in - `withUser` - this will start a clean browser session, and then log you in with the user defined.

```js
const assert = require('assert');

describe('Example tests', () => {

  it('can log in', () => {
    browser.withUser('username');
    const title = browser.getTitle();
    assert.equal(title, 'My page title');
  });

});
```

## Screenshots

You can optionally have the test runner create a set of screenshots of particular pages of your app after completing a successful test run. To do this, add a `screenshots` section to your config as follows:

```js
module.exports = {
  ...
  screenshots: {
    user: '<user to log in as>',
    urls: [
      '/',
      '/details',
      '/places'
    ],
    path: '/path/to/save/screenshots/to'
  }
};
```

When running tests locally then screenshots will be saved into the path specified. Alternatively they can be saved into AWS S3 by providing additional config for S3. This will save the screenshots for each test run in a subdirectory in S3 corresponding to the test run.

```js
module.exports = {
  ...
  screenshots: {
    user: '<user to log in as>',
    urls: [
      ...
    ],
    s3: {
      region: 'eu-west-2',
      bucket: 'asl-screenshots',
      prefix: 'my-service',
      accessKey: process.env.AWS_ACCESS_KEY,
      secret: process.env.AWS_SECRET
    }
  }
};
```
