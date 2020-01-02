const fs = require('fs');
const jsonParser = require('fast-xml-parser').j2xParser;
const parserOptions = require('../ParserOptions');
const helpers = require('./helpers');

const decodeXml = (xmlObject, name, config) => {
  const { outputFolder } = config;
  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder);
  }

  const widgetName = name.split('.')[0];
  const widgetDir = [outputFolder, widgetName, '/'].join('');
  if (!fs.existsSync(widgetDir)) {
    fs.mkdirSync(widgetDir);
  }

  let xml = xmlObject;
  const { widgetScripts } = config;

  widgetScripts.forEach((widgetScript) => {
    xml = helpers.decodeScript(xml, widgetScript, widgetDir);
  });

  const { files } = xmlObject.scriptedContentFragments.scriptedContentFragment;
  try {
    files.file.forEach((file) => helpers.writeFileToFile(file, widgetDir));
  } catch (e) {
    if (e instanceof TypeError) helpers.writeFileToFile(files.file, widgetDir);
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

module.exports = { decodeXml };
