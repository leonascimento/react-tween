import classNames from 'classnames';
import React from 'react';
import { scaleLinear, scalePoint } from 'd3-scale';
import styles from './BarChart.scss';

export default function BarChart({ className, onClick, ...props }) {
  const width = 200;
  const height = 200;
  const barRadius = 6;
  const barWidth = 20;
  const widthBetweenCenters = width - (2 * barWidth);

  const heightScale = scaleLinear()
    .domain([0, 200])
    .range([0, height]);

  console.log(props.styles.map(style => style.style.position));

  return (
    <svg
      className={classNames(styles.chart, className)}
      height={height}
      onClick={onClick}
      width={width}
    >
      {props.styles.map(style => (
        <rect
          className={styles.bar}
          height={heightScale(style.style.value) + barRadius}
          key={style.key}
          rx={barRadius}
          ry={barRadius}
          width={barWidth}
          x={style.style.position * widthBetweenCenters}
          y={height - heightScale(style.style.value)}
        />
      ))}
    </svg>
  );
}
