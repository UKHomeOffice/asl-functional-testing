const assert = require('assert');
const fetch = require('r2');
const pdf = require('pdf-parse');

const parsePDF = data => pdf(Buffer.from(data, 'binary'));

const downloadFile = settings => function(fileType) {
  const downloadOptionsToggle = this.$('a=View download options');
  downloadOptionsToggle.click();

  if (fileType === 'word') {
    this.$('a=All downloads').click();
  }

  const downloadLinks = {
    pdf: 'a*=(.pdf)',
    word: 'a*=(.docx)'
  };

  const mimeTypes = {
    pdf: 'application/pdf',
    word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  const url = this.$(downloadLinks[fileType]).getProperty('href');

  if (fileType === 'word') {
    this.$('a*=Back').click();
  } else {
    downloadOptionsToggle.click(); // close it again so we can call this function multiple times
  }

  const allCookies = this.getCookies();
  const sid = allCookies.find(c => c.name === 'sid').value;
  const headers = { cookie: `sid=${sid}` };

  return this.call(() => {
    return fetch(url, { headers }).response
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), mimeTypes[fileType]);
        return res.buffer();
      })
      .then(data => {
        switch (fileType) {
          case 'pdf':
            return parsePDF(data).then(pdf => pdf.text.replace(/\s/g, ' '));
          case 'word':
            return data.toString('utf8');
          default:
            return data;
        }
      });
  });
};

module.exports = downloadFile;
