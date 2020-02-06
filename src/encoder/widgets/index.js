import fs from 'fs';
import {
  getXMLFile,
  getAssetFiles,
  getRequiredContext,
} from './functions';
import {
  getVelocityScript,
} from '../helpers';

/**
 * Transforms a directory containing a widget and it's files, into a single XML file
 * @param {String} widgetDir the path to a dir containing a widget
 */
export default function widgetEncoder(widgetDir) {
  // Validate that specified folder contains a telligent widget
  const widgetOptionsFile = [widgetDir, '/widget_options.json'].join('');
  if (!(fs.existsSync(widgetOptionsFile))) return undefined;

  // Initialize paths to files
  const contentScriptFile = [widgetDir, '/contentScript.vm'].join('');
  const headerScriptFile = [widgetDir, '/headerScript.vm'].join('');
  const configurationFile = [widgetDir, '/configuration.xml'].join('');
  const languageResourcesFile = [widgetDir, '/languageResources.xml'].join('');
  const additionalCssScriptFile = [widgetDir, '/additionalCssScript.css'].join('');
  const requiredContextFile = [widgetDir, '/requiredContext.xml'].join('');

  // Read and encode each element of the widget
  const contentScript = getVelocityScript(contentScriptFile);
  const headerScript = getVelocityScript(headerScriptFile);
  const configuration = getXMLFile(configurationFile);
  const languageResources = getXMLFile(languageResourcesFile);
  const additionalCssScript = getVelocityScript(additionalCssScriptFile);
  const requiredContext = getRequiredContext(requiredContextFile);
  const files = getAssetFiles(widgetDir);

  // Read the widget options which contains the attributes for the widget tag
  const widgetOptions = fs.readFileSync(widgetOptionsFile, 'utf8');
  const widgetOptionsJson = JSON.parse(widgetOptions);
  const scriptedContentFragment = {
    attr: widgetOptionsJson,
  };

  // For each widget element, check of it exists and if so; add it to the widget object
  scriptedContentFragment.contentScript = contentScript;
  scriptedContentFragment.headerScript = headerScript;
  if (configuration) scriptedContentFragment.configuration = configuration;
  if (languageResources) scriptedContentFragment.languageResources = languageResources;
  scriptedContentFragment.additionalCssScript = additionalCssScript;
  if (requiredContext) scriptedContentFragment.requiredContext = requiredContext;
  scriptedContentFragment.files = files;

  return {
    scriptedContentFragments: {
      scriptedContentFragment,
    },
  };
}
