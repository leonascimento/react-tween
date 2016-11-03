import React from 'react';
import Animations from './Animations';
import AnimationTween from './AnimationTween';
import PropTypes from './PropTypes';

export default function Tween({
  animation,
  children,
  delay,
  duration,
  easing,
  style,
  ...props
}) {
  if (style) {
    return (
      <AnimationTween
        animation={Animations.timing({
          toValue: style,
          delay,
          duration,
          easing,
        })}
        {...props}
      >
        {children}
      </AnimationTween>
    );
  }

  return (
    <AnimationTween
      animation={animation}
      {...props}
    >
      {children}
    </AnimationTween>
  );
}

Tween.propTypes = {
  animation: PropTypes.animation,
  children: React.PropTypes.func,
  delay: React.PropTypes.number,
  duration: React.PropTypes.number,
  easing: React.PropTypes.func,
  style: PropTypes.style,
};
