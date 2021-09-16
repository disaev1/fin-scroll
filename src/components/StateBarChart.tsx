import _ from 'lodash';

import React from 'react';
import ReactECharts from 'echarts-for-react'

import { Entity } from '~/types.d';
import { getTotalOperations } from '~/components/Spendings.utils';

import './StateBarChart.scss';

interface StateBarChartProps {
  before: Entity[];
  after: Entity[];
}

interface ValueAndPercent {
  absoluteValue: number;
  value: number;
}

interface ChartSerie {
  name: string;
  type: 'bar';
  stack: string;
  data: ValueAndPercent[];
}

interface ChartDataItem {
  value: number;
  absoluteValue: number;
}

interface TooltipParams {
  color: string;
  seriesName: string;
  data: ChartDataItem;
}

const StateBarChart = ({ before, after }: StateBarChartProps): JSX.Element => {
  const totalBefore = getTotalOperations(before);
  const totalAfter = getTotalOperations(after);
  const chartSeries: ChartSerie[] = [];

  before.forEach(entity => {
    let targetSerie = chartSeries.find(serie => serie.name === entity.name);

    if (!targetSerie) {
      targetSerie = { name: entity.name, type: 'bar', stack: '1', data: [] };
      chartSeries.push(targetSerie);
    }

    targetSerie.data[0] = ({ absoluteValue: entity.value, value: entity.value / totalBefore[0].value * 100});
  });

  after.forEach(entity => {
    let targetSerie = chartSeries.find(serie => serie.name === entity.name);

    if (!targetSerie) {
      targetSerie = { name: entity.name, type: 'bar', stack: '1', data: [] };
      chartSeries.push(targetSerie);
    }

    targetSerie.data[1] = ({ absoluteValue: entity.value, value: entity.value / totalAfter[0].value * 100 });
  });

  chartSeries.forEach(serie => {
    [0, 1].forEach(i => {
      if (!serie.data[i]) {
        serie.data[i] = { absoluteValue: 0, value: 0};
      }
    });
  });

  const chartOptions = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: TooltipParams[]) => {
        return params.reduce((acc, param) => {
          acc.innerHTML += `<div class="StateBarChart__tooltipItem">
            <div class="td px-2">
              <div class="StateBarChart__tooltipCircle" style="background: ${param.color}"></div>
            </div>
            <div class="td px-2">${param.seriesName}</div>
            <div class="td px-2 txt-ar">${param.data.absoluteValue}
            <div class="td px-2">${_.round(param.data.value, 2)}%</div>
          </div>`;

          return acc;
        }, document.createElement('div'));
      },
    },
    xAxis: [
      {
        type: 'category',
        data: ['До', 'После'],
      },
    ],
    yAxis: {
      type: 'value',
    },
    series: chartSeries,
  };

  return (
    <div>
      <ReactECharts option={chartOptions} />
    </div>
  );
};

export default StateBarChart;
