/* eslint-disable no-underscore-dangle */
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const parserOptions = require('./../ParserOptions');

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

module.exports = { writeFileToFile, parseXmlFile, decodeScript };
