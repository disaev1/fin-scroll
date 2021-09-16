import _ from 'lodash';

import React, { useMemo } from 'react';

import Difference from '~/components/Difference';
import { Spending } from './Spendings.d';
import { getTotalOperations } from './Spendings.utils';
import { currencies } from '~/utils/constants';

interface SIDifferenceProps {
  spendings: Spending[];
  incomes: Spending[];
}

const SIDifference = ({ spendings, incomes }: SIDifferenceProps): JSX.Element => {
  const diffs = useMemo<Spending[]>(() => {
    const totalSpendings = getTotalOperations(spendings);
    const totalIncomes = getTotalOperations(incomes);
    const result: Spending[] = [];

    currencies.map(currency => {
      const targetIncome = totalIncomes.find(item => item.currency === currency);
      const targetSpending = totalSpendings.find(item => item.currency === currency);

      if (targetIncome || targetSpending) {
        result.push(
          { value: _.get(targetIncome, 'value', 0) - _.get(targetSpending, 'value', 0), currency, name: 'totalDiff' }
        );
      }
    });

    return result;
  }, [spendings, incomes]);
  

  return (
    <div>
      {diffs.map(item =>
        <div className="tr" key={item.currency}>
          <div className="td pa2"><Difference value={item.value} currency={item.currency} /></div>
        </div>
      )}
    </div>
  );
}

export default SIDifference;
