import fs from 'fs';
import {
  createDirIfNotExists,
  getExtensionForLanguage,
} from './helpers';

jest.mock('fs');

describe('Decoder helper functions work correctly', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Creates a dir when it does not exist', () => {
    const sampleDir = '/aXgkD';
    createDirIfNotExists(sampleDir);
    const dirExists = fs.existsSync(sampleDir);
    expect(dirExists).toEqual(true);
  });

  test('Gets the correct file extension for a giving language', () => {
    const languagesWithExtensions = {
      Velocity: '.vm',
      Unknown: '.txt',
      r4nD0m: '.txt',
    };

    Object.keys(languagesWithExtensions).forEach((language) => {
      const expectedExtension = languagesWithExtensions[language];
      const extension = getExtensionForLanguage(language);
      expect(extension).toEqual(expectedExtension);
    });
  });
});
