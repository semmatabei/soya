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
   * @type {{[key: string]: {query: any; options: Object}}}
   */
  _queries;

  /**
   * @param {string} segmentName
   */
  constructor(segmentName) {
    this._queries = {};
    // Since segment name is guaranteed never to clash by ReduxStore, we can
    // safely use segment name as action type.
    this._actionType = ActionNameUtil.generate(segmentName, 'LOAD');
  }

  createLoadAction(query, options, forceLoad) {

  }

  /**
   * Fetches the data, returns a promise that resolves to the data payload.
   *
   * ABSTRACT: To be overridden by child classes.
   *
   * @param query
   * @return {Promise}
   */
  _fetchData(query) {

  }

  _registerQuery() {

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