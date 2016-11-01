import classNames from 'classnames';
import { easeBounce } from 'd3-ease';
import React from 'react';
import { scaleBand } from 'd3-scale';
import { Animations, TransitionTween, Tween } from '..';
import BarChart from './BarChart';
import ClickableExample from './ClickableExample';
import styles from './Example.scss';

export default function Example({ className, ...props }) {
  const height = 100;
  const width = 200;

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
                Click to animate opacity over 2s
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
            animation={Animations.timing({
              toValue: { color: (flag ? 'skyblue' : 'orange') },
              easing: easeBounce,
              duration: 1000,
            })}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={{ backgroundColor: style.color }}
              >
                Click to animate color with bounce easing
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
                Click to animate opacity, then color in sequence
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
        {(flag, onFlag) => {
          const data = flag
            ? [
              { index: 0, value: 50 },
              { index: 1, value: 100 },
              { index: 2, value: 150 },
              { index: 3, value: 100 },
              { index: 4, value: 50 },
            ]
            : [
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
                      color: 'lightgray',
                      opacity: 1,
                      position: barScale(d.index),
                      value: d.value,
                      width: barScale.bandwidth(),
                    },
                  }),
                  data: d.index,
                }))}
              willEnter={style => ({ ...style, value: 0, opacity: 0 })}
              willLeave={style => Animations.timing({
                toValue: { ...style, value: 0, opacity: 0 },
              })}
            >
              {interpolatedStyles => (
                <BarChart
                  className={styles.example}
                  data={data}
                  height={height}
                  interpolatedStyles={interpolatedStyles}
                  label="Click to animate bars"
                  onClick={onFlag}
                  width={width}
                />
              )}
            </TransitionTween>
          );
        }}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => {
          const data = flag
            ? [
              { index: 0, value: 50 },
              { index: 2, value: 150 },
              { index: 4, value: 50 },
            ]
            : [
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

          const color = (flag ? 'skyblue' : 'lightgray');

          return (
            <TransitionTween
              animations={data
                .map(d => ({
                  key: d.index.toString(),
                  animation: Animations.sequence([
                    Animations.timing({
                      toValue: {
                        opacity: 1,
                        position: barScale(d.index),
                        value: d.value,
                        width: barScale.bandwidth(),
                      },
                    }),
                    Animations.timing({
                      toValue: {
                        color,
                      },
                    }),
                  ]),
                  data: d.index,
                }))}
              willEnter={style => ({ ...style, color, value: 0, opacity: 0 })}
              willLeave={style => Animations.timing({
                toValue: { ...style, value: 0, opacity: 0 },
              })}
            >
              {interpolatedStyles => (
                <BarChart
                  className={styles.example}
                  data={data}
                  height={height}
                  interpolatedStyles={interpolatedStyles}
                  label="Click to animate position, then color in sequence"
                  onClick={onFlag}
                  width={width}
                />
              )}
            </TransitionTween>
          );
        }}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => {
          const data = flag
            ? [
              { index: 0, value: 50 },
              { index: 2, value: 150 },
              { index: 4, value: 50 },
            ]
            : [
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

          const color = (flag ? 'skyblue' : 'lightgray');

          return (
            <TransitionTween
              animations={data
                .map(d => ({
                  key: d.index.toString(),
                  animation: Animations.parallel([
                    Animations.timing({
                      toValue: {
                        opacity: 1,
                        position: barScale(d.index),
                        value: d.value,
                        width: barScale.bandwidth(),
                      },
                    }),
                    Animations.timing({
                      toValue: {
                        color,
                      },
                      duration: 1000,
                    }),
                  ]),
                  data: d.index,
                }))}
              willEnter={style => ({ ...style, color, value: 0, opacity: 0 })}
              willLeave={style => Animations.timing({
                toValue: { ...style, value: 0, opacity: 0 },
              })}
            >
              {interpolatedStyles => (
                <BarChart
                  className={styles.example}
                  data={data}
                  height={height}
                  interpolatedStyles={interpolatedStyles}
                  label="Click to animate position and color at different rates"
                  onClick={onFlag}
                  width={width}
                />
              )}
            </TransitionTween>
          );
        }}
      </ClickableExample>
    </div>
  );
}

Example.propTypes = {
  className: React.PropTypes.string,
};
