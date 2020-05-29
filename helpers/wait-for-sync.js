module.exports = settings => function () {
  this
    .$('.sync-indicator.syncing')
    .waitForExist({
      timeout: 20000,
      reverse: true
    });
};
