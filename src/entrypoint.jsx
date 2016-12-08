import 'babel-polyfill';
import { browserHistory as history, IndexRoute, Route, Router } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import './global.scss';
import Example from './Example';

ReactDOM.render(
  <Router history={history}>
    <Route path="/">
      <IndexRoute component={Example} />
    </Route>
  </Router>,
  document.getElementById('content')
);
