import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  ActionSheetIOS,
  Alert,
  Image,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import { AccessToken, AppEventsLogger } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as fbappActions from '../actions/fbapp';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  image: {
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
  },
});


class MainView extends Component {
  static navigationOptions = ({ navigation }) => {
    const isLoggedIn = navigation.state && navigation.state.params && navigation.state.params.isLoggedIn;
    return {
      title: 'F.A.N Report',
      headerLeft: <TouchableOpacity
        underlayColor="white"
        onPress={() => {
          navigation.navigate('Login');
          AppEventsLogger.logEvent('press-logout-button');
        }}
      >
        <Text style={{ marginLeft: 6, fontSize: 16, color: '#0076FF' }}>{isLoggedIn ? 'Logout' : 'Login'}</Text>
      </TouchableOpacity>,
      headerRight: isLoggedIn && <TouchableOpacity
        underlayColor="white"
        onPress={() => {
          navigation.navigate('Add');
          AppEventsLogger.logEvent('press-add-button');
        }}
      >
        <Icon name="add" size={30} color="#0076FF" />
      </TouchableOpacity>,
      headerStyle: {
        backgroundColor: 'white',
      },
    };
  };

  state = {
    refreshing: false,
  };

  componentDidMount() {
    const { dispatch, navigate } = this.props.navigation;

    AccessToken.getCurrentAccessToken().then(
      (data) => {
        console.log('getCurrentAccessToken', data);
        if (data && data.permissions) {
          dispatch({ type: 'Login' });
        } else {
          dispatch({ type: 'Logout' });
          navigate('Login');
        }
      },
    );

    this.props.fetchFbapps();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.props.navigation.setParams({ isLoggedIn: nextProps.isLoggedIn });
    }
  }

  onPressDelete(appId) {
    const deleteApp = (id) => {
      this.props.deleteFbapp(id);
      AppEventsLogger.logEvent('delete-a-new-app');
    };

    if (Platform.OS === 'ios') {
      const BUTTONS = [
        'Delete',
        'Cancel',
      ];
      const DESTRUCTIVE_INDEX = 0;
      const CANCEL_INDEX = 1;

      ActionSheetIOS.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        destructiveButtonIndex: DESTRUCTIVE_INDEX,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          deleteApp(appId);
        }
      });
    } else {
      Alert.alert(
        'Do you want to delete this App?',
        null,
        [
          { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
          { text: 'OK', onPress: () => deleteApp(appId) },
        ],
      );
    }
  }

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  render() {
    const { navigation, isLoggedIn, fbapps } = this.props;
    const dataSource = this.dataSource.cloneWithRows(fbapps);

    if (fbapps.length === 0) {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{isLoggedIn ? 'yes' : 'no'}</Text>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{'You have no Apps added yet.'}</Text>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{'Tap the + to add one and get the performance.'}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, marginVertical: 10 }}>
          <ListView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.initDataSource(fbapps)}
              />
            }
            enableEmptySections={true}
            dataSource={dataSource}

            renderRow={item => (<TouchableHighlight
              onPress={() => {
                navigation.navigate('Overview', { appId: item.id, appName: item.name });
                AppEventsLogger.logEvent('check-overview');
              }}
              onLongPress={() => this.onPressDelete(item.id)}
            >
              <View style={styles.row}>
                <Image style={styles.image} source={{ uri: item.logo_url }} />
                <View style={{ paddingLeft: 10 }}>
                  <Text style={styles.text}>{item.name} <Text style={{ fontSize: 12, color: 'grey' }}>{item.id}</Text></Text>
                  {item.category && <Text style={styles.text}>{item.category}</Text>}
                </View>
              </View>
            </TouchableHighlight>)}
          />
        </View>
      </View>
    );
  }
}

MainView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  isLoggedIn: React.PropTypes.bool.isRequired,
  fbapps: React.PropTypes.array.isRequired,
  fetchFbapps: React.PropTypes.func.isRequired,
  deleteFbapp: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  fbapps: state.fbapps,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(fbappActions, dispatch),
)(MainView);
