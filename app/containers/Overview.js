import React, { Component } from 'react';
import {
  BackHandler,
  FlatList,
  Platform,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import moment from 'moment-timezone';

import { AccessToken, LoginManager } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import { NativeAdsManager } from 'react-native-fbads';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as dateRangeActions from '../actions/dateRange';
import * as insightActions from '../actions/insights';

import AdBanner from '../components/fbadbanner';
import FbAds from '../components/fbads';
import OverviewSummary from '../components/OverviewSummary';
import RangePicker from '../components/RangePicker';
import VictoryChart from '../components/VictoryChart';

import tracker from '../utils/tracker';

import { config } from '../config';

const adsManager = new NativeAdsManager(config.fbads[Platform.OS].native);

moment.tz.setDefault('America/Los_Angeles');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECEFF1',
  },
  headerNav: {
    flex: 1,
    justifyContent: 'center',
    padding: 6,
  },
  headerLeftText: {
    fontSize: 16,
    color: '#0076FF',
  },
  body: {
    paddingVertical: 6,
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
    width: 960,
  },
  cell: {
    flex: 1,
    alignItems: 'flex-end',
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

class OverviewView extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.appName} (${navigation.state.params.appId})`,
    headerLeft: <TouchableOpacity
      style={styles.headerNav}
      underlayColor="white"
      onPress={() => {
        navigation.goBack();
      }}
    >
      {Platform.OS === 'ios' ? <Text style={styles.headerLeftText}>{'Back'}</Text> : <Icon style={styles.headerLeftIcon} name="arrow-back" size={30} color="#0076FF" />}
    </TouchableOpacity>,
    headerStyle: {
      backgroundColor: 'white',
    },
    headerTitleStyle: {
      fontSize: 12,
    },
  });

  state = {
    refreshing: false,
    isChanged: false,
  };

  componentDidMount() {
    const { appId } = this.props.navigation.state.params;
    const { startDate, endDate } = this.props;

    this.checkPermissions();
    this.onRequest(appId, startDate, endDate);

    this.sub = BackHandler.addEventListener('backPress', () => this.props.navigation.goBack());
  }

  componentWillReceiveProps(nextProps) {
    const { appId } = this.props.navigation.state.params;

    if (nextProps.startDate !== this.props.startDate || nextProps.endDate !== this.props.endDate) {
      this.onRequest(appId, nextProps.startDate, nextProps.endDate);
    }
  }

  componentWillUnmount() {
    this.sub.remove();
  }

  onRequest(appId, startDate, endDate) {
    if (startDate && endDate) {
      const { fetchRequests, fetchFilledRequests, fetchImpressions, fetchClicks, fetchRevenue } = this.props;

      fetchRequests(appId, startDate, endDate);
      fetchFilledRequests(appId, startDate, endDate);
      fetchImpressions(appId, startDate, endDate);
      fetchClicks(appId, startDate, endDate);
      fetchRevenue(appId, startDate, endDate);
    }
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
                tracker.logEvent('cancel-read-audience-network-insights-permission', { category: 'auth-event', view: 'overview' });
              } else {
                this.onRequest(appId, nextProps.startDate, nextProps.endDate);
                tracker.logEvent('give-read-audience-network-insights-permission', { category: 'auth-event', view: 'overview' });
              }
            },
            (error) => {
              alert(`Login fail with error: ${error}`);
              tracker.logEvent('login-failed', { category: 'auth-event', view: 'overview' });
            },
          );
        }
      },
    );
  }

  renderInsights() {
    const { requests, impressions, clicks, revenue, all } = this.props;
    const { startDate, endDate } = this.props;

    return (
      <View>
        <OverviewSummary />

        <FbAds adsManager={adsManager} />

        {startDate && endDate && moment(startDate).format('L') !== moment(endDate).format('L') && <IndicatorViewPager
          style={{ height: 240, marginBottom: 5 }}
          indicator={<PagerDotIndicator selectedDotStyle={{ backgroundColor: '#F4F4F4' }} pageCount={4} />}
        >
          <View style={styles.chartBlock}>
            {requests.length > 1 && <VictoryChart data={requests} />}
            <Text style={styles.cellText}>{'Requests'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {impressions.length > 1 && <VictoryChart data={impressions} />}
            <Text style={styles.cellText}>{'Impressions'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {clicks.length > 1 && <VictoryChart data={clicks} />}
            <Text style={styles.cellText}>{'Clicks'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {revenue.length > 1 && <VictoryChart data={revenue} />}
            <Text style={styles.cellText}>{'Estimated Revenue'}</Text>
          </View>
        </IndicatorViewPager>}

        <ScrollView contentContainerStyle={styles.insightsBlock} horizontal showsHorizontalScrollIndicator={false}>
          <FlatList
            style={{ marginBottom: 10 }}
            enableEmptySections={true}
            scrollEnabled={false}
            data={all}
            ListHeaderComponent={() => (<View style={[styles.row, { padding: 0 }]}>
              <View style={[styles.cell, { flex: 1.5 }]} />
              <View style={styles.cell}><Text style={styles.cellText}>{'Requests'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Filled'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Impressions'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Clicks'}</Text></View>

              <View style={styles.cell}><Text style={styles.cellText}>{'Fill Rate'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'CTR'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'eCPM'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{'Est. Rev'}</Text></View>
            </View>)}
            renderItem={({ item }) => (<View style={[styles.row, { padding: 0 }]}>
              <View style={[styles.cell, { flex: 1.5 }]}>
                <Text style={styles.cellText}>{item.requests && item.requests.time && moment(item.requests.time).format('ddd MMM DD, YYYY')}</Text>
                {item.breakdowns && <Text style={[styles.cellText, { fontSize: 11, color: 'gray' }]}>{item.breakdowns.country || item.breakdowns.placement}</Text>}
              </View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.requests && item.requests.value) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.filledRequests && item.filledRequests.value) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.impressions && item.impressions.value) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.clicks && item.clicks.value) || '*'}</Text></View>

              <View style={styles.cell}><Text style={styles.cellText}>{(item.requests && item.requests.value && item.filledRequests && item.filledRequests.value && `${((item.filledRequests.value / item.requests.value) * 100).toFixed(2)}%`) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.clicks && item.impressions && item.clicks.value && item.impressions.value && `${((item.clicks.value / item.impressions.value) * 100).toFixed(2)}%`) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.impressions && item.revenue && item.impressions.value && item.revenue.value && `$${((item.revenue.value / item.impressions.value) * 1000).toFixed(2)}`) || '*'}</Text></View>
              <View style={styles.cell}><Text style={styles.cellText}>{(item.revenue && item.revenue.value && `$${(item.revenue.value * 1).toFixed(2)}`) || '*'}</Text></View>
            </View>)}
          />
        </ScrollView>
      </View>
    );
  }

  render() {
    const { startDate, endDate, isLoading, all, navigation } = this.props;
    const { appId } = this.props.navigation.state.params;

    if (!isLoading && all.length === 0) {
      return (<View style={styles.container}>
        <RangePicker navigation={navigation} />

        <View style={{ padding: 30 }}>
          <Text style={[styles.text, { textAlign: 'center', fontSize: 12 }]}>No performance data available. Please check if the ads are running and get some requests.</Text>
        </View>
      </View>);
    }

    return (
      <View style={styles.container}>
        <RangePicker navigation={navigation} />

        <ScrollView
          style={styles.body}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => {
                this.onRequest(appId, startDate, endDate);
                tracker.logEvent('refresh-overview', { category: 'user-event', view: 'overview' });
              }}
            />
          }
        >
          {this.renderInsights()}
        </ScrollView>

        <AdBanner withPopUp={false} />
      </View>
    );
  }
}

OverviewView.defaultProps = {
  startDate: null,
  endDate: null,
};

OverviewView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,

  isLoading: React.PropTypes.bool.isRequired,

  all: React.PropTypes.array.isRequired,

  requests: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.string.isRequired,
    time: React.PropTypes.string.isRequired,
  }).isRequired).isRequired,
  // filledRequests: React.PropTypes.arrayOf(React.PropTypes.shape({
  //   value: React.PropTypes.string.isRequired,
  //   time: React.PropTypes.string.isRequired,
  // }).isRequired).isRequired,
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

  all: state.insights.all,

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
