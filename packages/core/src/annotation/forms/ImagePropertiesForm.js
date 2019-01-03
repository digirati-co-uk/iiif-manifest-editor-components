import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';

import styles from './FormStyles';

class ImagePropertiesForm extends React.Component {
  render() {
    const { classes, target, update } = this.props;
    const imageUrl = target.body ? target.body.id || '' : '';
    const imageServiceUrl =
      target.body && target.body.service ? target.body.service.id || '' : '';
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
            label="Image url"
            className={classes.textField}
            value={imageUrl}
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
          </dl>
        </div>
        <div className={classes.formRow}>
          <TextField
            label="Image service url"
            className={classes.textField}
            value={imageServiceUrl}
            onChange={ev =>
              update(target, 'body.service.id', null, ev.target.value)
            }
            margin="dense"
            variant="outlined"
          />
          <div className={classes.dndUpload}>Upload</div>
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>{12313123}</dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>{123123123}</dd>
            <dt className={classes.fact}>Sizes</dt>
            <dd className={classes.fact}>a,b,c,d</dd>
          </dl>
        </div>
        <div className={classes.formRow}>
          <TextField
            label="Thumbnail url"
            className={classes.textField}
            value={thumbnailUrl}
            onChange={ev =>
              update(target, 'thumbnail.0.id', null, ev.target.value)
            }
            margin="dense"
            variant="outlined"
          />
          <div className={classes.dndUpload}>Upload</div>
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>x</dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>y</dd>
          </dl>
        </div>
        <div className={classes.formRow}>
          <TextField
            label="Thumbnail service url"
            className={classes.textField}
            value={thumbnailServiceUrl}
            onChange={ev =>
              update(target, 'thumbnail.0.service.id', null, ev.target.value)
            }
            margin="dense"
            variant="outlined"
          />
          <div className={classes.dndUpload}>Upload</div>
          <dl className={classes.factSheet}>
            <dt className={classes.fact}>Width</dt>
            <dd className={classes.fact}>x</dd>
            <dt className={classes.fact}>Height</dt>
            <dd className={classes.fact}>y</dd>
            <dt className={classes.fact}>Sizes</dt>
            <dd className={classes.fact}>a,b,c,d</dd>
          </dl>
        </div>
      </div>
    );
  }
}

ImagePropertiesForm.propTypes = {
  /** JSS styles */
  classes: PropTypes.object,
  /** target IIIF Resource */
  target: PropTypes.object,
  /** update function */
  update: PropTypes.func,
};

ImagePropertiesForm.defaultProps = {};

export default withStyles(styles)(ImagePropertiesForm);
