/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const jsonParser = require('fast-xml-parser').j2xParser;
const parserOptions = require('./ParserOptions');
const config = require('../config.json');

const { outputFolder } = config;
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

const writeScriptToFile = (xml, fileName, outputDir) => {
  if (xml === undefined) return;
  const fileContents = xml.__cdata;
  const outputFile = [outputDir, '/', fileName].join('');

  fs.writeFile(outputFile, fileContents, (err1) => {
    if (err1) throw err1;
  });
};

const writeFileToFile = (file, outputDir) => {
  const encodedContents = file['#text'];
  const decodedContents = Buffer.from(encodedContents, 'base64').toString();
  const fileName = file.attr['@_name'];
  const outputFile = [outputDir, fileName].join('');

  fs.writeFile(outputFile, decodedContents, (err1) => {
    if (err1) throw err1;
  });
};

const parseXmlFile = (fileName) => {
  const fileLocation = ['./input/', fileName].join('');
  const data = fs.readFileSync(fileLocation, 'utf8');
  const tObj = xmlParser.getTraversalObj(data, parserOptions.xml);
  const jsonObj = xmlParser.convertToJson(tObj, parserOptions.xml);
  return jsonObj;
};

const decodeXml = (xmlObject, name) => {
  const widgetName = name.split('.')[0];
  const widgetDir = [outputFolder, widgetName, '/'].join('');
  if (!fs.existsSync(widgetDir)) {
    fs.mkdirSync(widgetDir);
  }

  const xml = xmlObject;
  const fragment = JSON.stringify(xmlObject.scriptedContentFragments.scriptedContentFragment);
  fs.writeFile('./output/test.json', fragment, (err1) => {
    if (err1) throw err1;
  });

  const scripts = [
    'contentScript.vm',
    'headerScript.vm',
    'configuration.xml',
    'languageResources.xml',
    'additionalCssScript.css',
  ];

  scripts.forEach((script) => {
    const scriptName = script.split('.')[0];
    const contents = xmlObject.scriptedContentFragments.scriptedContentFragment[scriptName];
    writeScriptToFile(contents, script, widgetDir);
    xml.scriptedContentFragments.scriptedContentFragment[scriptName] = `{${script}}`;
  });

  const { files } = xmlObject.scriptedContentFragments.scriptedContentFragment;
  try {
    files.file.forEach((file) => writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) writeFileToFile(files.file, widgetDir);
  }

  xml.scriptedContentFragments.scriptedContentFragment.files = '{files}';

  // eslint-disable-next-line new-cap
  const parse = new jsonParser(parserOptions.json);
  const parsedXml = parse.parse(xmlObject);

  const templateFile = [widgetDir, 'WidgetTemplate.xml'].join('');

  fs.writeFile(templateFile, parsedXml, (err1) => {
    if (err1) throw err1;
  });
};

const { inputFolder } = config;

fs.readdir(inputFolder, (err, files) => {
  files.forEach((file) => {
    const xmlData = parseXmlFile(file);
    decodeXml(xmlData, file);
  });
});
