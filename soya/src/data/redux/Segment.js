/**
 * This interface is needed to bridge between different segment implementations
 * with Soya's ReduxStore implementation.
 *
 * Segment represents a segment of our unified store tree, specifically, a top
 * level key in our state tree:
 *
 * <pre>
 *   state = {
 *     segmentA: {...},
 *     segmentB: [...],
 *     ...
 *   };
 * </pre>
 *
 * IMPORTANT NOTE: All methods described here is considered non public and
 * should be overridden by child class.
 *
 * @CLIENT_SERVER
 */
export default class Segment {
  /**
   * @param {Object} config
   * @param {CookieJar} cookieJar
   * @param {Object} dependencyActionCreatorMap
   * @param {Promise} PromiseImpl
   */
  constructor(config, cookieJar, dependencyActionCreatorMap, PromiseImpl) {
    this._config = config;
    this._cookieJar = cookieJar;
    this._dependencyActionCreators = dependencyActionCreatorMap;
  }

  /**
   * Returns an array of Segment classes that this Segment has dependencies to.
   * Child classes can override this static method to declare their Segment
   * dependencies.
   *
   * @returns {Array<Class<Segment>}
   */
  static getSegmentDependencies() {
    return [];
  }

  /**
   * Get the segment name. Segment's name is hard-coded by each segment
   * implementation and must never change.
   *
   * @return {string}
   */
  static id() {
    throw new Error('Segment implementation must provide ID!');
  }

  /**
   * Returns true if this segment requires hydration. Locally stored segments
   * will probably not require any hydration.
   *
   * @return {boolean}
   */
  static shouldHydrate() {
    return true;
  }

  /**
   * Returns true if the given piece is already loaded. Segments that do not
   * load anything should always return true.
   *
   * @param {any} piece
   * @return {boolean}
   */
  _isLoaded(piece) {

  }

  /**
   * The generated query ID needs to be string since it'll be used by ReduxStore
   * to store query-related data.
   *
   * @param {any} query
   * @return {string}
   */
  _generateQueryId(query) {

  }

  /**
   * Returns a basic payload object to populate the segment piece with initial
   * structure. Segment's reducer should ignore this action if the piece is
   * already populated or loaded.
   *
   * @param {string} queryId
   * @return {Object}
   */
  _createSyncInitAction(queryId) {

  }

  /**
   * Returns a basic payload object that nullifies the segment data. This is
   * called when hot reloading a change in Segment.
   *
   * @return {Object}
   */
  _createSyncCleanAction() {

  }

  /**
   * Uses action creator to create load action of the given query.
   *
   * @param {any} query
   * @param {string} queryId
   * @return {void | Object | Thunk}
   */
  _createLoadAction(query, queryId) {

  }

  /**
   * Returns an object containing data and errors.
   *
   * @param {any} state
   * @param {string} queryId
   * @return {any}
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
   * return an array containing the current segment piece.
   *
   * @param prevSegmentState
   * @param segmentState
   * @param queryId
   * @return {?Array<any>}
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

  /**
   * Processes the refresh requests according to the given state and generates
   * list of queries that must be run with cache turned off.
   *
   * @param {?} segmentState
   * @param {?} refreshRequests
   * @returns {Array<?>}
   */
  _processRefreshRequests(segmentState, refreshRequests) {
    return [];
  }
}