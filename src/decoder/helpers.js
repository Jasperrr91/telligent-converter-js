/* eslint-disable no-underscore-dangle */
import fs from 'fs';
import {
  getTraversalObj,
  convertToJson,
  j2xParser,
} from 'fast-xml-parser';
import {
  xml as xmlOptions,
  json as jsonOptions,
} from '../ParserOptions';

export function openXmlFile(fileLocation) {
  return fs.readFileSync(fileLocation, 'utf8');
}

export function convertXmlToJson(data) {
  const tObj = getTraversalObj(data, xmlOptions);
  const jsonObj = convertToJson(tObj, xmlOptions);
  return jsonObj;
}

export function convertJsonToXml(data) {
  const parse = new j2xParser(jsonOptions);
  return parse.parse(data);
}

// TODO: Rewrite to create all dirs passed in
export function createDirIfNotExists(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

export function getExtensionForLanguage(language) {
  switch (language) {
    case 'Velocity':
      return '.vm';
    case 'Unknown':
      return '.txt';
    default:
      return '.txt';
  }
}

export default {
  openXmlFile,
  convertXmlToJson,
  convertJsonToXml,
  createDirIfNotExists,
  getExtensionForLanguage,
};
