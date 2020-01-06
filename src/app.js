import { readdir } from 'fs';
import config from '../config.json';
import { widgetDecoder, themeDecoder, helpers } from './decoder/index';

// Decode each widget
const { inputFolder } = config;
readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    widgetDecoder(file, config);
  });
});

// Decode Themes XML file
const themesFile = '../themes.xml';
const themesXml = helpers.openXmlFile(themesFile, config);
const themesJson = helpers.convertXmlToJson(themesXml);
themeDecoder(themesJson, config);
