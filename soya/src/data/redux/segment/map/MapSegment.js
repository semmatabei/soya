import Segment from '../../Segment.js';
import QueryOptionUtil from '../QueryOptionUtil.js';
import ActionNameUtil from '../ActionNameUtil.js';

/**
 * Promise implementation, in local variable so that our code can be natural.
 *
 * @type {Function}
 */
var Promise;

/**
 * Organizes pieces inside its segment as simple key-value map. This means
 * segment piece granularity is limited to top-level values (you cannot
 * query a particular field, for instance).
 *
 * @CLIENT_SERVER
 */
export default class MapSegment extends Segment {
  /**
   * @type {{[key: string]: {query: any; options: Object}}}
   */
  _queries;

  /**
   * @type {MapActionCreator}
   */
  _actionCreator;

  constructor() {
    this._queries = {};
    this._actionCreator = this._createActionCreator();
  }

  /**
   * Creates MapActionCreator implementation.
   *
   * ABSTRACT: To be overridden by child implementation.
   *
   * @param {Function} PromiseImpl
   * @return {MapActionCreator}
   */
  _createActionCreator() {

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
   * @return {MapActionCreator}
   */
  _getActionCreator() {
    return this._actionCreator;
  }

  /**
   * Child classes may want override merging behavior.
   *
   * @param {Object} optionA
   * @param {Object} optionB
   */
  _mergeOptions(optionA, optionB) {
    return QueryOptionUtil.mergeOptions(optionA, optionB);
  }

  /**
   * @param {Function} PromiseImpl
   */
  _activate(PromiseImpl) {
    Promise = PromiseImpl;
    this._actionCreator._setPromise(PromiseImpl);
  }

  /**
   * We need to store both queries and options for later use. If the query is
   * already registered, we merge its options.
   *
   * @param {any} query
   * @param {Object} options
   */
  _registerQuery(query, options) {
    options = QueryOptionUtil.initOptions(options);
    var queryId = this._generateQueryId(query);
    if (this._queries.hasOwnProperty(queryId)) {
      this._queries[queryId].options = this._mergeOptions(
        options, this._queries[queryId].options)
    } else {
      this._queries[queryId] = {
        query: query,
        options: options
      };
    }
  }

  /**
   * @param {string} queryId
   * @return {Object | Function}
   */
  _createHydrateAction(queryId) {
    var actionCreator = this._getActionCreator();
    return actionCreator.createLoadAction(
      this._queries[queryId].query,
      this._queries[queryId].options,
      true
    );
  }

  /**
   * @return {Function}
   */
  _getReducer() {
    var loadActionType = this._actionCreator._getActionType();
    return function(state, action) {
      var data, queryId;
      if (!state) return {};
      switch(action.type) {
        case loadActionType:
          data = action.payload;
          for () {

          }
          break;
        default:
          return state;
      }
    };
  }

  _getPieceObject(state, queryId) {

  }
}