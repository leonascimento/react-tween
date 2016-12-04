import classNames from 'classnames';
import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import ClickableExample from './ClickableExample';
import styles from './RescaleAxisExample.scss';
import TransitionGroup from './TransitionGroup';
import Tween from './Tween';

export default function RescaleAxisExample({ className, ...props }) {
  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      <ClickableExample>
        {({ counter, onClick }) => {
          const width = 400;
          const height = 400;

          const margin = {
            top: 0,
            bottom: 0,
            left: 100,
            right: 0,
          };

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
          const barHeightTicks = barHeightScale.ticks(10)
            .filter(tick => tick !== 0);

          return (
            <svg
              className={styles.example}
              height={height + (margin.top + margin.bottom)}
              onClick={onClick}
              width={width + (margin.left + margin.right)}
            >
              <Tween
                group={counter}
                style={{ maxBarValue }}
              >
                {({ maxBarValue: interpolatedMaxBarValue }) => {
                  const interpolatedBarHeightScale = scaleLinear()
                    .domain([0, 1.2 * interpolatedMaxBarValue])
                    .range([0, height]);

                  return (
                    <TransitionGroup
                      group={counter}
                      styles={barHeightTicks.map(tick => ({
                        key: tick.toString(),
                        style: {
                          opacity: 1,
                        },
                        data: tick,
                      }))}
                      willEnter={style => ({
                        ...style,
                        opacity: 0,
                      })}
                      willLeave={style => ({
                        ...style,
                        opacity: 0,
                      })}
                    >
                      {interpolatedStyles => (
                        <g>
                          {interpolatedStyles.map(style => (
                            <g
                              key={style.key}
                              transform={`translate(${margin.left - 10},${height - interpolatedBarHeightScale(style.data)})`}
                            >
                              <text
                                className={styles.barHeightTick}
                                style={{ opacity: style.style.opacity }}
                              >
                                {style.data}
                              </text>
                            </g>
                          ))}
                        </g>
                      )}
                    </TransitionGroup>
                  );
                }}
              </Tween>
              <line
                className={styles.line}
                x1={margin.left}
                x2={margin.left}
                y1={0}
                y2={height + (margin.top + margin.bottom)}
              />
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
                  <g transform={`translate(${margin.left},${margin.top})`}>
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
                  </g>
                )}
              </TransitionGroup>
            </svg>
          );
        }}
      </ClickableExample>
    </div>
  );
}

RescaleAxisExample.propTypes = {
  className: React.PropTypes.string,
};
