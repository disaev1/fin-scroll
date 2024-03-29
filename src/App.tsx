import axios from 'axios';

import React, { useState, useCallback } from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route, NavLink, useHistory } from 'react-router-dom';
import '@fortawesome/fontawesome-free/js/all.js';

import './App.scss';

import PeriodsPage from './pages/PeriodsPage';
import PeriodEditPage from './pages/PeriodEditPage';
import PeriodsApi from '~/PeriodsApi';
import GlobalChartPage from '~/pages/GlobalChartPage';
import SettingsPage from '~/pages/SettingsPage';
import { apiRoot } from '~/utils/constants';

import { Period } from './pages/PeriodsPage.d';
import { Settings } from './types.d';

const AppWrapper = (): JSX.Element => {
  return (
    <Router>
      <App />
    </Router>
  );
}

const App = (): JSX.Element => {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [settings, setSettings] = useState<Settings>({ errorThreshold: 100 });
  const [loaded, setLoaded] = useState<boolean>(false);
  const [periodEditPageInitialFixed, setPeriodEditPageInitialFixed] = useState<boolean>(true);
  const history = useHistory();

  const getPeriods = useCallback(async () => {
    const { data } = await axios.get(`${apiRoot}/settings`);

    setSettings(data as Settings);

    const periods = await PeriodsApi.getPeriods();

    setPeriods(periods);
    setLoaded(true);
  }, []);

  useEffect(() => {
    getPeriods();
  }, [getPeriods]);

  const handlePeriodSaved = () => {
    setPeriodEditPageInitialFixed(true);
    setLoaded(false);
    getPeriods();
  };

  const handlePeriodAdd = async (period: Period) => {
    setLoaded(false);

    await getPeriods();

    setPeriodEditPageInitialFixed(false);
    history.push(`/periods/${period._id}`);
  };

  return (
    <div className="App">
      {loaded && <div className="App__oneScreen">
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
            <Route path="/global-chart" exact>
              <GlobalChartPage periods={periods} />
            </Route>
            <Route path="/settings" exact>
              <SettingsPage settings={settings} onSave={handlePeriodSaved} />
            </Route>
            <Route path="/periods/:id" exact>
              <PeriodEditPage
                periods={periods}
                settings={settings}
                initialFixed={periodEditPageInitialFixed}
                onSave={handlePeriodSaved}
              />
            </Route>
            <Route path="/periods">
              <PeriodsPage periods={periods} settings={settings} onPeriodAdd={handlePeriodAdd} />
            </Route>
          </Switch>
        </div>
      </div>}
    </div>
  ); 
};

export default AppWrapper;
