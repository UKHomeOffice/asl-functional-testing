module.exports = settings => function (imagePath) {
  const file = browser.uploadFile(imagePath);
  this.$('input[type="file"]').setValue(file);
};
