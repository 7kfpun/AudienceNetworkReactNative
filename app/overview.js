import React, { Component } from 'react';
import {
  DatePickerIOS,
  Platform,
  ListView,
  RefreshControl,
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';

import _ from 'underscore';
import Moment from 'moment';

import { AccessToken, AppEventsLogger, LoginManager } from 'react-native-fbsdk';
import { Actions } from 'react-native-router-flux';
import { NativeAdsManager } from 'react-native-fbads';
import NavigationBar from 'react-native-navbar';
// import { SegmentedControls } from 'react-native-radio-buttons';

import * as Facebook from './utils/facebook';
import FbAds from './components/fbads';

import { config } from '../config';

const adsManager = new NativeAdsManager(config.fbads[Platform.OS].native);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  navigatorBar: {
    borderBottomWidth: StyleSheet.hairlineWidth * 2,
    borderBottomColor: '#E0E0E0',
  },
  row: {
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionsBlock: {
    marginTop: 10,
    marginBottom: 5,
  },
  datePicker: {
    backgroundColor: 'white',
  },
  insightsBlock: {
    marginTop: 5,
    width: 1024,
  },
  cell: {
    flex: 1,
    borderLeftColor: '#EEEEEE',
    borderLeftWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    paddingVertical: 15,
  },
  text: {
    fontSize: 15,
    lineHeight: 24,
  },
  cellText: {
    fontSize: 13,
  },
});

export default class OverviewView extends Component {
  constructor(props) {
    super(props);
    this.dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

    const today = new Date();
    this.state = {
      refreshing: false,
      dataSource: this.dataSource.cloneWithRows([]),
      startDate: new Date(today.getFullYear(), today.getMonth() - 3, today.getDate() + 1, -8),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, -8),
      timeZoneOffsetInHours: (-8) * ((new Date()).getTimezoneOffset() / 60),
      isStartDatePickerShow: false,
      isEndDatePickerShow: false,
      isChanged: false,
    };
  }

  componentDidMount() {
    this.checkPermissions();
    this.onRequest();
  }

  componentWillReceiveProps() {
    this.onRequest();
  }

  onRequest() {
    console.log('onRequest');
    this.setState({
      refreshing: true,
      isStartDatePickerShow: false,
      isEndDatePickerShow: false,
    });
    Facebook.audienceNetwork(this.props.appId, 'fb_ad_network_request', 'COUNT', this.state.breakdown, this.state.startDate, this.state.endDate, (error, result) => this.responseInfoCallback(error, result));
    Facebook.audienceNetwork(this.props.appId, 'fb_ad_network_request', 'SUM', this.state.breakdown, this.state.startDate, this.state.endDate, (error, result) => this.responseFilledInfoCallback(error, result));
    Facebook.audienceNetwork(this.props.appId, 'fb_ad_network_imp', 'COUNT', this.state.breakdown, this.state.startDate, this.state.endDate, (error, result) => this.responseImpressionsInfoCallback(error, result));
    Facebook.audienceNetwork(this.props.appId, 'fb_ad_network_click', 'COUNT', this.state.breakdown, this.state.startDate, this.state.endDate, (error, result) => this.responseClicksInfoCallback(error, result));
    Facebook.audienceNetwork(this.props.appId, 'fb_ad_network_video_view', 'COUNT', this.state.breakdown, this.state.startDate, this.state.endDate, (error, result) => this.responseVideoViewsInfoCallback(error, result));
    Facebook.audienceNetwork(this.props.appId, 'fb_ad_network_revenue', 'SUM', this.state.breakdown, this.state.startDate, this.state.endDate, (error, result) => this.responseRevenueInfoCallback(error, result));
  }

  checkPermissions() {
    AccessToken.getCurrentAccessToken().then(
      (data) => {
        console.log('getCurrentAccessToken', data);
        if (!data || !data.permissions) {
          Actions.login();
        }

        if (data && data.permissions && data.permissions.indexOf('read_audience_network_insights') === -1) {
          LoginManager.logInWithReadPermissions(['read_audience_network_insights']).then(
            (result) => {
              if (result.isCancelled) {
                alert('You cannot this app without read_audience_network_insights permissions.');
              }
              this.onRequest();
            },
            (error) => {
              alert(`Login fail with error: ${error}`);
            },
          );
        }
      },
    );
  }

  aggregateData(data, breakdown) {
    let out = [];
    if (breakdown === 'Country') {
      const groups = _(data).groupBy('country');
      out = _(groups).map((g, key) => {
        return { country: key, value: _(g).reduce((m, x) => m + parseInt(x.value), 0) };
      });
    } else if (breakdown === 'Placement') {
      const groups = _(data).groupBy('placement');
      out = _(groups).map((g, key) => {
        return { placement: key, value: _(g).reduce((m, x) => m + parseInt(x.value), 0) };
      });
    }

    console.log(out);
    return out;
  }

  responseInfoCallback(error, result) {
    if (error) {
      console.log('Error insights:', error);
      this.setState({
        refreshing: false,
        isChanged: false,
      });
    } else {
      console.log('Success insights:', result);

      this.setState({
        requests: result.data,
        dataSource: this.dataSource.cloneWithRows(result.data),
        refreshing: false,
        isChanged: false,
      });

      if (this.state.breakdown) {
        const data = _(result.data).map((item) => {
          if (item.breakdowns && item.breakdowns.country) {
            return Object.assign({ country: item.breakdowns.country }, item);
          } else if (item.breakdowns && item.breakdowns.placement) {
            return Object.assign({ placement: item.breakdowns.placement }, item);
          }
          return item;
        });

        console.log(data);
        this.setState({
          requests: this.aggregateData(data, this.state.breakdown),
          dataSource: this.dataSource.cloneWithRows(this.aggregateData(data, this.state.breakdown)),
          refreshing: false,
        });
      }
    }
  }

  responseFilledInfoCallback(error, result) {
    if (error) {
      console.log('Error insights:', error);
    } else {
      console.log('Success insights:', result);
      if (this.state.breakdown) {
        const data = _(result.data).map((item) => {
          if (item.breakdowns && item.breakdowns.country) {
            return Object.assign({ country: item.breakdowns.country }, item);
          } else if (item.breakdowns && item.breakdowns.placement) {
            return Object.assign({ placement: item.breakdowns.placement }, item);
          }
          return item;
        });

        console.log(data);
        this.setState({ filled: this.aggregateData(data, this.state.breakdown) });
      }

      this.setState({ filled: result.data });
    }
  }

  responseImpressionsInfoCallback(error, result) {
    if (error) {
      console.log('Error insights:', error);
    } else {
      console.log('Success insights:', result);
      if (this.state.breakdown) {
        const data = _(result.data).map((item) => {
          if (item.breakdowns && item.breakdowns.country) {
            return Object.assign({ country: item.breakdowns.country }, item);
          } else if (item.breakdowns && item.breakdowns.placement) {
            return Object.assign({ placement: item.breakdowns.placement }, item);
          }
          return item;
        });

        console.log(data);
        this.setState({ impressions: this.aggregateData(data, this.state.breakdown) });
      }

      this.setState({ impressions: result.data });
    }
  }

  responseClicksInfoCallback(error, result) {
    if (error) {
      console.log('Error insights:', error);
    } else {
      console.log('Success insights:', result);
      if (this.state.breakdown) {
        const data = _(result.data).map((item) => {
          if (item.breakdowns && item.breakdowns.country) {
            return Object.assign({ country: item.breakdowns.country }, item);
          } else if (item.breakdowns && item.breakdowns.placement) {
            return Object.assign({ placement: item.breakdowns.placement }, item);
          }
          return item;
        });

        console.log(data);
        this.setState({ clicks: this.aggregateData(data, this.state.breakdown) });
      }

      this.setState({ clicks: result.data });
    }
  }

  responseVideoViewsInfoCallback(error, result) {
    if (error) {
      console.log('Error insights:', error);
    } else {
      console.log('Success insights:', result);
      if (this.state.breakdown) {
        const data = _(result.data).map((item) => {
          if (item.breakdowns && item.breakdowns.country) {
            return Object.assign({ country: item.breakdowns.country }, item);
          } else if (item.breakdowns && item.breakdowns.placement) {
            return Object.assign({ placement: item.breakdowns.placement }, item);
          }
          return item;
        });

        console.log(data);
        this.setState({ videoViews: this.aggregateData(data, this.state.breakdown) });
      }

      this.setState({ videoViews: result.data });
    }
  }

  responseRevenueInfoCallback(error, result) {
    if (error) {
      console.log('Error insights:', error);
    } else {
      console.log('Success insights:', result);
      if (this.state.breakdown) {
        const data = _(result.data).map((item) => {
          if (item.breakdowns && item.breakdowns.country) {
            return Object.assign({ country: item.breakdowns.country }, item);
          } else if (item.breakdowns && item.breakdowns.placement) {
            return Object.assign({ placement: item.breakdowns.placement }, item);
          }
          return item;
        });

        console.log(data);
        this.setState({ revenue: this.aggregateData(data, this.state.breakdown) });
      }

      this.setState({ revenue: result.data });
    }
  }

  renderNav() {
    return (
      <NavigationBar
        title={{ title: this.props.title }}
        style={styles.navigatorBar}
        leftButton={{
          title: 'Back',
          handler: Actions.pop,
        }}
        rightButton={{
          title: this.state.isChanged ? 'Apply' : '',
          tintColor: 'red',
          handler: () => {
            this.onRequest();
            AppEventsLogger.logEvent('press-apply-button');
          },
        }}
      />
    );
  }

  renderInsights() {
    if (this.state.requests && this.state.requests.length === 0) {
      return (
        <View style={{ padding: 10 }}>
          <Text style={[styles.text, { textAlign: 'center', fontSize: 12 }]}>No performance data available. Please check if the ads are running and get some requests.</Text>
        </View>
      );
    }

    return (
      <ScrollView contentContainerStyle={styles.insightsBlock} horizontal showsHorizontalScrollIndicator={false}>
        <ListView
          style={{ marginBottom: 10 }}
          enableEmptySections={true}
          scrollEnabled={false}
          dataSource={this.state.dataSource}
          renderHeader={() => <View style={[styles.row, { padding: 0 }]}>
            <View style={[styles.cell, { flex: 1.3 }]} />
            <View style={styles.cell}><Text style={styles.cellText}>{'Requests'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'Filled'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'Impressions'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'Clicks'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'10s Video'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'Fill Rate'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'CTR'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'eCPM'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{'Est. Rev'}</Text></View>
          </View>}
          renderRow={(item, sectionID, rowID) => <View style={[styles.row, { padding: 0 }]}>
            <View style={[styles.cell, { flex: 1.3 }]}>
              <Text style={styles.cellText}>{item.country || item.placement || Moment(item.time).format('MMM D, YYYY')}</Text>
              {item.breakdowns && <Text style={styles.cellText}>{item.breakdowns.country || item.breakdowns.placement}</Text>}
            </View>

            <View style={styles.cell}><Text style={styles.cellText}>{item.value}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.filled && this.state.filled[rowID] && this.state.filled[rowID].value) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.impressions && this.state.impressions[rowID] && this.state.impressions[rowID].value) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.clicks && this.state.clicks[rowID] && this.state.clicks[rowID].value) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.videoViews && this.state.videoViews[rowID] && this.state.videoViews[rowID].value) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.requests && this.state.filled && this.state.requests[rowID] && this.state.filled[rowID] && `${((this.state.filled[rowID].value / this.state.requests[rowID].value) * 100).toFixed(2)}%`) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.clicks && this.state.impressions && this.state.clicks[rowID] && this.state.impressions[rowID] && `${((this.state.clicks[rowID].value / this.state.impressions[rowID].value) * 100).toFixed(2)}%`) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.impressions && this.state.revenue && this.state.impressions[rowID] && this.state.revenue[rowID] && `$${((this.state.revenue[rowID].value / this.state.impressions[rowID].value) * 1000).toFixed(2)}`) || '*'}</Text></View>
            <View style={styles.cell}><Text style={styles.cellText}>{(this.state.revenue && this.state.revenue[rowID] && `$${(this.state.revenue[rowID].value * 1).toFixed(2)}`) || '*'}</Text></View>
          </View>}
        />
      </ScrollView>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderNav()}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this.onRequest();
                AppEventsLogger.logEvent('refresh-overview');
              }}
            />
          }
        >
          <View style={styles.optionsBlock}>
            <View style={[styles.row, { paddingVertical: 8 }]}>
              <Text style={styles.text}>App</Text>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={[styles.text, { lineHeight: 20 }]}>{this.props.appName}</Text>
                <Text style={[styles.text, { lineHeight: 20, fontSize: 12, color: 'gray' }]}>{this.props.appId}</Text>
              </View>
            </View>

            <TouchableHighlight
              underlayColor="#F4F4F4"
              onPress={() => {
                this.setState({ isStartDatePickerShow: !this.state.isStartDatePickerShow, isEndDatePickerShow: false });
                AppEventsLogger.logEvent('press-change-start-date');
              }}
            >
              <View style={styles.row}>
                <Text style={styles.text}>Starts</Text>
                <Text style={[styles.text, { color: this.state.isStartDatePickerShow ? 'red' : 'black' }]}>{Moment(this.state.startDate).format('MMM D, YYYY')}</Text>
              </View>
            </TouchableHighlight>
            {this.state.isStartDatePickerShow && <DatePickerIOS
              style={styles.datePicker}
              date={this.state.startDate}
              mode="date"
              timeZoneOffsetInHours={this.state.timeZoneOffsetInHours * 60}
              onDateChange={(date) => {
                this.setState({ startDate: date, isChanged: true });
                AppEventsLogger.logEvent('change-start-date', 0, { startDate: date.toString() });
              }}
            />}

            <TouchableHighlight
              underlayColor="#F4F4F4"
              onPress={() => {
                this.setState({ isEndDatePickerShow: !this.state.isEndDatePickerShow, isStartDatePickerShow: false });
                AppEventsLogger.logEvent('press-change-end-date');
              }}
            >
              <View style={styles.row}>
                <Text style={styles.text}>Ends</Text>
                <Text style={[styles.text, { color: this.state.isEndDatePickerShow ? 'red' : 'black' }]}>{Moment(this.state.endDate).format('MMM D, YYYY')}</Text>
              </View>
            </TouchableHighlight>
            {this.state.isEndDatePickerShow && <DatePickerIOS
              style={styles.datePicker}
              date={this.state.endDate}
              mode="date"
              timeZoneOffsetInHours={this.state.timeZoneOffsetInHours * 60}
              onDateChange={(date) => {
                this.setState({ endDate: date, isChanged: true });
                AppEventsLogger.logEvent('change-end-date', 0, { endDate: date.toString() });
              }}
            />}

            {/* <View style={[styles.row, { paddingVertical: 12 }]}>
              <SegmentedControls
                options={['Placement', 'Country']}
                onSelection={(breakdown) => {
                  console.log(breakdown);
                  if (breakdown === this.state.breakdown) {
                    breakdown = null;
                    this.setState({ breakdown: null, isChanged: true, isStartDatePickerShow: false, isEndDatePickerShow: false });
                  } else {
                    this.setState({ breakdown, isChanged: true, isStartDatePickerShow: false, isEndDatePickerShow: false });
                  }
                }}
                selectedOption={this.state.breakdown}
              />
            </View> */}
          </View>

          <FbAds adsManager={adsManager} />

          {this.renderInsights()}
        </ScrollView>
      </View>
    );
  }
}

OverviewView.propTypes = {
  title: React.PropTypes.string,
  appId: React.PropTypes.string,
  appName: React.PropTypes.string,
};
