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

  // console.log('LETS GO');
  // console.log(fileLocation);
  const reStart = new RegExp('javascript">\\n(\\t){0,}//');
  const reEnd = new RegExp('//\\n(\\t){0,}<\/script');

  const script = fs.readFileSync(fileLocation, 'utf8');

  // if (reStart.test(script)) console.log('SHOULD MATCH 24 TIMES');
  // if (reEnd.test(script)) console.log('SHOULD MATCH 24x TIMES');

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