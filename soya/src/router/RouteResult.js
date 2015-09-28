/**
 * @SERVER
 */
export default class RouteResult {
  /**
   * ID of the route, used in reverse routing.
   * @type {string}
   */
  routeId;

  /**
   * Name of the page.
   * @type {string}
   */
  pageName;

  /**
   * Route arguments.
   * @type {[key: string]: any}
   */
  routeArgs;
}