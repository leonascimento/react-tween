import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import isEqual from 'lodash.isequal';
import isUndefined from 'lodash.isundefined';
import React from 'react';
import { timer } from 'd3-timer';
import mergeDiff from './mergeDiff';
import toObject from './toObject';

export default class TransitionGroup extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    delay: React.PropTypes.number,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    group: React.PropTypes.any, // eslint-disable-line react/forbid-prop-types
    onEnd: React.PropTypes.func,
    styles: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
    willEnter: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    willLeave: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    delay: 0,
    duration: 500,
    easing: easeCubicInOut,
    onEnd: () => {},
    willEnter: style => style.style,
    willLeave: style => style.style,
  };

  static getTransitionStyle(style) {
    return {
      key: style.key,
      style: style.currentStyle,
      data: style.data,
    };
  }

  constructor(props) {
    super(props);

    const { styles } = props;

    this.state = {
      styles: styles.map(style => ({
        key: style.key,
        startStyle: style.style,
        currentStyle: style.style,
        endStyle: style.style,
        data: style.data,
      })),
    };

    this.timer = timer(() => this.timer.stop());
  }

  componentWillReceiveProps(nextProps) {
    if (
      isUndefined(nextProps.group) ?
        // Don't animate if the new end styles are the same as the old end styles.
        // This prevents nested tweens from constantly restarting their animation because they keep receiving new props.
        isEqual(
          this.state.styles.map(style => ({
            key: style.key,
            style: style.endStyle,
          })),
          nextProps.styles.map(style => ({
            key: style.key,
            style: style.style,
          }))
        ) :
        this.props.group === nextProps.group
    ) {
      return;
    }

    const oldStyles = toObject(this.state.styles, style => style.key);
    const newStyles = toObject(nextProps.styles, style => style.key);
    const mergedKeys = mergeDiff(oldStyles, newStyles);

    const styles = mergedKeys.map((key) => {
      if (Object.prototype.hasOwnProperty.call(oldStyles, key) && Object.prototype.hasOwnProperty.call(newStyles, key)) {
        // shared key case
        return {
          key,
          startStyle: oldStyles[key].currentStyle,
          currentStyle: oldStyles[key].currentStyle,
          endStyle: newStyles[key].style,
          data: newStyles[key].data,
        };
      } else if (Object.prototype.hasOwnProperty.call(oldStyles, key)) {
        // removed key case
        const leaveStyle = nextProps.willLeave(TransitionGroup.getTransitionStyle(oldStyles[key]));

        return {
          key,
          startStyle: oldStyles[key].currentStyle,
          currentStyle: oldStyles[key].currentStyle,
          endStyle: leaveStyle,
          data: oldStyles[key].data,
        };
      } else { // eslint-disable-line no-else-return
        // added key case
        const enterStyle = nextProps.willEnter(newStyles[key]);

        return {
          key,
          startStyle: enterStyle,
          currentStyle: enterStyle,
          endStyle: newStyles[key].style,
          data: newStyles[key].data,
        };
      }
    });

    this.setState({ styles });

    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    const { delay } = this.props;

    this.timer.restart(elapsed => this.update(elapsed), delay);
    this.running = true;
  }

  stopTimer() {
    const { onEnd } = this.props;

    if (!this.running) {
      return;
    }

    this.timer.stop();
    this.running = false;

    this.setState({
      styles: this.state.styles.map(style => ({
        ...style,
        currentStyle: style.endStyle,
      })),
    });

    onEnd();
  }

  update(elapsed) {
    const { duration, easing } = this.props;

    const t = elapsed / duration;
    const easedTime = easing(t);
    if (easedTime > 0.99) {
      this.stopTimer();
      return;
    }

    this.setState({
      styles: this.state.styles.map(style => ({
        ...style,
        currentStyle: interpolate(style.startStyle, style.endStyle)(easedTime),
      })),
    });
  }

  render() {
    const { children } = this.props;

    const styles = this.state.styles.map(TransitionGroup.getTransitionStyle);

    return children(styles);
  }
}
