/**
 * LOGGER CONFIGURATION
 *
 * Create and configure your logger here.
 *
 * @SERVER
 */

var Logger = require('../logger/Logger');

/**
 * @param {Object} serverConfig Server-side configuration.
 * @returns {Logger}
 */
export default function createLogger(serverConfig) {
  // Ideally you should change logger configuration depending on whether or
  // not we are in production.
  // TODO: Move debug settings to user configuration.
  return new Logger(false);
};