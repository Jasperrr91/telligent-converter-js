/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const jsonParser = require('fast-xml-parser').j2xParser;
const parserOptions = require('../ParserOptions');

const writeScriptToFile = (xml, fileName, outputDir) => {
  if (xml === undefined) return;
  const fileContents = xml.__cdata;
  const outputFile = [outputDir, '/', fileName].join('');

  fs.writeFile(outputFile, fileContents, (err) => {
    if (err) throw err;
  });
};

const writeFileToFile = (file, outputDir) => {
  const encodedContents = file['#text'];
  const decodedContents = Buffer.from(encodedContents, 'base64').toString();
  const fileName = file.attr['@_name'];
  const outputFile = [outputDir, fileName].join('');

  fs.writeFile(outputFile, decodedContents, (err) => {
    if (err) throw err;
  });
};

const openXmlFile = (filename, config) => {
  const { inputFolder } = config;
  const fileLocation = [inputFolder, filename].join('');
  return fs.readFileSync(fileLocation, 'utf8');
};

const convertXmlToJson = (data) => {
  const tObj = xmlParser.getTraversalObj(data, parserOptions.xml);
  const jsonObj = xmlParser.convertToJson(tObj, parserOptions.xml);
  return jsonObj;
};

const convertJsonToXml = (data) => {
  // eslint-disable-next-line new-cap
  const parse = new jsonParser(parserOptions.json);
  return parse.parse(data);
};

const decodeScript = (xml, scriptFile, dir) => {
  const outputXml = xml;
  const scriptName = scriptFile.split('.')[0];
  const contents = xml.scriptedContentFragments.scriptedContentFragment[scriptName];
  writeScriptToFile(contents, scriptFile, dir);
  outputXml.scriptedContentFragments.scriptedContentFragment[scriptName] = `{${scriptFile}}`;
  return outputXml;
};

const decodeScripts = (data, config, widgetDir) => {
  const { widgetScripts } = config;
  let template = data;

  widgetScripts.forEach((widgetScript) => {
    template = decodeScript(data, widgetScript, widgetDir);
  });
  return template;
};

const decodeFiles = (data, config, widgetDir) => {
  const template = data;
  const { files } = data.scriptedContentFragments.scriptedContentFragment;

  try {
    files.file.forEach((file) => writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) writeFileToFile(files.file, widgetDir);
  }

  template.scriptedContentFragments.scriptedContentFragment.files = '{files}';
  return template;
};

const createDirIfNotExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
};

module.exports = {
  writeFileToFile,
  openXmlFile,
  convertXmlToJson,
  convertJsonToXml,
  decodeScript,
  decodeScripts,
  createDirIfNotExists,
  decodeFiles,
};
