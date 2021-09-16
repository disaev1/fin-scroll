import _ from 'lodash';

import React, { useMemo, useState, useEffect, ChangeEvent } from 'react';

import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import { List } from 'immutable';

import { Spending } from '../Spendings.d';
import { Entity } from '~/types.d';
import { generateId, getCurrencySymbol } from '../../utils/helpers';
import { defaultCurrency } from '../../utils/constants';
import { getTotalOperations } from '../Spendings.utils';
import SIItem from './elements/SIItem';

import './index.scss';

interface SpendingCategory {
  id?: string;
  category: string;
  items: Spending[];
}

interface SIEditProps {
  data: Spending[];
  theme?: string;
  fixed?: boolean;
  onChange?: (value: Spending[]) => void;
}

const SIEdit = ({ data, fixed, onChange, theme }: SIEditProps): JSX.Element => {
  const [categorizedSpendings, setCategorizedSpengings] = useState<List<SpendingCategory>>(List([]));
  const [uncategorizedSpendings, setUncategorizedSpengings] = useState<List<Spending>>(List([]));


  useEffect(() => {
    const groupedByCategory = _.omit(_.groupBy(data, item => item.category || 'undefined'), 'undefined');
    
    const rawCategorized = [
      ..._.flatMap(
        groupedByCategory,
        (items, category) => ({
          id: generateId(),
          category,
          items: items.map(item => ({ ...item, id: generateId() })),
        }),
      )
    ];

    const rawUncategorized = _.map(_.filter(data, item => !item.category), item => ({ ...item, id: generateId() }));

    setCategorizedSpengings(List(rawCategorized));
    setUncategorizedSpengings(List(rawUncategorized));
  }, [data]);


  const currentSpendings = useMemo(() => {
    const flattenedCategorized = categorizedSpendings.reduce((acc: Spending[], categoryData: SpendingCategory) => {
      acc = acc.concat(categoryData.items.map(item => _.omit(item, 'id')));

      return acc;
    }, []);

    return [...flattenedCategorized, ...uncategorizedSpendings.toArray().map(item => _.omit(item, 'id'))];
  }, [categorizedSpendings, uncategorizedSpendings]);

  const totalSums = useMemo(() => {
    return getTotalOperations(currentSpendings);
  }, [currentSpendings]);

  useEffect(() => {
    onChange(currentSpendings);
  }, [categorizedSpendings, currentSpendings, onChange]);

  useEffect(() => {
    onChange(currentSpendings);
  }, [uncategorizedSpendings, currentSpendings, onChange]);

  const handleItemChange = (newItem: Spending): void => {
    if (newItem.category) {
      const targetCategoryIndex = categorizedSpendings.findIndex(item => item.category === newItem.category);

      setCategorizedSpengings(
        categorizedSpendings.set(
          targetCategoryIndex,
          { 
            ...categorizedSpendings.get(targetCategoryIndex),
            items: categorizedSpendings.get(targetCategoryIndex).items.map(item => {
              if (item.id === newItem.id) {
                return newItem;
              }

              return item;
            })
          },
        ),
      );
    } else {
      const targetIndex =
        uncategorizedSpendings.findIndex(item => item.category === newItem.category && item.name === newItem.name);

      setUncategorizedSpengings(uncategorizedSpendings.set(targetIndex, newItem));
    }
  };
  
  const handleCategoryAdd = () => {
    setCategorizedSpengings(categorizedSpendings.unshift({ category: '', items: [], id: generateId() }));
  }

  const handleCategorizedItemAdd = (category: string) => {
    const targetCategoryIndex = categorizedSpendings.findIndex(item => category === item.category);

    if (~targetCategoryIndex) {
      setCategorizedSpengings(
        categorizedSpendings.set(
          targetCategoryIndex,
          {
            category,
            items: categorizedSpendings.get(targetCategoryIndex).items.concat(
              { name: '', value: 0, category, id: generateId(), currency: defaultCurrency }
            ),
          },
        )
      );
    }
  }

  const handleUncategorizedItemAdd = (): void => {
    setUncategorizedSpengings(
      uncategorizedSpendings.push({ name: '', id: generateId(), value: 0, currency: defaultCurrency })
    );
  }

  const handleSpendingDelete = (spending: Spending) => {
    if (spending.category) {
      const targetCategoryIndex = categorizedSpendings.findIndex(item => item.category === spending.category);

      setCategorizedSpengings(
        categorizedSpendings.set(
          targetCategoryIndex,
          {
            ...categorizedSpendings.get(targetCategoryIndex),
            items: categorizedSpendings.get(targetCategoryIndex).items.filter(item => item.id !== spending.id)
          },
          
        )
      );
    } else {
      setUncategorizedSpengings(uncategorizedSpendings.filter(item => item.id !== spending.id));
    }
  };

  const handleCategoryNameChange = (categoryData: SpendingCategory, e: ChangeEvent) => {
    const newValue = (e.target as HTMLInputElement).value;
    const targetCategoryIndex = categorizedSpendings.findIndex(item => item.id === categoryData.id);

    setCategorizedSpengings(
      categorizedSpendings.set(
        targetCategoryIndex,
        {
          category: newValue,
          items: categorizedSpendings.get(targetCategoryIndex).items.map(item => ({ ...item, category: newValue }))
        },
        
      )
    );
  };

  return (
    <div className="flex flex-column">
      {!fixed
        && <div className="flex mb2">
          <Button variant={theme} size="sm" className="mr1" onClick={handleCategoryAdd}>Добавить категорию</Button>
          <Button variant={theme} size="sm" onClick={handleUncategorizedItemAdd}>Добавить элемент</Button>
        </div>
      }
      <div className="flex-auto">
        {categorizedSpendings.map(item =>
          <div key={item.id}>
            <FormControl
              placeholder="Категория"
              plaintext={fixed}
              defaultValue={item.category}
              onChange={e => handleCategoryNameChange(item, e)}
            />
            <div className="Spendings__categorizedSpendings">
              {!fixed
                && <div className="pa2">
                  <Button variant={theme} size="sm" onClick={() => handleCategorizedItemAdd(item.category)}>
                    Добавить элемент
                  </Button>
                </div>
              }
              {item.items.map(spending =>
                <SIItem
                  key={spending.id}
                  fixed={fixed}
                  data={spending as Entity}
                  onChange={handleItemChange}
                  onDelete={() => handleSpendingDelete(spending)}
                />
              )}
            </div>
          </div>
        )}
        {uncategorizedSpendings.map(spending =>
          <SIItem
            key={spending.id}
            fixed={fixed}
            data={spending as Entity}
            onChange={handleItemChange}
            onDelete={() => handleSpendingDelete(spending)}
          />
        )}
      </div>
      {totalSums.map((item, index) =>
        <div className="tr">
          <div className="td b pa2">{index === 0 ? 'Всего' : ''}</div>
          <div className="td pa2 text-end">{item.value} {getCurrencySymbol(item.currency)}</div>
        </div>
      )}
    </div>
  );
};

SIEdit.defaultProps = {
  theme: 'danger',
  fixed: false,
};

export default SIEdit;
