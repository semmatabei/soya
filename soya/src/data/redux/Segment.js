/**
 * This interface is needed to bridge between different segment implementations
 * with Soya's ReduxStore implementation.
 *
 * Segment implementation here is just a static object with actionCreator and
 * reducer as its properties. It represents a segment of our unified store tree,
 * a top level key in our state tree.
 *
 * @CLIENT_SERVER
 */
export default class Segment {
  constructor(query, options) {
    this.registerQuery(query, options);
  }

  /**
   * Registers the query
   *
   * @param {any} query
   * @return {Function}
   */
  registerQuery(query, options) {

  }

  getQueries() {

  }

  /**
   * Get the segment name. Segment's name
   *
   * @return {string}
   */
  getName() {
    return '';
  }

  /**
   * When called, returns the ActionCreator class.
   *
   * IMPORTANT: To be overridden by implementations.
   *
   * @override
   * @return {Function}
   */
  getActionCreator() {

  }

  /**
   * @override
   */
  getReducer() {

  }
}