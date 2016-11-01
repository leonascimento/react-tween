import React from 'react';
import { timer } from 'd3-timer';
import Animations from './Animations';
import mergeDiff from './mergeDiff';
import PropTypes from './PropTypes';

export default class TransitionTween extends React.Component {
  static propTypes = {
    animations: React.PropTypes.arrayOf(PropTypes.transitionAnimation),
    children: React.PropTypes.func,
    willEnter: React.PropTypes.func,
    willLeave: React.PropTypes.func,
  };

  static defaultProps = {
    willEnter: style => style,
    willLeave: style => Animations.identity(style),
  };

  constructor(props) {
    super(props);

    const animations = props.animations.map(animation => ({
      key: animation.key,
      startStyle: animation.animation.endStyle,
      currentStyle: animation.animation.endStyle,
      animation: animation.animation,
      data: animation.data,
    }));

    this.state = { animations };

    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    // Animation is kicked off when props are received.
    // Multiple kickoffs halt and resume the animation from the current state.

    const extractAnimationsByKey = animations => animations.reduce((result, animation) => {
      result[animation.key] = animation; // eslint-disable-line no-param-reassign
      return result;
    }, {});

    const animationsByKey = extractAnimationsByKey(this.state.animations);
    const nextAnimationsByKey = extractAnimationsByKey(nextProps.animations);

    const keys = Object.keys(animationsByKey);
    const nextKeys = Object.keys(nextAnimationsByKey);
    const mergedKeys = mergeDiff(keys, nextKeys);

    const animations = mergedKeys.map((k) => {
      if (
        Object.prototype.hasOwnProperty.call(animationsByKey, k) &&
        Object.prototype.hasOwnProperty.call(nextAnimationsByKey, k)
      ) {
        // key is shared by current and next animations
        return {
          key: k,
          startStyle: animationsByKey[k].currentStyle,
          currentStyle: animationsByKey[k].currentStyle,
          animation: nextAnimationsByKey[k].animation,
          data: nextAnimationsByKey[k].data,
        };
      } else if (Object.prototype.hasOwnProperty.call(nextAnimationsByKey, k)) {
        // key is added
        const enterStyle = this.props.willEnter(nextAnimationsByKey[k].animation.endStyle);

        return {
          key: k,
          startStyle: enterStyle,
          currentStyle: enterStyle,
          animation: nextAnimationsByKey[k].animation,
          data: nextAnimationsByKey[k].data,
        };
      }

      // key is removed
      const leaveAnimation = this.props.willLeave(animationsByKey[k].currentStyle);

      return {
        key: k,
        startStyle: animationsByKey[k].currentStyle,
        currentStyle: animationsByKey[k].currentStyle,
        animation: leaveAnimation,
        data: animationsByKey[k].data,
        removed: true,
      };
    });

    this.setState({ animations });

    this.startTimer();
  }

  componentWillUnmount() {
    // Prevent the timer callback from updating an unmounted component.
    this.stopTimerIfStarted();
  }

  startTimer() {
    this.stopTimerIfStarted();
    this.timer = timer(elapsed => this.updateFromTimer(elapsed));
  }

  stopTimer() {
    this.timer.stop();
    this.timer = null;
  }

  stopTimerIfStarted() {
    if (this.timer) {
      this.stopTimer();
    }
  }

  updateFromTimer(elapsed) {
    const fullDuration = Math.max(...this.state.animations.map(animation => (
      animation.animation.duration
    )));
    if (elapsed > 0.99 * fullDuration) {
      const animations = this.state.animations
        .filter(animation => !animation.removed)
        .map(animation => ({
          ...animation,
          startStyle: animation.animation.endStyle,
          currentStyle: animation.animation.endStyle,
        }));

      this.setState({ animations });

      this.stopTimer();
      return;
    }

    const animations = this.state.animations.map(animation => ({
      ...animation,
      currentStyle: animation.animation.interpolateStyle(animation.startStyle, elapsed),
    }));

    this.setState({ animations });
  }

  render() {
    const {
      animations: animationsProp, // eslint-disable-line no-unused-vars
      children,
      willEnter, // eslint-disable-line no-unused-vars
      willLeave, // eslint-disable-line no-unused-vars
      ...props
    } = this.props;

    const { animations } = this.state;

    return React.cloneElement(children(animations.map(animation => ({
      key: animation.key,
      style: animation.currentStyle,
      data: animation.data,
    }))), props);
  }
}
