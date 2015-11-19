/**
 * Interface for reading cookies. Universal code should read cookies only from
 * an implementation's of this interface. We need a unified interface for cookie
 * reading because they are retrieved from different sources depending on
 * whether you are on server or client side.
 *
 * @CLIENT_SERVER
 */
export default class CookieReader {
  /**
   * @param {string} name
   * @return {?string}
   */
  read(name) {

  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  has(name) {

  }
}