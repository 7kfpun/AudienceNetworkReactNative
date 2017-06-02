import store from 'react-native-simple-store';

import dateRangeOptions from '../utils/dateRangeOptions';

export const setStartDate = date => ({
  type: 'SET_START_DATE',
  date,
});

export const setEndDate = date => ({
  type: 'SET_END_DATE',
  date,
});

export const setPreviousDateRange = () => ({
  type: 'SET_PREVIOUS_DATE_RANGE',
});

export const setNextDateRange = () => ({
  type: 'SET_NEXT_DATE_RANGE',
});

export const setRangeType = rangeType => ({
  type: 'SET_RANGE_TYPE',
  rangeType,
});

export const setRangeTypeOrder = rangeTypeOrder => ({
  type: 'SET_RANGE_TYPE_ORDER',
  rangeTypeOrder,
});

export function fetchRangeType() {
  return function dp(dispatch) {
    return store.get('RANGE_TYPE')
      .then((rangeType) => {
        dispatch(setRangeType(rangeType || 'days'));
      })
      .catch(err => console.log(err));
  };
}

export function fetchRangeTypeOrder() {
  return function dp(dispatch) {
    return store.get('RANGE_TYPE_ORDER')
      .then((rangeTypeOrder) => {
        dispatch(setRangeTypeOrder(rangeTypeOrder || 0));
      })
      .catch(err => console.log(err));
  };
}

export function fetchDateRange() {
  return function dp(dispatch) {
    return store.get('RANGE_TYPE')
      .then((rangeType) => {
        dispatch(setRangeType(rangeType || 0));
        if (['days', 'weeks', 'months'].indexOf(rangeType) !== -1) {
          store.get('RANGE_TYPE_ORDER')
            .then((rangeTypeOrder) => {
              dispatch(setRangeTypeOrder(rangeTypeOrder || 0));
              if (dateRangeOptions[rangeType] && dateRangeOptions[rangeType][rangeTypeOrder].startDate && dateRangeOptions[rangeType][rangeTypeOrder].endDate) {
                dispatch(setStartDate(dateRangeOptions[rangeType][parseInt(rangeTypeOrder, 10)].startDate));
                dispatch(setEndDate(dateRangeOptions[rangeType][parseInt(rangeTypeOrder, 10)].endDate));
              }
            })
            .catch(err => console.log(err));
        }
      })
      .catch(err => console.log(err));
  };
}
