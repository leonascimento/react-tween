import classNames from 'classnames';
import ClickableExample from './ClickableExample';
import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import styles from './Example.scss';
import TransitionTween from '../tween/TransitionTween';
import Tween from '../tween/Tween';

export default function Example({ className, ...props }) {
  const height = 100;
  const width = 100;
  const barRadius = 6;

  const heightScale = scaleLinear()
    .domain([0, 150])
    .range([0, height]);

  const barScale = scaleBand()
    .domain([0, 1, 2, 3, 4])
    .range([0, width])
    .padding(0.3);

  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween style={{ opacity: (flag ? 0.5 : 1) }}>
            {style => (
              <div
                className={classNames(styles.opacity, styles.example)}
                onClick={onFlag}
                style={style}
              >
                Click to animate opacity
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => (
          <TransitionTween
            sortKey={d => d}
            styles={(flag ? [50, 75, 100, 125, 150] : [50, 100, 150, 100, 50])
              .map((value, i) => ({
                key: i.toString(),
                style: { value },
                data: i,
              }))}
          >
            {barStyles => (
              <svg
                className={classNames(styles.chart, styles.example)}
                height={height}
                onClick={onFlag}
                width={height}
              >
                {barStyles.map(style => (
                  <rect
                    className={styles.bar}
                    key={style.key}
                    height={heightScale(style.style.value) + barRadius}
                    rx={barRadius}
                    ry={barRadius}
                    width={barScale.bandwidth()}
                    x={barScale(style.data)}
                    y={height - heightScale(style.style.value)}
                  />
                ))}
              </svg>
            )}
          </TransitionTween>
        )}
      </ClickableExample>
    </div>
  );
}
