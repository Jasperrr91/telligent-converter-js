import fs from 'fs';

// Template of an object corresponding to an empty script
const emptyScript = {
  attr: {
    language: 'Unknown',
  },
};

/**
 * Reads a velocity script from a file and then returns it as an object with the appropriate tags.
 * @param {String} fileLocation the file containing the script
 */
export function getVelocityScript(fileLocation) {
  // Return an empty tag if the script does not exist
  if (!fs.existsSync(fileLocation)) return emptyScript;

  const script = fs.readFileSync(fileLocation, 'utf8');
  return {
    attr: {
      language: 'Velocity',
    },
    __cdata: script,
  };
}

/**
 * Reads XML from a file and then returns it as an object with the appropriate tags.
 * @param {String} fileLocation the file containing the script
 */
export function getXMLFile(fileLocation) {
  // Validates if the needed files do exist
  if (!fs.existsSync(fileLocation)) throw new Error('The Widget XML file does not exist');

  const xml = fs.readFileSync(fileLocation, 'utf8');
  return {
    __cdata: xml,
  };
}

/**
 * Reads a file and then applies base64 encoding to it's contents. It then gets
 * returned as an object with the appropriate tags added.
 * @param {String} fileLocation the path to the file to be read and encoded
 * @param {String} fileName name and extension of the file
 */
export function getEncodedFile(fileLocation, fileName) {
  const fileContents = fs.readFileSync(fileLocation);
  const encodedFileContents = fileContents.toString('base64');

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

export default {
  getVelocityScript,
  getXMLFile,
  getAssetFiles,
};
