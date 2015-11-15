/**
 * Utilities for using Promises. Should be stateless.
 *
 * @CLIENT_SERVER
 */
export default {
  /**
   * Runs all given promises serially.
   *
   * @param {Function} Promise
   * @param {Array<Promise>} promises
   */
  allSerial(Promise, promises) {
    var accumulator = [], i, promise;
    var ready = Promise.resolve(null);
    var createPromiseReturnFunc = function(promise) {
      return promise;
    };

    for (i = 0; i < promises.length; i++) {
      promise = promises[i];
      ready = ready.then(
        createPromiseReturnFunc(promise)
      ).then(function(value) {
        accumulator.push(value);
      });
    }

    return ready.then(function() { return accumulator; });
  },

  /**
   * Runs all promises inside the array in parallel. Will reject if any of
   * the given promises rejects.
   *
   * NOTE: I know I can use Promise.all() - but preliminary investigation
   * seems to conclude that it runs promises serially? Correct me if I'm wrong.
   *
   * @param {Function} Promise
   * @param {Array<Promise>} promises
   * @returns {Promise}
   */
  allParallel(Promise, promises) {
    if (promises.length <= 0) return Promise.resolve(null);
    return new Promise((resolve, reject) => {
      var i, doneCount = 0, result = [];
      var registerResult = function(index, value) {
        result[index] = value;
        doneCount++;
        if (doneCount >= promises.length) {
          resolve(result);
        }
      };
      for (i = 0; i < promises.length; i++) {
        promises[i].then(this.createResolveFunc(i, registerResult)).catch(reject);
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
  },

  /**
   * Logs and throws the given error. Useful for catching framework promise
   * errors, so that it bubbles to the user.
   *
   * @param {Error} error
   */
  throwError(error) {
    if (console) {
      console.error ? console.error(error) : console.log(error, error.stack);
    }
    throw error;
  }
};