import React from 'react';
import { withStyles, TextField, Button } from '@material-ui/core';

import { getAuthHeader } from './DLCS.utils';

const DEFAULT_SPACE_NAME = 'New Space';

/**
 * @private
 * @class DLCSNewSpaceForm
 * @extends React.Component
 *
 * The component renders the new space form.
 */
export class DLCSNewSpaceForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      session: this.props.session,
      newSpaceName: DEFAULT_SPACE_NAME,
      newSpaceError: null,
    };
  }

  newSpaceNameChanged = ev => {
    this.setState({
      newSpaceName: ev.target.value,
    });
  };

  onAddNewSpace = ev => {
    const self = this;
    const { newSpaceName, session } = self.state;
    ev.preventDefault();
    if (newSpaceName && newSpaceName.length > 0) {
      let headers = getAuthHeader(session);
      fetch(session.dlcs_url + '/spaces', {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          name: newSpaceName,
        }),
      })
        .then(response => response.json())
        .then(response => {
          if (response.hasOwnProperty('message')) {
            throw response.message;
          }
          self.setState({
            newSpaceName: DEFAULT_SPACE_NAME,
            newSpaceError: null,
          });
          if (self.props.callback) {
            self.props.callback(response);
          }
        })
        .catch(err =>
          self.setState({
            newSpaceError: err,
          })
        );
    }
  };

  render() {
    return (
      <form style={this.props.style || {}} onSubmit={this.onAddNewSpace}>
        <TextField
          type="text"
          name="new_space_name"
          value={this.state.newSpaceName}
          onChange={this.newSpaceNameChanged}
          margin="dense"
          variant="outlined"
          labelWidth={150}
        />
        <Button onClick={this.onAddNewSpace}>Add New Space</Button>
        {this.state.newSpaceError ? <div>{this.state.newSpaceError}</div> : ''}
      </form>
    );
  }
}
