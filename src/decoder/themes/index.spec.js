// const fs = require('fs');
// import fs from 'fs';
import fs from 'fs';
import {
  createThemeOptionsFile,
  createScript,
} from './index';

jest.mock('fs');

afterEach(() => {
  jest.restoreAllMocks();
});

test('Write theme options as json to a file', () => {
  const sampleAttributes = {
    name: 'Social',
    version: '11.1.0.9731',
    description: "'Social' Blog Theme",
  };
  const sampleTheme = {
    attr: sampleAttributes,
  };

  const sampleDir = '/aXgkD';
  fs.mkdirSync(sampleDir);

  createThemeOptionsFile(sampleTheme, sampleDir);

  const mockFile = [sampleDir, '/theme_options.json'].join('');
  const theme = fs.readFileSync(mockFile, 'UTF8');
  const themeObject = JSON.parse(theme);
  expect(themeObject).toEqual(sampleAttributes);
});

test('Write a script to a file with the correct extension', () => {
  const sampleName = 'headScript';

  const sampleScript = `$context_v2_themeHeader.RenderStylesheetFiles()
  $context_v2_themeHeader.RenderJavascriptFiles()`;

  const sampleScriptObject = {
    attr: { language: 'Velocity' },
    __cdata: sampleScript,
  };

  const sampleParentObject = {
    [sampleName]: sampleScriptObject,
  };

  const sampleDir = '/aXgkDd';
  fs.mkdirSync(sampleDir);
  const scriptsDir = [sampleDir, '/scripts'].join('');
  fs.mkdirSync(scriptsDir);

  createScript(sampleName, sampleParentObject, sampleDir);

  const mockFile = [sampleDir, '/scripts/', sampleName, '.vm'].join('');
  const scriptObject = fs.readFileSync(mockFile, 'UTF8');
  expect(scriptObject).toEqual(sampleScript);
});
