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
  const headScriptFile = [themeFolder, '/scripts/headScript.vm'].join('');
  const bodyScriptFile = [themeFolder, '/scripts/bodyScript.vm'].join('');
  const configurationFile = [themeFolder, '/configuration.xml'].join('');
  const paletteTypesFile = [themeFolder, '/palette-types.xml'].join('');
  const languageResourcesFile = [themeFolder, '/language-resources.xml'].join('');

  const themeOptions = getThemeOptions(themeFolder);
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

  return {
    theme: {
      attr: themeOptions,
      headScript,
      bodyScript,
      configuration,
      paletteTypes,
      languageResources,
      previewImage,
      files,
      javascriptFiles,
      styleFiles,
      pageLayouts,
    },
  };
}

/**
 * Either encodes a dir containing a theme into a XML file or encodes a dir containing
 * multiple dirs with a theme into a XML file
 * @param {String} themeDir the dir containing the theme, or the themefolders if multiple
 */
export default function themeEncoder(themeDir) {
  // Some Theme XML files consist of a single theme
  // Some consist of multiple themes
  const themeOptionsFile = [themeDir, '/theme_options.json'].join('');
  if (fs.existsSync(themeOptionsFile)) {
    return encodeTheme(themeDir);
  }

  const themes = [];
  const subDirectories = fs.readdirSync(themeDir);

  subDirectories.forEach((subDir) => {
    const pathToSubDir = [themeDir, subDir].join('');
    const themeOptionsFile = [pathToSubDir, '/theme_options.json'].join('');
    if (fs.existsSync(themeOptionsFile)) {
      themes.push(encodeTheme(pathToSubDir));
    }
  })

  return {
    themes,
  };
}
