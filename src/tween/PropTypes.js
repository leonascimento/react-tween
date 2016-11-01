import React from 'react';
import { Animation } from './Animations';

const animation = React.PropTypes.instanceOf(Animation);

const transitionAnimation = React.PropTypes.shape({
  key: React.PropTypes.string,
  animation,
  data: React.PropTypes.any,
});

const style = React.PropTypes.object;

const transitionStyle = React.PropTypes.shape({
  key: React.PropTypes.string,
  style,
  data: React.PropTypes.any,
});

export default {
  animation,
  transitionAnimation,
  style,
  transitionStyle,
};
