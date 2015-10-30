import React from 'react';

import ReduxStore from './ReduxStore.js';

/**
 * Components that wanted to use Soya's redux container may use this.
 *
 * @CLIENT_SERVER
 */
export default class DataComponent extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      action: {},
      unsubscribe: {}
    };

    // Both actions and unsubscribe is not part of state because it shouldn't
    // affect rendering in any way. Actions are determined at mounting and
    // shouldn't change throughout this component's lifecycle. Unsubscribe
    // contains functions that unsubscribes this component from state changes,
    // but it's the actual state that matters.
    this.actions = {};
    this.unsubscribe = {};

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
   * NOTE: Registration should be done with register() method.
   */
  registerSegments() {

  }

  subscribeQuery(props) {

  }

  /**
   * @param {Segment} segment
   */
  register(segment) {
    var actionCreator = this.getReduxStore().register(segment);
    this.actions[segment._getName()] = actionCreator;
  }

  /**
   * @param {string} segmentName
   * @param {any} query
   * @param {string} stateName
   * @param {?Object} queryOptions
   * @param {?Object} hydrationOption
   */
  subscribe(segmentName, query, stateName, queryOptions, hydrationOption) {
    // Unregister if already registered.
    this.unregister(stateName);
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
  unregister(stateName) {
    delete this.state[stateName];
    if (this.unsubscribe[stateName]) {
      this.unsubscribe[stateName]();
      delete this.unsubscribe[stateName];
    }
  }

  componentWillReceiveProps(nextProps) {

  }

  /**
   * Registers the store. Run at both client and server side when rendering.
   */
  componentWillMount() {
    this.registerSegments();
  }

  /**
   * Unregister all segments.
   */
  componentWillUnmount() {
    this.getReduxStore().unsubscribe(this);
  }
}