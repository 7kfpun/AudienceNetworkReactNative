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

import * as dateRangeActions from '../actions/dateRange';

import tracker from '../utils/tracker';

moment.tz.setDefault('America/Los_Angeles');

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
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
});

const RangePicker = (props) => {
  const { startDate, endDate, rangeType, setPreviousDateRange, setNextDateRange, navigation } = props;

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

  return (<View style={styles.container}>
    <TouchableOpacity
      style={styles.displayBlock}
      onPress={() => {
        navigation.navigate('DateSettings');
        tracker.logEvent('view-date-settings', { category: 'user-event', component: 'range-picker' });
      }}
    >
      <Text>{rangeShowAs}</Text>
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
};

RangePicker.propTypes = {
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  rangeType: React.PropTypes.string.isRequired,
  setPreviousDateRange: React.PropTypes.func.isRequired,
  setNextDateRange: React.PropTypes.func.isRequired,
  navigation: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  startDate: state.dateRange.startDate,
  endDate: state.dateRange.endDate,
  rangeType: state.dateRange.rangeType,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(dateRangeActions, dispatch),
)(RangePicker);
