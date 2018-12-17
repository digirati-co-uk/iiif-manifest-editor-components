import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, Button, TextField } from '@material-ui/core';

const styles = theme => ({
  root: {},
});

class TextPropertiesForm extends React.Component {
  render() {
    const { classes, target } = this.props;
    return (
      <div className={classes.root}>
        <div>
          <Button>Plain Text</Button>
          <Button>Html</Button>
        </div>
        <TextField
          label="Video url"
          className={classes.textField}
          value={target.value}
          onChange={ev => update(target, 'body.value', null, ev.target.value)}
          margin="dense"
          variant="outlined"
          multiline={true}
        />
      </div>
    );
  }
}

TextPropertiesForm.propTypes = {
  /** JSS styles */
  classes: PropTypes.object,
  /** target IIIF Resource */
  target: PropTypes.object,
  /** update function */
  update: PropTypes.func,
};

TextPropertiesForm.defaultProps = {};

export default withStyles(styles)(TextPropertiesForm);
