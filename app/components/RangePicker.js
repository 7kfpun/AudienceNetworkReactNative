import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

import * as dateRangeActions from '../actions/dateRange';

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
  },
  display: {
    flexDirection: 'row',
    padding: 10,
  },
  icon: {
    marginHorizontal: 4,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const RangePicker = (props) => {
  const { startDate, endDate, rangeType, setPreviousDateRange, setNextDateRange, navigation } = props;

  let startYearShowAs = `, ${moment(startDate).year()}`;
  let endYearShowAs = `, ${moment(endDate).year()}`;
  let rangeShowAs;

  if (moment(startDate).year() === moment().year() || moment(startDate).year() === moment(endDate).year()) {
    startYearShowAs = '';
  }

  if (moment(endDate).year() === moment().year()) {
    endYearShowAs = '';
  }

  if (moment(startDate).format('MMM DD YYYY') === moment(endDate).format('MMM DD YYYY')) {
    rangeShowAs = `${moment(endDate).format('dddd, MMM DD')}${endYearShowAs}`;
  } else {
    rangeShowAs = `${moment(startDate).format('MMM DD')}${startYearShowAs} - ${moment(endDate).format('MMM DD')}${endYearShowAs}`;
  }

  return (<View style={styles.container}>
    <TouchableOpacity
      style={styles.displayBlock}
      onPress={() => {
        navigation.navigate('DateSettings');
      }}
    >
      <View style={styles.display}>
        <Text>{rangeShowAs}</Text>
      </View>
    </TouchableOpacity>
    <TouchableHighlight
      underlayColor="#EEEEEE"
      style={styles.icon}
      onPress={() => {
        setPreviousDateRange();
        AppEventsLogger.logEvent('press-previous-date-range-button');
      }}
    >
      <Icon name="chevron-left" size={20} color="gray" />
    </TouchableHighlight>
    <TouchableHighlight
      underlayColor="#EEEEEE"
      style={styles.icon}
      onPress={() => {
        setNextDateRange();
        AppEventsLogger.logEvent('press-next-date-range-button');
      }}
    >
      <Icon name="chevron-right" size={20} color="gray" />
    </TouchableHighlight>
  </View>);
};

RangePicker.propTypes = {
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
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
