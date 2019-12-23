/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const parser = require('fast-xml-parser');
const he = require('he');

const outputDir = './output';
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const options = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', // default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  localeRange: '', // To support non english character in tag/attribute values.
  parseTrueNumberOnly: false,
  arrayMode: false, // "strict"
  attrValueProcessor: (val) => he.decode(val, { isAttributeValue: true }),
  tagValueProcessor: (val) => he.decode(val), // default is a=>a
  stopNodes: ['parse-me-as-string'],
};

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

  const tObj = parser.getTraversalObj(xmlData, options);
  const jsonObj = parser.convertToJson(tObj, options);

  let fragment = jsonObj.scriptedContentFragments.scriptedContentFragment;
  fragment = JSON.stringify(fragment);
  fs.writeFile('./output/test.json', fragment, (err1) => {
    if (err1) throw err1;
  });

  const { contentScript, headerScript, configuration, languageResources, additionalCssScript, files } = jsonObj.scriptedContentFragments.scriptedContentFragment;

  writeScriptToFile(contentScript, 'contentScript.vm');
  writeScriptToFile(headerScript, 'headerScript.vm');
  writeScriptToFile(configuration, 'configuration.xml');
  writeScriptToFile(languageResources, 'languageResources.xml');
  writeScriptToFile(additionalCssScript, 'additionalCssScript.css');

  files.file.forEach(writeFileToFile);

  // jsonObj.scriptedContentFragments.scriptedContentFragment.__cdata = '';

  // const xml = 'empty';
  // fs.writeFile('output/test.xml', xml, (err1) => {
  //   if (err1) throw err1;
  //   console.log('Saved!');
  // });
});
