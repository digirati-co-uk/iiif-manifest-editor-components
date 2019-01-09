import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';

import styles from './FormStyles';

const UNKNOWN = '-';

class VideoPropertiesForm extends React.Component {
  render() {
    const { classes, target, update, upload } = this.props;
    const videoUrl = target.body ? target.body.id || '' : '';
    const body = target.body || {};
    const thumbnailProps =
      target.thumbnail && target.thumbnail.length > 0
        ? target.thumbnail[0]
        : {};
    const thumbnailServiceProps =
      target.thumbnail &&
      target.thumbnail.length > 0 &&
      target.thumbnail[0].service
        ? target.thumbnail[0].service
        : {};

    const thumbnailUrl =
      target.thumbnail && target.thumbnail.length
        ? target.thumbnail[0].id || ''
        : '';
    const thumbnailServiceUrl =
      target.thumbnail &&
      target.thumbnail.length &&
      target.thumbnail[0] &&
      target.thumbnail[0].service
        ? target.thumbnail[0].service.id || ''
        : '';
    return (
      <div className={classes.root}>
        <div className={classes.formRow}>
          <TextField
            label="Video url"
            className={upload ? classes.textField : classes.textFieldFullWidth}
            value={videoUrl}
            onChange={ev => update(target, 'body.id', null, ev.target.value)}
            margin="dense"
            variant="outlined"
          />
          {upload && <div className={classes.dndUpload}>Upload</div>}
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>{body.width || UNKNOWN}</dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>{body.height || UNKNOWN}</dd>
            <dt className={classes.fact}>Duration</dt>
            <dd className={classes.fact}>{body.duration || UNKNOWN}s</dd>
          </dl>
        </div>
        <div className={classes.formRow}>
          <TextField
            label="Thumbnail service url"
            className={upload ? classes.textField : classes.textFieldFullWidth}
            value={thumbnailServiceUrl}
            onChange={ev =>
              update(target, 'thumbnail.0.service.id', null, ev.target.value)
            }
            margin="dense"
            variant="outlined"
          />
          {upload && <div className={classes.dndUpload}>Upload</div>}
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>
              {thumbnailServiceProps.width || UNKNOWN}
            </dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>
              {thumbnailServiceProps.height || UNKNOWN}
            </dd>
            <dt className={classes.fact}>Sizes</dt>
            <dd className={classes.fact}>
              {(thumbnailServiceProps.sizes || [])
                .map(size => [size.width, size.height].join(' x '))
                .join('; ')}
            </dd>
          </dl>
        </div>
        <div className={classes.formRow}>
          <TextField
            label="Thumbnail url"
            className={upload ? classes.textField : classes.textFieldFullWidth}
            value={thumbnailUrl}
            onChange={ev =>
              update(target, 'thumbnail.0.id', null, ev.target.value)
            }
            margin="dense"
            variant="outlined"
          />
          {upload && <div className={classes.dndUpload}>Upload</div>}
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>{thumbnailProps.width || UNKNOWN}</dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>{thumbnailProps.height || UNKNOWN}</dd>
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
  /** upload service */
  upload: PropTypes.func,
};

VideoPropertiesForm.defaultProps = {};

export default withStyles(styles)(VideoPropertiesForm);
