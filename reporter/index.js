const WDIOReporter = require('@wdio/reporter').default;
const chalk = require('chalk');

class Reporter extends WDIOReporter {

  write(msg = '') {
    super.write(`${msg}\n`);
  }

  divider() {
    this.write('--------------------------------------');
  }

  onRunnerEnd(runner) {
    if (runner.failures) {
      // this.divider();
      this.write(chalk.blue.underline(runner.specs[0]));
      this.write();
      Object.values(this.suites).forEach(suite => {
        [...suite.tests, ...suite.hooks].forEach(test => {
          if (test.state === 'failed') {
            return this.reportFailedTest(test);
          }
        });
      });
      this.write();
    }
  }

  getTitle(test) {
    switch (test.type) {
      case 'test':
        return `"${test.fullTitle}"`;
      case 'hook':
        return `${test.title} for "${test.parent}"`;
    }
  }

  reportFailedTest(test) {
    const title = this.getTitle(test);
    this.write(chalk.red(`FAILED: ${title} failed:`));
    this.write(test.error.stack);
    this.write();
    if (test.error.expected || test.error.actual) {
      this.divider();
      this.write(`    Expected: ${test.error.expected}`);
      this.write(`    Actual:   ${test.error.actual}`);
      this.divider();
      this.write();
    }
  }

}

module.exports = Reporter;
