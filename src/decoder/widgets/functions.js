/* eslint-disable no-underscore-dangle */
import {
  writeFileSync,
} from 'fs';
import { convertXmlToJson } from '../helpers';

export function createWidgetOptionsFile(widgetJson, widgetDir) {
  const outputFile = [widgetDir, '/widget_options.json'].join('');
  const themeAttributes = widgetJson.attr;

  writeFileSync(outputFile, JSON.stringify(themeAttributes, null, 2));
}


export function writeScriptToFile(xml, fileName, outputDir) {
  if (xml === undefined) return;
  const fileContents = xml.__cdata;
  const outputFile = [outputDir, '/', fileName].join('');

  writeFileSync(outputFile, fileContents);
}

export function writeFileToFile(file, outputDir) {
  const encodedContents = file['#text'];
  const decodedContents = Buffer.from(encodedContents, 'base64').toString();
  const fileName = file.attr.name;
  const outputFile = [outputDir, fileName].join('');

  writeFileSync(outputFile, decodedContents);
}

export function decodeScript(xml, scriptFile, dir) {
  const outputXml = xml;
  const scriptName = scriptFile.split('.')[0];
  const contents = xml[scriptName];
  if (contents === undefined) return false;
  if (contents.__cdata !== undefined) writeScriptToFile(contents, scriptFile, dir);
  outputXml[scriptName] = `{${scriptFile}}`;
  return outputXml;
}

export function decodeScripts(data, widgetDir) {
  let template = data;

  const widgetScripts = [
    'contentScript.vm',
    'headerScript.vm',
    'configuration.xml',
    'languageResources.xml',
    'additionalCssScript.css',
  ];

  widgetScripts.forEach((widgetScript) => {
    template = decodeScript(data, widgetScript, widgetDir);
  });
  return template;
}

export function decodeFiles(data, widgetDir) {
  const template = data;
  const { files } = data;

  try {
    files.file.forEach((file) => writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) writeFileToFile(files.file, widgetDir);
  }

  template.files = '{files}';
  return template;
}

export function replaceSlashWithOR(string) {
  return string.replace(/\//g, ' OR ');
}

export function getValueFromLanguageKey(jsonObject, key) {
  const languageResourcesXML = jsonObject.languageResources.__cdata;
  const languageResources = convertXmlToJson(languageResourcesXML);
  const resourceList = languageResources.language.resource;

  const re = /^\$\{resource:(.*)\}$/;
  const keyName = re.exec(key)[1];

  const matchingResource = resourceList.filter((resource) => resource.attr.name === keyName);
  const result = matchingResource[0]['#text'];
  return replaceSlashWithOR(result);
}

export default {
  createWidgetOptionsFile,
  writeScriptToFile,
  writeFileToFile,
  decodeScript,
  decodeScripts,
  decodeFiles,
};
