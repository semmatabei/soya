import CompileResult from './compiler/CompileResult';
import Compiler from './compiler/Compiler';
import Router from './router/Router';
import EntryPoint from './EntryPoint';
import ServerHttpRequest from './http/ServerHttpRequest';

var path = require('path');
var http = require('http');
var domain = require('domain');

var DEFAULT_FRAMEWORK_CONFIG = {
  port: 8000,
  minifyJs: false,
  clientReplace: {},
  clientResolve: [],
  absoluteComponentsDir: []
};

/**
 * Orchestrates all the things that makes the application server run:
 *
 * 1. Gets the list of entry points from ComponentRegister.
 * 2. Compiles the code with the given Compiler implementation.
 * 3. Create and run the server.
 * 4. Handles the requests.
 *
 * In handling the requests:
 *
 * 1. If handled by AssetServer implementation, return immediately.
 * 2. If not, use Router to determine which page to run.
 * 3. Ask Page to render, assemble HTML and return RenderResult.
 *
 * Uses node-js domain for error handling.
 *
 * TODO: Make every process async with Promise?
 *
 * This object is stateless, should not store ANY request-specific states.
 *
 * @SERVER
 */
export default class Application {
  /**
   * @type {Router}
   */
  _router;

  /**
   * @type {Object}
   */
  _frameworkConfig;

  /**
   * @type {Object}
   */
  _serverConfig;

  /**
   * @type {Object}
   */
  _clientConfig;

  /**
   * @type {Compiler}
   */
  _compiler;

  /**
   * @type {CompileResult}
   */
  _compileResult;

  /**
   * @type {ComponentRegister}
   */
  _componentRegister;

  /**
   * @type {AssetServer}
   */
  _assetServer;

  /**
   * @type {Array<EntryPoint>}
   */
  _entryPoints;

  /**
   * @type {{[key: string]: Page}}
   */
  _pages;

  /**
   * @type {ErrorHandler}
   */
  _errorHandler;

  /**
   * @type {Logger}
   */
  _logger;

  /**
   * The idea is to have middleware system that is compatible with express
   * middlewares. Since express middlewares are just functions accepting req,
   * res, and next - it should not be hard to make it compatible.
   * Kudos to the express team to make such an awesome framework btw.
   *
   * @type {Array<Function>}
   */
  _middlewares;

  /**
   * @param {Logger} logger
   * @param {ComponentRegister} componentRegister
   * @param {Router} router
   * @param {Compiler} compiler
   * @param {ErrorHandler} errorHandler
   * @param {Object} frameworkConfig
   * @param {Object} serverConfig
   * @param {Object} clientConfig
   */
  constructor(logger, componentRegister, router, errorHandler, compiler, frameworkConfig,
              serverConfig, clientConfig) {
    // Validate pages and set logger for Router. Logger is not provided at
    // constructor since we will replace Router with ReverseRouter for client.
    router.validatePages(componentRegister);
    router.setLogger(logger);

    // We need to add some values to client replace, but only if user hasn't
    // overridden our settings.
    if (!frameworkConfig.clientReplace.hasOwnProperty('soya/lib/router/Router')) {
      frameworkConfig.clientReplace['soya/lib/router/Router'] = 'soya/lib/router/PageRouter';
    }

    this._logger = logger;
    this._componentRegister = componentRegister;
    this._compiler = compiler;
    this._assetServer = this._compiler.getAssetServer();
    this._frameworkConfig = Object.assign({}, DEFAULT_FRAMEWORK_CONFIG, frameworkConfig);
    this._serverConfig = serverConfig;
    this._clientConfig = clientConfig;
    this._router = router;
    this._errorHandler = errorHandler;
    this._pages = {};
    this._entryPoints = [];

    var i, pageCmpt, page, pageComponents = componentRegister.getPages();
    var pageRouter = router.createPageRouter();
    for (i in pageComponents) {
      if (!pageComponents.hasOwnProperty(i)) continue;
      pageCmpt = pageComponents[i];

      // Create entry point.
      this._entryPoints.push(new EntryPoint(pageCmpt.name, pageCmpt.absDir));

      try {
        // Instantiate page.
        page = new pageCmpt.clazz(serverConfig, pageRouter);
      } catch (e) {
        throw new Error('Unable to instantiate page: ' + pageCmpt.name + ' at ' + pageCmpt.absDir);
      }

      this._pages[pageCmpt.name] = page;
    }

    this._middlewares = [];
  }

  /**
   * Compiles and then create an http server that handles requests.
   */
  run() {
    this.compile();
  }

  /**
   * Runs runtime compilation. This generates compilation result, which is the
   * list of CSS and JS dependencies of each page, so that server can render
   * the HTML page.
   */
  compile() {
    this._compiler.run(this._entryPoints, (compileResult) => {
      this._compileResult = compileResult;
      this.createServer();
    });
  }

  createServer() {
    // TODO: Config can set timeout for http requests.
    http.createServer((request, response) => {
      var d = domain.create().on('error', (error) => {
        this.handleError(error, request, response);
      });
      d.run(() => {
        var serverHttpRequest = new ServerHttpRequest(request);
        this.handle(serverHttpRequest, response);
      });
    }).listen(this._frameworkConfig.port);
    this._logger.info('Server listening at port: ' + this._frameworkConfig.port + '.');
  }

  /**
   * @param {ServerHttpRequest} httpRequest
   * @param {httpServerResponse} response
   */
  handle(httpRequest, response) {
    // Check if it's an asset request. If asset request pass through asset
    // container immediately.
    var handledByAssetServer = this._assetServer.handle(httpRequest, response);
    if (handledByAssetServer) {
      return;
    }

    // Else route through router to get the page instance.
    var routeResult = this._router.route(httpRequest);
    if (routeResult == null) {
      throw new Error('Unable to route request, router returned null');
    }

    var page = this._pages[routeResult.pageName];
    if (page == null) {
      throw new Error('Unable to route request, page ' + routeResult.pageName + ' doesn\'t exist');
    }

    page.render(httpRequest, routeResult.routeArgs, (renderResult) => {
      var pageDep = this._compileResult.pages[routeResult.pageName];
      if (!pageDep) {
        throw new Error('Unable to render page server side, dependencies unknown for entry point: ' + routeResult.componentName);
      }

      var htmlResult = this._compiler.assembleHtml(
        routeResult.pageName, routeResult.routeArgs, pageDep, renderResult,
        this._clientConfig, httpRequest.isSecure()
      );

      response.statusCode = renderResult.httpStatusCode;
      response.statusMessage = renderResult.httpStatusMessage;

      // TODO: Calculating content length as utf8 is hard-coded. This might be harmful, maybe move as configuration of the compiler?
      response.setHeader('Content-Length', Buffer.byteLength(htmlResult, 'utf8'));
      response.setHeader('Content-Type', 'text/html;charset=UTF-8');

      // Set result headers.
      var key, headerData = renderResult.httpHeaders.getAll();
      for (key in headerData) {
        if (!headerData.hasOwnProperty(key)) continue;
        response.setHeader(key, headerData[key]);
      }

      // Set result cookies.
      var values = [];
      for (key in renderResult.cookies) {
        if (!renderResult.cookies.hasOwnProperty(key)) continue;
        values.push(renderResult.cookies[key].toHeaderString());
      }
      response.setHeader('Set-Cookie', values);

      // Set result content.
      response.end(htmlResult);
    });
  }

  handleError(error, request, response) {
    if (response.headersSent) {
      this._errorHandler.responseSentError(error, request, response);
      return;
    }

    this._errorHandler.responseNotSentError(error, request, response);
  }
}