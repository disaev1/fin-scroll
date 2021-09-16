import { Spending } from '../components/Spendings.d';

interface State {
  items: Spending[],
  date: string;
}

interface PeriodBase {
  spendings: Spending[],
  incomes: Spending[],
  after: State;
  previous: string;
}

interface PeriodBaseWithIds extends PeriodBase {
  _id: string;
}

interface PeriodPatch extends PeriodBase {
  before?: State,
}

interface Period extends PeriodBaseWithIds {
  before: State;
}

interface MongoPeriod extends PeriodBaseWithIds {
  before?: State;
}

export { Period, PeriodPatch, MongoPeriod };
