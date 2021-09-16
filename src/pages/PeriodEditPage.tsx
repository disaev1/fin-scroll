import moment from 'moment';

import React, { useState, useCallback, useMemo, ChangeEvent } from 'react';
import { useParams } from 'react-router-dom';

import Button from 'react-bootstrap/Button';

import { Period, PeriodPatch } from './PeriodsPage.d';
import { Spending } from '~/components/Spendings.d';
import { Entity } from '~/types.d';

import SIEdit from '~/components/SIEdit';
import SIDifference from '~/components/SIDifference';
import StateEdit from '~/components/StateEdit';
import StateBarChart from '~/components/StateBarChart';

import { noop } from '../utils/constants';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

import './PeriodEditPage.scss';
import PeriodsApi from '~/PeriodsApi';

interface PeriodEditPageParams {
  id: string;
}

interface PeriodEditPageProps {
  periods: Period[];
  initialFixed?: boolean;
  onSave?: () => void;
}

const PeriodEditPage = ({ periods, initialFixed, onSave }: PeriodEditPageProps): JSX.Element => {
  const [spendings, setSpendings] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [beforeDate, setBeforeDate] = useState('');
  const [afterDate, setAfterDate] = useState('');
  const [after, setAfter] = useState([]);
  const [fixed, setFixed] = useState<boolean>(initialFixed);
  const { id } = useParams<PeriodEditPageParams>();

  const period = useMemo(() => {
    const res = periods.find(item => item._id === id);

    return res;
  }, [periods, id]);

  const isLast = useMemo(() => {
    const lastPeriod = PeriodsApi.getLast(periods);

    return lastPeriod._id === id;
  }, [periods, id]);
  
  const handleSpendingsChange = (value: Spending[]) => {
    setSpendings(value);
  }

  const handleIncomesChange = useCallback((value: Spending[]) => {
    setIncomes(value);
  }, []);

  const handleStateChange = useCallback((value: { before: Spending[], after: Spending[] }) => {
    setAfter(value.after);
  }, []);

  const save = async () => {
    const newData: PeriodPatch = {
      spendings,
      incomes,
      after: { date: afterDate, items: after },
      previous: period.previous
    };

    if (beforeDate) {
      newData.before = { date: beforeDate, items: [] };
    }

    await PeriodsApi.save(newData, id, periods);

    onSave();
  }

  const handleBeforeDateChange = useCallback((e: ChangeEvent): void => {
    const newValue = (e.target as HTMLInputElement).value;

    setBeforeDate(newValue);
  }, []);

  const handleAfterDateChange = useCallback((e: ChangeEvent): void => {
    const newValue = (e.target as HTMLInputElement).value;
    
    setAfterDate(newValue);
  }, []);

  const getNextDayDate = (date: string) => moment.utc(date).add(1, 'days').format('YYYY-MM-DD');

  return (
    <>
      <Container>
        {period
        ? <>
            <Row className="mb-3">
              <Col>
                {fixed
                  ? <Button variant="primary" onClick={() => setFixed(false)}>Редактировать</Button>
                  : <Button variant="primary" onClick={save}>Сохранить</Button>}
                </Col>
            </Row>
            <Row className="mb-3">
              <Col>
                <FloatingLabel label="Начало периода">
                  <Form.Control
                    disabled={Boolean(period.previous)}
                    type="date"
                    defaultValue={period.before.date}
                    min={period.before.date}
                    onChange={handleBeforeDateChange}
                  />
                </FloatingLabel>
              </Col>
              <Col>
                <FloatingLabel label="Конец периода">
                  <Form.Control
                    disabled={fixed || !isLast}
                    type="date"
                    defaultValue={period.after.date}
                    min={getNextDayDate(period.before.date)}
                    onChange={handleAfterDateChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>
            <Row>
              <Col className="PeriodEditPage__spendings">
                <h3 className="tc mt-3 mb-2">Расходы</h3>
                <SIEdit
                  theme="danger"
                  fixed={fixed}
                  data={period.spendings}
                  onChange={handleSpendingsChange}
                  key="spendings"
                />
              </Col>
              <Col className="PeriodEditPage__incomes">
                <h3 className="tc mt-3 mb-2">Доходы</h3>
                <SIEdit
                  key="incomes"
                  theme="success"
                  fixed={fixed}
                  data={period.incomes}
                  onChange={handleIncomesChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs lg="3" />
              <Col className="PeriodEditPage__difference">
                <h3 className="tc mt-3 mb-2">Изменение</h3>
                <SIDifference spendings={spendings} incomes={incomes} />
              </Col>
              <Col xs lg="3" />
            </Row>
            <Row className="mb-3">
              <Col xs lg="2" />
              <Col>
                <h3 className="tc mt-2">Состояние</h3>
                <StateEdit
                  fixed={fixed}
                  before={period.before.items}
                  after={period.after.items}
                  onChange={handleStateChange}
                />
              </Col>
              <Col xs lg="2" />
            </Row>
            {fixed && <Row>
              <Col>
                <StateBarChart before={period.before.items as Entity[]} after={period.after.items as Entity[]} />
              </Col>
            </Row>}
          </>
        : null}
      </Container>
    </>
  );
}

PeriodEditPage.defaultProps = {
  initialFixed: true,
  onSave: noop,
};

export default PeriodEditPage;
