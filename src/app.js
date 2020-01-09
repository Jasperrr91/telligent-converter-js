import { readdir } from 'fs';
import config from '../config.json';
import { widgetDecoder, themeDecoder, helpers } from './decoder/index';

// Decode each widget
const { inputFolder } = config;
readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const widgetXml = helpers.openXmlFile(file, config);
    const widgetJson = helpers.convertXmlToJson(widgetXml);
    widgetDecoder(widgetJson.scriptedContentFragments.scriptedContentFragment, config);
  });
});

// Decode Themes XML file
const themesFile = '../themes.xml';
const themesXml = helpers.openXmlFile(themesFile, config);
const themesJson = helpers.convertXmlToJson(themesXml);
themeDecoder(themesJson, config);
