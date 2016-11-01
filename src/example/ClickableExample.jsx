import React from 'react';

export default class ClickableExample extends React.Component {
  static propTypes = {
    children: React.PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = { flag: false };
  }

  render() {
    const { children } = this.props;
    const { flag } = this.state;

    return children(flag, () => this.setState({ flag: !flag }));
  }
}
