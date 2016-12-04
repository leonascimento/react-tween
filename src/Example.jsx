import classNames from 'classnames';
import React from 'react';
import ClickableExample from './ClickableExample';
import styles from './Example.scss';
import Tween from './Tween';

export default function Example({ className, ...props }) {
  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      <ClickableExample>
        {({ counter, onClick }) => (
          <Tween
            group={counter}
            style={{
              opacity: counter % 2 === 0 ? 1 : 0.5,
            }}
          >
            {({ opacity }) => (
              <Tween
                group={counter}
                style={{
                  color: counter % 2 === 0 ? 'orange' : 'purple',
                }}
              >
                {({ color }) => (
                  <div
                    className={styles.example}
                    onClick={onClick}
                    style={{
                      backgroundColor: color,
                      opacity,
                    }}
                  >
                    Click me!
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
