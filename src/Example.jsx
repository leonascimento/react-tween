import classNames from 'classnames';
import React from 'react';
import ClickableExample from './ClickableExample';
import styles from './Example.scss';
import TransitionGroup from './TransitionGroup';
import Tween from './Tween';

export default function Example({ className, ...props }) {
  return (
    <div
      className={classNames(styles.rows, className)}
      {...props}
    >
      <ClickableExample>
        {({ counter, onClick }) => (
          <Tween
            style={{
              color: counter % 2 === 0 ? '#FF851B' : '#7FDBFF',
            }}
          >
            {style => (
              <div className={styles.row}>
                <div
                  className={styles.example}
                  onClick={onClick}
                  style={{ backgroundColor: style.color }}
                >
                  Click to animate
                </div>
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
      <ClickableExample>
        {({ counter, onClick }) => {
          const unfilteredStyles = [
            {
              key: '0',
              style: { opacity: 1 },
            },
            {
              key: '1',
              style: { opacity: 1 },
            },
          ];

          const filteredStyles = unfilteredStyles.slice(0, counter % 2 === 0 ? 1 : 2);

          return (
            <TransitionGroup
              styles={filteredStyles}
              willEnter={style => ({ ...style.style, opacity: 0 })}
              willLeave={style => ({ ...style.style, opacity: 0 })}
            >
              {interpolatedStyles => (
                <div className={styles.row}>
                  {interpolatedStyles.map(style => (
                    <div
                      className={styles.example}
                      key={style.key}
                      onClick={onClick}
                      style={{ opacity: style.style.opacity }}
                    >
                      {style.key === '0' && <span>
                        {counter % 2 === 0 && 'Click to add'}
                        {counter % 2 === 1 && 'Click to remove'}
                      </span>}
                    </div>
                  ))}
                </div>
              )}
            </TransitionGroup>
          );
        }}
      </ClickableExample>
      <ClickableExample>
        {({ counter, onClick }) => (
          <Tween
            style={{
              color: counter % 2 === 0 ? '#FF851B' : '#7FDBFF',
            }}
          >
            {({ color }) => (
              <Tween
                style={{
                  opacity: counter % 2 === 0 ? 1 : 0.5,
                }}
              >
                {({ opacity }) => (
                  <div className={styles.row}>
                    <div
                      className={styles.example}
                      onClick={onClick}
                      style={{
                        backgroundColor: color,
                        opacity,
                      }}
                    >
                      Nested tween
                    </div>
                  </div>
                )}
              </Tween>
            )}
          </Tween>
        )}
      </ClickableExample>
    </div>
  );
}

Example.propTypes = {
  className: React.PropTypes.string,
};
