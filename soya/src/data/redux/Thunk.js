/**
 * Wraps user's thunk function with additional info so we can ensure that
 * no double fetching.
 *
 * @CLIENT_SERVER
 */
export default class Thunk {
  /**
   * @type {string}
   */
  queryId;

  /**
   * IMPORTANT NOTE: Must return Promise that resolves after dispatch is done
   * (action is properly processed by root reducer).
   *
   * @type {Function}
   */
  func;

  /**
   * @type {QueryDependencies}
   */
  dependencies;

  /**
   * @param {string} queryId
   */
  constructor(queryId) {
    this.queryId = queryId;
  }
}