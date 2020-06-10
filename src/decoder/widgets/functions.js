/* eslint-disable no-underscore-dangle */
import {
  writeFileSync,
} from 'fs';
import { convertXmlToJson, convertJsonToXml } from '../helpers';

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

export function getFileExtension(filename) {
  return filename.split('.')[1];
}

export function writeFileToFile(file, outputDir) {
  const encodedContents = file['#text'];
  const fileName = file.attr.name;
  const outputFile = [outputDir, fileName].join('');
  let fileContents;

  // mp3 and wave files are not base64 encoded
  if (getFileExtension(fileName) === 'mp3' || getFileExtension(fileName) === 'wav') {
    fileContents = encodedContents;
  } else {
    fileContents = Buffer.from(encodedContents, 'base64').toString();
  }

  writeFileSync(outputFile, fileContents);
}

export function decodeScript(xml, scriptFile, dir) {
  const scriptName = scriptFile.split('.')[0];
  if (scriptName === 'contentScript') {
    // console.log(xml.contentScript);
  }
  const contents = xml[scriptName];
  if (contents === undefined) return;
  if (contents.__cdata !== undefined) writeScriptToFile(contents, scriptFile, dir);
}

export function decodeScripts(data, widgetDir) {
  const widgetScripts = [
    'contentScript.vm',
    'headerScript.vm',
    'configuration.xml',
    'languageResources.xml',
    'additionalCssScript.css',
    'requiredContext.xml',
  ];

  widgetScripts.forEach((widgetScript) => {
    decodeScript(data, widgetScript, widgetDir);
  });
}

export function createXMLFileFromData(filename, data, outputDir) {
  if (data === undefined) return;
  const fileLocation = [outputDir, filename].join('');
  const xml = convertJsonToXml(data);
  writeFileSync(fileLocation, xml);
}

export function decodeRequiredContext(xml, dir) {
  const context = xml.requiredContext;
  if (context !== undefined) createXMLFileFromData('requiredContext.xml', context, dir);
}

export function decodeFiles(data, widgetDir) {
  const { files } = data;

  try {
    files.file.forEach((file) => writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) writeFileToFile(files.file, widgetDir);
  }
}

export function replaceSlashWithOR(string) {
  return string.replace(/\//g, ' OR ');
}

export function getValueFromLanguageKey(jsonObject, key) {
  const languageResourcesXML = jsonObject.languageResources.__cdata;
  const languageResources = convertXmlToJson(languageResourcesXML);
  const resourceList = languageResources.language.resource;

  const re = /^\$\{resource:(.*)\}$/;
  let result;
  try {
    // eslint-disable-next-line prefer-destructuring
    const keyName = re.exec(key)[1];
    const matchingResource = resourceList.filter((resource) => resource.attr.name === keyName);
    result = matchingResource[0]['#text'];
  } catch (err) {
    result = key;
  }

  return replaceSlashWithOR(result);
}

export default {
  createWidgetOptionsFile,
  writeScriptToFile,
  writeFileToFile,
  decodeScript,
  decodeScripts,
  decodeFiles,
  decodeRequiredContext,
};
