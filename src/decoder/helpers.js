/* eslint-disable no-underscore-dangle */
import {
  writeFile,
  readFileSync,
  existsSync,
  mkdirSync,
} from 'fs';
import {
  getTraversalObj,
  convertToJson,
  j2xParser,
} from 'fast-xml-parser';
import {
  xml as xmlOptions,
  json as jsonOptions,
} from '../ParserOptions';

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
  const fileName = file.attr['name'];
  const outputFile = [outputDir, fileName].join('');

  writeFile(outputFile, decodedContents, (err) => {
    if (err) throw err;
  });
}

export function openXmlFile(filename, config) {
  const fileLocation = [config.inputFolder, filename].join('');
  return readFileSync(fileLocation, 'utf8');
}

export function convertXmlToJson(data) {
  const tObj = getTraversalObj(data, xmlOptions);
  const jsonObj = convertToJson(tObj, xmlOptions);
  return jsonObj;
}

export function convertJsonToXml(data) {
  // eslint-disable-next-line new-cap
  const parse = new j2xParser(jsonOptions);
  return parse.parse(data);
}

export function decodeScript(xml, scriptFile, dir) {
  const outputXml = xml;
  const scriptName = scriptFile.split('.')[0];
  const contents = xml.scriptedContentFragments.scriptedContentFragment[scriptName];
  writeScriptToFile(contents, scriptFile, dir);
  outputXml.scriptedContentFragments.scriptedContentFragment[scriptName] = `{${scriptFile}}`;
  return outputXml;
}

export function decodeScripts(data, config, widgetDir) {
  let template = data;

  config.widgetScripts.forEach((widgetScript) => {
    template = decodeScript(data, widgetScript, widgetDir);
  });
  return template;
}

export function decodeFiles(data, config, widgetDir) {
  const template = data;
  const { files } = data.scriptedContentFragments.scriptedContentFragment;

  try {
    files.file.forEach((file) => writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) writeFileToFile(files.file, widgetDir);
  }

  template.scriptedContentFragments.scriptedContentFragment.files = '{files}';
  return template;
}

export function createDirIfNotExists(dir) {
  if (!existsSync(dir)) {
    mkdirSync(dir);
  }
}

export function getExtensionForLanguage(language) {
  switch (language) {
    case 'Velocity':
      return '.vm';
    case 'Unknown':
      return '.txt';
    default:
      return '.txt';
  }
}

export default {
  writeScriptToFile,
  writeFileToFile,
  openXmlFile,
  convertXmlToJson,
  decodeScript,
  decodeScripts,
  decodeFiles,
  createDirIfNotExists,
  getExtensionForLanguage,
};
