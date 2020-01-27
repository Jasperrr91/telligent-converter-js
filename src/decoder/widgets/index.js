import {
  createDirIfNotExists,
} from '../helpers';
import {
  decodeScripts,
  decodeFiles,
  getValueFromLanguageKey,
  createWidgetOptionsFile,
} from './functions';

export default function widgetDecoder(jsonObject, outputDir) {
  const widgetNameReference = jsonObject.attr.name;
  const widgetName = getValueFromLanguageKey(jsonObject, widgetNameReference);

  const widgetDir = [outputDir, widgetName, '/'].join('');
  createDirIfNotExists(widgetDir);

  createWidgetOptionsFile(jsonObject, widgetDir);

  decodeScripts(jsonObject, widgetDir);
  if (jsonObject.files !== undefined) {
    decodeFiles(jsonObject, widgetDir);
  }
}
