/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const parser = require('fast-xml-parser');
const he = require('he');

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

fs.readFile('./input/AchievementList-Widget.xml', 'utf8', (err, data) => {
  const xmlData = data;

  const dir = './output';

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

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

  const contentScriptContents = contentScript.__cdata;
  outputFile = [dir, '/contentScript.vm'].join('');
  fs.writeFile(outputFile, contentScriptContents, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });

  const headerScriptContents = headerScript.__cdata;
  outputFile = [dir, '/headerScript.vm'].join('');
  fs.writeFile(outputFile, headerScriptContents, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });

  const configurationContents = configuration.__cdata;
  outputFile = [dir, '/configuration.vm'].join('');
  fs.writeFile(outputFile, configurationContents, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });

  const languageResourcesContents = languageResources.__cdata;
  outputFile = [dir, '/languageResources.vm'].join('');
  fs.writeFile(outputFile, languageResourcesContents, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });

  const additionalCssScriptContents = additionalCssScript.__cdata;
  outputFile = [dir, '/additionalCssScript.vm'].join('');
  fs.writeFile(outputFile, additionalCssScriptContents, (err1) => {
    if (err1) throw err1;
    console.log('Saved!');
  });

  // console.log(files.file);

  files.file.forEach((f) => {
    const fileName = f.attr['@_name'];
    outputFile = [dir, '/', fileName].join('');
    // console.log(f['#text']);
    // const fileContents = atob(f['#text']);
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
