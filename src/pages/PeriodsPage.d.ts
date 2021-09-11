import { Spending } from '../components/Spendings.d';

interface State {
  items: Spending[],
  date: string;
}

interface Period {
  spendings: Spending[],
  incomes: Spending[],
  before: State,
  after: State,
  previous: string;
  _id: string;
}

export { Period };
