import Segment from '../../Segment.js';
import QueryOptionUtil from '../QueryOptionUtil.js';

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

  /**
   *
   */
  constructor() {
    super();
    this._queries = {};
  }

  /**
   * Creates MapActionCreator implementation. Will only be called once.
   *
   * ABSTRACT: To be overridden by child implementation.
   *
   * @return {MapActionCreator}
   */
  _createActionCreator() {

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
    if (!this._actionCreator) {
      this._actionCreator = this._createActionCreator();
    }
    if (!(this._actionCreator instanceof MapActionCreator)) {
      throw new Error('MapSegment must be used in tandem with MapActionCreator.');
    }
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
    var queryId = this._actionCreator._generateQueryId(query);
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
    return this._actionCreator.createLoadAction(
      this._queries[queryId].query,
      this._queries[queryId].options,
      true
    );
  }

  /**
   * @return {MapActionCreator}
   */
  _getActionCreator() {
    return this._actionCreator;
  }

  /**
   * @param {Object} state
   * @param {string} queryId
   */
  _getPieceObject(state, queryId) {
    return state[queryId];
  }

  /**
   * @param {any} segmentStateA
   * @param {any} segmentStateB
   * @return {boolean}
   */
  _isStateEqual(segmentStateA, segmentStateB) {
    // We're not using immutable because we store simple maps.
    return segmentStateA === segmentStateB;
  }

  /**
   * @param prevSegmentState
   * @param segmentState
   * @param queryId
   * @return {?{data: ?any; errors: ?any}}
   */
  _comparePiece(prevSegmentState, segmentState, queryId) {
    if (this._isStateEqual(prevSegmentState, segmentState)) {
      return null;
    }
    return this._getPieceObject(segmentState, queryId);
  }

  /**
   * @return {Function}
   */
  _getReducer() {
    var loadActionType = this._actionCreator._getActionType();
    return function(state, action) {
      var queryId, newState = {};
      if (!state) return newState;
      switch(action.type) {
        case loadActionType:
          for (queryId in state) {
            if (!state.hasOwnProperty(queryId)) continue;
            newState[queryId] = state[queryId];
          }
          newState[action.queryId] = action.payload;
          return newState;
          break;
        default:
          return state;
      }
    };
  }
}