import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';

const styles = theme => ({
  root: {},
});

class AudioPropertiesForm extends React.Component {
  render() {
    const { classes, target } = this.props;
    const audioId = target.body ? target.body.id || '' : '';
    return (
      <div className={classes.root}>
        <TextField
          label="Audio url"
          className={classes.textField}
          value={id}
          onChange={ev => update(target, 'body.id', null, ev.target.value)}
          margin="dense"
          variant="outlined"
        />
        <div>
          Audio properties:
          <dl>
            <dt>Duration</dt>
            <dd>n</dd>
          </dl>
        </div>
        <div>TODO: Dropload</div>
        <div>TODO: Use just a placeholder</div>
      </div>
    );
  }
}

AudioPropertiesForm.propTypes = {
  /** JSS styles */
  classes: PropTypes.object,
  /** target IIIF Resource */
  target: PropTypes.object,
  /** update function */
  update: PropTypes.func,
};

AudioPropertiesForm.defaultProps = {};

export default withStyles(styles)(AudioPropertiesForm);
