import fs from 'fs';
import functions from './functions';

export default function widgetEncoder(inputFolder) {
  const widgetOptionsFile = [inputFolder, '/widget_options.json'].join('');
  if (!(fs.existsSync(widgetOptionsFile))) return false;

  const widgetName = inputFolder.split('/').pop();

  const widgetOptions = fs.readFileSync(widgetOptionsFile, 'utf8');
  const widgetOptionsJson = JSON.parse(widgetOptions);

  const contentScriptFile = [inputFolder, '/contentScript.vm'].join('');
  const contentScript = functions.getScript(contentScriptFile);
  const headerScriptFile = [inputFolder, '/headerScript.vm'].join('');
  const headerScript = functions.getScript(headerScriptFile);

  const configurationFile = [inputFolder, '/configuration.xml'].join('');
  const configuration = functions.getXML(configurationFile);

  const languageResourcesFile = [inputFolder, '/languageResources.xml'].join('');
  const languageResources = functions.getXML(languageResourcesFile);

  const additionalCssScriptFile = [inputFolder, '/additionalCssScript.css'].join('');
  const additionalCssScript = functions.getScript(additionalCssScriptFile);

  const files = functions.getFiles(inputFolder);

  const jsonObject = {
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

  return jsonObject;
}
