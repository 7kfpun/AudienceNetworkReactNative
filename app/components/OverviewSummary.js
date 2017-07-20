import React from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
  ScrollView,
} from 'react-native';

import { connect } from 'react-redux';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    width: (width / 3) * 5,
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  cell: {
    width: width / 3,
    padding: 12,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleText: {
    fontSize: 12,
    fontWeight: '300',
  },
  text: {
    fontSize: 18,
    marginTop: 14,
    marginBottom: 4,
  },
  compareToText: {
    fontSize: 12,
    marginTop: 2,
    fontWeight: '500',
  },
  compareToTextGreen: {
    color: '#53D769',
  },
  compareToTextRed: {
    color: '#FC3D39',
  },
});

const getChangePercentage = (current, previous) => {
  if (!current && !previous) {
    return '0';
  } else if (current && !previous) {
    return '100';
  } else if (!current && previous) {
    return '-100';
  }

  return (((current - previous) * 100) / previous).toFixed(2).toString();
};

const getChangeSign = (current, previous) => {
  if (current && (!previous || current > previous)) {
    return '+';
  }

  return '';
};

const getChangeColor = (changePercentage) => {
  const colorStyles = [styles.compareToText];

  if (changePercentage > 0) {
    colorStyles.push(styles.compareToTextGreen);
  } else if (changePercentage < 0) {
    colorStyles.push(styles.compareToTextRed);
  }

  return colorStyles;
};

const OverviewSummary = (props) => {
  const {
    isCompareTo,
    requestsSum, filledRequestsSum, impressionsSum, clicksSum, revenueSum,
    compareToRequestsSum, compareToFilledRequestsSum, compareToImpressionsSum, compareToClicksSum, compareToRevenueSum,
  } = props;

  const requestsSumChange = getChangePercentage(requestsSum, compareToRequestsSum);
  const requestsSumSign = getChangeSign(requestsSum, compareToRequestsSum);
  const filledRequestsSumChange = getChangePercentage(requestsSum ? filledRequestsSum / requestsSum : 0, compareToRequestsSum ? compareToFilledRequestsSum / compareToRequestsSum : 0);
  const filledRequestsSumSign = getChangeSign(requestsSum ? filledRequestsSum / requestsSum : 0, compareToRequestsSum ? compareToFilledRequestsSum / compareToRequestsSum : 0);
  const impressionsSumChange = getChangePercentage(impressionsSum, compareToImpressionsSum);
  const impressionsSumSign = getChangeSign(impressionsSum, compareToImpressionsSum);
  const clicksSumChange = getChangePercentage(clicksSum, compareToClicksSum);
  const clicksSumSign = getChangeSign(clicksSum, compareToClicksSum);
  const revenueSumChange = getChangePercentage(revenueSum, compareToRevenueSum);
  const revenueSumSign = getChangeSign(revenueSum, compareToRevenueSum);

  let filledRateSumChange = ((filledRequestsSum / requestsSum) - (compareToFilledRequestsSum / compareToRequestsSum)) * 100;
  if (filledRateSumChange === Infinity || filledRateSumChange === -Infinity) {
    filledRateSumChange = 100;
  }

  return (<ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
    <TouchableHighlight onPress={() => console.log('Requests')} underlayColor="#EEEEEE">
      <View style={styles.cell}>
        <Text style={styles.titleText}>{'Requests'}</Text>
        <Text style={styles.text}>{requestsSum}</Text>
        {isCompareTo && !!requestsSumChange && <View>
          <Text style={getChangeColor(requestsSumChange)}>{`${requestsSumSign}${requestsSum - compareToRequestsSum}`}</Text>
          <Text style={getChangeColor(requestsSumChange)}>{`(${requestsSumSign}${requestsSumChange}%)`}</Text>
        </View>}
      </View>
    </TouchableHighlight>

    <TouchableHighlight onPress={() => console.log('Fill Rate')} underlayColor="#EEEEEE">
      <View style={styles.cell}>
        <Text style={styles.titleText}>{'Fill Rate'}</Text>
        <Text style={styles.text}>{(filledRequestsSum && requestsSum && `${((filledRequestsSum / requestsSum) * 100).toFixed(2)}%`) || '0'}</Text>
        {isCompareTo && !!filledRequestsSumChange && <View>
          <Text style={getChangeColor(filledRequestsSumChange)}>{`${filledRequestsSumSign}${(filledRateSumChange || 0).toFixed(2)}%`}</Text>
          <Text style={getChangeColor(filledRequestsSumChange)}>{`(${filledRequestsSumSign}${filledRequestsSumChange}%)`}</Text>
        </View>}
      </View>
    </TouchableHighlight>

    <TouchableHighlight onPress={() => console.log('Impressions')} underlayColor="#EEEEEE">
      <View style={styles.cell}>
        <Text style={styles.titleText}>{'Impressions'}</Text>
        <Text style={styles.text}>{impressionsSum}</Text>
        {isCompareTo && !!impressionsSumChange && <View>
          <Text style={getChangeColor(impressionsSumChange)}>{`${impressionsSumSign}${impressionsSum - compareToImpressionsSum}`}</Text>
          <Text style={getChangeColor(impressionsSumChange)}>{`(${impressionsSumSign}${impressionsSumChange}%)`}</Text>
        </View>}
      </View>
    </TouchableHighlight>

    <TouchableHighlight onPress={() => console.log('Clicks')} underlayColor="#EEEEEE">
      <View style={styles.cell}>
        <Text style={styles.titleText}>{'Clicks'}</Text>
        <Text style={styles.text}>{clicksSum}</Text>
        {isCompareTo && !!clicksSumChange && <View>
          <Text style={getChangeColor(clicksSumChange)}>{`${clicksSumSign}${clicksSum - compareToClicksSum}`}</Text>
          <Text style={getChangeColor(clicksSumChange)}>{`(${clicksSumSign}${clicksSumChange}%)`}</Text>
        </View>}
      </View>
    </TouchableHighlight>

    <TouchableHighlight onPress={() => console.log('Est. Rev')} underlayColor="#EEEEEE">
      <View style={styles.cell}>
        <Text style={styles.titleText}>{'Est. Rev'}</Text>
        <Text style={styles.text}>{(revenueSum && `$${revenueSum.toFixed(2)}`) || 0}</Text>
        {isCompareTo && !!revenueSumChange && <View>
          <Text style={getChangeColor(revenueSumChange)}>{`${revenueSumSign ? '+' : '-'}$${Math.abs(revenueSum - compareToRevenueSum).toFixed(2)}`}</Text>
          <Text style={getChangeColor(revenueSumChange)}>{`(${revenueSumSign}${revenueSumChange}%)`}</Text>
        </View>}
      </View>
    </TouchableHighlight>
  </ScrollView>);
};

OverviewSummary.defaultProps = {
  isCompareTo: false,
  compareToRequestsSum: 0,
  compareToFilledRequestsSum: 0,
  compareToImpressionsSum: 0,
  compareToClicksSum: 0,
  compareToRevenueSum: 0,
};

OverviewSummary.propTypes = {
  requestsSum: React.PropTypes.number.isRequired,
  filledRequestsSum: React.PropTypes.number.isRequired,
  impressionsSum: React.PropTypes.number.isRequired,
  clicksSum: React.PropTypes.number.isRequired,
  revenueSum: React.PropTypes.number.isRequired,

  isCompareTo: React.PropTypes.bool,

  compareToRequestsSum: React.PropTypes.number,
  compareToFilledRequestsSum: React.PropTypes.number,
  compareToImpressionsSum: React.PropTypes.number,
  compareToClicksSum: React.PropTypes.number,
  compareToRevenueSum: React.PropTypes.number,
};

const mapStateToProps = state => ({
  requestsSum: state.insights.requestsSum,
  filledRequestsSum: state.insights.filledRequestsSum,
  impressionsSum: state.insights.impressionsSum,
  clicksSum: state.insights.clicksSum,
  revenueSum: state.insights.revenueSum,

  isCompareTo: state.dateRange.isCompareTo,

  compareToRequestsSum: state.insights.compareToRequestsSum,
  compareToFilledRequestsSum: state.insights.compareToFilledRequestsSum,
  compareToImpressionsSum: state.insights.compareToImpressionsSum,
  compareToClicksSum: state.insights.compareToClicksSum,
  compareToRevenueSum: state.insights.compareToRevenueSum,
});

export default connect(
  mapStateToProps,
)(OverviewSummary);
