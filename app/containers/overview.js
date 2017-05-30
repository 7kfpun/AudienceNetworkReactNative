import React, { Component } from 'react';
import {
  ListView,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment';

import { AccessToken, AppEventsLogger, LoginManager } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import { NativeAdsManager } from 'react-native-fbads';

import * as dateRangeActions from '../actions/dateRange';
import * as insightActions from '../actions/insights';
import AdBanner from '../components/fbadbanner';

import FbAds from '../components/fbads';
import LineChart from '../components/lineChart';
import RangePicker from '../components/RangePicker';

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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
  },
  datePicker: {
    backgroundColor: 'white',
  },
  overviewBlock: {
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
  overviewCell: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartBlock: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E0E0E0',
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
  sumTitleCellText: {
    fontSize: 12,
  },
  sumCellText: {
    fontSize: 12,
    fontWeight: '200',
  },
  cellText: {
    fontSize: 13,
  },
});

const dataSource = new ListView.DataSource({ rowHasChanged: (row1, row2) => row1 !== row2 });

class OverviewView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.appName} (${navigation.state.params.appId})`,
    headerLeft: <TouchableOpacity
      underlayColor="white"
      onPress={() => {
        navigation.goBack();
        AppEventsLogger.logEvent('press-apply-button');
      }}
    >
      <Text style={{ marginLeft: 6, fontSize: 16, color: '#0076FF' }}>Back</Text>
    </TouchableOpacity>,
    // rightButton={{
    //   title: this.state.isChanged ? 'Apply' : '',
    //   tintColor: 'red',
    //   handler: () => {
    //     this.onRequest();
    //   },
    // }}
    headerStyle: {
      backgroundColor: 'white',
    },
    headerTitleStyle: {
      fontSize: 12,
    },
  });

  state = {
    refreshing: false,
    dataSource: dataSource.cloneWithRows([]),
    isChanged: false,
  };

  componentDidMount() {
    const { appId } = this.props.navigation.state.params;
    const { startDate, endDate } = this.props;

    this.checkPermissions();
    this.onRequest(appId, startDate, endDate);
  }

  componentWillReceiveProps(nextProps) {
    const { appId } = this.props.navigation.state.params;

    if (nextProps.startDate !== this.props.startDate || nextProps.endDate !== this.props.endDate) {
      this.onRequest(appId, nextProps.startDate, nextProps.endDate);
    }

    if (nextProps.requests !== this.props.requests
      || nextProps.filledRequests !== this.props.filledRequests
      || nextProps.impressions !== this.props.impressions
      || nextProps.clicks !== this.props.clicks
      || nextProps.revenue !== this.props.revenue
    ) {
      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(nextProps.requests),
      });
    }
  }

  onRequest(appId, startDate, endDate) {
    const { fetchRequests, fetchFilledRequests, fetchImpressions, fetchClicks, fetchRevenue } = this.props;

    fetchRequests(appId, startDate, endDate);
    fetchFilledRequests(appId, startDate, endDate);
    fetchImpressions(appId, startDate, endDate);
    fetchClicks(appId, startDate, endDate);
    fetchRevenue(appId, startDate, endDate);
  }

  checkPermissions() {
    const { dispatch, navigate } = this.props.navigation;

    AccessToken.getCurrentAccessToken().then(
      (data) => {
        console.log('getCurrentAccessToken', data);
        if (!data || !data.permissions) {
          dispatch({ type: 'Logout' });
          navigate('Login');
        }

        if (data && data.permissions && data.permissions.indexOf('read_audience_network_insights') === -1) {
          LoginManager.logInWithReadPermissions(['read_audience_network_insights']).then(
            (result) => {
              if (result.isCancelled) {
                alert('You cannot this app without read_audience_network_insights permissions.');
              }
            },
            (error) => {
              alert(`Login fail with error: ${error}`);
            },
          );
        }
      },
    );
  }

  // aggregateData(data, breakdown) {
  //   let out = [];
  //   if (breakdown === 'Country') {
  //     const groups = _(data).groupBy('country');
  //     out = _(groups).map((g, key) => {
  //       return { country: key, value: _(g).reduce((m, x) => m + parseInt(x.value, 10), 0) };
  //     });
  //   } else if (breakdown === 'Placement') {
  //     const groups = _(data).groupBy('placement');
  //     out = _(groups).map((g, key) => {
  //       return { placement: key, value: _(g).reduce((m, x) => m + parseInt(x.value, 10), 0) };
  //     });
  //   }
  //
  //   console.log(out);
  //   return out;
  // }

  renderInsights() {
    const { requestsSum, filledRequestsSum, impressionsSum, clicksSum, revenueSum } = this.props;
    const { requests, filledRequests, impressions, clicks, revenue } = this.props;

    return (
      <View>
        <View style={styles.overviewBlock}>
          <View style={styles.overviewCell}>
            <Text style={styles.sumTitleCellText}>{'Requests'}</Text>
            <Text style={styles.sumCellText}>{requestsSum || '*'}</Text>
          </View>

          <View style={styles.overviewCell}>
            <Text style={styles.sumTitleCellText}>{'Fill Rate'}</Text>
            <Text style={styles.sumCellText}>{(filledRequestsSum && requestsSum && `${((filledRequestsSum / requestsSum) * 100).toFixed(2)}%`) || '*'}</Text>
          </View>

          <View style={styles.overviewCell}>
            <Text style={styles.sumTitleCellText}>{'Impressions'}</Text>
            <Text style={styles.sumCellText}>{impressionsSum || '*'}</Text>
          </View>

          <View style={styles.overviewCell}>
            <Text style={styles.sumTitleCellText}>{'Clicks'}</Text>
            <Text style={styles.sumCellText}>{clicksSum || '*'}</Text>
          </View>

          <View style={styles.overviewCell}>
            <Text style={styles.sumTitleCellText}>{'Est. Rev'}</Text>
            <Text style={styles.sumCellText}>{(revenueSum && `$${revenueSum.toFixed(2)}`) || '*'}</Text>
          </View>
        </View>

        <FbAds adsManager={adsManager} />

        <IndicatorViewPager
          style={{ height: 220, marginBottom: 5 }}
          indicator={<PagerDotIndicator selectedDotStyle={{ backgroundColor: '#F4F4F4' }} pageCount={4} />}
        >
          <View style={styles.chartBlock}>
            {requests.length > 1 && <LineChart data={requests} />}
            <Text style={styles.cellText}>{'Requests'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {impressions.length > 1 && <LineChart data={impressions} />}
            <Text style={styles.cellText}>{'Impressions'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {clicks.length > 1 && <LineChart data={clicks} />}
            <Text style={styles.cellText}>{'Clicks'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {revenue.length > 1 && <LineChart data={revenue} />}
            <Text style={styles.cellText}>{'Estimated Revenue'}</Text>
          </View>
        </IndicatorViewPager>

        <ScrollView contentContainerStyle={styles.insightsBlock} horizontal showsHorizontalScrollIndicator={false}>
          <ListView
            style={{ marginBottom: 10 }}
            enableEmptySections={true}
            scrollEnabled={false}
            dataSource={this.state.dataSource}
            renderHeader={() => (<View style={[styles.row, { padding: 0 }]}>
              <View style={[styles.cell, { flex: 1.4 }]} />
              <View style={styles.cell}><Text style={styles.cellText}>{'Requests'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Filled'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Impressions'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Clicks'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Fill Rate'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'CTR'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'eCPM'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Est. Rev'}</Text></View>
            </View>)}
            renderRow={(item, sectionID, rowID) => (<View style={[styles.row, { padding: 0 }]}>
              <View style={[styles.cell, { flex: 1.4 }]}>
                <Text style={styles.cellText}>{item.country || item.placement || moment(item.time).format('ddd MMM D, YYYY')}</Text>
                {item.breakdowns && <Text style={[styles.cellText, { fontSize: 11, color: 'gray' }]}>{item.breakdowns.country || item.breakdowns.placement}</Text>}
              </View>
              <View style={styles.cell}><Text style={styles.cellText}>{item.value}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(filledRequests && filledRequests[rowID] && filledRequests[rowID].value) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(impressions && impressions[rowID] && impressions[rowID].value) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(clicks && clicks[rowID] && clicks[rowID].value) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(requests && filledRequests[rowID] && requests[rowID] && filledRequests[rowID] && `${((filledRequests[rowID].value / requests[rowID].value) * 100).toFixed(2)}%`) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(clicks && impressions && clicks[rowID] && impressions[rowID] && `${((clicks[rowID].value / impressions[rowID].value) * 100).toFixed(2)}%`) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(impressions && revenue && impressions[rowID] && revenue[rowID] && `$${((revenue[rowID].value / impressions[rowID].value) * 1000).toFixed(2)}`) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(revenue && revenue[rowID] && `$${(revenue[rowID].value * 1).toFixed(2)}`) || '*'}</Text></View>
            </View>)}
          />
        </ScrollView>
      </View>
    );
  }

  render() {
    const { navigation } = this.props;
    const { appId } = this.props.navigation.state.params;
    const { startDate, endDate } = this.props;
    const { isLoading, requests, filledRequests, impressions, clicks, revenue } = this.props;

    if (!isLoading && requests.length === 0 && filledRequests.length === 0 && impressions.length === 0 && clicks.length === 0 && revenue.length === 0) {
      return (<View style={styles.container}>
        <View style={{ padding: 30 }}>
          <Text style={[styles.text, { textAlign: 'center', fontSize: 12 }]}>No performance data available. Please check if the ads are running and get some requests.</Text>
        </View>
      </View>);
    }

    return (
      <View style={styles.container}>
        <RangePicker navigation={navigation} />

        <ScrollView
          style={{ paddingVertical: 6 }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                this.onRequest(appId, startDate, endDate);
                AppEventsLogger.logEvent('refresh-overview');
              }}
            />
          }
        >
          {this.renderInsights()}
        </ScrollView>
        <AdBanner />
      </View>
    );
  }
}

OverviewView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  startDate: React.PropTypes.object.isRequired,
  endDate: React.PropTypes.object.isRequired,

  isLoading: React.PropTypes.bool.isRequired,

  requests: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
  filledRequests: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
  impressions: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
  clicks: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
  revenue: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,

  requestsSum: React.PropTypes.number.isRequired,
  filledRequestsSum: React.PropTypes.number.isRequired,
  impressionsSum: React.PropTypes.number.isRequired,
  clicksSum: React.PropTypes.number.isRequired,
  revenueSum: React.PropTypes.number.isRequired,

  fetchRequests: React.PropTypes.func.isRequired,
  fetchFilledRequests: React.PropTypes.func.isRequired,
  fetchImpressions: React.PropTypes.func.isRequired,
  fetchClicks: React.PropTypes.func.isRequired,
  fetchRevenue: React.PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  startDate: state.dateRange.startDate,
  endDate: state.dateRange.endDate,
  isLoading: state.insights.isLoading,

  requests: state.insights.requests,
  filledRequests: state.insights.filledRequests,
  impressions: state.insights.impressions,
  clicks: state.insights.clicks,
  revenue: state.insights.revenue,

  requestsSum: state.insights.requestsSum,
  filledRequestsSum: state.insights.filledRequestsSum,
  impressionsSum: state.insights.impressionsSum,
  clicksSum: state.insights.clicksSum,
  revenueSum: state.insights.revenueSum,
});

export default connect(
  mapStateToProps,
  dispatch => bindActionCreators({ ...dateRangeActions, ...insightActions }, dispatch),
)(OverviewView);
