import _ from 'lodash';

import { Entity } from '~/types.d';
import { currencies } from '../utils/constants';

const getTotalOperations = (operations: Entity[]): Entity[] => {
  const groupedByCurrency = _.groupBy(operations, 'currency');
  const result: Entity[] = [];

  currencies.map(currency => {
    if (groupedByCurrency[currency]) {
      result.push({ value: _.sumBy(groupedByCurrency[currency], 'value'), currency, name: 'total' });
    }
  });

  return result;
};

export { getTotalOperations };
