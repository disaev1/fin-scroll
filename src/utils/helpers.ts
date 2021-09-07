import _ from 'lodash';

const generateId = (): string => {
  return Math.random().toString(16).slice(2, 18);
}

const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'RUB':
      return '₽';
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    default:
      return currency;
  }
}

export { generateId, getCurrencySymbol };
