/* eslint-disable no-underscore-dangle */
import {
  writeFile,
} from 'fs';

export function writeScriptToFile(xml, fileName, outputDir) {
  if (xml === undefined) return;
  const fileContents = xml.__cdata;
  const outputFile = [outputDir, '/', fileName].join('');

  writeFile(outputFile, fileContents, (err) => {
    if (err) throw err;
  });
}

export function writeFileToFile(file, outputDir) {
  const encodedContents = file['#text'];
  const decodedContents = Buffer.from(encodedContents, 'base64').toString();
  const fileName = file.attr.name;
  const outputFile = [outputDir, fileName].join('');

  writeFile(outputFile, decodedContents, (err) => {
    if (err) throw err;
  });
}

export function decodeScript(xml, scriptFile, dir) {
  const outputXml = xml;
  const scriptName = scriptFile.split('.')[0];
  const contents = xml[scriptName];
  writeScriptToFile(contents, scriptFile, dir);
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

export default {
  writeScriptToFile,
  writeFileToFile,
  decodeScript,
  decodeScripts,
  decodeFiles,
};
