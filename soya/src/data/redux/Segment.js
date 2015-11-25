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
   * @param {Provider} provider
   * @param {CookieJar} cookieJar
   * @param {Promise} PromiseImpl
   */
  constructor(config, cookieJar, PromiseImpl) {
    // No-op. This constructor is only here to be interface.
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
   * Returns true
   *
   * @return {boolean}
   */
  static shouldHydrate() {
    return true;
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