import _ from 'lodash';
import React, { useCallback, useState, useEffect, FormEvent } from 'react';
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import { List } from 'immutable';

import './Spendings.scss';

import { Spending } from './Spendings.d'
import { generateId } from '../utils/helpers';

interface SpendingCategory {
  id?: string;
  category: string;
  items: Spending[];
}

interface SpendingsProps {
  data: Spending[];
  onChange?: (value: Spending[]) => void;
}

const sampleSpendings: Spending[] = [
  {
    name: 'Продукты',
    value: 5000,
  },
  {
    name: 'Одежда и обувь',
    value: 2500,
  },
  {
    category: 'Развлечения',
    name: 'Фитнес-клуб',
    value: 14000,
  },
  {
    category: 'Развлечения',
    name: 'Кино',
    value: 250,
  },
  {
    name: 'Курс английского языка',
    value: 500,
    currency: 'USD',
  }
];

const Spendings = ({ data, onChange }: SpendingsProps): JSX.Element => {
  data = sampleSpendings;

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

    const rawUncategorized = _.filter(data, item => !item.category);

    setCategorizedSpengings(List(rawCategorized));
    setUncategorizedSpengings(List(rawUncategorized));
  }, [data]);

  const getCurrentSpendings = useCallback(() => {
    const flattenedCategorized = categorizedSpendings.reduce((acc: Spending[], categoryData: SpendingCategory) => {
      acc = acc.concat(categoryData.items);

      return acc;
    }, []);

    return [...flattenedCategorized, ...uncategorizedSpendings.toArray()];
  }, [categorizedSpendings, uncategorizedSpendings]);

  useEffect(() => {
    console.log('categorizedSpendings change:', categorizedSpendings);
    onChange(getCurrentSpendings());
  }, [categorizedSpendings, getCurrentSpendings, onChange]);

  useEffect(() => {
    console.log('uncategorizedSpendings change:', uncategorizedSpendings);
    onChange(getCurrentSpendings());
  }, [uncategorizedSpendings, getCurrentSpendings, onChange]);

  const handleSpendingFieldChange = (spending: Spending, field: string, e: FormEvent): void => {
    console.log('handleSpendingFieldChange', { spending, field, e });
    const newValue = (e.target as HTMLSelectElement | HTMLInputElement).value;


    if (spending.category) {
      const targetCategoryIndex = categorizedSpendings.findIndex(item => item.category === spending.category);

      setCategorizedSpengings(
        categorizedSpendings.set(
          targetCategoryIndex,
          { 
            ...categorizedSpendings.get(targetCategoryIndex),
            items: categorizedSpendings.get(targetCategoryIndex).items.map(item => {
              if (item.id === spending.id) {
                return { ...spending, [field]: newValue }
              }

              return item;
            })
          },
        ),
      );
    } else {
      const targetIndex = uncategorizedSpendings.findIndex(item => item.category === spending.category && item.name === spending.name);
      console.log('targetIndex is', targetIndex);
      setUncategorizedSpengings(uncategorizedSpendings.set(targetIndex, { ...spending, [field]: newValue }));
    }

    
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('handleSubmit', e);
  }
  
  const handleCategoryAdd = () => {
    setCategorizedSpengings(categorizedSpendings.unshift({ category: '', items: [], id: generateId() }));
  }

  const handleCategorizedItemAdd = (category: string) => {
    console.log('handleCategorizedItemAdd', { category });
    const targetCategoryIndex = categorizedSpendings.findIndex(item => category === item.category);
    console.log('targetCategoryIndex', targetCategoryIndex);

    if (~targetCategoryIndex) {
      console.log('new cat spendings', categorizedSpendings.set(
          targetCategoryIndex,
          {
            category,
            items: categorizedSpendings.get(targetCategoryIndex).items.concat({ name: '', value: 0, category, id: generateId() }),
          },
        )
      );
      setCategorizedSpengings(
        categorizedSpendings.set(
          targetCategoryIndex,
          {
            category,
            items: categorizedSpendings.get(targetCategoryIndex).items.concat({ name: '', value: 0, category, id: generateId()  }),
          },
        )
      );
    }
  }

  const handleUncategorizedItemAdd = (): void => {
    setUncategorizedSpengings(uncategorizedSpendings.push({ name: '', id: generateId(), value: 0 }));
  }

  const handleSpendingDelete = (spending: Spending) => {
    if (spending.category) {
      const targetCategoryIndex = categorizedSpendings.findIndex(item => item.category === spending.category);
      console.log('handleSpendingDelete', { spending, targetCategoryIndex });

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

  const handleCategoryNameChange = (categoryData: SpendingCategory, e: FormEvent<HTMLInputElement>) => {
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
    <div>
      <Button variant="primary" className="mr2" onClick={handleCategoryAdd}>Добавить категорию</Button>
      <Button variant="primary" onClick={handleUncategorizedItemAdd}>Добавить расход</Button>
      <Form onSubmit={handleSubmit}>
        {categorizedSpendings.map(item =>
          <div key={item.id}>
            <FormControl placeholder="Категория" defaultValue={item.category} onChange={e => handleCategoryNameChange(item, e)} />
            <div className="Spendings__categorizedSpendings">
              <div className="pa2">
                <Button variant="primary" onClick={() => handleCategorizedItemAdd(item.category)}>Добавить расход</Button>
              </div>
              {item.items.map(spending => 
                <div className="tr" key={spending.id}>
                  <div className="td pa2">
                    <FormControl placeholder="Название" defaultValue={spending.name} required onChange={e => handleSpendingFieldChange(spending, 'name', e)} />
                  </div>
                  <div className="td pa2">
                    <FormControl placeholder="Сумма" type="numeric" defaultValue={spending.value} required onChange={e => handleSpendingFieldChange(spending, 'value', e)} />
                  </div>
                  <div className="td pa2">
                    <Form.Select defaultValue={spending.currency || 'RUB'} onChange={e => handleSpendingFieldChange(spending, 'currency', e)} required>
                      <option value="RUB">₽</option>
                      <option value="USD">$</option>
                      <option value="EUR">€</option>
                    </Form.Select>
                  </div>
                  <div className="td pa2">
                    <div className="pointer" onClick={() => handleSpendingDelete(spending)} >
                      <i className="fas fa-times" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        {uncategorizedSpendings.map(spending =>
          <div className="tr" key={spending.id}>
            <div className="td pa2">
              <FormControl placeholder="Название" defaultValue={spending.name} required onChange={e => handleSpendingFieldChange(spending, 'name', e)} />
            </div>
            <div className="td pa2">
              <FormControl placeholder="Сумма" defaultValue={spending.value} required onChange={e => handleSpendingFieldChange(spending, 'value', e)} />
            </div>
            <div className="td pa2">
              <Form.Select defaultValue={spending.currency || 'RUB'} onChange={e => handleSpendingFieldChange(spending, 'currency', e)} required>
                <option value="RUB">₽</option>
                <option value="USD">$</option>
                <option value="EUR">€</option>
              </Form.Select>
            </div>
            <div className="td pa2">
              <div className="pointer" onClick={() => handleSpendingDelete(spending)} >
                <i className="fas fa-times" />
              </div>
            </div>
          </div>
        )}
        <Button type="submit" variant="danger">Угу</Button>
      </Form>
    </div>
  );
};

export default Spendings;
