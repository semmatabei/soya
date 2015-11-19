import CookieReader from './CookieReader.js';

/**
 * @SERVER
 */
export default class ServerCookieReader extends CookieReader {
  /**
   * @type {http.incomingMessage}
   */
  _httpRequest;

  /**
   * @type {{[key: string]: string}}
   */
  _cookies;

  /**
   * @param {http.incomingMessage} httpRequest
   */
  constructor(httpRequest) {
    super();
    this._httpRequest = httpRequest;
  }

  /**
   * @param {string} name
   * @return {?string}
   */
  read(name) {
    if (this._cookies) {
      return this._cookies[name];
    }
    var cookieString = this._httpRequest.headers.cookie;
    if (cookieString == null || typeof cookieString != 'string') return null;
    var splitCookieStr = cookieString.split(';');
    this._cookies = {};
    // TODO: Security risk, parsing cookies here means blocking the event loop. If attacker sends large amount of cookies, it could make our server non-responsive.
    for (var i=0;i < splitCookieStr.length;i++) {
      var cookieSegment = splitCookieStr[i];
      while (cookieSegment.charAt(0) == ' ') {
        cookieSegment = cookieSegment.substring(1, cookieSegment.length);
      }
      // Since request cookies don't change, we can cache it.
      var equalityIndex = cookieSegment.indexOf('=');
      var cookieName = cookieSegment.substring(0, equalityIndex-1);
      var cookieVal = cookieSegment.substring(equalityIndex+1, cookieSegment.length);
      this._cookies[cookieName] = cookieVal;
    }
    return this._cookies[name];
  }

  /**
   * @param {string} name
   * @return {boolean}
   */
  has(name) {
    return this.read(name) !== null;
  }
}