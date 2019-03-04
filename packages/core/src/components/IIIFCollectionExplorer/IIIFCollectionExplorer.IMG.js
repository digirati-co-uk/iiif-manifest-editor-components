import * as React from 'react';
import { BrokenImage } from '@material-ui/icons';

// Internal image representation
class IMG extends React.Component {
  state = {
    error: false,
  };

  onError = () => this.setState({ error: true });

  render() {
    const { size, ...props } = this.props;
    return this.state.error ? (
      <div
        style={{
          width: size,
          height: size,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <BrokenImage color="error" />
      </div>
    ) : (
      <div className="loader">
        <img {...props} onError={this.onError} />
      </div>
    );
  }
}

IMG.defaultProps = {
  size: 100,
};

export default IMG;
