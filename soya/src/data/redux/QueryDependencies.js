/* @flow */

import PromiseUtil from './PromiseUtil.js';

/*
type Query = {
  name: string;
  segmentId: string;
  query: any;
  forceLoad: ?boolean;
};
*/

/**
 * TODO: Remove after we established how to consistently do polyfills.
 */
var Promise;

/**
 * Represents a declarative query dependency requirements. Recursive, may
 * contain individual query objects or another QueryDependencies instance.
 * Each QueryDependencies instance can be either parallel or serial. Parallel
 * fetching doesn't care about order, serial fetching guarantees order based
 * on order of insertion.
 *
 * @CLIENT_SERVER
 */
export default class QueryDependencies {
  /**
   * @type {boolean}
   */
  _isParallel;

  /**
   * @type {Array<Query | QueryDependencies>}
   */
  _queries;

  /**
   * @type {{[key: string]: Object}}
   */
  _results;

  /**
   * @param {Function} PromiseImpl
   * @param {boolean} isParallel
   */
  constructor(PromiseImpl, isParallel) {
    Promise = PromiseImpl;
    this._isParallel = isParallel;
    this._queries = [];
    this._results = {};
  }

  /**
   * @param {Function} PromiseImpl
   * @returns {QueryDependencies}
   */
  static parallel(PromiseImpl) {
    return new QueryDependencies(PromiseImpl, true);
  }

  /**
   * @param {Function} PromiseImpl
   * @returns {QueryDependencies}
   */
  static serial(PromiseImpl) {
    return new QueryDependencies(PromiseImpl, false);
  }

  setResult(name) {

  }

  /**
   * @param {string} name
   * @return {Object} TODO: segment piece object, clarify.
   */
  getResult(name) {
    return this._results[name];
  }

  /**
   * @param {string} name
   * @param {string} segmentId
   * @param {any} query
   * @param {?boolean} forceLoad
   */
  add(name, segmentId, query, forceLoad) {
    this._ensureNoNameClash(name);
    this._queries.push({
      name: name,
      segmentId: segmentId,
      query: query,
      forceLoad: forceLoad
    });
  }

  /**
   * @param {string} name
   * @param {Function} queryFunc
   */
  addFunction(name, queryFunc) {
    this._ensureNoNameClash(name);
    this._queries.push({
      name: name,
      segmentId: '',
      query: queryFunc,
      forceLoad: false
    });
  }

  /**
   * @param {string} name
   * @param {QueryDependencies} queryDependencies
   */
  addRecursive(name, queryDependencies) {
    this._ensureNoNameClash(name);
    this._results[name] = queryDependencies;
    this._queries.push({
      name: name,
      segmentId: '',
      query: queryDependencies,
      forceLoad: null
    });
  }

  /**
   * Fetches all query dependencies, returns a promise that resolves when
   * all dependencies are successfully fetched.
   *
   * @param {ReduxStore} reduxStore
   * @return {Promise}
   */
  _run(reduxStore) {
    if (this._isParallel) {
      return this._runParallel(reduxStore);
    }
    return this._runSerial(reduxStore);
  }

  /**
   * @param {ReduxStore} reduxStore
   */
  _runParallel(reduxStore) {
    var i, query, fetchPromise, promises = [];
    var queryFunc = reduxStore.query.bind(reduxStore);
    var dispatchFunc = reduxStore.dispatch.bind(reduxStore);
    for (i = 0; i < this._queries.length; i++) {
      query = this._queries[i];
      if (query.query instanceof QueryDependencies) {
        promises.push(query.query._run(reduxStore));
        continue;
      }

      // TODO: How does function sets values to results?
      // Promise returned by the function should resolve query result, whatever
      // it is (doesn't have to be a segment piece).
      if (typeof query.query == 'function') {
        promises.push(query.query(queryFunc, dispatchFunc).then(this._createResultSetterFunc(query.name)));
        continue;
      }

      // Construct a promise that sets the result to this instance after fetching is complete.
      fetchPromise = reduxStore.query(query.segmentId, query.query, query.forceLoad).then(
        this._createResultSetterFunc(query.name)
      );

      promises.push(fetchPromise);
    }
    return PromiseUtil.allParallel(Promise, promises);
  }

  /**
   * @param {ReduxStore} reduxStore
   * @return {Promise}
   */
  _runSerial(reduxStore) {
    var i, query, ready = Promise.resolve(null);
    var queryFunc = reduxStore.query.bind(reduxStore);
    var dispatchFunc = reduxStore.dispatch.bind(reduxStore);
    for (i = 0; i < this._queries.length; i++) {
      query = this._queries[i];
      if (query.query instanceof QueryDependencies) {
        // No need to store query results.
        ready = ready.then(this._createSerialRecursiveQueryFunc(
          reduxStore, query.query));
        continue;
      }

      if (typeof query.query == 'function') {
        ready = ready.then(this._createSerialQueryFunc(queryFunc, dispatchFunc, query.query, query.name));
        continue;
      }

      // Chain the promises together, our onFulfilled function returns another
      // promise that will be executed, the next .then call will execute after
      // that promise is resolved.
      ready = ready.then(this._createSerialObjectQueryFunc(reduxStore, query))
        .then(this._createResultSetterFunc(query.name));
    }

    // Since ready is a long chained promise, we don't need to manually set
    // reject function. It will bubble up to the top.
    return ready;
  }

  /**
   * @param {Function} queryFunc
   * @param {Function} dispatchFunc
   * @param {Function} query
   * @param {string} name
   */
  _createSerialQueryFunc(queryFunc, dispatchFunc, query, name) {
    return () => {
      // We expect query functions to return a promise that resolves with the
      // result variable.
      return query(queryFunc, dispatchFunc).then(this._createResultSetterFunc(name));
    }
  }

  /**
   * @param {ReduxStore}reduxStore
   * @param {Query} query
   * @returns {Promise}
   */
  _createSerialObjectQueryFunc(reduxStore, query) {
    return function() {
      return reduxStore.query(query.segmentId, query.query, query.forceLoad);
    }
  }

  /**
   * @param {ReduxStore} reduxStore
   * @param {QueryDependencies} queryDependencies
   * @return {Promise}
   */
  _createSerialRecursiveQueryFunc(reduxStore, queryDependencies) {
    return function() {
      return queryDependencies._run(reduxStore);
    };
  }

  /**
   * Creates a function that sets result with the given name using redux store.
   *
   * @param {string} name
   * @returns {Function}
   */
  _createResultSetterFunc(name) {
    return (segmentPiece) => {
      this._results[name] = segmentPiece;
    };
  }

  /**
   * @param {string} name
   */
  _ensureNoNameClash(name) {
    if (this._results.hasOwnProperty(name)) {
      throw new Error('Query dependencies name clash: \'' + name + '\'.');
    }
    this._results[name] = null;
  }
}