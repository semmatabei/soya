import ContentRenderer from '../ContentRenderer.js';

/**
 * Accepts an object and turns it into JSON.
 *
 * @SERVER
 */
export default class JsonRenderer extends ContentRenderer {
  /**
   * @type {any}
   */
  payload;

  /**
   * @param {any} payload
   */
  constructor(payload) {
    super();
    this.payload = payload;
  }

  /**
   * @param {Object} routeArgs
   * @param {Object} routes
   * @param {Object} clientConfig
   * @param {any} hydratedState
   * @param {Object} pageDependencies
   * @returns {string}
   */
  render(routeArgs, routes, clientConfig, hydratedState, pageDependencies) {
    return JSON.stringify(this.payload);
  }
}