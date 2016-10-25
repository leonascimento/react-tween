import { easeCubicInOut } from 'd3-ease';
import Immutable from 'immutable';
import { interpolate } from 'd3-interpolate';
import React from 'react';
import { timer } from 'd3-timer';

export default class TransitionTween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    duration: React.PropTypes.number,
    sortKey: React.PropTypes.func,
    styles: React.PropTypes.array,
    willEnter: React.PropTypes.func,
    willLeave: React.PropTypes.func,
  };

  static defaultProps = {
    duration: 400,
  };

  constructor(props) {
    super(props);

    const { styles } = this.props;

    this.state = {
      interpolatedStyles: styles.map(style => ({
        key: style.key,
        startStyle: style.style,
        currentStyle: style.style,
        endStyle: style.style,
        data: style.data,
      })),
    };
  }

  componentWillReceiveProps(nextProps) {
    const styles = Immutable.fromJS(this.state.interpolatedStyles);
    const nextStyles = Immutable.fromJS(nextProps.styles);

    const extractByKey = styles => styles.reduce((result, style) => result.set(style.get('key'), style), Immutable.Map());
    const extractKeys = styles => styles.map(style => style.get('key')).toSet();

    const stylesByKey = extractByKey(styles);
    const nextStylesByKey = extractByKey(nextStyles);

    const styleKeys = extractKeys(styles);
    const nextStyleKeys = extractKeys(nextStyles);

    const added = nextStyleKeys.subtract(styleKeys);
    const removed = styleKeys.subtract(nextStyleKeys);
    const existing = styleKeys.intersect(nextStyleKeys);

    const enterStyle = this.props.willEnter();
    const leaveStyle = this.props.willLeave();

    const interpolatedStyles = Immutable.List()
      .concat(
        added.map(key => {
          const nextStyle = nextStylesByKey.get(key);

          return Immutable.Map({
            key,
            startStyle: enterStyle,
            currentStyle: enterStyle,
            endStyle: nextStyle.get('style'),
            data: nextStyle.get('data'),
          });
        })
      )
      .concat(
        removed.map(key => {
          const style = stylesByKey.get(key);

          return Immutable.Map({
            key,
            startStyle: style.get('currentStyle'),
            currentStyle: style.get('currentStyle'),
            endStyle: leaveStyle,
            data: style.get('data'),
            removed: true,
          });
        })
      )
      .concat(
        existing.map(key => {
          const style = stylesByKey.get(key);
          const nextStyle = nextStylesByKey.get(key);

          return Immutable.Map({
            key,
            startStyle: style.get('currentStyle'),
            currentStyle: style.get('currentStyle'),
            endStyle: nextStyle.get('style'),
            data: nextStyle.get('data'),
          });
        })
      );

    this.startTime = Date.now();

    this.setState({
      interpolatedStyles: interpolatedStyles.toJS(),
    });

    if (!this.timer) {
      this.timer = timer(() => this.update());
    }
  }

  render() {
    const { children, sortKey } = this.props;
    const { interpolatedStyles } = this.state;

    return children(
      Immutable.List(
        interpolatedStyles
          .map(style => ({
            key: style.key,
            style: style.currentStyle,
            data: style.data,
          }))
      )
        .sortBy(style => sortKey(style.key))
        .toArray()
    );
  }

  update() {
    const { duration } = this.props;
    const { interpolatedStyles } = this.state;

    const currentTime = Date.now();
    const t = (currentTime - this.startTime) / duration;
    if (t > 0.99) {
      const nextInterpolatedStyles = interpolatedStyles
        .filter(interpolatedStyle => !interpolatedStyle.removed)
        .map(interpolatedStyle => ({
          ...interpolatedStyle,
          currentStyle: interpolatedStyle.endStyle,
        }));

      this.setState({ interpolatedStyles: nextInterpolatedStyles });

      this.timer.stop();
      this.timer = null;
      return;
    }

    const easedTime = easeCubicInOut(t);

    const nextInterpolatedStyles = interpolatedStyles.map(interpolatedStyle => ({
      ...interpolatedStyle,
      currentStyle: interpolate(interpolatedStyle.startStyle, interpolatedStyle.endStyle)(easedTime),
    }));

    this.setState({ interpolatedStyles: nextInterpolatedStyles });
  }
}
