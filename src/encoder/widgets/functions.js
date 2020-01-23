/* eslint-disable no-underscore-dangle */
import fs from 'fs';

const emptyScript = {
  attr: {
    language: 'Unknown',
  },
};

export function getScript(fileLocation) {
  if (!fs.existsSync(fileLocation)) return emptyScript;

  const script = fs.readFileSync(fileLocation, 'utf8');
  return {
    attr: {
      language: 'Velocity',
    },
    __cdata: script,
  };
}

export function getXML(fileLocation) {
  if (!fs.existsSync(fileLocation)) return false;

  const xml = fs.readFileSync(fileLocation, 'utf8');
  return {
    __cdata: xml,
  };
}

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

export function getFiles(inputFolder) {
  const excludedFiles = [
    'contentScript.vm',
    'headerScript.vm',
    'configuration.xml',
    'languageResources.xml',
    'additionalCssScript.css',
    'widget_options.json',
  ];
  const files = [];

  fs.readdirSync(inputFolder).forEach((file) => {
    const fileLocation = [inputFolder, '/', file].join('');
    if (!excludedFiles.includes(file)) {
      files.push(getEncodedFile(fileLocation, file));
    }
  });

  return {
    file: files,
  };
}

export default {
  getScript,
  getXML,
  getFiles,
};
