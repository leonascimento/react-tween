import React from 'react';
import Animations from './Animations';
import AnimationTransitionGroup from './AnimationTransitionGroup';
import PropTypes from './PropTypes';

export default function TransitionGroup({
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
      <AnimationTransitionGroup
        animations={styles.map(style => ({
          key: style.key,
          animation: Animations.delay(delay, Animations.timing({
            toValue: style.style,
            duration,
            easing,
          })),
          data: style.data,
        }))}
        willEnter={willEnter}
        willLeave={style => Animations.delay(delay, Animations.timing({
          toValue: (willLeave ? willLeave(style) : {}),
          duration,
          easing,
        }))}
        {...props}
      >
        {children}
      </AnimationTransitionGroup>
    );
  }

  return (
    <AnimationTransitionGroup
      animations={animations}
      willEnter={willEnter}
      willLeave={willLeave}
      {...props}
    >
      {children}
    </AnimationTransitionGroup>
  );
}

TransitionGroup.propTypes = {
  animations: React.PropTypes.arrayOf(PropTypes.transitionAnimation),
  children: React.PropTypes.func,
  delay: React.PropTypes.number,
  duration: React.PropTypes.number,
  easing: React.PropTypes.func,
  styles: React.PropTypes.arrayOf(PropTypes.transitionStyle),
  willEnter: React.PropTypes.func,
  willLeave: React.PropTypes.func,
};

TransitionGroup.defaultProps = {
  delay: 0,
};
