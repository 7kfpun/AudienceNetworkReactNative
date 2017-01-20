import React, { Component } from 'react';
import {
  ActionSheetIOS,
  Image,
  ListView,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import { AccessToken, AppEventsLogger } from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import NavigationBar from 'react-native-navbar';
import store from 'react-native-simple-store';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  navigatorBar: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#E0E0E0',
  },
  navigatorRightButton: {
    paddingTop: 10,
    paddingLeft: 50,
    paddingRight: 10,
  },
  row: {
    backgroundColor: 'white',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
  },
});

export default class Main extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

    this.state = {
      refreshing: false,
      dataSource: this.dataSource.cloneWithRows([]),
      apps: [],
    };
  }

  componentDidMount() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        console.log('getCurrentAccessToken', data);
        if (!data || !data.permissions) {
          Actions.login();
        }
      },
    );

    this.prepareRows();
  }

  componentWillReceiveProps() {
    this.prepareRows();
  }

  prepareRows() {
    const that = this;
    store.get('APPS').then((apps) => {
      let tempApps = apps;
      if (!tempApps || !Array.isArray(tempApps)) {
        tempApps = [];
      }
      that.setState({
        apps: tempApps,
        dataSource: that.dataSource.cloneWithRows(tempApps),
      });
    });
  }

  delete(appId) {
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
        const apps = this.state.apps.filter(item => item.id !== appId);
        store.save('APPS', apps);
        this.setState({
          apps,
          dataSource: this.dataSource.cloneWithRows(apps),
        });
        AppEventsLogger.logEvent('delete-a-new-app');
      }
    });
  }

  renderNav() {
    return (
      <NavigationBar
        title={{ title: this.props.title }}
        style={styles.navigatorBar}
        leftButton={{
          title: 'Logout',
          handler: () => {
            Actions.login();
            AppEventsLogger.logEvent('press-logout-button');
          },
        }}
        rightButton={<TouchableHighlight
          style={styles.navigatorRightButton}
          underlayColor="white"
          onPress={() => {
            Actions.add();
            AppEventsLogger.logEvent('press-add-button');
          }}
        >
          <Icon name="add" size={30} color="#0076FF" />
        </TouchableHighlight>}
      />
    );
  }

  render() {
    if (this.state.apps.length === 0) {
      return (
        <View style={styles.container}>
          {this.renderNav()}
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{'You have no Apps added yet.'}</Text>
            <Text style={[styles.text, { textAlign: 'center', lineHeight: 40 }]}>{'Tap the + to add one and get the performance.'}</Text>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {this.renderNav()}
        <View style={{ flex: 1, marginVertical: 10 }}>
          <ListView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => this.prepareRows()}
              />
            }

            enableEmptySections={true}
            onEndReached={() => {
              console.log('onEndReached');
              // this.onPagingRequest();
            }}
            dataSource={this.state.dataSource}

            renderRow={item => <TouchableHighlight
              onPress={() => {
                Actions.overview({ appId: item.id, appName: item.name });
                AppEventsLogger.logEvent('check-overview');
              }}
              onLongPress={() => this.delete(item.id)}
            >
              <View style={styles.row}>
                <Image style={styles.image} source={{ uri: item.logo_url }} />
                <View style={{ paddingLeft: 10 }}>
                  <Text style={styles.text}>{item.name} <Text style={{ fontSize: 12, color: 'grey' }}>{item.id}</Text></Text>
                  {item.category && <Text style={styles.text}>{item.category}</Text>}
                </View>
              </View>
            </TouchableHighlight>}
          />
        </View>
      </View>
    );
  }
}

Main.propTypes = {
  title: React.PropTypes.string,
};
