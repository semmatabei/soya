/**
 * SERVER
 *
 * Main entry file for server application.
 *
 * @SERVER
 */

var React = require('react');
var path = require('path');
var webpack = require('webpack');
var config = require('./config.js');
var createServer = require('soya/lib/compiler/webpack/createServer');

var logger = require('./logger')(config);
var register = require('./register')(config, logger);
var errorHandler = require('./error')(config, logger);
var router = require('./router')(config.serverConfig);

// TODO: Figure out how to handle dev and prod server.js - prod version should not load webpack dev/hot middleware.
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

createServer(config, webpack, React, logger, register, router, errorHandler, webpackDevMiddleware, webpackHotMiddleware);