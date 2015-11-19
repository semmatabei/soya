import CookieReader from './CookieReader.js';

/**
 * @CLIENT
 */
export default class ClientCookieReader extends CookieReader {
  /**
   * @param {string} name
   * @return {?string}
   */
  read(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  has(name) {
    // If the cookie exists, even empty value will be an empty string.
    return this.read(name) !== null;
  }
}