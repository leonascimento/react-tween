import clamp from 'lodash.clamp';
import difference from 'lodash.difference';
import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import intersection from 'lodash.intersection';
import React from 'react';
import sortBy from 'lodash.sortby';
import { timer } from 'd3-timer';

export default class TransitionTween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    delay: React.PropTypes.number,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    sortKey: React.PropTypes.func,
    stagger: React.PropTypes.number,
    styles: React.PropTypes.array,
    willEnter: React.PropTypes.func,
    willLeave: React.PropTypes.func,
  };

  static defaultProps = {
    delay: 0,
    duration: 400,
    easing: easeCubicInOut,
    stagger: 0,
    willEnter: () => ({}),
    willLeave: () => ({}),
  };

  constructor(props) {
    super(props);

    this.state = {
      styles: this.extractAnimatedStyles(props.styles),
    };

    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    // Animation is kicked off when props are received.
    // Multiple kickoffs halt and resume the animation from the current state.

    const extractStylesByKey = styles => styles.reduce((result, style) => {
      result[style.key] = style;
      return result;
    }, {});

    const stylesByKey = extractStylesByKey(this.state.styles);
    const nextStylesByKey = extractStylesByKey(nextProps.styles);

    const keys = Object.keys(stylesByKey);
    const nextKeys = Object.keys(nextStylesByKey);

    const added = difference(nextKeys, keys);
    const removed = difference(keys, nextKeys);
    const shared = intersection(keys, nextKeys);

    const generateEnterStyle = k => ({
      ...nextStylesByKey[k].style,
      ...nextProps.willEnter(),
    });
    const generateLeaveStyle = k => ({
      ...stylesByKey[k].currentStyle,
      ...nextProps.willLeave(),
    });

    const styles = []
      .concat(
        added.map(k => ({
          key: k,
          startStyle: generateEnterStyle(k),
          currentStyle: generateEnterStyle(k),
          endStyle: nextStylesByKey[k].style,
          data: nextStylesByKey[k].data,
        }))
      )
      .concat(
        removed.map(k => ({
          key: k,
          startStyle: stylesByKey[k].currentStyle,
          currentStyle: stylesByKey[k].currentStyle,
          endStyle: generateLeaveStyle(k),
          data: stylesByKey[k].data,
          removed: true,
        }))
      )
      .concat(
        shared.map(k => ({
          key: k,
          startStyle: stylesByKey[k].currentStyle,
          currentStyle: stylesByKey[k].currentStyle,
          endStyle: nextStylesByKey[k].style,
          data: nextStylesByKey[k].data,
        }))
      );

    const sortedStyles = nextProps.sortKey ?
      sortBy(styles, style => nextProps.sortKey(style.data)) :
      styles;

    this.setState({ styles: sortedStyles });

    this.startTimer();
  }

  componentWillUnmount() {
    // Prevent the timer callback from updating an unmounted component.
    this.stopTimerIfStarted();
  }

  extractAnimatedStyles(styles) {
    return styles.map(style => ({
      key: style.key,
      startStyle: style.style,
      currentStyle: style.style,
      endStyle: style.style,
      data: style.data,
    }));
  }

  render() {
    const { children, delay, duration, easing, sortKey, stagger, styles: stylesProp, willEnter, willLeave, ...props } = this.props;
    const { styles } = this.state;

    return React.cloneElement(children(styles.map(style => ({
      key: style.key,
      style: style.currentStyle,
      data: style.data,
    }))), props);
  }

  startTimer() {
    const { delay } = this.props;

    this.stopTimerIfStarted();
    this.timer = timer(elapsed => this.updateFromTimer(elapsed), delay);
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
    const { duration, easing, stagger } = this.props;

    const fullDuration = duration + stagger * (this.state.styles.length - 1);

    if (elapsed / fullDuration > 0.99) {
      const styles = this.state.styles
        .filter(style => !style.removed)
        .map(style => ({
          ...style,
          startStyle: style.endStyle,
          currentStyle: style.endStyle,
        }));

      this.setState({ styles });

      this.stopTimer();
      return;
    }

    const styles = this.state.styles.map((style, i) => {
      const staggeredTime = clamp((elapsed - (stagger * i)) / duration, 0, 1);

      return {
        ...style,
        currentStyle: interpolate(style.startStyle, style.endStyle)(easing(staggeredTime)),
      };
    });

    this.setState({ styles });
  }
}
