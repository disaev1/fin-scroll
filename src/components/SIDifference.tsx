import _ from 'lodash';

import React, { useMemo } from 'react';

import Difference from '~/components/Difference';
import { Entity } from '~/types.d';
import { getTotalOperations } from './Spendings.utils';
import { currencies } from '~/utils/constants';

interface SIDifferenceProps {
  spendings: Entity[];
  incomes: Entity[];
}

const SIDifference = ({ spendings, incomes }: SIDifferenceProps): JSX.Element => {
  const diffs = useMemo<Entity[]>(() => {
    const totalSpendings = getTotalOperations(spendings);
    const totalIncomes = getTotalOperations(incomes);
    const result: Entity[] = [];

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
