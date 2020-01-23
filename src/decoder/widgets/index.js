import { writeFile } from 'fs';
import {
  createDirIfNotExists, convertJsonToXml,
} from '../helpers';
import {
  decodeScripts,
  decodeFiles,
  getValueFromLanguageKey,
  createWidgetOptionsFile,
} from './functions';

export default function widgetDecoder(jsonObject, config, dir) {
  const widgetNameReference = jsonObject.attr.name;
  const widgetName = getValueFromLanguageKey(jsonObject, widgetNameReference);

  const outputFolder = dir || config.outputFolder;
  const widgetDir = [outputFolder, widgetName, '/'].join('');
  createDirIfNotExists(widgetDir);

  createWidgetOptionsFile(jsonObject, widgetDir);

  let jsonTemplate = jsonObject;
  jsonTemplate = decodeScripts(jsonTemplate, widgetDir);
  if (jsonTemplate.files !== undefined) {
    jsonTemplate = decodeFiles(jsonTemplate, widgetDir);
  }

  const xmlTemplate = convertJsonToXml(jsonTemplate);
  const templateFilename = [widgetDir, 'WidgetTemplate.xml'].join('');

  writeFile(templateFilename, xmlTemplate, (err) => {
    if (err) throw err;
  });
}