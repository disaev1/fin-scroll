import _ from 'lodash';

import React, { FormEvent, useState, useEffect, useMemo } from 'react';

import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';

import Difference from '~/components/Difference';

import { getCurrencySymbol } from '~/utils/helpers';

import { BeforeAfter } from '../index.d';
import classNames from 'classnames';

interface StateItemProps {
  item: BeforeAfter;
  categorized: boolean;
  fixed: boolean;
  onChange?: (item: BeforeAfter) => void;
  onDelete?: () => void;
  onRestore?: () => void;
}

const StateItem = (props: StateItemProps): JSX.Element => {
  const { item, categorized, fixed, onChange, onDelete, onRestore } = props;

  const [currentItem, setCurrentItem] = useState(item);
  const getDifference = () => _.get(item, 'after', 0) - _.get(item, 'before', 0);

  const handleFieldChange = (e: FormEvent, fieldName: string): void => {
    if (!fieldName) {
      return;
    }

    let newValue: string | number = (e.target as HTMLSelectElement | HTMLInputElement).value;

    if (['before', 'after'].includes(fieldName)) {
      newValue = Number(newValue);
    }

    const newItem = { ...currentItem, [fieldName]: newValue };

    setCurrentItem(newItem);
  };

  useEffect(() => {
    onChange(currentItem);
  }, [currentItem]);

  const nameClasses = classNames({ td: true, pa2: true, pl4: categorized });

  return (
    <div className="tr">
      <div className={nameClasses}>
        <FormControl
          placeholder="Название"
          defaultValue={item.name}
          plaintext={!item.isNew || fixed}
          required
          onChange={e => handleFieldChange(e, 'name')}
        />
      </div>
      <div className="td pa2 txt-ar">{'before' in item ? `${item.before} ${getCurrencySymbol(item.currency)}`: '-'}</div>
      <div className="td pa2 txt-ar"><Difference value={getDifference()} currency={'RUB'} /></div>
      <div className="td pa2">
        {'after' in item
        ? <div className="flex items-center justify-end">
            <div className="mr1">
              {fixed
              ? <div className="td pa2 txt-ar">{'after' in item ? `${item.after} ${getCurrencySymbol(item.currency)}`: '-'}</div>
              : <FormControl
                  placeholder="Сумма"
                  type="numeric"
                  plaintext={fixed}
                  defaultValue={item.after}
                  required
                  onChange={e => handleFieldChange(e, 'after')}
                />
              }
            </div>
            {!fixed && <div>{getCurrencySymbol(item.currency)}</div>}
            {/* <Form.Select
              defaultValue={item.currency}
              disabled={!item.isNew}
              onChange={e => handleFieldChange(e, 'currency')}
              required
            >
              <option value="RUB">₽</option>
              <option value="USD">$</option>
              <option value="EUR">€</option>
            </Form.Select> */}
          </div>
        : 'удалено'
        }
      </div>
      {!fixed &&
        <div className="td pa2">
          {'after' in item
            ? <div className="pointer" key="delete" onClick={onDelete}>
              <i className="fas fa-times" />
            </div>
            : <div className="pointer" key="restore" onClick={onRestore}>
              <i className="fas fa-undo" />
            </div>
          }
        </div>
      }
    </div>
  );
};

const noop = function() {
  // do nothing
}

StateItem.defaultProps = {
  onChange: noop,
  onDelete: noop,
  onRestore: noop,
  categorized: false,
  fixed: false,
};

export default StateItem;
