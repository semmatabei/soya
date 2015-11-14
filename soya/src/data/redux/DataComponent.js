import React from 'react';

import ReduxStore from './ReduxStore.js';
import ActionCreator from './ActionCreator.js';
import { isEqualShallow } from './helper.js';

/**
 * Components that wanted to use Soya's redux container may use this.
 * DataComponent encapsulates how, when, what, and where to fetch context.
 * Relationship between DataComponent and ReduxStore is as follows:
 *
 * 1) DataComponent may register Segments that it needs from ReduxStore.
 * 2) DataComponent may manually query pieces of Segments it has registered
 *    using each Segment's ActionCreator.
 * 3) DataComponent may subscribe to a query. This automatically sets the
 *    query result to its React state. Each change in the query result will
 *    also trigger a setState() call to the subscribing DataComponent.
 *
 * DataComponent extends React's prop and state relationship:
 *
 * 1) Props are given by owner components to their ownee.
 * 2) Props is the prime determinator of state in components.
 * 3) Props is the prime determinator of query subscription in DataComponent.
 * 4) Query subscription determines part of DataComponent's state.
 *
 * @CLIENT_SERVER
 */
export default class DataComponent extends React.Component {
  /**
   * @type {{[key: string]: ActionCreator}}
   */
  __soyaActions;

  /**
   * @type {{[key: string]: Function}}
   */
  __soyaUnsubscribe;

  constructor(props, context) {
    super(props, context);

    // Both actions and unsubscribe is not part of state because it shouldn't
    // affect rendering in any way. Actions are determined at mounting and
    // shouldn't change throughout this component's lifecycle. Unsubscribe
    // contains functions that unsubscribes this component from state changes,
    // but it's the actual state that matters.
    this.__soyaActions = {};
    this.__soyaUnsubscribe = {};

    var reduxStore = this.getReduxStore();
    var config = this.getConfig();
    if (!reduxStore || !reduxStore.__isReduxStore) {
      throw new Error('ReduxStore is not properly wired to this data component: ' + this.constructor + '.');
    }
    if (!config || typeof config != 'object') {
      throw new Error('Config object is not properly wired to this data component: ' + this.constructor + '.');
    }
  }

  /**
   * Defaults to getting ReduxStore instance from props.store. If you want to
   * use context you can override this method.
   *
   * @returns {ReduxStore}
   */
  getReduxStore() {
    return this.props.reduxStore;
  }

  /**
   * Defaults to getting Config object from props.config. If you want to use
   * context you can override this method.
   *
   * @returns {Object}
   */
  getConfig() {
    return this.props.config;
  }

  /**
   * This method is called at componentWilMount(). DataComponent will register
   * the returned Segment constructors to ReduxStore. Child components must
   * override this static method to specify their data requirements.
   *
   * Client-side or server-side config will be provided, depending on where
   * this DataComponent is instantiated.
   *
   * @return {Array<Class<Segment>>}
   */
  static getSegmentDependencies() {
    return [];
  }

  /**
   * Subscribes to queries to a Segment already registered at
   * getSegmentDependencies().
   *
   * NOTE: Subscription must be done with subscribe() method. Method must also
   * use the given props instead of this.props.
   *
   * @param {Object} nextProps
   */
  subscribeQueries(nextProps) {

  }

  /**
   * @param {string} segmentName
   * @param {any} query
   * @param {string} stateName
   * @param {?Object} hydrationOption
   */
  subscribe(segmentName, query, stateName, hydrationOption) {
    // Unsubscribe if already subscribed.
    this.unsubscribe(stateName);

    console.log('[DATA] Subscribe', this, segmentName);
    var callback = (newState) => {
      this.setState({[stateName]: newState});
    };

    var storeRef = this.getReduxStore().subscribe(
      segmentName, query, callback, this, hydrationOption);
    this.unsubscribe[segmentName] = storeRef.unsubscribe;
    this.setState({
     [stateName]: storeRef.getState()
    });
  }

  /**
   * @param {string} stateName
   */
  unsubscribe(stateName) {
    if (this.__soyaUnsubscribe[stateName]) {
      console.log('[DATA] Un-subscribe', this, stateName);
      this.__soyaUnsubscribe[stateName]();
      delete this.__soyaUnsubscribe[stateName];
    }
  }

  /**
   * Returns action creator of an already registered segment.
   *
   * @param {string} segmentName
   * @return {ActionCreator}
   */
  getActionCreator(segmentName) {
    if (this.__soyaActions[segmentName] instanceof ActionCreator) {
      throw new Error('Unable to get action creator for segment \'' + segmentName + '\', segment is not registered.');
    }
    return this.__soyaActions[segmentName];
  }

  /**
   * Semantics are very similar to shouldComponentUpdate(). This method
   * determines whether to re-run subscribeQueries() or not when this component
   * will receive new props.
   *
   * Props is the prime determinator of query subscription in DataComponent.
   *
   * Default implementation uses shallowEqual. User can override as needed.
   *
   * @param {Object} nextProps
   * @return {boolean}
   */
  shouldSubscriptionsUpdate(nextProps) {
    var shouldUpdateSubscription = !isEqualShallow(this.props, nextProps);
    console.log('[DATA] Should update subscriptions', this, shouldUpdateSubscription);
    return shouldUpdateSubscription;
  }

  /**
   * @param {Class<Segment>} segmentClass
   */
  _register(segmentClass) {
    var actionCreator = this.getReduxStore().register(segmentClass);
    this.__soyaActions[segmentClass.id()] = actionCreator;
  }

  /**
   * This implementation assumes:
   *
   * 1) All DataComponent(s) render only using props and states (i.e. they
   *    are pure render components). Child classes can override this method
   *    if they are not.
   * 2) All DataComponent(s) parents send their props as immutable objects
   *    (i.e. if the prop changes, they recreate the whole object).
   * 3) All DataComponent(s) set their state as immutable objects
   *    (i.e. if state changes, they recreate the whole object).
   *
   * Based on the above assumptions, this method will do a shallow comparison of
   * both state and props. If the above assumptions are not correct, user can
   * override this method.
   *
   * @param {Object} nextProps
   * @param {Object} nextState
   * @return {boolean}
   */
  shouldComponentUpdate(nextProps, nextState) {
    var shouldUpdate = !isEqualShallow(this.props, nextProps) || !isEqualShallow(this.state, nextState);
    console.log('[DATA] Should update?', this, shouldUpdate);
    return shouldUpdate;
  }

  componentWillUpdate(nextProps, nextState) {
    console.log('[DATA] Will update', this, nextProps, nextState);
  }

  /**
   * @param {Object} nextProps
   */
  componentWillReceiveProps(nextProps) {
    // TODO: Logger at client! Remove if debug is set to false!
    if (this.shouldSubscriptionsUpdate(nextProps)) {
      // If query subscriptions update, we need to remove past subscriptions.
      // Otherwise this component may unnecessarily re-render each time the
      // already unrelated segment piece changes. Since this is costly, this
      // is why shouldSubscriptionsUpdate() is important.
      this.getReduxStore().unsubscribe(this);
      this.subscribeQueries(nextProps);
    }
  }

  /**
   * Registers the store. Run at both client and server side when rendering.
   */
  componentWillMount() {
    console.log('[DATA] Mounting', this, this.props);
    var i, segmentClasses = this.constructor.getSegmentDependencies();
    for (i = 0; i < segmentClasses.length; i++) {
      this._register(segmentClasses[i]);
    }
    this.subscribeQueries(this.props);
  }

  /**
   * Unsubscribe all segments.
   */
  componentWillUnmount() {
    console.log('[DATA] Unmounting', this);
    this.getReduxStore().unsubscribe(this);
  }
}