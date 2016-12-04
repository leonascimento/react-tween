import React from 'react';

export default class ClickableExample extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      counter: 0,
    };
  }

  render() {
    const { children } = this.props;
    const { counter } = this.state;

    return children({
      counter,
      onClick: () => this.setState({ counter: counter + 1 }),
    });
  }
}
