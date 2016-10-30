import classNames from 'classnames';
import ClickableExample from './ClickableExample';
import React from 'react';
import styles from './Example.scss';
import Tween from '../tween/Tween';

export default function Example({ className, ...props }) {
  return (
    <div
      className={classNames(styles.examples, className)}
      {...props}
    >
      <ClickableExample>
        {(flag, onFlag) => (
          <Tween style={{ opacity: (flag ? 0.5 : 1) }}>
            {style => (
              <div
                className={styles.example}
                onClick={onFlag}
                style={style}
              >
                Click to animate opacity
              </div>
            )}
          </Tween>
        )}
      </ClickableExample>
    </div>
  );
}
