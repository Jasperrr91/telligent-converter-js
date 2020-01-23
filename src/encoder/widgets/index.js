import fs from 'fs';
import {
  getVelocityScript,
  getXMLFile,
  getAssetFiles,
} from './functions';

export default function widgetEncoder(inputFolder) {
  // Validate that specified folder contains a telligent widget
  const widgetOptionsFile = [inputFolder, '/widget_options.json'].join('');
  if (!(fs.existsSync(widgetOptionsFile))) return undefined;

  const widgetOptions = fs.readFileSync(widgetOptionsFile, 'utf8');
  const widgetOptionsJson = JSON.parse(widgetOptions);

  const contentScriptFile = [inputFolder, '/contentScript.vm'].join('');
  const headerScriptFile = [inputFolder, '/headerScript.vm'].join('');
  const configurationFile = [inputFolder, '/configuration.xml'].join('');
  const languageResourcesFile = [inputFolder, '/languageResources.xml'].join('');
  const additionalCssScriptFile = [inputFolder, '/additionalCssScript.css'].join('');

  const contentScript = getVelocityScript(contentScriptFile);
  const headerScript = getVelocityScript(headerScriptFile);
  const configuration = getXMLFile(configurationFile);
  const languageResources = getXMLFile(languageResourcesFile);
  const additionalCssScript = getVelocityScript(additionalCssScriptFile);
  const files = getAssetFiles(inputFolder);

  return {
    scriptedContentFragments: {
      scriptedContentFragment: {
        attr: widgetOptionsJson,
        contentScript,
        headerScript,
        configuration,
        languageResources,
        additionalCssScript,
        files,
      },
    },
  };
}
