/**
 * SERVER
 *
 * Main entry file for server application.
 *
 * @SERVER
 */

import path from 'path';

import server from 'soya/lib/server';
import config from './config.js';

// Can't place these lines in config since config is run
// Haven't found a better way to do this yet. So for now, consider page and
// component directory as not configurable.
// TODO: Separate compilation and actual framework config so that these lines can be configurable from config.js.
var frameworkConfig = config.frameworkConfig;
frameworkConfig.absolutePageRequirePath = path.join(frameworkConfig.absoluteProjectDir, 'src/pages');
frameworkConfig.absoluteComponentRequirePath = path.join(frameworkConfig.absoluteProjectDir, 'src/components');
frameworkConfig.pageRequireContext = require.context('./src/pages', true, /\.js$/);
frameworkConfig.componentRequireContext = require.context('./src/components', true, /\.js$/);

// Run server.
server(config);