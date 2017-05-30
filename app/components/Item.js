import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk';
import { connect } from 'react-redux';

import * as facebook from '../utils/facebook';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
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
  titleText: {
    fontSize: 15,
    lineHeight: 22,
  },
  idText: {
    fontSize: 13,
    fontWeight: '200',
    color: 'grey',
  },
  text: {
    fontSize: 15,
    fontWeight: '200',
    lineHeight: 22,
  },
});

Array.prototype.sum = function sum(prop) {
  let total = 0;
  for (let i = 0, len = this.length; i < len; i += 1) {
    if (parseInt(this[i][prop], 10) === this[i][prop]) {
      total += parseInt(this[i][prop], 10);
    } else {
      total += parseFloat(this[i][prop]);
    }
  }
  return total;
};

export default class Item extends Component {
  state = {}

  componentDidMount() {
    const { item, startDate, endDate } = this.props;
    this.loadRevenue(item.id, startDate, endDate);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.startDate !== this.props.startDate || nextProps.endDate !== this.props.endDate) {
      this.loadRevenue(nextProps.item.id, nextProps.startDate, nextProps.endDate);
    }
  }

  loadRevenue(id, startDate, endDate) {
    facebook.audienceNetwork(
      id, 'fb_ad_network_revenue', 'SUM', null, startDate, endDate,
      (error, result) => {
        if (error) {
          console.error(error);
        } else {
          this.setState({ revenue: result.data.sum('value') });
        }
      });
  }

  render() {
    const { navigation, item } = this.props;
    return (<TouchableHighlight
      onPress={() => {
        navigation.navigate('Overview', { appId: item.id, appName: item.name });
        AppEventsLogger.logEvent('check-overview');
      }}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: item.logo_url }} />
        <View style={{ flex: 4, paddingLeft: 5 }}>
          <Text style={styles.titleText}>{item.name} <Text style={styles.idText}>{item.id}</Text></Text>
          {item.category && <Text style={styles.text}>{item.category}</Text>}
        </View>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.text}>{(this.state.revenue && `$${this.state.revenue.toFixed(2)}`) || '-'}</Text>
        </View>
      </View>
    </TouchableHighlight>);
  }
}

Item.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  item: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
  }).isRequired,
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
};
