import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import './example/global.scss';
import Example from './example/Example';

ReactDOM.render(<Example />, document.getElementById('content'));
