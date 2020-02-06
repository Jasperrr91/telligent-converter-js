import fs from 'fs';
import { convertXmlToJson } from '../../decoder/helpers';

/**
 * Reads XML from a file and then returns it as an object with the appropriate tags.
 * @param {String} fileLocation the file containing the script
 */
export function getXMLFile(fileLocation) {
  // Validates if the needed files do exist
  if (!fs.existsSync(fileLocation)) return false;

  const xml = fs.readFileSync(fileLocation, 'utf8');
  return {
    __cdata: xml,
  };
}

export function getFileExtension(filename) {
  return filename.split('.')[1];
}


/**
 * Reads a file and then applies base64 encoding to it's contents. It then gets
 * returned as an object with the appropriate tags added.
 * @param {String} fileLocation the path to the file to be read and encoded
 * @param {String} fileName name and extension of the file
 */
export function getEncodedFile(fileLocation, fileName) {
  const fileContents = fs.readFileSync(fileLocation, 'utf8');
  let encodedFileContents;

  // mp3 and wave files are not base64 encoded
  if (getFileExtension(fileName) === 'mp3' || getFileExtension(fileName) === 'wav') {
    encodedFileContents = fileContents;
  } else {
    encodedFileContents = Buffer.from(fileContents).toString('base64');
  }

  return {
    attr: {
      name: fileName,
    },
    '#text': encodedFileContents,
  };
}
/**
 * Looks for all the asset files in a widget directory, then encodes them and returns
 * them surrounded by file tags in an object.
 * @param {String} widgetDir dir containing the widget
 */
export function getAssetFiles(widgetDir) {
  // List of default widget files which are to be ignored
  const excludedFiles = [
    'contentScript.vm',
    'headerScript.vm',
    'configuration.xml',
    'languageResources.xml',
    'additionalCssScript.css',
    'widget_options.json',
    'requiredContext.xml',
  ];
  const files = [];

  fs.readdirSync(widgetDir).forEach((fileName) => {
    const fileLocation = [widgetDir, '/', fileName].join('');

    // Only parse if not a default widget file
    if (!excludedFiles.includes(fileName)) {
      files.push(getEncodedFile(fileLocation, fileName));
    }
  });

  // Wrap each file with a <file> tag
  return {
    file: files,
  };
}

export function getRequiredContext(fileLocation) {
  if (!fs.existsSync(fileLocation)) return false;

  const fileContents = fs.readFileSync(fileLocation, 'utf8');
  return convertXmlToJson(fileContents);
}

export default {
  getXMLFile,
  getAssetFiles,
  getRequiredContext,
};
