/**
 * Used to store context-agnostic dependencies, object instances
 * (services, router, etc.) and data (config, etc.).
 *
 * @CLIENT_SERVER
 */
export default class Provider {
  /**
   * @type {ReverseRouter}
   */
  _router;

  /**
   * @type {Object}
   */
  _config;

  /**
   * @type {{[key: string}: Function}}
   */
  _factories;

  /**
   * @type {{[key: string]: any}}
   */
  _cache;

  /**
   * @type {boolean}
   */
  _isServerInstance;

  /**
   * @param {Object} config
   * @param {ReverseRouter} router
   * @param {boolean} isServerInstance
   */
  constructor(config, router, isServerInstance) {
    this._config = config;
    this._router = router;
    this._cache = {};
    this._factories = {};
    this._isServerInstance = isServerInstance;
  }

  /**
   * @param {Function} factory
   */
  provide(factory) {
    var name = factory.factoryName;
    if (typeof name != 'string') {
      throw new Error('Factory registered doesn\'t have a name: ' + factory + '.');
    }
    if (this._factories.hasOwnProperty(name)) {
      if (this._factories[name] == factory) {
        // Return cache if the factory is the same.
        return this._cache[name];
      }
      if (this._isServerInstance) {
        // Disallow replacement of factories at server side. The same Provider
        // instance is shared with plenty of requests at server side. We don't
        // want anything fishy to happen.
        throw new Error('Factory name clash! The name \'' + name + '\' is claimed by two different factories!');
      }
    }

    // Allow replacement of factories if at client side. This comes in handy if
    // the user is hot reloading factories. Since new page instances are created
    // per request anyway, this doesn't matter in client.
    this._factories[name] = factory;
    this._cache = factory(this._config);
  }

  /**
   * @returns {ReverseRouter}
   */
  getRouter() {
    return this._router;
  }

  /**
   * @returns {Object}
   */
  getConfig() {
    return this._config;
  }
}