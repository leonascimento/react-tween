import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import mergeDiff from './mergeDiff';
import React from 'react';
import { timer } from 'd3-timer';

export default class TransitionTween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    delay: React.PropTypes.number,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    styles: React.PropTypes.array,
    willEnter: React.PropTypes.func,
    willLeave: React.PropTypes.func,
  };

  static defaultProps = {
    delay: 0,
    duration: 400,
    easing: easeCubicInOut,
    willEnter: () => ({}),
    willLeave: () => ({}),
  };

  constructor(props) {
    super(props);

    const styles = props.styles.map(style => ({
      key: style.key,
      startStyle: style.style,
      currentStyle: style.style,
      endStyle: style.style,
      data: style.data,
    }));

    this.state = { styles };

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
    const mergedKeys = mergeDiff(keys, nextKeys);

    const generateEnterStyle = k => ({
      ...nextStylesByKey[k].style,
      ...nextProps.willEnter(),
    });
    const generateLeaveStyle = k => ({
      ...stylesByKey[k].currentStyle,
      ...nextProps.willLeave(),
    });

    const styles = mergedKeys.map(k => {
      if (stylesByKey.hasOwnProperty(k) && nextStylesByKey.hasOwnProperty(k)) {
        // key is shared by current and next styles
        return {
          key: k,
          startStyle: stylesByKey[k].currentStyle,
          currentStyle: stylesByKey[k].currentStyle,
          endStyle: nextStylesByKey[k].style,
          data: nextStylesByKey[k].data,
        };
      } else if (nextStylesByKey.hasOwnProperty(k)) {
        // key is added
        return {
          key: k,
          startStyle: generateEnterStyle(k),
          currentStyle: generateEnterStyle(k),
          endStyle: nextStylesByKey[k].style,
          data: nextStylesByKey[k].data,
        };
      } else {
        // key is removed
        return {
          key: k,
          startStyle: stylesByKey[k].currentStyle,
          currentStyle: stylesByKey[k].currentStyle,
          endStyle: generateLeaveStyle(k),
          data: stylesByKey[k].data,
          removed: true,
        };
      }
    });

    this.setState({ styles });

    this.startTimer();
  }

  componentWillUnmount() {
    // Prevent the timer callback from updating an unmounted component.
    this.stopTimerIfStarted();
  }

  render() {
    const { children, delay, duration, easing, styles: stylesProp, willEnter, willLeave, ...props } = this.props;
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
    const { duration, easing } = this.props;

    const t = elapsed / duration;
    if (t > 0.99) {
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

    const styles = this.state.styles.map(style => {
      return {
        ...style,
        currentStyle: interpolate(style.startStyle, style.endStyle)(easing(t)),
      };
    });

    this.setState({ styles });
  }
}
