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
   * Called by ReduxStore when this Segment is registered.
   *
   * IMPORTANT NOTE: This operation should be idempotent.
   *
   * @param {Function} PromiseImpl
   */
  _activate(PromiseImpl) {

  }

  /**
   * Called by ReduxStore when no component subscribes to this Segment anymore.
   * This is used to stop polling or other background processes that might
   * be running.
   *
   * IMPORTANT NOTE: This operation should be idempotent;
   */
  _deactivate() {

  }

  /**
   * Called by ReduxStore when no component subscribes to the given Segment
   * query anymore. This is used to stop polling or other background processes
   * related to the given query.
   *
   * IMPORTANT NOTE: This operation should be idempotent.
   *
   * @param {string} queryId
   */
  _deactivateQuery(queryId) {

  }

  /**
   * Returns query ID. To be used by ReduxStore in identifying queries.
   *
   * @param {any} query
   * @param {Object} options
   * @return {string}
   */
  _registerQuery(query, options) {

  }

  /**
   * Returns a basic payload object to populate the segment piece with initial
   * structure. Segment's reducer should ignore this action if the piece is
   * already populated.
   *
   * @param {string} queryId
   * @return {Object}
   */
  _createInitAction(queryId) {

  }

  /**
   * Returns a basic payload object that nullifies the segment data. This is
   * called when hot reloading a change in Segment.
   *
   * @return {Object}
   */
  _createCleanAction() {

  }

  /**
   * Uses action creator to create load action of the given query.
   *
   * @param {string} queryId
   * @return {Object | Function}
   */
  _createHydrateAction(queryId) {

  }

  /**
   * Get the segment name. Segment's name is hard-coded by each segment
   * implementation and must never change.
   *
   * @return {string}
   */
  _getName() {
    return '';
  }

  /**
   * When called, returns the ActionCreator instance. Unlike reducer,
   * ActionCreator can be a stateful object. This is allowed since ActionCreator
   * has to deal with caching and AJAX requests.
   *
   * @return {ActionCreator}
   */
  _getActionCreator() {

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
}