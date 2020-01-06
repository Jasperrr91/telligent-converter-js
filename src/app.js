const fs = require('fs');
const config = require('../config.json');
const decoder = require('./decoder');

// Decode each widget
const { inputFolder } = config;
fs.readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    decoder.decodeWidget(file, config);
  });
});
