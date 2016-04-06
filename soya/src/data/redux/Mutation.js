/**
 * This represents the interface for Mutation, but also a usable abstract class
 * that users can extend from.
 *
 * @CLIENT_SERVER
 */
export default class Mutation {
  /**
   * Returns a promise that resolves into a map containing refresh requests.
   * If this method is called by ReduxStore it will run all refresh requests
   * if the segment associated with it is already registered.
   *
   * @return {Promise}
   */
  execute() {
    return Promise.resolve({});
  }
}