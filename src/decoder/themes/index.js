import {
  createThemeOptionsFile,
  createScript,
  createFileFromCData,
  createPreviewImage,
  createStyleFiles,
  createJSFiles,
  createAssetFiles,
  createXMLFileFromData,
} from './functions';
import { createDirIfNotExists } from '../helpers';

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
  createFileFromCData('configuration.xml', jsonObject.configuration, themeDir);
  createFileFromCData('palette-types.xml', jsonObject.paletteTypes, themeDir);
  createFileFromCData('language-resources.xml', jsonObject.languageResources, themeDir);
  createPreviewImage(jsonObject.previewImage, themeDir);
  createAssetFiles(jsonObject.files, themeDir);
  createJSFiles(jsonObject.javascriptFiles, themeDir);
  createStyleFiles(jsonObject.styleFiles, themeDir);

  //PageLayouts
  //scopedProperties
  createXMLFileFromData('scoped-properties.xml', jsonObject.scopedProperties, themeDir);
}
