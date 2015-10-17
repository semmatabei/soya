/**
 * WEBPACK CONFIG
 *
 * Webpack config generation for server side code. Client side code is later
 * compiled at runtime by server side code.
 *
 * @SERVER
 */

var webpack = require('webpack');
var path = require('path');
var WebpackCompiler = require('soya/lib/compiler/webpack/WebpackCompiler');

var config = require('./config');
var webpackConfig = WebpackCompiler.createServerBuildConfig(webpack, config.frameworkConfig);
module.exports = webpackConfig;