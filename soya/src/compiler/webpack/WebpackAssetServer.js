import AssetServer from '../AssetServer';

var fs = require('fs');
var path = require('path');

/**
 * Reads asset from the webpack output directory.
 *
 * TODO: Implement memory caching.
 *
 * @SERVER
 */
export default class WebpackAssetServer extends AssetServer {
  /**
   * @type {string}
   */
  _absoluteTempDir;

  /**
   * @type {string}
   */
  _assetHostPath;

  /**
   * @type {Logger}
   */
  _logger;

  /**
   * @param {string} assetHostPath
   * @param {string} absoluteTempDir
   * @param {Logger} logger
   */
  constructor(assetHostPath, absoluteTempDir, logger) {
    super(assetHostPath);
    this._assetHostPath = assetHostPath;
    this._absoluteTempDir = absoluteTempDir;
    this._logger = logger;
  }

  /**
   * @param {string} assetPath
   * @returns {any}
   */
  get(assetPath) {
    var cached = super.get(assetPath);
    if (cached) return cached;
    var fullPath = path.join(this._absoluteTempDir, assetPath);
    try {
      return fs.readFileSync(fullPath);
    } catch (err) {
      this._logger.notice('Asset server failed to retrieve: \'' + fullPath + '\'.', err);
      return null;
    }
  }

  /**
   * @param {ServerHttpRequest} httpRequest
   * @param {any} response
   * @returns {boolean}
   */
  handle(httpRequest, response) {
    if (httpRequest.startsWith(this._assetHostPath)) {
      // TODO: Handle percent encoding in path.
      var fullRequestPath = path.join(httpRequest.getHost(), httpRequest.getPath());
      var realPath = fullRequestPath.substr(this._assetHostPath.length);
      var content = this.get(realPath);
      if (content == null) {
        return false;
      }
      // TODO: Handle content type headers, content size, e-tag, etc.
      response.writeHead(200, {'Content-Type': 'text/plain'});
      response.end(content);
      return true;
    }
    return false;
  }
}
