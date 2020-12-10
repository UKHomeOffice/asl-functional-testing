module.exports = settings => function (selector) {
  return this.$(function() { return this.closest(`${selector}`); }
  );
};
