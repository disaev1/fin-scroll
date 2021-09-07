import _ from 'lodash';

import { Spending } from './Spendings.d';
import { currencies } from '../utils/constants';

declare namespace CONFIG {
  defaultCurrency: string
}

const getTotalOperations = (operations: Spending[]): Spending[] => {
  const groupedByCurrency = _.groupBy(operations, 'currency');
  const result: Spending[] = [];
  const defaultCurrency = CONFIG.defaultCurrency;

  currencies.map(currency => {
    if (groupedByCurrency[currency] && currency !== defaultCurrency) {
      result.push({ value: _.sumBy(groupedByCurrency[currency], 'value'), currency, name: 'total' });
    } else if (currency === defaultCurrency && (groupedByCurrency[currency] || groupedByCurrency.undefined)) {
      result.push({
        value: _.sumBy([...(groupedByCurrency[currency] || []), ...(groupedByCurrency.undefined || [])], 'value'),
        currency,
        name: 'total',
      });
    }
  });

  return result;
};

export { getTotalOperations };
