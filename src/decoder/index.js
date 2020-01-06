import { writeFile } from 'fs';
import {
  openXmlFile, convertXmlToJson, createDirIfNotExists, decodeScripts, decodeFiles, convertJsonToXml,
} from './helpers';

export default function decodeWidget(filename, config) {
  const xmlObject = openXmlFile(filename, config);
  const jsonObject = convertXmlToJson(xmlObject);

  const { outputFolder } = config;
  const widgetName = filename.split('.')[0];
  const widgetDir = [outputFolder, widgetName, '/'].join('');
  createDirIfNotExists(outputFolder);
  createDirIfNotExists(widgetDir);

  let jsonTemplate = jsonObject;
  jsonTemplate = decodeScripts(jsonTemplate, config, widgetDir);
  jsonTemplate = decodeFiles(jsonTemplate, config, widgetDir);

  const xmlTemplate = convertJsonToXml(jsonTemplate);
  const templateFilename = [widgetDir, 'WidgetTemplate.xml'].join('');

  writeFile(templateFilename, xmlTemplate, (err) => {
    if (err) throw err;
  });
}
