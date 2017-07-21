import React from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';

import moment from 'moment-timezone';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    flex: 1,
    alignItems: 'flex-end',
    borderLeftColor: '#EEEEEE',
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 15,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
  },
});

const InsightItem = ({ item }) => (
  <View style={styles.container}>
    <View style={[styles.cell, { flex: 1.5 }]}>
      <Text style={styles.text}>{item.requests && item.requests.time && moment(item.requests.time).format('ddd MMM DD, YYYY')}</Text>
      {item.breakdowns && <Text style={[styles.text, { fontSize: 11, color: 'gray' }]}>{item.breakdowns.country || item.breakdowns.placement}</Text>}
    </View>
    <View style={styles.cell}><Text style={styles.text}>{(item.requests && item.requests.value) || '*'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{(item.filledRequests && item.filledRequests.value) || '*'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{(item.impressions && item.impressions.value) || '*'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{(item.clicks && item.clicks.value) || '*'}</Text></View>

    <View style={styles.cell}><Text style={styles.text}>{(item.requests && item.requests.value && item.filledRequests && item.filledRequests.value && `${((item.filledRequests.value / item.requests.value) * 100).toFixed(2)}%`) || '*'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{(item.clicks && item.impressions && item.clicks.value && item.impressions.value && `${((item.clicks.value / item.impressions.value) * 100).toFixed(2)}%`) || '*'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{(item.impressions && item.revenue && item.impressions.value && item.revenue.value && `$${((item.revenue.value / item.impressions.value) * 1000).toFixed(2)}`) || '*'}</Text></View>
    <View style={styles.cell}><Text style={styles.text}>{(item.revenue && item.revenue.value && `$${(item.revenue.value * 1).toFixed(2)}`) || '*'}</Text></View>
  </View>
);

InsightItem.propTypes = {
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

export default InsightItem;
