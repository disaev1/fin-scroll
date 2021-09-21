import moment from 'moment';
import _ from 'lodash';

import React from 'react';

import Accordion from 'react-bootstrap/Accordion';

import Difference from '~/components/Difference';
import { Period } from '../pages/PeriodsPage.d';
import { getTotalOperations } from './Spendings.utils';
import { Settings } from '~/types.d';

import './PeriodCard.scss';
import { getCurrencySymbol } from '~/utils/helpers';

interface PeriodProps {
  period: Period;
  index: number;
  settings: Settings;
  onEditButtonClick?: (period: Period) => void;
}

const formatDate = (dateStr: string) => {
  if (!dateStr) {
    return ''
  }

  return moment.utc(dateStr).format('DD.MM.YYYY');
};

const PeriodCard = ({ period, index, settings, onEditButtonClick }: PeriodProps): JSX.Element => {
  const handleEditButtonClick = () => {
    onEditButtonClick(period);
  }

  const totalBefore = _.get(getTotalOperations(period.before.items), '0.value', 0);
  const totalAfter = _.get(getTotalOperations(period.after.items), '0.value', 0);
  const totalSpendings = _.get(getTotalOperations(period.spendings), '0.value', 0);
  const totalIncomes = _.get(getTotalOperations(period.incomes), '0.value', 0);
  const sIDelta = totalIncomes - totalSpendings;
  const stateDelta = totalAfter - totalBefore;


  return (
    <Accordion.Item eventKey={`${index}`}>
      <Accordion.Header>
        <div className="flex items-center">
          {Math.abs(stateDelta - sIDelta) > settings.errorThreshold
            ? <i className="fas fa-exclamation-triangle text-warning me-2" />
            : <i className="fa-fw me-2" />
          }
          {period.before.date
            ? <div className="me-2">{formatDate(period.before.date)}</div>
            : <div className="text-danger me-2">?</div>
          }
          <div className="me-2"> - </div>
          {period.after.date
            ? <div>{formatDate(period.after.date)}</div>
            : <div className="text-danger">?</div>
          }
        </div>
      </Accordion.Header>
      <Accordion.Body>
        <div className="PeriodCard">
          <div className="PeriodCard__left">
            <div className="as-table">
              <div className="tr">

              </div>
            </div>
            <div>
              <div className="text-danger tr">
                <div className="td px-2">Расходы</div>
                <div className="td px-2 text-end">{totalSpendings} {getCurrencySymbol('RUB')}</div>
              </div>
              <div className="text-success tr">
                <div className="td px-2">Доходы</div>
                <div className="td px-2 text-end">{totalIncomes} {getCurrencySymbol('RUB')}</div>
              </div>
              <div className="tr">
                <div className="td px-2">Изменение</div>
                <div className="td px-2 text-end"><Difference value={sIDelta} currency={'RUB'} /></div>
              </div>
              {Math.abs(stateDelta - sIDelta) > settings.errorThreshold
                && <div className="flex items-center ps-2">
                  <i className="fas fa-exclamation-triangle fa-sm me-2 text-warning" />
                  <div>
                    <span>Изменение состояния не совпадает с разницей доходов и расходов (различие </span>
                    <Difference value={stateDelta - sIDelta} currency={'RUB'}/>
                    <span>). Возможно, не учтена какая-либо статья дохода/расхода.</span>
                  </div>
                </div>
              }
              <div className="PeriodCard__state">
                <div className="me-4 ps-2">Состояние</div>
                <div className="me-2">{totalBefore} {getCurrencySymbol('RUB')}</div>
                <div className="flex flex-column items-center me-2">
                  <div><Difference value={stateDelta} currency={'RUB'} /></div>
                  <i className="fas fa-long-arrow-alt-right fa-lg" />
                </div>
                <div className="me-2">{totalAfter} {getCurrencySymbol('RUB')}</div>
              </div>
            </div>
          </div>
          <div className="PeriodCard__ellipsis" onClick={handleEditButtonClick}>
            <i className="fas fa-ellipsis-h fa-lg" />
          </div>
        </div>
        
      </Accordion.Body>
    </Accordion.Item>
  );
}

export default PeriodCard;
