import * as facebook from '../utils/facebook';

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

function fetchData(appId, startDate, endDate, dataType, name, aggregation) {
  return function dp(dispatch) {
    return facebook.audienceNetwork(
      appId, name, aggregation, null, startDate, endDate,
      (error, result) => {
        if (error) {
          console.log('Error insights:', error);
        } else {
          console.log('Success insights:', result);
          switch (dataType) {
            case 'REQUESTS':
              return dispatch(receiveRequests(result.data));
            case 'FILLED_REQUESTS':
              return dispatch(receiveFilledRequests(result.data));
            case 'IMPRESSIONS':
              return dispatch(receiveImpressions(result.data));
            case 'CLICKS':
              return dispatch(receiveClicks(result.data));
            case 'REVENUE':
              return dispatch(receiveRevenue(result.data));
            default:
              return null;
          }
        }
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
