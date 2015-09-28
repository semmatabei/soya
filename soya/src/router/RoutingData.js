import ServerHttpRequest from '../http/ServerHttpRequest';
import RouteResult from './RouteResult';
import PathNode from './PathNode';

/**
 * Represents initial routing data and routing results.
 *
 * @SERVER
 */
export default class RoutingData {
  /**
   * @type {ServerHttpRequest}
   */
  serverHttpRequest;

  /**
   * @type {Object}
   */
  resultRouteArgs;

  /**
   * @type {string}
   */
  resultRouteId;

  /**
   * @type {string}
   */
  resultPageName;

  /**
   * @type {Array<string>}
   */
  _pathSegments;

  /**
   * @type {number}
   */
  _currentSegmentIndex;

  /**
   * @param {ServerHttpRequest} serverHttpRequest
   */
  constructor(serverHttpRequest) {
    this.serverHttpRequest = serverHttpRequest;
    this._currentSegmentIndex = 0;
    this.resultRouteArgs = {};
    this._pathSegments = PathNode.toPathSegments(this.serverHttpRequest.getPath());
  }

  /**
   * @returns {boolean}
   */
  isEmptyPath() {
    return this._pathSegments.length == 0;
  }

  /**
   * Consumes current segment, prompting next node to use the next path segment.
   */
  consumeSegment() {
    this._currentSegmentIndex++;
  }

  /**
   * Undoes the segment consumption.
   */
  undoConsumeSegment() {
    this._currentSegmentIndex--;
    if (this._currentSegmentIndex < 0) this._currentSegmentIndex = 0;
  }

  /**
   * @returns {boolean}
   */
  isAllSegmentConsumed() {
    return this._currentSegmentIndex > this._pathSegments.length - 1;
  }

  /**
   * @returns {?string}
   */
  getCurrentSegment() {
    if (this.isAllSegmentConsumed()) {
      return null;
    }
    return this._pathSegments[this._currentSegmentIndex];
  }

  /**
   * @returns {RouteResult}
   */
  createResult() {
    if (!this.resultRouteId || !this.resultPageName) {
      return null;
    }
    var result = new RouteResult();
    result.routeId = this.resultRouteId;
    result.pageName = this.resultPageName;
    result.routeArgs = this.resultRouteArgs;
    return result;
  }
}