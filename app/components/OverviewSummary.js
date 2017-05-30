import React from 'react';
import {
  Text,
  View,
  StyleSheet,
} from 'react-native';

import { connect } from 'react-redux';

const styles = StyleSheet.create({
  container: {
    height: 80,
    padding: 15,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 12,
  },
  text: {
    fontSize: 12,
    fontWeight: '200',
  },
});

const OverviewSummary = (props) => {
  const { requestsSum, filledRequestsSum, impressionsSum, clicksSum, revenueSum } = props;

  return (<View style={styles.container}>
    <View style={styles.cell}>
      <Text style={styles.titleText}>{'Requests'}</Text>
      <Text style={styles.text}>{requestsSum || '*'}</Text>
    </View>

    <View style={styles.cell}>
      <Text style={styles.titleText}>{'Fill Rate'}</Text>
      <Text style={styles.text}>{(filledRequestsSum && requestsSum && `${((filledRequestsSum / requestsSum) * 100).toFixed(2)}%`) || '*'}</Text>
    </View>

    <View style={styles.cell}>
      <Text style={styles.titleText}>{'Impressions'}</Text>
      <Text style={styles.text}>{impressionsSum || '*'}</Text>
    </View>

    <View style={styles.cell}>
      <Text style={styles.titleText}>{'Clicks'}</Text>
      <Text style={styles.text}>{clicksSum || '*'}</Text>
    </View>

    <View style={styles.cell}>
      <Text style={styles.titleText}>{'Est. Rev'}</Text>
      <Text style={styles.text}>{(revenueSum && `$${revenueSum.toFixed(2)}`) || '*'}</Text>
    </View>
  </View>);
};

OverviewSummary.propTypes = {
  requestsSum: React.PropTypes.number.isRequired,
  filledRequestsSum: React.PropTypes.number.isRequired,
  impressionsSum: React.PropTypes.number.isRequired,
  clicksSum: React.PropTypes.number.isRequired,
  revenueSum: React.PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  requestsSum: state.insights.requestsSum,
  filledRequestsSum: state.insights.filledRequestsSum,
  impressionsSum: state.insights.impressionsSum,
  clicksSum: state.insights.clicksSum,
  revenueSum: state.insights.revenueSum,
});

export default connect(
  mapStateToProps,
)(OverviewSummary);
