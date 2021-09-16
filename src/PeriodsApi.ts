import axios from 'axios'
import _ from 'lodash';
import moment from 'moment';

import { apiRoot } from '~/utils/constants';
import { MongoPeriod, Period, PeriodPatch } from '~/pages/PeriodsPage.d';

const getNextDayDate = (date: string): string => {
  return moment.utc(date).add(1, 'days').format('YYYY-MM-DD');
};

const getPeriodsFromMongoPeriods = (mongoPeriods: MongoPeriod[]): Period[] => {
  return mongoPeriods.map(mongoPeriod => getPeriodFromMongoPeriod(mongoPeriod, mongoPeriods)) as Period[];
};

const getPeriodFromMongoPeriod = (mongoPeriod: MongoPeriod, mongoPeriods: MongoPeriod[]): Period => {
  if (mongoPeriod.previous) {
    const previousPeriod = mongoPeriods.find(item => item._id === mongoPeriod.previous);

    if (previousPeriod) {
      return { ...mongoPeriod, before: { ...previousPeriod.after, date: getNextDayDate(previousPeriod.after.date) } } as Period;
    }
  }

  return mongoPeriod as Period;
}

class PeriodsApi {
  async getPeriods(): Promise<Period[]> {
    const { data } = await axios.get(`${apiRoot}/periods`);

    const unsorted = getPeriodsFromMongoPeriods(data);
    
    return _.sortBy(unsorted, (period) => String(period.after.date || '0')).reverse();
  }

  async save(periodPatch: PeriodPatch, _id: string, periods: Period[]): Promise<Period> {
    const { data } = await axios.patch(`${apiRoot}/periods/${_id}`, periodPatch);

    return getPeriodFromMongoPeriod(data as MongoPeriod, periods);
  }

  async add(periods: Period[]): Promise<Period> {
    const lastPeriod = this.getLast(periods);

    const newPeriod: PeriodPatch = {
      spendings: [],
      incomes: [],
      after: { items: [], date: '' },
      ...(lastPeriod ? { previous: lastPeriod._id } : { previous: null, before: { items: [], date: '' } }),
    };

    const { data } = await axios.post(`${apiRoot}/periods`, newPeriod);

    return getPeriodFromMongoPeriod(data as MongoPeriod, periods);
  }

  getFirst(periods: Period[]): Period {
    return periods.find(period => !period.previous);
  }

  getLast(periods: Period[]): Period {
    const prevs = periods.map(period => period.previous);

    return periods.find(period => !prevs.includes(period._id));
  }
}

export default new PeriodsApi();
