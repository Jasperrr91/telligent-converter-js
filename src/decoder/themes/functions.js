import { writeFileSync } from 'fs';
import { createDirIfNotExists, getExtensionForLanguage, convertJsonToXml } from '../helpers';
import { decodeWidget } from '../widgets';
/**
 * Create an options file in the output dir of the theme, containing the attributes of the theme
 * @param {Object} themeJson Object containing the JSON of the theme
 * @param {String} themeDir Output dir
 */
export function createThemeOptionsFile(themeJson, themeDir) {
  const outputFile = [themeDir, '/theme_options.json'].join('');
  const themeAttributes = themeJson.attr;

  writeFileSync(outputFile, JSON.stringify(themeAttributes, null, 2));
}

/**
 * For the given script, create and save it in the scripts subdir in the theme dir
 * @param {String} name Name of the script that needs to be saved
 * @param {Object} json Object that contains the parent with all scripts
 * @param {String} themeDir Output dir
 */
export function createScript(name, json, themeDir) {
  const scriptsDir = [themeDir, '/scripts/'].join('');
  createDirIfNotExists(scriptsDir);

  const scriptExtension = getExtensionForLanguage(json[name].attr.language);
  const scriptFile = [scriptsDir, name, scriptExtension].join('');
  const scriptContents = json[name].__cdata;

  writeFileSync(scriptFile, scriptContents);
}

/**
 * For a given object, take the __cdata key and store it in a given file
 * @param {String} filename Name of the file to be created
 * @param {Object} data Object that contains the file data
 * @param {String} themeDir Output dir
 */
export function createFileFromCData(filename, data, themeDir) {
  if (data === undefined) return;

  const fileLocation = [themeDir, '/', filename].join('');
  writeFileSync(fileLocation, data.__cdata);
}

export function createXMLFileFromData(filename, data, outputDir) {
  if (data === undefined) return;
  const fileLocation = [outputDir, filename].join('');
  const xml = convertJsonToXml(data);
  writeFileSync(fileLocation, xml);
}

/**
 * Takes an object containing a base64 encoded image and stores it
 * @param {Object} data Object containing the encoded image and it's name
 * @param {String} themeDir Output dir
 */
export function createPreviewImage(data, themeDir) {
  if (data === undefined) return;

  const filename = data.attr.name;
  const imageData = data.__cdata;
  const image = Buffer.from(imageData, 'base64');

  const fileLocation = [themeDir, '/', filename].join('');
  writeFileSync(fileLocation, image);
}

// Helper
export function b64Decode(data) {
  return Buffer.from(data, 'base64');
}

/**
 * Takes a single styleFile object and stores it in the styles dir
 * @param {Object} styleFile Object of the stylefile containing the name and contents
 * @param {String} styleDir Output dir
 */
export function createStyleFile(styleFile, styleDir) {
  const filename = styleFile.attr.name;
  const attributes = JSON.stringify(styleFile.attr);
  const content = b64Decode(styleFile.__cdata);
  const styleFileLocation = [styleDir, filename].join('');
  writeFileSync(styleFileLocation, content);

  const attributeFileLocation = [styleFileLocation, '.json'].join('');
  writeFileSync(attributeFileLocation, attributes);
}

/**
 * Creates a dir for the theme's stylefiles and maps over these files a function to create them
 * @param {Object} styleFiles Object containing the stylefiles for the theme
 * @param {String} themeDir Output dir
 */
export function createStyleFiles(styleFiles, themeDir) {
  if (styleFiles === undefined) return;
  const stylesDir = [themeDir, 'styles/'].join('');
  createDirIfNotExists(stylesDir);
  // console.log(styleFiles.file);
  if (Array.isArray(styleFiles.file)) {
    styleFiles.file.forEach((file) => createStyleFile(file, stylesDir));
  } else {
    createStyleFile(styleFiles.file, stylesDir);
  }
}

/**
 * Takes a single javascript file object and stores it in the js dir
 * @param {Object} styleFile Object of the stylefile containing the name and contents
 * @param {String} styleDir Output dir
 */
export function createJSFile(jsFile, jsDir) {
  const filename = jsFile.attr.name;
  const content = b64Decode(jsFile.__cdata);
  const jsFileLocation = [jsDir, filename].join('');
  writeFileSync(jsFileLocation, content);
}

/**
 * Creates a dir for the theme's javascript files and maps over these files a function to create them
 * @param {Object} styleFiles Object containing the stylefiles for the theme
 * @param {String} themeDir Output dir
 */
export function createJSFiles(javascriptFiles, themeDir) {
  if (javascriptFiles === undefined) return;

  const jsDir = [themeDir, 'js/'].join('');
  createDirIfNotExists(jsDir);
  javascriptFiles.file.forEach((file) => createJSFile(file, jsDir));
}

/**
 * Takes a single javascript file object and stores it in the js dir
 * @param {Object} styleFile Object of the stylefile containing the name and contents
 * @param {String} styleDir Output dir
 */
export function createAssetFile(file, assetDir) {
  const filename = file.attr.name;
  const content = b64Decode(file.__cdata);
  const fileLocation = [assetDir, filename].join('');
  writeFileSync(fileLocation, content);
}

/**
 * Creates a dir for the theme's javascript files and maps a unction to create the files
 * @param {Object} styleFiles Object containing the stylefiles for the theme
 * @param {String} themeDir Output dir
 */
export function createAssetFiles(assetFiles, themeDir) {
  if (assetFiles === undefined) return;
  const assetsDir = [themeDir, 'assets/'].join('');
  createDirIfNotExists(assetsDir);
  assetFiles.file.forEach((file) => createAssetFile(file, assetsDir));
}

export function parsePages(pages, themeDir) {
  if (pages === undefined) return;
  const pagesDir = [themeDir, 'pages/'].join('');
  createDirIfNotExists(pagesDir);

  pages.contentFragmentPage.forEach((page) => {
    const fileName = [page.attr.pageName, '.xml'].join('');
    const data = {
      contentFragmentPage: page,
    };
    createXMLFileFromData(fileName, data, pagesDir);
  });
}

export function parseWidgets(widgetFragments, dir) {
  if (widgetFragments === undefined) return;

  const widgetsDir = [dir, 'widgets/'].join('');
  const widgets = widgetFragments.scriptedContentFragments.scriptedContentFragment;

  widgets.forEach((widget) => {
    decodeWidget(widget, widgetsDir);
  });
}

export function createPageLayouts(pageLayouts, themeDir) {
  createXMLFileFromData('header.xml', pageLayouts.headers, themeDir);
  createXMLFileFromData('footer.xml', pageLayouts.footers, themeDir);
  parsePages(pageLayouts.pages, themeDir);
  parseWidgets(pageLayouts.contentFragments, themeDir);
}

export default {
  createThemeOptionsFile,
  createScript,
  createFileFromCData,
  createPreviewImage,
};
