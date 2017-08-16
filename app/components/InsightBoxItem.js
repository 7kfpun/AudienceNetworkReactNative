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
  },
  datetimeBlock: {
    paddingLeft: 15,
    paddingVertical: 5,
    backgroundColor: '#F5F5F5',
  },
  datetimeText: {
    fontSize: 11,
    fontWeight: '300',
    color: 'grey',
  },
  block: {
    flex: 1,
    flexDirection: 'row',
    padding: 5,
  },
  cell: {
    flex: 1,
    flexDirection: 'column',
    paddingHorizontal: 10,
  },
  borderLine: {
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: '#E0E0E0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  largeText: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'right',
  },
  titleText: {
    fontSize: 10,
    fontWeight: '300',
    lineHeight: 18,
    color: 'grey',
  },
  text: {
    fontSize: 11,
    lineHeight: 18,
  },
});

const InsightBoxItem = ({ item }) => (
  <View style={styles.container}>
    <View style={styles.datetimeBlock}>
      <Text style={styles.datetimeText}>{item.requests && item.requests.time && moment(item.requests.time).format('ddd MMM DD, YYYY')}</Text>
    </View>

    <View style={styles.block}>
      <View style={[styles.cell, styles.borderLine]}>
        <Text style={styles.titleText}>{'Est. Rev'}</Text>
        <Text style={styles.largeText}>{(item.revenue && item.revenue.value && `$${(item.revenue.value * 1).toFixed(2)}`) || '*'}</Text>
        <View style={styles.row}>
          <Text style={styles.titleText}>{'eCPM'}</Text>
          <Text style={styles.text}>{(item.impressions && item.revenue && item.impressions.value && item.revenue.value && `$${((item.revenue.value / item.impressions.value) * 1000).toFixed(2)}`) || '*'}</Text>
        </View>
        <View />
      </View>

      <View style={[styles.cell, styles.borderLine]}>
        <Text style={styles.titleText}>{'Clicks'}</Text>
        <Text style={styles.largeText}>{(item.clicks && item.clicks.value) || '*'}</Text>
        <View style={styles.row}>
          <Text style={styles.titleText}>{'Impressions'}</Text>
          <Text style={styles.text}>{(item.impressions && item.impressions.value) || '*'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.titleText}>{'CTR'}</Text>
          <Text style={styles.text}>{(item.clicks && item.impressions && item.clicks.value && item.impressions.value && `${((item.clicks.value / item.impressions.value) * 100).toFixed(2)}%`) || '*'}</Text>
        </View>
      </View>

      <View style={styles.cell}>
        <Text style={styles.titleText}>{'Fill Rate'}</Text>
        <Text style={styles.largeText}>{(item.requests && item.requests.value && item.filledRequests && item.filledRequests.value && `${((item.filledRequests.value / item.requests.value) * 100).toFixed(2)}%`) || '*'}</Text>
        <View style={styles.row}>
          <Text style={styles.titleText}>{'Requests'}</Text>
          <Text style={styles.text}>{(item.requests && item.requests.value) || '*'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.titleText}>{'Filled'}</Text>
          <Text style={styles.text}>{(item.filledRequests && item.filledRequests.value) || '*'}</Text>
        </View>
      </View>
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
