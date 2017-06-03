import React from 'react';
import {
  Dimensions,
} from 'react-native';

import moment from 'moment-timezone';

import { StockLine } from 'react-native-pathjs-charts';

moment.tz.setDefault('America/Los_Angeles');

const window = Dimensions.get('window');

const LineChart = (props) => {
  const length = props.data.length;

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

  data = [data.map(item => ({
    x: moment(item.time),
    y: parseFloat(item.value),
  }))];

  const options = {
    width: window.width - 30,
    height: 150,
    color: '#00796B',
    margin: {
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
    animate: {
      type: 'delayed',
      duration: 200,
    },
    axisX: {
      showAxis: false,
      showLines: false,
      showLabels: false,
      showTicks: false,
      zeroAxis: false,
      orient: 'bottom',
      tickValues: [],
      label: {
        fontFamily: 'Arial',
        fontSize: 8,
        fontWeight: true,
        fill: '#34495E',
      },
    },
    axisY: {
      showAxis: false,
      showLines: false,
      showLabels: false,
      showTicks: false,
      zeroAxis: false,
      orient: 'left',
      tickValues: [],
      label: {
        fontFamily: 'Arial',
        fontSize: 8,
        fontWeight: true,
        fill: '#34495E',
      },
    },
  };

  return <StockLine data={data} options={options} xKey="x" yKey="y" />;
};

LineChart.propTypes = {
  data: React.PropTypes.array.isRequired,
};

export default LineChart;
