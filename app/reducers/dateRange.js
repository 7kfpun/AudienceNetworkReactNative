import moment from 'moment-timezone';
import store from 'react-native-simple-store';

const initialDateRangeState = {
  startDate: new Date(moment().subtract(1, 'months')),
  endDate: new Date(),
  rangeType: 'days',
  rangeTypeOrder: 0,
};

function insight(state = initialDateRangeState, action) {
  let diff;
  switch (action.type) {
    case 'SET_START_DATE':
      return { ...state, startDate: action.date };

    case 'SET_END_DATE':
      return { ...state, endDate: action.date };

    case 'SET_PREVIOUS_DATE_RANGE':
      if (['days', 'weeks', 'months'].indexOf(state.rangeType) !== -1) {
        return {
          ...state,
          startDate: new Date(moment(state.startDate).subtract(1, state.rangeType)),
          endDate: new Date(moment(state.endDate).subtract(1, state.rangeType)),
        };
      }

      diff = moment(state.endDate).diff(moment(state.startDate), 'days');

      return {
        ...state,
        startDate: new Date(moment(state.startDate).subtract(diff, 'days')),
        endDate: new Date(moment(state.endDate).subtract(diff, 'days')),
      };

    case 'SET_NEXT_DATE_RANGE':
      if (['days', 'weeks', 'months'].indexOf(state.rangeType) !== -1) {
        return {
          ...state,
          startDate: new Date(moment(state.startDate).add(1, state.rangeType)),
          endDate: new Date(moment(state.endDate).add(1, state.rangeType)),
        };
      }

      diff = moment(state.endDate).diff(moment(state.startDate), 'days');

      return {
        ...state,
        startDate: new Date(moment(state.startDate).add(diff, 'days')),
        endDate: new Date(moment(state.endDate).add(diff, 'days')),
      };

    case 'SET_RANGE_TYPE':
      if (['days', 'weeks', 'months', 'custom'].includes(action.rangeType)) {
        store.save('RANGE_TYPE', action.rangeType);
        return {
          ...state,
          rangeType: action.rangeType,
        };
      }

      store.save('RANGE_TYPE', 'days');
      return {
        ...state,
        rangeType: 'days',
      };

    case 'SET_RANGE_TYPE_ORDER':
      store.save('RANGE_TYPE_ORDER', action.rangeTypeOrder);
      return {
        ...state,
        rangeTypeOrder: action.rangeTypeOrder,
      };

    default:
      return state;
  }
}

export default insight;
