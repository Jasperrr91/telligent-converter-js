import {
  createDirIfNotExists,
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

  decodeScripts(jsonObject, widgetDir);
  if (jsonObject.files !== undefined) {
    decodeFiles(jsonObject, widgetDir);
  }
}