import * as React from 'react';
import * as PropTypes from 'prop-types';
import {
  withStyles,
} from '@material-ui/core';
import IIIFTextField from '../../components/fields/IIIFTextField/IIIFTextField';
import styles from './FormStyles';

class TextPropertiesForm extends React.Component {
  render() {
    const { classes, target, update } = this.props;
    const body = target.body ? target.body.value || '' : '';
    const format = target.body ? target.body.format || '' : '';
    return (
      <div className={classes.root}>
        <IIIFTextField
          key={`${target.id}_body_value_input`}
          label="Body Value"
          className={classes.textFieldFullWidth}
          value={body}
          onChange={ev => {
            update(target, 'body.value', null, ev.target.value, () => {
              update(
                target,
                'body.format',
                null,
                /\<[^>]+\>/.test(ev.target.value) ? 'text/html' : 'text/plain'
              );
            });
          }}
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
