import DomainNode from './DomainNode.js';
import MethodNode from './MethodNode.js';

/**
 * @CLIENT-SERVER
 */
export default {
  /**
   * @returns {MethodNode}
   */
  POST() {
    return new MethodNode('POST');
  },

  /**
   * @returns {MethodNode}
   */
  GET() {
    return new MethodNode('GET');
  },

  /**
   * @returns {MethodNode}
   */
  PUT() {
    return new MethodNode('PUT');
  },

  /**
   * @returns {MethodNode}
   */
  HEAD() {
    return new MethodNode('HEAD');
  },

  /**
   * @returns {MethodNode}
   */
  DELETE() {
    return new MethodNode('DELETE');
  },

  /**
   * @param {string} domain
   * @returns {DomainNode}
   */
  Domain(domain) {
    return new DomainNode(domain);
  },

  /**
   * @param method
   * @returns {MethodNode}
   */
  Method(method) {
    return new MethodNode(method);
  }
};