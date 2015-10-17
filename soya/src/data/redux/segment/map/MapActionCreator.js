import ActionCreator from '../../ActionCreator.js';
import ActionNameUtil from '../ActionNameUtil.js';

var Promise;

/**
 * Abstract implementation, to be used in tandem with MapSegment. Handles
 * caching so that user only need to define the action creator.
 *
 * @CLIENT_SERVER
 */
export default class MapActionCreator extends ActionCreator {
  /**
   * @type {string}
   */
  _actionType;

  /**
   * @type {{[key: string]: {action: Object; expiry: number;}}}
   */
  _cache;

  /**
   * @param {string} segmentName
   */
  constructor(segmentName) {
    super();
    // Since segment name is guaranteed never to clash by ReduxStore, we can
    // safely use segment name as action type.
    this._actionType = ActionNameUtil.generate(segmentName, 'LOAD');
    this._cache = {};
  }

  /**
   * @param {any} query
   * @param {Object} options
   * @param {?boolean} forceLoad
   * @return {Object | Function}
   */
  createLoadAction(query, options, forceLoad) {
    forceLoad = forceLoad == null ? false : forceLoad;
    var queryId = this._generateQueryId(query);
    return this._createLoadActionWithQueryId(query, options, forceLoad, queryId);
  }

  /**
   * TODO: Implement caching.
   * TODO: Implement polling.
   *
   * @param {any} query
   * @param {options} options
   * @param {boolean} forceLoad
   * @param {string} queryId
   * @return {Object | Function}
   */
  _createLoadActionWithQueryId(query, options, forceLoad, queryId) {
    return this._createThunkAction(query, queryId);
  }

  /**
   * Returns a thunk function that returns a Promise. Returned function accepts
   * dispatch.
   *
   * ABSTRACT: To be overridden by child classes.
   *
   * @param {any} query
   * @param {string} queryId
   * @return {Function}
   */
  _createThunkAction(query, queryId) {

  }

  /**
   * Generates a unique string representing the given query. Same query must
   * generate identical strings. Query ID is used by ReduxStore and Segment
   * to recognize identical queries.
   *
   * ABSTRACT: To be overridden by child implementations.
   *
   * @param {any} query
   * @return {string}
   */
  _generateQueryId(query) {

  }

  /**
   * @param {Promise} PromiseImpl
   */
  _setPromise(PromiseImpl) {
    Promise = PromiseImpl;
  }

  /**
   * Called by MapSegment when creating its reducer.
   *
   * @return {string}
   */
  _getActionType() {
    return this._actionType;
  }
}