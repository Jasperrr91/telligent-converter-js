const he = require('he');

module.exports = {
  xml: {
    attributeNamePrefix: '@_',
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
  },
};
