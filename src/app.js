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

// Helper Functions
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

const decodeScript = (xml, scriptFile, dir) => {
  const outputXml = xml;
  const scriptName = scriptFile.split('.')[0];
  const contents = xml.scriptedContentFragments.scriptedContentFragment[scriptName];
  writeScriptToFile(contents, scriptFile, dir);
  outputXml.scriptedContentFragments.scriptedContentFragment[scriptName] = `{${scriptFile}}`;
  return outputXml;
};

// XML Decoder
const decodeXml = (xmlObject, name) => {
  const widgetName = name.split('.')[0];
  const widgetDir = [outputFolder, widgetName, '/'].join('');
  if (!fs.existsSync(widgetDir)) {
    fs.mkdirSync(widgetDir);
  }

  let xml = xmlObject;
  const { widgetScripts } = config;

  widgetScripts.forEach((widgetScript) => {
    xml = decodeScript(xml, widgetScript, widgetDir);
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

  fs.writeFile(templateFile, parsedXml, (err) => {
    if (err) throw err;
  });
};

// Decode each widget
const { inputFolder } = config;
fs.readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const xmlData = parseXmlFile(file);
    decodeXml(xmlData, file);
  });
});
