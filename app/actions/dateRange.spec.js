import * as actions from './dateRange';

describe('dateRange actions', () => {
  it('.setStartDate should create SET_START_DATE action', () => {
    expect(actions.setStartDate(new Date(2000, 1, 1))).toEqual({
      type: 'SET_START_DATE',
      date: new Date(2000, 1, 1),
    });
  });

  it('.setEndDate should create SET_END_DATE action', () => {
    expect(actions.setEndDate(new Date(2000, 1, 1))).toEqual({
      type: 'SET_END_DATE',
      date: new Date(2000, 1, 1),
    });
  });

  it('.setPreviousDateRange should create SET_PREVIOUS_DATE_RANGE action', () => {
    expect(actions.setPreviousDateRange()).toEqual({
      type: 'SET_PREVIOUS_DATE_RANGE',
    });
  });

  it('.setNextDateRange should create SET_NEXT_DATE_RANGE action', () => {
    expect(actions.setNextDateRange()).toEqual({
      type: 'SET_NEXT_DATE_RANGE',
    });
  });

  it('.setRangeType should create SET_RANGE_TYPE action', () => {
    expect(actions.setRangeType('DAYS')).toEqual({
      type: 'SET_RANGE_TYPE',
      rangeType: 'DAYS',
    });
  });

  it('.setRangeTypeOrder should create SET_RANGE_TYPE_ORDER action', () => {
    expect(actions.setRangeTypeOrder(10)).toEqual({
      type: 'SET_RANGE_TYPE_ORDER',
      rangeTypeOrder: 10,
    });
  });
});
