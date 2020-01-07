/* eslint-disable no-console */
import { writeFile, writeFileSync } from 'fs';
import { createDirIfNotExists, getExtensionForLanguage } from '../helpers';

/**
 * Create an options file in the output folder of the theme, containing the attributes of the theme
 * @param {Object} themeJson Object containing the JSON of the theme
 * @param {String} themeDir Output folder
 */
export function createThemeOptionsFile(themeJson, themeDir) {
  const outputFile = [themeDir, '/theme_options.json'].join('');
  const themeAttributes = themeJson.attr;

  console.log(outputFile);
  writeFileSync(outputFile, JSON.stringify(themeAttributes, null, 2), (err) => {
    if (err) throw err;
  });
}

/**
 * For the given script, create and save it in the scripts subdir in the theme folder
 * @param {String} name Name of the script that needs to be saved
 * @param {Object} json Object that contains the parent with all scripts
 * @param {String} themeDir Output folder
 */
export function createScript(name, json, themeDir) {
  const scriptsDir = [themeDir, '/scripts/'].join('');
  createDirIfNotExists(scriptsDir);

  const scriptExtension = getExtensionForLanguage(json[name].attr.language);
  const scriptFile = [scriptsDir, name, scriptExtension].join('');
  const scriptContents = json[name].__cdata;

  writeFileSync(scriptFile, scriptContents, (err) => {
    if (err) throw err;
  });
}

/**
 * Decode exported Telligent theme files
 * @param {Object} jsonObject Object containing xml of the theme parsed as json
 * @param {Object} config Object containing configuration
 */
export default function themeDecoder(jsonObject, config) {
  // If we are working with a collection of themes, re-run the function with each theme
  if (jsonObject.themes) {
    jsonObject.themes.theme.forEach((theme) => themeDecoder(theme, config));
    return;
  }

  const { outputFolder } = config;
  createDirIfNotExists(outputFolder);

  // Get the description of the theme and use that as the output folder name
  const themeDescription = jsonObject.attr.description;
  const themeDir = [outputFolder, themeDescription, '/'].join('');
  createDirIfNotExists(themeDir);

  // Save theme options
  createThemeOptionsFile(jsonObject, themeDir);

  createScript('headScript', jsonObject, themeDir);
  createScript('bodyScript', jsonObject, themeDir);
  // console.log(jsonObject.headScript);
}
