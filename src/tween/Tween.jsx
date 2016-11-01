import React from 'react';
import PropTypes from './PropTypes';
import TransitionTween from './TransitionTween';

export default function Tween({ animation, children, ...props }) {
  return (
    <TransitionTween
      animations={[{
        key: '0',
        animation,
      }]}
      {...props}
    >
      {styles => children(styles[0].style)}
    </TransitionTween>
  );
}

Tween.propTypes = {
  animation: PropTypes.animation,
  children: React.PropTypes.func,
};
