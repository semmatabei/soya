/**
 * Action creator interface, to be used by implementations of Container.
 *
 * @CLIENT_SERVER
 */
export default class ActionCreator {
  /**
   * Creates a load action that is ready to be dispatched. Method should also
   * read options (if given). Options may affect the behavior of the load
   * action.
   *
   * For example, if the option says "cache" - this may mean additional
   * calls for createLoadAction will return the same generated action until
   * the cache has expired.
   *
   * Another example, the option may tell the action creator to "keep-fresh",
   * which makes this action creator creates polling or web-socket connection
   * that frequently updates the value with a new one from the server.
   *
   * @param {any} query
   * @param {?Object} options
   * @return {Object | Function}
   */
  createLoadAction(query, options) {

  }
}