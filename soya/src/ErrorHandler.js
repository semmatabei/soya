/**
 * Ideally you should extend this woefully inadequate error handler with
 * something awesome that you have.
 *
 * SERIOUSLY: This error handler prints your error stack trace to the user.
 * Not cool for production bro - not cool at all.
 *
 * IMPORTANT NOTE: Exception thrown within this error handler is not caught
 * at all. This means if you throw exception here, or from async callback
 * executed from a sync code here - it will stop the server.
 *
 * @SERVER
 */
export default class ErrorHandler {
  _logger;

  /**
   * @param {Logger} logger
   */
  constructor(logger) {
    this._logger = logger;
  }

  /**
   * An uncaught exception at the request level, but headers are already sent
   * to the user. Nothing to do unless maybe to log.
   *
   * @param {Error} error
   * @param {http.incomingMessage} request
   * @param {httpServerResponse} response
   */
  responseSentError(error, request, response) {
    var preppedRequest = this._logger.prepRequest(request);
    var preppedResponse = this._logger.prepResponse(response);
    this._logger.error('Uncaught exception, headers already sent ->', error, [preppedRequest, preppedResponse]);
    // If headers are already sent, we have no need of actually doing
    // anything. Just close the connection already.
    try {
      response.end();
    } catch(e) {
      this._logger.error('Unable to end response to an uncaught exception ->', e, [error, preppedRequest, preppedResponse]);
    }
  }

  /**
   * An uncaught exception at the request level. Headers are not yet sent, so
   * you can actually dictate what to display (cue cute server error pages).
   *
   * @param {Error} error
   * @param {http.incomingMessage} request
   * @param {response} response
   */
  responseNotSentError(error, request, response) {
    var preppedRequest = this._logger.prepRequest(request);
    var preppedResponse = this._logger.prepResponse(response);
    this._logger.error('Uncaught exception ->', error, [preppedRequest, preppedResponse]);

    try {
      if (error instanceof Error) {
        // TODO: Awesome default error handler, similar to PHP's Whoops library.
        response.writeHead(500, {'Content-Type': 'text/html'});
        response.end('<pre>' + error.stack +  '</pre>');
      } else {
        response.end(error + '');
      }
    } catch (e) {
      this._logger.error('Unable to write error page for exception ->', e, [error, preppedRequest, preppedResponse]);
    }
  }
}