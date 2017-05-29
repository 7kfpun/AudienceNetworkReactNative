const initialInsightState = {
  isLoading: false,
  requests: [],
  revenueSum: 0,
  filledRequests: [],
  impressions: [],
  clicks: [],
  revenue: [],
};

Array.prototype.sum = function sum(prop) {
  let total = 0;
  for (let i = 0, _len = this.length; i < _len; i++) {
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
    case 'RECEIVE_REQUESTS':
      return { ...state, requests: action.data.reverse(), requestsSum: action.data.sum('value') };
    case 'RECEIVE_FILLED_REQUESTS':
      return { ...state, filledRequests: action.data.reverse(), filledRequestsSum: action.data.sum('value') };
    case 'RECEIVE_IMPRESSIONS':
      return { ...state, impressions: action.data.reverse(), impressionsSum: action.data.sum('value') };
    case 'RECEIVE_CLICKS':
      return { ...state, clicks: action.data.reverse(), clicksSum: action.data.sum('value') };
    case 'RECEIVE_REVENUE':
      return { ...state, revenue: action.data.reverse(), revenueSum: action.data.sum('value') };
    default:
      return state;
  }
}

export default auth;
