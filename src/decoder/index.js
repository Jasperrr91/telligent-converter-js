const fs = require('fs');
const helpers = require('./helpers');

const decodeWidget = (filename, config) => {
  const xmlObject = helpers.openXmlFile(filename, config);
  const jsonObject = helpers.convertXmlToJson(xmlObject);

  const { outputFolder } = config;
  const widgetName = filename.split('.')[0];
  const widgetDir = [outputFolder, widgetName, '/'].join('');
  helpers.createDirIfNotExists(outputFolder);
  helpers.createDirIfNotExists(widgetDir);

  let jsonTemplate = jsonObject;
  jsonTemplate = helpers.decodeScripts(jsonTemplate, config, widgetDir);
  jsonTemplate = helpers.decodeFiles(jsonTemplate, config, widgetDir);

  const xmlTemplate = helpers.convertJsonToXml(jsonTemplate);
  const templateFilename = [widgetDir, 'WidgetTemplate.xml'].join('');

  fs.writeFile(templateFilename, xmlTemplate, (err) => {
    if (err) throw err;
  });
};

module.exports = { decodeWidget };
