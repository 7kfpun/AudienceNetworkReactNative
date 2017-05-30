import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';

import { AppEventsLogger } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment-timezone';

import * as dateRangeActions from '../actions/dateRange';

const styles = StyleSheet.create({
  container: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  displayBlock: {
    flex: 6,
    flexDirection: 'row',
  },
  display: {
    flexDirection: 'row',
    padding: 10,
  },
  iconBlock: {
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    flex: 1,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

class RangePicker extends React.Component {
  render() {
    const { startDate, endDate, setPreviousDateRange, setNextDateRange, navigation } = this.props;

    return (<View style={styles.container}>
      <TouchableOpacity
        style={styles.displayBlock}
        onPress={() => {
          navigation.navigate('DateSettings');
          AppEventsLogger.logEvent('press-change-date-range');
        }}
      >
        <View style={styles.display}>
          <Text>{`${moment(startDate).format('MMM DD')} - ${moment(endDate).format('MMM DD')}`}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconBlock}
        onPress={() => {
          setPreviousDateRange();
          AppEventsLogger.logEvent('press-previous-date-range-button');
        }}
      >
        <Icon style={styles.icon} name="chevron-left" size={20} color="gray" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.iconBlock}
        onPress={() => {
          setNextDateRange();
          AppEventsLogger.logEvent('press-next-date-range-button');
        }}
      >
        <Icon style={styles.icon} name="chevron-right" size={20} color="gray" />
      </TouchableOpacity>
    </View>);
  }
}

RangePicker.propTypes = {
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
  setPreviousDateRange: React.PropTypes.func.isRequired,
  setNextDateRange: React.PropTypes.func.isRequired,
  navigation: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  startDate: state.dateRange.startDate,
  endDate: state.dateRange.endDate,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(dateRangeActions, dispatch),
)(RangePicker);
