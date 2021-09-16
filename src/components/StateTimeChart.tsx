import moment from 'moment';
import _ from 'lodash';

import React from 'react';
import ReactECharts from 'echarts-for-react';

import { Period } from '~/pages/PeriodsPage.d';
import { getTotalOperations } from '~/components/Spendings.utils';
import { defaultCurrency } from '~/utils/constants';
import { getCurrencySymbol } from '~/utils/helpers';

interface StateTimeChartProps {
  periods: Period[];
}

interface TooltipParams {
  data: [Date, number];
}

const StateTimeChart = ({ periods }: StateTimeChartProps): JSX.Element => {
  const data = periods.reduce((acc, period) => {
    const totalAfter = _.get(getTotalOperations(period.after.items), '0.value', 0);

    if (period.after.date) {
      acc.push([moment.utc(period.after.date).toDate(), totalAfter]);
    }

    return acc;
  }, []);
  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      formatter([item]: TooltipParams[]) {
        return `${moment.utc(item.data[0]).format('DD.MM.YYYY')}: ${item.data[1]} ${getCurrencySymbol(defaultCurrency)}`;
      },
    },
    xAxis: {
      type: 'time',
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: `{value} ${getCurrencySymbol(defaultCurrency)}`
      },
    },
    series: {
      name: 'Состояние',
      type: 'line',
      data,
    },
  };

  return (
    <div className="h-100">
      <ReactECharts className="h-100" option={chartOptions} />
    </div>
  );
};

export default StateTimeChart;
