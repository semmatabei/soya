import React from 'react';

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
      action: action,
      unsubscribe: unsubscribe
    });
  }

  /**
   * @param {string} stateName
   */
  unregister(stateName) {
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
    this.registerStores();
  }

  /**
   * Unregister all segments.
   */
  componentWillUnmount() {
    this.getReduxStore().unsubscribe(this);
  }
}