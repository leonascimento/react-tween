import classNames from 'classnames';
import Immutable from 'immutable';
import React from 'react';
import { scaleLinear, scaleOrdinal, schemeCategory20 } from 'd3-scale';
import styles from './Example.scss';
import TransitionTween from './TransitionTween';
import Tween from './Tween';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    const bars = Immutable.Range(0, 5)
      .map(i => Immutable.Map({ id: i, value: 2 + (i % 2) }))
      .toList();

    const visibleBars = bars.map(bar => bar.get('id')).toSet();

    this.state = {
      bars,
      color: 'red',
      opacity: 0.5,
      visibleBars,
    };
  }

  render() {
    const { className, ...props } = this.props;
    const { bars, color, opacity, visibleBars } = this.state;

    const height = 300;
    const heightScale = scaleLinear()
      .domain([0, 15])
      .range([0, height]);
    const colorScale = scaleOrdinal()
      .domain(bars.map(bar => bar.get('id')).toArray())
      .range(schemeCategory20);

    return (
      <div
        className={classNames(styles.examples, className)}
        {...props}
      >
        <div className={styles.example}>
          <TransitionTween
            duration={1000}
            styles={bars
              .filter(bar => visibleBars.has(bar.get('id')))
              .map(bar => ({
                key: bar.get('id'),
                style: {
                  value: bar.get('value'),
                },
                data: bar,
              }))
              .toArray()}
            willEnter={() => ({ value: 0 })}
            willLeave={() => ({ value: 0 })}
          >
            {interpolatedStyles => (
              <div className={styles.bar}>
                {interpolatedStyles.map(interpolatedStyle => (
                  <div
                    className={styles.segment}
                    key={interpolatedStyle.key}
                    style={{
                      backgroundColor: colorScale(interpolatedStyle.key),
                      height: heightScale(interpolatedStyle.style.value),
                    }}
                  />
                ))}
              </div>
            )}
          </TransitionTween>
          <div>
            <button
              onClick={() => this.setState({ visibleBars: bars.map(bar => bar.get('id')).toSet(), })}
              type="button"
            >
              Reset
            </button>
            <button
              onClick={() => {
                const evenBars = bars
                  .filter((bar, i) => i % 2 === 0)
                  .map(bar => bar.get('id'))
                  .toSet();

                this.setState({
                  visibleBars: visibleBars.intersect(evenBars).isEmpty() ? visibleBars.union(evenBars) : visibleBars.subtract(evenBars),
                });
              }}
              type="button"
            >
              Toggle Even Bars
            </button>
            <button
              onClick={() => {
                const oddBars = bars
                  .filter((bar, i) => i % 2 === 1)
                  .map(bar => bar.get('id'))
                  .toSet();

                this.setState({
                  visibleBars: visibleBars.intersect(oddBars).isEmpty() ? visibleBars.union(oddBars) : visibleBars.subtract(oddBars),
                });
              }}
              type="button"
            >
              Toggle Odd Bars
            </button>
          </div>
        </div>
        <Tween style={{ color, opacity }}>
          {interpolatedStyle => (
            <div
              className={styles.example}
              onClick={() => this.setState({
                color: color === 'red' ? 'yellow' : 'red',
                opacity: opacity === 0.5 ? 1 : 0.5,
              })}
              style={{
                backgroundColor: interpolatedStyle.color,
                opacity: interpolatedStyle.opacity,
              }}
            >
              Click to change opacity and color
            </div>
          )}
        </Tween>
      </div>
    );
  }
}

Example.propTypes = {
  className: React.PropTypes.string,
};
