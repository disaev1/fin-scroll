import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';
import Button from 'react-bootstrap/Button';

import './App.scss';

import Spendings from './components/Spendings';
import SpendingsEdit from './components/SpendingsEdit';

import { Spending } from './components/Spendings.d';

const App = (): JSX.Element => {
  const handleSpendingsChange = (value: Spending[]) => {
    console.log('handleSpendingChange', value);
  }

  const handleIncomesChange = (value: Spending[]) => {
    console.log('handleIncomesChange', value);
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/" exact>
            <Button variant="danger">Hello!</Button>
            <div className="flex w-100">
              <div className="w-50">
                <h2>Расходы</h2>
                <SpendingsEdit data={[]} onChange={handleSpendingsChange} key="spendings" />
              </div>
              <div className="w-50">
                <h2>Доходы</h2>
                <SpendingsEdit data={[]} onChange={handleIncomesChange} key="incomes" />
              </div>
            </div>
          </Route>
        </Switch>
      </Router>
    </div>
  ); 
};

export default App;
