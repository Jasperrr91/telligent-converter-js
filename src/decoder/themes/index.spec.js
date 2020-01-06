// const fs = require('fs');
// import fs from 'fs';
import fs from 'fs';
import {
  createThemeOptionsFile,
  // createScript,
} from './index';

jest.mock('fs');

test('Write theme options as json to a file', () => {
  const sampleAttributes = {
    name: 'Social',
    version: '11.1.0.9731',
    description: "'Social' Blog Theme",
  };
  const sampleTheme = {
    attr: sampleAttributes,
  };

  const randomDir = '/aXgkD';
  fs.mkdirSync(randomDir);

  createThemeOptionsFile(sampleTheme, randomDir);

  const mockFile = [randomDir, '/theme_options.json'].join('');
  const theme = fs.readFileSync(mockFile, 'UTF8');
  const themeObject = JSON.parse(theme);
  expect(themeObject).toEqual(sampleAttributes);
});
