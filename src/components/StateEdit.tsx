import React from 'react';
import { generateId, getCurrencySymbol } from '../utils/helpers';

import { Spending } from './Spendings.d';

declare namespace CONFIG {
  defaultCurrency: string;
}

interface StateEditProps {
  before: Spending[];
  after: Spending[];
}

interface BeforeAfter {
  name: string;
  category?: string;
  id: string;
  before?: Spending;
  after?: Spending;
}

interface BeforeAfterCategory {
  category: string;
  items: BeforeAfter[];
  id: string;
}

const StateEdit = ({ before, after }: StateEditProps): JSX.Element => {
  const categorized: BeforeAfterCategory[]  = [];
  const uncategorized: BeforeAfter[] = [];

  const processState = (state: Spending[], type: 'before' | 'after'): void => {
    state.forEach(item => {
      if (item.category) {
        let targetCategory = categorized.find(catItem => catItem.category === item.category);
  
        if (!targetCategory) {
          targetCategory = { category: item.category, items: [], id: generateId() };
          categorized.push(targetCategory);
        }
  
        let targetItem = targetCategory.items.find(itemInCategory => itemInCategory.name === item.name);
  
        if (!targetItem) {
          targetItem = { name: item.name, category: item.category, id: generateId() };
          targetCategory.items.push(targetItem);
        }
  
        targetItem[type] = item;
      } else {
        let targetItem = uncategorized.find(uncategorizedItem => uncategorizedItem.name === item.name);

        if (!targetItem) {
          targetItem = { name: item.name, id: generateId() };
        }
  
        targetItem[type] = item;
      }
    });
  }

  processState(before, 'before');
  processState(after, 'after');

  return (
    <div>
      <div className="tr">
        <div className="td pa2"></div>
        <div className="td pa2">До</div>
        <div className="td pa2">Изменение</div>
        <div className="td pa2">После</div>
      </div>
      <div className="tr">Свободные деньги</div>
      <div className="tr">
        <div className="td pa2 pl3">Сбер</div>
        <div className="td pa2">100</div>
        <div className="td pa2">100</div>
        <div className="td pa2">200</div>
      </div>
      <div className="tr">
        <div className="td pa2">Тинькофф</div>
        <div className="td pa2">10000</div>
        <div className="td pa2">5000</div>
        <div className="td pa2">15000</div>
      </div>
      <div className="tr">
        <div className="td pa2 b">Всего в {getCurrencySymbol(CONFIG.defaultCurrency)}</div>
        <div className="td pa2">10000</div>
        <div className="td pa2">5000</div>
        <div className="td pa2">15000</div>
      </div>
    </div>
  );
};

export default StateEdit;
