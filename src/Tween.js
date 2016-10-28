import { easeCubicInOut } from 'd3-ease';
import Immutable from 'immutable';
import { interpolate } from 'd3-interpolate';
import React from 'react';
import { timer } from 'd3-timer';

export default class Tween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    delay: React.PropTypes.number,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    style: React.PropTypes.object,
  };

  static defaultProps = {
    delay: 0,
    duration: 400,
    easing: easeCubicInOut,
  };

  constructor(props) {
    super(props);

    const { style } = props;

    this.state = { interpolatedStyle: style };
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(Immutable.Map(this.props.style), Immutable.Map(nextProps.style))) {
      this.prevStyle = this.state.interpolatedStyle;

      if (!this.timer) {
        this.timer = timer(elapsed => this.update(elapsed), nextProps.delay);
      }
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  render() {
    const { children } = this.props;
    const { interpolatedStyle } = this.state;

    return children(interpolatedStyle);
  }

  stop() {
    this.timer.stop();
    this.timer = null;
  }

  update(elapsed) {
    const { duration, easing, style } = this.props;

    const t = elapsed / duration;
    if (t > 0.99) {
      this.setState({ interpolatedStyle: style });

      this.stop();
      return;
    }

    const easedTime = easing(t);
    const interpolatedStyle = interpolate(this.prevStyle, style)(easedTime);
    this.setState({ interpolatedStyle });
  }
}
