/**
 * Default logging class. Logging is by default asynchronous, but no callbacks
 * will be called (why should you?). Please note that this class is only used
 * by the framework to log on server. It does not dictate how other library
 * might log their info/error messages.
 *
 * Logging levels shamelessly copied from Seldaek's awesome PHP Monolog library.
 *
 * IMPORTANT NOTE: It is assumed that calls to log will not be treated as a
 * potentially dangerous call (i.e. calls will not be wrapped in try catch).
 * You should think about your own use case, that is, whether or not to throw
 * exception is logging fails.
 *
 * @SERVER
 */
export default class Logger {
  shouldDebug;

  /**
   * TODO: Make it so that by setting error logging settings, we can determine which messages to actually log.
   * @param {boolean} isProduction
   */
  constructor(isProduction) {
    this.shouldDebug = !isProduction;
  }

  /**
   * Prep node's incoming message object for logging. You can override this
   * method to log just the right amount of information.
   *
   * @param {http.incomingMessage} httpRequest
   * @return {Array<string>}
   */
  prepRequest(httpRequest) {
    return [
      httpRequest.method,
      httpRequest.url,
      httpRequest.headers
    ];
  }

  /**
   * Prep node's http server response object for logging. You can override this
   * method to log just the right amount of information.
   *
   * @param {httpServerResponse} response
   */
  prepResponse(response) {
    // TODO: Modify the framework so we can at least show the body?
    // Node unfortunately doesn't allow us to show what is already sent to
    // the user, so there isn't much information we can log here.
    return [
      response.statusCode,
      response.statusMessage
    ];
  }

  /**
   * Detailed debug information. Ignored in production.
   */
  debug(message, error, extras) {
    if (shouldDebug) this._print('[DEBUG] ' + message, error, extras);
  }

  /**
   * Normal events. Example: user logs in, SQL logs.
   */
  info(message, error, extras) {
    this._print('[INFO] ' + message, error, extras);
  }

  /**
   * Normal but interesting events.
   */
  notice(message, error, extras) {
    this._print('[NOTICE] ' + message, error, extras);
  }

  /**
   * Exceptional occurrences that are not errors. Example: usage of deprecated
   * APIs, poor use of API, undesirable things that are not errors (yet).
   */
  warning(message, error, extras) {
    this._print('[WARNING] ' + message, error, extras);
  }

  /**
   * Runtime errors that do not require immediate action but nevertheless should
   * be logged and monitored.
   */
  error(message, error, extras) {
    this._print('[ERROR] ' + message, error, extras);
  }

  /**
   * Action must be taken immediately. Example: entire website down, state in
   * server is undefined so that it needs to be restarted, database unavailable,
   * ideally you should override this method to send yourself an SMS to wake
   * you up.
   */
  alert(message, error, extras) {
    this._print('[ALERT] ' + message, error, extras);
  }

  /**
   * Your pantsu is on fire.
   */
  emergency(message, error, extras) {
    this._print('[EMERGENCY] ' + message, error, extras);
  }

  _print(message, error, extras) {
    console.log(message, error ? (error.stack ? error.stack : error) : '', extras ? extras : '');
  }
}