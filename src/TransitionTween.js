import { easeCubicInOut } from 'd3-ease';
import Immutable from 'immutable';
import { interpolate } from 'd3-interpolate';
import React from 'react';
import { timer } from 'd3-timer';

export default class TransitionTween extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
    delay: React.PropTypes.number,
    duration: React.PropTypes.number,
    easing: React.PropTypes.func,
    sortKey: React.PropTypes.func,
    styles: React.PropTypes.array,
    willEnter: React.PropTypes.func,
    willLeave: React.PropTypes.func,
  };

  static defaultProps = {
    delay: 0,
    duration: 400,
    easing: easeCubicInOut,
  };

  constructor(props) {
    super(props);

    const { sortKey, styles } = this.props;

    this.state = {
      interpolatedStyles: Immutable.List(styles)
        .map(style => Immutable.Map({
          key: style.key,
          startStyle: style.style,
          currentStyle: style.style,
          endStyle: style.style,
          data: style.data,
        }))
        .sortBy(style => sortKey(style.get('data'))),
    };
  }

  componentWillReceiveProps(nextProps) {
    const styles = this.state.interpolatedStyles;

    const nextStyles = Immutable.List(nextProps.styles).map(style => Immutable.Map(style));

    const extractByKey = styles => styles.reduce((result, style) => result.set(style.get('key'), style), Immutable.Map());
    const extractKeys = styles => styles.map(style => style.get('key'));

    const stylesByKey = extractByKey(styles);
    const nextStylesByKey = extractByKey(nextStyles);

    const styleKeysInOrder = extractKeys(styles);
    const nextStyleKeysInOrder = extractKeys(nextStyles);

    const styleKeys = styleKeysInOrder.toSet();
    const nextStyleKeys = nextStyleKeysInOrder.toSet();

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
      )
      .sortBy(interpolatedStyle => this.props.sortKey(interpolatedStyle.get('data')));

    this.setState({ interpolatedStyles });

    if (!this.timer) {
      this.timer = timer(elapsed => this.update(elapsed), nextProps.delay);
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  render() {
    const { children } = this.props;
    const { interpolatedStyles } = this.state;

    return children(
      interpolatedStyles
        .map(style => ({
          key: style.get('key'),
          style: style.get('currentStyle'),
          data: style.get('data'),
        }))
        .toArray()
    );
  }

  stop() {
    this.timer.stop();
    this.timer = null;
  }

  update(elapsed) {
    const { duration, easing } = this.props;
    const { interpolatedStyles } = this.state;

    const t = elapsed / duration;
    if (t > 0.99) {
      const nextInterpolatedStyles = interpolatedStyles
        .filter(interpolatedStyle => !interpolatedStyle.get('removed'))
        .map(interpolatedStyle => (
          interpolatedStyle.set('currentStyle', interpolatedStyle.get('endStyle'))
        ));

      this.setState({ interpolatedStyles: nextInterpolatedStyles });

      this.stop();
      return;
    }

    const easedTime = easing(t);

    const nextInterpolatedStyles = interpolatedStyles.map(interpolatedStyle => (
      interpolatedStyle.set('currentStyle', interpolate(interpolatedStyle.get('startStyle'), interpolatedStyle.get('endStyle'))(easedTime))
    ));

    this.setState({ interpolatedStyles: nextInterpolatedStyles });
  }
}
