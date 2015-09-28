import Node from './Node';

/**
 * Node that checks that the path doesn't have segments.
 *
 * @CLIENT-SERVER
 */
export default class EmptyPathNode extends Node {
  /**
   * @param {RoutingData} routingData
   * @returns {boolean}
   */
  evaluate(routingData) {
    return routingData.isEmptyPath();
  }

  /**
   * @param {ReverseRoutingData} reverseRoutingData
   */
  reverseEvaluate(reverseRoutingData) {
    reverseRoutingData.pathSegments = [];
  }

  /**
   * @returns {boolean}
   */
  isConsumingSegmentOnMatch() {
    return false;
  }

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  equals(node) {
    return node instanceof EmptyPathNode;
  }
}