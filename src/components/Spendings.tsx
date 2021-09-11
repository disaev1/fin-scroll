import _ from 'lodash';
import React, { useMemo } from 'react';
import Accordion from 'react-bootstrap/Accordion';

import './Spendings.scss';

interface Spending {
  category?: string;
  name: string;
  value: number;
  currency?: string;
}

interface SpendingsProps {
  data: Spending[];
}

const getDisplayCurrency = (currency: string): string => {
  if (!currency) {
    return '₽';
  } else if (currency === 'USD') {
    return '$';
  } else if (currency === 'EUR') {
    return '€';
  }
};

const Spendings = ({ data }: SpendingsProps): JSX.Element => {
  const categorizedSpendings = useMemo(() => {
    const grouped = _.omit(_.groupBy(data, item => item.category || 'undefined'), 'undefined');
    return [..._.flatMap(grouped, (items, category) => ({ category, items }))];
  }, [data]);

  const uncategorizedSpendings = useMemo(() => _.filter(data, item => !item.category), [data]);

  return (
    <div>
      <h2>Расходы</h2>
      {categorizedSpendings.map(item =>
        <Accordion flush>
          <Accordion.Header>{item.category}</Accordion.Header>
          <Accordion.Body>
            <div className="Spendings__categorizedSpendings">
            {item.items.map(spending => 
              <div className="tr">
                <div className="td pa2">{spending.name}</div>
                <div className="td pa2">{spending.value}{getDisplayCurrency(spending.currency)}</div>
              </div>
            )}
            </div>
          </Accordion.Body>
        </Accordion>
      )}
      {uncategorizedSpendings.map(item =>
        <div className="tr">
          <div className="td pa2">{item.name}</div>
          <div className="td pa2">{item.value}{getDisplayCurrency(item.currency)}</div>
        </div>
      )}
    </div>
  );
};

export default Spendings;
