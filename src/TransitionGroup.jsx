import { easeCubicInOut } from 'd3-ease';
import { interpolate } from 'd3-interpolate';
import isEqual from 'lodash.isequal';
import isUndefined from 'lodash.isundefined';
import now from 'performance-now';
import React from 'react';
import { timer } from 'd3-timer';
import mergeDiff from './mergeDiff';
import toObject from './toObject';

export default class TransitionGroup extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    group: React.PropTypes.any, // eslint-disable-line react/forbid-prop-types
    styles: React.PropTypes.array, // eslint-disable-line react/forbid-prop-types
    willEnter: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
    willLeave: React.PropTypes.func, // eslint-disable-line react/no-unused-prop-types
  };

  static defaultProps = {
    duration: 500,
    easing: easeCubicInOut,
    willEnter: style => style.style,
    willLeave: style => style.style,
  };

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
        const leaveStyle = nextProps.willLeave(oldStyles[key].currentStyle);

        return {
          key,
          startStyle: oldStyles[key].currentStyle,
          currentStyle: oldStyles[key].currentStyle,
          endStyle: leaveStyle,
          data: oldStyles[key].data,
        };
      } else { // eslint-disable-line no-else-return
        // added key case
        const enterStyle = nextProps.willEnter(newStyles[key].style);

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

  startTimer() {
    this.startTime = now();
    this.timer.restart(() => this.update());
  }

  stopTimer() {
    this.timer.stop();

    this.setState({
      styles: this.state.styles.map(style => ({
        ...style,
        currentStyle: style.endStyle,
      })),
    });
  }

  update() {
    const { duration, easing } = this.props;

    const currentTime = now();
    const t = (currentTime - this.startTime) / duration;
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

    const styles = this.state.styles.map(style => ({
      key: style.key,
      style: style.currentStyle,
      data: style.data,
    }));

    return children(styles);
  }
}
