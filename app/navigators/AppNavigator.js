import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import LoginView from '../containers/login';
import MainView from '../containers/main';
import OverviewView from '../containers/overview';
import AddView from '../containers/add';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginView },
  Main: { screen: MainView },
  Overview: { screen: OverviewView },
  Add: { screen: AddView },
}, {
  mode: 'modal',
  headerMode: 'screen',
});

const AppWithNavigationState = ({ dispatch, nav }) => (
  <AppNavigator navigation={addNavigationHelpers({ dispatch, state: nav })} />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func.isRequired,
  nav: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
