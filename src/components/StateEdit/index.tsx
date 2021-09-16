import _ from 'lodash';
import { Map } from 'immutable';

import React, { useState, useEffect, useCallback, useRef, FormEvent } from 'react';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import Difference from '~/components/Difference';

import { generateId, getCurrencySymbol } from '~/utils/helpers';
import { defaultCurrency } from '~/utils/constants';

import { Spending } from '../Spendings.d';
import { BeforeAfter } from './index.d';
import { getTotalOperations } from '~/components/Spendings.utils';

import StateItem from './elements/StateItem';

interface StateEditProps {
  before: Spending[];
  after: Spending[];
  fixed: boolean;
  onChange?: (value: { before: Spending[], after: Spending[] }) => void;
}

interface BeforeAfterCategory {
  category: string;
  items: BeforeAfter[];
  id: string;
  isNew?: boolean;
}

const StateEdit = ({ before, after, fixed, onChange }: StateEditProps): JSX.Element => {
  const [currentData, setCurrentData] =
    useState<Map<string, BeforeAfterCategory[] | BeforeAfter[]>>(Map({ categorized: [], uncategorized: [] }));

  useEffect(() => {
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
            targetItem = { name: item.name, category: item.category, id: generateId(), currency: item.currency };
            targetCategory.items.push(targetItem);
          }
    
          targetItem[type] = item.value;
        } else {
          let targetItem = uncategorized.find(uncategorizedItem => uncategorizedItem.name === item.name);

          if (!targetItem) {
            targetItem = { name: item.name, id: generateId(), currency: item.currency };
            uncategorized.push(targetItem);
          }
    
          targetItem[type] = item.value;
        }
      });
    }

    processState(before, 'before');
    processState(after, 'after');

    setCurrentData(Map({ categorized, uncategorized }));
  }, [before, after]);
  
  const handleCategoryAdd = () => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];

    if (categorized.find(item => !item.category)) {
      return;
    }

    setCurrentData(
      currentData.set(
        'categorized',
        [{ category: '', isNew: true, items: [], id: generateId() }, ...categorized],
      ),
    );
  };


  const handleUncategorizedItemAdd = () => {
    const uncategorized = currentData.get('uncategorized') as BeforeAfter[];

    if (uncategorized.find(item => !item.name)) {
      return;
    }

    setCurrentData(
      currentData.set(
        'uncategorized',
        [...uncategorized, { id: generateId(), name: '', after: 0, currency: defaultCurrency, isNew: true }],
      ),
    );
  };


  const handleItemChange = (newItem: BeforeAfter) => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];
    const uncategorized = currentData.get('uncategorized') as BeforeAfter[];

    if (newItem.category) {
      const targetCategoryIndex = categorized.findIndex(item => item.category === newItem.category);
      const targetCategoryItems = categorized[targetCategoryIndex].items;
      const targetItemIndex = targetCategoryItems.findIndex(item => item.id === newItem.id);

      setCurrentData(
        currentData.setIn(['categorized', targetCategoryIndex, 'items', targetItemIndex], newItem),
      );
    } else {
      const targetIndex = uncategorized.findIndex(item => item.id === newItem.id);

      setCurrentData(currentData.setIn(['uncategorized', targetIndex], newItem));
    }
  };
  

  const handleCategoryNameChange = (categoryData: BeforeAfterCategory, e: FormEvent) => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];

    const newValue = (e.target as HTMLInputElement).value;
    const targetCategoryIndex = categorized.findIndex(item => item.id === categoryData.id);
    const targetCategory = categorized[targetCategoryIndex];

    setCurrentData(
      currentData.setIn(
        ['categorized', targetCategoryIndex],
        {
          ...targetCategory,
          category: newValue,
          items: targetCategory.items.map(item => ({ ...item, category: newValue }))
        }
      ),
    );
  };

  const handleCategorizedItemAdd = (category: string) => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];

    const targetCategoryIndex = categorized.findIndex(item => category === item.category);
    const targetCategoryItems = categorized[targetCategoryIndex].items;

    if (~targetCategoryIndex) {
      setCurrentData(
        currentData.setIn(
          ['categorized', targetCategoryIndex, 'items'],
          targetCategoryItems.concat(
            [{ name: '', before: 0, after: 0, currency: defaultCurrency, category, id: generateId(), isNew: true }],
          ),
        )
      );
    }
  }

  const handleItemDelete = (stateItem: BeforeAfter) => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];
    const uncategorized = currentData.get('uncategorized') as BeforeAfter[];
    
    if (stateItem.category) {
      const targetCategoryIndex = categorized.findIndex(item => item.category === stateItem.category);
      const targetCategoryItems = categorized[targetCategoryIndex].items;

      const newTargetCategoryItems = stateItem.isNew
        ? targetCategoryItems.filter(item => item.id !== stateItem.id)
        : targetCategoryItems.map(item => {
          if (item.id === stateItem.id) {
            return _.omit(stateItem, 'after');
          }

          return item;
        });

      setCurrentData(
        currentData.setIn(
          ['categorized', targetCategoryIndex, 'items'],
          newTargetCategoryItems,
        ),
      );
    } else {
      const newUncategorized = stateItem.isNew
        ? uncategorized.filter(item => item.id !== stateItem.id)
        : uncategorized.map(item => {
          if (item.id === stateItem.id) {
            return _.omit(stateItem, 'after');
          }
          
          return item;
        });

      setCurrentData(currentData.set('uncategorized', newUncategorized));
    }
  };

  const handleItemRestore = (stateItem: BeforeAfter) => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];
    const uncategorized = currentData.get('uncategorized') as BeforeAfter[];
    
    if (stateItem.category) {
      const targetCategoryIndex = categorized.findIndex(item => stateItem.category === item.category);
      const targetCategory = categorized[targetCategoryIndex];
      
      const newTargetCategoryItems = targetCategory.items.map(item => {
        if (item.id === stateItem.id) {
          return { ...item, after: item.before };
        }

        return item;
      });

      setCurrentData(
        currentData.setIn(
          ['categorized', targetCategoryIndex, 'items'],
          newTargetCategoryItems,
        )
      );
    } else {
      const targetItemIndex = uncategorized.findIndex(item => item.id === stateItem.id);
      const targetItem = uncategorized[targetItemIndex];

      setCurrentData(currentData.setIn(['uncategorized', targetItemIndex, 'after'], targetItem.before));
    }
  }

  const getCurrentState = (): { before: Spending[], after: Spending[] } => {
    const categorized = currentData.get('categorized') as BeforeAfterCategory[];
    const uncategorized = currentData.get('uncategorized') as BeforeAfter[];
    const result: { before: Spending[], after: Spending[] } = { before: [], after: [] };

    const itemReducer = (item: BeforeAfter) => {
      const auxFields = ['before', 'after', 'id', 'isNew'];

      if ('before' in item) {
        result.before.push({ ...(_.omit(item, auxFields) as Spending), value: item.before });
      }

      if ('after' in item) {
        result.after.push({ ...(_.omit(item, auxFields) as Spending), value: item.after });
      }
    }

    categorized.forEach(categoryData => {
      categoryData.items.forEach(itemReducer);
    });

    uncategorized.forEach(itemReducer);

    return result;
  };

  useEffect(() => {
    onChange(getCurrentState());
  }, [currentData]);

  const currentState = getCurrentState();
  const totalBefore = _.get(getTotalOperations(currentState.before), '0.value', 0);
  const totalAfter = _.get(getTotalOperations(currentState.after), '0.value', 0);
  const stateDelta = totalAfter - totalBefore;

  return (
    <div className="as-table w-100">
      <div className="tr b">
        <div className="td pa2 txt-ar"></div>
        <div className="td pa2 txt-ar">До</div>
        <div className="td pa2 txt-ar">Изменение</div>
        <div className="td pa2 txt-ar">После</div>
      </div>
      {!fixed && <div className="tr mb-2">
        <Button size="sm" variant="primary" className="mr2" onClick={handleCategoryAdd}>Добавить категорию</Button>
      </div>}
      {(currentData.get('categorized') as BeforeAfterCategory[]).map(categoryData =>
        <>
          <div className="tr">
            <FormControl
              placeholder="Название"
              plaintext={fixed || !categoryData.isNew}
              defaultValue={categoryData.category}
              required
              onChange={e => handleCategoryNameChange(categoryData, e)}
            />
          </div>
          {!fixed && <div className="tr pl4">
            <Button size="sm" variant="primary" onClick={() => handleCategorizedItemAdd(categoryData.category)}>
              Добавить элемент
            </Button>
          </div>}
          {categoryData.items.map(item =>
            <StateItem
              item={item}
              key={item.id}
              fixed={fixed}
              categorized
              onChange={handleItemChange}
              onDelete={() => handleItemDelete(item)}
              onRestore={() => handleItemRestore(item)}
            />
          )}
        </>
      )}
      {(currentData.get('uncategorized') as BeforeAfter[]).map(item =>
        <StateItem
          item={item}
          key={item.id}
          fixed={fixed}
          onChange={handleItemChange}
          onDelete={() => handleItemDelete(item)}
          onRestore={() => handleItemRestore(item)}
        />
      )}
      {!fixed && <div className="tr">
        <Button size="sm" variant="primary" onClick={handleUncategorizedItemAdd}>Добавить элемент</Button>
      </div>}
      <div className="tr">
        <div className="td pa2 b">Всего</div>
        <div className="td pa2 text-end">{totalBefore} {getCurrencySymbol('RUB')}</div>
        <div className="td pa2 text-end"><Difference value={stateDelta} currency={'RUB'} /></div>
        <div className="td pa2 text-end">{totalAfter} {getCurrencySymbol('RUB')}</div>
      </div>
    </div>
  );
};

StateEdit.defaultProps = {
  fixed: false,
};

export default StateEdit;
