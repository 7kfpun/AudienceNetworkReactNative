import React from 'react';

import { Actions, Router, Scene } from 'react-native-router-flux';

import Main from './app/main';
import Login from './app/login';
import Overview from './app/overview';
import Add from './app/add';

console.ignoredYellowBox = [
  'Possible Unhandled Promise Rejection',
  'Warning: setState(...): Can only update a mounted or mounting component.',
];

const scenes = Actions.create(
  <Scene key="root">
    <Scene key="main" title={'Audience Network'} component={Main} hideNavBar={true} initial={true} />
    <Scene key="add" title={'Add'} component={Add} hideNavBar={true} direction="vertical" />
    <Scene key="login" title={'Login'} component={Login} hideNavBar={true} direction="vertical" panHandlers={null} />
    <Scene key="overview" title={'Overview'} component={Overview} hideNavBar={true} />
  </Scene>,
);

const AudienceNetwork = function Photos() {
  return <Router scenes={scenes} />;
};

export default AudienceNetwork;
