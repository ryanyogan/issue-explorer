import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Navigation from './Navigation';
import Profile from '../components/Profile';
import Organization from '../components/Organization';

import * as routes from '../constants/routes';

import './style.css';

class App extends Component {
  state = {};
  render() {
    return (
      <Router>
        <div className="App">
          <Navigation />
          <div className="App-main">
            <Route
              exact
              path={routes.ORGANIZATION}
              component={() => (
                <div className="App-content_small-header">
                  <Organization organizationName="facebook" />
                </div>
              )}
            />
            <Route
              exact
              path={routes.PROFILE}
              component={() => (
                <div className="App-content_small-header">
                  <Profile />
                </div>
              )}
            />
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
