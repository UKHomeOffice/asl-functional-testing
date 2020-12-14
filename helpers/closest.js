module.exports = settings => function (selector) {
  const elements = browser.$$(selector);
  const parent = this.parentElement();
  if (!elements.length || !parent) {
    throw new Error(`No ancestor element matching selector "${selector}" could be found`);
  }
  if (elements.find(e => e.isEqual(parent))) {
    return parent;
  }
  return parent.closest(selector);
};
