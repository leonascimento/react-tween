import classNames from 'classnames';
import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import ClickableExample from './ClickableExample';
import styles from './TransitionGroupExample.scss';
import TransitionGroup from './TransitionGroup';

export default function TransitionGroupExample({ className, ...props }) {
  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      <ClickableExample>
        {({ counter, onClick }) => {
          const width = 400;
          const height = 200;

          const bars = counter % 2 === 0
            ? [
              {
                key: '0',
                value: 10,
              },
              {
                key: '1',
                value: 20,
              },
              {
                key: '2',
                value: 30,
              },
              {
                key: '3',
                value: 20,
              },
              {
                key: '4',
                value: 10,
              },
            ]
            : [
              {
                key: '0',
                value: 10,
              },
              {
                key: '2',
                value: 30,
              },
              {
                key: '3',
                value: 40,
              },
            ];

          const barPositionScale = scaleBand()
            .domain(bars.map(bar => bar.key))
            .range([0, width])
            .padding(0.5);

          const maxBarValue = Math.max(...bars.map(bar => bar.value));
          const barHeightScale = scaleLinear()
            .domain([0, 1.2 * maxBarValue])
            .range([0, height]);

          return (
            <TransitionGroup
              group={counter}
              styles={bars.map(bar => ({
                key: bar.key,
                style: {
                  height: barHeightScale(bar.value),
                  position: barPositionScale(bar.key),
                  width: barPositionScale.bandwidth(),
                  opacity: 1,
                },
                data: bar,
              }))}
              willEnter={style => ({
                ...style,
                height: 0.5 * style.height,
                opacity: 0,
              })}
              willLeave={style => ({
                ...style,
                height: 0.5 * style.height,
                opacity: 0,
              })}
            >
              {interpolatedStyles => (
                <svg
                  className={styles.example}
                  height={height}
                  onClick={onClick}
                  width={width}
                >
                  {interpolatedStyles.map(style => (
                    <g
                      key={style.key}
                      transform={`translate(${style.style.position},${height - style.style.height})`}
                    >
                      <rect
                        className={styles.bar}
                        height={style.style.height}
                        style={{ opacity: style.style.opacity }}
                        width={style.style.width}
                      />
                    </g>
                  ))}
                </svg>
              )}
            </TransitionGroup>
          );
        }}
      </ClickableExample>
    </div>
  );
}

TransitionGroupExample.propTypes = {
  className: React.PropTypes.string,
};
