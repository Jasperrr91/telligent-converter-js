import fs from 'fs';
import { helpers } from './decoder/index';
import { widgetDecoder, themeDecoder, widgetEncoder, themeEncoder } from './index';
import { createXMLFileFromData } from './decoder/themes/functions';
import {
  createDirIfNotExists,
} from './decoder/helpers';

// Decode each widget
const inputDir = './input/';
const outputDir = './output/';

fs.readdir(inputDir, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const widgetXml = helpers.openXmlFile(file, inputDir);
    const widgetJson = helpers.convertXmlToJson(widgetXml);
    widgetDecoder(widgetJson.scriptedContentFragments.scriptedContentFragment, outputDir);
  });
});

// Decode Themes XML file
const themesFile = '../themes.xml';
const themesXml = helpers.openXmlFile(themesFile, inputDir);
const themesJson = helpers.convertXmlToJson(themesXml);
const themeOutputDir = './output/';
themeDecoder(themesJson, themeOutputDir);

// Encodes themes
const themesFolder = './output/';
const themes = themeEncoder(themesFolder);
createDirIfNotExists('./encoded');
createXMLFileFromData('theme.xml', themes, './encoded/');

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
