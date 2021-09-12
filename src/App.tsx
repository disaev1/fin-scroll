import React, { useState } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

import './App.scss';

import PeriodsPage from './pages/PeriodsPage';
import PeriodEditPage from './pages/PeriodEditPage';

import { Period } from './pages/PeriodsPage.d';

const AppWrapper = (): JSX.Element => {
  return (
    <Router>
      <App />
    </Router>
  );
}

const App = (): JSX.Element => {
  const [editedPeriod, setEditedPeriod] = useState<Period>(null);
  const history = useHistory();
  console.log('history is', history);


  const handlePeriodEdit = (period: Period): void => {
    setEditedPeriod(period);
    history.push('/periods/one');
  };

  useEffect(() => {
    console.log('editedPeriod changed to', editedPeriod);
  }, [editedPeriod]);

  return (
    <div className="App">
        <div className="App__oneScreen">
          <div className="App__leftPanel">
            <div className="App__logo">Finance Scroll</div>
            <NavLink to="/periods" className="App__navLink" activeClassName="App__activeNavLink">
              <div className="flex items-center">
                <i className="fas fa-list fa-sm fa-fw mr1"></i>
                <div>Периоды</div>
              </div>
            </NavLink>
            <NavLink to="/global-chart" className="App__navLink"  activeClassName="App__activeNavLink">
              <div className="flex items-center">
                <i className="fas fa-chart-line fa-sm fa-fw mr1"></i>
                <div>График</div>
              </div>
            </NavLink>
            <NavLink to="/settings" className="App__navLink"  activeClassName="App__activeNavLink">
              <div className="flex items-center">
                <i className="fas fa-cogs fa-sm fa-fw mr1"></i>
                <div>Настройки</div>
              </div>
            </NavLink>
          </div>
          <div className="App__content">
            <Switch>
              <Route path="/periods/one" exact>
                <PeriodEditPage period={editedPeriod} />
              </Route>
              <Route path="/periods">
                <PeriodsPage onPeriodEdit={handlePeriodEdit} />
              </Route>
            </Switch>
          </div>
        </div>
    </div>
  ); 
};

export default AppWrapper;
