import store from 'react-native-simple-store';

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

export const fetchInsights = id => ({
  type: 'FETCH_INSIGHTS',
  id,
});

export function fetchRangeType() {
  return function dp(dispatch) {
    return store.get('RANGE_TYPE')
      .then((rangeType) => {
        const tempRangeType = rangeType || 'days';
        dispatch(setRangeType(tempRangeType));
      })
      .catch(err => console.log(err));
  };
}
