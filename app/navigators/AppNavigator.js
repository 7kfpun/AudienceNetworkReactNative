import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addNavigationHelpers, StackNavigator } from 'react-navigation';

import LoginView from '../containers/Login';
import MainView from '../containers/Main';
import OverviewView from '../containers/Overview';
import AddView from '../containers/Add';
import DateSettingsView from '../containers/DateSettings';

export const AppNavigator = StackNavigator({
  Login: { screen: LoginView },
  Main: { screen: MainView },
  Overview: { screen: OverviewView },
  Add: { screen: AddView },
  DateSettings: { screen: DateSettingsView },
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
