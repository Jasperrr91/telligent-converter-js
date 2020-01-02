/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
const fs = require('fs');
const jsonParser = require('fast-xml-parser').j2xParser;
const parserOptions = require('./ParserOptions');
const config = require('../config.json');
const decoder = require('./helpers/decode');

const { outputFolder } = config;
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

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
    xml = decoder.decodeScript(xml, widgetScript, widgetDir);
  });

  const { files } = xmlObject.scriptedContentFragments.scriptedContentFragment;
  try {
    files.file.forEach((file) => decoder.writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) decoder.writeFileToFile(files.file, widgetDir);
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
    const xmlData = decoder.parseXmlFile(file);
    decodeXml(xmlData, file);
  });
});
