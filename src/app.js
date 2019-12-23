/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */

const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const jsonParser = require('fast-xml-parser').j2xParser;
const he = require('he');
// const Parser = require('fast-xml-parser').j2xParser;
const parserOptions = require('./ParserOptions');


const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const writeScriptToFile = (xml, fileName) => {
  const fileContents = xml.__cdata;
  const outputFile = [outputDir, '/', fileName].join('');

  fs.writeFile(outputFile, fileContents, (err1) => {
    if (err1) throw err1;
  });
};

const writeFileToFile = (file) => {
  const encodedContents = file['#text'];
  const decodedContents = Buffer.from(encodedContents, 'base64').toString();
  const fileName = file.attr['@_name'];
  const outputFile = [outputDir, '/', fileName].join('');

  fs.writeFile(outputFile, decodedContents, (err1) => {
    if (err1) throw err1;
  });
};

fs.readFile('./input/AchievementList-Widget.xml', 'utf8', (err, data) => {
  const xmlData = data;

  const tObj = xmlParser.getTraversalObj(xmlData, parserOptions.xml);
  const jsonObj = xmlParser.convertToJson(tObj, parserOptions.xml);

  let fragment = jsonObj.scriptedContentFragments.scriptedContentFragment;
  fragment = JSON.stringify(fragment);
  fs.writeFile('./output/test.json', fragment, (err1) => {
    if (err1) throw err1;
  });

  const {
    contentScript, headerScript, configuration, languageResources, additionalCssScript, files,
  } = jsonObj.scriptedContentFragments.scriptedContentFragment;

  writeScriptToFile(contentScript, 'contentScript.vm');
  writeScriptToFile(headerScript, 'headerScript.vm');
  writeScriptToFile(configuration, 'configuration.xml');
  writeScriptToFile(languageResources, 'languageResources.xml');
  writeScriptToFile(additionalCssScript, 'additionalCssScript.css');

  files.file.forEach(writeFileToFile);

  // jsonObj.scriptedContentFragments.scriptedContentFragment.__cdata = '';
  // eslint-disable-next-line new-cap
  const parse = new jsonParser(parserOptions);
  const parsedXml = parse.parse(jsonObj);

  fs.writeFile('output/WidgetTemplate.xml', parsedXml, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });
});
