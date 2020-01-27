import fs from 'fs';

// Template of an object corresponding to an empty script
const emptyScript = {
  attr: {
    language: 'Unknown',
  },
};

/**
 * Reads a velocity script from a file and then returns it as an object with the appropriate tags.
 * @param {String} fileLocation the file containing the script
 */
export function getVelocityScript(fileLocation) {
  // Return an empty tag if the script does not exist
  if (!fs.existsSync(fileLocation)) return emptyScript;

  const script = fs.readFileSync(fileLocation, 'utf8');
  return {
    attr: {
      language: 'Velocity',
    },
    __cdata: script,
  };
}

export default {
  getVelocityScript,
}