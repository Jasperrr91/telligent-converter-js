import fs from 'fs';
import { convertXmlToJson } from '../../decoder/helpers';
import { widgetEncoder } from '../index';

export function getThemeOptions(inputFolder) {
  const themeOptionsFile = [inputFolder, '/theme_options.json'].join('');
  const rawthemeOptions = fs.readFileSync(themeOptionsFile);
  const themeOptions = JSON.parse(rawthemeOptions);
  return themeOptions;
}

export function getThemeFile(inputFile) {
  const scriptContents = fs.readFileSync(inputFile, 'utf8');
  return {
    __cdata: scriptContents,
  };
}

export function getScript(inputFile) {
  if (!fs.existsSync(inputFile)) return false;
  const script = getThemeFile(inputFile);
  script.attr = {
    language: 'Velocity',
  };
  return script;
}

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

export function getJSFiles(inputFolder) {
  const scriptsFolder = [inputFolder, '/js/'].join('');
  if (!fs.existsSync(scriptsFolder)) return false;

  const files = [];
  fs.readdirSync(scriptsFolder).forEach((file) => {
    const fileLocation = [scriptsFolder, file].join('');
    files.push(getEncodedFile(fileLocation, file));
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

export function getHeader(inputFolder) {
  const headerFileLocation = [inputFolder, '/header.xml'].join('');
  if (!fs.existsSync(headerFileLocation)) return false;

  const headerContents = fs.readFileSync(headerFileLocation, 'utf8');
  const header = convertXmlToJson(headerContents);
  return header;
}

export function getFooter(inputFolder) {
  const footerFileLocation = [inputFolder, '/footer.xml'].join('');
  if (!fs.existsSync(footerFileLocation)) return false;

  const footerContents = fs.readFileSync(footerFileLocation, 'utf8');
  const footer = convertXmlToJson(footerContents);
  return footer;
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

export function getPageLayouts(inputFolder) {
  const pageLayouts = {};
  pageLayouts.headers = getHeader(inputFolder);
  pageLayouts.footers = getFooter(inputFolder);
  pageLayouts.pages = getPages(inputFolder);
  pageLayouts.contentFragments = getWidgets(inputFolder);
  return pageLayouts;
}

// export function createPageLayouts(data, themeDir) {
//   createXMLFileFromData('header.xml', data.headers.contentFragmentHeader.regions, themeDir);
//   createXMLFileFromData('footer.xml', data.footers.contentFragmentFooter.regions, themeDir);
//   parsePages(data.pages, themeDir);
//   parseContentFragments(data.contentFragments.scriptedContentFragments, themeDir);
// }

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
