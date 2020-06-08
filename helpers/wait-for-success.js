module.exports = settings => function (options) {
  this.waitUntil(() => {
    if (this.$('.govuk-panel.success').isDisplayed()) {
      return true;
    }
    if (this.$('.alert:not(.alert-error)').isDisplayed()) {
      return true;
    }
    return false;
  }, options);
};
