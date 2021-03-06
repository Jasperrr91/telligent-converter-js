import he from 'he';

export const xml = {
  attributeNamePrefix: '',
  attrNodeName: 'attr', // default is 'false'
  textNodeName: '#text',
  ignoreAttributes: false,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  parseNodeValue: true,
  parseAttributeValue: false,
  trimValues: true,
  cdataTagName: '__cdata', // default is 'false'
  cdataPositionChar: '\\c',
  localeRange: '', // To support non english character in tag/attribute values.
  parseTrueNumberOnly: false,
  arrayMode: false, // "strict"
  attrValueProcessor: (val) => he.decode(val, { isAttributeValue: true }),
  tagValueProcessor: (val) => he.decode(val), // default is a=>a
  stopNodes: ['parse-me-as-string'],
};

export const json = {
  attributeNamePrefix: '@_',
  attrNodeName: 'attr', // default is false
  textNodeName: '#text',
  ignoreAttributes: false,
  cdataTagName: '__cdata', // default is false
  cdataPositionChar: '\\c',
  format: true,
  indentBy: '\t',
  supressEmptyNode: true,
  tagValueProcessor: (a) => he.encode(a, { useNamedReferences: true }), // default is a=>a
  attrValueProcessor: (a) => he.encode(a, {
    isAttributeValue: true, useNamedReferences: true,
  }), // default is a=>a
};
