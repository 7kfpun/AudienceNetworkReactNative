import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Alert,
  ListView,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { AccessToken } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as fbappActions from '../actions/fbapp';
import * as dateRangeActions from '../actions/dateRange';
import AdBanner from '../components/fbadbanner';
import RangePicker from '../components/RangePicker';
import Item from '../components/Item';

import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  headerLeftText: {
    marginLeft: 6,
    fontSize: 16,
    color: '#0076FF',
  },
  body: {
    paddingVertical: 6,
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
  removeButton: {
    alignItems: 'center',
    backgroundColor: '#ff3b30',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
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
          tracker.logEvent('view-logout', { category: 'user-event', view: 'main' });
        }}
      >
        <Text style={styles.headerLeftText}>{isLoggedIn ? 'Logout' : 'Login'}</Text>
      </TouchableOpacity>,
      headerRight: isLoggedIn && <TouchableOpacity
        underlayColor="white"
        onPress={() => {
          navigation.navigate('Add');
          tracker.logEvent('view-add', { category: 'user-event', view: 'main' });
        }}
      >
        <Icon style={{ marginRight: 4 }} name="add" size={30} color="#0076FF" />
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
    const { fetchFbapps, fetchDateRange, navigation } = this.props;

    AccessToken.getCurrentAccessToken().then(
      (data) => {
        console.log('getCurrentAccessToken', data);
        if (data && data.permissions) {
          navigation.dispatch({ type: 'Login' });
        } else {
          navigation.dispatch({ type: 'Logout' });
          navigation.navigate('Login');
        }
      },
    );

    fetchFbapps();
    fetchDateRange();
  }

  componentWillReceiveProps(nextProps) {
    const { fetchFbapps, fetchDateRange } = this.props;

    if (nextProps.isLoggedIn !== this.props.isLoggedIn) {
      this.props.navigation.setParams({ isLoggedIn: nextProps.isLoggedIn });
    }

    if (nextProps.fbapps.length !== this.props.fbapps.length) {
      fetchFbapps();
      fetchDateRange();
    }
  }

  onPressDelete(appId) {
    const deleteApp = (id) => {
      this.props.deleteFbapp(id);
      tracker.logEvent('delete-a-app', { category: 'user-event', view: 'main' });
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
        } else {
          tracker.logEvent('delete-a-app-cancel', { category: 'user-event', view: 'main' });
        }
      });
    } else {
      Alert.alert(
        'Do you want to delete this App?',
        null,
        [
          { text: 'Cancel', onPress: () => tracker.logEvent('delete-a-app-cancel', { category: 'user-event', view: 'main' }) },
          { text: 'OK', onPress: () => deleteApp(appId) },
        ],
      );
    }
  }

  dataSource = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

  render() {
    const { navigation, fbapps, startDate, endDate } = this.props;
    const dataSource = this.dataSource.cloneWithRows(fbapps);

    if (fbapps.length === 0) {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{'You have no Apps added yet.'}</Text>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{'Tap the + to add one and get the performance.'}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <RangePicker navigation={navigation} />

        <SwipeListView
          style={styles.body}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.props.fetchFbapps();
                this.setState({ random: Math.random() });
                tracker.logEvent('refresh-applist', { category: 'user-event', view: 'main' });
              }}
            />
          }
          enableEmptySections={true}
          dataSource={dataSource}

          renderRow={item => <Item key={this.state.random} navigation={navigation} item={item} startDate={startDate} endDate={endDate} />}

          renderHiddenRow={item => (
            <TouchableOpacity
              style={{ flex: 1 }}
              onPress={() => {
                this.onPressDelete(item.id);
              }}
            >
              <View style={styles.removeButton}>
                <Text />
                <Text style={{ color: 'white' }}>Remove</Text>
              </View>
            </TouchableOpacity>
          )}

          rightOpenValue={-75}
          disableRightSwipe={true}
        />
        <AdBanner withPopUp={false} />
      </View>
    );
  }
}

MainView.defaultProps = {
  startDate: null,
  endDate: null,
};

MainView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  isLoggedIn: React.PropTypes.bool.isRequired,
  fbapps: React.PropTypes.array.isRequired,
  fetchFbapps: React.PropTypes.func.isRequired,
  deleteFbapp: React.PropTypes.func.isRequired,
  fetchDateRange: React.PropTypes.func.isRequired,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
};

const mapStateToProps = state => ({
  isLoggedIn: state.auth.isLoggedIn,
  fbapps: state.fbapps,
  startDate: state.dateRange.startDate,
  endDate: state.dateRange.endDate,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(Object.assign({}, fbappActions, dateRangeActions), dispatch),
)(MainView);
