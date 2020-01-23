import fs from 'fs';
import config from '../config.json';
import { widgetDecoder, themeDecoder, helpers } from './decoder/index';
import { widgetEncoder, themeEncoder } from './encoder/index';
import { createXMLFileFromData } from './decoder/themes/functions';
import {
  createDirIfNotExists,
} from './decoder/helpers';

// Decode each widget
const { inputFolder } = config;
fs.readdir(inputFolder, (err, files) => {
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

// Encodes themes
const themesFolder = './output/';
themeEncoder(themesFolder);

const folderWithWidgets = './output/';
fs.readdir(folderWithWidgets, (err, folders) => {
  if (err) throw err;
  folders.forEach((folder) => {
    const widgetTemplate = [folderWithWidgets, folder, '/widget_options.json'].join('');
    if (fs.existsSync(widgetTemplate)) {
      const widgetFolder = [folderWithWidgets, folder].join('');
      const jsonObject = widgetEncoder(widgetFolder);
      createDirIfNotExists('./encoded');
      const widgetFile = [folder, '.xml'].join('');
      createXMLFileFromData(widgetFile, jsonObject, './encoded/');
    }
  });
});
