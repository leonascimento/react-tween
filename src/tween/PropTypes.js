import React from 'react';
import { Animation } from './Animations';

const animation = React.PropTypes.instanceOf(Animation);

const transitionAnimation = React.PropTypes.shape({
  key: React.PropTypes.string,
  animation,
  data: React.PropTypes.any,
});

export default { animation, transitionAnimation };
