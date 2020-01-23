/* eslint-disable import/no-named-as-default-member */
// import { readdir } from 'fs';
import fs from 'fs';
import functions from './functions';
import { createXMLFileFromData } from '../../decoder/themes/functions';
import { createDirIfNotExists } from '../../decoder/helpers';

export function encodeTheme(themeFolder) {
  // const themeOptionsFile = [inputFolder, '/theme_options.json'].join('');
  // const rawthemeOptions = fs.readFileSync(themeOptionsFile);
  // const themeOptions = JSON.parse(rawthemeOptions);
  // console.log(themeOptions);

  const themeOptions = functions.getThemeOptions(themeFolder);

  const headScriptFile = [themeFolder, '/scripts/headScript.vm'].join('');
  const headScript = functions.getScript(headScriptFile);

  const bodyScriptFile = [themeFolder, '/scripts/bodyScript.vm'].join('');
  const bodyScript = functions.getScript(bodyScriptFile);

  const configurationFile = [themeFolder, '/configuration.xml'].join('');
  const configuration = functions.getXMLFile(configurationFile);

  const paletteTypesFile = [themeFolder, '/palette-types.xml'].join('');
  const paletteTypes = functions.getXMLFile(paletteTypesFile);

  const languageResourcesFile = [themeFolder, '/language-resources.xml'].join('');
  const languageResources = functions.getXMLFile(languageResourcesFile);

  const previewImage = functions.getPreviewImage(themeFolder);

  const files = functions.getEncodedFiles(themeFolder);

  const javascriptFiles = functions.getJSFiles(themeFolder);

  const styleFiles = functions.getStyleFiles(themeFolder);

  const pageLayouts = functions.getPageLayouts(themeFolder);
  // console.log(styleFiles);

  const jsonObject = {
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

  createDirIfNotExists('./encoded');
  createXMLFileFromData('theme.xml', jsonObject, './encoded/');
}

export default function themeEncoder(inputFolder) {
  // <themes>
  // const template = {
  //   themes: [],
  // };

  // Loop through folders
  // Look for theme options
  // Get name from theme options
  // New <theme>
  fs.readdir(inputFolder, (err, folders) => {
    if (err) throw err;
    folders.forEach((folder) => {
      const themeOptions = [inputFolder, folder, '/theme_options.json'].join('');
      if (fs.existsSync(themeOptions)) {
        const themeFolder = [inputFolder, folder].join('');
        encodeTheme(themeFolder);
      }
    });
  });
}
