import axios from 'axios';

import React, { useState, useEffect, useCallback, ChangeEvent } from 'react';

import Button from 'react-bootstrap/Button';

import { Period } from './PeriodsPage.d';
import { Spending } from '../components/Spendings.d';

import SpendingsEdit from '../components/SpendingsEdit';
import SIDifference from '../components/SIDifference';
import StateEdit from '../components/StateEdit';

import { apiRoot } from '../utils/constants';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

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
      <Container>
        <Row className="mb-3">
          <Col>
            <FloatingLabel label="Начало периода">
              <Form.Control type="date" defaultValue={period.before.date} onChange={handleBeforeDateChange} />
            </FloatingLabel>
          </Col>
          <Col>
            <FloatingLabel label="Конец периода">
              <Form.Control type="date" defaultValue={period.after.date} onChange={handleAfterDateChange} />
            </FloatingLabel>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Расходы</h2>
            <SpendingsEdit data={period.spendings} onChange={handleSpendingsChange} key="spendings" />
          </Col>
          <Col>
            <h2>Доходы</h2>
            <SpendingsEdit data={period.incomes} onChange={handleIncomesChange} key="incomes" />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h2>Изменение</h2>
            <SIDifference spendings={spendings} incomes={incomes} />
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <h2>Состояние</h2>
            <StateEdit before={period.before.items} after={period.after.items} onChange={handleStateChange} />
            <Button variant="primary" onClick={save}>Сохранить</Button>
          </Col>
        </Row>
        <Row>
          <Col>Test</Col><Col>Distinguish</Col><Col md={{ span: 2 }}>Cricket</Col>
        </Row>
        <Row>
          <Col>1</Col><Col>2</Col><Col>3</Col><Col>4</Col>
        </Row>
      </Container>
    </>
  );
}

export default PeriodEditPage;
