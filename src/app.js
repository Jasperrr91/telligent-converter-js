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

const writeXmlToFile = (xml, fileName) => {
  const fileContents = xml.__cdata;
  const outputFile = [outputDir, '/contentScript.vm'].join('');
  fs.writeFile(outputFile, fileContents, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });
};

fs.readFile('./input/AchievementList-Widget.xml', 'utf8', (err, data) => {
  const xmlData = data;

  // Intermediate obj
  const tObj = parser.getTraversalObj(xmlData, options);
  const jsonObj = parser.convertToJson(tObj, options);

  let fragment = jsonObj.scriptedContentFragments.scriptedContentFragment;
  fragment = JSON.stringify(fragment);
  // console.log(fragment);
  // console.log(jsonObj)
  fs.writeFile('./output/test.json', fragment, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });

  const { contentScript, headerScript, configuration, languageResources, additionalCssScript, files } = jsonObj.scriptedContentFragments.scriptedContentFragment;

  let outputFile = '';

  writeXmlToFile(contentScript, 'contentScript.vm');
  writeXmlToFile(headerScript, 'headerScript.vm');
  writeXmlToFile(configuration, 'configuration.xml');
  writeXmlToFile(languageResources, 'languageResources.xml');
  writeXmlToFile(additionalCssScript, 'additionalCssScript.css');

  files.file.forEach((f) => {
    const fileName = f.attr['@_name'];
    outputFile = [outputDir, '/', fileName].join('');
    const encodedText = f['#text'];
    const fileContents = Buffer.from(encodedText, 'base64').toString();

    fs.writeFile(outputFile, fileContents, (err1) => {
      if (err1) throw err1;
      console.log('Saved!');
    });
  });

  // jsonObj.scriptedContentFragments.scriptedContentFragment.__cdata = '';

  // const xml = 'empty';
  // fs.writeFile('output/test.xml', xml, (err1) => {
  //   if (err1) throw err1;
  //   console.log('Saved!');
  // });
});
