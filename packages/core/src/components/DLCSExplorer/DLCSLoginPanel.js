import * as React from 'react';
import { withStyles, TextField, Button, Select } from '@material-ui/core';

const style = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    padding: '1rem',
  },
});

/**
 * @private
 * @class DLCSLoginPanel
 * @extends React.Component
 *
 * This component allows the user to specify the DLCS API credentials.
 *
 * The login panel meant to be private at the moment. Only DLCSImageSelector
 * should have access for the DLCSLoginPanel.
 */
class DLCSLoginPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpoint: this.props.endpoint || '',
      customer: this.props.customer || '',
      api_id: this.props.api_id || '',
      api_secret: this.props.api_secret || '',
      error: '',
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(ev) {
    const newState = {};
    newState[ev.target.name] = ev.target.value;
    this.setState(newState);
  }

  onSubmit(ev) {
    ev.preventDefault();
    const self = this;
    this.setState({
      error: '',
    });
    let headers = new Headers();
    const { endpoint, customer } = this.state;
    const url = `${endpoint}/customers/${customer}`.replace(
      '//customers',
      '/customers'
    );
    const auth = btoa(`${this.state.api_id}:${this.state.api_secret}`);
    headers.append('Authorization', `Basic ${auth}`);
    fetch(url, {
      method: 'GET',
      headers: headers,
    })
      .then(response => response.json())
      .then(response => {
        if (
          !response ||
          response.success === 'false' ||
          response.success === false
        ) {
          self.setState({
            error: 'Invalid credentials',
          });
        } else {
          if (self.props.loginCallback) {
            const session = {
              dlcs_url: url,
              auth: auth,
              userName: response.displayName,
            };

            if (localStorage) {
              localStorage.setItem('dlcsSession', JSON.stringify(session));
            }
            self.props.loginCallback(session);
          }
        }
      })
      .catch(err => {
        self.setState({
          error: err,
        });
      });
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <TextField
          label="DLCS Endpoint"
          type="url"
          name="endpoint"
          value={this.state.endpoint}
          onChange={this.onChange}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="DLCS Customer Id"
          type="number"
          min="0"
          name="customer"
          value={this.state.customer}
          onChange={this.onChange}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="DLCS API ID"
          type="text"
          name="api_id"
          value={this.state.api_id}
          onChange={this.onChange}
          margin="dense"
          variant="outlined"
        />
        <TextField
          label="DLCS API Secret"
          type="password"
          name="api_secret"
          value={this.state.api_secret}
          onChange={this.onChange}
          margin="dense"
          variant="outlined"
        />
        <Button onClick={this.onSubmit}>Login</Button>
        {this.state.error !== '' ? (
          <div className="dlcs-login-panel__error">{this.state.error}</div>
        ) : (
          ''
        )}
      </div>
    );
  }
}

export default withStyles(style)(DLCSLoginPanel);
