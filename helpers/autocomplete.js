module.exports = settings => function (name, value) {
  const el = this.$(`#${name}`);
  el.clearValue();
  el.click();
  el.keys(value);

  this.$(`#${name}__listbox`).$(`li*=${value}`).click();
};
