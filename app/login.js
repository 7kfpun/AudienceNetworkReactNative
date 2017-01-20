import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { AccessToken, AppEventsLogger, LoginButton } from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loginBlock: {
    flex: 1,
  },
  textBlock: {
    flex: 6,
    margin: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    flex: 3,
    alignItems: 'center',
  },
  informationBlock: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    lineHeight: 50,
    fontWeight: '200',
    textAlign: 'center',
    color: '#82B1FF',
  },
  informationText: {
    textAlign: 'center',
    color: '#9E9E9E',
  },
});

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLogged: false,
    };
  }

  componentDidMount() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        console.log('getCurrentAccessToken', data);
        if (data && data.expirationTime && data.expirationTime > new Date().getTime()) {
          this.setState({ isLogged: true });
        }
      },
    );
  }

  renderNav() {
    return (
      <NavigationBar
        leftButton={{
          title: this.state.isLogged ? 'Cancel' : '',
          handler: () => {
            Actions.pop();
            AppEventsLogger.logEvent('press-cancel-logout-button');
          },
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNav()}
        <View style={styles.loginBlock}>
          {this.state.isLogged && <View style={styles.textBlock}>
            <Text style={styles.text}>Logout</Text>
          </View>}
          {!this.state.isLogged && <View style={styles.textBlock}>
            <Text style={styles.text}>{'Welcome to'}</Text>
            <Text style={styles.text}>{'Audience Network'}</Text>
            <Text style={[styles.text, { fontSize: 16 }]}>{'Your Facebook Ads Performance Tool'}</Text>
          </View>}
          <View style={styles.loginButton}>
            <LoginButton
              readPermissions={['read_audience_network_insights']}
              onLoginFinished={
                (error, result) => {
                  if (error) {
                    alert(`Login has error: ${result.error}`);
                  } else if (result.isCancelled) {
                    alert('Login is cancelled.');
                  } else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        console.log('getCurrentAccessToken', data);
                        Actions.pop();
                        Actions.refresh();
                        AppEventsLogger.logEvent('login');
                      },
                    );
                  }
                }
              }
              onLogoutFinished={() => {
                this.setState({ isLogged: false });
                store.delete('APPS');
                AppEventsLogger.logEvent('logout');
              }}
            />
          </View>
          {this.state.isLogged && <View style={styles.informationBlock}>
            <Text style={styles.informationText}>{'Are you sure you want to log out?'}</Text>
          </View>}
          {!this.state.isLogged && <View style={styles.informationBlock}>
            <Text style={styles.informationText}>{'Login to see your Audience Network insights'}</Text>
          </View>}
          <View style={styles.informationBlock}>
            <Text style={styles.informationText}>{'Made with <3 by KF'}</Text>
          </View>
        </View>
      </View>
    );
  }
}

Login.propTypes = {
  pageId: React.PropTypes.string,
  pageName: React.PropTypes.string,
  pageCategory: React.PropTypes.string,
  pageAccessToken: React.PropTypes.string,
};
