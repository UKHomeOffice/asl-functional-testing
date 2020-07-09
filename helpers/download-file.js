const assert = require('assert');
const fetch = require('r2');
const pdf = require('pdf-parse');

const parsePDF = data => pdf(Buffer.from(data, 'binary'));

const downloadFile = settings => function(fileType) {
  this.$('a=View download options').click();

  const fileTypeMapping = {
    pdf: {
      selector: 'a*=(.pdf)',
      type: 'pdf',
      followDownloadsLink: false
    },
    nts: {
      selector: 'a*=Non-technical summary',
      type: 'pdf'
    },
    word: {
      selector: 'a*=(.docx)',
      type: 'word'
    }
  };

  if (typeof fileType === 'string') {
    fileType = fileTypeMapping[fileType];
  }

  if (!fileType || !fileType.selector) {
    throw new Error('selector must be defined');
  }

  if (fileType.followDownloadsLink !== false) {
    this.$('a=All downloads').click();
  }

  // default type to 'pdf'
  fileType.type = fileType.type || 'pdf';

  const mimeTypes = {
    pdf: 'application/pdf',
    word: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };

  const url = this.$(fileType.selector).getProperty('href');

  if (fileType.followDownloadsLink !== false) {
    this.$('a*=Back').click();
  } else {
    this.$('a*=Hide download options').click();
  }

  const allCookies = this.getCookies();
  const sid = allCookies.find(c => c.name === 'sid').value;
  const headers = { cookie: `sid=${sid}` };

  return this.call(() => {
    return fetch(url, { headers }).response
      .then(res => {
        assert.equal(res.status, 200);
        assert.equal(res.headers.get('content-type'), mimeTypes[fileType.type]);
        return res.buffer();
      })
      .then(data => {
        switch (fileType.type) {
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
