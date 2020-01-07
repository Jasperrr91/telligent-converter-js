import fs from 'fs';
import {
  createDirIfNotExists,
} from './helpers';

jest.mock('fs');

describe('Helpers function correctly', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Creates a dir when it does not exist', () => {
    const sampleDir = '/aXgkD';
    createDirIfNotExists(sampleDir);
    const dirExists = fs.existsSync(sampleDir);
    expect(dirExists).toEqual(true);
  });
});
