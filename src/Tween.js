import React from 'react';
import TransitionTween from './TransitionTween';

export default function Tween({ children, style, ...props }) {
  return (
    <TransitionTween
      styles={[{
        key: '0',
        style,
        data: null,
      }]}
      {...props}
    >
      {styles => children(styles[0].style)}
    </TransitionTween>
  );
}

Tween.propTypes = {
  children: React.PropTypes.func,
  style: React.PropTypes.object,
};
