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

import { AccessToken } from 'react-native-fbsdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IndicatorViewPager, PagerDotIndicator } from 'rn-viewpager';
import { NativeAdsManager } from 'react-native-fbads';
import Icon from 'react-native-vector-icons/MaterialIcons';

import * as dateRangeActions from '../actions/dateRange';
import * as insightActions from '../actions/insights';

import AdBanner from '../components/fbadbanner';
import FbAds from '../components/fbads';
import InsightItem from '../components/InsightBoxItem';
import LineChart from '../components/LineChart';
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
    const { startDate, endDate, rangeType, isCompareTo } = this.props;

    this.checkPermissions();
    this.onRequest(appId, startDate, endDate, rangeType, isCompareTo);

    this.sub = BackHandler.addEventListener('backPress', () => this.props.navigation.goBack());
  }

  componentWillReceiveProps(nextProps) {
    const { appId } = this.props.navigation.state.params;

    if (nextProps.startDate !== this.props.startDate || nextProps.endDate !== this.props.endDate) {
      this.onRequest(appId, nextProps.startDate, nextProps.endDate, nextProps.rangeType, nextProps.isCompareTo);
    }
  }

  componentWillUnmount() {
    this.sub.remove();
  }

  onRequest(appId, startDate, endDate, rangeType, isCompareTo) {
    if (startDate && endDate) {
      const { fetchRequests, fetchFilledRequests, fetchImpressions, fetchClicks, fetchRevenue } = this.props;

      fetchRequests(appId, startDate, endDate, rangeType, isCompareTo);
      fetchFilledRequests(appId, startDate, endDate, rangeType, isCompareTo);
      fetchImpressions(appId, startDate, endDate, rangeType, isCompareTo);
      fetchClicks(appId, startDate, endDate, rangeType, isCompareTo);
      fetchRevenue(appId, startDate, endDate, rangeType, isCompareTo);
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

        // if (data && data.permissions && data.permissions.indexOf('read_audience_network_insights') === -1) {
        //   LoginManager.logInWithReadPermissions(['read_audience_network_insights']).then(
        //     (result) => {
        //       if (result.isCancelled) {
        //         alert('You cannot use this app without read_audience_network_insights permissions.');
        //         tracker.logEvent('cancel-read-audience-network-insights-permission', { category: 'auth-event', view: 'overview' });
        //       } else {
        //         this.onRequest(appId, nextProps.startDate, nextProps.endDate, nextProps.rangeType, nextProps.isCompareTo);
        //         tracker.logEvent('give-read-audience-network-insights-permission', { category: 'auth-event', view: 'overview' });
        //       }
        //     },
        //     (error) => {
        //       alert(`Login fail with error: ${error}`);
        //       tracker.logEvent('login-failed', { category: 'auth-event', view: 'overview' });
        //     },
        //   );
        // }
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
          style={{ height: 280, marginBottom: 5 }}
          indicator={<PagerDotIndicator selectedDotStyle={{ backgroundColor: '#F4F4F4' }} pageCount={4} />}
        >
          <View style={styles.chartBlock}>
            {Platform.OS === 'ios' ? <VictoryChart data={requests} /> : <LineChart data={requests} />}
            <Text style={styles.cellText}>{'Requests'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {Platform.OS === 'ios' ? <VictoryChart data={impressions} /> : <LineChart data={impressions} />}
            <Text style={styles.cellText}>{'Impressions'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {Platform.OS === 'ios' ? <VictoryChart data={clicks} /> : <LineChart data={clicks} />}
            <Text style={styles.cellText}>{'Clicks'}</Text>
          </View>
          <View style={styles.chartBlock}>
            {Platform.OS === 'ios' ? <VictoryChart data={revenue} /> : <LineChart data={revenue} />}
            <Text style={styles.cellText}>{'Estimated Revenue'}</Text>
          </View>
        </IndicatorViewPager>}

        {/* <ScrollView contentContainerStyle={styles.insightsBlock} horizontal showsHorizontalScrollIndicator={false}>
          <FlatList
            style={{ marginBottom: 10 }}
            enableEmptySections={true}
            scrollEnabled={false}
            data={all}
            ListHeaderComponent={() => <InsightHeader />}
            renderItem={({ item }) => <InsightItem item={item} />}
          />
        </ScrollView> */}

        <ScrollView contentContainerStyle={{ flex: 1, marginTop: 6 }}>
          <FlatList
            style={{ marginBottom: 10 }}
            enableEmptySections={true}
            scrollEnabled={false}
            data={all}
            renderItem={({ item }) => <InsightItem item={item} />}
          />
        </ScrollView>
      </View>
    );
  }

  render() {
    const { startDate, endDate, rangeType, isCompareTo, isLoading, all, navigation } = this.props;
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
                this.onRequest(appId, startDate, endDate, rangeType, isCompareTo);
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
  rangeType: 'days',
  isCompareTo: false,
};

OverviewView.propTypes = {
  navigation: React.PropTypes.object.isRequired,
  startDate: React.PropTypes.object,
  endDate: React.PropTypes.object,
  rangeType: React.PropTypes.string,
  isCompareTo: React.PropTypes.bool,

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
  rangeType: state.dateRange.rangeType,
  isCompareTo: state.dateRange.isCompareTo,
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
