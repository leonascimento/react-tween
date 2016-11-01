import classNames from 'classnames';
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
                Click to animate over 2s
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
                Click to animate with a delay
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
                Click to animate multiple properties
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween
            animation={Animations.sequence(
              (flag ? ['orange', 'skyblue', 'pink'] : ['pink', 'skyblue', 'orange'])
                .map(color => Animations.timing({
                  toValue: { color },
                }))
            )}
          >
            {style => (
              <div
                className={classNames(styles.box, styles.example)}
                onClick={onFlag}
                style={{
                  backgroundColor: style.color,
                }}
              >
                Click to run multiple animations in sequence
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
              { index: 2, value: 100 },
              { index: 4, value: 150 },
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
                  label="Click to change the number of bars"
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
              { index: 3, value: 125 },
              { index: 2, value: 100 },
              { index: 1, value: 75 },
              { index: 4, value: 150 },
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
                  label="Click to rearrange bars"
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
              { index: 3, value: 100 },
              { index: 2, value: 150 },
              { index: 1, value: 100 },
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
                  animation: Animations.sequence([
                    Animations.timing({
                      toValue: {
                        color: 'lightgray',
                        opacity: 1,
                        position: barScale(d.index),
                        width: barScale.bandwidth(),
                      },
                    }),
                    Animations.timing({
                      toValue: {
                        value: d.value,
                      },
                    }),
                  ]),
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
                  label="Click to sequence position and height change"
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
