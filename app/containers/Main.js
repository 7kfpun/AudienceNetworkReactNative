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

import { AccessToken, AppEventsLogger } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as fbappActions from '../actions/fbapp';
import * as dateRangeActions from '../actions/dateRange';
import AdBanner from '../components/fbadbanner';
import RangePicker from '../components/RangePicker';
import Item from '../components/Item';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
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
    const { fetchRangeType, fetchRangeTypeOrder, fetchDateRange, navigation } = this.props;

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

    this.props.fetchFbapps();
    // fetchRangeType();
    // fetchRangeTypeOrder();
    fetchDateRange();
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
                AppEventsLogger.logEvent('refresh-applist');
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
                AppEventsLogger.logEvent('remove-an-app');
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

MainView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  isLoggedIn: React.PropTypes.bool.isRequired,
  fbapps: React.PropTypes.array.isRequired,
  fetchFbapps: React.PropTypes.func.isRequired,
  deleteFbapp: React.PropTypes.func.isRequired,
  fetchRangeType: React.PropTypes.func.isRequired,
  fetchRangeTypeOrder: React.PropTypes.func.isRequired,
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
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
