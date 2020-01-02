const fs = require('fs');
const config = require('../config.json');
const decoderHelpers = require('./decoder/helpers');
const decoder = require('./decoder');

// Decode each widget
const { inputFolder } = config;
fs.readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const xmlData = decoderHelpers.parseXmlFile(file);
    decoder.decodeXml(xmlData, file, config);
  });
});
