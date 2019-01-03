import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';

import styles from './FormStyles';

class VideoPropertiesForm extends React.Component {
  render() {
    const { classes, target, update } = this.props;
    const videoUrl = target.body ? target.body.id || '' : '';
    return (
      <div className={classes.root}>
        <div className={classes.formRow}>
          <TextField
            label="Video url"
            className={classes.textField}
            value={videoUrl}
            onChange={ev => update(target, 'body.id', null, ev.target.value)}
            margin="dense"
            variant="outlined"
          />
          <div className={classes.dndUpload}>Upload</div>
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>{1231231}</dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>{12312312}</dd>
            <dt className={classes.fact}>Duration</dt>
            <dd className={classes.fact}>{12312312}</dd>
          </dl>
        </div>
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
