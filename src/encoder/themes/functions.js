import fs from 'fs';
import { convertXmlToJson } from '../../decoder/helpers';
import { widgetEncoder } from '../index';

/**
 * Reads the options/attributes of the theme and returns them as an object
 * @param {String} themeOptionsFile path to the file containing the theme options
 */
export function getThemeOptions(themeOptionsFile) {
  const rawthemeOptions = fs.readFileSync(themeOptionsFile);
  const themeOptions = JSON.parse(rawthemeOptions);
  return themeOptions;
}

export function wrapCdata(cdata) {
  return {
    __cdata: cdata,
  };
}

export function getThemeFile(inputFile) {
  const scriptContents = fs.readFileSync(inputFile, 'utf8');
  return wrapCdata(scriptContents);
}

export function getScript(inputFile) {
  if (!fs.existsSync(inputFile)) return false;
  const script = getThemeFile(inputFile);
  script.attr = {
    language: 'Velocity',
  };
  return script;
}

/**
 * Reads the given XML file and returns it in an object with  __cdata tags
 * @param {String} inputFile path to the file to be read
 */
export function getXMLFile(inputFile) {
  if (!fs.existsSync(inputFile)) return false;

  return getThemeFile(inputFile);
}

export function readPreviewImage(inputFile) {
  const image = fs.readFileSync(inputFile);
  const encodedImage = image.toString('base64');
  return encodedImage;
}

export function getPreviewImage(themeDir) {
  let image;
  let imageFile;
  fs.readdirSync(themeDir).forEach((file) => {
    const fileLocation = [themeDir, '/', file].join('');
    if (fs.lstatSync(fileLocation).isFile()) {
      const [, extension] = file.split('.');
      if (extension === 'png') {
        const imageFileLoc = [themeDir, '/', file].join('');
        image = readPreviewImage(imageFileLoc);
        imageFile = file;
      }
    }
  });

  return {
    attr: {
      name: imageFile,
    },
    __cdata: image,
  };
}

export function getEncodedFile(inputFile, filename) {
  const fileContents = fs.readFileSync(inputFile);
  const encodedFileContents = fileContents.toString('base64');
  return {
    attr: {
      name: filename,
    },
    __cdata: encodedFileContents,
  };
}

/**
 * Reads all assets in given directory and return them as an object
 * @param {String} assetsDir The dir containing the assets
 */
export function getAssets(assetsDir) {
  if (!fs.existsSync(assetsDir)) return false;

  const assets = [];
  fs.readdirSync(assetsDir).forEach((file) => {
    const fileLocation = [assetsDir, file].join('');
    assets.push(getEncodedFile(fileLocation, file));
  });

  return {
    file: assets,
  };
}

/**
 * Reads all js files in given directory and return them as an object
 * @param {String} scriptsDir The dir containing the js files
 */
export function getJSFiles(scriptsDir) {
  if (!fs.existsSync(scriptsDir)) return false;

  const files = [];

  // Loop over each file, encode them and add them to the files array
  fs.readdirSync(scriptsDir).forEach((file) => {
    const fileLocation = [scriptsDir, file].join('');
    const encodedFile = getEncodedFile(fileLocation, file);
    files.push(encodedFile);
  });

  return {
    file: files,
  };
}

export function getStyleFileAttributes(styleFileLocation) {
  const attributesFile = [styleFileLocation, '.json'].join('');
  const rawAttributes = fs.readFileSync(attributesFile);
  return JSON.parse(rawAttributes);
}

/**
 * Reads all style files in given directory and return them as an object
 * @param {String} stylesDir The dir containing the style files
 */
export function getStyleFiles(stylesDir) {
  if (!fs.existsSync(stylesDir)) return false;

  const styles = [];
  fs.readdirSync(stylesDir).forEach((file) => {
    const extension = file.split('.').pop();
    if (extension !== 'json') {
      // Encode each file and add it to the styles array
      const fileLocation = [stylesDir, file].join('');
      const fileObject = getEncodedFile(fileLocation, file);
      fileObject.attr = getStyleFileAttributes(fileLocation);
      styles.push(fileObject);
    }
  });

  return styles;
}

export function getPageFile(inputDir, filename) {
  const fileLocation = [inputDir, '/', filename].join('');
  if (!fs.existsSync(fileLocation)) return false;

  const fileContents = fs.readFileSync(fileLocation, 'utf8');
  const file = convertXmlToJson(fileContents);
  return file;
}

/**
 * Reads all page files in given directory and return them as an object
 * @param {String} pagesDir The dir containing the page files
 */
export function getPages(pagesDir) {
  if (!fs.existsSync(pagesDir)) return false;

  const pages = [];
  fs.readdirSync(pagesDir).forEach((page) => {
    const pageLocation = [pagesDir, page].join('');
    const pageContents = fs.readFileSync(pageLocation, 'utf8');
    const pageJson = convertXmlToJson(pageContents);
    pages.push(pageJson.contentFragmentPage);
  });

  return {
    contentFragmentPage: pages,
  };
}

export function getWidgets(themeDir) {
  const widgetsDir = [themeDir, '/widgets/'].join('');
  if (!fs.existsSync(widgetsDir)) return false;

  const widgets = [];
  fs.readdirSync(widgetsDir).forEach((widget) => {
    const widgetsDir = [widgetsDir, widget].join('');
    widgets.push(widgetEncoder(widgetsDir));
  });

  return {
    contentFragment: widgets,
  };
}

export function getPageLayouts(inputDir) {
  const pageLayouts = {};
  pageLayouts.headers = getPageFile(inputDir, 'header.xml');
  pageLayouts.footers = getPageFile(inputDir, 'footer.xml');
  pageLayouts.pages = getPages(inputDir);
  pageLayouts.contentFragments = getWidgets(inputDir);
  return pageLayouts;
}

export default {
  getThemeOptions,
  getScript,
  getXMLFile,
  getPreviewImage,
  getAssets,
  getJSFiles,
  getStyleFiles,
  getPageLayouts,
};
