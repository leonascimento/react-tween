import { Animations, TransitionTween, Tween } from '..';
import classNames from 'classnames';
import ClickableExample from './ClickableExample';
import React from 'react';
import { scaleBand, scaleLinear } from 'd3-scale';
import styles from './Example.scss';

export default function Example({ className, ...props }) {
  const height = 120;
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
            animation={Animations.timing({
              toValue: { opacity: (flag ? 0.5 : 1) },
              duration: 2000,
            })}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={style}
              >
                Click to animate opacity over a long time
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween
            animation={Animations.timing({
              toValue: { opacity: (flag ? 0.5 : 1) },
              delay: 1000,
            })}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={style}
              >
                Click to animate opacity with a delay
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
                duration: 2000,
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
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween
            animation={Animations.stagger(1000, [
              Animations.timing({
                toValue: { opacity: (flag ? 0.5 : 1) },
                duration: 500,
              }),
              Animations.timing({
                toValue: { color: (flag ? 'skyblue' : 'orange') },
                duration: 500,
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
                Click to stagger opacity and color
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => {
          const data = flag ?
            [
              { index: 0, value: 50 },
              // Drop one bar
              { index: 2, value: 150 },
              // Swap the order of two bars
              { index: 4, value: 100 },
              { index: 3, value: 50 },
            ] :
            [
              { index: 0, value: 50 },
              { index: 1, value: 75 },
              { index: 2, value: 100 },
              { index: 3, value: 125 },
              { index: 4, value: 150 },
            ];

          const barScale = scaleBand()
            .domain(data.map(d => d.index))
            .range([0, width])
            .padding(0.3);

          return (
            <TransitionTween
              animations={data
                .map(d => ({
                  key: d.index.toString(),
                  animation: Animations.timing({
                    toValue: {
                      position: barScale(d.index),
                      value: d.value,
                      width: barScale.bandwidth(),
                      opacity: 1,
                    },
                  }),
                  data: d.index,
                }))}
              willEnter={style => ({ ...style, value: 0, opacity: 0 })}
              willLeave={style => Animations.timing({ toValue: { ...style, value: 0, opacity: 0 } })}
            >
              {interpolatedStyles => (
                <svg
                  className={classNames(styles.chart, styles.example)}
                  height={height}
                  onClick={onFlag}
                  width={width}
                >
                  {interpolatedStyles.map(style => (
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
      </ClickableExample>
    </div>
  );
}
