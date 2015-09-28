var url = require('url');
var path = require('path');

/**
 * @SERVER
 */
export default class ServerHttpRequest {
  /**
   * @type {http.incomingMessage}
   */
  _httpRequest: Object;

  /**
   * @type {Object}
   */
  _parsedUrl;

  /**
   * @param {http.incomingMessage} httpRequest
   */
  constructor(httpRequest) {
    this._httpRequest = httpRequest;
    this._parsedUrl = url.parse(httpRequest.url);
  }

  /**
   * @param {string} givenHostPath
   * @returns {boolean}
   */
  startsWith(givenHostPath) {
    var hostAndPath = path.join(this.getHost(), this.getPath());
    return hostAndPath.substr(0, givenHostPath.length) == givenHostPath;
  }

  /**
   * @returns {string}
   */
  getMethod() {
    return this._httpRequest.method;
  }

  /**
   * @returns {boolean}
   */
  isSecure() {
    // TODO: Create default nginx configuration for usage, use our own architecture, create contract to know whether this is https or not (use header? x-forwarded-proto like our arch).
    return this._httpRequest.protocol == 'https';
  }

  /**
   * @returns {Object}
   */
  getHeaders() {
    return this._httpRequest.headers;
  }

  /**
   * @returns {string}
   */
  getDomain() {
    var hostSplit = this.getHost().split(':');
    return hostSplit[0].trim();
  }

  /**
   * @returns {string}
   */
  getHost() {
    return this._httpRequest.headers.host;
  }

  /**
   * @returns {string}
   */
  getPath() {
    return this._parsedUrl.path;
  }
}