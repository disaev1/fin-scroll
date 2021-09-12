import _ from 'lodash';
import { Map } from 'immutable';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';

import { generateId, getCurrencySymbol } from '~/utils/helpers';

import { Spending } from '../Spendings.d';
import { BeforeAfter } from './index.d';

import StateItem from './elements/StateItem';

const defaultCurrency = 'RUB';

interface StateEditProps {
  before: Spending[];
  after: Spending[];
  onChange?: (value: { before: Spending[], after: Spending[] }) => void;
}

interface BeforeAfterCategory {
  category: string;
  items: BeforeAfter[];
  id: string;
  isNew?: boolean;
}

const StateEdit = ({ before, after, onChange }: StateEditProps): JSX.Element => {
  const [tableData, setTableData] = useState<Map<string, BeforeAfter[] | BeforeAfterCategory[]>>(
    Map({ categorized: [], uncategorized: [] })
  );

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

    setTableData(Map({ categorized, uncategorized }));
  }, [before, after]);
  
  const handleCategoryAdd = () => {
    const categorized = tableData.get('categorized') as BeforeAfterCategory[];

    if (categorized.find(item => !item.category)) {
      return;
    }

    setTableData(tableData.set(
        'categorized',
        [
          { category: '', isNew: true, items: [], id: generateId() },
          ...(tableData.get('categorized') as BeforeAfterCategory[])
        ],
      ),
    );
  };


  const handleUncategorizedItemAdd = () => {
    const uncategorized = tableData.get('uncategorized') as BeforeAfter[];

    if (uncategorized.find(item => !item.name)) {
      return;
    }

    setTableData(tableData.set(
        'uncategorized',
        [
          ...(tableData.get('uncategorized') as BeforeAfter[]),
          { id: generateId(), name: '', after: 0, currency: defaultCurrency, isNew: true }
        ],
      ),
    );
  };


  const handleItemChange = (newItem: BeforeAfter) => {
    if (newItem.category) {
      const categorized = tableData.get('categorized') as BeforeAfterCategory[];
      const targetCategoryIndex = categorized.findIndex(item => item.category === newItem.category);
      const targetCategoryItems = categorized[targetCategoryIndex].items;
      const targetItemIndex = targetCategoryItems.findIndex(item => item.id === newItem.id);

      setTableData(
        tableData.setIn(
          ['categorized', targetCategoryIndex, 'items', targetItemIndex],
          newItem,
        ),
      );
    } else {
      const uncategorized = tableData.get('uncategorized') as BeforeAfter[];

      const targetIndex = uncategorized.findIndex(
        item => item.category === newItem.category && item.name === newItem.name
      );

      setTableData(
        tableData.setIn(['uncategorized', targetIndex], newItem),
      );
    }
  };
  

  const handleCategoryNameChange = (categoryData: BeforeAfterCategory, e: FormEvent) => {
    const newValue = (e.target as HTMLInputElement).value;
    const categorized = tableData.get('categorized') as BeforeAfterCategory[];
    const targetCategoryIndex = categorized.findIndex(item => item.id === categoryData.id);
    const targetCategory = categorized[targetCategoryIndex];

    setTableData(
      tableData.setIn(
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
    const categorized = tableData.get('categorized') as BeforeAfterCategory[];
    const targetCategoryIndex = categorized.findIndex(item => category === item.category);
    const targetCategory = categorized[targetCategoryIndex]; 

    if (~targetCategoryIndex) {
      setTableData(
        tableData.setIn(
          ['categorized', targetCategoryIndex],
          {
            ...targetCategory,
            items: targetCategory.items.concat(
              [{ name: '', before: 0, after: 0, currency: defaultCurrency, category, id: generateId(), isNew: true }]
            ),
          },
        ),
      );
    }
  }

  const handleItemDelete = (stateItem: BeforeAfter) => {
    if (stateItem.category) {
      const categorized = tableData.get('categorized') as BeforeAfterCategory[];
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

      setTableData(
        tableData.setIn(
          ['categorized', targetCategoryIndex, 'items'],
          newTargetCategoryItems,
        )
      );
    } else {
      const uncategorized = tableData.get('uncategorized') as BeforeAfter[];

      const newUncategorized = stateItem.isNew
        ? uncategorized.filter(item => item.id !== stateItem.id)
        : uncategorized.map(item => {
          if (item.id === stateItem.id) {
            return _.omit(stateItem, 'after');
          }
          
          return item;
        });

      setTableData(
        tableData.set(
          'uncategorized',
          newUncategorized,
        )
      )
    }
  };

  const handleItemRestore = (stateItem: BeforeAfter) => {
    if (stateItem.category) {
      const categorized = tableData.get('categorized') as BeforeAfterCategory[];
      const targetCategoryIndex = categorized.findIndex(item => stateItem.category === item.category);
      const targetCategory = categorized[targetCategoryIndex];
      const newTargetCategoryItems = targetCategory.items.map(item => ({ ...item, after: item.before }))

      setTableData(
        tableData.setIn(
          ['categorized', targetCategoryIndex, 'items'],
          newTargetCategoryItems,
        )
      );
    } else {
      const uncategorized = tableData.get('uncategorized') as BeforeAfter[];
      const targetItemIndex = uncategorized.findIndex(item => item.id === stateItem.id);
      const targetItem = uncategorized[targetItemIndex];

      setTableData(
        tableData.setIn(
          ['uncategorized', targetItemIndex],
          { ...targetItem, after: targetItem.before },
        ),
      );
    }
  }

  const getCurrentState = useCallback((): { before: Spending[], after: Spending[] } => {
    const result: { before: Spending[], after: Spending[] } = { before: [], after: [] };
    const categorized = tableData.get('categorized') as BeforeAfterCategory[];

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

    const uncategorized = tableData.get('uncategorized') as BeforeAfter[];

    uncategorized.forEach(itemReducer);

    return result;
  }, [tableData]);

  useEffect(() => {
    onChange(getCurrentState());
  }, [tableData, onChange, getCurrentState]);

  return (
    <div>
      <div className="tr">
        <div className="td pa2"></div>
        <div className="td pa2">До</div>
        <div className="td pa2">Изменение</div>
        <div className="td pa2">После</div>
      </div>
      <div className="tr mb-2">
        <Button variant="primary" className="mr2" onClick={handleCategoryAdd}>Добавить категорию</Button>
      </div>
      {(tableData.get('categorized') as BeforeAfterCategory[]).map(categoryData =>
        <>
          <div className="tr">
            {categoryData.isNew
            ? <FormControl
                placeholder="Название" 
                defaultValue={categoryData.category}
                required
                onChange={e => handleCategoryNameChange(categoryData, e)}
              />
            : categoryData.category}
          </div>
          <div className="tr pl4">
            <Button variant="primary" onClick={() => handleCategorizedItemAdd(categoryData.category)}>
              Добавить расход
            </Button>
          </div>
          {categoryData.items.map(item =>
            <StateItem
              item={item}
              categorized
              onChange={handleItemChange}
              onDelete={() => handleItemDelete(item)}
              onRestore={() => handleItemRestore(item)}
            />
          )}
          
        </>
      )}
      {(tableData.get('uncategorized') as BeforeAfter[]).map(item =>
        <StateItem
          item={item}
          onChange={handleItemChange}
          onDelete={() => handleItemDelete(item)}
          onRestore={() => handleItemRestore(item)}
        />
      )}
      <div className="tr">
        <Button variant="primary" onClick={handleUncategorizedItemAdd}>Добавить расход</Button>
      </div>
      <div className="tr">
        <div className="td pa2 b">Всего в {getCurrencySymbol(defaultCurrency)}</div>
        <div className="td pa2">10000</div>
        <div className="td pa2">5000</div>
        <div className="td pa2">15000</div>
      </div>
      
      
      
    </div>
  );
};

export default StateEdit;
