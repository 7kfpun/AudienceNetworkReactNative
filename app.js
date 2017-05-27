import React, { Component } from 'react';

import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import AppReducer from './app/reducers';
import AppWithNavigationState from './app/navigators/AppNavigator';

export default class App extends Component {
  store = createStore(
    AppReducer,
    undefined,
    applyMiddleware(thunk),
  );

  render() {
    return (
      <Provider store={this.store}>
        <AppWithNavigationState />
      </Provider>
    );
  }
}
