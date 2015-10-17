import { compose, createStore } from 'redux';
import { devTools, persistState } from 'redux-devtools';

import rootReducer from '../reducers';

// https://github.com/gaearon/redux-devtools
const composedCreateStore = compose(
  devTools()
)(createStore);

export default function configureStore(initialState) {
  const store = composedCreateStore(rootReducer, initialState);

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers');
      store.replaceReducer(nextReducer);
    });
  }

  return store;
};