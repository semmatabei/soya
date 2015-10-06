/**
 * ROUTER FILE
 *
 * Load custom route nodes and register all your routes here. Note that this
 * file will be loaded to client for reverse routing purposes, so don't store
 * sensitive information here.
 *
 * @CLIENT-SERVER
 */

var Router = require('soya/lib/router/Router');
var n = require('soya/lib/router/helper');

/**
 * @param {Object} config Either client-side or server-side config object.
 * @returns {Router}
 */
module.exports = function(config) {
  var router = new Router();
  router.set404NotFoundPage('NotFound');
  router.reg('TODO_PAGE', 'TodoPage', [n.GET()], '/', []);
  return router;
};