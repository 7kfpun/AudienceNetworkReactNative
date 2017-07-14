import moment from 'moment-timezone';

moment.tz.setDefault('America/Los_Angeles');

export const getCompareToStartDate = (startDate, endDate, rangeType) => {
  let compareToStartDate;

  if (['days', 'weeks'].includes(rangeType)) {
    compareToStartDate = new Date(moment(startDate).subtract(1, rangeType));
  } else if (rangeType === 'months'
    && moment(startDate).days() === moment(startDate).startOf('month').days()
    && moment(endDate).days() === moment(endDate).startOf('month').days()
  ) {
    compareToStartDate = new Date(moment(startDate).subtract(1, rangeType).startOf('month'));
  } else {
    const diff = moment(endDate).diff(moment(startDate), 'days');
    compareToStartDate = new Date(moment(startDate).subtract(diff, 'days'));
  }

  console.log('compareToStartDate', rangeType, compareToStartDate);
  return compareToStartDate;
};

export const getCompareToEndDate = (startDate, endDate, rangeType) => {
  let compareToEndDate;

  if (['days', 'weeks'].includes(rangeType)) {
    compareToEndDate = new Date(moment(startDate).subtract(1, 'days'));
  } else if (rangeType === 'months'
    && moment(startDate).days() === moment(startDate).startOf('month').days()
    && moment(endDate).days() === moment(endDate).startOf('month').days()
  ) {
    compareToEndDate = new Date(moment(startDate).subtract(1, rangeType).endOf('month'));
  } else {
    compareToEndDate = new Date(moment(startDate).subtract(1, 'days'));
  }

  console.log('compareToEndDate', rangeType, compareToEndDate);
  return compareToEndDate;
};
