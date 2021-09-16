import React, { useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { noop } from '../utils/constants';

import Button from 'react-bootstrap/Button';
import Accordion from 'react-bootstrap/Accordion';

import { Period } from './PeriodsPage.d';
import PeriodCard from '../components/PeriodCard';
import PeriodsApi from '~/PeriodsApi';

interface PeriodsPageProps {
  periods: Period[];
  onPeriodAdd?: (period: Period) => void;
}

const PeriodsPage = ({ periods, onPeriodAdd }: PeriodsPageProps): JSX.Element => {
  const history = useHistory();

  const handleAddPeriod = async () => {
    const newPeriod: Period = await PeriodsApi.add(periods);

    onPeriodAdd(newPeriod);
  }

  const handlePeriodEdit = (period: Period): void => {
    history.push(`/periods/${period._id}`);
  };

  const unfinished = useMemo(() => {
    const lastPeriod = PeriodsApi.getLast(periods);

    if (!lastPeriod) {
      return '';
    }

    if (!lastPeriod.after.date) {
      return 'Задайте дату завершения последнего периода.'
    }

    return '';
  }, [periods]);

  return (
    <div className="Periods">
      <h2 className="tc mb3">Периоды</h2>
      <div className="mb2 flex items-center">
        <Button
          disabled={Boolean(unfinished)}
          className="me-2"
          variant="success"
          onClick={handleAddPeriod}
        >
          Добавить период
        </Button>
        {unfinished && <div>{unfinished}</div>}
      </div>
      <Accordion>
        {periods.map((period, index) =>
          <PeriodCard key={period._id} period={period} index={index} onEditButtonClick={handlePeriodEdit} />
        )}
      </Accordion>
    </div>
  );
};

PeriodsPage.defaultProps = {
  onPeriodAdd: noop,
};

export default PeriodsPage;
