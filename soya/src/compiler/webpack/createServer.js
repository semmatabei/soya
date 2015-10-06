var Application = require('../../Application');
var WebpackCompiler = require('./WebpackCompiler');
var ComponentRegister = require('../../ComponentRegister');
var Router = require('../../router/Router');

/**
 * @param {Object} config
 * @param {any} webpack
 * @param {any} React
 * @param {Logger} logger
 * @param {ComponentRegister} register
 * @param {Router} router
 * @param {ErrorHandler} errorHandler
 * @param {Function} webpackDevMiddleware
 * @param {Function} webpackHotMiddleware
 *
 * @SERVER
 */
module.exports = function(config, webpack, React, logger, register, router,
                          errorHandler, webpackDevMiddleware, webpackHotMiddleware) {
  var frameworkConfig = config.frameworkConfig;
  var serverConfig = config.serverConfig;
  var clientConfig = config.clientConfig;

  if (!(register instanceof ComponentRegister)) {
    throw new Error('Given register is not an instance of ComponentRegister: ' + register);
  }
  if (!(router instanceof Router)) {
    throw new Error('Given router is not an instance of Router: ' + router);
  }

  var compiler = new WebpackCompiler(
    logger, frameworkConfig, webpack, React,
    webpackDevMiddleware, webpackHotMiddleware);

  var application = new Application(
    logger, register, router, errorHandler, compiler, frameworkConfig,
    serverConfig, clientConfig
  );
  application.start();
};