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

export function getPreviewImage(inputFolder) {
  let image;
  let imageFile;
  fs.readdirSync(inputFolder).forEach((file) => {
    const fileLocation = [inputFolder, '/', file].join('');
    if (fs.lstatSync(fileLocation).isFile()) {
      const [, extension] = file.split('.');
      if (extension === 'png') {
        const imageFileLoc = [inputFolder, '/', file].join('');
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

export function getEncodedFiles(inputFolder) {
  const assetsFolder = [inputFolder, '/assets/'].join('');
  if (!fs.existsSync(assetsFolder)) return false;

  const files = [];
  fs.readdirSync(assetsFolder).forEach((file) => {
    const fileLocation = [assetsFolder, file].join('');
    files.push(getEncodedFile(fileLocation, file));
  });

  return {
    file: files,
  };
}

export function getJSFiles(inputDir) {
  // Validate that the scripts folder exists
  const scriptsFolder = [inputDir, '/js/'].join('');
  if (!fs.existsSync(scriptsFolder)) return false;

  const files = [];

  // Loop over each file, encode them and add them to the files array
  fs.readdirSync(scriptsFolder).forEach((file) => {
    const fileLocation = [scriptsFolder, file].join('');
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

export function getStyleFiles(inputFolder) {
  const stylesFolder = [inputFolder, '/styles/'].join('');
  if (!fs.existsSync(stylesFolder)) return false;

  const files = [];
  fs.readdirSync(stylesFolder).forEach((file) => {
    const extension = file.split('.').pop();
    if (extension !== 'json') {
      const fileLocation = [stylesFolder, file].join('');
      const fileObject = getEncodedFile(fileLocation, file);
      fileObject.attr = getStyleFileAttributes(fileLocation);
      files.push(fileObject);
    }
  });

  return files;
}

export function getPageFile(inputDir, filename) {
  const fileLocation = [inputDir, '/', filename].join('');
  if (!fs.existsSync(fileLocation)) return false;

  const fileContents = fs.readFileSync(fileLocation, 'utf8');
  const file = convertXmlToJson(fileContents);
  return file;
}

export function getPages(inputFolder) {
  const pagesFolder = [inputFolder, '/pages/'].join('');
  if (!fs.existsSync(pagesFolder)) return false;

  const pages = [];
  fs.readdirSync(pagesFolder).forEach((page) => {
    const pageLocation = [pagesFolder, page].join('');
    const pageContents = fs.readFileSync(pageLocation, 'utf8');
    const pageJson = convertXmlToJson(pageContents);
    pages.push(pageJson.contentFragmentPage);
  });

  return {
    contentFragmentPage: pages,
  };
}

export function getWidgets(inputFolder) {
  const widgetsFolder = [inputFolder, '/widgets/'].join('');
  if (!fs.existsSync(widgetsFolder)) return false;

  const widgets = [];
  fs.readdirSync(widgetsFolder).forEach((widget) => {
    const widgetFolder = [widgetsFolder, widget].join('');
    widgets.push(widgetEncoder(widgetFolder));
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
  getEncodedFiles,
  getJSFiles,
  getStyleFiles,
  getPageLayouts,
};
