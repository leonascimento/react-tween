import React from 'react';
import AnimationTransitionGroup from './AnimationTransitionGroup';
import PropTypes from './PropTypes';

export default function AnimationTween({ animation, children, ...props }) {
  return (
    <AnimationTransitionGroup
      animations={[{
        key: '0',
        animation,
      }]}
      {...props}
    >
      {styles => children(styles[0].style)}
    </AnimationTransitionGroup>
  );
}

AnimationTween.propTypes = {
  animation: PropTypes.animation,
  children: React.PropTypes.func,
};
