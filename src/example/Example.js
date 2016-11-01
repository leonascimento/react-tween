import { Animations, Tween } from '..';
import classNames from 'classnames';
import ClickableExample from './ClickableExample';
import React from 'react';
import { scaleLinear } from 'd3-scale';
import styles from './Example.scss';

export default function Example({ className, ...props }) {
  const height = 100;
  const width = 200;
  const barRadius = 6;

  const heightScale = scaleLinear()
    .domain([0, 150])
    .range([0, height]);

  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      {/*<ClickableExample>
        {(flag, onFlag) => {
          const data = flag ?
            [
              { index: 0, value: 50 },
              { index: 2, value: 75 },
              { index: 3, value: 100 },
              { index: 4, value: 125 },
              { index: 6, value: 150 },
            ] :
            [
              { index: 1, value: 50 },
              { index: 2, value: 100 },
              { index: 5, value: 150 },
              { index: 6, value: 100 },
              { index: 7, value: 50 },
            ];

          const barScale = scaleBand()
            .domain(data.map(d => d.index))
            .range([0, width])
            .padding(0.3);

          return (
            <TransitionTween
              styles={data
                .map(d => ({
                  key: d.index.toString(),
                  style: {
                    position: barScale(d.index),
                    value: d.value,
                    width: barScale.bandwidth(),
                    opacity: 1,
                  },
                  data: d.index,
                }))}
              willEnter={() => ({ value: 0, opacity: 0 })}
              willLeave={() => ({ value: 0, opacity: 0 })}
            >
              {barStyles => (
                <svg
                  className={classNames(styles.chart, styles.example)}
                  height={height}
                  onClick={onFlag}
                  width={width}
                >
                  {barStyles.map(style => (
                    <rect
                      className={styles.bar}
                      key={style.key}
                      height={heightScale(style.style.value) + barRadius}
                      rx={barRadius}
                      ry={barRadius}
                      style={{ opacity: style.style.opacity }}
                      width={style.style.width}
                      x={style.style.position}
                      y={height - heightScale(style.style.value)}
                    />
                  ))}
                </svg>
              )}
            </TransitionTween>
          );
        }}
      </ClickableExample> */}
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween
            animation={Animations.timing({
              toValue: { opacity: (flag ? 0.5 : 1) },
            })}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
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
          <Tween
            animation={Animations.sequence([
              Animations.timing({
                toValue: { opacity: (flag ? 0.5 : 1) },
              }),
              Animations.timing({
                toValue: { color: (flag ? 'skyblue' : 'orange') },
              }),
            ])}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={{
                  opacity: style.opacity,
                  backgroundColor: style.color,
                }}
              >
                Click to animate opacity, then color
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween
            animation={Animations.timing({
              toValue: {
                opacity: (flag ? 0.5 : 1),
                color: (flag ? 'skyblue' : 'orange'),
              },
            })}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={{
                  opacity: style.opacity,
                  backgroundColor: style.color,
                }}
              >
                Click to animate opacity and color in parallel
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween
            animation={Animations.parallel([
              Animations.timing({
                toValue: { opacity: (flag ? 0.5 : 1) },
                duration: 1000,
              }),
              Animations.timing({
                toValue: { color: (flag ? 'skyblue' : 'orange') },
              }),
            ])}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={{
                  opacity: style.opacity,
                  backgroundColor: style.color,
                }}
              >
                Click to animate opacity and color in parallel at different rates
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
    </div>
  );
}
