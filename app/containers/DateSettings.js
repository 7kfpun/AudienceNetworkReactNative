import React, { Component } from 'react';
import {
  BackHandler,
  DatePickerAndroid,
  DatePickerIOS,
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  View,
} from 'react-native';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TabViewAnimated, TabBar } from 'react-native-tab-view';
import Icon from 'react-native-vector-icons/MaterialIcons';

import moment from 'moment-timezone';

import * as dateRangeActions from '../actions/dateRange';

import dateRangeOptions from '../utils/dateRangeOptions';
import tracker from '../utils/tracker';

moment.tz.setDefault('America/Los_Angeles');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
    padding: 8,
  },
  headerNav: {
    flex: 1,
    justifyContent: 'center',
    padding: 6,
  },
  headerRightText: {
    fontSize: 16,
    color: '#0076FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  dateText: {
    fontSize: 12,
    color: 'gray',
  },
  datePicker: {
    backgroundColor: 'white',
  },
});

const TYPE = {
  days: 0,
  weeks: 1,
  months: 2,
  custom: 3,
};

class DateSettingsView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Date Settings',
    headerLeft: <TouchableOpacity
      style={styles.headerNav}
      underlayColor="white"
      onPress={() => {
        navigation.goBack();
        tracker.logEvent('close-date-settings', { category: 'user-event', view: 'date-settings' });
      }}
    >
      <Icon name="clear" size={30} color="#0076FF" />
    </TouchableOpacity>,
    headerRight: <TouchableOpacity
      style={styles.headerNav}
      underlayColor="white"
      onPress={() => {
        const {
          index, checkDay, checkWeek, checkMonth, isCompareTo,
          setStartDate, setEndDate, setRangeType, setRangeTypeOrder, setIsCompareTo,
         } = navigation.state.params;

        if (index === 0) {
          setRangeType('days');
          setStartDate(dateRangeOptions.days[checkDay].startDate);
          setEndDate(dateRangeOptions.days[checkDay].endDate);
          setRangeTypeOrder(checkDay);
          tracker.logEvent('save-date-range', { category: 'user-event', view: 'date-settings', value: 'days', rangeTypeOrder: checkDay });
        } else if (index === 1) {
          setRangeType('weeks');
          setStartDate(dateRangeOptions.weeks[checkWeek].startDate);
          setEndDate(dateRangeOptions.weeks[checkWeek].endDate);
          setRangeTypeOrder(checkWeek);
          tracker.logEvent('save-date-range', { category: 'user-event', view: 'date-settings', value: 'weeks', rangeTypeOrder: checkWeek });
        } else if (index === 2) {
          setRangeType('months');
          setStartDate(dateRangeOptions.months[checkMonth].startDate);
          setEndDate(dateRangeOptions.months[checkMonth].endDate);
          setRangeTypeOrder(checkMonth);
          tracker.logEvent('save-date-range', { category: 'user-event', view: 'date-settings', value: 'months', rangeTypeOrder: checkMonth });
          value = 'months';
        } else if (index === 3) {
          setRangeType('custom');
          tracker.logEvent('save-date-range', { category: 'user-event', view: 'date-settings', value: 'custom' });
        }

        setIsCompareTo(isCompareTo);
        tracker.logEvent('save-is-compare-to', { category: 'user-event', view: 'date-settings', value: isCompareTo.toString() });

        navigation.goBack();
      }}
    >
      <Text style={styles.headerRightText}>{'Save'}</Text>
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: 'white',
    },
  })

  state = {
    index: 0,
    routes: [
      { key: 'days', title: 'DAY' },
      { key: 'weeks', title: 'WEEK' },
      { key: 'months', title: 'MONTH' },
      { key: 'custom', title: 'CUSTOM' },
    ],
    startDate: new Date(moment()),
    endDate: new Date(moment().subtract(1, 'days')),
    isCompareTo: false,
    checkDay: 0,
    checkWeek: 0,
    checkMonth: 0,
    isStartDatePickerShow: false,
    isEndDatePickerShow: false,
  };

  componentDidMount() {
    this.props.navigation.setParams({
      index: this.state.index,
      setRangeType: this.props.setRangeType,
      setRangeTypeOrder: this.props.setRangeTypeOrder,
      setStartDate: this.props.setStartDate,
      setEndDate: this.props.setEndDate,
      setIsCompareTo: this.props.setIsCompareTo,
      startDate: this.state.startDate,
      endDate: this.state.endDate,
      isCompareTo: this.props.isCompareTo,
      checkDay: this.state.checkDay,
      checkWeek: this.state.checkWeek,
      checkMonth: this.state.checkMonth,
    });

    this.sub = BackHandler.addEventListener('backPress', () => this.props.navigation.goBack());
  }

  componentWillMount() {
    this.setInitalTab();
  }

  componentWillUnmount() {
    this.sub.remove();
  }

  setInitalTab() {
    const { rangeType, rangeTypeOrder } = this.props;

    this.setState({
      checkDay: rangeType === 'days' ? rangeTypeOrder : 0,
      checkWeek: rangeType === 'weeks' ? rangeTypeOrder : 0,
      checkMonth: rangeType === 'months' ? rangeTypeOrder : 0,
      index: TYPE[rangeType],
      isCompareTo: this.props.isCompareTo,
    });
  }

  handleChangeTab = (index) => {
    this.setState({ index });
    this.props.navigation.setParams({ index });

    tracker.logEvent(`view-tab-${this.state.routes[index].key}`, { category: 'user-event', view: 'date-settings' });
  };

  showDatePickerAndroid = async (date, startOrEnd = 'START') => {
    const { setStartDate, setEndDate } = this.props;

    try {
      const { action, year, month, day } = await DatePickerAndroid.open({ date });
      if (action !== DatePickerAndroid.dismissedAction) {
        const tempDate = new Date(moment([year, month, day]));
        if (startOrEnd === 'START') {
          setStartDate(tempDate);
          tracker.logEvent('change-start-date', { category: 'user-event', view: 'date-settings', value: tempDate.toString() });
        } else {
          setEndDate(tempDate);
          tracker.logEvent('change-end-date', { category: 'user-event', view: 'date-settings', value: tempDate.toString() });
        }
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
      tracker.logEvent('open-date-picker-error', { category: 'error', view: 'date-settings' });
    }
  }

  openStartDatePicker = () => {
    const { startDate } = this.props;

    if (Platform.OS === 'ios') {
      this.setState((prevState) => {
        tracker.logEvent('open-start-date-settings', { category: 'user-event', view: 'date-settings', value: !prevState.isStartDatePickerShow });
        return {
          isStartDatePickerShow: !prevState.isStartDatePickerShow,
          isEndDatePickerShow: false,
        };
      });
    } else {
      this.showDatePickerAndroid(startDate, 'START');
      tracker.logEvent('open-start-date-settings', { category: 'user-event', view: 'date-settings', value: true });
    }
  }

  openEndDatePicker() {
    const { endDate } = this.props;

    if (Platform.OS === 'ios') {
      this.setState((prevState) => {
        tracker.logEvent('open-end-date-settings', { category: 'user-event', view: 'date-settings', value: !prevState.isEndDatePickerShow });
        return {
          isStartDatePickerShow: false,
          isEndDatePickerShow: !prevState.isEndDatePickerShow,
        };
      });
    } else {
      this.showDatePickerAndroid(endDate, 'END');
      tracker.logEvent('open-end-date-settings', { category: 'user-event', view: 'date-settings', value: true });
    }
  }

  toggleIsCompareTo = () => {
    const that = this;
    this.setState((prevState) => {
      that.props.navigation.setParams({
        isCompareTo: !prevState.isCompareTo,
      });

      return { isCompareTo: !prevState.isCompareTo };
    });
  }

  renderHeader = props => <TabBar {...props} labelStyle={{ fontSize: 10 }} />;

  renderScene = ({ route }) => {
    const { startDate, endDate, setStartDate, setEndDate } = this.props;

    const that = this;
    const diff = moment(endDate).diff(moment(startDate), 'days');

    switch (route.key) {
      case 'days':
        return (<View style={styles.container}>
          {dateRangeOptions.days.map(option => (<TouchableHighlight
            underlayColor="#EEEEEE"
            key={option.id}
            onPress={() => {
              that.props.navigation.setParams({
                checkDay: option.id,
                startDate: option.startDate,
                endDate: option.endDate,
              });

              that.setState({
                checkDay: option.id,
                startDate: option.startDate,
                endDate: option.endDate,
              });
            }}
          >
            <View style={styles.row}>
              <View>
                <Text>{option.name}</Text>
                <Text style={styles.dateText}>{moment(option.endDate).format('dddd, DD MMMM')}</Text>
              </View>
              {that.state.checkDay === option.id && <Icon name="check" size={20} color="#0076FF" />}
            </View>
          </TouchableHighlight>))}

          <TouchableHighlight
            underlayColor="#EEEEEE"
            onPress={this.toggleIsCompareTo}
          >
            <View style={styles.row}>
              <Text>{'Compare to'}</Text>
              <Switch
                onValueChange={this.toggleIsCompareTo}
                value={this.state.isCompareTo}
              />
            </View>
          </TouchableHighlight>
          {this.state.isCompareTo && <View style={styles.row}>
            <View>
              <Text>{'Previous day'}</Text>
              <Text style={styles.dateText}>{moment(this.state.endDate).subtract(1, 'days').format('dddd, DD MMMM')}</Text>
            </View>
          </View>}
        </View>);

      case 'weeks':
        return (<View style={styles.container}>
          {dateRangeOptions.weeks.map(option => (<TouchableHighlight
            underlayColor="#EEEEEE"
            key={option.id}
            onPress={() => {
              that.props.navigation.setParams({
                checkWeek: option.id,
                startDate: option.startDate,
                endDate: option.endDate,
              });

              that.setState({
                checkWeek: option.id,
                startDate: option.startDate,
                endDate: option.endDate,
              });
            }}
          >
            <View style={styles.row}>
              <View>
                <Text>{option.name}</Text>
                <Text style={styles.dateText}>{`${moment(option.startDate).format('DD MMMM')} - ${moment(option.endDate).format('DD MMMM')}`}</Text>
              </View>
              {that.state.checkWeek === option.id && <Icon name="check" size={20} color="#0076FF" />}
            </View>
          </TouchableHighlight>))}

          <TouchableHighlight
            underlayColor="#EEEEEE"
            onPress={this.toggleIsCompareTo}
          >
            <View style={styles.row}>
              <Text>{'Compare to'}</Text>
              <Switch
                onValueChange={this.toggleIsCompareTo}
                value={this.state.isCompareTo}
              />
            </View>
          </TouchableHighlight>
          {this.state.isCompareTo && <View style={styles.row}>
            <View>
              <Text>{'Previous week'}</Text>
              <Text style={styles.dateText}>{`${moment(this.state.startDate).subtract(1, 'weeks').format('DD MMMM')} - ${moment(this.state.endDate).subtract(1, 'weeks').format('DD MMMM')}`}</Text>
            </View>
          </View>}
        </View>);

      case 'months':
        return (<View style={styles.container}>
          {dateRangeOptions.months.map(option => (<TouchableHighlight
            underlayColor="#EEEEEE"
            key={option.id}
            onPress={() => {
              that.props.navigation.setParams({
                checkMonth: option.id,
                startDate: option.startDate,
                endDate: option.endDate,
              });

              that.setState({
                checkMonth: option.id,
                startDate: option.startDate,
                endDate: option.endDate,
              });
            }}
          >
            <View style={styles.row}>
              <View>
                <Text>{option.name}</Text>
                <Text style={styles.dateText}>{option.display}</Text>
              </View>
              {that.state.checkMonth === option.id && <Icon name="check" size={20} color="#0076FF" />}
            </View>
          </TouchableHighlight>))}

          <TouchableHighlight
            underlayColor="#EEEEEE"
            onPress={this.toggleIsCompareTo}
          >
            <View style={styles.row}>
              <Text>{'Compare to'}</Text>
              <Switch
                onValueChange={this.toggleIsCompareTo}
                value={this.state.isCompareTo}
              />
            </View>
          </TouchableHighlight>
          {this.state.isCompareTo && <View style={styles.row}>
            <View>
              <Text>{'Previous month'}</Text>
              <Text style={styles.dateText}>{dateRangeOptions.months[this.state.checkMonth].compareDisplay}</Text>
            </View>
          </View>}
        </View>);

      case 'custom':
        return (<View style={styles.container}>
          <TouchableHighlight
            underlayColor="#EEEEEE"
            onPress={this.openStartDatePicker}
          >
            <View style={styles.row}>
              <View>
                <Text style={styles.text}>Start Date</Text>
                <Text style={[styles.dateText, { color: this.state.isStartDatePickerShow ? 'red' : 'gray' }]}>{moment(startDate).format('MMM D, YYYY')}</Text>
              </View>
            </View>
          </TouchableHighlight>
          {this.state.isStartDatePickerShow && Platform.OS === 'ios' && <DatePickerIOS
            style={styles.datePicker}
            date={startDate}
            mode="date"
            timeZoneOffsetInHours={this.state.timeZoneOffsetInHours * 60}
            onDateChange={(date) => {
              const tempDate = new Date(moment([date.getFullYear(), date.getMonth(), date.getDate()]));
              this.setState({ startDate: tempDate, isChanged: true });
              setStartDate(tempDate);
              tracker.logEvent('change-start-date', { category: 'user-event', view: 'date-settings', value: tempDate.toString() });
            }}
          />}

          <TouchableHighlight
            underlayColor="#EEEEEE"
            onPress={() => this.openEndDatePicker()}
          >
            <View style={styles.row}>
              <View>
                <Text style={styles.text}>End Date</Text>
                <Text style={[styles.dateText, { color: this.state.isEndDatePickerShow ? 'red' : 'gray' }]}>{moment(endDate).format('MMM D, YYYY')}</Text>
              </View>
            </View>
          </TouchableHighlight>
          {this.state.isEndDatePickerShow && Platform.OS === 'ios' && <DatePickerIOS
            style={styles.datePicker}
            date={endDate}
            mode="date"
            timeZoneOffsetInHours={this.state.timeZoneOffsetInHours * 60}
            onDateChange={(date) => {
              const tempDate = new Date(moment([date.getFullYear(), date.getMonth(), date.getDate()]));
              this.setState({ endDate: tempDate, isChanged: true });
              setEndDate(tempDate);
              tracker.logEvent('change-end-date', { category: 'user-event', view: 'date-settings', value: tempDate.toString() });
            }}
          />}

          <TouchableHighlight
            underlayColor="#EEEEEE"
            onPress={this.toggleIsCompareTo}
          >
            <View style={styles.row}>
              <Text>{'Compare to'}</Text>
              <Switch
                onValueChange={this.toggleIsCompareTo}
                value={this.state.isCompareTo}
              />
            </View>
          </TouchableHighlight>
          {this.state.isCompareTo && <View style={styles.row}>
            <View>
              <Text>{'Previous period'}</Text>
              <Text style={styles.dateText}>{`${moment(startDate).subtract(diff + 1, 'days').format('DD MMMM, YYYY')} - ${moment(endDate).subtract(diff + 1, 'days').format('DD MMMM, YYYY')}`}</Text>
            </View>
          </View>}
        </View>);
      default:
        return null;
    }
  };

  render() {
    const state = this.state || {
      index: TYPE[rangeType],
      routes: [
        { key: 'days', title: 'DAY' },
        { key: 'weeks', title: 'WEEK' },
        { key: 'months', title: 'MONTH' },
        { key: 'custom', title: 'CUSTOM' },
      ],
    };

    return (
      <TabViewAnimated
        props={this.props}
        navigationState={state}
        renderScene={this.renderScene}
        renderHeader={this.renderHeader}
        onRequestChangeTab={this.handleChangeTab}
      />
    );
  }
}

DateSettingsView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  setRangeType: React.PropTypes.func.isRequired,
  setRangeTypeOrder: React.PropTypes.func.isRequired,
  setStartDate: React.PropTypes.func.isRequired,
  setEndDate: React.PropTypes.func.isRequired,
  setIsCompareTo: React.PropTypes.func.isRequired,
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,
  isCompareTo: React.PropTypes.bool.isRequired,
  rangeType: React.PropTypes.string.isRequired,
  rangeTypeOrder: React.PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
  startDate: state.dateRange.startDate,
  endDate: state.dateRange.endDate,
  isCompareTo: state.dateRange.isCompareTo,
  rangeType: state.dateRange.rangeType,
  rangeTypeOrder: state.dateRange.rangeTypeOrder,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators(dateRangeActions, dispatch),
)(DateSettingsView);
