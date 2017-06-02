import moment from 'moment-timezone';

moment.tz.setDefault('America/Los_Angeles');

const dateRangeOptions = {
  days: [{
    id: 0,
    name: 'Today',
    // startDate: new Date(moment().subtract(1, 'days')),
    startDate: new Date(moment()),
    endDate: new Date(moment()),
  }, {
    id: 1,
    name: 'Yesterday',
    // startDate: new Date(moment().subtract(2, 'days')),
    startDate: new Date(moment().subtract(1, 'days')),
    endDate: new Date(moment().subtract(1, 'days')),
  }],
  weeks: [{
    id: 0,
    name: 'Last 7 days',
    startDate: new Date(moment().subtract(7, 'days')),
    endDate: new Date(moment().subtract(1, 'days')),
  }, {
    id: 1,
    name: 'This week',
    startDate: new Date(moment().startOf('week')),
    endDate: new Date(moment().endOf('week')),
  }, {
    id: 2,
    name: 'Last week',
    startDate: new Date(moment().startOf('week').subtract(7, 'days')),
    endDate: new Date(moment().endOf('week').subtract(7, 'days')),
  }],
  months: [{
    id: 0,
    name: 'Last 30 days',
    startDate: new Date(moment().subtract(30, 'days')),
    endDate: new Date(moment().subtract(1, 'days')),
    display: `${moment().subtract(30, 'days').format('DD MMMM')} - ${moment().subtract(1, 'days').format('DD MMMM')}`,
  }, {
    id: 1,
    name: 'This month',
    startDate: new Date(moment().startOf('month')),
    endDate: new Date(moment().endOf('month')),
    display: moment().startOf('month').format('MMMM'),
  }, {
    id: 2,
    name: 'Last month',
    startDate: new Date(moment().subtract(1, 'months').startOf('month')),
    endDate: new Date(moment().subtract(1, 'months').endOf('month')),
    display: moment().startOf('month').subtract(1, 'months').format('MMMM'),
  }],
};

export default dateRangeOptions;
