import fs from 'fs';

/**
 * @param {string} absolutePath
 * @return {boolean}
 * @SERVER
 */
export function isFileExists(absolutePath) {
  var stat;
  try {
    stat = fs.statSync(absPath);
  } catch(error) {
    return false;
  }

  return stat.isFile();
}