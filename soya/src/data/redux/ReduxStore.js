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
  getActionCreator: Function;
  unregister: Function;
};

class Component extends DataComponent {
  // TODO: Use immutable on state?
  constructor(props, context) {
    super(props, context);
    this.state = {
      actions: {},
      pieces: {},
      unregisterFns: {}
    };
    this.__soyaReduxStoreId = this.props.store.registerComponent(this);
  }

  registerStores() {
    // Subscription then becomes idempotent because it's Segment that calls setState() directly.
    this.register(new UserSegment({id: this.props.userId}), 'user');
    this.register(new UserSegment({id: this.props.friendUserId}, 'friendUser');
    this.setState({userAction: userAction});
  }

  register(segment, stateVar, hydrationOption) {
    // Unregister if already registered.
    this.unregister(stateVar);
    var callback = (newState) => {
      this.setState({[stateVar]: newState});
    };
    var storeRef = this.props.store.register(segment, callback, hydrationOption);
    var actions = this.state.actions;
    var unregister = this.state.unregister;
    unregister[stateVar] = storeRef.unregister;
    var stateToSet = {
      [stateVar]: storeRef.getState(),
      unregister: unregister
    };
    if (!actions[stateVar]) {
      stateToSet.actions = actions;
      stateToSet.actions[stateVar] = storeRef.getActionCreator();
    }
    this.setState(stateToSet);
  }

  unregister(name) {
    if (this.state.unregister[stateVar]) {
      this.state.unregister[stateVar]();
      delete this.state.unregister[stateVar];
      delete this.state.piece[stateVar];
      // TODO: Also remove action if no action name exist.
    }
  }

  render() {
    // Access queried state.
    this.state.piece.user.data
    this.state.piece.friendUser.data

    // Access error information.
    this.state.piece.user.error
    this.state.piece.friendUser.error

    // Check if data fetching is done.
    this.state.piece.user.isHydrated
    this.state.piece.friendUser.isHydrated
  }

  handleClick() {
    // Runtime registration for fetching and subscription is allowed.
    // After registration this component will be subscribed to the segment piece.
    this.register(new UserSegment({id: haha}), 'newUser');

    // Changing queries in runtime is also easy. Just re-register with the same
    // name! Old one will be unregistered!
    this.register(new UserSegment({id: bleh}, 'user');

    // Do manual data loading (data is loaded and placed to state, but no subscription is made!);
    var action = this.state.actions.createLoadAction({id: 'haha'}, options, forceLoad);
    var promise = this.store.dispatch(action);
    promise.then((data) => {
      // do stuff..
    });
  }
}

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
 * 1. Creates appropriate redux store, with redux-thunk as middlewares.
 * 1. Wraps redux store's subscribe and dispatch.
 * 2. Listen to store changes, then ask each segment to decides whether
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
   *         isHydrated: true,
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
  _hydrationStates;

  /**
   * Receives Promises/A+ implementation. We don't want to load more than 1
   * promise library, so we'll have the user supply it to us. This should be
   * the same library, or a library compatible with the one used at
   * ActionCreator implementations.
   *
   * @param {Function} PromiseImpl
   */
  constructor(PromiseImpl) {
    super();
    this._segments = {};
    this._reducers = {};
    this._subscribers = {};
    this._nextSubscriberId = 1;
    this._store = this._createStore();
    this._store.subscribe(this._handleChange.bind(this));
    this._hydrationStates = {};
    this._actionCreators = {};
    Promise = PromiseImpl;
  }

  /**
   * @returns {any}
   */
  _createStore() {
    // TODO: Disable devTools with configuration.
    var compose = compose(
      applyMiddleware(thunk),
      devTools()
    )(createStore);
    return compose(this._rootReducer.bind(this));
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
      segment = this._reducers[segmentName];
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
        queryId, querySubscribers, subscriberId, segmentPiece;
    for (segmentName in this._segments) {
      if (!this._segments.hasOwnProperty(segmentName)) continue;
      segment = this._segments[segmentName];
      segmentSubscribers = this._subscribers[segmentName];
      segmentState = state[segmentName];
      prevSegmentState = state[segmentName];
      for (queryId in segmentSubscribers) {
        if (!segmentSubscribers.hasOwnProperty(queryId)) continue;
        querySubscribers = segmentSubscribers[queryId];
        segmentPiece = segment._comparePiece(prevSegmentState, segmentState, queryId);
        if (segmentPiece != null) {
          // Segment piece has changed, call all registered subcribers.
          for (subscriberId in querySubscribers) {
            if (!querySubscribers.hasOwnProperty(subscriberId)) continue;
            querySubscribers[subscriberId](segmentPiece);
          }
        }
      }
    }
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
   * @returns {SegmentPiece}
   * @private
   */
  _getSegmentPiece(segmentName, queryId) {
    var state = this._store.getState();
    var segmentState = state[segmentName];
    var pieceObject = this._segments[segmentName]._getPieceObject(segmentState, queryId);
    var segmentPiece = new SegmentPiece();
    segmentPiece.data = pieceObject.data;
    segmentPiece.errors = pieceObject.errors;
    segmentPiece.isHydrated = this._hydrationStates[segmentName][queryId].isHydrated;
  }

  /**
   * @param {string} segmentName
   * @param {string} queryId
   * @param {string} subscriberId
   */
  _unregister(segmentName, queryId, subscriberId) {
    // TODO: Might want to keep track of query/segment subscriber count, we might want to call Segment.deactivate().
    delete this._subscribers[segmentName][queryId][subscriberId];
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
    var action, segmentName, queryId, queries, hydrationState;
    var blockingHydrationPromises = [], promise;
    for (segmentName in this._hydrationStates) {
      if (!this._hydrationStates.hasOwnProperty(segmentName)) continue;
      queries = this._hydrationStates[segmentName];
      for (queryId in queries) {
        if (!queries.hasOwnProperty(queryId)) continue;
        hydrationState = queries[queryId];
        if (hydrationState.isHydrated) continue;
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
   * The getState() function will only return state queried by this
   *
   * Returns a function that can be used to get queried state. It will only
   * return the queried state, this makes it easier to separate concerns and
   * not have one component asking for a state queried by another component.
   *
   * @param {Segment} segment
   * @param {string} query
   * @param {options} query
   * @param {Function} callback
   * @param {any} component
   * @param {?{[key: RenderType]: HydrationType}} hydrationOption
   * @return {StoreReference}
   */
  register(segment, query, options, callback, component, hydrationOption) {
    // TODO: Handle Segment dependencies!
    // Determine subscriber ID.
    var subscriberId = component[SUBSCRIBER_ID];
    if (!subscriberId) {
      component[SUBSCRIBER_ID] = this._nextSubscriberId++;
    }

    // Initialize hydration option.
    this._initHydrationOption(hydrationOption);

    // Register segment.
    var segmentName = segment._getName();
    var registeredSegment = this._segments[segmentName];
    if (!registeredSegment) {
      this._segments[segmentName] = segment;
      this._reducers[segmentName] = segment._getReducer();
      this._hydrationStates[segmentName] = {};
      this._subscribers[segmentName] = {};
      this._actionCreators[segmentName] = segment._getActionCreator();
      registeredSegment = segment;
      registeredSegment._activate(Promise);
    } else if (registeredSegment.prototype != segment.prototype) {
      throw new Error('Segment name registered by both ' + registeredSegment + ' and ' + segment + ', with name: ' + segmentName + '.');
    }

    // Register query.
    var queryId = registeredSegment._registerQuery(query, options);
    if (!this._hydrationStates[segmentName][queryId]) {
      this._hydrationStates[segmentName][queryId] = {
        isHydrated: false,
        option: hydrationOption
      };
    } else {
      // Merge hydration option.
      var finalHydrationOption = this._hydrationStates[segmentName][queryId].option;
      if (hydrationOption[SERVER] > finalHydrationOption[SERVER]) finalHydrationOption[SERVER] = hydrationOption[SERVER];
      if (hydrationOption[CLIENT_PARTIAL] > finalHydrationOption[CLIENT_PARTIAL]) finalHydrationOption[CLIENT_PARTIAL] = hydrationOption[CLIENT_PARTIAL];
      if (hydrationOption[CLIENT_FULL] > finalHydrationOption[CLIENT_FULL]) finalHydrationOption[CLIENT_FULL] = hydrationOption[CLIENT_FULL];
    }

    // Register subscriber.
    if (!this._subscribers[segmentName][queryId]) this._subscribers[segmentName][queryId] = {};
    this._subscribers[segmentName][queryId][subscriberId] = callback;

    var result = {
      actionCreator: registeredSegment._getActionCreator(),
      getState: this._getSegmentPiece.bind(this, segmentName, queryId),
      unsubscribe: this._unsubscribe.bind(this, segmentName, queryId, subscriberId)
    };
    return result;
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
}