import ReverseRoutingData from './ReverseRoutingData.js';
import PathNode from './PathNode.js';

/**
 * Router for usage by Page and react components. Doesn't support routing, just
 * reverse routing.
 *
 * @CLIENT-SERVER
 */
export default class PageRouter {
  /**
   * @type {Array<Node>}
   */
  _preProcessNodes;

  /**
   * @type {Array<Node>}
   */
  _postProcessNodes;

  /**
   * @type {{[key: string]: Array<Node>}}
   */
  _routeNodes;

  /**
   * @param {?Array<Node>} preProcessNodes
   * @param {?Array<Node>} postProcessNodes
   * @param {?{[key:string]: Array<Node>}} routeNodes
   */
  constructor(preProcessNodes, postProcessNodes, routeNodes) {
    this._preProcessNodes = preProcessNodes == null ? [] : preProcessNodes;
    this._postProcessNodes = postProcessNodes == null ?  [] : postProcessNodes;
    this._routeNodes = routeNodes == null ? {} : routeNodes;
  }

  /**
   * @returns {PageRouter}
   */
  createPageRouter() {
    return this;
  }

  validatePages() {
    throw new Error('Calling validatePages() in page router is not allowed.');
  }

  setLogger() {
    throw new Error('Calling setLogger() in page router is not allowed.');
  }

  set404NotFoundPage() {
    // No-op. In client, we don't need to know the 404 not found page, since
    // we are not doing any routing in client side.
  }

  /**
   * @param {string} routeId
   * @param {string} pageName
   * @param {?Array<Node>} startNodes
   * @param {Array<Node>} path
   * @param {?Array<Node>} endNodes
   */
  reg(routeId, pageName, startNodes, path, endNodes) {
    // Since this class is only used for reverse routing, no need to do
    // further processing.
    var nodes = PageRouter.joinNodes(startNodes, path, endNodes);
    if (nodes.length < 1) {
      throw new Error('Invalid route, no nodes discovered: ' + routeId);
    }
    this._routeNodes[routeId] = nodes;
  }

  /**
   * @param {string} routeId
   * @param {?Object} routeArgs
   * @param {?string} fragment
   * @returns {string}
   */
  reverseRoute(routeId, routeArgs, fragment) {
    return PageRouter.reverseRoute(routeId, routeArgs, fragment, this._routeNodes);
  }

  route() {
    throw new Error('Method route() called in client router!');
  }

  /**
   * @param {?Array<Node>} startNodes
   * @param {string} path
   * @param {?Array<Node>} endNodes
   * @return {Array<Node>}
   */
  static joinNodes(startNodes, path, endNodes) {
    if (!startNodes) startNodes = [];
    if (!endNodes) endNodes = [];
    var pathNodes = PathNode.createFromPath(path);
    var i, nodes = [];
    for (i = 0; i < startNodes.length; i++) nodes.push(startNodes[i]);
    for (i = 0; i < pathNodes.length; i++) nodes.push(pathNodes[i]);
    for (i = 0; i < endNodes.length; i++) nodes.push(endNodes[i]);
    return nodes;
  }

  /**
   * @param {string} routeId
   * @param {?Object} routeArgs
   * @param {?string} fragment
   * @param {Array<Node>} routeNodes
   * @returns {string}
   */
  static reverseRoute(routeId, routeArgs, fragment, routeNodes) {
    if (!routeNodes.hasOwnProperty(routeId)) {
      throw new Error(`Reverse routing called for uknown route: '${routeId}'.`);
    }
    var i, nodes = routeNodes[routeId];
    var reverseRoutingData = new ReverseRoutingData(routeArgs);
    for (i = 0; i < nodes.length; i++) {
      nodes[i].reverseEvaluate(reverseRoutingData);
    }
    return reverseRoutingData.toUrlString(fragment);
  }
}