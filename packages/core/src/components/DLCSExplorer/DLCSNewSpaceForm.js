import * as React from 'react';
import { withStyles, TextField, Button } from '@material-ui/core';

import { getAuthHeader } from './DLCS.utils';

const DEFAULT_SPACE_NAME = 'New Space';

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
  },
  form: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  textField: {
    flex: 1,
  },
});

/**
 * @private
 * @class DLCSNewSpaceForm
 * @extends React.Component
 *
 * The component renders the new space form.
 */
class DLCSNewSpaceForm extends React.Component {
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
    const { style, classes } = this.props;
    return (
      <div style={style || {}} className={classes.root}>
        <div className={classes.form}>
          <TextField
            type="text"
            name="new_space_name"
            value={this.state.newSpaceName}
            onChange={this.newSpaceNameChanged}
            margin="dense"
            variant="outlined"
            className={classes.textField}
          />
          <Button onClick={this.onAddNewSpace}>Add New Space</Button>
        </div>
        {this.state.newSpaceError ? <div>{this.state.newSpaceError}</div> : ''}
      </div>
    );
  }
}

export default withStyles(styles)(DLCSNewSpaceForm);
