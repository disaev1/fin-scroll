import axios from 'axios';

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';

import Button from 'react-bootstrap/Button';

import { Period } from './PeriodsPage.d';
import { Spending } from '../components/Spendings.d';

import SpendingsEdit from '../components/SpendingsEdit';
import SIDifference from '../components/SIDifference';
import StateEdit from '../components/StateEdit';

import { getTotalOperations } from '../components/Spendings.utils';
import { apiRoot } from '../utils/constants';
import { Form } from 'react-bootstrap';

interface PeriodEditPageProps {
  period: Period;
}

const PeriodEditPage = ({ period }: PeriodEditPageProps): JSX.Element => {
  const [spendings, setSpendings] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [beforeDate, setBeforeDate] = useState('');
  const [afterDate, setAfterDate] = useState('');
  const [after, setAfter] = useState([]);

  useEffect(() => {
    console.log('period changed to', period);
    setBeforeDate(period.before.date);
    setAfterDate(period.after.date);
  }, [period]);

  const handleSpendingsChange = (value: Spending[]) => {
    console.log('handleSpendingsChange', value);
    setSpendings(value);
  }

  const handleIncomesChange = useCallback((value: Spending[]) => {
    console.log('handleIncomesChange', value);
    setIncomes(value);
  }, []);

  const handleStateChange = useCallback((value: { before: Spending[], after: Spending[] }) => {
    console.log('handleStateChange', value);

    setAfter(value.after);
  }, []);

  const save = async () => {
    const newData = { spendings, incomes, after: { date: afterDate, items: after } };
    console.log('newdata', newData);
    const { data } = await axios.patch(`${apiRoot}/periods/${period._id}`, newData);
    console.log('saved', data);
  }

  const handleBeforeDateChange = useCallback((e: ChangeEvent): void => {
    const newValue = (e.target as HTMLInputElement).value;

    setBeforeDate(newValue);
  }, []);

  const handleAfterDateChange = useCallback((e: ChangeEvent): void => {
    const newValue = (e.target as HTMLInputElement).value;
    
    setAfterDate(newValue);
  }, []);


  return (
    <>
      <div className="flex">
        <Form.Control type="date" defaultValue={period.before.date} onChange={handleBeforeDateChange} />
        <Form.Control type="date" defaultValue={period.after.date} onChange={handleAfterDateChange} />
      </div>
      <div className="flex w-100">
        <div className="w-50">
          <h2>Расходы</h2>
          <SpendingsEdit data={period.spendings} onChange={handleSpendingsChange} key="spendings" />
        </div>
        <div className="w-50">
          <h2>Доходы</h2>
          <SpendingsEdit data={period.incomes} onChange={handleIncomesChange} key="incomes" />
        </div>
      </div>
      <div className="flex items-center flex-column">
        <h2>Изменение</h2>
        <SIDifference spendings={spendings} incomes={incomes} />
        <h2>Состояние</h2>
        <StateEdit before={period.before.items} after={period.after.items} onChange={handleStateChange} />
        <Button variant="primary" onClick={save}>Сохранить</Button>
      </div>
    </>
  );
}

export default PeriodEditPage;
