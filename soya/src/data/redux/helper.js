/**
 * Returns false if there are differences. Only does reference equality. Useful
 * only for objects that are deemed immutable.
 *
 * @param {Object} objectA
 * @param {Object} objectB
 * @return {boolean}
 * @CLIENT_SERVER
 */
export function isEqualShallow(objectA, objectB) {
  // Must check: deleted properties, property modification, new properties.
  // Can't use Object.keys - compatibility no. 1 baby!
  if (objectA === objectB) {
    return true;
  }

  var key;
  for (key in objectA) {
    if (!objectA.hasOwnProperty(key)) continue;
    if (!objectB.hasOwnProperty(key)) return false; // New/deleted properties.
    if (objectA[key] !== objectB[key]) return false; // Modified properties.
  }
  for (key in objectB) {
    if (!objectB.hasOwnProperty(key)) continue;
    if (!objectA.hasOwnProperty(key)) return false; // New/deleted properties.
  }

  return true;
}