import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment-timezone';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    padding: 10,
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  cell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  datetimeText: {
    fontSize: 13,
    fontWeight: '300',
    lineHeight: 24,
  },
  titleText: {
    fontSize: 11,
    fontWeight: '300',
    lineHeight: 24,
    color: 'grey',
  },
  text: {
    fontSize: 13,
    lineHeight: 24,
  },
});

const InsightBoxItem = ({ item }) => (
  <View style={styles.container}>
    <Text style={styles.datetimeText}>{item.requests && item.requests.time && moment(item.requests.time).format('ddd MMM DD, YYYY')}</Text>

    <View style={styles.block}>
      <View style={styles.cell}><Text style={styles.titleText}>{'Requests'}</Text></View>
      <View style={styles.cell}><Text style={styles.titleText}>{'Filled'}</Text></View>
      <View style={styles.cell}><Text style={styles.titleText}>{'Impressions'}</Text></View>
      <View style={styles.cell}><Text style={styles.titleText}>{'Clicks'}</Text></View>
    </View>

    <View style={styles.block}>
      <View style={styles.cell}><Text style={styles.text}>{(item.requests && item.requests.value) || '*'}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{(item.filledRequests && item.filledRequests.value) || '*'}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{(item.impressions && item.impressions.value) || '*'}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{(item.clicks && item.clicks.value) || '*'}</Text></View>
    </View>

    <View style={styles.block}>
      <View style={styles.cell}><Text style={styles.titleText}>{'Fill Rate'}</Text></View>
      <View style={styles.cell}><Text style={styles.titleText}>{'CTR'}</Text></View>
      <View style={styles.cell}><Text style={styles.titleText}>{'eCPM'}</Text></View>
      <View style={styles.cell}><Text style={styles.titleText}>{'Est. Rev'}</Text></View>
    </View>

    <View style={styles.block}>
      <View style={styles.cell}><Text style={styles.text}>{(item.requests && item.requests.value && item.filledRequests && item.filledRequests.value && `${((item.filledRequests.value / item.requests.value) * 100).toFixed(2)}%`) || '*'}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{(item.clicks && item.impressions && item.clicks.value && item.impressions.value && `${((item.clicks.value / item.impressions.value) * 100).toFixed(2)}%`) || '*'}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{(item.impressions && item.revenue && item.impressions.value && item.revenue.value && `$${((item.revenue.value / item.impressions.value) * 1000).toFixed(2)}`) || '*'}</Text></View>
      <View style={styles.cell}><Text style={styles.text}>{(item.revenue && item.revenue.value && `$${(item.revenue.value * 1).toFixed(2)}`) || '*'}</Text></View>
    </View>
  </View>
);


InsightBoxItem.propTypes = {
  item: React.PropTypes.shape({
    requests: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      time: React.PropTypes.string.isRequired,
    }),
    filledRequests: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      time: React.PropTypes.string.isRequired,
    }),
    impressions: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      time: React.PropTypes.string.isRequired,
    }),
    clicks: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      time: React.PropTypes.string.isRequired,
    }),
    revenue: React.PropTypes.shape({
      value: React.PropTypes.string.isRequired,
      time: React.PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default InsightBoxItem;
