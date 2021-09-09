import axios from 'axios';

import React, { useState, useEffect } from 'react';

import Button from 'react-bootstrap/Button';

import { Period } from './PeriodsPage.d';

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

  const handleAddFirstPeriod = () => {
    const firstPeriod: Period = {
      spendings: [], incomes: [], before: { items: [], date: '' }, after: { items: [], date: '' }, previous: null
    };

    onPeriodEdit(firstPeriod);
  };

  return (
    <div className="Periods">
      {loaded
      ? <>
          {!periods.length
          ? <Button variant="success" onClick={handleAddFirstPeriod}>Добавить первый период</Button>
          : null
          }
        </>
      : null}
    </div>
  );
};

export default PeriodsPage;
