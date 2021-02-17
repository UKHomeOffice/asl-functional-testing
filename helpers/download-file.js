const assert = require('assert');
const fetch = require('r2');
const pdf = require('pdf-parse');
const csv = require('csv-parse/lib/sync');

const parsePDF = data => pdf(Buffer.from(data, 'binary'));
const mimeTypes = {
  pdf: 'application/pdf',
  word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  csv: 'text/csv; charset=utf-8'
};

const getFile = function (link, type) {
  const url = link.getProperty('href');
  const allCookies = browser.getCookies();
  const sid = allCookies.find(c => c.name === 'sid').value;
  const headers = { cookie: `sid=${sid}` };
  return browser.call(() => {
    return fetch(url, { headers }).response
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), mimeTypes[type]);
        return res.buffer();
      })
      .then(data => {
        switch (type) {
          case 'pdf':
            return parsePDF(data).then(pdf => pdf.text.replace(/\s/g, ' '));
          case 'word':
          case 'csv':
            return csv(data, { columns: true });
          default:
            return data;
        }
      });
  });
};

const download = settings => function(type) {
  return getFile(this, type);
};

const downloadFile = settings => function(fileType) {

  // scroll window to top before trying to interact with download header
  this.$('header[role="banner"]').scrollIntoView();

  const toggleLink = this.$('.document-header a.toggle-details');

  if (toggleLink.isDisplayed() && toggleLink.getText().includes('View')) {
    toggleLink.click();
  }

  const fileTypeMapping = {
    pdf: {
      selector: 'a*=PDF',
      type: 'pdf'
    },
    nts: {
      selector: 'a=Download non-technical summary as a PDF',
      type: 'pdf'
    },
    word: {
      selector: 'a*=DOCX',
      type: 'word'
    },
    csv: {
      selector: 'a*=CSV',
      type: 'csv'
    }
  };

  if (typeof fileType === 'string') {
    fileType = fileTypeMapping[fileType];
  }

  if (!fileType || !fileType.selector) {
    throw new Error('selector must be defined');
  }

  // default type to 'pdf'
  fileType.type = fileType.type || 'pdf';

  const link = this.$(fileType.selector);

  if (toggleLink.isDisplayed() && toggleLink.getText().includes('Hide')) {
    toggleLink.click();
  }

  return getFile(link, fileType.type);

};

module.exports = { download, downloadFile };
