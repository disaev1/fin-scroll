const currencies = ['RUB', 'USD', 'EUR'];
const apiRoot = 'http://localhost:4000';
const defaultCurrency = 'RUB';
const errorThreshold = 100;

const noop = (): void => {
  // do nothing
};

export { currencies, apiRoot, defaultCurrency, errorThreshold, noop };
