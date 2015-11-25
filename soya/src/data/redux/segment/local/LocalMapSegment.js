import Segment from '../../Segment.js';
import ActionNameUtil from '../ActionNameUtil.js';

var Promise;

/**
 * Can be used by client if they have synchronous, non AJAX-call state that they
 * want to place at redux store. Components will be able to query this
 *
 * @CLIENT_SERVER
 */
export default class LocalMapSegment extends Segment {
  /**
   * @type {Object}
   */
  _config;

  /**
   * @type {CookieJar}
   */
  _cookieJar;

  /**
   * @type {string}
   */
  _initActionType;

  /**
   * @type {string}
   */
  _cleanActionType;

  /**
   * @type {string}
   */
  _setActionType;

  /**
   * @param {Object} config
   * @param {CookieJar} cookieJar
   * @param {Promise} PromiseImpl
   */
  constructor(config, cookieJar, PromiseImpl) {
    super(config, cookieJar, PromiseImpl);
    this._config = config;
    this._cookieJar = cookieJar;

    // Since segment name is guaranteed never to clash by ReduxStore, we can
    // safely use segment name as action type.
    var id = this.constructor.id();
    this._initActionType = ActionNameUtil.generate(id, 'INIT');
    this._cleanActionType = ActionNameUtil.generate(id, 'CLEAN');
    this._setActionType = ActionNameUtil.generate(id, 'SET');
  }

  /**
   * @return {?Object}
   */
  static createInitialData() {
    return {};
  }

  /**
   * @param {string} queryId
   * @return {Object}
   */
  _createSyncInitAction(queryId) {
    return {
      type: this._initActionType,
      queryId: queryId,
      payload: null
    };
  }

  /**
   * @return {Object}
   */
  _createSyncCleanAction() {
    return {
      type: this._cleanActionType
    };
  }

  /**
   * Returns an object containing data and errors.
   *
   * @param {any} state
   * @param {string} queryId
   * @return {{data: ?any; errors: ?any}}
   */
  _getPieceObject(state, queryId) {

  }

  /**
   * Compares two segment states, returns true if the segment state is
   * different.
   *
   * @param {any} segmentStateA
   * @param {any} segmentStateB
   * @return {boolean}
   */
  _isStateEqual(segmentStateA, segmentStateB) {

  }

  /**
   * Compares pieces of two state. If they are equal return null, otherwise
   * return piece of the current segment state.
   *
   * @param prevSegmentState
   * @param segmentState
   * @param queryId
   * @return {?{data: ?any; errors: ?any}}
   */
  _comparePiece(prevSegmentState, segmentState, queryId) {

  }

  /**
   * Returns a reducer function. Called only once by Store, on registration
   * of a new segment.
   *
   * Reducer is responsible for:
   * 1) Initializing default segment state.
   * 2) Handling changes to segment state.
   *
   * NOTE: We could easily convert this into reduce() method. However in the
   * spirit of redux, reducers should be stateless functions. Let state of
   * subscription, queries, etc. be handled by others. We're making it
   * much simpler this way, methinks.
   *
   * @return {Function}
   */
  _getReducer() {

  }

  /**
   * Returns an object containing action functions. Unlike reducer,
   * ActionCreator can be stateful objects. This is allowed since ActionCreator
   * has to deal with caching and AJAX requests.
   *
   * @return {Object}
   */
  _getActionCreator() {

  }
}