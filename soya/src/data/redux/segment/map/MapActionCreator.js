import ActionCreator from '../../ActionCreator.js';
import ActionNameUtil from '../ActionNameUtil.js';

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
    this._loadActionType = ActionNameUtil.generate(segmentName, 'LOAD');
    this._initActionType = ActionNameUtil.generate(segmentName, 'INIT');
    this._cleanActionType = ActionNameUtil.generate(segmentName, 'CLEAN');
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
   * TODO: Mark all public methods as @public to avoid API confusion.
   * @return {Object}
   */
  _createCleanAction() {
    return {
      type: this._cleanActionType
    };
  }

  /**
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
      type: this._getLoadActionType(),
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
  _createInitActionObject(queryId) {
    return {
      type: this._getInitActionType(),
      queryId: queryId,
      payload: {
        data: null,
        errors: null,
        loaded: false
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
   */
  _generateQueryId(query) {

  }

  /**
   * Called by MapSegment when creating its reducer.
   *
   * @return {string}
   */
  _getLoadActionType() {
    return this._loadActionType;
  }

  /**
   * @returns {string}
   */
  _getInitActionType() {
    return this._initActionType;
  }

  /**
   * @returns {string}
   */
  _getCleanActionType() {
    return this._cleanActionType;
  }
}