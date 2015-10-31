import React from 'react';

import ReduxStore from './ReduxStore.js';
import { isEqualShallow } from './helper.js';

/**
 * Components that wanted to use Soya's redux container may use this.
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

    if (!this.getReduxStore() || !this.getReduxStore().__isReduxStore) {
      throw new Error('ReduxStore is not properly wired to this component: ' + this.constructor.name + '.');
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
   * Registers Segment and queries required by this component to ReduxStore
   * instance. Child components should override this to specify their data
   * requirements.
   *
   * NOTE: Registration must be done with register() method.
   *
   * @param {Object} nextProps
   */
  registerSegments(nextProps) {

  }

  /**
   * Subscribes to queries to a Segment already registered at
   * registerSegments().
   *
   * NOTE: Subscription must be done with subscribe() method. Method must also
   * use the given props instead of this.props.
   *
   * @param {Object} nextProps
   */
  subscribeQueries(nextProps) {

  }

  /**
   * @param {Segment} segment
   */
  register(segment) {
    var actionCreator = this.getReduxStore().register(segment);
    this.__soyaActions[segment._getName()] = actionCreator;
  }

  /**
   * @param {string} segmentName
   * @param {any} query
   * @param {string} stateName
   * @param {?Object} queryOptions
   * @param {?Object} hydrationOption
   */
  subscribe(segmentName, query, stateName, queryOptions, hydrationOption) {
    // Unsubscribe if already subscribed.
    this.unsubscribe(stateName);

    console.log('[DATA] Subscribe', this, segmentName);
    var callback = (newState) => {
      this.setState({[stateName]: newState});
    };

    var storeRef = this.getReduxStore().subscribe(
      segmentName, query, callback, this, queryOptions, hydrationOption);
    this.unsubscribe[segmentName] = storeRef.unsubscribe;
    this.setState({
     [stateName]: storeRef.getState()
    });
  }

  /**
   * @param {string} stateName
   */
  unsubscribe(stateName) {
    console.log('[DATA] Un-register', this, stateName);
    if (this.__soyaUnsubscribe[stateName]) {
      this.__soyaUnsubscribe[stateName]();
      delete this.__soyaUnsubscribe[stateName];
    }
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
    console.log('[DATA] Receive new props', this, nextProps);
    this.subscribeQueries(nextProps);
  }

  /**
   * Registers the store. Run at both client and server side when rendering.
   */
  componentWillMount() {
    console.log('[DATA] Mounting', this, this.props);
    this.registerSegments(this.props);
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