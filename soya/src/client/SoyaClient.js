import ReverseRouter from '../router/ReverseRouter.js';
import NodeFactory from '../router/NodeFactory.js';
import DomainNode from '../router/DomainNode.js';
import MethodNode from '../router/MethodNode.js';
import PathNode from '../router/PathNode.js';
import ClientHttpRequest from '../http/ClientHttpRequest.js';

// The reason we use full path is to make webpack's resolve.alias work.
// We need to replace custom node registration with user file so that
// custom nodes can be loaded in both client and server side.
import registerRouteNodes from 'soya/lib/server/registerRouterNodes.js';

/**
 * Responsible for client runtime.
 *
 * @CLIENT
 */
export default class SoyaClient {
  /**
   * @type {{[key: string]: Page}}
   */
  _pages;

  /**
   * @type {Object}
   */
  _clientConfig;

  /**
   * @type {ReverseRouter}
   */
  _reverseRouter;

  /**
   * @param {Object} clientConfig
   */
  constructor(clientConfig) {
    this._clientConfig = clientConfig;
    var nodeFactory = new NodeFactory();
    nodeFactory.registerNodeType(DomainNode);
    nodeFactory.registerNodeType(MethodNode);
    nodeFactory.registerNodeType(PathNode);

    // TODO: Make sure swapping for custom nodes also work at client side.
    registerRouteNodes(nodeFactory);

    this._reverseRouter = new ReverseRouter(nodeFactory);
    this._pages = {};
  }

  /**
   * @param {{[key: string]: Array<Array<any>>}} routeConfigMap
   */
  addRouteConfig(routeConfigMap) {
    if (!routeConfigMap) return;
    var routeId;
    for (routeId in routeConfigMap) {
      this._reverseRouter.reg(routeId, routeConfigMap[routeId]);
    }
  }

  /**
   * @param {Function} pageClass
   */
  register(pageClass) {
    // We do overrides just in case there are updates.
    // TODO: Figure out history API navigation.
    this._pages[pageClass.pageName] = new pageClass(config, this._reverseRouter);
  }

  /**
   * @param {string} name
   * @param {Object} routeArgs
   * @param {?any} hydratedState
   */
  navigate(name, routeArgs, hydratedState) {
    var page = this._pages[name];
    if (!page) {
      throw new Error('Navigate call to non-existent or non-loaded page: ' + name);
    }
    var httpRequest = new ClientHttpRequest();
    var callback = function(renderResult) {
      // TODO: How to do double rendering for store? Should we just render?
      window.renderResult = renderResult;
      renderResult.contentRenderer.render();
    };
    page.render(httpRequest, routeArgs, callback, hydratedState);
  }
}