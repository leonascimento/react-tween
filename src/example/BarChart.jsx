import classNames from 'classnames';
import React from 'react';
import { scaleLinear } from 'd3-scale';
import styles from './BarChart.scss';

export default function BarChart({
  className,
  data,
  height,
  interpolatedStyles,
  label,
  width,
  ...props
}) {
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
      <div className={styles.label}>
        {label}
      </div>
    </div>
  );
}

BarChart.propTypes = {
  className: React.PropTypes.string,
  data: React.PropTypes.arrayOf(React.PropTypes.shape({
    value: React.PropTypes.number,
  })),
  height: React.PropTypes.number,
  interpolatedStyles: React.PropTypes.arrayOf(React.PropTypes.shape({
    style: React.PropTypes.shape({
      color: React.PropTypes.string,
      opacity: React.PropTypes.number,
      position: React.PropTypes.number,
      value: React.PropTypes.number,
      width: React.PropTypes.number,
    }),
  })),
  label: React.PropTypes.string,
  width: React.PropTypes.number,
};
