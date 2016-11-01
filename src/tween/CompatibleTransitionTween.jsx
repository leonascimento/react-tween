import React from 'react';
import Animations from './Animations';
import PropTypes from './PropTypes';
import TransitionTween from './TransitionTween';

export default function CompatibleTransitionTween({
  animations,
  children,
  delay,
  duration,
  easing,
  styles,
  willEnter,
  willLeave,
  ...props
}) {
  if (styles) {
    return (
      <TransitionTween
        animations={styles.map(style => ({
          key: style.key,
          animation: Animations.timing({
            toValue: style.style,
            delay,
            duration,
            easing,
          }),
          data: style.data,
        }))}
        willEnter={willEnter}
        willLeave={style => Animations.timing({
          toValue: (willLeave ? willLeave(style) : {}),
          delay,
          duration,
          easing,
        })}
        {...props}
      >
        {children}
      </TransitionTween>
    );
  }

  return (
    <TransitionTween
      animations={animations}
      willEnter={willEnter}
      willLeave={willLeave}
      {...props}
    >
      {children}
    </TransitionTween>
  );
}

CompatibleTransitionTween.propTypes = {
  animations: React.PropTypes.arrayOf(PropTypes.transitionAnimation),
  children: React.PropTypes.func,
  delay: React.PropTypes.number,
  duration: React.PropTypes.number,
  easing: React.PropTypes.func,
  styles: React.PropTypes.arrayOf(PropTypes.transitionStyle),
  willEnter: React.PropTypes.func,
  willLeave: React.PropTypes.func,
};
