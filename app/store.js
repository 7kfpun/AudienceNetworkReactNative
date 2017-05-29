import { createStore, applyMiddleware } from 'redux';

import thunk from 'redux-thunk';
import createLoggerMiddleware from 'redux-logger';

import getRootReducer from './reducers';

const middlewares = [thunk];
if (__DEV__ === true) {
  middlewares.push(createLoggerMiddleware({}));
}

export default function getStore(navReducer) {
  const store = createStore(
    getRootReducer(navReducer),
    undefined,
    applyMiddleware(...middlewares),
  );

  return store;
}
