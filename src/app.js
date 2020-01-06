import { readdir } from 'fs';
import config from '../config.json';
import decoder from './decoder/index';

// Decode each widget
const { inputFolder } = config;
readdir(inputFolder, (err, files) => {
  if (err) throw err;
  files.forEach((file) => {
    decoder(file, config);
  });
});
