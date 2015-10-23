/**
 * Utilities for using Promises. Should be stateless.
 *
 * @CLIENT_SERVER
 */
export default {
  /**
   * Runs all promises inside the array in parallel. Will reject if any of
   * the given promises rejects.
   *
   * NOTE: I know I can use Promise.all() - but preliminary investigation
   * seems to conclude that it runs promises serially? Correct me if I'm wrong.
   *
   * @param {Promise} Promise
   * @param {Array<Promise>} promises
   * @returns {Promise}
   */
  allParallel(Promise, promises) {
    if (promises.length <= 0) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      var i, result = [];
      var registerResult = function(index, value) {
        result[index] = value;
        if (result.length == promises.length) {
          resolve(result);
        }
      };
      for (i = 0; i < promises.length; i++) {
        promises[i].then(this.createResolveFunc(i, registerResult), function(error) {
          reject(error);
        });
      }
    });
  },

  /**
   * @param {number} index
   * @param {Function} resolver
   * @returns {Function}
   */
  createResolveFunc(index, resolver) {
    return function(value) {
      resolver(index, value);
    }
  }
};