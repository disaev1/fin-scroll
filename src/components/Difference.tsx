import _ from 'lodash';

import React from 'react';
import classNames from 'classnames';

import { getCurrencySymbol } from '~/utils/helpers';

import './Difference.scss';

interface DifferenceProps {
  value: number;
  currency: string;
}


const Difference = ({ value, currency }: DifferenceProps): JSX.Element => {
  const classes = classNames(['Difference'], { Difference__positive: value >= 0, Difference__negative: value < 0 });

  const formattedValue = `${value >= 0 ? '+' : ''}${_.round(value, 2)}`

  return (<span className={classes}>{formattedValue} {getCurrencySymbol(currency)}</span>);
};

export default Difference;
