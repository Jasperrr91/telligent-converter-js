import fs from 'fs';
import {
  getThemeOptions,
  getScript,
  getXMLFile,
  getPreviewImage,
  getEncodedFiles,
  getJSFiles,
  getStyleFiles,
  getPageLayouts,
} from './functions';

export function encodeTheme(themeFolder) {
  // Initialize paths to files
  const headScriptFile = [themeFolder, '/scripts/headScript.vm'].join('');
  const bodyScriptFile = [themeFolder, '/scripts/bodyScript.vm'].join('');
  const configurationFile = [themeFolder, '/configuration.xml'].join('');
  const paletteTypesFile = [themeFolder, '/palette-types.xml'].join('');
  const languageResourcesFile = [themeFolder, '/language-resources.xml'].join('');

  // Read and encode each element of the theme
  const headScript = getScript(headScriptFile);
  const bodyScript = getScript(bodyScriptFile);
  const configuration = getXMLFile(configurationFile);
  const paletteTypes = getXMLFile(paletteTypesFile);
  const languageResources = getXMLFile(languageResourcesFile);
  const previewImage = getPreviewImage(themeFolder);
  const files = getEncodedFiles(themeFolder);
  const javascriptFiles = getJSFiles(themeFolder);
  const styleFiles = getStyleFiles(themeFolder);
  const pageLayouts = getPageLayouts(themeFolder);

  // Read the theme options which contains the attributes for the theme tag
  const themeOptions = getThemeOptions(themeFolder);
  const theme = {
    attr: themeOptions,
  };

  // For each theme element, check of it exists and if so; add it to the theme object
  if (headScript) theme.headScript = headScript;
  if (bodyScript) theme.bodyScript = bodyScript;
  if (configuration) theme.configuration = configuration;
  if (paletteTypes) theme.paletteTypes = paletteTypes;
  if (languageResources) theme.languageResources = languageResources;
  if (previewImage) theme.previewImage = previewImage;
  if (files) theme.files = files;
  if (javascriptFiles) theme.javascriptFiles = javascriptFiles;
  if (styleFiles) theme.styleFiles = styleFiles;
  if (pageLayouts) theme.pageLayouts = pageLayouts;
  if (headScript) theme.headScript = headScript;

  return {
    theme,
  };
}

/**
 * Encodes either a dir containing a single theme into a single object
 * or a dir containing multiple dirs with themes, into a single object
 * @param {String} themeDir the dir containing the theme, or the themefolders if multiple
 */
export default function themeEncoder(themeDir) {
  // Check if folder only contains one theme, then encode and return it
  const themeOptionsFile = [themeDir, '/theme_options.json'].join('');
  if (fs.existsSync(themeOptionsFile)) {
    return encodeTheme(themeDir);
  }

  // Folder contains multiple themes, encode them into a single object
  const themes = [];
  const subDirectories = fs.readdirSync(themeDir);

  // Make sure each folder indeed contains a theme, before encoding and adding it to the object
  subDirectories.forEach((subDir) => {
    const pathToSubDir = [themeDir, subDir].join('');
    const themeOptionsFile2 = [pathToSubDir, '/theme_options.json'].join('');
    if (fs.existsSync(themeOptionsFile2)) {
      themes.push(encodeTheme(pathToSubDir));
    }
  });

  return {
    themes,
  };
}
