import Node from './Node';

/**
 * @CLIENT-SERVER
 */
export default class MethodNode extends Node {
  /**
   * @type {string}
   */
  _method;

  /**
   * @param {string} method
   */
  constructor(method) {
    super();
    this._method = method;
  }

  /**
   * @param {RoutingData} routingData
   * @returns {boolean}
   */
  evaluate(routingData) {
    return routingData.serverHttpRequest.getMethod() == this._method;
  }

  /**
   * @param {ReverseRoutingData} reverseRoutingData
   */
  reverseEvaluate(reverseRoutingData) {
    // No-op.
  }

  isConsumingSegmentOnMatch() {
    return false;
  }

  /**
   * @param {Node} node
   * @returns {boolean}
   */
  equals(node) {
    return node instanceof MethodNode && node._method == this._method;
  }
}