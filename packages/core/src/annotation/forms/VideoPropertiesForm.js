import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

const styles = theme => ({
  root: {},
});

class VideoPropertiesForm extends React.Component {
  render() {
    const { classes, target } = this.props;
    const videoUrl = target.body ? target.body.id || '' : '';
    return (
      <div className={classes.root}>
        <TextField
          label="Video url"
          className={classes.textField}
          value={videoUrl}
          onChange={ev => update(target, 'body.id', null, ev.target.value)}
          margin="dense"
          variant="outlined"
        />
        <div>
          Video properties:
          <dl>
            <dt>Width</dt>
            <dd>x</dd>
            <dt>Height</dt>
            <dd>y</dd>
            <dt>Height</dt>
            <dd>Duration</dd>
          </dl>
        </div>
        <div>TODO: Dropload</div>
        <div>TODO: use just a placeholder</div>
      </div>
    );
  }
}

VideoPropertiesForm.propTypes = {
  /** JSS styles */
  classes: PropTypes.object,
  /** target IIIF Resource */
  target: PropTypes.object,
  /** update function */
  update: PropTypes.func,
};

VideoPropertiesForm.defaultProps = {};

export default withStyles(styles)(VideoPropertiesForm);
