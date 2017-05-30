import React from 'react';
import {
  Dimensions,
} from 'react-native';

import moment from 'moment';

import { StockLine } from 'react-native-pathjs-charts';

const window = Dimensions.get('window');

const LineChart = (props) => {
  const data = [props.data.map(item => ({
    x: moment(item.time),
    y: parseInt(item.value, 10) === item.value ? parseInt(item.value, 10) : parseFloat(item.value).toFixed(2),
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
