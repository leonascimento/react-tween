import classNames from 'classnames';
import React from 'react';
import styles from './Example.scss';
import Tween from './Tween';

export default class Example extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      color: 'red',
      opacity: 0.5,
    };
  }

  render() {
    const { className, ...props } = this.props;
    const { color, opacity } = this.state;

    return (
      <div
        className={classNames(styles.examples, className)}
        {...props}
      >
        <Tween style={{ color, opacity }}>
          {interpolatedStyle => (
            <div
              className={styles.example}
              onClick={() => this.setState({
                color: color === 'red' ? 'yellow' : 'red',
                opacity: opacity === 0.5 ? 1 : 0.5,
              })}
              style={{
                backgroundColor: interpolatedStyle.color,
                opacity: interpolatedStyle.opacity,
              }}
            >
              Click to change opacity and color
            </div>
          )}
        </Tween>
      </div>
    );
  }
}

Example.propTypes = {
  className: React.PropTypes.string,
};
