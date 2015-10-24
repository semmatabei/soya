/**
 * SERVER
 *
 * Main entry file for server application.
 *
 * @SERVER
 */

import path from 'path';
import fs from 'fs';

import server from 'soya/lib/server';
import config from './config.js';

// Can't place these lines in config since config is run
// Haven't found a better way to do this yet. So for now, consider page and
// component directory as non configurable for now.
// TODO: Separate compilation and actual framework config so that these lines can be configurable from config.js.
var frameworkConfig = config.frameworkConfig;
frameworkConfig.absolutePageRequirePath = path.join(frameworkConfig.absoluteProjectDir, 'src/pages');
frameworkConfig.absoluteComponentRequirePath = path.join(frameworkConfig.absoluteProjectDir, 'src/components');
frameworkConfig.pageRequireContext = require.context('./src/pages', true, /\.js$/);
frameworkConfig.componentRequireContext = require.context('./src/components', true, /\.js$/);

// Also haven't found a better way to do load custom logger, error handler,
// and node registration. We need to explicitly require them so that webpack
// can add it to the server bundle. Consider these as non configurable for now.
var replacementContext = require.context('./', false, /(nodes|error|logger)\.js$/);
var nodeRegistrationAbsPath = path.join(frameworkConfig.absoluteProjectDir, './nodes.js');
var foundArray = replacementContext.keys();
if (foundArray.indexOf('./error.js') > -1) {
  frameworkConfig.errorHandlerFactoryFunction = replacementContext('./error.js');
}
if (foundArray.indexOf('./logger.js') > -1) {
  frameworkConfig.errorHandlerFactoryFunction = replacementContext('./logger.js');
}
if (foundArray.indexOf('./nodes.js') > -1) {
  frameworkConfig.routerNodeRegistrationFunction = replacementContext('./nodes.js');
  frameworkConfig.routerNodeRegistrationAbsolutePath = nodeRegistrationAbsPath;
}

// Run server.
server(config);