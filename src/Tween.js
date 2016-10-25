import { easeCubicInOut } from 'd3-ease';
import Immutable from 'immutable';
import { interpolate } from 'd3-interpolate';
import React from 'react';
import { timer } from 'd3-timer';

export default class Tween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    style: React.PropTypes.object,
  };

  static defaultProps = {
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
      this.startTime = Date.now();
      this.prevStyle = this.state.interpolatedStyle;

      if (!this.timer) {
        this.timer = timer(() => this.update());
      }
    }
  }

  render() {
    const { children } = this.props;
    const { interpolatedStyle } = this.state;

    return children(interpolatedStyle);
  }

  update() {
    const { duration, easing, style } = this.props;

    const currentTime = Date.now();
    const t = (currentTime - this.startTime) / duration;
    if (t > 0.99) {
      this.setState({ interpolatedStyle: style });

      this.timer.stop();
      this.timer = null;
      return;
    }

    const easedTime = easing(t);
    const interpolatedStyle = interpolate(this.prevStyle, style)(easedTime);
    this.setState({ interpolatedStyle });
  }
}
