import Store from '../Store.js';

/*

type StoreReference = {
  getState: Function;
  getActionCreator: Function;
  unsubscribe: Function;
};

class Component extends DataComponent {
  // TODO: Use immutable on state?
  constructor(props, context) {
    super(props, context);
    this.state = {
      actions: {},
      pieces: {},
      unsubscribeFns: {}
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
    var unsubscribe = this.state.unsubscribe;
    unsubscribe[stateVar] = storeRef.unsubscribe;
    var stateToSet = {
      [stateVar]: storeRef.getState(),
      unsubscribe: unsubscribe
    };
    if (!actions[stateVar]) {
      stateToSet.actions = actions;
      stateToSet.actions[stateVar] = storeRef.getActionCreator();
    }
    this.setState(stateToSet);
  }

  unregister(name) {
    if (this.state.unsubscribe[stateVar]) {
      this.state.unsubscribe[stateVar]();
      delete this.state.unsubscribe[stateVar];
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

/**
 * Creates and wraps redux store. Responsibilities:
 *
 * 1. Wraps redux store.
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
   * @param {Function} callback
   * @param {?{[key: RenderType]: HydrationType}} hydrationOption
   * @return {StoreReference}
   */
  register(segment, callback, hydrationOption) {

  }
}