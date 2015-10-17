/**
 * LOGGER CONFIGURATION
 *
 * Create and configure your logger here.
 *
 * @SERVER
 */

var Logger = require('soya/lib/logger/Logger');

/**
 * @param {Object} config Server-side configuration.
 * @returns {Logger}
 */
module.exports = function(config) {
  // Ideally you should change logger configuration depending on whether or
  // not we are in production.
  return new Logger(false);
};