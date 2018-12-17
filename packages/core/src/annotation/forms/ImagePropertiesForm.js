import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, TextField } from '@material-ui/core';

const styles = theme => ({
  root: {},
  textField: {},
});

class ImagePropertiesForm extends React.Component {
  render() {
    const { classes, target } = this.props;
    const imageUrl = target.id || '';
    const imageServiceUrl = target.service ? target.service.id || '' : '';
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
        <TextField
          label="Image url"
          className={classes.textField}
          value={imageUrl}
          onChange={ev => update(target, 'body.id', null, ev.target.value)}
          margin="dense"
          variant="outlined"
        />
        <div>
          Image properties:
          <dl>
            <dt>Width</dt>
            <dd>{1231231}</dd>
            <dt>Height</dt>
            <dd>{12312312}</dd>
          </dl>
        </div>
        <div>TODO: Dropload</div>
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
        <div>
          Image service properties:
          <dl>
            <dt>Width</dt>
            <dd>{12313123}</dd>
            <dt>Height</dt>
            <dd>{123123123}</dd>
            <dt>Sizes</dt>
            <dd>a,b,c,d</dd>
          </dl>
        </div>
        <div>TODO: Dropload</div>
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
        <div>TODO: Dropload</div>
        <div>
          Thumbnail properties:
          <dl>
            <dt>Width</dt>
            <dd>x</dd>
            <dt>Height</dt>
            <dd>y</dd>
          </dl>
        </div>
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
        <div>
          Thumbnail properties:
          <dl>
            <dt>Width</dt>
            <dd>x</dd>
            <dt>Height</dt>
            <dd>y</dd>
            <dt>Sizes</dt>
            <dd>a,b,c,d</dd>
          </dl>
        </div>
        <div>TODO: use just a placeholder</div>
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
