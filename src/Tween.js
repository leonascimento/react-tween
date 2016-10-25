import d3 from 'd3';
import Immutable from 'immutable';
import React from 'react';

export default class Tween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    duration: React.PropTypes.number,
    style: React.PropTypes.object,
  };

  static defaultProps = {
    duration: 400,
  };

  constructor(props) {
    super(props);

    this.state = { interpolatedStyle: null };
  }

  componentWillReceiveProps(nextProps) {
    if (!Immutable.is(Immutable.Map(this.props.style), Immutable.Map(nextProps.style))) {
      this.startTime = Date.now();
      this.prevStyle = this.props.style;
      d3.timer(() => this.update());
    }
  }

  render() {
    const { children, style } = this.props;
    const { interpolatedStyle } = this.state;

    return children(interpolatedStyle || style);
  }

  update() {
    const { duration, style } = this.props;

    const currentTime = Date.now();
    const t = (currentTime - this.startTime) / duration;
    if (t > 0.99) {
      this.setState({ interpolatedStyle: null });
      return true;
    }

    const easedTime = d3.ease('cubic-in-out')(t);
    const interpolatedStyle = d3.interpolate(this.prevStyle, style)(easedTime);
    this.setState({ interpolatedStyle });
    return false;
  }
}
