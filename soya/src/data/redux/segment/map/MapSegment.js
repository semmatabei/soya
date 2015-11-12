import Segment from '../../Segment.js';
import QueryOptionUtil from '../QueryOptionUtil.js';
import MapActionCreator from './MapActionCreator.js';

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
   * @param config
   * @param provider
   * @param PromiseImpl
   */
  constructor(config, provider, PromiseImpl) {
    super(config, provider, PromiseImpl);
    Promise = PromiseImpl;
    this._actionCreator = this._createActionCreator();
    if (!(this._actionCreator instanceof MapActionCreator)) {
      throw new Error('MapSegment must be used in tandem with MapActionCreator.');
    }
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
   * We need to store both queries and options for later use. If the query is
   * already registered, we merge its options.
   *
   * @param {any} query
   * @param {Object} options
   * @return {string}
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
    return queryId;
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
   * @param {string} queryId
   * @return {Object}
   */
  _createInitAction(queryId) {
    return this._actionCreator._createInitActionObject(queryId);
  }

  /**
   * @return {Object}
   */
  _createCleanAction() {
    return this._actionCreator._createCleanAction();
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
   * @return {any}
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
    // If state is equal, nothing has changed, since our reducer always
    // re-creates the object.
    if (this._isStateEqual(prevSegmentState, segmentState)) {
      return null;
    }

    // Test the query ID, it could be that this query hasn't changed.
    if (prevSegmentState[queryId] === segmentState[queryId]) {
      return null;
    }

    // Otherwise, state has changed, return piece object.
    return this._getPieceObject(segmentState, queryId);
  }

  /**
   * @return {Function}
   */
  _getReducer() {
    var loadActionType = this._actionCreator._getLoadActionType();
    var initActionType = this._actionCreator._getInitActionType();
    var cleanActionType = this._actionCreator._getCleanActionType();
    return (state, action) => {
      // If state is undefined, return initial state.
      if (!state) state = {};
      var newState, isUninitialized;
      switch(action.type) {
        case cleanActionType:
          // Nullifies the segment:
          return {};
          break;
        case loadActionType:
          // Replace the map entry with the new loaded one.
          newState = this._createNewStateObj(state);
          newState[action.queryId] = action.payload;
          return newState;
          break;
        case initActionType:
          isUninitialized = (!state[action.queryId] || !state[action.queryId].loaded);
          if (isUninitialized) {
            newState = this._createNewStateObj(state);
            newState[action.queryId] = action.payload;
            return newState;
          }
          break;
      }
      return state;
    };
  }

  /**
   * Create a new object, redux store state is supposed to immutable!
   *
   * @param {Object} state
   * @return {Object}
   */
  _createNewStateObj(state) {
    var newState = {}, queryId;
    for (queryId in state) {
      if (!state.hasOwnProperty(queryId)) continue;
      newState[queryId] = state[queryId];
    }
    return newState;
  }
}