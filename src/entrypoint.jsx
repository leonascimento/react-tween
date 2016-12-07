import 'babel-polyfill';
import { browserHistory as history, IndexRoute, Route, Router } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import './global.scss';
import NestedTweenExample from './NestedTweenExample';
import TransitionGroupExample from './TransitionGroupExample';

ReactDOM.render(
  <Router history={history}>
    <Route path="/">
      <IndexRoute component={NestedTweenExample} />
      <Route path="transition-group" component={TransitionGroupExample} />
    </Route>
  </Router>,
  document.getElementById('content')
);
