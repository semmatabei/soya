import Node from './Node';
import EmptyPathNode from './EmptyPathNode';

/**
 * @CLIENT-SERVER
 */
export default class PathNode extends Node {
  /**
   * @type {string}
   */
  _segment;

  /**
   * @param {string} segment
   */
  constructor(segment) {
    super();
    this._segment = segment;
  }

  /**
   * @param {RoutingData} routingData
   */
  evaluate(routingData) {
    if (routingData.isAllSegmentConsumed()) {
      // We are still expecting a path segment. If all path segment is already
      // consumed, it's not a match.
      return false;
    }

    var isMatch = false;
    var decodedCurrentSegment = decodeURIComponent(routingData.getCurrentSegment());
    if (this._segment[0] == ':') {
      // Match all, but set route args first.
      var varName = this._segment.substr(1);
      routingData.resultRouteArgs[varName] = decodedCurrentSegment;
      isMatch = true;
    }
    else if (this._segment == decodedCurrentSegment) {
      // Else match it char by char.
      isMatch = true;
    }

    if (isMatch) {
      routingData.consumeSegment();
      return true;
    }
    return false;
  }

  /**
   * @param {ReverseRoutingData} reverseRoutingData
   */
  reverseEvaluate(reverseRoutingData) {
    if (this._segment[0] == ':') {
      var varName = this._segment.substr(1);
      reverseRoutingData.pathSegments.push(encodeURIComponent(reverseRoutingData.routeArgs[varName]));
      return;
    }
    reverseRoutingData.pathSegments.push(encodeURIComponent(this._segment));
  }

  /**
   * @returns {boolean}
   */
  isConsumingSegmentOnMatch() {
    return true;
  }

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  equals(node) {
    return node instanceof PathNode && node._segment == this._segment;
  }

  /**
   * Create list of PathNode representing the given path.
   *
   * @param {string} path
   * @return {Array<PathNode>}
   */
  static createFromPath(path) {
    var i, result = [], pathSegments = PathNode.toPathSegments(path);
    for (i = 0; i < pathSegments.length; i++) {
      result.push(new PathNode(pathSegments[i]));
    }
    if (result.length == 0) {
      // Path is empty, assume it's for home page.
      result.push(new EmptyPathNode());
    }
    return result;
  }

  /**
   * Split path into array of segments.
   *
   * '/' --> []
   * '/foo/bar' --> ['foo', 'bar']
   * '/foo/bar/' --> ['foo', 'bar', '']
   *
   * @param {string} path
   * @return {Array<string>}
   */
  static toPathSegments(path) {
    var splitPath = path.split('/');

    // Slash prefix is not useful at routing, as it always exists.
    // Slash at the end, however, is necessary for routing, so we want to keep that.
    if (splitPath[0] == '') {
      splitPath = splitPath.slice(1);
    }

    return splitPath;
  }
}