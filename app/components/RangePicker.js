import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

import { getCompareToStartDate, getCompareToEndDate } from '../utils/compareToDate';
import * as dateRangeActions from '../actions/dateRange';

import tracker from '../utils/tracker';

moment.tz.setDefault('America/Los_Angeles');

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  displayBlock: {
    flex: 6,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  icon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
  },
  compareToText: {
    fontSize: 12,
    color: '#424242',
  },
});

const RangePicker = (props) => {
  const { startDate, endDate, rangeType, isCompareTo, setPreviousDateRange, setNextDateRange, navigation } = props;

  let rangeShowAs;
  if (startDate && endDate) {
    let startYearShowAs = `, ${moment(startDate).year()}`;
    let endYearShowAs = `, ${moment(endDate).year()}`;

    if (moment(startDate).year() === moment().year() || moment(startDate).year() === moment(endDate).year()) {
      startYearShowAs = '';
    }

    if (moment(endDate).year() === moment().year()) {
      endYearShowAs = '';
    }

    if (moment(startDate).format('L') === moment(endDate).format('L')) {
      rangeShowAs = `${moment(endDate).format('ddd, MMM DD')}${endYearShowAs}`;
    } else {
      rangeShowAs = `${moment(startDate).format('MMM DD')}${startYearShowAs} - ${moment(endDate).format('MMM DD')}${endYearShowAs}`;
    }
  }

  let compareToRangeShowAs;
  if (isCompareTo) {
    const compareToStartDate = getCompareToStartDate(startDate, endDate, rangeType);
    const compareToEndDate = getCompareToEndDate(startDate, endDate, rangeType);

    let compareToStartYearShowAs = `, ${moment(startDate).year()}`;
    let compareToEndYearShowAs = `, ${moment(endDate).year()}`;

    if (moment(compareToStartDate).year() === moment().year() || moment(compareToStartDate).year() === moment(compareToEndDate).year()) {
      compareToStartYearShowAs = '';
    }

    if (moment(compareToEndDate).year() === moment().year()) {
      compareToEndYearShowAs = '';
    }

    if (moment(compareToStartDate).format('L') === moment(compareToEndDate).format('L')) {
      compareToRangeShowAs = `${moment(compareToEndDate).format('ddd, MMM DD')}${compareToEndYearShowAs}`;
    } else {
      compareToRangeShowAs = `${moment(compareToStartDate).format('MMM DD')}${compareToStartYearShowAs} - ${moment(compareToEndDate).format('MMM DD')}${compareToEndYearShowAs}`;
    }
  }

  return (<View style={styles.container}>
    <TouchableOpacity
      style={styles.displayBlock}
      onPress={() => {
        navigation.navigate('DateSettings');
        tracker.logEvent('view-date-settings', { category: 'user-event', component: 'range-picker' });
      }}
    >
      <View>
        <Text style={styles.text}>{rangeShowAs}</Text>
        {isCompareTo && <Text style={styles.compareToText}>vs. {compareToRangeShowAs}</Text>}
      </View>
    </TouchableOpacity>
    <TouchableHighlight
      underlayColor="#EEEEEE"
      style={styles.icon}
      onPress={() => {
        setPreviousDateRange();
        tracker.logEvent('go-previous-date-range', { category: 'user-event', component: 'range-picker', value: rangeType });
      }}
    >
      <Icon name="chevron-left" size={24} color="gray" />
    </TouchableHighlight>
    <TouchableHighlight
      underlayColor="#EEEEEE"
      style={styles.icon}
      onPress={() => {
        setNextDateRange();
        tracker.logEvent('go-next-date-range', { category: 'user-event', component: 'range-picker', value: rangeType });
      }}
    >
      <Icon name="chevron-right" size={24} color="gray" />
    </TouchableHighlight>
    <TouchableHighlight
      underlayColor="#EEEEEE"
      style={styles.icon}
      onPress={() => {
        navigation.navigate('DateSettings');
        tracker.logEvent('view-date-settings', { category: 'user-event', component: 'range-picker' });
      }}
    >
      <Icon name="tune" size={20} color="gray" />
    </TouchableHighlight>
  </View>);
};

RangePicker.defaultProps = {
  startDate: null,
  endDate: null,
  isCompareTo: false,
};

RangePicker.propTypes = {
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  rangeType: React.PropTypes.string.isRequired,
  isCompareTo: React.PropTypes.bool,

  setPreviousDateRange: React.PropTypes.func.isRequired,
  setNextDateRange: React.PropTypes.func.isRequired,
  navigation: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  startDate: state.dateRange.startDate,
  endDate: state.dateRange.endDate,
  rangeType: state.dateRange.rangeType,
  isCompareTo: state.dateRange.isCompareTo,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(dateRangeActions, dispatch),
)(RangePicker);
