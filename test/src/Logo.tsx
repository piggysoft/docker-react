import * as React from 'react';

class Logo extends React.Component<{}, {}> {
  foo;

  componentWillMount() {
    this.foo = new Set();
  }

  render() {
    return (
        <div className="app-logo"></div>
    );
  }
}

export default Logo;
