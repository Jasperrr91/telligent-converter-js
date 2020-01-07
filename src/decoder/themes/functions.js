import { writeFileSync } from 'fs';
import { createDirIfNotExists, getExtensionForLanguage } from '../helpers';
/**
 * Create an options file in the output folder of the theme, containing the attributes of the theme
 * @param {Object} themeJson Object containing the JSON of the theme
 * @param {String} themeDir Output folder
 */
export function createThemeOptionsFile(themeJson, themeDir) {
  const outputFile = [themeDir, '/theme_options.json'].join('');
  const themeAttributes = themeJson.attr;

  writeFileSync(outputFile, JSON.stringify(themeAttributes, null, 2));
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

  writeFileSync(scriptFile, scriptContents);
}

export function createFileFromCData(filename, data, themeDir) {
  if (data === undefined) return;

  const fileLocation = [themeDir, '/', filename].join('');
  writeFileSync(fileLocation, data.__cdata);
}

export function createPreviewImage(data, themeDir) {
  if (data === undefined) return;

  const filename = data.attr.name;
  const imageData = data.__cdata;
  const image = Buffer.from(imageData, 'base64');

  const fileLocation = [themeDir, '/', filename].join('');
  writeFileSync(fileLocation, image);
}

export default {
  createThemeOptionsFile,
  createScript,
  createFileFromCData,
  createPreviewImage,
};
