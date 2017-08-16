import React, { Component } from 'react';
import {
  BackHandler,
  Image,
  Linking,
  ListView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Platform,
  View,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { Button, FormInput } from 'react-native-elements';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import SafariView from 'react-native-safari-view';

import * as fbappActions from '../actions/fbapp';

import * as Facebook from '../utils/facebook';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  headerNav: {
    flex: 1,
    justifyContent: 'center',
    padding: 6,
  },
  headerLeftText: {
    fontSize: 16,
    color: '#0076FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
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

const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

class AddView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Add',
    headerLeft: <TouchableOpacity
      style={styles.headerNav}
      underlayColor="white"
      onPress={() => {
        navigation.goBack();
        tracker.logEvent('cancel-add-app', { category: 'user-event', view: 'add' });
      }}
    >
      {Platform.OS === 'ios' ? <Text style={styles.headerLeftText}>{'Cancel'}</Text> : <Icon name="close" size={30} color="#0076FF" />}
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: 'white',
    },
  });

  state = {
    isLoading: false,
    dataSource: dataSource.cloneWithRows([]),
  };

  componentDidMount() {
    this.sub = BackHandler.addEventListener('backPress', () => this.props.navigation.goBack());
  }

  componentWillUnmount() {
    this.sub.remove();
  }

  onSearchRequest() {
    this.setState({ isLoading: true });
    Facebook.checkAppId(this.state.text, (error, result) => this.responseInfoCallback(error, result));
    tracker.logEvent('search-app', { category: 'user-event', view: 'add' });
  }

  addApp(app) {
    const { addFbapp } = this.props;
    addFbapp(app);

    tracker.logEvent('add-a-new-app', { category: 'user-event', view: 'add' });
    this.props.navigation.goBack();
  }

  responseInfoCallback(error, result) {
    if (error) {
      console.log('Error checking app id:', error);
      this.setState({
        isLoading: false,
        isInvalid: true,
      });
      tracker.logEvent('search-app-error', { category: 'user-event', view: 'add' });
    } else {
      console.log('Success checking app id:', result);
      this.setState({
        result,
        isLoading: false,
      });
      tracker.logEvent('search-app-success', { category: 'user-event', view: 'add' });
    }
  }

  // renderNav() {
  //   const addApp = (app) => {
  //     store.get('APPS').then((apps) => {
  //       let tempApps = apps;
  //       if (!tempApps || !Array.isArray(tempApps)) {
  //         tempApps = [];
  //       }
  //
  //       tempApps.push(app);
  //       store.save('APPS', tempApps);
  //
  //       Actions.pop();
  //       Actions.refresh({});
  //       tracker.logEvent('add-a-new-app', { category: 'user-event', view: 'add' });
  //     });
  //   };
  //
  //   return (
  //     <NavigationBar
  //       title={{ title: this.props.title }}
  //       style={styles.navigatorBar}
  //       leftButton={{
  //         title: 'Cancel',
  //         handler: Actions.pop,
  //       }}
  //       rightButton={{
  //         title: this.state.result && this.state.result.name ? 'Add' : '',
  //         handler: () => addApp(this.state.result),
  //       }}
  //     />
  //   );
  // }

  render() {
    tracker.view('add');

    return (
      <View style={styles.container}>
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
          onPress={() => this.onSearchRequest()}
        />

        {this.state.result && this.state.result.name && <View style={styles.appBlock}>
          <Image style={styles.image} source={{ uri: this.state.result.logo_url }} />
          {/* <Image style={styles.image} source={require('./../../assets/app.png')} /> */}
          <View style={{ paddingLeft: 10 }}>
            <Text>{this.state.result.name} <Text style={{ fontSize: 12, color: 'gray' }}>{this.state.result.id}</Text></Text>
            {this.state.result.category && <Text>{this.state.result.category}</Text>}
          </View>
          <TouchableOpacity
            underlayColor="white"
            onPress={() => this.addApp(this.state.result)}
          >
            <Icon name="add-circle-outline" size={30} color="gray" />
          </TouchableOpacity>
        </View>}

        {this.state.isInvalid && <View style={{ alignItems: 'center', paddingTop: 30 }}>
          <Text style={[styles.text, { color: 'red' }]}>{'Invalid Facebook App ID'}</Text>
        </View>}

        <View style={{ alignItems: 'center', paddingTop: 30 }}>
          <Text style={styles.text}>You can find your Facebook App IDs at</Text>
          <TouchableOpacity
            onPress={() => {
              const url = 'https://developers.facebook.com/apps/';
              if (Platform.OS === 'ios') {
                SafariView.isAvailable()
                  .then(() => SafariView.show({ url }))
                  .catch(error => console.log(error));
              } else {
                Linking.openURL(url);
              }
              tracker.logEvent('open-fb-developers-link', { category: 'user-event', view: 'add' });
            }}
          >
            <Text style={[styles.text, { color: '#0076FF' }]}>{'https://developers.facebook.com/apps/'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

AddView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  addFbapp: React.PropTypes.func.isRequired,
};

export default connect(
  null,
  dispatch => bindActionCreators(fbappActions, dispatch),
)(AddView);
