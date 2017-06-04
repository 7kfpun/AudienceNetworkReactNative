import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AccessToken, LoginButton } from 'react-native-fbsdk';
import store from 'react-native-simple-store';

import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerLeftText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#0076FF',
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
    fontSize: 11,
    textAlign: 'center',
    color: '#9E9E9E',
  },
});

class LoginView extends Component {
  static navigationOptions = ({ navigation }) => {
    const isLoggedIn = navigation.state && navigation.state.params && navigation.state.params.isLoggedIn;
    const options = {
      headerLeft: <TouchableOpacity
        underlayColor="white"
        onPress={() => {
          navigation.goBack();
          tracker.logEvent('cancel-logout', { category: 'user-event', view: 'login-logout' });
        }}
      >
        <Text style={styles.headerLeftText}>{'Cancel'}</Text>
      </TouchableOpacity>,
      headerStyle: {
        backgroundColor: 'white',
      },
    };

    if (!isLoggedIn) {
      options.header = null;
    }

    return options;
  };

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
          this.props.navigation.setParams({ isLoggedIn: true });
        }
      },
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.props.navigation.setParams({ isLoggedIn: nextProps.isLoggedIn });
    }
  }

  renderFacebookButton() {
    const { navigation } = this.props;
    const { goBack, dispatch } = navigation;

    return (<View style={styles.loginButton}>
      <LoginButton
        readPermissions={['read_audience_network_insights']}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert(`Login has error: ${result.error}`);
              tracker.logEvent('login-error', { category: 'user-event', view: 'login-logout' });
            } else if (result.isCancelled) {
              alert('Login is cancelled.');
              tracker.logEvent('login-cancel', { category: 'user-event', view: 'login-logout' });
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  console.log('getCurrentAccessToken', data);
                  dispatch({ type: 'Login' });
                  goBack();
                  tracker.logEvent('login-success', { category: 'user-event', view: 'login-logout' });
                },
              );
            }
          }
        }
        onLogoutFinished={() => {
          this.setState({ isLogged: false });
          dispatch({ type: 'Logout' });
          store.delete('APPS');
          tracker.logEvent('logout', { category: 'user-event', view: 'login-logout' });
        }}
      />
    </View>);
  }

  render() {
    const { isLoggedIn } = this.props;

    return (
      <View style={styles.container}>
        <View style={styles.loginBlock}>
          {isLoggedIn && <View style={styles.textBlock}>
            <Text style={styles.text}>{'Logout'}</Text>
          </View>}
          {!isLoggedIn && <View style={styles.textBlock}>
            <Text style={styles.text}>{'Welcome to'}</Text>
            <Text style={[styles.text, { fontSize: 50, lineHeight: 80 }]}>{'F.A.N Report'}</Text>
            <Text style={[styles.text, { fontSize: 16 }]}>{'Your Ads Performance Tool'}</Text>
          </View>}
          {this.renderFacebookButton()}
          {isLoggedIn && <View style={styles.informationBlock}>
            <Text style={styles.informationText}>{'Are you sure you want to log out?'}</Text>
          </View>}
          {!isLoggedIn && <View style={styles.informationBlock}>
            <Text style={styles.informationText}>{'Login to see your Audience Network insights'}</Text>
          </View>}
          <View style={styles.informationBlock}>
            <Text style={styles.informationText}>{'Made with <3 by KF'}</Text>
            <Text style={styles.informationText}>{'The application is in no way affiliated with Facebook'}</Text>
          </View>
        </View>
      </View>
    );
  }
}

LoginView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  isLoggedIn: React.PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
});

export default connect(mapStateToProps)(LoginView);
