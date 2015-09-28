import Node from './Node';

/**
 * @CLIENT-SERVER
 */
export default class DomainNode extends Node {
  /**
   * @type {string}
   */
  _domain;

  /**
   * @param {string} domain
   */
  constructor(domain) {
    super();
    this._domain = domain;
  }

  /**
   * @param {RoutingData} routingData
   * @returns {boolean}
   */
  evaluate(routingData) {
    return routingData.serverHttpRequest.getDomain() == this._domain;
  }

  /**
   * @param {ReverseRoutingData} reverseRoutingData
   */
  reverseEvaluate(reverseRoutingData) {
    reverseRoutingData.domain = this._domain;
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
    return node instanceof DomainNode && node._domain == this._domain;
  }
}