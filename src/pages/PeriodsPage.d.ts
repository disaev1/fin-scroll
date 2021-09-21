import { Entity } from '~/types.d';

interface State {
  items: Entity[],
  date: string;
}

interface PeriodBase {
  spendings: Entity[],
  incomes: Entity[],
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
