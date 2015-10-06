/**
 * COMPONENT/MODULE REGISTRATION
 *
 * 1. Create a register of pages and components.
 * 2. Load all pages and components here at runtime.
 * 3. Webpack will pack all possible combinations to our server build using
 *    request context.
 *
 * @SERVER
 */

var ComponentRegister = require('soya/lib/ComponentRegister');
var ComponentFinder = require('soya/lib/ComponentFinder');
var path = require('path');

/**
 * @param {Object} config
 * @param {Logger} logger
 * @returns {ComponentRegister}
 */
module.exports = function(config, logger) {
  var register = new ComponentRegister(logger);
  var finder = new ComponentFinder(logger);
  var projectDir = config.frameworkConfig.absoluteProjectDir;
  var requirePage = require.context('./src/pages', true, /\.js$/);
  var requireCmpt = require.context('./src/components', true, /\.js$/);

  finder.find(path.join(projectDir, './src/pages'), function(vendor, name, absDir, relativeDir) {
    register.regPage(name, absDir, requirePage('./' + path.join(relativeDir, name + '.js')));
  });

  finder.find(path.join(projectDir, './src/components'), function(vendor, name, absDir, relativeDir) {
    register.regComponent(vendor, name, absDir, requireCmpt('./' + path.join('./', relativeDir, name + '.js')))
  });

  return register;
};