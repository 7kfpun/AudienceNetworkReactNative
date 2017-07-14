import moment from 'moment-timezone';

moment.tz.setDefault('America/Los_Angeles');

const dateRangeOptions = {
  days: [{
    id: 0,
    name: 'Today',
    startDate: new Date(moment()),
    endDate: new Date(moment()),
    startCompareDate: new Date(moment().subtract(1, 'days')),
    endCompareDate: new Date(moment().subtract(1, 'days')),
  }, {
    id: 1,
    name: 'Yesterday',
    startDate: new Date(moment().subtract(1, 'days')),
    endDate: new Date(moment().subtract(1, 'days')),
    startCompareDate: new Date(moment().subtract(2, 'days')),
    endCompareDate: new Date(moment().subtract(2, 'days')),
  }],
  weeks: [{
    id: 0,
    name: 'Last 7 days',
    startDate: new Date(moment().subtract(7, 'days')),
    endDate: new Date(moment().subtract(1, 'days')),
    startCompareDate: new Date(moment().subtract(7, 'days').subtract(1, 'weeks')),
    endCompareDate: new Date(moment().subtract(1, 'days').subtract(1, 'weeks')),
  }, {
    id: 1,
    name: 'This week',
    startDate: new Date(moment().startOf('week')),
    endDate: new Date(moment().endOf('week')),
    startCompareDate: new Date(moment().startOf('week').subtract(1, 'weeks')),
    endCompareDate: new Date(moment().endOf('week').subtract(1, 'weeks')),
  }, {
    id: 2,
    name: 'Last week',
    startDate: new Date(moment().startOf('week').subtract(1, 'weeks')),
    endDate: new Date(moment().endOf('week').subtract(1, 'weeks')),
    startCompareDate: new Date(moment().startOf('week').subtract(2, 'weeks')),
    endCompareDate: new Date(moment().endOf('week').subtract(2, 'weeks')),
  }],
  months: [{
    id: 0,
    name: 'Last 30 days',
    startDate: new Date(moment().subtract(30, 'days')),
    endDate: new Date(moment().subtract(1, 'days')),
    startCompareDate: new Date(moment().subtract(30, 'days').subtract(30, 'days')),
    endCompareDate: new Date(moment().subtract(1, 'days').subtract(30, 'days')),
    display: `${moment().subtract(30, 'days').format('DD MMMM')} - ${moment().subtract(1, 'days').format('DD MMMM')}`,
    compareDisplay: `${moment().subtract(60, 'days').format('DD MMMM')} - ${moment().subtract(31, 'days').format('DD MMMM')}`,
  }, {
    id: 1,
    name: 'This month',
    startDate: new Date(moment().startOf('month')),
    endDate: new Date(moment().endOf('month')),
    startCompareDate: new Date(moment().startOf('month').subtract(1, 'months')),
    endCompareDate: new Date(moment().endOf('month').subtract(1, 'months')),
    display: moment().startOf('month').format('MMMM'),
    compareDisplay: moment().subtract(1, 'months').startOf('month').format('MMMM'),
  }, {
    id: 2,
    name: 'Last month',
    startDate: new Date(moment().subtract(1, 'months').startOf('month')),
    endDate: new Date(moment().subtract(1, 'months').endOf('month')),
    startCompareDate: new Date(moment().subtract(2, 'months').startOf('month')),
    endCompareDate: new Date(moment().subtract(2, 'months').endOf('month')),
    display: moment().startOf('month').subtract(1, 'months').format('MMMM'),
    compareDisplay: moment().startOf('month').subtract(2, 'months').format('MMMM'),
  }],
};

export default dateRangeOptions;
