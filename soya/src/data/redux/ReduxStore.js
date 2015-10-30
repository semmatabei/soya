import Store from '../Store.js';
import { SERVER, CLIENT_PARTIAL, CLIENT_FULL } from '../RenderType.js';
import { BLOCKING, NON_BLOCKING, NOOP } from '../HydrationType.js';
import PromiseUtil from './PromiseUtil.js';
import SegmentPiece from './SegmentPiece.js';

import { compose, createStore, applyMiddleware } from 'redux';
import { devTools, persistState } from 'redux-devtools';
import thunk from 'redux-thunk';

var Promise;

/*

type StoreReference = {
  getState: Function;
  unregister: Function;
};

*/

const SUBSCRIBER_ID = '__soyaReduxStoreSubscriberId';
const DEFAULT_HYDRATION_OPTION = {
  [SERVER]: BLOCKING,
  [CLIENT_PARTIAL]: NON_BLOCKING,
  [CLIENT_FULL]: NON_BLOCKING
};

/**
 * Creates and wraps redux store. Responsibilities:
 *
 * TODO: Fix this comment!
 *
 * 1. Creates appropriate redux store, with redux-thunk as middlewares.
 * 1. Wraps redux store's subscribe and dispatch.
 * 2. Listen to store changes, then ask each segment to decides whether to
 *
 *
 *
 * The store's responsibilities are:
 *
 * 1. Accepts Store and Query requirements from components.
 * 2. Does initial state hydration from requirements given by components.
 * 3. Allows contextual components to get state.
 * 4. Allows contextual components to subscribe to state changes.
 * 5. Allows contextual components to dispatch actions.
 * 6. Allows contextual components to get action creators.
 * 7. Orchestrates batching of requests.
 *
 * @CLIENT_SERVER
 */
export default class ReduxStore extends Store {
  /**
   * @type {number}
   */
  _nextSubscriberId;

  /**
   * @type {{[key: string]: Segment}}
   */
  _segments;

  /**
   * @type {{[key: string]: Function}}
   */
  _reducers;

  /**
   * @type {{[key: string]: ActionCreator}}
   */
  _actionCreators;

  /**
   * <pre>
   *   {
   *     segmentName: {
   *       queryId: {
   *         subscriberId: subscribeFunc,
   *         subscriberId: subscribeFunc
   *       }
   *     }
   *   }
   * </pre>
   *
   * @type {{[key: string]: {[key: string]: {[key: string]: Function}}}}
   */
  _subscribers;

  /**
   * Redux store.
   *
   * @type {any}
   */
  _store;

  /**
   * @type {{[key: string]: any}}
   */
  _previousState;

  /**
   * <pre>
   *   {
   *     segmentName: {
   *       queryId: {
   *         option: {...}
   *       },
   *       ...
   *     },
   *     ...
   *   }
   * </pre>
   *
   *
   * @type {{[key: string]: {[key: string]: boolean}}}
   */
  _hydrationOptions;

  /**
   * @type {{[key: string]: boolean}}
   */
  _allowOverwriteSegment;

  /**
   * @type {boolean}
   */
  _allowHandleChange;

  /**
   * @type {boolean}
   */
  _allowRegisterSegment;

  /**
   * @type {boolean}
   */
  __isReduxStore;

  /**
   * Receives Promises/A+ implementation. We don't want to load more than 1
   * promise library, so we'll have the user supply it to us. This should be
   * the same library, or a library compatible with the one used at
   * ActionCreator implementations.
   *
   * @param {Function} PromiseImpl
   * @param {any} initialState
   */
  constructor(PromiseImpl, initialState) {
    super();
    this.__isReduxStore = true;
    this._allowRegisterSegment = false;
    this._allowHandleChange = true;
    this._segments = {};
    this._reducers = {};
    this._subscribers = {};
    this._nextSubscriberId = 1;
    this._store = this._createStore(initialState);
    this._store.subscribe(this._handleChange.bind(this));
    this._hydrationOptions = {};
    this._actionCreators = {};
    this._allowOverwriteSegment = {};
    Promise = PromiseImpl;
  }

  /**
   * @return {Object}
   */
  getStore() {
    return this._store;
  }

  /**
   * Only allow Segment registration at render process.
   */
  _startRender() {
    this._allowRegisterSegment = true;
  }

  /**
   * Disable segment registration after render process.
   */
  _endRender() {
    this._allowRegisterSegment = false;
  }

  /**
   * @param {?Object} initialState
   * @returns {Object}
   */
  _createStore(initialState) {
    // TODO: Disable devTools with configuration.
    // TODO: Hot reload reducer/segments?
    var composedCreateStore = compose(
      applyMiddleware(thunk),
      devTools()
    )(createStore);
    return composedCreateStore(this._rootReducer.bind(this), initialState);
  }

  /**
   * Root reducer.
   *
   * @param {void | Object} state
   * @param {any} action
   * @returns {Object}
   * @private
   */
  _rootReducer(state, action) {
    if (state == null) state = {};
    var reducer, segmentName, segment, segmentState, nextSegmentState;
    var nextState = {}, isChanged = false;
    for (segmentName in this._reducers) {
      if (!this._reducers.hasOwnProperty(segmentName)) continue;
      if (!this._segments.hasOwnProperty(segmentName)) continue;
      reducer = this._reducers[segmentName];
      segment = this._segments[segmentName];
      segmentState = state[segmentName];
      nextSegmentState = reducer(segmentState, action);
      isChanged = isChanged || !segment._isStateEqual(segmentState, nextSegmentState);
      nextState[segmentName] = nextSegmentState;
    }
    return isChanged ? nextState : state;
  }

  /**
   * @private
   */
  _handleChange() {
    if (!this._allowHandleChange) {
      return;
    }

    var state = this._store.getState();
    if (this._previousState == null) {
      // If no change, no need to trigger callbacks.
      this._previousState = state;
      return;
    }

    // Assume comparison is cheaper than re-rendering. We do way more comparison
    // when we compare each piece, with the benefits of not doing unnecessary
    // re-rendering.
    var segmentName, segment, segmentState, prevSegmentState, segmentSubscribers,
        queryId, querySubscribers, subscriberId, segmentPiece, shouldUpdate;
    for (segmentName in this._segments) {
      if (!this._segments.hasOwnProperty(segmentName)) continue;
      segment = this._segments[segmentName];
      segmentSubscribers = this._subscribers[segmentName];
      segmentState = state[segmentName];
      prevSegmentState = this._previousState[segmentName];
      for (queryId in segmentSubscribers) {
        if (!segmentSubscribers.hasOwnProperty(queryId)) continue;
        querySubscribers = segmentSubscribers[queryId];
        // If segmentState is previously null, then this is a new query call.
        // First getState() method call should already return the initialized
        // object, so we don't need to call update.
        shouldUpdate = false;
        if (prevSegmentState != null) {
          segmentPiece = segment._comparePiece(prevSegmentState, segmentState, queryId);
          shouldUpdate = segmentPiece != null;
        }
        if (shouldUpdate) {
          // Segment piece has changed, call all registered subscribers.
          for (subscriberId in querySubscribers) {
            if (!querySubscribers.hasOwnProperty(subscriberId)) continue;
            querySubscribers[subscriberId](segmentPiece);
          }
        }
      }
    }

    // Update previous state.
    this._previousState = state;
  }

  /**
   * @param {?Object} hydrationOption
   * @return {Object}
   */
  _initHydrationOption(hydrationOption) {
    hydrationOption = hydrationOption ? hydrationOption : {};
    if (!hydrationOption[SERVER]) hydrationOption[SERVER] = DEFAULT_HYDRATION_OPTION[SERVER];
    if (!hydrationOption[CLIENT_PARTIAL]) hydrationOption[CLIENT_PARTIAL] = DEFAULT_HYDRATION_OPTION[CLIENT_PARTIAL];
    if (!hydrationOption[CLIENT_FULL]) hydrationOption[CLIENT_FULL] = DEFAULT_HYDRATION_OPTION[CLIENT_FULL];
    return hydrationOption;
  }

  /**
   * @param {string} segmentName
   * @param {string} queryId
   * @returns {Object}
   */
  _getSegmentPiece(segmentName, queryId) {
    var state = this._store.getState();
    var segmentState = state[segmentName];
    if (!segmentState) return null;
    var pieceObject = this._segments[segmentName]._getPieceObject(segmentState, queryId);
    // We return the real object so that users can do simple equality check to
    // see if the object has changed or not.
    return pieceObject;
  }

  /**
   * @param {string} segmentName
   * @param {string} queryId
   * @param {string} subscriberId
   */
  _unsubscribe(segmentName, queryId, subscriberId) {
    // TODO: Might want to keep track of query/segment subscriber count, we might want to call Segment.deactivate().
    delete this._subscribers[segmentName][queryId][subscriberId];
  }

  /**
   * Implements this by creating an allowSegmentOverwrite flag for all segments
   * that has been registered in this instance. If it was a new Segment, we
   * don't care since there won't be any conflict anyway.
   */
  _mayHotReloadSegments() {
    this._allowOverwriteSegment = {};
    var segmentName;
    for (segmentName in this._segments) {
      if (!this._segments.hasOwnProperty(segmentName)) continue;
      this._allowOverwriteSegment[segmentName] = true;
    }
  }

  /**
   * @returns {boolean}
   */
  shouldRenderBeforeServerHydration() {
    // We need to all segments to be registered first.
    return true;
  }

  /**
   * Runs hydration, depending on rendering type.
   *
   * NOTE: Hydration is only done once per Segment piece (query). It's safe to
   * call this method more than once, anytime - to make sure that all registered
   * state is hydrated.
   *
   * @param {RenderType} renderType
   * @return {Promise}
   */
  hydrate(renderType) {
    if (renderType == SERVER) {
      // If we're rendering at server-side we don't need to handle updates.
      this._allowHandleChange = false;
    }

    var action, segmentName, queryId, queries, hydrationState;
    var blockingHydrationPromises = [], promise;
    for (segmentName in this._hydrationOptions) {
      if (!this._hydrationOptions.hasOwnProperty(segmentName)) continue;
      queries = this._hydrationOptions[segmentName];
      for (queryId in queries) {
        if (!queries.hasOwnProperty(queryId)) continue;
        hydrationState = queries[queryId];

        // Don't need to do anything if it's already loaded.
        var segmentPiece = this._getSegmentPiece(segmentName, queryId);
        if (segmentPiece.loaded) continue;

        if (hydrationState.option[renderType] == NOOP) continue;
        // Server-side doesn't need to run non-blocking hydration requests.
        if (renderType == SERVER && hydrationState.option[renderType] == NON_BLOCKING) continue;
        action = this._segments[segmentName]._createHydrateAction(queryId);
        promise = this.dispatch(action);
        // Client-side runs everything as non-blocking.
        if (renderType == SERVER && hydrationState.option[renderType] == BLOCKING) {
          blockingHydrationPromises.push(promise);
        }
      }
    }
    return PromiseUtil.allParallel(Promise, blockingHydrationPromises);
  }

  /**
   * Accepts a segment, specific query, and a subscriber. Each of these elements
   * can be anything depending on the Store implementation.
   *
   * In this method, ReduxStore instance is responsible for:
   *
   * 1) Making sure that only one Segment instance is responsible for
   *    maintaining a top-level key of the store. This means no segment name
   *    clashes, but multiple registrations of the _same_ Segment class is
   *    allowed. If a Segment instance with the same class is already
   *    registered, ReduxStore will ask Segment to *absorb* the other instance.
   *    How each Segment implementation deal with merging queries is their
   *    responsibility.
   * 2) Creating StoreReference, to be used by components.
   *    a) ActionCreator should be the same for each Segment instance.
   *    b) Individual getState() function should be created for each query.
   *       Segment instance can cache getState
   *
   * Only hydrationOption is typed. It determines hydration behavior at server
   * and client render. Default is blocking on server and non-blocking at
   * client.
   *
   * Returns StoreReference, which contains function to get queried state and
   * action creators.
   *
   * The getState() function will only return state queried by the component.
   *
   * Returns a function that can be used to get queried state. It will only
   * return the queried state, this makes it easier to separate concerns and
   * not have one component asking for a state queried by another component.
   *
   * TODO: Handle Segment dependencies!
   *
   * @param {Segment} segment
   * @param {string} query
   * @param {Function} callback
   * @param {any} component
   * @param {?Object} queryOptions
   * @param {?{[key: RenderType]: HydrationType}} hydrationOption
   * @return {ActionCreator}
   */
  register(segment) {
    if (!this._allowRegisterSegment) {
      throw new Error('Segment registration is only allowed at render process!');
    }

    // TODO: Fix! This is ugly - activate only exists to ensure ReduxStore and its Segments utilize the same Promise implementation.
    segment._activate(Promise);

    // Register segment.
    var segmentName = segment._getName();
    var registeredSegment = this._segments[segmentName];
    if (!registeredSegment) {
      registeredSegment = segment;
      this._segments[segmentName] = segment;
      this._reducers[segmentName] = segment._getReducer();
      this._hydrationOptions[segmentName] = {};
      this._subscribers[segmentName] = {};
      this._actionCreators[segmentName] = segment._getActionCreator();
    }
    else if (!registeredSegment._isEqual(segment)) {
      if (this._allowOverwriteSegment[segmentName]) {
        registeredSegment = segment;
        this._segments[segmentName] = segment;
        this._reducers[segmentName] = segment._getReducer();
        this._hydrationOptions[segmentName] = {};
        this._subscribers[segmentName] = {};
        this._actionCreators[segmentName] = segment._getActionCreator();

        // Nullifies the current segment data, since we are replacing.
        var cleanAction = segment._createCleanAction();
        this.dispatch(cleanAction);
      } else {
        throw new Error('Segment name registered by both ' + registeredSegment + ' and ' + segment + ', with name: ' + segmentName + '.');
      }
    }

    // No longer allow segment overwrites for this segment name.
    // We only allow segment overwrites for *first* registration.
    delete this._allowOverwriteSegment[segmentName];

    return registeredSegment._getActionCreator();
  }

  /**
   * @param {string} segmentName
   * @param {any} query
   * @param {Function} callback
   * @param {any} component
   * @param {?Object} queryOptions
   * @param {?{[key: RenderType]: HydrationType}} hydrationOption
   * @return {}
   */
  subscribe(segmentName, query, callback, component, queryOptions, hydrationOption) {
    // Determine subscriber ID.
    var subscriberId = component[SUBSCRIBER_ID];
    if (!subscriberId) {
      subscriberId = this._nextSubscriberId++;
      component[SUBSCRIBER_ID] = subscriberId;
    }

    var registeredSegment = this._segments[segmentName];
    if (!registeredSegment) {
      throw new Error('Cannot subscribe, Segment is not registered: ' + segmentName + '.');
    }

    // Initialize hydration option.
    hydrationOption = this._initHydrationOption(hydrationOption);

    // Register query.
    var queryId = registeredSegment._registerQuery(query, queryOptions);
    if (!this._hydrationOptions[segmentName][queryId]) {
      this._hydrationOptions[segmentName][queryId] = {
        option: hydrationOption
      };
    } else {
      // Merge hydration option.
      var finalHydrationOption = this._hydrationOptions[segmentName][queryId].option;
      if (hydrationOption[SERVER] > finalHydrationOption[SERVER]) finalHydrationOption[SERVER] = hydrationOption[SERVER];
      if (hydrationOption[CLIENT_PARTIAL] > finalHydrationOption[CLIENT_PARTIAL]) finalHydrationOption[CLIENT_PARTIAL] = hydrationOption[CLIENT_PARTIAL];
      if (hydrationOption[CLIENT_FULL] > finalHydrationOption[CLIENT_FULL]) finalHydrationOption[CLIENT_FULL] = hydrationOption[CLIENT_FULL];
    }

    // Populate with initial data if not already populated.
    // Since getSegmentPiece() is supposed to be a fast operation anyway, we
    // can just check the data.
    if (!this._getSegmentPiece(segmentName, queryId)) {
      var initAction = registeredSegment._createInitAction(queryId);
      if (typeof initAction == 'function') {
        throw new Error('Init action must be sync! Please return an action object instead!');
      }
      this.dispatch(initAction);
    }

    // Register subscriber, previous init action is sync, so don't have to worry.
    if (!this._subscribers[segmentName][queryId]) this._subscribers[segmentName][queryId] = {};
    this._subscribers[segmentName][queryId][subscriberId] = callback;

    var result = {
      getState: this._getSegmentPiece.bind(this, segmentName, queryId),
      unsubscribe: this._unsubscribe.bind(this, segmentName, queryId, subscriberId)
    };
    return result;
  }

  /**
   * @param {any} component
   */
  unsubscribe(component) {
    var componentSubscriberId = component[SUBSCRIBER_ID];
    var segmentName, queryId, subscriberId;
    var unsubscribeList = [];
    for (segmentName in this._subscribers) {
      if (!this._subscribers.hasOwnProperty(segmentName)) continue;
      for (queryId in this._subscribers[segmentName]) {
        if (!this._subscribers[segmentName].hasOwnProperty(queryId)) continue;
        for (subscriberId in this._subscribers[segmentName][queryId]) {
          if (!this._subscribers[segmentName][queryId].hasOwnProperty(subscriberId)) continue;
          if (subscriberId == componentSubscriberId) {
            unsubscribeList.push([segmentName, queryId, componentSubscriberId]);
          }
        }
      }
    }

    var i;
    for (i = 0; i < unsubscribeList.length; i++) {
      this._unsubscribe(unsubscribeList[i][0], unsubscribeList[i][1], unsubscribeList[i][2]);
    }
  }

  /**
   * Returns a Promise that is resolved when the action is dispatched
   * to all reducers.
   *
   * If the given action is an Object, its dispatch will be sync, so a Promise
   * that resolves immediately is given.
   *
   * If the given action is a thunk function, it will check if the function
   * returns a Promise or not. If not, it will throw an error. Otherwise the
   * Promise is returned.
   *
   * @param {Function | Object} action
   * @return {Promise}
   */
  dispatch(action) {
    var result;
    if (typeof action != 'function') {
      result = this._store.dispatch(action);
      return new Promise(function(resolve) {
        resolve(result);
      });
    }

    result = this._store.dispatch(action);
    this._ensurePromise(result);
    return result;
  }

  /**
   * @param {Promise} promise
   */
  _ensurePromise(promise) {
    if (!(promise instanceof Promise)) {
      throw new Error('Expected Promise from async action creator, got this instead: ' + promise + '.');
    }
  }

  /**
   * @returns {any}
   */
  _getState() {
    return this._store.getState();
  }
}