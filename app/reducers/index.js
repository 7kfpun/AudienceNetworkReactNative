import { combineReducers } from 'redux';

import { AppNavigator } from '../navigators/AppNavigator';
import authReducer from './auth';
import fbappsReducer from './fbapps';
import dateRangeReducer from './dateRange';
import insightReducer from './insights';

const initialNavState = AppNavigator.router.getStateForAction(
  AppNavigator.router.getActionForPathAndParams('Main'),
);

const navReducer = (state = initialNavState, action) => {
  const nextState = AppNavigator.router.getStateForAction(action, state);
  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

const AppReducer = combineReducers({
  nav: navReducer,
  auth: authReducer,
  fbapps: fbappsReducer,
  dateRange: dateRangeReducer,
  insights: insightReducer,
});

export default AppReducer;
