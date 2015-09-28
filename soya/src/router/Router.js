/* @flow */

import Page from '../page/Page.js';
import RouteResult from './RouteResult.js';
import ServerHttpRequest from '../http/ServerHttpRequest';
import RoutingData from './RoutingData';
import ReverseRoutingData from './ReverseRoutingData.js';
import PathNode from './PathNode';
import FinalPathNode from './FinalPathNode';
import PageRouter from './PageRouter.js';

/**
 * Simple router implementation. You can create your own router implementation.
 * As long as it has the route() and  will do just fine
 *
 * 1) Parses route file and create array of entry points.
 * 2) Holds cache of Page instances and routes request to the Page instance.
 *
 * @SERVER
 */
export default class Router {
  /**
   * @type {Array<Node>}
   */
  _preProcessNodes;

  /**
   * @type {Array<Node>}
   */
  _postProcessNodes;

  /**
   * @type {{[key: string]: Node}}
   */
  _routeNodes;

  /**
   * @type {Array<Node>}
   */
  _graph;

  /**
   * @type {RouteResult}
   */
  _notFoundRouteResult;

  /**
   * @type {Logger}
   */
  _logger;

  /**
   * @type {Array<string>}
   */
  _pageNames;

  /**
   * @param {?Array<Node>} preProcessNodes
   * @param {?Array<Node>} postProcessNodes
   */
  constructor(preProcessNodes, postProcessNodes) {
    this._preProcessNodes = preProcessNodes == null ? [] : preProcessNodes;
    this._postProcessNodes = postProcessNodes == null ?  [] : postProcessNodes;
    this._routeNodes = {};
    this._graph = [];
    this._pageNames = [];
  }

  /**
   * @returns {PageRouter}
   */
  createPageRouter() {
    return new PageRouter(
      this._preProcessNodes, this._postProcessNodes, this._routeNodes);
  }

  /**
   * @param {ComponentRegister} componentRegister
   */
  validatePages(componentRegister) {
    var i;
    for (i = 0; i < this._pageNames.length; i++) {
      if (!componentRegister.hasPage(this._pageNames[i])) {
        throw new Error('Route registered for non-existent page: \'' + this._pageNames[i] + '\'.');
      }
    }
    if (!componentRegister.hasPage(this._notFoundRouteResult.pageName)) {
      throw new Error('Route registered for 404 page is not found (oh, the irony!): \'' + this._notFoundRouteResult.pageName + '\'.');
    }
  }

  /**
   * @param {Logger} logger
   */
  setLogger(logger) {
    this._logger = logger;
  }

  /**
   * @param {string} pageName
   */
  set404NotFoundPage(pageName) {
    this._notFoundRouteResult = new RouteResult();
    this._notFoundRouteResult.routeId = '__404';
    this._notFoundRouteResult.pageName = pageName;
    this._notFoundRouteResult.routeArgs = {};
  }

  /**
   * @param {string} routeId
   * @param {string} pageName
   * @param {?Array<Node>} startNodes
   * @param {string} path
   * @param {?Array<Node>} endNodes
   */
  reg(routeId, pageName, startNodes, path, endNodes) {
    if (routeId[0] == '_') {
      throw new Error('Route ID must not start with underscore: ' + routeId);
    }
    if (this._routeNodes.hasOwnProperty(routeId)) {
      throw new Error('Duplicate route ID: ' + routeId);
    }
    this._pageNames.push(pageName);


    var nodes = PageRouter.joinNodes(startNodes, path, endNodes);
    if (nodes.length < 1) {
      throw new Error('Invalid route, no nodes discovered: ' + routeId);
    }

    // Set nodes for reverse routing.
    this._routeNodes[routeId] = nodes;

    var i, parentNode;
    for (i = 0; i < this._graph.length; i++) {
      if (this._graph[i].equals(nodes[0])) {
        parentNode = this._graph[i];
        break;
      }
    }

    if (!parentNode) {
      // If no reusable parent node, add the node to the graph list and start
      // chaining from there.
      this._graph.push(nodes[0]);
      parentNode = nodes[0];
    }

    var curIndex = 1, children, foundEqual;
    while (curIndex < nodes.length) {
      if (!nodes[curIndex].isLeaf()) {
        throw new Error('User given route nodes must be leaf!');
      }

      foundEqual = false;
      children = parentNode.getChildren();
      for (i = 0; i < children.length; i++) {
        if (children[i].equals(nodes[curIndex])) {
          foundEqual = true;
          parentNode = children[i];
          break;
        }
      }
      if (!foundEqual) {
        parentNode.addChild(nodes[curIndex]);
        parentNode = nodes[curIndex];
      }
      curIndex++;
    }

    // Add setter node.
    parentNode.addChild(new FinalPathNode(routeId, pageName));
  }

  /**
   * @param {string} routeId
   * @param {?Object} routeArgs
   * @param {?string} fragment
   * @return {string}
   */
  reverseRoute(routeId, routeArgs, fragment) {
    return PageRouter.reverseRoute(routeId, routeArgs, fragment, this._routeNodes);
  }

  /**
   * @param {ServerHttpRequest} httpRequest
   * @return {?RouteResult}
   */
  route(httpRequest) {
    var i, routingData = new RoutingData(httpRequest);

    // Start pre processing. Pre processing may invalidate routes.
    for (i = 0; i < this._preProcessNodes.length; i++) {
      if (this._preProcessNodes[i].evaluate(routingData) !== true) return null;
    }

    // Start state based routing.
    this._routeRecursively(this._graph, routingData);

    // Start post processing. Post processing may invalidate routes.
    for (i = 0; i < this._postProcessNodes.length; i++) {
      if (this._postProcessNodes[i].evaluate(routingData) !== true) return null;
    }

    var routeResult = routingData.createResult();
    if (routeResult == null) {
      this._logger.notice('404 not found -> ', null, [this._logger.prepRequest(httpRequest._httpRequest)]);
      routeResult = this._notFoundRouteResult;
    }
    return routeResult;
  }

  /**
   * @param {Array<Node>} childNodes
   * @param {RoutingData} routingData
   * @returns {boolean}
   */
  _routeRecursively(childNodes, routingData) {
    var i, childResult, found = false;
    for (i = 0; i < childNodes.length; i++) {
      // If the node doesn't match, no need to continue to its children.
      if (childNodes[i].evaluate(routingData) !== true) continue;

      if (childNodes[i].isLeaf()) {
        // If this is already the leaf, then it's a match.
        // Since it is guaranteed that all leaf is a FinalPathNode, this
        // guarantees that routing result is already set. We return true.
        return true;
      }

      // Else we need to recursively check all the children
      // until we reach the leaf.
      childResult = this._routeRecursively(childNodes[i].getChildren(), routingData);
      if (childResult === true) {
        found = true;
        break;
      } else if (childNodes[i].isConsumingSegmentOnMatch()) {
        // If we've recursively checked all the children and found no match,
        // and the the currently matching parent is a PathNode, we need to
        // undo the path consumption.
        routingData.undoConsumeSegment();
      }
    }

    return found;
  }
}