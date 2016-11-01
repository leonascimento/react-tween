import React from 'react';

const animation = React.PropTypes.shape({
  interpolateStyle: React.PropTypes.func,
});

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
