import axios from 'axios';

import React, { useState, useEffect } from 'react';

import { apiRoot } from '../utils/constants';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import { Period } from './PeriodsPage.d';
import PeriodCard from '../components/PeriodCard';

interface PeriodPageProps {
  onPeriodEdit: (period: Period) => void;
}

const PeriodsPage = ({ onPeriodEdit }: PeriodPageProps): JSX.Element => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  const getPeriods = async () => {
    const { data } = await axios.get('http://localhost:4000/periods');
    
    setPeriods(data);
    setLoaded(true);
  };

  useEffect(() => {
    getPeriods();
  }, []);

  const handleAddFirstPeriod = async () => {
    const { data } = await axios.post(`${apiRoot}/periods`, {
      spendings: [], incomes: [], after: { items: [], date: '' }
    });
    const firstPeriod: Period = data as Period;

    onPeriodEdit(firstPeriod);
  };

  const handleAddPeriod = async () => {
    const { data } = await axios.post(`${apiRoot}/periods`, {
      spendings: [], incomes: [], after: { items: [], date: '' }
    });
    console.log('handleAddPeriod', data);

    onPeriodEdit(data as Period);
  }

  return (
    <div className="Periods">
      <h2 className="tc mb3">Периоды</h2>
      {loaded
      ? <>
          <div className="mb2">
            {!periods.length
            ? <Button variant="success" onClick={handleAddFirstPeriod}>Добавить первый период</Button>
            : <Button variant="success" onClick={handleAddPeriod}>Добавить период</Button>
            }
          </div>
          <Accordion>
            {periods.map((period, index) => <PeriodCard period={period} index={index} />)}
          </Accordion>
        </>
      : null}
    </div>
  );
};

export default PeriodsPage;
