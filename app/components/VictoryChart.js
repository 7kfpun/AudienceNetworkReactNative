import React from 'react';
import {
  Dimensions,
} from 'react-native';

import {
  VictoryArea,
  VictoryAxis,
  VictoryChart,
  VictoryTheme,
} from 'victory-native';

import moment from 'moment-timezone';

moment.tz.setDefault('America/Los_Angeles');

const window = Dimensions.get('window');

const LineChart = (props) => {
  const length = props.data.length;

  if (length < 2) {
    return null;
  }

  let endDate = moment(props.data[0].time);
  const startDate = moment(props.data[length - 1].time);

  const diffDays = endDate.diff(startDate, 'd', false);

  let data = [];

  if (diffDays + 1 !== length) {
    let i = 0;
    while (startDate <= endDate) {
      if (props.data[i] && moment(props.data[i].time).format('LL') === endDate.format('LL')) {
        data.push(props.data[i]);
        i += 1;
      } else {
        data.push({ time: endDate.format(), value: 0 });
      }

      endDate = endDate.subtract(1, 'd');
    }
  } else {
    data = [...props.data];
  }

  data = data.map(item => ({
    x: item.time,
    y: parseFloat(item.value),
  }));

  data.reverse();

  return (
    <VictoryChart
      width={window.width}
      theme={VictoryTheme.material}
      height={220}
      padding={{
        top: 10,
        bottom: 0,
        left: 45,
        right: 20,
      }}
    >
      <VictoryAxis
        dependentAxis
      />
      <VictoryArea
        style={{
          data: {
            fill: '#ECEFF1',
            stroke: '#252525',
            width: window.width / (data.length * 3),
          },
          padding: 0,
        }}
        data={data}
      />
    </VictoryChart>);
};

LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default LineChart;
