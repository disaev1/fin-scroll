import React, { FormEvent } from 'react';

import FormControl from 'react-bootstrap/FormControl';

import { Entity } from '~/types.d';
import { noop } from '~/utils/constants';
import { getCurrencySymbol } from '~/utils/helpers';

interface SIItemProps {
  data: Entity;
  fixed?: boolean;
  onChange?: (data: Entity) => void;
  onDelete?: () => void;
}

const SIItem = ({ data, fixed, onChange, onDelete }: SIItemProps): JSX.Element => {
  const handleFieldChange = (fieldName: string, e: FormEvent) => {
    let newValue: string | number = (e.target as HTMLInputElement).value;

    if (fieldName === 'value') {
      newValue = Number(newValue);
    }

    const newData: Entity = { ...data, [fieldName]: newValue };

    onChange(newData);
  };

  return (
    <div className="tr">
      <div className="td pa2">
        <FormControl
          placeholder="Название"
          plaintext={fixed}
          defaultValue={data.name}
          required
          onChange={e => handleFieldChange('name', e)}
        />
      </div>
      <div className="td pa2">
        <div className="flex item-center">
          <FormControl
            placeholder="Сумма"
            plaintext={fixed}
            type="numeric"
            className="text-end"
            defaultValue={data.value}
            required
            onChange={e => handleFieldChange('value', e)}
          />
          <div className="ms-2 flex items-center">{getCurrencySymbol(data.currency)}</div>
        </div>
      </div>
      {/* <div className="td pa2">{getCurrencySymbol(spending.currency)}
        <Form.Select defaultValue={spending.currency} onChange={e => handleSpendingFieldChange(spending, 'currency', e)} required>
          {currencies.map(currency => <option value={currency} key={currency}>{getCurrencySymbol(currency)}</option>)}
        </Form.Select>
      </div> */}
      {!fixed
        && <div className="td pa2">
          <div className="pointer" onClick={onDelete}>
            <i className="fas fa-times" />
          </div>
        </div>
      }
    </div>
  );
};

SIItem.defaultProps = {
  fixed: false,
  onChange: noop,
  onDelete: noop,
};

export default SIItem;
