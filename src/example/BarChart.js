import { Animations, TransitionTween } from '..';
import classNames from 'classnames';
import React from 'react';
import { scaleLinear } from 'd3-scale';
import styles from './BarChart.scss';

export default function BarChart({ animations, className, data, height, label, width, willEnter, willLeave, ...props }) {
  const barRadius = 6;
  const maxValue = Math.max(...data.map(d => d.value));
  const heightScale = scaleLinear()
    .domain([0, maxValue])
    .range([0, height]);

  return (
    <div
      className={classNames(styles.labelledChart, className)}
      style={{ width }}
      {...props}
    >
      <TransitionTween
        animations={animations}
        willEnter={willEnter}
        willLeave={willLeave}
      >
        {interpolatedStyles => (
          <svg
            className={styles.chart}
            height={height}
            width={width}
          >
            {interpolatedStyles.map(style => (
              <rect
                className={styles.bar}
                key={style.key}
                height={heightScale(style.style.value) + barRadius}
                rx={barRadius}
                ry={barRadius}
                style={{
                  fill: style.style.color,
                  opacity: style.style.opacity,
                }}
                width={style.style.width}
                x={style.style.position}
                y={height - heightScale(style.style.value)}
              />
            ))}
          </svg>
        )}
      </TransitionTween>
      <div className={styles.label}>
        {label}
      </div>
    </div>
  );
}
