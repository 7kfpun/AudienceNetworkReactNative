import React, { Component } from 'react';
import {
  Image,
  Linking,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { Actions } from 'react-native-router-flux';
import { AppEventsLogger } from 'react-native-fbsdk';
import { Button, FormInput } from 'react-native-elements';
import NavigationBar from 'react-native-navbar';
import SafariView from 'react-native-safari-view';
import store from 'react-native-simple-store';

import * as Facebook from './utils/facebook';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  navigatorBar: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#E0E0E0',
  },
  row: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appBlock: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 30,
  },
  image: {
    width: 35,
    height: 35,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
  },
});

export default class AddView extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

    this.state = {
      isLoading: false,
      dataSource: this.dataSource.cloneWithRows([]),
    };
  }

  onRequest() {
    console.log('onRequest accounts');
    this.setState({ isLoading: true });
    Facebook.checkAppId(this.state.text, (error, result) => this.responseInfoCallback(error, result));
    AppEventsLogger.logEvent('search-app');
  }

  responseInfoCallback(error, result) {
    if (error) {
      console.log('Error checking app id:', error);
      this.setState({
        isLoading: false,
        isInvalid: true,
      });
      AppEventsLogger.logEvent('search-app-fail');
    } else {
      console.log('Success checking app id:', result);
      this.setState({
        result,
        isLoading: false,
      });
      AppEventsLogger.logEvent('search-app-success');
    }
  }

  renderNav() {
    const addApp = (app) => {
      store.get('APPS').then((apps) => {
        let tempApps = apps;
        if (!tempApps || !Array.isArray(tempApps)) {
          tempApps = [];
        }

        tempApps.push(app);
        store.save('APPS', tempApps);

        Actions.pop();
        Actions.refresh({});
        AppEventsLogger.logEvent('add-a-new-app');
      });
    };

    return (
      <NavigationBar
        title={{ title: this.props.title }}
        style={styles.navigatorBar}
        leftButton={{
          title: 'Cancel',
          handler: Actions.pop,
        }}
        rightButton={{
          title: this.state.result && this.state.result.name ? 'Add' : '',
          handler: () => addApp(this.state.result),
        }}
      />
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNav()}
        <View>
          <View style={{ marginVertical: 10 }}>
            <FormInput
              placeholder={'Facebook App ID'}
              keyboardType={'numeric'}
              onChangeText={text => this.setState({ text, result: null, isInvalid: false })}
            />
          </View>
          <Button
            raised
            title={!this.state.isLoading ? 'SEARCH' : ''}
            icon={!this.state.isLoading ? { name: 'search' } : null}
            loading={this.state.isLoading}
            disabled={!(this.state.text && this.state.text.length > 8 && !isNaN(this.state.text)) || this.state.isLoading}
            onPress={() => this.onRequest()}
          />

          {this.state.result && this.state.result.name && <View style={styles.appBlock}>
            <Image style={styles.image} source={{ uri: this.state.result.logo_url }} />
            <View style={{ paddingLeft: 10 }}>
              <Text>{this.state.result.name} <Text style={{ fontSize: 12, color: 'gray' }}>{this.state.result.id}</Text></Text>
              {this.state.result.category && <Text>{this.state.result.category}</Text>}
            </View>
          </View>}

          {this.state.isInvalid && <View style={{ alignItems: 'center', paddingTop: 30 }}>
            <Text style={[styles.text, { color: 'red' }]}>{'Invalid Facebook App ID'}</Text>
          </View>}

          <View style={{ alignItems: 'center', paddingTop: 30 }}>
            <Text style={styles.text}>You can find your Facebook App IDs at</Text>
            <TouchableOpacity
              onPress={() => {
                SafariView.isAvailable()
                  .then(SafariView.show({ url: 'https://developers.facebook.com/apps/' }))
                  .catch(() => Linking.openURL('https://developers.facebook.com/apps/'));
                AppEventsLogger.logEvent('open-fb-apps-link');
              }}
            >
              <Text style={[styles.text, { color: '#0076FF' }]}>{'https://developers.facebook.com/apps/'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

AddView.propTypes = {
  title: React.PropTypes.string,
};
