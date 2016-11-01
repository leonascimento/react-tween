import React from 'react';
import Animations from './Animations';
import PropTypes from './PropTypes';
import Tween from './Tween';

export default function CompatibleTween({
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
      <Tween
        animation={Animations.timing({
          toValue: style,
          delay,
          duration,
          easing,
        })}
        {...props}
      >
        {children}
      </Tween>
    );
  }

  return (
    <Tween
      animation={animation}
      {...props}
    >
      {children}
    </Tween>
  );
}

CompatibleTween.propTypes = {
  animation: PropTypes.animation,
  children: React.PropTypes.func,
  delay: React.PropTypes.number,
  duration: React.PropTypes.number,
  easing: React.PropTypes.func,
  style: PropTypes.style,
};
