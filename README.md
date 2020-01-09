# Telligent Converter JS (telligent-converter-js)

[![Build Status](https://api.travis-ci.org/Jasperrr91/telligent-converter-js.svg?branch=master)](https://travis-ci.org/Jasperrr91/telligent-converter-js) [![Codacy Badge](https://api.codacy.com/project/badge/Grade/4039bbc7f8334fe6b237baea0c538cd4)](https://www.codacy.com/manual/jasper_3/telligent-converter-js?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=Jasperrr91/telligent-widget-converter-js&amp;utm_campaign=Badge_Grade) [![Codacy Badge](https://api.codacy.com/project/badge/Coverage/4039bbc7f8334fe6b237baea0c538cd4)](https://www.codacy.com/manual/jasper_3/telligent-converter-js?utm_source=github.com&utm_medium=referral&utm_content=Jasperrr91/telligent-widget-converter-js&utm_campaign=Badge_Coverage)

## Description
Telligent Community has an in-browser editor for it's widgets and themes but this editor is slow and lacks powerful features that your favorite IDE offers. You *can* export/import these widgets and themes, but everything is exported combined into a single XML file. With all widget/theme files encoded in base64. This requires **a lot** of manual labour to make widgets/themes editable. It is also a pain for version control.

This JavaScript project will let you decode and encode* these widget/theme files so you wind up with an easily managable and editable project structure.

_* encoding has not yet been implemented_

## Usage
### Decoding Theme(s)
To decode widgets, place the the XML file containing the theme(s) in the root folder and name it `themes.xml`. Then use the following code for your `app.js`.
```javascript
import { readdir } from 'fs';
import config from '../config.json';
import { widgetDecoder, themeDecoder, helpers } from './decoder/index';

// Decode Themes XML file
const themesFile = '../themes.xml';
const themesXml = helpers.openXmlFile(themesFile, config);
const themesJson = helpers.convertXmlToJson(themesXml);
themeDecoder(themesJson, config);
```

Run with `npm start`.

### Decoding Widgets
To decode widgets, place the widgets in the input folder and use the following code for your `app.js`.
```javascript
import { readdir } from 'fs';
import config from '../config.json';
import { widgetDecoder, themeDecoder, helpers } from './decoder/index';

// Decode each widget
const { inputFolder } = config;
readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    const widgetXml = helpers.openXmlFile(file, config);
    const widgetJson = helpers.convertXmlToJson(widgetXml);
    widgetDecoder(widgetJson.scriptedContentFragments.scriptedContentFragment, config);
  });
});
```

### Encoding
Not yet supported.

## TODO
  - Remove DRY code
  - Add Encoding
  - Turn into package