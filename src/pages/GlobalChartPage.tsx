import React from 'react';

import StateTimeChart from '~/components/StateTimeChart';

import { Period } from '~/pages/PeriodsPage.d';

interface GlobalChartProps {
  periods: Period[];
}

const GlobalChartPage = ({ periods }: GlobalChartProps): JSX.Element => {
  return (
    <div className="h-100">
      <h3>Изменение состояния</h3>
      <StateTimeChart periods={periods} />
    </div>
  );
};

export default GlobalChartPage;
