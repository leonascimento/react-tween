import 'babel-polyfill';
import './example/global.scss';

import Example from './example/Example';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(<Example />, document.getElementById('content'));
