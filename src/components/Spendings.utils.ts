import _ from 'lodash';

import { Spending } from './Spendings.d';
import { currencies } from '../utils/constants';

const defaultCurrency = 'RUB';

const getTotalOperations = (operations: Spending[]): Spending[] => {
  const groupedByCurrency = _.groupBy(operations, 'currency');
  const result: Spending[] = [];

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
