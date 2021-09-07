import React, { useState } from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';
import Button from 'react-bootstrap/Button';

import './App.scss';

import Spendings from './components/Spendings';
import SpendingsEdit from './components/SpendingsEdit';
import SIDifference from './components/SIDifference';

import { Spending } from './components/Spendings.d';
import StateEdit from './components/StateEdit';

const App = (): JSX.Element => {
  const [spendings, setSpendings] = useState([]);
  const [incomes, setIncomes] = useState([]);

  const handleSpendingsChange = (value: Spending[]) => {
    setSpendings(value);
    console.log('handleSpendingChange', value);
  }

  const handleIncomesChange = (value: Spending[]) => {
    setIncomes(value);
    console.log('handleIncomesChange', value);
  }

  return (
    <div className="App">
      <Router>
        <Switch>
          <Route path="/">
            <div className="App__oneScreen">
              <div className="App__leftPanel">
                <div className="App__logo">Finance Scroll</div>
                <Link to="/periods">
                  <div className="flex items-center">
                    <i className="fas fa-list fa-sm fa-fw mr1"></i>
                    <div>Периоды</div>
                  </div>
                </Link>
                <Link to="/global-chart">
                  <div className="flex items-center">
                    <i className="fas fa-chart-line fa-sm fa-fw mr1"></i>
                    <div>График</div>
                  </div>
                </Link>
                <Link to="/settings">
                  <div className="flex items-center">
                    <i className="fas fa-cogs fa-sm fa-fw mr1"></i>
                    <div>Настройки</div>
                  </div>
                </Link>
              </div>
              <div className="App__content">
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
                <div className="flex items-center flex-column">
                  <h2>Изменение</h2>
                  <SIDifference spendings={spendings} incomes={incomes} />
                  <h2>Состояние</h2>
                  <StateEdit before={[]} after={[]} />
                </div>
              </div>
            </div>
            
          </Route>
        </Switch>
      </Router>
    </div>
  ); 
};

export default App;
