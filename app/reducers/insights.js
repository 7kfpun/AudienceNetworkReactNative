import shortid from 'shortid';

const initialInsightState = {
  setAppID: null,
  isLoading: false,

  all: [],

  requests: [],
  filledRequests: [],
  impressions: [],
  clicks: [],
  revenue: [],

  requestsSum: 0,
  filledRequestsSum: 0,
  impressionsSum: 0,
  clicksSum: 0,
  revenueSum: 0,
};

Array.prototype.sum = function sum(prop) {  // eslint-disable-line no-extend-native
  let total = 0;
  for (let i = 0, len = this.length; i < len; i += 1) {
    if (parseInt(this[i][prop], 10) === this[i][prop]) {
      total += parseInt(this[i][prop], 10);
    } else {
      total += parseFloat(this[i][prop]);
    }
  }
  return total;
};

function insights(state = initialInsightState, action) {
  const data = [];
  let row;
  let filledRequestsCount = 0;
  let impressionsCount = 0;
  let clicksCount = 0;
  let revenueCount = 0;

  switch (action.type) {
    case 'SHOW_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'HIDE_LOADING':
      return { ...state, isLoading: action.isLoading };
    case 'RECEIVE_REQUESTS':
      return { ...state, requests: action.data.slice().reverse(), requestsSum: action.data.sum('value') };
    case 'RECEIVE_FILLED_REQUESTS':
      return { ...state, filledRequests: action.data.slice().reverse(), filledRequestsSum: action.data.sum('value') };
    case 'RECEIVE_IMPRESSIONS':
      return { ...state, impressions: action.data.slice().reverse(), impressionsSum: action.data.sum('value') };
    case 'RECEIVE_CLICKS':
      return { ...state, clicks: action.data.slice().reverse(), clicksSum: action.data.sum('value') };
    case 'RECEIVE_REVENUE':
      return { ...state, revenue: action.data.slice().reverse(), revenueSum: action.data.sum('value') };
    case 'RECEIVE_ALL_INSIGHTS':
      for (let i = 0; i < state.requests.length; i += 1) {
        row = {
          key: shortid.generate(),
          requests: state.requests[i],
        };
        if (state.filledRequests && state.filledRequests.length && state.filledRequests[filledRequestsCount] && state.filledRequests[filledRequestsCount].time === state.requests[i].time) {
          row.filledRequests = state.filledRequests[filledRequestsCount];
          filledRequestsCount += 1;
        }
        if (state.impressions && state.impressions.length && state.impressions[impressionsCount] && state.impressions[impressionsCount].time === state.requests[i].time) {
          row.impressions = state.impressions[impressionsCount];
          impressionsCount += 1;
        }
        if (state.clicks && state.clicks.length && state.clicks[clicksCount] && state.clicks[clicksCount].time === state.requests[i].time) {
          row.clicks = state.clicks[clicksCount];
          clicksCount += 1;
        }
        if (state.revenue && state.revenue.length && state.revenue[revenueCount] && state.revenue[revenueCount].time === state.requests[i].time) {
          row.revenue = state.revenue[revenueCount];
          revenueCount += 1;
        }
        data.push(row);
      }

      return { ...state, all: data };
    default:
      return state;
  }
}

export default insights;
