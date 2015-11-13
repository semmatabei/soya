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
   * @type {Object}
   */
  _actionCreator;

  /**
   * @type {string}
   */
  _loadActionType;

  /**
   * @type {string}
   */
  _initActionType;

  /**
   * @type {string}
   */
  _cleanActionType;

  /**
   * @param config
   * @param provider
   * @param PromiseImpl
   */
  constructor(config, provider, PromiseImpl) {
    super(config, provider, PromiseImpl);
    Promise = PromiseImpl;

    // Since segment name is guaranteed never to clash by ReduxStore, we can
    // safely use segment name as action type.
    var id = this.constructor.id();
    this._loadActionType = ActionNameUtil.generate(id, 'LOAD');
    this._initActionType = ActionNameUtil.generate(id, 'INIT');
    this._cleanActionType = ActionNameUtil.generate(id, 'CLEAN');

    this._queries = {};
    this._promises = {};
    this._actionCreator = {
      load: (query) => {
        var queryId = this._generateQueryId(query);
        return this._createThunk(query, queryId);
      }
    };
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
   * @private
   */
  _generateQueryId(query) {
    throw new Error('User must override this _generateQueryId method! Instance: ' + this + '.');
  }

  /**
   * Fetches query result from external source, returns a Redux thunk function
   * that may be wrapped with QueryDependencies.
   *
   * IMPORTANT NOTE: The thunk function must do the dispatch, and return a
   * Promise that resolves *after* dispatch is done.
   *
   * ABSTRACT: To be overridden by child implementations.
   *
   * @param {any} query
   * @param {string} queryId
   * @return {Function}
   * @private
   */
  _createThunk(query, queryId) {
    throw new Error('User must override _fetch method! Instance: ' + this + '.');
  }

  /**
   * We need to store both queries and options for later use. If the query is
   * already registered, we merge its options.
   *
   * @param {any} query
   * @return {string}
   */
  _registerQuery(query) {
    var queryId = this._generateQueryId(query);
    if (!this._queries.hasOwnProperty(queryId)) {
      this._queries[queryId] = query;
    }
    return queryId;
  }

  /**
   * @param {string} queryId
   * @return {Object | Thunk}
   */
  _createLoadAction(queryId) {
    var query = this._queries[queryId];
    return this._createThunk(query, queryId);
  }

  /**
   * Creates an action object with the given state payload.
   *
   * IMPORTANT NOTE: Please make sure that you return a *new* object, as redux
   * store states are supposed to be immutable.
   *
   * @param {string} queryId
   * @param {void | any} payload
   * @param {void | Array<any>} errors
   * @return {Object}
   */
  _createLoadActionObject(queryId, payload, errors) {
    return {
      type: this._loadActionType,
      queryId: queryId,
      payload: {
        data: payload,
        errors: errors,
        loaded: true
      }
    };
  }

  /**
   * @param {string} queryId
   * @return {Object}
   */
  _createInitAction(queryId) {
    return {
      type: this._initActionType,
      queryId: queryId,
      payload: {
        data: null,
        errors: null,
        loaded: false
      }
    };
  }

  /**
   * @return {Object}
   */
  _createCleanAction() {
    return {
      type: this._cleanActionType
    };
  }

  /**
   * @return {Object}
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
    var loadActionType = this._loadActionType;
    var initActionType = this._initActionType;
    var cleanActionType = this._cleanActionType;
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