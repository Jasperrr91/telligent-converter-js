import {
  createDirIfNotExists,
  openXmlFile,
  convertXmlToJson,
} from '../helpers';
import {
  decodeScripts,
  decodeFiles,
  getValueFromLanguageKey,
  createWidgetOptionsFile,
} from './functions';

export function decodeWidget(jsonObject, outputDir) {
  // Extract the name of the widget and use that as the name of the output dir
  const widgetNameReference = jsonObject.attr.name;
  const widgetName = getValueFromLanguageKey(jsonObject, widgetNameReference);
  const widgetDir = [outputDir, widgetName, '/'].join('');
  createDirIfNotExists(widgetDir);

  // Create an options file containing the widgets attributes/options
  createWidgetOptionsFile(jsonObject, widgetDir);

  // Decode scripts and files of the widget
  decodeScripts(jsonObject, widgetDir);
  if (jsonObject.files !== undefined) {
    decodeFiles(jsonObject, widgetDir);
  }
}

export default function widgetDecoder(themeFileLocation, outputDir) {
  const widgetXml = openXmlFile(themeFileLocation);
  const widgetJson = convertXmlToJson(widgetXml);
  decodeWidget(widgetJson.scriptedContentFragments.scriptedContentFragment, outputDir);
}