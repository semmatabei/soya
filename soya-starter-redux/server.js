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

createServer(config, webpack, React, logger, register, router, errorHandler);