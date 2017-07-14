import React, { Component } from 'react';
import {
  Image,
  Text,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';

import * as facebook from '../utils/facebook';
import tracker from '../utils/tracker';

const styles = StyleSheet.create({
  container: {
    height: 70,
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
    backgroundColor: '#FF3B30',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  textBlock: {
    flex: 4,
    paddingLeft: 5,
  },
  revenueBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  image: {
    width: 45,
    height: 45,
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

Array.prototype.sum = function sum(prop) {  // eslint-disable-line no-extend-native
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
    if (startDate && endDate) {
      facebook.audienceNetwork(
        id, 'fb_ad_network_revenue', 'SUM', null, startDate, endDate,
        (error, result) => {
          if (error) {
            console.info(error);
            tracker.logEvent('request-revenue-error', { category: 'api-event', component: 'item', log: 'error' });
          } else {
            this.setState({ revenue: result.data.sum('value') });
          }
        });
    }
  }

  render() {
    const { navigation, item } = this.props;
    return (<TouchableHighlight
      underlayColor="#EEEEEE"
      onPress={() => {
        navigation.navigate('Overview', { appId: item.id, appName: item.name });
        tracker.logEvent('view-app-insights', { category: 'user-event', component: 'item' });
      }}
    >
      <View style={styles.container}>
        <Image style={styles.image} source={{ uri: item.logo_url }} />
        <View style={styles.textBlock}>
          <Text style={styles.titleText}>{item.name} <Text style={styles.idText}>{item.id}</Text></Text>
          {item.category && <Text style={styles.text}>{item.category}</Text>}
        </View>
        <View style={styles.revenueBlock}>
          <Text style={styles.text}>{(this.state.revenue && `$${this.state.revenue.toFixed(2)}`) || '-'}</Text>
        </View>
      </View>
    </TouchableHighlight>);
  }
}

Item.defaultProps = {
  startDate: null,
  endDate: null,
};

Item.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  item: React.PropTypes.shape({
    id: React.PropTypes.string.isRequired,
  }).isRequired,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
};
