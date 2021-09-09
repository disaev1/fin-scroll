import React, { useState } from 'react';

import { Period } from './PeriodsPage.d';
import { Spending } from '../components/Spendings.d';

import SpendingsEdit from '../components/SpendingsEdit';
import SIDifference from '../components/SIDifference';
import StateEdit from '../components/StateEdit';

import { getTotalOperations } from '../components/Spendings.utils';

interface PeriodEditPageProps {
  period: Period;
}

const PeriodEditPage = ({ period }: PeriodEditPageProps): JSX.Element => {
  const [spendings, setSpendings] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const handleSpendingsChange = (value: Spending[]) => {
    setSpendings(value);
  }

  const handleIncomesChange = (value: Spending[]) => {
    setIncomes(value);
  }

  const handleStateChange = (value: { before: Spending[], after: Spending[] }) => {
    console.log('handleStateChange', value);
    console.log('total', { before: getTotalOperations(value.before), after: getTotalOperations(value.after) });
  }

  return (
    <>
      <div className="flex w-100">
        <div className="w-50">
          <h2>Расходы</h2>
          <SpendingsEdit data={period.spendings} onChange={handleSpendingsChange} key="spendings" />
        </div>
        <div className="w-50">
          <h2>Доходы</h2>
          <SpendingsEdit data={period.incomes} onChange={handleIncomesChange} key="incomes" />
        </div>
      </div>
      <div className="flex items-center flex-column">
        <h2>Изменение</h2>
        <SIDifference spendings={spendings} incomes={incomes} />
        <h2>Состояние</h2>
        <StateEdit before={period.before.items} after={period.after.items} onChange={handleStateChange} />
      </div>
    </>
  );
}

export default PeriodEditPage;
