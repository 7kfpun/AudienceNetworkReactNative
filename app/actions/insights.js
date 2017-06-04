import * as facebook from '../utils/facebook';
import tracker from '../utils/tracker';

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

function fetchData(appId, startDate, endDate, dataType, name, aggregation) {
  return function dp(dispatch, getState) {
    dispatch(showLoading(), getState);

    return facebook.audienceNetwork(
      appId, name, aggregation, null, startDate, endDate,
      (error, result) => {
        if (error) {
          console.log('Error insights:', error);
          tracker.logEvent('request-error', { category: 'api-event', component: 'item', log: 'error', value: dataType });
        } else {
          console.log('Success insights:', result);
          tracker.logEvent('request-success', { category: 'api-event', component: 'item', log: 'info', value: dataType });
          switch (dataType) {
            case 'REQUESTS':
              dispatch(receiveRequests(result.data), getState);
              break;
            case 'FILLED_REQUESTS':
              dispatch(receiveFilledRequests(result.data), getState);
              break;
            case 'IMPRESSIONS':
              dispatch(receiveImpressions(result.data), getState);
              break;
            case 'CLICKS':
              dispatch(receiveClicks(result.data), getState);
              break;
            case 'REVENUE':
              dispatch(receiveRevenue(result.data), getState);
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

export function fetchRequests(appId, startDate, endDate) {
  return fetchData(appId, startDate, endDate, 'REQUESTS', 'fb_ad_network_request', 'COUNT');
}

export function fetchFilledRequests(appId, startDate, endDate) {
  return fetchData(appId, startDate, endDate, 'FILLED_REQUESTS', 'fb_ad_network_request', 'SUM');
}

export function fetchImpressions(appId, startDate, endDate) {
  return fetchData(appId, startDate, endDate, 'IMPRESSIONS', 'fb_ad_network_imp', 'COUNT');
}

export function fetchClicks(appId, startDate, endDate) {
  return fetchData(appId, startDate, endDate, 'CLICKS', 'fb_ad_network_click', 'COUNT');
}

export function fetchRevenue(appId, startDate, endDate) {
  return fetchData(appId, startDate, endDate, 'REVENUE', 'fb_ad_network_revenue', 'SUM');
}
