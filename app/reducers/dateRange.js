import moment from 'moment-timezone';
import store from 'react-native-simple-store';

moment.tz.setDefault('America/Los_Angeles');

const initialDateRangeState = {
  rangeType: 'days',
  rangeTypeOrder: 0,
  isCompareTo: false,
};

function dateRange(state = initialDateRangeState, action) {
  let diff;
  switch (action.type) {
    case 'SET_START_DATE':
      store.save('START_DATE', action.date);
      return { ...state, startDate: action.date };

    case 'SET_END_DATE':
      store.save('END_DATE', action.date);
      return { ...state, endDate: action.date };

    case 'SET_PREVIOUS_DATE_RANGE':
      if (['days', 'weeks'].indexOf(state.rangeType) !== -1) {
        store.save('START_DATE', new Date(moment(state.startDate).subtract(1, state.rangeType)));
        store.save('END_DATE', new Date(moment(state.endDate).subtract(1, state.rangeType)));
        return {
          ...state,
          startDate: new Date(moment(state.startDate).subtract(1, state.rangeType)),
          endDate: new Date(moment(state.endDate).subtract(1, state.rangeType)),
        };
      }

      if (state.rangeType === 'months') {
        if (moment(state.startDate).days() === moment(state.startDate).startOf('month').days()
          && moment(state.endDate).days() === moment(state.endDate).endOf('month').days()) {
          store.save('START_DATE', new Date(moment(state.startDate).subtract(1, state.rangeType).startOf('month')));
          store.save('END_DATE', new Date(moment(state.endDate).subtract(1, state.rangeType).endOf('month')));
          return {
            ...state,
            startDate: new Date(moment(state.startDate).subtract(1, state.rangeType).startOf('month')),
            endDate: new Date(moment(state.endDate).subtract(1, state.rangeType).endOf('month')),
          };
        }
      }

      diff = moment(state.endDate).diff(moment(state.startDate), 'days');

      store.save('START_DATE', new Date(moment(state.startDate).subtract(diff + 1, 'days')));
      store.save('END_DATE', new Date(moment(state.endDate).subtract(diff + 1, 'days')));
      return {
        ...state,
        startDate: new Date(moment(state.startDate).subtract(diff + 1, 'days')),
        endDate: new Date(moment(state.endDate).subtract(diff + 1, 'days')),
      };

    case 'SET_NEXT_DATE_RANGE':
      if (['days', 'weeks'].indexOf(state.rangeType) !== -1) {
        store.save('START_DATE', new Date(moment(state.startDate).add(1, state.rangeType)));
        store.save('END_DATE', new Date(moment(state.endDate).add(1, state.rangeType)));
        return {
          ...state,
          startDate: new Date(moment(state.startDate).add(1, state.rangeType)),
          endDate: new Date(moment(state.endDate).add(1, state.rangeType)),
        };
      }

      if (state.rangeType === 'months') {
        if (moment(state.startDate).days() === moment(state.startDate).startOf('month').days()
          && moment(state.endDate).days() === moment(state.endDate).endOf('month').days()) {
          store.save('START_DATE', new Date(moment(state.startDate).add(1, state.rangeType).startOf('month')));
          store.save('END_DATE', new Date(moment(state.endDate).add(1, state.rangeType).endOf('month')));
          return {
            ...state,
            startDate: new Date(moment(state.startDate).add(1, state.rangeType).startOf('month')),
            endDate: new Date(moment(state.endDate).add(1, state.rangeType).endOf('month')),
          };
        }
      }

      diff = moment(state.endDate).diff(moment(state.startDate), 'days');

      store.save('START_DATE', new Date(moment(state.startDate).add(diff + 1, 'days')));
      store.save('END_DATE', new Date(moment(state.endDate).add(diff + 1, 'days')));
      return {
        ...state,
        startDate: new Date(moment(state.startDate).add(diff + 1, 'days')),
        endDate: new Date(moment(state.endDate).add(diff + 1, 'days')),
      };

    case 'SET_RANGE_TYPE':
      if (['days', 'weeks', 'months', 'custom'].includes(action.rangeType)) {
        store.save('RANGE_TYPE', action.rangeType);
        return { ...state, rangeType: action.rangeType };
      }

      store.save('RANGE_TYPE', 'days');
      return { ...state, rangeType: 'days' };

    case 'SET_RANGE_TYPE_ORDER':
      store.save('RANGE_TYPE_ORDER', action.rangeTypeOrder);
      return { ...state, rangeTypeOrder: action.rangeTypeOrder };

    case 'SET_IS_COMPARE_TO':
      store.save('IS_COMPARE_TO', action.isCompareTo);
      return { ...state, isCompareTo: action.isCompareTo };

    case 'SET_COMPARE_TO_START_DATE':
      store.save('COMPARE_TO_START_DATE', action.date);
      return { ...state, compareToStartDate: action.date };

    case 'SET_COMPARE_TO_END_DATE':
      store.save('COMPARE_TO_END_DATE', action.date);
      return { ...state, compareToEndDate: action.date };

    default:
      return state;
  }
}

export default dateRange;
