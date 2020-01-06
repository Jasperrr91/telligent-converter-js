import { readdir } from 'fs';
import config from '../config.json';
import { widgetDecoder, themeDecoder } from './decoder/index';

// Decode each widget
const { inputFolder } = config;
readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    widgetDecoder(file, config);
  });
});

// Decode Themes XML file
themeDecoder('../themes.xml', config);
