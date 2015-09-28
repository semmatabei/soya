import Config from '../Config.js';
import RenderResult from './RenderResult.js';
import ServerHttpRequest from '../http/ServerHttpRequest.js';
import ClientHttpRequest from '../http/ClientHttpRequest.js';

/**
 * Represents a web page with URL link. There are three different situations
 * where this class is used:
 *
 * 1. At server side, to generate HTML string.
 * 2. At client side after HTML is loaded, to create the main react element
 *    with the appropriate props so that it can start attaching event handlers.
 * 3. At client side at dynamic page change, to modify <head>, add JS and CSS
 *    dependencies, and render the main react component.
 *
 * NOTE: This class is supposed to be stateless. Only one instance is created
 * at server side and init() is only called once.
 *
 * @CLIENT-SERVER
 */
export default class Page {
  /**
   * This method is run in both server and client side. This method should
   * instantiate all dependencies using the given config object and static
   * factories. The logic that it does should be the same since dependency
   * creation is offload to static factories, which are replaced by their
   * client side version at code compilation process.
   *
   * NOTE: Since Page is supposed to be stateless, init method is not given any
   * request context. You are supposed to only instantiate dependencies that
   * are reusable in all requests.
   *
   * @param {Object} config
   * @param {PageRouter} router
   */
  constructor(config, router) {
    this.config = config;
    this.router = router;
  }

  /**
   * This method is also run in both server and client side. On server side,
   * framework code will generate a complete HTML document from RenderResult.
   * On client side, framework will just run the instantiated ReactComponent.
   *
   * NOTE: We need to use callback because we don't want the framework code
   * to depend on third party promise library.
   *
   * @param {ServerHttpRequest | ClientHttpRequest} httpRequest
   * @param {Object} routeArgs
   * @param {Function} complete
   */
  render(httpRequest, routeArgs, complete) {
    complete(new RenderResult());
  }
}
