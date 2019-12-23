/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const xmlParser = require('fast-xml-parser');
const jsonParser = require('fast-xml-parser').j2xParser;
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

  const scripts = [
    'contentScript.vm',
    'headerScript.vm',
    'configuration.xml',
    'languageResources.xml',
    'additionalCssScript.css',
  ];

  scripts.forEach(script => {
    const name = script.split('.')[0];
    const contents = jsonObj.scriptedContentFragments.scriptedContentFragment[name];
    writeScriptToFile(contents, script);
    jsonObj.scriptedContentFragments.scriptedContentFragment[name] = `{${script}}`;
  });

  const { files } = jsonObj.scriptedContentFragments.scriptedContentFragment;
  try {
    files.file.forEach(writeFileToFile);
  } catch (e) {
    if (e instanceof TypeError) writeFileToFile(files.file);
  }

  jsonObj.scriptedContentFragments.scriptedContentFragment.files = '{files}';

  // eslint-disable-next-line new-cap
  const parse = new jsonParser(parserOptions.json);
  const parsedXml = parse.parse(jsonObj);

  fs.writeFile('output/WidgetTemplate.xml', parsedXml, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });
});
