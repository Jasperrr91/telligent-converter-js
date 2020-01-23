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

export default function themeEncoder(inputFolder) {
  // Some Theme XML files consist of a single theme
  // Some consist of multiple themes
  const themes = [];

  fs.readdir(inputFolder, (err, folders) => {
    if (err) throw err;
    folders.forEach((folder) => {
      const themeOptions = [inputFolder, folder, '/theme_options.json'].join('');
      if (fs.existsSync(themeOptions)) {
        const themeFolder = [inputFolder, folder].join('');
        themes.push(encodeTheme(themeFolder));
      }
    });
  });

  const themesObject = {
    themes,
  };

  return themesObject;
}
