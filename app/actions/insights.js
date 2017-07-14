import moment from 'moment-timezone';

import { getCompareToStartDate, getCompareToEndDate } from '../utils/compareToDate';
import * as facebook from '../utils/facebook';
import tracker from '../utils/tracker';

moment.tz.setDefault('America/Los_Angeles');

export const showLoading = () => ({
  type: 'SHOW_LOADING',
  isLoading: true,
});

export const hideLoading = () => ({
  type: 'HIDE_LOADING',
  isLoading: false,
});

export const receiveRequests = data => ({
  type: 'RECEIVE_REQUESTS',
  data,
});

export const receiveFilledRequests = data => ({
  type: 'RECEIVE_FILLED_REQUESTS',
  data,
});

export const receiveImpressions = data => ({
  type: 'RECEIVE_IMPRESSIONS',
  data,
});

export const receiveClicks = data => ({
  type: 'RECEIVE_CLICKS',
  data,
});

export const receiveRevenue = data => ({
  type: 'RECEIVE_REVENUE',
  data,
});

export const receiveAllInsights = () => ({
  type: 'RECEIVE_ALL_INSIGHTS',
});

export const receiveCompareToRequests = data => ({
  type: 'RECEIVE_COMPARE_TO_REQUESTS',
  data,
});

export const receiveCompareToFilledRequests = data => ({
  type: 'RECEIVE_COMPARE_TO_FILLED_REQUESTS',
  data,
});

export const receiveCompareToImpressions = data => ({
  type: 'RECEIVE_COMPARE_TO_IMPRESSIONS',
  data,
});

export const receiveCompareToClicks = data => ({
  type: 'RECEIVE_COMPARE_TO_CLICKS',
  data,
});

export const receiveCompareToRevenue = data => ({
  type: 'RECEIVE_COMPARE_TO_REVENUE',
  data,
});

export const receiveCompareToAllInsights = () => ({
  type: 'RECEIVE_ALL_COMPARE_TO_INSIGHTS',
});

function fetchData(appId, startDate, endDate, rangeType, isCompareTo, dataType, name, aggregation) {
  return function dp(dispatch, getState) {
    dispatch(showLoading(), getState);

    if (isCompareTo) {
      const compareToStartDate = getCompareToStartDate(startDate, endDate, rangeType);
      const compareToEndDate = getCompareToEndDate(startDate, endDate, rangeType);

      facebook.audienceNetwork(
        appId, name, aggregation, null, compareToStartDate, compareToEndDate,
        (error, result) => {
          if (error) {
            console.log('Error compare to insights:', dataType, error);
            tracker.logEvent('request-compare-to-error', { category: 'api-event', component: 'item', log: 'error', value: dataType });
          } else {
            console.log('Success compare to insights:', dataType, result);
            tracker.logEvent('request-compare-to-success', { category: 'api-event', component: 'item', log: 'info', value: dataType });
            switch (dataType) {
              case 'REQUESTS':
                dispatch(receiveCompareToRequests([...result.data]), getState);
                break;
              case 'FILLED_REQUESTS':
                dispatch(receiveCompareToFilledRequests([...result.data]), getState);
                break;
              case 'IMPRESSIONS':
                dispatch(receiveCompareToImpressions([...result.data]), getState);
                break;
              case 'CLICKS':
                dispatch(receiveCompareToClicks([...result.data]), getState);
                break;
              case 'REVENUE':
                dispatch(receiveCompareToRevenue([...result.data]), getState);
                break;
              default:
                return null;
            }
          }
          return dispatch(receiveCompareToAllInsights(), getState);
        });
    }

    return facebook.audienceNetwork(
      appId, name, aggregation, null, startDate, endDate,
      (error, result) => {
        if (error) {
          console.log('Error insights:', dataType, error);
          tracker.logEvent('request-error', { category: 'api-event', component: 'item', log: 'error', value: dataType });
        } else {
          console.log('Success insights:', dataType, result);

          tracker.logEvent('request-success', { category: 'api-event', component: 'item', log: 'info', value: dataType });
          switch (dataType) {
            case 'REQUESTS':
              dispatch(receiveRequests([...result.data]), getState);
              break;
            case 'FILLED_REQUESTS':
              dispatch(receiveFilledRequests([...result.data]), getState);
              break;
            case 'IMPRESSIONS':
              dispatch(receiveImpressions([...result.data]), getState);
              break;
            case 'CLICKS':
              dispatch(receiveClicks([...result.data]), getState);
              break;
            case 'REVENUE':
              dispatch(receiveRevenue([...result.data]), getState);
              break;
            default:
              return null;
          }
        }
        dispatch(receiveAllInsights(), getState);
        return dispatch(hideLoading(), getState);
      });
  };
}

export function fetchRequests(appId, startDate, endDate, rangeType, isCompareTo) {
  return fetchData(appId, startDate, endDate, rangeType, isCompareTo, 'REQUESTS', 'fb_ad_network_request', 'COUNT');
}

export function fetchFilledRequests(appId, startDate, endDate, rangeType, isCompareTo) {
  return fetchData(appId, startDate, endDate, rangeType, isCompareTo, 'FILLED_REQUESTS', 'fb_ad_network_request', 'SUM');
}

export function fetchImpressions(appId, startDate, endDate, rangeType, isCompareTo) {
  return fetchData(appId, startDate, endDate, rangeType, isCompareTo, 'IMPRESSIONS', 'fb_ad_network_imp', 'COUNT');
}

export function fetchClicks(appId, startDate, endDate, rangeType, isCompareTo) {
  return fetchData(appId, startDate, endDate, rangeType, isCompareTo, 'CLICKS', 'fb_ad_network_click', 'COUNT');
}

export function fetchRevenue(appId, startDate, endDate, rangeType, isCompareTo) {
  return fetchData(appId, startDate, endDate, rangeType, isCompareTo, 'REVENUE', 'fb_ad_network_revenue', 'SUM');
}
