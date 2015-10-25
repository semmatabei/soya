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

    if (!(this.getReduxStore() instanceof ReduxStore)) {
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

  /**
   * @param {Segment} segment
   * @param {any} query
   * @param {string} stateName
   * @param {?Object} queryOptions
   * @param {?Object} hydrationOption
   */
  register(segment, query, stateName, queryOptions, hydrationOption) {
    // Unregister if already registered.
    this.unregister(stateName);
    console.log('register', segment, this.state);
    var callback = (newState) => {
      this.setState({[stateName]: newState});
    };

    var storeRef = this.getReduxStore().register(segment, query, callback,
      this, queryOptions, hydrationOption);
    var action = this.state.action;
    var unsubscribe = this.state.unsubscribe;
    action[segment._getName()] = storeRef.actionCreator;
    unsubscribe[stateName] = storeRef.unsubscribe;
    this.setState({
     [stateName]: storeRef.getState(),
      action: action,
      unsubscribe: unsubscribe
    });
  }

  /**
   * @param {string} stateName
   */
  unregister(stateName) {
    console.log('unregister', stateName);
    delete this.state[stateName];
    if (this.state.unsubscribe[stateName]) {
      this.state.unsubscribe[stateName]();
      delete this.state.unsubscribe[stateName];
    }
  }

  /**
   * Registers the store. Run at both client and server side when rendering.
   */
  componentWillMount() {
    this.registerSegments();
    console.log('COMPONENT WILL MOUNT');
  }

  /**
   * Unregister all segments.
   */
  componentWillUnmount() {
    console.log('COMPONENT WILL UNMOUNT');
    this.getReduxStore().unsubscribe(this);
  }
}