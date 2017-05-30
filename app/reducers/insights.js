const initialInsightState = {
  setAppID: null,
  isLoading: false,

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

Array.prototype.sum = function sum(prop) {
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

function auth(state = initialInsightState, action) {
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
    default:
      return state;
  }
}

export default auth;
