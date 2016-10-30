import BarChart from './BarChart';
import classNames from 'classnames';
import ClickableExample from './ClickableExample';
import range from 'lodash.range';
import React from 'react';
import styles from './Example.scss';
import TransitionTween from '../tween/TransitionTween';

export default function Example({ className, ...props }) {
  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      <ClickableExample>
        {(flag, onFlag) => (
          <TransitionTween
            sortKey={d => d}
            styles={range(5)
              .map(k => ({
                key: k.toString(),
                style: {
                  position: k,
                  value: (flag ? [50, 70, 90, 110, 130] : [50, 100, 150, 100, 50])[k],
                },
                data: k,
              }))
            }
            willEnter={() => ({ value: 0 })}
            willLeave={() => ({ value: 0 })}
          >
            {barStyles => (
              <BarChart
                className={styles.example}
                onClick={onFlag}
                styles={barStyles}
              />
            )}
          </TransitionTween>
        )}
      </ClickableExample>
      <ClickableExample>
        {(flag, onFlag) => (
          <TransitionTween
            sortKey={d => d.index}
            styles={[50, 70, 90, 110, 130]
              .map((value, i) => ({ index: i, value }))
              .filter(d => flag ? (d.index % 2 === 1) : true)
              .map((d, i) => ({
                key: d.index.toString(),
                style: {
                  position: i,
                  value: d.value,
                },
                data: d,
              }))
            }
            willEnter={() => ({ value: 0 })}
            willLeave={() => ({ value: 0 })}
          >
            {barStyles => (
              <BarChart
                className={styles.example}
                onClick={onFlag}
                styles={barStyles}
              />
            )}
          </TransitionTween>
        )}
      </ClickableExample>
    </div>
  );
}
